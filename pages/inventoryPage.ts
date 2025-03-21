import { Page } from "@playwright/test";

export class InventoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navega para a página de inventário
    async navigate() {
        await this.page.goto("https://www.saucedemo.com/inventory.html");
    }

    // Adiciona um item ao carrinho pelo nome do produto
    async addItemToCart(itemName: string) {
        const buttonId = `#add-to-cart-${itemName.toLowerCase().replace(/ /g, '-')}`;
        await this.page.click(buttonId);
    }

    // Remove um item do carrinho pelo nome do produto
    async removeItemFromCart(itemName: string) {
        const buttonId = `#remove-${itemName.toLowerCase().replace(/ /g, '-')}`;
        await this.page.waitForSelector(buttonId, { state: 'visible' });
        await this.page.click(buttonId);
      }

    // Verifica se o ícone do carrinho mostra a quantidade correta de itens
    async getCartItemCount() {
        const cartCount = await this.page.locator('.shopping_cart_badge').textContent();
        return cartCount ? parseInt(cartCount) : 0;
    }

    // Navega para a página do carrinho
    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    // Verifica se um item está no carrinho
    async checkCartItem(itemName: string): Promise<boolean> {
        const itemInCart = await this.page.locator(`.cart_item:has-text("${itemName}")`).isVisible();
        return itemInCart;
      }
}