import { Page } from "@playwright/test";
import { FormCheckout } from "../interfaces/form.interface";

export class PurchaseFlow {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async clickProductTitle(productId: string) {
        await this.page.locator(`[data-test="item-${productId}-title-link"]`).click();
    }

    async getProductName(): Promise<string> {
        return this.page.locator('[data-test="inventory-item-name"]').innerText();
    }

    async getProductDescription(): Promise<string> {
        return this.page.locator('[data-test="inventory-item-desc"]').innerText();
    }

    async getProductPrice(): Promise<number> {
        const priceText = await this.page.locator('[data-test="inventory-item-price"]').innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    async addProductToCart() {
        await this.page.locator('[data-test="add-to-cart"]').click();
    }

    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    async startCheckout() {
        await this.page.locator('[data-test="checkout"]').click();
    }

    async fillCheckoutForm(data: FormCheckout) {
        await this.page.locator('[data-test="firstName"]').fill(data.firstName);
        await this.page.locator('[data-test="lastName"]').fill(data.lastName);
        await this.page.locator('[data-test="postalCode"]').fill(data.zipCode);
    }

    async areCheckoutFormFieldsVisible(): Promise<boolean> {
        const firstNameVisible = await this.page.locator('[data-test="firstName"]').isVisible();
        const lastNameVisible = await this.page.locator('[data-test="lastName"]').isVisible();
        const postalCodeVisible = await this.page.locator('[data-test="postalCode"]').isVisible();

        return firstNameVisible && lastNameVisible && postalCodeVisible;
    }

    async areCheckoutFormFieldsEditable(): Promise<boolean> {
        const firstNameEditable = await this.page.locator('[data-test="firstName"]').isEditable();
        const lastNameEditable = await this.page.locator('[data-test="lastName"]').isEditable();
        const postalCodeEditable = await this.page.locator('[data-test="postalCode"]').isEditable();

        return firstNameEditable && lastNameEditable && postalCodeEditable;
    }

    async continueToCheckoutOverview() {
        await this.page.locator('[data-test="continue"]').click();
    }

    async isContinueButtonVisible(): Promise<boolean> {
        return this.page.locator('[data-test="continue"]').isVisible();
    }

    async isContinueButtonEnabled(): Promise<boolean> {
        return this.page.locator('[data-test="continue"]').isEnabled();
    }

    async cancelCheckout(): Promise<void> {
        await this.page.locator('[data-test="cancel"]').click();
    }

    async finishCheckout() {
        await this.page.locator('[data-test="finish"]').click();
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async getConfirmationMessage(): Promise<string> {
        const confirmationMessageElement = this.page.locator('[data-test="complete-header"]');
        const message = await confirmationMessageElement.textContent();
        if (message === null) {
            throw new Error('Mensagem de confirmação não encontrada');
        }
        return message;
    }

    async backToHome() {
        await this.page.locator('[data-test="back-to-products"]').click();
    }

    async getErrorMessage(): Promise<string> {
        return this.page.locator('[data-test="error"]').innerText();
    }

}