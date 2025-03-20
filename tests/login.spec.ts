import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Login Tests', () => {
  test('Login com credenciais válidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Login com credenciais inválidas', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'invalid_password');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });
});