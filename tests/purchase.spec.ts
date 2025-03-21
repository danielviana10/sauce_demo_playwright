import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { LoginCredentials } from '../interfaces/login.interface';
import { PurchaseFlow } from '../pages/purchaseFlow';
import { InventoryPage } from '../pages/inventoryPage';
import { InventoryItem } from '../interfaces/inventory.interface';
import { FormCheckout } from '../interfaces/form.interface';

test.describe('Fluxo de Compra', () => {
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
     * Executa antes de cada teste: inicializa as páginas e faz login.
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

        // Verifica se a página de inventário está visível após o login
        expect(await loginPage.isInventoryPageVisible()).toBeTruthy();
    });

    /**
     * Teste: Comprar um item
     * - Obtém os itens da lista de inventário.
     * - Seleciona o primeiro item da lista.
     * - Adiciona o item ao carrinho.
     * - Navega para o carrinho e verifica se o item está presente.
     * - Inicia o checkout, preenche o formulário e finaliza a compra.
     * - Verifica a mensagem de confirmação e retorna para a página inicial.
     */
    test('Comprar um item', async () => {
        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0]; // Usa o primeiro item da lista
        console.log(item)
        // Clica no título do item para acessar a página de detalhes
        await purchaseFlow.clickItemTitle(item);

        // Adiciona o item ao carrinho
        await purchaseFlow.addItemToCart();

        // Navega para o carrinho
        await purchaseFlow.goToCart();

        // Verifica se o item está no carrinho
        expect(await inventoryPage.checkCartItem(item)).toBeTruthy();

        // Verifica se a quantidade de itens no carrinho é 1
        expect(await inventoryPage.getCartItemCount()).toBe(1);

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
     * Teste: Validar dados do produto entre a lista e o link do produto
     * - Obtém os itens da lista de inventário.
     * - Seleciona o primeiro item da lista.
     * - Obtém os dados do item na lista de inventário (nome, preço e descrição).
     * - Navega para a página de detalhes do item.
     * - Obtém os dados do item na página de detalhes.
     * - Compara os dados da lista de inventário com os da página de detalhes.
     */
    test('Validar dados do produto entre a lista e o link do produto', async () => {
        // Obtém os itens da lista de inventário
        const items = await inventoryPage.getInventoryItems();
        const item = items[0]; // Usa o primeiro item da lista

        // Obtém os dados do item na lista de inventário
        const itemNameInInventory = await inventoryPage.getItemName(item);
        const itemPriceInInventory = await inventoryPage.getItemPrice(item);
        const itemDescriptionInInventory = await inventoryPage.getItemDescription(item);

        // Clica no título do item para acessar a página de detalhes
        await purchaseFlow.clickItemTitle(item);

        // Obtém os dados do item na página de detalhes
        const itemNameInDetails = await purchaseFlow.getItemName();
        const itemPriceInDetails = await purchaseFlow.getItemPrice();
        const itemDescriptionInDetails = await purchaseFlow.getItemDescription();

        // Compara os dados da lista de inventário com os da página de detalhes
        expect(itemNameInDetails).toBe(itemNameInInventory);
        expect(itemPriceInDetails).toBe(itemPriceInInventory);
        expect(itemDescriptionInDetails).toBe(itemDescriptionInInventory);
    });

    /**
     * Teste: Validar cancelamento da compra
     * - Obtém os itens da lista de inventário.
     * - Seleciona o primeiro item da lista.
     * - Adiciona o item ao carrinho.
     * - Navega para o carrinho e verifica se o item está presente.
     * - Inicia o checkout, preenche o formulário e cancela a compra.
     * - Verifica se o usuário foi redirecionado para a página de inventário.
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
        expect(await inventoryPage.checkCartItem(item)).toBeTruthy();

        // Verifica se a quantidade de itens no carrinho é 1
        expect(await inventoryPage.getCartItemCount()).toBe(1);

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