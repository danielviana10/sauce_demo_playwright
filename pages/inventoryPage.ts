import { Page } from "@playwright/test";
import { InventoryItem } from "../interfaces/inventory.interface";

export class InventoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    private generateButtonId(item: InventoryItem, action: 'add' | 'remove') {
        const actionId = action === 'add' ? 'add-to-cart' : 'remove';
        return `#${actionId}-${item.id.toLowerCase().replace(/ /g, '-')}`;
    }

    async addItemToCart(item: InventoryItem) {
        const addButtonId = this.generateButtonId(item, 'add');
        const removeButtonId = this.generateButtonId(item, 'remove');

        await this.page.click(addButtonId);
        await this.page.waitForSelector(removeButtonId, { state: 'visible' });
    }

    async getProductName(productId: string): Promise<string> {
        return this.page.locator(`[data-test="item-${productId}-title-link"] [data-test="inventory-item-name"]`).innerText();
    }

    async getProductDescription(productId: string): Promise<string> {
        return this.page.locator(`[data-test="item-${productId}-title-link"] >> xpath=../..//div[@data-test="inventory-item-desc"]`).innerText();
    }

    async getProductPrice(productId: string): Promise<number> {
        const priceText = await this.page.locator(`[data-test="item-${productId}-title-link"] >> xpath=../..//div[@data-test="inventory-item-price"]`).innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    async removeItemFromCart(item: InventoryItem) {
        const removeButtonId = this.generateButtonId(item, 'remove');
        await this.page.waitForSelector(removeButtonId, { state: 'visible' });
        await this.page.click(removeButtonId);
    }

    async getCartItemCount() {
        const cartCount = await this.page.locator('.shopping_cart_badge').textContent();
        return cartCount ? parseInt(cartCount) : 0;
    }

    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    async checkCartItem(item: InventoryItem): Promise<boolean> {
        const itemInCart = await this.page.locator(`.cart_item:has-text("${item.name}")`).isVisible();
        return itemInCart;
    }

    async sortItems(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.page.waitForSelector('[data-test="product-sort-container"]', { state: 'visible' });
        await this.page.locator('[data-test="product-sort-container"]').selectOption(option);
    }

    async getItemNames() {
        const itemNames = await this.page.locator('.inventory_item_name').allTextContents();
        return itemNames;
    }

    async getItemPrices(): Promise<number[]> {
        const itemPrices = await this.page.locator('.inventory_item_price').allTextContents();
        return itemPrices.map(price => parseFloat(price.replace('$', '')));
    }
}
