import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';

test.describe('Testes de Carrinho', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  const itemName = 'Sauce Labs Backpack';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.navigate();
  });

  test('Adicionar item ao carrinho', async () => {
    await inventoryPage.addItemToCart(itemName);

    const cartItemCount = await inventoryPage.getCartItemCount();
    await expect(cartItemCount).toBe(1);

    await inventoryPage.goToCart();

    const isItemInCart = await inventoryPage.checkCartItem(itemName);
    await expect(isItemInCart).toBeTruthy();
  });

  test('Remover item do carrinho', async () => {
    await inventoryPage.addItemToCart(itemName);
  
    await inventoryPage.goToCart();
  
    await inventoryPage.removeItemFromCart(itemName);
  
    const isItemInCart = await inventoryPage.checkCartItem(itemName);
    await expect(isItemInCart).toBeFalsy();
  });
});