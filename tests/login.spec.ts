import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { LoginCredentials } from "../interfaces/login.interface";

// Constantes para mensagens de erro esperadas
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Epic sadface: Username and password do not match any user in this service",
  USERNAME_REQUIRED: "Epic sadface: Username is required",
  PASSWORD_REQUIRED: "Epic sadface: Password is required",
  LOCKED_OUT_USER: "Epic sadface: Sorry, this user has been locked out.",
};

test.describe("Testes de login com standard_user", () => {
  let loginPage: LoginPage;

  // Credenciais válidas para o usuário standard_user
  const validCredentials: LoginCredentials = {
    username: "standard_user",
    password: "secret_sauce",
  };

  // Credenciais para o usuário bloqueado (locked_out_user)
  const lockedOutUserCredentials: LoginCredentials = {
    username: "locked_out_user",
    password: "secret_sauce",
  };

  // Credenciais para o usuário com problemas de performance (performance_glitch_user)
  const performanceGlitchUserCredentials: LoginCredentials = {
    username: "performance_glitch_user",
    password: "secret_sauce",
  };

  // Credenciais inválidas (usuário e senha incorretos)
  const invalidCredentials: LoginCredentials = {
    username: "invalid_user",
    password: "invalid_password",
  };

  // Credenciais vazias (sem usuário e senha)
  const emptyCredentials: LoginCredentials = {
    username: "",
    password: "",
  };

  // Credenciais com apenas o nome de usuário preenchido
  const onlyUsername: LoginCredentials = {
    username: "standard_user",
    password: "",
  };

  // Credenciais com apenas a senha preenchida
  const onlyPassword: LoginCredentials = {
    username: "",
    password: "secret_sauce",
  };

  // Executa antes de cada teste: inicializa a página de login
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // Teste: Login com credenciais válidas clicando no botão
  test("Login com credenciais válidas clicando no botão", async () => {
    await loginPage.login(validCredentials);

    // Verifica se a URL mudou para a página de inventário após o login
    await expect(loginPage.getPage()).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );

    // Verifica se a página de inventário está visível
    expect(await loginPage.isInventoryPageVisible()).toBe(true);
  });

  // Teste: Login com credenciais inválidas clicando no botão
  test("Login com credenciais inválidas clicando no botão", async () => {
    await loginPage.login(invalidCredentials);

    // Verifica se a mensagem de erro correta é exibida
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.INVALID_CREDENTIALS
    );
  });

  // Teste: Login sem preencher nenhum campo
  test("Login sem preencher nenhum campo", async () => {
    await loginPage.login(emptyCredentials);

    // Verifica se a mensagem de erro correta é exibida
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.USERNAME_REQUIRED
    );
  });

  // Teste: Login preenchendo apenas o nome de usuário
  test("Login preenchendo apenas o username", async () => {
    await loginPage.login(onlyUsername);

    // Verifica se a mensagem de erro correta é exibida
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.PASSWORD_REQUIRED
    );
  });

  // Teste: Login preenchendo apenas a senha
  test("Login preenchendo apenas a password", async () => {
    await loginPage.login(onlyPassword);

    // Verifica se a mensagem de erro correta é exibida
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.USERNAME_REQUIRED
    );
  });

  // Teste: Logout após login com credenciais válidas
  test("Logout após login com credenciais válidas", async () => {
    await loginPage.login(validCredentials); // Realiza o login com credenciais válidas

    // Verifica se a URL mudou para a página de inventário após o login
    await expect(loginPage.getPage()).toHaveURL(
      "https://www.saucedemo.com/inventory.html"
    );

    await loginPage.logout(); // Realiza o logout

    // Verifica se a URL mudou para a página de login após o logout
    await expect(loginPage.getPage()).toHaveURL('https://www.saucedemo.com/');

    // Verifica se os campos de usuário e senha estão visíveis após o logout
    await expect(loginPage.getPage().locator('#user-name')).toBeVisible();
    await expect(loginPage.getPage().locator('#password')).toBeVisible();
  });

  // Teste: Login com usuário bloqueado (locked_out_user)
  test("Login com usuário bloqueado", async () => {
    await loginPage.login(lockedOutUserCredentials);

    // Verifica se a mensagem de erro correta é exibida
    expect(await loginPage.getErrorMessageText()).toBe(
      ERROR_MESSAGES.LOCKED_OUT_USER
    );
  });

  // Teste: Login com performance_glitch_user (atraso de 4 segundos)
  test("Login com performance_glitch_user (atraso de 4 segundos)", async () => {
    const startTime = Date.now(); // Marca o tempo inicial

    await loginPage.login(performanceGlitchUserCredentials);

    // Espera a URL mudar para a página de inventário
    await loginPage.getPage().waitForURL("https://www.saucedemo.com/inventory.html", {
    });

    const endTime = Date.now();
    const elapsedTime = endTime - startTime;

    // Verifica se o tempo de login está dentro de um intervalo aceitável
    expect(elapsedTime).toBeGreaterThanOrEqual(4000);
    expect(elapsedTime).toBeLessThan(10000);

    // Verifica se a página de inventário está visível após o login
    expect(await loginPage.isInventoryPageVisible()).toBe(true);
  });
});