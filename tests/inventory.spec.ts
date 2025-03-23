import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { LoginCredentials } from "../interfaces/login.interface";
import { PurchaseFlow } from "../pages/purchaseFlow";
import { FormCheckout } from "../interfaces/form.interface";
import { InventoryItem } from "../interfaces/inventory.interface";
import { CartPage } from "../pages/cartPage";
import { ImageFlow } from "../pages/imagesFlow";

/**
 * Testes de Carrinho com o usuário `standard_user`.
 * Este conjunto de testes verifica o comportamento do carrinho de compras ao adicionar e remover itens,
 * além de validar os dados dos produtos entre a lista de inventário e a página de detalhes.
 */
test.describe("Testes de Carrinho com standard_user", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let purchaseFlow: PurchaseFlow;

  /**
   * Credenciais de login válidas para o usuário `standard_user`.
   */
  const credentials: LoginCredentials = {
    username: "standard_user",
    password: "secret_sauce",
  };

  /**
   * Executa antes de cada teste: inicializa as páginas e faz login.
   */
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    purchaseFlow = new PurchaseFlow(page);

    await loginPage.navigate();
    await loginPage.login(credentials);
  });

  /**
   * Teste: Adicionar vários itens ao carrinho.
   * Verifica se é possível adicionar todos os itens da lista de inventário ao carrinho
   * e se a quantidade de itens no carrinho está correta.
   */
  test("Adicionar vários itens ao carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items: InventoryItem[] = await inventoryPage.getInventoryItems();

    // Adiciona cada item ao carrinho
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    // Verifica se a quantidade de itens no carrinho está correta
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(items.length);

    // Navega para o carrinho e verifica se todos os itens estão presentes
    await inventoryPage.goToCart();

    for (const item of items) {
      const isItemInCart = await cartPage.checkCartItem(item);
      expect(isItemInCart).toBeTruthy();
    }
  });

  /**
   * Teste: Adicionar um item específico ao carrinho.
   * Verifica se é possível adicionar um item específico ao carrinho
   * e se o item aparece corretamente no carrinho.
   */
  test("Adicionar item ao carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();
    const item = items[0];

    await inventoryPage.addItemToCart(item);

    // Verifica se a quantidade de itens no carrinho é 1
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // Navega para o carrinho e verifica se o item está presente
    await inventoryPage.goToCart();
    const isItemInCart = await cartPage.checkCartItem(item);
    expect(isItemInCart).toBeTruthy();
  });

  /**
   * Teste: Validar dados do produto entre a lista e o link do produto no usuário comum.
   * Verifica se os dados do produto (nome, preço, descrição e imagem) são consistentes
   * entre a lista de inventário e a página de detalhes do produto.
   */
  test('Validar se todos os itens são iguais entre a lista e o detalhamento', async () => {
    // Obtém os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();

    // Itera sobre todos os itens da lista de inventário
    for (const item of items) {
      // Clica no título do item para acessar a página de detalhes
      await purchaseFlow.clickItemTitle(item);

      // Obtém os dados do item na página de detalhes
      const itemNameInDetails = await purchaseFlow.getItemDetailsName();
      const itemPriceInDetails = await purchaseFlow.getItemDetailsPrice();
      const itemDescriptionInDetails = await purchaseFlow.getItemDetailsDescription();
      const itemImageSrcInDetails = await purchaseFlow.getItemDetailsImageSrc();

      // Verifica se os dados do item na página de detalhes são iguais aos dados do item clicado
      expect(itemNameInDetails).toBe(item.name);
      expect(itemPriceInDetails).toBe(item.price);
      expect(itemDescriptionInDetails).toBe(item.description);

      // Volta para a lista de inventário
      await purchaseFlow.backToHome();
    }
  });
});

/**
 * Testes de Carrinho com o usuário `problem_user`.
 * Este conjunto de testes verifica o comportamento do carrinho de compras ao adicionar e remover itens
 * com o usuário `problem_user`, que simula problemas no sistema.
 */
test.describe("Testes de Carrinho com problem_user", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let purchaseFlow: PurchaseFlow;
  let imageFlow: ImageFlow;

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
    purchaseFlow = new PurchaseFlow(page);
    imageFlow = new ImageFlow(page);

    await loginPage.navigate();
    await loginPage.login(problemUserCredentials);
  });

  /**
   * Teste: Verificar se todas as imagens da lista são iguais.
   * Verifica se todas as imagens dos itens na lista de inventário são iguais,
   * o que é um comportamento esperado para o usuário `problem_user`.
   */
  test("Verificar se todas as imagens da lista são iguais", async () => {
    const areAllIdentical = await imageFlow.areAllImagesIdentical();
    // Espera que todas as imagens sejam iguais
    expect(areAllIdentical).toBe(true);
  });

  /**
   * Teste: Verificar se o botão "Remove" não volta para "Add to cart".
   * Verifica se o botão "Remove" não muda para "Add to cart" após remover um item,
   * o que é um comportamento esperado para o usuário `problem_user`.
   */
  test("Verificar comportamento do botão Remove com problem_user", async () => {
    // Obtém os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();
    const item = items[0];

    // Adiciona o item ao carrinho
    await inventoryPage.addItemToCart(item);

    // Verifica se o botão "Remove" está visível
    const isRemoveButtonVisible = await inventoryPage.isRemoveButtonVisible(item);
    // Espera que o botão "Remove" esteja visível
    expect(isRemoveButtonVisible).toBe(true);

    // Remove o item do carrinho
    await inventoryPage.removeItemFromCart(item);

    // Verifica se o botão "Add to cart" NÃO está visível
    const isAddToCartButtonVisible = await inventoryPage.isAddToCartButtonVisible(item);
    // Espera que o botão "Add to cart" NÃO esteja visível
    expect(isAddToCartButtonVisible).toBe(false);
  });

  /**
   * Teste: Validar dados do produto entre a lista e o link do produto no usuário com problema.
   * Verifica se os dados do produto (nome, preço, descrição e imagem) são diferentes
   * entre a lista de inventário e a página de detalhes do produto,
   * o que é um comportamento esperado para o usuário `problem_user`.
   */
  test('Validar se todos os itens são diferentes entre a lista e o detalhamento', async () => {
    // Obtém os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();

    // Itera sobre todos os itens da lista de inventário
    for (const item of items) {
      // Clica no título do item para acessar a página de detalhes
      await purchaseFlow.clickItemTitle(item);

      // Obtém os dados do item na página de detalhes
      const itemNameInDetails = await purchaseFlow.getItemDetailsName();
      const itemPriceInDetails = await purchaseFlow.getItemDetailsPrice();
      const itemDescriptionInDetails = await purchaseFlow.getItemDetailsDescription();
      const itemImageSrcInDetails = await purchaseFlow.getItemDetailsImageSrc();

      // Verifica se os dados do item na página de detalhes são diferentes dos dados do item clicado
      expect(itemNameInDetails).not.toBe(item.name);
      expect(itemPriceInDetails).not.toBe(item.price);
      expect(itemDescriptionInDetails).not.toBe(item.description);

      // Verifica se a imagem é diferente OU é a imagem padrão (sl-404)
      expect(
        itemImageSrcInDetails !== item.imageSrc || itemImageSrcInDetails.includes('sl-404')
      ).toBeTruthy();

      // Volta para a lista de inventário
      await purchaseFlow.backToHome();
    }
  });
});