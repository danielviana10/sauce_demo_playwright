import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

test.describe('Testes de login', () => {
  test('Login com credenciais válidas clicando no botão', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('Login com credenciais inválidas clicando no botão', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'invalid_password');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('Login sem preencher nenhum campo', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', '');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('Login preenchendo apenas o username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', '');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toHaveText('Epic sadface: Password is required');
  });

  test('Login preenchendo apenas a password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('', 'secret_sauce');
    const errorMessage = await loginPage.getErrorMessage();
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
  });
});