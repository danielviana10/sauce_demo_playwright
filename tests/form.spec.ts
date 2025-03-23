import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginCredentials } from '../interfaces/login.interface';
import { PurchaseFlow } from '../pages/purchaseFlow';
import { InventoryPage } from '../pages/inventoryPage';
import { FormCheckout } from '../interfaces/form.interface';
import { CartPage } from '../pages/cartPage';

/**
 * Testes de Formulário de Checkout para o usuário `standard_user`.
 * Este conjunto de testes verifica o comportamento do formulário de checkout, incluindo validação de campos,
 * envio do formulário e mensagens de erro.
 */
test.describe('Fluxo de Compra - Testes de Formulário de Checkout', () => {
    let loginPage: LoginPage;
    let purchaseFlow: PurchaseFlow;
    let inventoryPage: InventoryPage;

    /**
     * Credenciais de login válidas para o usuário `standard_user`.
     */
    const credentials: LoginCredentials = {
        username: "standard_user",
        password: "secret_sauce",
    };

    /**
     * Dados do formulário de checkout.
     */
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
     * Teste: Validar botão "Continue" no formulário de checkout.
     * Verifica se o botão "Continue" está visível e habilitado.
     */
    test('Validar botão "Continue" no formulário de checkout', async () => {
        // Verifica se o botão "Continue" está visível
        expect(await purchaseFlow.isContinueButtonVisible()).toBeTruthy();

        // Verifica se o botão "Continue" está habilitado
        expect(await purchaseFlow.isContinueButtonEnabled()).toBeTruthy();
    });

    /**
     * Teste: Validar envio do formulário com todos os campos preenchidos.
     * Verifica se o formulário de checkout é enviado corretamente quando todos os campos estão preenchidos.
     */
    test('Validar envio do formulário com todos os campos preenchidos', async () => {
        // Preenche o formulário de checkout com todos os campos
        await purchaseFlow.fillCheckoutForm(data);

        // Continua para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a URL atual é a página de resumo do checkout
        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/checkout-step-two.html');
    });

    /**
     * Teste: Validar mensagens de erro ao enviar formulário vazio.
     * Verifica se as mensagens de erro corretas são exibidas ao tentar enviar o formulário sem preencher os campos.
     */
    test('Validar mensagens de erro ao enviar formulário vazio', async () => {
        // Tenta continuar para a página de resumo do checkout sem preencher o formulário
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    /**
     * Teste: Formulário apenas com o primeiro nome.
     * Verifica se a mensagem de erro correta é exibida ao preencher apenas o campo "First Name".
     */
    test('Formulário apenas com o primeiro nome', async () => {
        // Preenche apenas o campo "First Name" no formulário de checkout
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: '', zipCode: '' });

        // Tenta continuar para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Last Name is required');
    });

    /**
     * Teste: Formulário apenas com o sobrenome.
     * Verifica se a mensagem de erro correta é exibida ao preencher apenas o campo "Last Name".
     */
    test('Formulário apenas com o sobrenome', async () => {
        // Preenche apenas o campo "Last Name" no formulário de checkout
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: data.lastName, zipCode: '' });

        // Tenta continuar para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    /**
     * Teste: Formulário apenas com o código postal.
     * Verifica se a mensagem de erro correta é exibida ao preencher apenas o campo "Zip Code".
     */
    test('Formulário apenas com o código postal', async () => {
        // Preenche apenas o campo "Zip Code" no formulário de checkout
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: '', zipCode: data.zipCode });

        // Tenta continuar para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    /**
     * Teste: Formulário apenas com o primeiro nome e sobrenome.
     * Verifica se a mensagem de erro correta é exibida ao preencher apenas os campos "First Name" e "Last Name".
     */
    test('Formulário apenas com o primeiro nome e sobrenome', async () => {
        // Preenche os campos "First Name" e "Last Name" no formulário de checkout
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: data.lastName, zipCode: '' });

        // Tenta continuar para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Postal Code is required');
    });

    /**
     * Teste: Formulário apenas com o primeiro nome e código postal.
     * Verifica se a mensagem de erro correta é exibida ao preencher apenas os campos "First Name" e "Zip Code".
     */
    test('Formulário apenas com o primeiro nome e código postal', async () => {
        // Preenche os campos "First Name" e "Zip Code" no formulário de checkout
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: '', zipCode: data.zipCode });

        // Tenta continuar para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Last Name is required');
    });

    /**
     * Teste: Formulário apenas com o sobrenome e código postal.
     * Verifica se a mensagem de erro correta é exibida ao preencher apenas os campos "Last Name" e "Zip Code".
     */
    test('Formulário apenas com o sobrenome e código postal', async () => {
        // Preenche os campos "Last Name" e "Zip Code" no formulário de checkout
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: data.lastName, zipCode: data.zipCode });

        // Tenta continuar para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se a mensagem de erro correta é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });
});

/**
 * Testes de Formulário de Checkout para o usuário `problem_user`.
 * Este conjunto de testes verifica o comportamento do formulário de checkout para o usuário `problem_user`,
 * que simula problemas no sistema.
 */
test.describe('Fluxo de Compra - Testes de Formulário de Checkout com problem_user', () => {
    let loginPage: LoginPage;
    let purchaseFlow: PurchaseFlow;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    /**
     * Credenciais de login para o usuário `problem_user`.
     */
    const problemUserCredentials: LoginCredentials = {
        username: "problem_user",
        password: "secret_sauce",
    };

    /**
     * Dados do formulário de checkout.
     */
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
        cartPage = new CartPage(page);

        // Navega para a página de login
        await loginPage.navigate();

        // Realiza o login
        await loginPage.login(problemUserCredentials);

        // Verifica se a página de inventário está visível após o login
        expect(await loginPage.isInventoryPageVisible()).toBeTruthy();
    });

    /**
     * Teste: Verificar se o usuário com problema consegue avançar do formulário de compra que está com erro.
     * Verifica se o usuário `problem_user` não consegue avançar no fluxo de compra devido a problemas no sistema.
     */
    test('Verificar se o usuário com problema consegue avançar do formulário de compra.', async () => {
        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0]; // Usa o primeiro item da lista

        // Adiciona o item ao carrinho
        await inventoryPage.addItemToCart(item);

        // Navega para o carrinho
        await inventoryPage.goToCart();

        // Verifica se o item está no carrinho
        expect(await cartPage.checkCartItem(item)).toBeTruthy();

        // Inicia o processo de checkout
        await purchaseFlow.startCheckout();

        // Preenche o formulário de checkout com os dados fornecidos
        await purchaseFlow.fillCheckoutForm(data);

        // Continua para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Verifica se uma mensagem de erro é exibida
        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toBeTruthy();

        // Verifica se a URL atual não é a página de confirmação de compra
        expect(await purchaseFlow.getCurrentUrl()).not.toContain('checkout-step-two');
    });
});

/**
 * Testes de Formulário de Checkout para o usuário `error_user`.
 * Este conjunto de testes verifica o comportamento do formulário de checkout para o usuário `error_user`,
 * que simula erros no sistema.
 */
test.describe('Fluxo de Compra - Testes de Formulário de Checkout com error_user', () => {
    let loginPage: LoginPage;
    let purchaseFlow: PurchaseFlow;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    /**
     * Credenciais de login para o usuário `error_user`.
     */
    const errorUserCredentials: LoginCredentials = {
        username: "error_user",
        password: "secret_sauce",
    };

    /**
     * Dados do formulário de checkout.
     */
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
        cartPage = new CartPage(page);

        // Navega para a página de login
        await loginPage.navigate();

        // Realiza o login
        await loginPage.login(errorUserCredentials);

        // Verifica se a página de inventário está visível após o login
        expect(await loginPage.isInventoryPageVisible()).toBeTruthy();
    });

    /**
     * Teste: Verificar se o usuário com erro consegue avançar do formulário de compra que está com erro.
     * Verifica se o usuário `error_user` não consegue avançar no fluxo de compra devido a erros no sistema.
     */
    test('Verificar se o usuário com erro consegue avançar do formulário de compra.', async () => {
        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0];

        // Adiciona o item ao carrinho
        await inventoryPage.addItemToCart(item);

        // Navega para o carrinho
        await inventoryPage.goToCart();

        // Verifica se o item está no carrinho
        expect(await cartPage.checkCartItem(item)).toBeTruthy();

        // Inicia o processo de checkout
        await purchaseFlow.startCheckout();

        // Preenche o formulário de checkout com os dados fornecidos
        await purchaseFlow.fillCheckoutForm(data);

        // Continua para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Finaliza o checkout
        await purchaseFlow.finishCheckout();

        // Verifica se a URL atual não é a página de confirmação de compra
        expect(await purchaseFlow.getCurrentUrl()).not.toContain('checkout-complete');
    });
});