import test, { expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { LoginCredentials } from "../interfaces/login.interface";

/**
 * Testes de ordenação para o usuário `standard_user`.
 * Este conjunto de testes verifica o comportamento da ordenação de itens na página de inventário
 * para o usuário `standard_user`, incluindo ordenação por nome (A-Z, Z-A) e preço (menor para maior, maior para menor).
 */
test.describe("Testes de ordenação para standard_user", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  /**
   * Credenciais de login válidas para o usuário `standard_user`.
   */
  const validCredentials: LoginCredentials = {
    username: "standard_user",
    password: "secret_sauce",
  };

  /**
   * Executa antes de cada teste: inicializa as páginas e faz login.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navega para a página de login
    await loginPage.navigate();

    // Realiza o login
    await loginPage.login(validCredentials);
  });

  /**
   * Teste: Ordenar itens de A-Z e verificar o filtro selecionado.
   * Verifica se os itens são ordenados corretamente de A-Z e se o filtro selecionado é atualizado.
   */
  test("Ordenar itens de A-Z e verificar o filtro selecionado", async () => {
    // Ordena os itens de A-Z
    await inventoryPage.sortItems("az");

    // Obtém os nomes dos itens após a ordenação
    const itemNames = await inventoryPage.getItemNames();

    // Ordena os nomes dos itens manualmente para comparação
    const sortedNames = [...itemNames].sort();

    // Verifica se os nomes dos itens estão ordenados corretamente
    expect(itemNames).toEqual(sortedNames);

    // Verifica se o filtro selecionado é "Name (A to Z)"
    const selectedSortOption = await inventoryPage.getSelectedSortOption();
    expect(selectedSortOption).toBe("az");
  });

  /**
   * Teste: Ordenar itens de Z-A e verificar o filtro selecionado.
   * Verifica se os itens são ordenados corretamente de Z-A e se o filtro selecionado é atualizado.
   */
  test("Ordenar itens de Z-A e verificar o filtro selecionado", async () => {
    // Ordena os itens de Z-A
    await inventoryPage.sortItems("za");

    // Obtém os nomes dos itens após a ordenação
    const itemNames = await inventoryPage.getItemNames();

    // Ordena os nomes dos itens manualmente em ordem reversa para comparação
    const sortedNames = [...itemNames].sort().reverse();

    // Verifica se os nomes dos itens estão ordenados corretamente
    expect(itemNames).toEqual(sortedNames);

    // Verifica se o filtro selecionado é "Name (Z to A)"
    const selectedSortOption = await inventoryPage.getSelectedSortOption();
    expect(selectedSortOption).toBe("za");
  });

  /**
   * Teste: Ordenar itens de menor preço para maior e verificar o filtro selecionado.
   * Verifica se os itens são ordenados corretamente por preço (menor para maior) e se o filtro selecionado é atualizado.
   */
  test("Ordenar itens de menor preço para maior e verificar o filtro selecionado", async () => {
    // Ordena os itens por preço, do menor para o maior
    await inventoryPage.sortItems("lohi");

    // Obtém os preços dos itens após a ordenação
    const itemPrices = await inventoryPage.getItemPrices();

    // Ordena os preços dos itens manualmente para comparação
    const sortedPrices = [...itemPrices].sort((a, b) => a - b);

    // Verifica se os preços dos itens estão ordenados corretamente
    expect(itemPrices).toEqual(sortedPrices);

    // Verifica se o filtro selecionado é "Price (low to high)"
    const selectedSortOption = await inventoryPage.getSelectedSortOption();
    expect(selectedSortOption).toBe("lohi");
  });

  /**
   * Teste: Ordenar itens de maior preço para menor e verificar o filtro selecionado.
   * Verifica se os itens são ordenados corretamente por preço (maior para menor) e se o filtro selecionado é atualizado.
   */
  test("Ordenar itens de maior preço para menor e verificar o filtro selecionado", async () => {
    // Ordena os itens por preço, do maior para o menor
    await inventoryPage.sortItems("hilo");

    // Obtém os preços dos itens após a ordenação
    const itemPrices = await inventoryPage.getItemPrices();

    // Ordena os preços dos itens manualmente em ordem reversa para comparação
    const sortedPrices = [...itemPrices].sort((a, b) => b - a);

    // Verifica se os preços dos itens estão ordenados corretamente
    expect(itemPrices).toEqual(sortedPrices);

    // Verifica se o filtro selecionado é "Price (high to low)"
    const selectedSortOption = await inventoryPage.getSelectedSortOption();
    expect(selectedSortOption).toBe("hilo");
  });
});

/**
 * Testes de ordenação para o usuário `problem_user`.
 * Este conjunto de testes verifica o comportamento da ordenação de itens na página de inventário
 * para o usuário `problem_user`, que simula problemas no sistema.
 */
test.describe("Testes de ordenação para problem_user", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  /**
   * Credenciais de login para o usuário `problem_user`.
   */
  const problemUserCredentials: LoginCredentials = {
    username: "problem_user",
    password: "secret_sauce",
  };

  /**
   * Executa antes de cada teste: inicializa as páginas e faz login.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navega para a página de login
    await loginPage.navigate();

    // Realiza o login
    await loginPage.login(problemUserCredentials);
  });

  /**
   * Teste: Verificar que a lista e o filtro não mudam ao tentar ordenar de A-Z.
   * Verifica se a lista de itens e o filtro selecionado permanecem inalterados ao tentar ordenar de A-Z.
   */
  test("Verificar que a lista e o filtro não mudam ao tentar ordenar de A-Z", async () => {
    // Obtém os nomes dos itens antes da ordenação
    const itemNamesBeforeSort = await inventoryPage.getItemNames();

    // Obtém o filtro selecionado antes da ordenação
    const selectedSortOptionBefore = await inventoryPage.getSelectedSortOption();

    // Tenta ordenar os itens de A-Z
    await inventoryPage.sortItems("az");

    // Obtém os nomes dos itens após a tentativa de ordenação
    const itemNamesAfterSort = await inventoryPage.getItemNames();

    // Obtém o filtro selecionado após a tentativa de ordenação
    const selectedSortOptionAfter = await inventoryPage.getSelectedSortOption();

    // Verifica se a lista não mudou
    expect(itemNamesAfterSort).toEqual(itemNamesBeforeSort);

    // Verifica se o filtro selecionado não mudou
    expect(selectedSortOptionAfter).toEqual(selectedSortOptionBefore);
  });

  /**
   * Teste: Verificar que a lista e o filtro não mudam ao tentar ordenar de Z-A.
   * Verifica se a lista de itens e o filtro selecionado permanecem inalterados ao tentar ordenar de Z-A.
   */
  test("Verificar que a lista e o filtro não mudam ao tentar ordenar de Z-A", async () => {
    // Obtém os nomes dos itens e filtro selecionado antes da ordenação
    const itemNamesBeforeSort = await inventoryPage.getItemNames();
    const selectedSortOptionBefore = await inventoryPage.getSelectedSortOption();

    // Tenta ordenar os itens de Z-A
    await inventoryPage.sortItems("za");

    // Obtém os nomes dos itens após a tentativa de ordenação
    const itemNamesAfterSort = await inventoryPage.getItemNames();

    // Obtém o filtro selecionado após a tentativa de ordenação
    const selectedSortOptionAfter = await inventoryPage.getSelectedSortOption();

    // Verifica se a lista não mudou
    expect(itemNamesAfterSort).toEqual(itemNamesBeforeSort);

    // Verifica se o filtro selecionado não mudou
    expect(selectedSortOptionAfter).toEqual(selectedSortOptionBefore);
  });

  /**
   * Teste: Verificar que a lista e o filtro não mudam ao tentar ordenar por preço (menor para maior).
   * Verifica se a lista de itens e o filtro selecionado permanecem inalterados ao tentar ordenar por preço (menor para maior).
   */
  test("Verificar que a lista e o filtro não mudam ao tentar ordenar por preço (menor para maior)", async () => {
    // Obtém os preços dos itens e filtro selecionado antes da ordenação
    const itemPricesBeforeSort = await inventoryPage.getItemPrices();
    const selectedSortOptionBefore = await inventoryPage.getSelectedSortOption();

    // Tenta ordenar os itens por preço, do menor para o maior
    await inventoryPage.sortItems("lohi");

    // Obtém os preços dos itens após a tentativa de ordenação
    const itemPricesAfterSort = await inventoryPage.getItemPrices();

    // Obtém o filtro selecionado após a tentativa de ordenação
    const selectedSortOptionAfter = await inventoryPage.getSelectedSortOption();

    // Verifica se a lista não mudou
    expect(itemPricesAfterSort).toEqual(itemPricesBeforeSort);

    // Verifica se o filtro selecionado não mudou
    expect(selectedSortOptionAfter).toEqual(selectedSortOptionBefore);
  });

  /**
   * Teste: Verificar que a lista e o filtro não mudam ao tentar ordenar por preço (maior para menor).
   * Verifica se a lista de itens e o filtro selecionado permanecem inalterados ao tentar ordenar por preço (maior para menor).
   */
  test("Verificar que a lista e o filtro não mudam ao tentar ordenar por preço (maior para menor)", async () => {
    // Obtém os preços dos itens e filtro selecionado antes da ordenação
    const itemPricesBeforeSort = await inventoryPage.getItemPrices();
    const selectedSortOptionBefore = await inventoryPage.getSelectedSortOption();

    // Tenta ordenar os itens por preço, do maior para o menor
    await inventoryPage.sortItems("hilo");

    // Obtém os preços dos itens após a tentativa de ordenação
    const itemPricesAfterSort = await inventoryPage.getItemPrices();

    // Obtém o filtro selecionado após a tentativa de ordenação
    const selectedSortOptionAfter = await inventoryPage.getSelectedSortOption();

    // Verifica se a lista não mudou
    expect(itemPricesAfterSort).toEqual(itemPricesBeforeSort);

    // Verifica se o filtro selecionado não mudou
    expect(selectedSortOptionAfter).toEqual(selectedSortOptionBefore);
  });
});

/**
 * Testes de ordenação para o usuário `performance_glitch_user`.
 * Este conjunto de testes verifica o comportamento da ordenação de itens na página de inventário
 * para o usuário `performance_glitch_user`, que simula atrasos no sistema.
 */
test.describe("Testes de ordenação para performance_glitch_user", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  /**
   * Credenciais de login para o usuário `performance_glitch_user`.
   */
  const glitchUserCredentials: LoginCredentials = {
    username: "performance_glitch_user",
    password: "secret_sauce",
  };

  /**
   * Executa antes de cada teste: inicializa as páginas e faz login.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navega para a página de login
    await loginPage.navigate();

    // Realiza o login
    await loginPage.login(glitchUserCredentials);
  });

  /**
   * Função auxiliar para medir o tempo de ordenação e verificar os resultados.
   * @param sortOption - A opção de ordenação ("az", "za", "lohi", "hilo").
   * @param verifyFunction - Função para verificar os dados após a ordenação.
   */
  async function testSortingPerformance(
    sortOption: 'az' | 'za' | 'lohi' | 'hilo',
    verifyFunction: () => Promise<void>
  ) {
    // Marca o tempo inicial
    const startTime = Date.now();

    // Ordena os itens de acordo com a opção fornecida
    await inventoryPage.sortItems(sortOption);

    // Marca o tempo final
    const endTime = Date.now();
    // Calcula o tempo decorrido
    const elapsedTime = endTime - startTime;

    // Verifica se o tempo de ordenação está dentro de um intervalo aceitável
    expect(elapsedTime).toBeGreaterThanOrEqual(4000);
    expect(elapsedTime).toBeLessThan(10000);

    // Executa a função de verificação específica para o tipo de ordenação
    await verifyFunction();
  }

  /**
   * Teste: Medir o tempo de ordenação de A-Z.
   * Verifica se a ordenação de A-Z é realizada dentro de um intervalo de tempo aceitável.
   */
  test("Medir o tempo de ordenação de A-Z", async () => {
    await testSortingPerformance("az", async () => {
      // Obtém os nomes dos itens após a ordenação
      const itemNames = await inventoryPage.getItemNames();

      // Ordena os nomes dos itens manualmente para comparação
      const sortedNames = [...itemNames].sort();

      // Verifica se os nomes dos itens estão ordenados corretamente
      expect(itemNames).toEqual(sortedNames);
    });
  });

  /**
   * Teste: Medir o tempo de ordenação de Z-A.
   * Verifica se a ordenação de Z-A é realizada dentro de um intervalo de tempo aceitável.
   */
  test("Medir o tempo de ordenação de Z-A", async () => {
    await testSortingPerformance("za", async () => {
      // Obtém os nomes dos itens após a ordenação
      const itemNames = await inventoryPage.getItemNames();

      // Ordena os nomes dos itens manualmente em ordem reversa para comparação
      const sortedNames = [...itemNames].sort().reverse();

      // Verifica se os nomes dos itens estão ordenados corretamente
      expect(itemNames).toEqual(sortedNames);
    });
  });

  /**
   * Teste: Medir o tempo de ordenação de menor preço para maior.
   * Verifica se a ordenação por preço (menor para maior) é realizada dentro de um intervalo de tempo aceitável.
   */
  test("Medir o tempo de ordenação de menor preço para maior", async () => {
    await testSortingPerformance("lohi", async () => {
      // Obtém os preços dos itens após a ordenação
      const itemPrices = await inventoryPage.getItemPrices();

      // Ordena os preços dos itens manualmente para comparação
      const sortedPrices = [...itemPrices].sort((a, b) => a - b);

      // Verifica se os preços dos itens estão ordenados corretamente
      expect(itemPrices).toEqual(sortedPrices);
    });
  });

  /**
   * Teste: Medir o tempo de ordenação de maior preço para menor.
   * Verifica se a ordenação por preço (maior para menor) é realizada dentro de um intervalo de tempo aceitável.
   */
  test("Medir o tempo de ordenação de maior preço para menor", async () => {
    await testSortingPerformance("hilo", async () => {
      // Obtém os preços dos itens após a ordenação
      const itemPrices = await inventoryPage.getItemPrices();

      // Ordena os preços dos itens manualmente em ordem reversa para comparação
      const sortedPrices = [...itemPrices].sort((a, b) => b - a);

      // Verifica se os preços dos itens estão ordenados corretamente
      expect(itemPrices).toEqual(sortedPrices);
    });
  });
});

/**
 * Testes de ordenação para o usuário `error_user`.
 * Este conjunto de testes verifica o comportamento da ordenação de itens na página de inventário
 * para o usuário `error_user`, que simula erros no sistema.
 */
test.describe("Testes de ordenação para error_user", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  /**
   * Credenciais de login para o usuário `error_user`.
   */
  const errorUserCredentials: LoginCredentials = {
    username: "error_user",
    password: "secret_sauce",
  };

  /**
   * Executa antes de cada teste: inicializa as páginas e faz login.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navega para a página de login
    await loginPage.navigate();

    // Realiza o login
    await loginPage.login(errorUserCredentials);
  });

  /**
   * Função auxiliar para verificar o alert de erro e a ordenação.
   * @param sortOption - A opção de ordenação ("az", "za", "lohi", "hilo").
   * @param getItemsFunction - Função para obter os itens antes e após a ordenação.
   */
  async function testErrorUserSorting(
    sortOption: 'az' | 'za' | 'lohi' | 'hilo',
    getItemsFunction: () => Promise<any[]>
  ) {
    // Obtém os itens antes da ordenação
    const itemsBeforeSort = await getItemsFunction();

    // Obtém o filtro selecionado antes da ordenação
    const selectedSortOptionBefore = await inventoryPage.getSelectedSortOption();

    // Configura o listener para capturar o alert
    let alertMessage = "";
    loginPage.getPage().on("dialog", async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    // Tenta ordenar os itens
    await inventoryPage.sortItems(sortOption);

    // Verifica se o alert foi exibido com a mensagem correta
    expect(alertMessage).toBe("Sorting is broken! This error has been reported to Backtrace.");

    // Obtém os itens após a tentativa de ordenação
    const itemsAfterSort = await getItemsFunction();

    // Obtém o filtro selecionado após a tentativa de ordenação
    const selectedSortOptionAfter = await inventoryPage.getSelectedSortOption();

    // Verifica se a lista não mudou
    expect(itemsAfterSort).toEqual(itemsBeforeSort);

    // Verifica se o filtro selecionado não mudou
    expect(selectedSortOptionAfter).toEqual(selectedSortOptionBefore);
  }

  /**
   * Teste: Verificar que um alert de erro aparece ao tentar ordenar de A-Z.
   * Verifica se um alert de erro é exibido ao tentar ordenar de A-Z e se a lista e o filtro permanecem inalterados.
   */
  test("Verificar que um alert de erro aparece ao tentar ordenar de A-Z", async () => {
    await testErrorUserSorting("az", async () => {
      return await inventoryPage.getItemNames();
    });
  });

  /**
   * Teste: Verificar que um alert de erro aparece ao tentar ordenar de Z-A.
   * Verifica se um alert de erro é exibido ao tentar ordenar de Z-A e se a lista e o filtro permanecem inalterados.
   */
  test("Verificar que um alert de erro aparece ao tentar ordenar de Z-A", async () => {
    await testErrorUserSorting("za", async () => {
      return await inventoryPage.getItemNames();
    });
  });

  /**
   * Teste: Verificar que um alert de erro aparece ao tentar ordenar por preço (menor para maior).
   * Verifica se um alert de erro é exibido ao tentar ordenar por preço (menor para maior) e se a lista e o filtro permanecem inalterados.
   */
  test("Verificar que um alert de erro aparece ao tentar ordenar por preço (menor para maior)", async () => {
    await testErrorUserSorting("lohi", async () => {
      return await inventoryPage.getItemPrices();
    });
  });

  /**
   * Teste: Verificar que um alert de erro aparece ao tentar ordenar por preço (maior para menor).
   * Verifica se um alert de erro é exibido ao tentar ordenar por preço (maior para menor) e se a lista e o filtro permanecem inalterados.
   */
  test("Verificar que um alert de erro aparece ao tentar ordenar por preço (maior para menor)", async () => {
    await testErrorUserSorting("hilo", async () => {
      return await inventoryPage.getItemPrices();
    });
  });
});