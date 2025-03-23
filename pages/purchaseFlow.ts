import { Page } from "@playwright/test";
import { FormCheckout } from "../interfaces/form.interface";
import { InventoryItem } from "../interfaces/inventory.interface";
import { getInventoryItems } from "../utils/getInventoryItems";

/**
 * Fluxo de Compra da aplicação Sauce Demo.
 * Esta classe contém métodos para interagir com o fluxo de compra, como adicionar itens ao carrinho,
 * preencher o formulário de checkout, finalizar a compra e validar mensagens de confirmação.
 */
export class PurchaseFlow {
    private page: Page;

    /**
     * Construtor da classe PurchaseFlow.
     * @param page - Instância da página do Playwright.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Clica no título de um item para acessar sua página de detalhes.
     * @param item - O item do inventário.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const item = { id: 1, name: 'Sauce Labs Backpack', price: 29.99 };
     * await purchaseFlow.clickItemTitle(item);
     */
    async clickItemTitle(item: InventoryItem) {
        const itemTitleSelector = `[data-test="item-${item.id}-title-link"]`;
        await this.page.locator(itemTitleSelector).click();
    }

    /**
     * Obtém o nome do item na página de detalhes.
     * @returns O nome do item.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const itemName = await purchaseFlow.getItemDetailsName();
     * console.log(itemName);
     */
    async getItemDetailsName(): Promise<string> {
        return this.page.locator('[data-test="inventory-item-name"]').innerText();
    }

    /**
     * Obtém a descrição do item na página de detalhes.
     * @returns A descrição do item.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const itemDescription = await purchaseFlow.getItemDetailsDescription();
     * console.log(itemDescription);
     */
    async getItemDetailsDescription(): Promise<string> {
        return this.page.locator('[data-test="inventory-item-desc"]').innerText();
    }

    /**
     * Obtém o preço do item na página de detalhes.
     * @returns O preço do item.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const itemPrice = await purchaseFlow.getItemDetailsPrice();
     * console.log(itemPrice);
     */
    async getItemDetailsPrice(): Promise<number> {
        const priceText = await this.page.locator('[data-test="inventory-item-price"]').innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    /**
     * Obtém o src da imagem do item na página de detalhes.
     * @returns O src da imagem.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const imageSrc = await purchaseFlow.getItemDetailsImageSrc();
     * console.log(imageSrc);
     */
    async getItemDetailsImageSrc(): Promise<string> {
        const imageElement = this.page.locator('[data-test^="item-"][data-test$="-img"]');
        await imageElement.waitFor({ state: 'visible' });
        const src = await imageElement.getAttribute('src');
        return src || '';
    }

    /**
     * Adiciona o item atual ao carrinho.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.addItemToCart();
     */
    async addItemToCart() {
        await this.page.locator('[data-test="add-to-cart"]').click();
    }

    /**
     * Navega para a página do carrinho.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.goToCart();
     */
    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    /**
     * Inicia o processo de checkout.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.startCheckout();
     */
    async startCheckout() {
        await this.page.locator('[data-test="checkout"]').click();
    }

    /**
     * Preenche o formulário de checkout com os dados fornecidos.
     * @param data - Os dados do formulário de checkout.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.fillCheckoutForm({ firstName: 'John', lastName: 'Doe', zipCode: '12345' });
     */
    async fillCheckoutForm(data: FormCheckout) {
        await this.page.locator('[data-test="firstName"]').fill(data.firstName);
        await this.page.locator('[data-test="lastName"]').fill(data.lastName);
        await this.page.locator('[data-test="postalCode"]').fill(data.zipCode);
    }

    /**
     * Verifica se os campos do formulário de checkout estão visíveis.
     * @returns `true` se todos os campos estiverem visíveis, caso contrário, `false`.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const areFieldsVisible = await purchaseFlow.areCheckoutFormFieldsVisible();
     * console.log(areFieldsVisible);
     */
    async areCheckoutFormFieldsVisible(): Promise<boolean> {
        const firstNameVisible = await this.page.locator('[data-test="firstName"]').isVisible();
        const lastNameVisible = await this.page.locator('[data-test="lastName"]').isVisible();
        const postalCodeVisible = await this.page.locator('[data-test="postalCode"]').isVisible();
        return firstNameVisible && lastNameVisible && postalCodeVisible;
    }

    /**
     * Verifica se os campos do formulário de checkout estão editáveis.
     * @returns `true` se todos os campos estiverem editáveis, caso contrário, `false`.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const areFieldsEditable = await purchaseFlow.areCheckoutFormFieldsEditable();
     * console.log(areFieldsEditable);
     */
    async areCheckoutFormFieldsEditable(): Promise<boolean> {
        const firstNameEditable = await this.page.locator('[data-test="firstName"]').isEditable();
        const lastNameEditable = await this.page.locator('[data-test="lastName"]').isEditable();
        const postalCodeEditable = await this.page.locator('[data-test="postalCode"]').isEditable();
        return firstNameEditable && lastNameEditable && postalCodeEditable;
    }

    /**
     * Continua para a página de resumo do checkout.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.continueToCheckoutOverview();
     */
    async continueToCheckoutOverview() {
        await this.page.locator('[data-test="continue"]').click();
    }

    /**
     * Verifica se o botão "Continue" está visível.
     * @returns `true` se o botão estiver visível, caso contrário, `false`.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const isContinueVisible = await purchaseFlow.isContinueButtonVisible();
     * console.log(isContinueVisible);
     */
    async isContinueButtonVisible(): Promise<boolean> {
        return this.page.locator('[data-test="continue"]').isVisible();
    }

    /**
     * Verifica se o botão "Continue" está habilitado.
     * @returns `true` se o botão estiver habilitado, caso contrário, `false`.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const isContinueEnabled = await purchaseFlow.isContinueButtonEnabled();
     * console.log(isContinueEnabled);
     */
    async isContinueButtonEnabled(): Promise<boolean> {
        return this.page.locator('[data-test="continue"]').isEnabled();
    }

    /**
     * Cancela o processo de checkout.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.cancelCheckout();
     */
    async cancelCheckout(): Promise<void> {
        await this.page.locator('[data-test="cancel"]').click();
    }

    /**
     * Finaliza o processo de checkout.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.finishCheckout();
     */
    async finishCheckout() {
        await this.page.locator('[data-test="finish"]').click();
    }

    /**
     * Obtém a URL atual da página.
     * @returns A URL atual.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const currentUrl = await purchaseFlow.getCurrentUrl();
     * console.log(currentUrl);
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Obtém a mensagem de confirmação após a finalização do checkout.
     * @returns A mensagem de confirmação.
     * @throws Lança um erro se a mensagem de confirmação não for encontrada.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const confirmationMessage = await purchaseFlow.getConfirmationMessage();
     * console.log(confirmationMessage);
     */
    async getConfirmationMessage(): Promise<string> {
        const confirmationMessageElement = this.page.locator('[data-test="complete-header"]');
        const message = await confirmationMessageElement.textContent();
        if (message === null) {
            throw new Error('Mensagem de confirmação não encontrada');
        }
        return message;
    }

    /**
     * Retorna para a página inicial de produtos.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * await purchaseFlow.backToHome();
     */
    async backToHome() {
        await this.page.locator('[data-test="back-to-products"]').click();
    }

    /**
     * Obtém a mensagem de erro exibida durante o checkout.
     * @returns A mensagem de erro.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const errorMessage = await purchaseFlow.getErrorMessage();
     * console.log(errorMessage);
     */
    async getErrorMessage(): Promise<string> {
        return this.page.locator('[data-test="error"]').innerText();
    }

    /**
     * Obtém os itens da lista de inventário.
     * @returns Um array de objetos contendo nome, descrição, preço e ID dos itens.
     * @example
     * const purchaseFlow = new PurchaseFlow(page);
     * const items = await purchaseFlow.getInventoryItems();
     * console.log(items);
     */
    async getInventoryItems(): Promise<InventoryItem[]> {
        return getInventoryItems(this.page);
    }
}