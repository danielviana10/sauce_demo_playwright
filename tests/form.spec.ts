import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginCredentials } from '../interfaces/login.interface';
import { PurchaseFlow } from '../pages/purchaseFlow';
import { InventoryPage } from '../pages/inventoryPage';
import { FormCheckout } from '../interfaces/form.interface';

test.describe('Fluxo de Compra - Testes de Formulário de Checkout', () => {
    let loginPage: LoginPage;
    let purchaseFlow: PurchaseFlow;
    let inventoryPage: InventoryPage;

    // Dados do formulário de checkout
    const data: FormCheckout = {
        firstName: 'Daniel',
        lastName: 'Viana',
        zipCode: '06406150',
    };

    /**
     * Executa antes de cada teste: inicializa as páginas, faz login e adiciona um item ao carrinho.
     */
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        purchaseFlow = new PurchaseFlow(page);
        inventoryPage = new InventoryPage(page);

        // Navega para a página de login
        await loginPage.navigate();

        // Credenciais de login válidas
        const credentials: LoginCredentials = {
            username: "standard_user",
            password: "secret_sauce",
        };

        // Realiza o login
        await loginPage.login(credentials);

        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0]; // Usa o primeiro item da lista

        // Adiciona o item ao carrinho
        await inventoryPage.addItemToCart(item);

        // Navega para o carrinho
        await inventoryPage.goToCart();

        // Inicia o processo de checkout
        await purchaseFlow.startCheckout();
    });

    /**
     * Teste: Validar botão "Continue" no formulário de checkout
     */
    test('Validar botão "Continue" no formulário de checkout', async () => {
        //  Verifica se o botão "Continue" está visível.
        expect(await purchaseFlow.isContinueButtonVisible()).toBeTruthy();

        // Verifica se o botão "Continue" está habilitado.
        expect(await purchaseFlow.isContinueButtonEnabled()).toBeTruthy();
    });

    /**
     * Teste: Validar envio do formulário com todos os campos preenchidos
     */
    test('Validar envio do formulário com todos os campos preenchidos', async () => {
        // Preenche o formulário de checkout com todos os campos.
        await purchaseFlow.fillCheckoutForm(data);

        // Continua para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a URL atual é a página de resumo do checkout.
        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/checkout-step-two.html');
    });

    /**
     * Teste: Validar mensagens de erro ao enviar formulário vazio
     */
    test('Validar mensagens de erro ao enviar formulário vazio', async () => {
        // Tenta continuar para a página de resumo do checkout sem preencher o formulário.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    /**
     * Teste: Formulário apenas com o primeiro nome
     */
    test('Formulário apenas com o primeiro nome', async () => {
        // Preenche apenas o campo "First Name" no formulário de checkout.
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: '', zipCode: '' });

        // Tenta continuar para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Last Name is required');
    });

    /**
     * Teste: Formulário apenas com o sobrenome
     */
    test('Formulário apenas com o sobrenome', async () => {
        // Preenche apenas o campo "Last Name" no formulário de checkout.
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: data.lastName, zipCode: '' });

        // Tenta continuar para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    /**
     * Teste: Formulário apenas com o código postal
     */
    test('Formulário apenas com o código postal', async () => {
        // Preenche apenas o campo "Zip Code" no formulário de checkout.
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: '', zipCode: data.zipCode });

        // Tenta continuar para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    /**
     * Teste: Formulário apenas com o primeiro nome e sobrenome
     */
    test('Formulário apenas com o primeiro nome e sobrenome', async () => {
        // Preenche os campos "First Name" e "Last Name" no formulário de checkout.
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: data.lastName, zipCode: '' });

        // Tenta continuar para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Postal Code is required');
    });

    /**
     * Teste: Formulário apenas com o primeiro nome e código postal
     */
    test('Formulário apenas com o primeiro nome e código postal', async () => {
        // Preenche os campos "First Name" e "Zip Code" no formulário de checkout.
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: '', zipCode: data.zipCode });

        // Tenta continuar para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Last Name is required');
    });

    /**
     * Teste: Formulário apenas com o sobrenome e código postal
     */
    test('Formulário apenas com o sobrenome e código postal', async () => {
        // Preenche os campos "Last Name" e "Zip Code" no formulário de checkout.
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: data.lastName, zipCode: data.zipCode });

        // Tenta continuar para a página de resumo do checkout.
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida.
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });
});