import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { LoginCredentials } from "../interfaces/login.interface";

const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Epic sadface: Username and password do not match any user in this service",
  USERNAME_REQUIRED: "Epic sadface: Username is required",
  PASSWORD_REQUIRED: "Epic sadface: Password is required",
  LOCKED_OUT_USER: "Epic sadface: Sorry, this user has been locked out.",
};

test.describe("Testes de login", () => {
  let loginPage: LoginPage;

  const validCredentials: LoginCredentials = {
    username: "performance_glitch_user",
    password: "secret_sauce",
  };

  const lockedOutUserCredentials: LoginCredentials = {
    username: "locked_out_user",
    password: "secret_sauce",
  };

  const performanceGlitchUserCredentials: LoginCredentials = {
    username: "performance_glitch_user",
    password: "secret_sauce",
  }

  const invalidCredentials: LoginCredentials = {
    username: "invalid_user",
    password: "invalid_password",
  };

  const emptyCredentials: LoginCredentials = {
    username: "",
    password: "",
  };

  const onlyUsername: LoginCredentials = {
    username: "standard_user",
    password: "",
  };

  const onlyPassword: LoginCredentials = {
    username: "",
    password: "secret_sauce",
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("Login com credenciais válidas clicando no botão", async () => {
    await loginPage.login(validCredentials);

    await expect(loginPage.getPage()).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );

    expect(await loginPage.isInventoryPageVisible()).toBe(true);
  });

  test("Login com credenciais inválidas clicando no botão", async () => {
    await loginPage.login(invalidCredentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.INVALID_CREDENTIALS
    );
  });

  test("Login sem preencher nenhum campo", async () => {
    await loginPage.login(emptyCredentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.USERNAME_REQUIRED
    );
  });

  test("Login preenchendo apenas o username", async () => {
    await loginPage.login(onlyUsername);
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.PASSWORD_REQUIRED
    );
  });

  test("Login preenchendo apenas a password", async () => {
    await loginPage.login(onlyPassword);
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.USERNAME_REQUIRED
    );
  });

  test("Login com usuário bloqueado", async () => {
    await loginPage.login(lockedOutUserCredentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.LOCKED_OUT_USER
    );
  });

  test("Login com performance_glitch_user (atraso de 5 segundos)", async () => {
    const startTime = Date.now();

    await loginPage.login(performanceGlitchUserCredentials);

    await loginPage.getPage().waitForURL("https://www.saucedemo.com/inventory.html", {
    });

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    expect(elapsedTime).toBeGreaterThanOrEqual(5000);
    expect(elapsedTime).toBeLessThan(10000);

    expect(await loginPage.isInventoryPageVisible()).toBe(true);
  });

  test("Logout após login com credenciais válidas", async () => {
    await loginPage.login(validCredentials);

    await expect(loginPage.getPage()).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );

    await loginPage.logout();

    await expect(loginPage.getPage()).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.getPage().locator('#user-name')).toBeVisible();
    await expect(loginPage.getPage().locator('#password')).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });
});