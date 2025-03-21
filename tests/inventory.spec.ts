import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { InventoryPage } from "../pages/inventoryPage";
import { LoginCredentials } from "../interfaces/login.interface";
import { InventoryItem } from "../interfaces/inventory.interface";

test.describe("Testes de Carrinho", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  const item: InventoryItem = {
    name: "Sauce Labs Backpack",
    price: 29.99,
    id: "sauce-labs-backpack",
    description: "carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection."
  };

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

  test("Adicionar item ao carrinho", async () => {
    await inventoryPage.addItemToCart(item);

    const cartItemCount = await inventoryPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    await inventoryPage.goToCart();

    const isItemInCart = await inventoryPage.checkCartItem(item);
    expect(isItemInCart).toBeTruthy();
  });

  test("Remover item do carrinho", async () => {
    await inventoryPage.addItemToCart(item);

    await inventoryPage.goToCart();

    await inventoryPage.removeItemFromCart(item);

    const isItemInCart = await inventoryPage.checkCartItem(item);
    expect(isItemInCart).toBeFalsy();
  });

  test("Verificar e remover produto do carrinho", async () => {
    await inventoryPage.goToCart();

    const isItemInCart = await inventoryPage.checkCartItem(item);

    if (isItemInCart) {
      await inventoryPage.removeItemFromCart({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
      });
    }

    const isItemRemoved = await inventoryPage.checkCartItem(item);
    expect(isItemRemoved).toBeFalsy();
  });
});
