import type { BookSettings, PageData, PageTextData } from '../types';
import { generateHTML } from '../templates/flipbook.html';

// Import the page-flip browser bundle as raw text for embedding
import pageFlipSource from 'page-flip/dist/js/page-flip.browser.js?raw';

/** Convert raw bytes to a base64 string for embedding in a data URL. */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

export async function exportAsHtml(
  settings: BookSettings,
  pages: PageData[],
  textData: PageTextData[],
  originalPdfBytes: Uint8Array | null = null,
  originalFileName: string | null = null
): Promise<void> {
  // If the user kept the download button enabled, embed the original PDF so
  // viewers get the exact same file (not a regenerated one).
  const embedPdf = settings.exportOptions.downloadButton && originalPdfBytes && originalPdfBytes.byteLength > 0;
  const originalPdfBase64 = embedPdf ? bytesToBase64(originalPdfBytes!) : '';
  const pdfFileName = originalFileName || `${settings.cover.title || 'flipbook'}.pdf`;

  // Generate the complete HTML string
  const html = generateHTML(settings, pages, textData, pageFlipSource, originalPdfBase64, pdfFileName);

  // Create a blob and trigger download
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${settings.cover.title || 'flipbook'}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
