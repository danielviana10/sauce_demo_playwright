import { Page } from "@playwright/test";
import { FormCheckout } from "../interfaces/form.interface";
import { InventoryItem } from "../interfaces/inventory.interface";
import { getInventoryItems } from "../utils/getInventoryItems";

export class PurchaseFlow {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Clica no título de um item para acessar sua página de detalhes.
     * @param itemId - O ID do item.
     */
    async clickItemTitle(item: InventoryItem) {
        // Constrói o seletor correto para o link do título do item
        const itemTitleSelector = `[data-test="item-${item.id}-title-link"]`;

        // Clica no link do título do item
        await this.page.locator(itemTitleSelector).click();
    }

    /**
         * Obtém o nome do item na página de detalhes.
         * @returns O nome do item.
    */
    async getItemDetailsName(): Promise<string> {
        return this.page.locator('[data-test="inventory-item-name"]').innerText();
    }

    /**
         * Obtém a descrição do item na página de detalhes.
         * @returns A descrição do item.
    */
    async getItemDetailsDescription(): Promise<string> {
        return this.page.locator('[data-test="inventory-item-desc"]').innerText();
    }

    /**
         * Obtém o preço do item na página de detalhes.
         * @returns O preço do item.
    */
    async getItemDetailsPrice(): Promise<number> {
        const priceText = await this.page.locator('[data-test="inventory-item-price"]').innerText();
        return parseFloat(priceText.replace('$', ''));
    }

    /**
         * Obtém o src da imagem do item na página de detalhes.
         * @returns O src da imagem.
    */
    async getItemDetailsImageSrc(): Promise<string> {
        // Usa um seletor genérico para a imagem do item
        const imageElement = this.page.locator('[data-test^="item-"][data-test$="-img"]');

        // Espera o elemento estar visível antes de interagir com ele
        await imageElement.waitFor({ state: 'visible' });

        // Obtém o atributo src
        const src = await imageElement.getAttribute('src');

        // Retorna o src ou uma string vazia se src for null
        return src || '';
    }

    /**
        * Adiciona o item atual ao carrinho.
    */
    async addItemToCart() {
        await this.page.locator('[data-test="add-to-cart"]').click();
    }

    /**
        * Navega para a página do carrinho.
    */
    async goToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    /**
        * Inicia o processo de checkout.
    */
    async startCheckout() {
        await this.page.locator('[data-test="checkout"]').click();
    }

    /**
         * Preenche o formulário de checkout com os dados fornecidos.
         * @param data - Os dados do formulário de checkout.
    */
    async fillCheckoutForm(data: FormCheckout) {
        await this.page.locator('[data-test="firstName"]').fill(data.firstName);
        await this.page.locator('[data-test="lastName"]').fill(data.lastName);
        await this.page.locator('[data-test="postalCode"]').fill(data.zipCode);
    }

    /**
         * Verifica se os campos do formulário de checkout estão visíveis.
         * @returns `true` se todos os campos estiverem visíveis, caso contrário, `false`.
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
    */
    async areCheckoutFormFieldsEditable(): Promise<boolean> {
        const firstNameEditable = await this.page.locator('[data-test="firstName"]').isEditable();
        const lastNameEditable = await this.page.locator('[data-test="lastName"]').isEditable();
        const postalCodeEditable = await this.page.locator('[data-test="postalCode"]').isEditable();

        return firstNameEditable && lastNameEditable && postalCodeEditable;
    }

    /**
        * Continua para a página de resumo do checkout.
    */
    async continueToCheckoutOverview() {
        await this.page.locator('[data-test="continue"]').click();
    }

    /**
         * Verifica se o botão "Continue" está visível.
         * @returns `true` se o botão estiver visível, caso contrário, `false`.
    */
    async isContinueButtonVisible(): Promise<boolean> {
        return this.page.locator('[data-test="continue"]').isVisible();
    }

    /**
         * Verifica se o botão "Continue" está habilitado.
         * @returns `true` se o botão estiver habilitado, caso contrário, `false`.
    */
    async isContinueButtonEnabled(): Promise<boolean> {
        return this.page.locator('[data-test="continue"]').isEnabled();
    }

    /**
        * Cancela o processo de checkout.
    */
    async cancelCheckout(): Promise<void> {
        await this.page.locator('[data-test="cancel"]').click();
    }

    /**
        * Finaliza o processo de checkout.
    */
    async finishCheckout() {
        await this.page.locator('[data-test="finish"]').click();
    }

    /**
         * Obtém a URL atual da página.
         * @returns A URL atual.
    */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
         * Obtém a mensagem de confirmação após a finalização do checkout.
         * @returns A mensagem de confirmação.
         * @throws Lança um erro se a mensagem de confirmação não for encontrada.
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
    */
    async backToHome() {
        await this.page.locator('[data-test="back-to-products"]').click();
    }

    /**
         * Obtém a mensagem de erro exibida durante o checkout.
         * @returns A mensagem de erro.
    */
    async getErrorMessage(): Promise<string> {
        return this.page.locator('[data-test="error"]').innerText();
    }

    /**
         * Obtém os itens da lista de inventário.
         * @returns Um array de objetos contendo nome, descrição, preço e ID dos itens.
    */
    async getInventoryItems(): Promise<InventoryItem[]> {
        return getInventoryItems(this.page);
    }
}