import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { LoginCredentials } from "../interfaces/login.interface";
import { PurchaseFlow } from "../pages/purchaseFlow";
import { FormCheckout } from "../interfaces/form.interface";
import { InventoryItem } from "../interfaces/inventory.interface";

test.describe("Testes de Carrinho", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let purchaseFlow: PurchaseFlow;

  // Credenciais de login válidas
  const credentials: LoginCredentials = {
    username: "standard_user",
    password: "secret_sauce",
  };

  // Dados do formulário de checkout
  const data: FormCheckout = {
    firstName: 'Daniel',
    lastName: 'Viana',
    zipCode: '06406150',
  };

  // Executa antes de cada teste: inicializa as páginas e faz login
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    purchaseFlow = new PurchaseFlow(page);

    await loginPage.navigate();
    await loginPage.login(credentials);
  });

  /*
  * Teste: Adicionar vários itens ao carrinho
  */
  test("Adicionar vários itens ao carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items: InventoryItem[] = await inventoryPage.getInventoryItems();

    // Adiciona cada item ao carrinho
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    // Verifica se a quantidade de itens no carrinho está correta
    const cartItemCount = await inventoryPage.getCartItemCount();
    expect(cartItemCount).toBe(items.length);

    // Navega para o carrinho e verifica se todos os itens estão presentes
    await inventoryPage.goToCart();

    for (const item of items) {
      const isItemInCart = await inventoryPage.checkCartItem(item);
      expect(isItemInCart).toBeTruthy();
    }
  });

  /*
  * Teste: Adicionar um item específico ao carrinho
  */
  test("Adicionar item ao carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();
    const item = items[0]; // Usa o primeiro item da lista

    await inventoryPage.addItemToCart(item);

    // Verifica se a quantidade de itens no carrinho é 1
    const cartItemCount = await inventoryPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // Navega para o carrinho e verifica se o item está presente
    await inventoryPage.goToCart();
    const isItemInCart = await inventoryPage.checkCartItem(item);
    expect(isItemInCart).toBeTruthy();
  });

  /*
  * Teste: Remover todos os itens do carrinho
  */
  test("Remover todos os itens do carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();

    // Adiciona todos os itens ao carrinho
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    // Navega para o carrinho e remove cada item
    await inventoryPage.goToCart();
    for (const item of items) {
      await inventoryPage.removeItemFromCart(item);
    }

    // Verifica se todos os itens foram removidos
    for (const item of items) {
      const isItemInCart = await inventoryPage.checkCartItem(item);
      expect(isItemInCart).toBeFalsy();
    }
  });


  /*
  * Teste: Remover um item específico do carrinho
  */
  test("Remover item do carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();
    const item = items[0]; // Usa o primeiro item da lista

    await inventoryPage.addItemToCart(item);

    // Navega para o carrinho e remove o item
    await inventoryPage.goToCart();
    await inventoryPage.removeItemFromCart(item);

    // Verifica se o item foi removido
    const isItemInCart = await inventoryPage.checkCartItem(item);
    expect(isItemInCart).toBeFalsy();
  });

  /*
  * Teste: Verificar e remover um produto do carrinho (se estiver presente)
  */
  test("Verificar e remover produto do carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();
    const item = items[0]; // Usa o primeiro item da lista

    await inventoryPage.goToCart();

    // Verifica se o item está no carrinho
    const isItemInCart = await inventoryPage.checkCartItem(item);

    // Se o item estiver no carrinho, remove-o
    if (isItemInCart) {
      await inventoryPage.removeItemFromCart(item);
    }

    // Verifica se o item foi removido
    const isItemRemoved = await inventoryPage.checkCartItem(item);
    expect(isItemRemoved).toBeFalsy();
  });

  /*
  * Teste: Remover um item específico do carrinho (mantendo outros itens)
  */
  test("Remover um item específico do carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();

    // Adiciona todos os itens ao carrinho
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    // Navega para o carrinho e remove o primeiro item
    await inventoryPage.goToCart();
    await inventoryPage.removeItemFromCart(items[0]);

    // Verifica se o primeiro item foi removido
    const isFirstItemInCart = await inventoryPage.checkCartItem(items[0]);
    expect(isFirstItemInCart).toBeFalsy();

    // Verifica se o segundo item ainda está no carrinho
    const isSecondItemInCart = await inventoryPage.checkCartItem(items[1]);
    expect(isSecondItemInCart).toBeTruthy();
  });

  /*
  * Teste: Verificar se os itens do carrinho correspondem aos adicionados
  */
  test("Verificar se os itens do carrinho são os mesmos que foram adicionados", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();

    // Adiciona todos os itens ao carrinho
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    // Navega para o carrinho e verifica se os itens correspondem
    await inventoryPage.goToCart();

    for (const item of items) {
      const itemNameInCart = await inventoryPage.getCartItemName(item);
      expect(itemNameInCart).toBe(item.name);

      const itemDescriptionInCart = await inventoryPage.getCartItemDescription(item);
      expect(itemDescriptionInCart).toBe(item.description);

      const itemPriceInCart = await inventoryPage.getCartItemPrice(item);
      expect(itemPriceInCart).toBe(item.price);
    }
  });

  /*
  * Teste: Verificar se os itens do checkout são os mesmos itens do carrinho
  */
  test("Verificar se os itens do checkout são os mesmos itens do carrinho", async () => {
    // Extrai os itens da lista de inventário
    const items = await inventoryPage.getInventoryItems();

    // Adiciona todos os itens ao carrinho
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    // Navega para o carrinho e obtém os itens
    await inventoryPage.goToCart();
    const cartItems = await inventoryPage.getInventoryItems();

    // Inicia o checkout, preenche o formulário e navega para a página de checkout overview
    await purchaseFlow.startCheckout();
    await purchaseFlow.fillCheckoutForm(data);
    await purchaseFlow.continueToCheckoutOverview();

    // Obtém os itens do checkout overview
    const checkoutOverviewItems = await inventoryPage.getInventoryItems();

    // Compara os itens do carrinho com os do checkout overview
    expect(cartItems).toEqual(checkoutOverviewItems);
  });
});