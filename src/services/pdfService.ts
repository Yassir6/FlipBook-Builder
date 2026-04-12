import * as pdfjsLib from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PageData, PageTextData, TextItem, PDFMetadata, OutlineItem, ProcessingProgress } from '../types';
import { PDF_RENDER_SCALE, BATCH_SIZE } from '../utils/constants';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export async function loadPdf(data: ArrayBuffer): Promise<PDFDocumentProxy> {
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  return pdf;
}

export async function getPdfMetadata(pdf: PDFDocumentProxy): Promise<PDFMetadata> {
  const metadata = await pdf.getMetadata();
  const firstPage = await pdf.getPage(1);
  const viewport = firstPage.getViewport({ scale: 1 });

  return {
    title: (metadata.info as Record<string, string>)?.Title || '',
    author: (metadata.info as Record<string, string>)?.Author || '',
    pageCount: pdf.numPages,
    pageWidth: viewport.width,
    pageHeight: viewport.height,
  };
}

export async function renderPage(
  pdf: PDFDocumentProxy,
  pageNum: number,
  scale: number = PDF_RENDER_SCALE
): Promise<PageData> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext('2d')!;

  await page.render({ canvasContext: ctx, viewport }).promise;

  const imageData = canvas.toDataURL('image/png');
  const width = viewport.width;
  const height = viewport.height;

  // Clean up canvas to free memory
  canvas.width = canvas.height = 0;

  return {
    index: pageNum - 1,
    imageData,
    width,
    height,
  };
}

export async function extractPageText(
  pdf: PDFDocumentProxy,
  pageNum: number
): Promise<PageTextData> {
  const page = await pdf.getPage(pageNum);
  const textContent = await page.getTextContent();
  const viewport = page.getViewport({ scale: 1 });

  const items: TextItem[] = textContent.items
    .filter((item): item is typeof item & { str: string } => 'str' in item && item.str.trim().length > 0)
    .map((item) => {
      const tx = (item as Record<string, unknown>).transform as number[];
      return {
        str: (item as Record<string, unknown>).str as string,
        x: tx[4]!,
        y: viewport.height - tx[5]!,
        width: (item as Record<string, unknown>).width as number,
        height: (item as Record<string, unknown>).height as number,
      };
    });

  const fullText = items.map((item) => item.str).join(' ');

  return {
    pageIndex: pageNum - 1,
    items,
    fullText,
  };
}

export async function getOutline(pdf: PDFDocumentProxy): Promise<OutlineItem[]> {
  // Try to get PDF's built-in outline
  const outline = await pdf.getOutline();
  const outlineTitles = new Map<number, string>();

  if (outline) {
    await extractOutlineTitles(pdf, outline as unknown[], outlineTitles);
  }

  // Generate a complete ToC entry for every page
  const total = pdf.numPages;
  const result: OutlineItem[] = [];
  for (let i = 0; i < total; i++) {
    const title = outlineTitles.get(i) || '';
    result.push({ title, pageIndex: i, children: [] });
  }
  return result;
}

async function extractOutlineTitles(
  pdf: PDFDocumentProxy,
  items: unknown[],
  map: Map<number, string>
): Promise<void> {
  for (const item of items) {
    const entry = item as Record<string, unknown>;
    let pageIndex = 0;

    if (entry.dest) {
      try {
        const dest = typeof entry.dest === 'string'
          ? await pdf.getDestination(entry.dest)
          : entry.dest as unknown[];
        if (dest && Array.isArray(dest)) {
          const ref = dest[0];
          if (ref) {
            pageIndex = await pdf.getPageIndex(ref as never);
          }
        }
      } catch {
        // Skip unresolvable destinations
      }
    }

    const title = (entry.title as string) || '';
    if (title && !map.has(pageIndex)) {
      map.set(pageIndex, title);
    }

    if (entry.items) {
      await extractOutlineTitles(pdf, entry.items as unknown[], map);
    }
  }
}

export async function processAllPages(
  pdf: PDFDocumentProxy,
  onProgress: (progress: ProcessingProgress) => void
): Promise<{ pages: PageData[]; textData: PageTextData[] }> {
  const total = pdf.numPages;
  const pages: PageData[] = [];
  const textData: PageTextData[] = [];

  // Process in batches
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE, total);
    const batchPromises: Promise<void>[] = [];

    for (let j = i; j < batchEnd; j++) {
      const pageNum = j + 1;
      batchPromises.push(
        (async () => {
          const [pageData, textContent] = await Promise.all([
            renderPage(pdf, pageNum),
            extractPageText(pdf, pageNum),
          ]);
          pages[j] = pageData;
          textData[j] = textContent;
        })()
      );
    }

    await Promise.all(batchPromises);

    onProgress({
      phase: 'rendering',
      current: batchEnd,
      total,
      percent: Math.round((batchEnd / total) * 100),
    });
  }

  return { pages, textData };
}
