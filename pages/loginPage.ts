import { expect, Page } from "@playwright/test";
import { LoginCredentials } from "../interfaces/login.interface";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navega para a página de login.
     */
    async navigate() {
        await this.page.goto('/');
    }

    /**
     * Realiza o login com as credenciais fornecidas.
     * @param credentials - Objeto contendo username e password.
     */
    async login(credentials: LoginCredentials) {
        await this.page.fill('#user-name', credentials.username);
        await this.page.fill('#password', credentials.password);
        await this.page.click('#login-button');
    }

    /**
     * Realiza o logout do usuário.
     */
    async logout() {
        await this.page.getByRole('button', { name: 'Open Menu' }).click();

        await this.page.locator('[data-test="logout-sidebar-link"]').click();

        await expect(this.page).toHaveURL('https://www.saucedemo.com/');
    }

    /**
     * Obtém o texto da mensagem de erro exibida na tela de login.
     * @returns O texto da mensagem de erro.
     */
    async getErrorMessageText() {
        return this.page.locator('[data-test="error"]').innerText();
    }

    /**
     * Verifica se a página de inventário está visível.
     * @returns `true` se a página de inventário estiver visível, caso contrário, `false`.
     */
    async isInventoryPageVisible() {
        return this.page.locator('.inventory_list').isVisible();
    }

    /**
     * Retorna a instância da página atual.
     * @returns A instância da página.
     */
    getPage() {
        return this.page;
    }

}