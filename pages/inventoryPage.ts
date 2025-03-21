import { Page } from "@playwright/test";
import { InventoryItem } from "../interfaces/inventory.interface";
import { getInventoryItems } from "../utils/getInventoryItems";

export class InventoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Obtém os itens da lista de inventário.
     * @returns Um array de objetos contendo nome, descrição, preço e ID dos itens.
     */
    async getInventoryItems(): Promise<InventoryItem[]> {
        return getInventoryItems(this.page);
    }

    /**
     * Gera o data-test do botão de adicionar ou remover item do carrinho.
     * @param item - O item do inventário.
     * @param action - A ação desejada ('add' ou 'remove').
     * @returns O data-test do botão.
     */
    private generateButtonDataTest(item: InventoryItem, action: 'add' | 'remove') {
        const actionPrefix = action === 'add' ? 'add-to-cart' : 'remove';
        const itemNameSlug = item.name.toLowerCase().replace(/ /g, '-');
        return `${actionPrefix}-${itemNameSlug}`;
    }

    /**
     * Adiciona um item ao carrinho.
     * @param item - O item a ser adicionado.
     */
    async addItemToCart(item: InventoryItem) {
        const addButtonDataTest = this.generateButtonDataTest(item, 'add');
        const removeButtonDataTest = this.generateButtonDataTest(item, 'remove');

        // Espera o botão de adicionar ao carrinho estar visível
        await this.page.waitForSelector(`[data-test="${addButtonDataTest}"]`, { state: 'visible' });
        await this.page.click(`[data-test="${addButtonDataTest}"]`);

        // Espera o botão de remover aparecer (indicando que o item foi adicionado ao carrinho)
        await this.page.waitForSelector(`[data-test="${removeButtonDataTest}"]`, { state: 'visible' });
    }

    /**
     * Remove um item do carrinho.
     * @param item - O item a ser removido.
     */
    async removeItemFromCart(item: InventoryItem) {
        const removeButtonDataTest = this.generateButtonDataTest(item, 'remove');

        // Espera o botão de remover estar visível
        await this.page.waitForSelector(`[data-test="${removeButtonDataTest}"]`, { state: 'visible' });
        await this.page.click(`[data-test="${removeButtonDataTest}"]`);
    }

    /**
     * Obtém o nome de um item na lista de inventário.
     * @param item - O item do inventário.
     * @returns O nome do item.
     */
    async getItemName(item: InventoryItem): Promise<string> {
        return this.page.locator(`[data-test="item-${item.id}-title-link"] [data-test="inventory-item-name"]`).innerText();
    }

    /**
     * Obtém a descrição de um item na lista de inventário.
     * @param item - O item do inventário.
     * @returns A descrição do item.
     */
    async getItemDescription(item: InventoryItem): Promise<string> {
        return this.page.locator(`[data-test="item-${item.id}-title-link"] >> xpath=../..//div[@data-test="inventory-item-desc"]`).innerText();
    }

    /**
     * Obtém o preço de um item na lista de inventário.
     * @param item - O item do inventário.
     * @returns O preço do item.
     */
    async getItemPrice(item: InventoryItem): Promise<number> {
        const priceText = await this.page.locator(`[data-test="item-${item.id}-title-link"] >> xpath=../..//div[@data-test="inventory-item-price"]`).innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    /**
     * Obtém o nome de um item no carrinho.
     * @param item - O item do inventário.
     * @returns O nome do item no carrinho.
     */
    async getCartItemName(item: InventoryItem): Promise<string> {
        return this.page.locator(`.cart_item:has-text("${item.name}") [data-test="inventory-item-name"]`).innerText();
    }

    /**
     * Obtém a descrição de um item no carrinho.
     * @param item - O item do inventário.
     * @returns A descrição do item no carrinho.
     */
    async getCartItemDescription(item: InventoryItem): Promise<string> {
        return this.page.locator(`.cart_item:has-text("${item.name}") [data-test="inventory-item-desc"]`).innerText();
    }

    /**
     * Obtém o preço de um item no carrinho.
     * @param item - O item do inventário.
     * @returns O preço do item no carrinho.
     */
    async getCartItemPrice(item: InventoryItem): Promise<number> {
        const priceText = await this.page.locator(`.cart_item:has-text("${item.name}") [data-test="inventory-item-price"]`).innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    /**
     * Obtém a quantidade de itens no carrinho.
     * @returns A quantidade de itens no carrinho.
     */
    async getCartItemCount() {
        const cartCount = await this.page.locator('.shopping_cart_badge').textContent();
        return cartCount ? parseInt(cartCount) : 0;
    }

    /**
     * Navega para a página do carrinho.
     */
    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    /**
     * Verifica se um item está no carrinho.
     * @param item - O item a ser verificado.
     * @returns `true` se o item estiver no carrinho, caso contrário, `false`.
     */
    async checkCartItem(item: InventoryItem): Promise<boolean> {
        const itemInCart = await this.page.locator(`.cart_item:has-text("${item.name}")`).isVisible();
        return itemInCart;
    }

    /**
     * Ordena os itens da lista de inventário.
     * @param option - A opção de ordenação ('az', 'za', 'lohi', 'hilo').
     */
    async sortItems(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.page.waitForSelector('[data-test="product-sort-container"]', { state: 'visible' });
        await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
    }

    /**
     * Obtém os nomes de todos os itens na lista de inventário.
     * @returns Um array com os nomes dos itens.
     */
    async getItemNames() {
        const itemNames = await this.page.locator('.inventory_item_name').allTextContents();
        return itemNames;
    }

    /**
     * Obtém os preços de todos os itens na lista de inventário.
     * @returns Um array com os preços dos itens.
     */
    async getItemPrices(): Promise<number[]> {
        const itemPrices = await this.page.locator('.inventory_item_price').allTextContents();
        return itemPrices.map(price => parseFloat(price.replace('$', '')));
    }
}