import { readFileSync, writeFileSync } from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

/**
 * Compara duas imagens e retorna o número de pixels diferentes.
 * @param imgPath1 - Caminho da primeira imagem.
 * @param imgPath2 - Caminho da segunda imagem.
 * @param diffPath - Caminho para salvar a imagem de diferença (opcional).
 * @returns Número de pixels diferentes.
 * @throws {Error} Se as imagens não tiverem o mesmo tamanho.
 */
export function compareImages(imgPath1: string, imgPath2: string, diffPath?: string): number {
    // Carrega as imagens
    const img1 = PNG.sync.read(readFileSync(imgPath1));
    const img2 = PNG.sync.read(readFileSync(imgPath2));

    // Verifica se as imagens têm o mesmo tamanho
    if (img1.width !== img2.width || img1.height !== img2.height) {
        throw new Error('As imagens devem ter o mesmo tamanho.');
    }

    // Cria uma imagem de diferença (opcional)
    const diff = new PNG({ width: img1.width, height: img1.height });

    // Compara as imagens
    const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        img1.width,
        img1.height,
        { threshold: 0.1 }
    );

    // Salva a imagem de diferença
    if (diffPath) {
        writeFileSync(diffPath, PNG.sync.write(diff));
    }

    return numDiffPixels;
}