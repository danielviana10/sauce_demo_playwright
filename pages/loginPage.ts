import { Page } from "@playwright/test";
import { LoginCredentials } from "../interfaces/login.interface";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/');
    }

    async login(credentials: LoginCredentials) {
        await this.page.fill('#user-name', credentials.username);
        await this.page.fill('#password', credentials.password);
        await this.page.click('#login-button');
    }
    
    async getErrorMessageText() {
        return this.page.locator('[data-test="error"]').innerText();
    }

    async isInventoryPageVisible() {
        return this.page.locator('.inventory_list').isVisible();
    }    

    getPage() {
        return this.page;
    }

}