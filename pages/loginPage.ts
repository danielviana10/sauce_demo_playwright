import { Page } from "@playwright/test";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto("https://www.saucedemo.com");
    }

    async login(username: string, password: string) {
        await this.page.fill('#user-name', username);
        await this.page.fill('#password', password);
        await this.page.click('#login-button');
    }

    async getErrorMessage() {
        return await this.page.locator('[data-test="error"]');
    }
}