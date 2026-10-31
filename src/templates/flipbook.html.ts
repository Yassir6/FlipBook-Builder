import type { BookSettings, PageData, PageTextData } from '../types';
import { generateCSS } from './flipbook.css';
import { generateJS } from './flipbook.js';
import { generateFlipSound } from '../services/soundService';

// SVG icons for the toolbar (inline, no external deps)
const ICONS = {
  chevronLeft: '<svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
  zoomIn: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  zoomOut: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>',
  maximize: '<svg viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
  thumbnails: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="6" height="16" rx="1"/><rect x="10" y="4" width="6" height="16" rx="1"/><rect x="18" y="4" width="4" height="16" rx="1"/></svg>',
  list: '<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  close: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  volume: '<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  download: '<svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
};

export function generateHTML(
  settings: BookSettings,
  pages: PageData[],
  textData: PageTextData[],
  pageFlipSource: string,
  originalPdfBase64: string,
  pdfFileName: string
): string {
  const dir = settings.direction;
  const lang = settings.language;
  const isRtl = dir === 'rtl';
  const title = settings.cover.title || 'FlipBook';
  const flipSound = settings.sound.enabled ? generateFlipSound(settings.sound.type) : '';

  const css = generateCSS(settings);
  const js = generateJS(settings, pages, textData, pageFlipSource, flipSound, originalPdfBase64, pdfFileName);
  const showDownloadButton = settings.exportOptions.downloadButton && originalPdfBase64.length > 0;

  const labels = lang === 'ar'
    ? { goTo: 'انتقل إلى صفحة', prev: 'السابق', next: 'التالي', toc: 'الفهرس', thumbnails: 'المصغرات', mute: 'كتم الصوت', download: 'تحميل الملف' }
    : { goTo: 'Go to page', prev: 'Previous', next: 'Next', toc: 'Contents', thumbnails: 'Thumbnails', mute: 'Mute', download: 'Download File' };

  const prevIcon = isRtl ? ICONS.chevronRight : ICONS.chevronLeft;
  const nextIcon = isRtl ? ICONS.chevronLeft : ICONS.chevronRight;

  const pageOffset = settings.cover.startFromZero ? -1 : 0;
  const pageLabel = lang === 'ar' ? 'صفحة' : 'Page';
  const displayPageCount = pages.length;

  // Generate ToC based on actual displayed pages count
  function generateTocHtml(): string {
    let html = '';
    for (let i = 0; i < displayPageCount; i++) {
      const displayPage = i + 1 + pageOffset;
      html += `<button class="toc-item" style="padding-inline-start:16px" data-page="${displayPage}"><span class="toc-title">${pageLabel} ${displayPage}</span><span class="toc-page">${displayPage}</span></button>`;
    }
    return html;
  }

  const tocHtml = generateTocHtml();

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
${css}
</style>
</head>
<body>

<!-- Table of Contents Panel -->

<div id="toc-panel" class="side-panel" style="display:none">
  <div class="panel-header">
    <h3>${labels.toc}</h3>
    <button class="panel-close" onclick="toggleToc()">${ICONS.close}</button>
  </div>
  <div class="panel-body">${tocHtml}</div>
</div>

<!-- Thumbnail Bar -->
<div id="thumb-bar" class="thumb-bar" style="display:none"></div>

<div id="book-container">
  <div class="book-wrapper">
    <div id="book"></div>
  </div>
</div>

<div id="toolbar">
  <div class="toolbar-section">
    <button id="btn-thumbs" class="icon-btn" title="${labels.thumbnails}">${ICONS.thumbnails}</button>
    <button id="btn-toc" class="icon-btn" title="${labels.toc}">${ICONS.list}</button>
    <div class="separator"></div>
  </div>
  <div class="toolbar-section">
    <button id="btn-prev" class="icon-btn" title="${labels.prev}">${prevIcon}</button>
    <span id="page-indicator" class="page-indicator"></span>
    <button id="btn-next" class="icon-btn" title="${labels.next}">${nextIcon}</button>
  </div>
  <div class="toolbar-section">
    <input id="go-to-input" type="number" class="go-to-input" placeholder="${labels.goTo}" min="1">
  </div>
  <div class="toolbar-section">
    <button id="btn-zoom-out" class="icon-btn">${ICONS.zoomOut}</button>
    <span id="zoom-label" class="zoom-label">100%</span>
    <button id="btn-zoom-in" class="icon-btn">${ICONS.zoomIn}</button>
    <div class="separator"></div>
    ${settings.sound.enabled ? `<button id="btn-mute" class="icon-btn" title="${labels.mute}">${ICONS.volume}</button>` : ''}
    ${showDownloadButton ? `<button id="btn-download" class="icon-btn" title="${labels.download}">${ICONS.download}</button>` : ''}
    <button id="btn-fullscreen" class="icon-btn">${ICONS.maximize}</button>
  </div>
</div>

<script>
${js}
</script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
