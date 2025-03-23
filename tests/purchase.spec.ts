import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginCredentials } from '../interfaces/login.interface';
import { PurchaseFlow } from '../pages/purchaseFlow';
import { InventoryPage } from '../pages/inventoryPage';
import { InventoryItem } from '../interfaces/inventory.interface';
import { FormCheckout } from '../interfaces/form.interface';
import { CartPage } from '../pages/cartPage';

/**
 * Testes de fluxo de compra para o usuário `standard_user`.
 * Este conjunto de testes verifica o comportamento do fluxo de compra, incluindo adicionar itens ao carrinho,
 * preencher o formulário de checkout, finalizar a compra e cancelar a compra.
 */
test.describe('Fluxo de Compra', () => {
    let loginPage: LoginPage;
    let purchaseFlow: PurchaseFlow;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

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
     * Credenciais de login para o usuário `problem_user`.
     */
    const problemUserCredentials: LoginCredentials = {
        username: "problem_user",
        password: "secret_sauce",
    };

    /**
     * Credenciais de login para o usuário `error_user`.
     */
    const errorUserCredentials: LoginCredentials = {
        username: "error_user",
        password: "secret_sauce",
    };

    /**
     * Executa antes de cada teste: inicializa as páginas e faz login.
     */
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        purchaseFlow = new PurchaseFlow(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);

        // Navega para a página de login
        await loginPage.navigate();

        // Realiza o login
        await loginPage.login(credentials);

        // Verifica se a página de inventário está visível após o login
        expect(await loginPage.isInventoryPageVisible()).toBeTruthy();
    });

    /**
     * Teste: Comprar um item.
     * Verifica o fluxo completo de compra, desde a adição de um item ao carrinho até a finalização do checkout.
     */
    test('Comprar um item', async () => {
        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0];

        // Clica no título do item para acessar a página de detalhes
        await purchaseFlow.clickItemTitle(item);

        // Adiciona o item ao carrinho
        await purchaseFlow.addItemToCart();

        // Navega para o carrinho
        await purchaseFlow.goToCart();

        // Verifica se o item está no carrinho
        expect(await cartPage.checkCartItem(item)).toBeTruthy();

        // Verifica se a quantidade de itens no carrinho é 1
        expect(await cartPage.getCartItemCount()).toBe(1);

        // Inicia o processo de checkout
        await purchaseFlow.startCheckout();

        // Preenche o formulário de checkout com os dados fornecidos
        await purchaseFlow.fillCheckoutForm(data);

        // Continua para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Finaliza o checkout
        await purchaseFlow.finishCheckout();

        // Obtém a mensagem de confirmação
        const confirmationMessage = await purchaseFlow.getConfirmationMessage();

        // Verifica se a mensagem de confirmação contém o texto esperado
        expect(confirmationMessage).toContain('Thank you for your order');

        // Retorna para a página inicial de produtos
        await purchaseFlow.backToHome();

        // Verifica se a URL atual é a página de inventário
        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/inventory.html');
    });

    /**
     * Teste: Validar cancelamento da compra.
     * Verifica o fluxo de cancelamento de compra, desde a adição de um item ao carrinho até o cancelamento do checkout.
     */
    test('Validar cancelamento da compra', async () => {
        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0]; // Usa o primeiro item da lista

        // Clica no título do item para acessar a página de detalhes
        await purchaseFlow.clickItemTitle(item);

        // Adiciona o item ao carrinho
        await purchaseFlow.addItemToCart();

        // Navega para o carrinho
        await purchaseFlow.goToCart();

        // Verifica se o item está no carrinho
        expect(await cartPage.checkCartItem(item)).toBeTruthy();

        // Verifica se a quantidade de itens no carrinho é 1
        expect(await cartPage.getCartItemCount()).toBe(1);

        // Inicia o processo de checkout
        await purchaseFlow.startCheckout();

        // Preenche o formulário de checkout com os dados fornecidos
        await purchaseFlow.fillCheckoutForm(data);

        // Continua para a página de resumo do checkout
        await purchaseFlow.continueToCheckoutOverview();

        // Cancela o checkout
        await purchaseFlow.cancelCheckout();

        // Verifica se a URL atual é a página de inventário
        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/inventory.html');
    });
});