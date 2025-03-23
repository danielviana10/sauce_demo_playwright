import { Page } from "@playwright/test";
import { InventoryItem } from "../interfaces/inventory.interface";
import { getInventoryItems } from "../utils/getInventoryItems";

/**
 * Página do Carrinho da aplicação Sauce Demo.
 * Esta classe contém métodos para interagir com a página do carrinho.
 */
export class CartPage {
    private page: Page;

    /**
     * Construtor da classe CartPage.
     * @param page - Instância da página do Playwright.
     */
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
     * Gera o `data-test` do botão de adicionar ou remover item do carrinho.
     * @private
     * @param item - O item do inventário.
     * @param action - A ação desejada ('add' ou 'remove').
     * @returns O `data-test` do botão.
     * @example
     * const cartPage = new CartPage(page);
     * const buttonDataTest = cartPage.generateButtonDataTest(item, 'add');
     * console.log(buttonDataTest); // Exemplo: "add-to-cart-sauce-labs-backpack"
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
    async getCartItemCount(): Promise<number> {
        const cartCount = await this.page.locator('.shopping_cart_badge').textContent();
        return cartCount ? parseInt(cartCount) : 0;
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
}