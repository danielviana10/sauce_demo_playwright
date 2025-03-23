import { Page } from "@playwright/test";
import { InventoryItem } from "../interfaces/inventory.interface";

/**
 * Extrai os itens da lista de inventário.
 * @param page - A instância da página do Playwright.
 * @returns Um array de objetos contendo nome, descrição, preço, ID e src da imagem dos itens.
 * @throws {Error} Se não for possível extrair o ID ou a imagem de um item.
 */
export async function getInventoryItems(page: Page): Promise<InventoryItem[]> {
    const items: InventoryItem[] = [];
    const itemElements = await page.locator('.inventory_item').all();

    for (const itemElement of itemElements) {
        // Obtém o nome do item
        const name = await itemElement.locator('[data-test="inventory-item-name"]').innerText();

        // Obtém a descrição do item
        const description = await itemElement.locator('[data-test="inventory-item-desc"]').innerText();

        // Obtém o preço do item
        const priceText = await itemElement.locator('[data-test="inventory-item-price"]').innerText();
        const price = parseFloat(priceText.replace('$', ''));

        // Obtém o número do ID do item a partir do link do título
        const titleLink = itemElement.locator('[data-test^="item-"][data-test$="-title-link"]');
        const dataTestAttribute = await titleLink.getAttribute('data-test');
        const id = dataTestAttribute?.match(/\d+/)?.[0];

        if (!id) {
            throw new Error(`Não foi possível extrair o ID do item: ${dataTestAttribute}`);
        }

        // Obtém o src da imagem do item
        const imageSrc = await itemElement.locator('img.inventory_item_img').getAttribute('src');

        if (!imageSrc) {
            throw new Error(`Não foi possível extrair a imagem do item: ${imageSrc}`);
        }

        // Adiciona o item à lista
        items.push({ name, description, price, id, imageSrc });
    }

    return items;
}