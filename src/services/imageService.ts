import type { PageData } from '../types';
import { splitPageImage, generateThumbnail } from '../utils/canvas';

/**
 * Process pages for spread mode: split each page into left and right halves.
 * Always produces pages in left-then-right order. RTL reversal happens in the display layer.
 */
export async function createSpreadPages(
  pages: PageData[]
): Promise<PageData[]> {
  const spreadPages: PageData[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]!;
    // Always split as LTR (left first, right second) — direction reversal is in FlipBook.tsx
    const [left, right] = await splitPageImage(page.imageData, 'ltr');
    const halfWidth = Math.floor(page.width / 2);

    spreadPages.push({
      index: spreadPages.length,
      imageData: left,
      width: halfWidth,
      height: page.height,
    });

    spreadPages.push({
      index: spreadPages.length,
      imageData: right,
      width: halfWidth,
      height: page.height,
    });
  }

  return spreadPages;
}

/**
 * Generate thumbnails for all pages.
 */
export async function createThumbnails(
  pages: PageData[],
  maxWidth: number = 150
): Promise<string[]> {
  const thumbnails: string[] = [];
  for (const page of pages) {
    const thumb = await generateThumbnail(page.imageData, maxWidth);
    thumbnails.push(thumb);
  }
  return thumbnails;
}
