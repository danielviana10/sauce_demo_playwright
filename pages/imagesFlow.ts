import { Page } from "@playwright/test";
import { InventoryItem } from "../interfaces/inventory.interface";
import { getInventoryItems } from "../utils/getInventoryItems";
import { compareImages } from "../utils/imageComparator";

/**
 * Classe responsável por manipular e comparar imagens dos itens do inventário.
 * Oferece métodos para capturar screenshots dos itens e verificar se todas as imagens são idênticas.
 */
export class ImageFlow {
    private page: Page;

    /**
     * Construtor da classe ImageFlow.
     * @param page - Objeto Page do Playwright, usado para interagir com a página.
     */
    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Obtém os itens da lista de inventário.
     * @returns Um array de objetos contendo nome, descrição, preço e ID dos itens.
     */
    async getInventoryItems(): Promise<InventoryItem[]> {
        return getInventoryItems(this.page);
    }

    /**
     * Captura um screenshot de um item do inventário.
     * @param item - O item do inventário.
     * @param screenshotPath - Caminho para salvar o screenshot.
     */
    async takeItemScreenshot(item: InventoryItem, screenshotPath: string): Promise<void> {
        // Usa o seletor correto para o elemento da imagem
        const itemImageElement = this.page.locator(`[data-test="item-${item.id}-img-link"]`);

        // Espera o elemento estar visível antes de capturar o screenshot
        await itemImageElement.waitFor({ state: 'visible' });

        // Captura o screenshot
        await itemImageElement.screenshot({ path: screenshotPath });
    }

    /**
     * Verifica se todas as imagens da lista são iguais.
     * @returns `true` se todas as imagens forem iguais, caso contrário, `false`.
     * @example
     * const imageFlow = new ImageFlow(page);
     * const areImagesIdentical = await imageFlow.areAllImagesIdentical();
     * console.log(areImagesIdentical); // true ou false
     */
    async areAllImagesIdentical(): Promise<boolean> {
        const items = await this.getInventoryItems();

        // Captura screenshots de todos os itens
        const screenshotPaths: string[] = [];
        for (let i = 0; i < items.length; i++) {
            const screenshotPath = `screenshots/item_${i}.png`;
            await this.takeItemScreenshot(items[i], screenshotPath);
            screenshotPaths.push(screenshotPath);
        }

        // Compara todas as imagens com a primeira imagem
        const firstImagePath = screenshotPaths[0];
        for (let i = 1; i < screenshotPaths.length; i++) {
            const numDiffPixels = compareImages(firstImagePath, screenshotPaths[i]);

            // Se houver diferenças, retorna false
            if (numDiffPixels > 0) {
                return false;
            }
        }

        return true;
    }
}