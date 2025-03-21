import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { LoginCredentials } from "../interfaces/login.interface";

test.describe("Testes de ordenação de itens no inventário", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    const credentials: LoginCredentials = {
      username: "standard_user",
      password: "secret_sauce",
    };
    await loginPage.login(credentials);
  });

  test("Ordenar itens de A-Z", async () => {
    await inventoryPage.sortItems("az");
    const itemNames = await inventoryPage.getItemNames();

    const sortedNames = [...itemNames].sort();
    expect(itemNames).toEqual(sortedNames);
  });

  test("Ordenar itens de Z-A", async () => {
    await inventoryPage.sortItems("za");
    const itemNames = await inventoryPage.getItemNames();

    const sortedNames = [...itemNames].sort().reverse();
    expect(itemNames).toEqual(sortedNames);
  });

  test("Ordenar itens de menor preço para maior", async () => {
    await inventoryPage.sortItems("lohi");
    const itemPrices = await inventoryPage.getItemPrices();

    const sortedPrices = [...itemPrices].sort((a, b) => a - b);
    expect(itemPrices).toEqual(sortedPrices);
  });

  test("Ordenar itens de maior preço para menor", async () => {
    await inventoryPage.sortItems("hilo");
    const itemPrices = await inventoryPage.getItemPrices();

    const sortedPrices = [...itemPrices].sort((a, b) => b - a);
    expect(itemPrices).toEqual(sortedPrices);
  });
});
