import type { BookSettings, PageData, PageTextData } from '../types';
import { generateHTML } from '../templates/flipbook.html';

// Import the page-flip browser bundle as raw text for embedding
import pageFlipSource from 'page-flip/dist/js/page-flip.browser.js?raw';

export async function exportAsHtml(
  settings: BookSettings,
  pages: PageData[],
  textData: PageTextData[]
): Promise<void> {
  // Generate the complete HTML string
  const html = generateHTML(settings, pages, textData, pageFlipSource);

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
