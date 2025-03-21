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

    const data: FormCheckout = {
        firstName: 'Daniel',
        lastName: 'Viana',
        zipCode: '06406150',
    }

    const item: InventoryItem = {
        id: '4',
        name: 'Sauce Labs Backpack',
        price: 29.99,
        description: 'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.',
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        purchaseFlow = new PurchaseFlow(page);
        inventoryPage = new InventoryPage(page);

        await loginPage.navigate();
        const credentials: LoginCredentials = {
            username: "standard_user",
            password: "secret_sauce",
        };
        await loginPage.login(credentials);

        await purchaseFlow.clickProductTitle(item.id);

        await purchaseFlow.addProductToCart();

        await purchaseFlow.goToCart();


        await purchaseFlow.startCheckout();
    });

    test('Validar botão "Continue" no formulário de checkout', async () => {
        expect(await purchaseFlow.isContinueButtonVisible()).toBeTruthy();

        expect(await purchaseFlow.isContinueButtonEnabled()).toBeTruthy();
    });

    test('Validar envio do formulário com todos os campos preenchidos', async () => {
        await purchaseFlow.fillCheckoutForm(data);
        await purchaseFlow.continueToCheckoutOverview();

        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/checkout-step-two.html');
    });

    test('Validar mensagens de erro ao enviar formulário vazio', async () => {
        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    test('Formulário apenas com o primeiro nome', async () => {
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: '', zipCode: '' });

        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Last Name is required');
    });

    test('Formulário apenas com o sobrenome', async () => {
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: data.lastName, zipCode: '' });

        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    test('Formulário apenas com o código postal', async () => {
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: '', zipCode: data.zipCode });

        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    test('Formulário apenas com o primeiro nome e sobrenome', async () => {
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: data.lastName, zipCode: '' });

        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Postal Code is required');
    });

    test('Formulário apenas com o primeiro nome e código postal', async () => {
        await purchaseFlow.fillCheckoutForm({ firstName: data.firstName, lastName: '', zipCode: data.zipCode });

        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: Last Name is required');
    });

    test('Formulário apenas com o sobrenome e código postal', async () => {
        await purchaseFlow.fillCheckoutForm({ firstName: '', lastName: data.lastName, zipCode: data.zipCode });

        await purchaseFlow.continueToCheckoutOverview();

        const errorMessage = await purchaseFlow.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });
});