import { Page } from "@playwright/test";
import { InventoryItem } from "../interfaces/inventory.interface";
import { getInventoryItems } from "../utils/getInventoryItems";
import { compareImages } from "../utils/imageComparator";

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
        * Verifica se o botão "Remove" está visível para um item.
        * @param item - O item do inventário.
        * @returns `true` se o botão "Remove" estiver visível, caso contrário, `false`.
    */
    async isRemoveButtonVisible(item: InventoryItem): Promise<boolean> {
        const removeButtonDataTest = this.generateButtonDataTest(item, 'remove');
        return this.page.locator(`[data-test="${removeButtonDataTest}"]`).isVisible();
    }

    /**
         * Verifica se o botão "Add to cart" está visível para um item.
         * @param item - O item do inventário.
         * @returns `true` se o botão "Add to cart" estiver visível, caso contrário, `false`.
     */
    async isAddToCartButtonVisible(item: InventoryItem): Promise<boolean> {
        const addButtonDataTest = this.generateButtonDataTest(item, 'add');
        return this.page.locator(`[data-test="${addButtonDataTest}"]`).isVisible();
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
        * Navega para a página do carrinho.
    */
    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    /**
        * Obtém o valor selecionado no dropdown de ordenação.
        * @returns O valor selecionado no dropdown.
    */
    async getSelectedSortOption(): Promise<string> {
        const sortContainer = this.page.locator('[data-test="product-sort-container"]');
        await sortContainer.waitFor({ state: 'visible' }); // Espera o dropdown estar visível
        return sortContainer.inputValue(); // Retorna o valor selecionado
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