import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { LoginCredentials } from "../interfaces/login.interface";

test.describe("Testes de ordenação de itens no inventário", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  /**
   * Executa antes de cada teste: inicializa as páginas e faz login.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navega para a página de login
    await loginPage.navigate();

    // Credenciais de login válidas
    const credentials: LoginCredentials = {
      username: "standard_user",
      password: "secret_sauce",
    };

    // Realiza o login
    await loginPage.login(credentials);
  });

  /**
   * Teste: Ordenar itens de A-Z
   */
  test("Ordenar itens de A-Z", async () => {
    // Ordena os itens de A-Z
    await inventoryPage.sortItems("az");

    // Obtém os nomes dos itens após a ordenação
    const itemNames = await inventoryPage.getItemNames();


    // Ordena os nomes dos itens manualmente para comparação
    const sortedNames = [...itemNames].sort();

    // Verifica se os nomes dos itens estão ordenados corretamente
    expect(itemNames).toEqual(sortedNames);
  });

  /**
   * Teste: Ordenar itens de Z-A
   */
  test("Ordenar itens de Z-A", async () => {
    // Ordena os itens de Z-A
    await inventoryPage.sortItems("za");

    // Obtém os nomes dos itens após a ordenação
    const itemNames = await inventoryPage.getItemNames();

    // Ordena os nomes dos itens manualmente em ordem reversa para comparação
    const sortedNames = [...itemNames].sort().reverse();

    // Verifica se os nomes dos itens estão ordenados corretamente
    expect(itemNames).toEqual(sortedNames);
  });

  /**
   * Teste: Ordenar itens de menor preço para maior
   */
  test("Ordenar itens de menor preço para maior", async () => {
    // Ordena os itens por preço, do menor para o maior
    await inventoryPage.sortItems("lohi");

    // Obtém os preços dos itens após a ordenação
    const itemPrices = await inventoryPage.getItemPrices();

    // Ordena os preços dos itens manualmente para comparação
    const sortedPrices = [...itemPrices].sort((a, b) => a - b);

    // Verifica se os preços dos itens estão ordenados corretamente
    expect(itemPrices).toEqual(sortedPrices);
  });

  /**
   * Teste: Ordenar itens de maior preço para menor
   */
  test("Ordenar itens de maior preço para menor", async () => {
    // Ordena os itens por preço, do maior para o menor
    await inventoryPage.sortItems("hilo");

    // Obtém os preços dos itens após a ordenação
    const itemPrices = await inventoryPage.getItemPrices();

    // Ordena os preços dos itens manualmente em ordem reversa para comparação
    const sortedPrices = [...itemPrices].sort((a, b) => b - a);

    // Verifica se os preços dos itens estão ordenados corretamente
    expect(itemPrices).toEqual(sortedPrices);
  });
});