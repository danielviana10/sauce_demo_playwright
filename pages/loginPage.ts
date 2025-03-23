import { expect, Page } from "@playwright/test";
import { LoginCredentials } from "../interfaces/login.interface";

/**
 * Página de Login da aplicação Sauce Demo.
 * Esta classe contém métodos para interagir com a página de login, como realizar login, logout e verificar mensagens de erro.
 */
export class LoginPage {
    private page: Page;

    /**
     * Construtor da classe LoginPage.
     * @param page - Instância da página do Playwright.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navega para a página de login.
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.navigate();
     */
    async navigate() {
        await this.page.goto('/');
    }

    /**
     * Realiza o login com as credenciais fornecidas.
     * @param credentials - Objeto contendo username e password.
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.login({ username: 'standard_user', password: 'secret_sauce' });
     */
    async login(credentials: LoginCredentials) {
        await this.page.fill('#user-name', credentials.username);
        await this.page.fill('#password', credentials.password);
        await this.page.click('#login-button');
    }

    /**
     * Realiza o logout do usuário.
     * @remarks
     * Este método clica no botão de menu, seleciona a opção de logout e verifica se a URL mudou para a página de login.
     * @example
     * const loginPage = new LoginPage(page);
     * await loginPage.logout();
     */
    async logout() {
        await this.page.getByRole('button', { name: 'Open Menu' }).click();
        await this.page.locator('[data-test="logout-sidebar-link"]').click();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }

    /**
     * Obtém o texto da mensagem de erro exibida na tela de login.
     * @returns O texto da mensagem de erro.
     * @example
     * const loginPage = new LoginPage(page);
     * const errorMessage = await loginPage.getErrorMessageText();
     * console.log(errorMessage);
     */
    async getErrorMessageText(): Promise<string> {
        return this.page.locator('[data-test="error"]').innerText();
    }

    /**
     * Verifica se a página de inventário está visível.
     * @returns `true` se a página de inventário estiver visível, caso contrário, `false`.
     * @example
     * const loginPage = new LoginPage(page);
     * const isInventoryVisible = await loginPage.isInventoryPageVisible();
     * console.log(isInventoryVisible);
     */
    async isInventoryPageVisible(): Promise<boolean> {
        return this.page.locator('.inventory_list').isVisible();
    }

    /**
     * Retorna a instância da página atual.
     * @returns A instância da página.
     * @example
     * const loginPage = new LoginPage(page);
     * const currentPage = loginPage.getPage();
     * await currentPage.goto('/inventory.html');
     */
    getPage(): Page {
        return this.page;
    }
}