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

        expect(await loginPage.isInventoryPageVisible()).toBeTruthy();
    });

    test('Comprar um item', async () => {
        await purchaseFlow.clickProductTitle(item.id);

        await purchaseFlow.addProductToCart();

        await purchaseFlow.goToCart();
        expect(await inventoryPage.checkCartItem(item)).toBeTruthy();

        expect(await inventoryPage.getCartItemCount()).toBe(1);

        await purchaseFlow.startCheckout();

        await purchaseFlow.fillCheckoutForm(data);

        await purchaseFlow.continueToCheckoutOverview();

        await purchaseFlow.finishCheckout();

        const confirmationMessage = await purchaseFlow.getConfirmationMessage();
        expect(confirmationMessage).toContain('Thank you for your order');

        await purchaseFlow.backToHome();

        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/inventory.html');
    });

    test('Validar dados do produto entre a lista e o link do produto', async () => {
        const productId = item.id;

        const productNameInInventory = await inventoryPage.getProductName(productId);
        const productPriceInInventory = await inventoryPage.getProductPrice(productId);
        const productDescriptionInInventory = await inventoryPage.getProductDescription(productId);

        await purchaseFlow.clickProductTitle(productId);

        const productNameInDetails = await purchaseFlow.getProductName();
        const productPriceInDetails = await purchaseFlow.getProductPrice();
        const productDescriptionInDetails = await purchaseFlow.getProductDescription();

        expect(productNameInDetails).toBe(productNameInInventory);
        expect(productPriceInDetails).toBe(productPriceInInventory);
        expect(productDescriptionInDetails).toBe(productDescriptionInInventory);
    });

    test('Validar cancelamento da compra', async () => {
        await purchaseFlow.clickProductTitle(item.id);

        await purchaseFlow.addProductToCart();

        await purchaseFlow.goToCart();
        expect(await inventoryPage.checkCartItem(item)).toBeTruthy();

        expect(await inventoryPage.getCartItemCount()).toBe(1);

        await purchaseFlow.startCheckout();

        await purchaseFlow.fillCheckoutForm(data);

        await purchaseFlow.continueToCheckoutOverview();

        await purchaseFlow.cancelCheckout();

        expect(await purchaseFlow.getCurrentUrl()).toBe('https://www.saucedemo.com/inventory.html');
    });
});