import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { LoginCredentials } from "../interfaces/login.interface";

test.describe("Testes de login", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test("Login com credenciais válidas clicando no botão", async () => {
    const credentials: LoginCredentials = {
      username: "standard_user",
      password: "secret_sauce",
    };
    await loginPage.login(credentials);

    await expect(loginPage.getPage()).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );

    expect(await loginPage.isInventoryPageVisible()).toBe(true);
  });

  test("Login com credenciais inválidas clicando no botão", async () => {
    const credentials: LoginCredentials = {
      username: "invalid_user",
      password: "invalid_password",
    };
    await loginPage.login(credentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      "Epic sadface: Username and password do not match any user in this service"
    );
  });

  test("Login sem preencher nenhum campo", async () => {
    const credentials: LoginCredentials = {
      username: "",
      password: "",
    };
    await loginPage.login(credentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      "Epic sadface: Username is required"
    );
  });

  test("Login preenchendo apenas o username", async () => {
    const credentials: LoginCredentials = {
      username: "standard_user",
      password: "",
    };
    await loginPage.login(credentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      "Epic sadface: Password is required"
    );
  });

  test("Login preenchendo apenas a password", async () => {
    const credentials: LoginCredentials = {
      username: "",
      password: "secret_sauce",
    };
    await loginPage.login(credentials);
    expect(await loginPage.getErrorMessageText()).toBe(
      "Epic sadface: Username is required"
    );
  });
});
