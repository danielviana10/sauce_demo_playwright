/**
 * Interface que representa um item do inventário.
 */
export interface InventoryItem {
  /**
   * O nome do item.
   */
  name: string;

  /**
   * O preço do item.
   */
  price: number;

  /**
   * O ID único do item.
   */
  id: string;

  /**
   * A descrição do item.
   */
  description: string;

  /**
   * O caminho da imagem do item (opcional).
   */
  imageSrc?: string;
}