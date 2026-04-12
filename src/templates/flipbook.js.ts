import type { BookSettings, PageData, PageTextData } from '../types';
import { SIZE_PRESETS, BINDING_PRESETS } from '../utils/constants';

export function generateJS(
  settings: BookSettings,
  pages: PageData[],
  textData: PageTextData[],
  pageFlipSource: string,
  flipSoundBase64: string
): string {
  const isRtl = settings.direction === 'rtl';
  const totalPages = pages.length;
  const isSpread = settings.displayMode === 'spread';

  // Determine page aspect ratio from first page
  const firstPage = pages[0];
  const pageAspect = firstPage ? (firstPage.width / firstPage.height) : 0.707;

  // Fixed size presets
  let fixedWidth = 0, fixedHeight = 0;
  if (settings.size.preset === 'custom') {
    fixedWidth = settings.size.width / 2;
    fixedHeight = settings.size.height;
  } else if (settings.size.preset !== 'auto') {
    const preset = SIZE_PRESETS[settings.size.preset];
    fixedWidth = preset.width / 2;
    fixedHeight = preset.height;
  }

  // Serialize page data — handle RTL reversal
  // Normal mode: simple reverse so book opens from "back" (Arabic style).
  // Spread mode: reverse the order of PAIRS but keep each pair [L, R] intact.
  // [L1, R1, L2, R2] → [L2, R2, L1, R1]
  let displayPages: PageData[];
  if (isRtl) {
    if (isSpread) {
      displayPages = [];
      for (let i = pages.length - 2; i >= 0; i -= 2) {
        displayPages.push(pages[i]!);
        if (pages[i + 1]) displayPages.push(pages[i + 1]!);
      }
    } else {
      displayPages = [...pages].reverse();
    }
  } else {
    displayPages = pages;
  }

  const pageImages = JSON.stringify(displayPages.map((p) => p.imageData));

  const labels = settings.language === 'ar'
    ? { page: 'صفحة', of: 'من', goTo: 'انتقل إلى صفحة' }
    : { page: 'Page', of: 'of', goTo: 'Go to page' };

  return `
// ===== StPageFlip Library =====
${pageFlipSource}

// ===== FlipBook Application =====
(function() {
  'use strict';

  var PAGES = ${pageImages};
  var TOTAL_PAGES = ${totalPages};
  var IS_RTL = ${isRtl};
  var IS_SPREAD = ${isSpread};
  var SOUND_ENABLED = ${settings.sound.enabled};
  var FLIP_SOUND = "${flipSoundBase64}";
  var PAGE_ASPECT = ${pageAspect};
  var FIXED_W = ${fixedWidth};
  var FIXED_H = ${fixedHeight};
  var COVER_MODE = '${settings.cover.mode}';
  var SHOW_COVER = COVER_MODE !== 'none';
  var HAS_CUSTOM_COVER = COVER_MODE === 'custom';
  var START_FROM_ZERO = ${settings.cover.startFromZero};
  var PAGE_OFFSET = START_FROM_ZERO ? -1 : 0;
  var SWAP_NAV = IS_RTL;

  var zoomLevel = 100;
  var bookEl = document.getElementById('book');
  var wrapper = document.querySelector('.book-wrapper');
  var container = document.getElementById('book-container');

  // ===== Compute size to fill viewport =====
  function computeSize() {
    if (FIXED_W > 0 && FIXED_H > 0) return { w: FIXED_W, h: FIXED_H };
    var rect = container.getBoundingClientRect();
    var availW = rect.width * 0.92;
    var availH = rect.height * 0.90;
    var maxPageW = availW / 2;
    var maxPageH = availH;
    var pw, ph;
    if (maxPageW / maxPageH > PAGE_ASPECT) {
      ph = maxPageH; pw = ph * PAGE_ASPECT;
    } else {
      pw = maxPageW; ph = pw / PAGE_ASPECT;
    }
    return { w: Math.round(pw), h: Math.round(ph) };
  }

  // ===== Create pages =====
  // For RTL: swap cover positions so front cover is last in DOM (shown first when book opens from right)
  if (HAS_CUSTOM_COVER) {
    var firstCover = document.createElement('div');
    if (IS_RTL) {
      // Back cover first in DOM for RTL
      firstCover.className = 'cover-page back';
      ${settings.cover.backCoverImage ? `
      var firstCoverImg = document.createElement('img');
      firstCoverImg.src = ${JSON.stringify(settings.cover.backCoverImage)};
      firstCoverImg.className = 'cover-img';
      firstCover.appendChild(firstCoverImg);
      ` : ''}
    } else {
      // Front cover first in DOM for LTR
      firstCover.className = 'cover-page front';
      ${settings.cover.frontCoverImage ? `
      var firstCoverImg = document.createElement('img');
      firstCoverImg.src = ${JSON.stringify(settings.cover.frontCoverImage)};
      firstCoverImg.className = 'cover-img';
      firstCover.appendChild(firstCoverImg);
      ` : `
      ${settings.cover.logoData ? `
      var logo = document.createElement('img');
      logo.src = ${JSON.stringify(settings.cover.logoData)};
      logo.className = 'cover-logo';
      firstCover.appendChild(logo);
      ` : ''}
      ${settings.cover.title ? `
      var titleEl = document.createElement('h2');
      titleEl.className = 'cover-title';
      titleEl.textContent = ${JSON.stringify(settings.cover.title)};
      firstCover.appendChild(titleEl);
      ` : ''}
      `}
    }
    bookEl.appendChild(firstCover);
  }

  // Content pages
  PAGES.forEach(function(src, i) {
    var div = document.createElement('div');
    div.className = 'page';
    var img = document.createElement('img');
    img.src = src;
    img.alt = 'Page ' + (i + 1);
    div.appendChild(img);
    bookEl.appendChild(div);
  });

  if (HAS_CUSTOM_COVER) {
    var lastCover = document.createElement('div');
    if (IS_RTL) {
      // Front cover last in DOM for RTL
      lastCover.className = 'cover-page front';
      ${settings.cover.frontCoverImage ? `
      var lastCoverImg = document.createElement('img');
      lastCoverImg.src = ${JSON.stringify(settings.cover.frontCoverImage)};
      lastCoverImg.className = 'cover-img';
      lastCover.appendChild(lastCoverImg);
      ` : `
      ${settings.cover.logoData ? `
      var logo2 = document.createElement('img');
      logo2.src = ${JSON.stringify(settings.cover.logoData)};
      logo2.className = 'cover-logo';
      lastCover.appendChild(logo2);
      ` : ''}
      ${settings.cover.title ? `
      var titleEl2 = document.createElement('h2');
      titleEl2.className = 'cover-title';
      titleEl2.textContent = ${JSON.stringify(settings.cover.title)};
      lastCover.appendChild(titleEl2);
      ` : ''}
      `}
    } else {
      // Back cover last in DOM for LTR
      lastCover.className = 'cover-page back';
      ${settings.cover.backCoverImage ? `
      var lastCoverImg = document.createElement('img');
      lastCoverImg.src = ${JSON.stringify(settings.cover.backCoverImage)};
      lastCoverImg.className = 'cover-img';
      lastCover.appendChild(lastCoverImg);
      ` : ''}
    }
    bookEl.appendChild(lastCover);
  }

  // ===== Initialize StPageFlip =====
  var size = computeSize();
  var pageFlip = new St.PageFlip(bookEl, {
    width: size.w,
    height: size.h,
    size: 'fixed',
    minWidth: 200,
    maxWidth: 4000,
    minHeight: 200,
    maxHeight: 4000,
    showCover: SHOW_COVER,
    drawShadow: ${BINDING_PRESETS[settings.binding.type].drawShadow},
    maxShadowOpacity: ${BINDING_PRESETS[settings.binding.type].maxShadowOpacity},
    flippingTime: ${BINDING_PRESETS[settings.binding.type].flippingTime},
    usePortrait: false,
    startZIndex: 0,
    autoSize: false,
    mobileScrollSupport: false,
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: ${BINDING_PRESETS[settings.binding.type].showPageCorners},
    disableFlipByClick: false,
    startPage: IS_RTL ? TOTAL_PAGES + (HAS_CUSTOM_COVER ? 1 : -1) : 0
  });

  pageFlip.loadFromHTML(bookEl.querySelectorAll(HAS_CUSTOM_COVER ? '.page, .cover-page' : '.page'));

  // ===== Resize handler =====
  var resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      if (FIXED_W > 0) return;
      var s = computeSize();
      pageFlip.updateFromParent && pageFlip.updateFromParent();
      // StPageFlip doesn't support dynamic resize well, so we scale the wrapper
      var origW = size.w * 2;
      var newW = s.w * 2;
      var scale = newW / origW;
      wrapper.style.transform = 'scale(' + scale * (zoomLevel / 100) + ')';
    }, 200);
  });

  // ===== Sound =====
  var audioCtx = null;
  var audioBuffer = null;
  var isMuted = false;

  function playSound() {
    if (!SOUND_ENABLED || !FLIP_SOUND || isMuted) return;
    try {
      if (!audioCtx) audioCtx = new AudioContext();
      if (!audioBuffer) {
        var base64 = FLIP_SOUND.split(',')[1];
        var bin = atob(base64);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        audioCtx.decodeAudioData(bytes.buffer.slice(0), function(buf) {
          audioBuffer = buf;
          playCurrent();
        });
        return;
      }
      playCurrent();
    } catch(e) {}
  }

  function playCurrent() {
    if (!audioBuffer || !audioCtx) return;
    var source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    var gain = audioCtx.createGain();
    gain.gain.value = 0.6;
    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
  }

  // ===== Page tracking =====
  var COVER_OFFSET = HAS_CUSTOM_COVER ? 2 : 0;
  var DISPLAY_TOTAL = TOTAL_PAGES + COVER_OFFSET + PAGE_OFFSET;
  var MIN_PAGE = PAGE_OFFSET < 0 ? 0 : 1;
  function updatePageIndicator() {
    var internal = pageFlip.getCurrentPageIndex();
    var total = TOTAL_PAGES + COVER_OFFSET;
    var start, end;
    if (SWAP_NAV) {
      end = Math.max(MIN_PAGE, total - internal + PAGE_OFFSET);
      start = Math.max(MIN_PAGE, end - 1);
    } else {
      start = internal + 1 + PAGE_OFFSET;
      end = Math.min(DISPLAY_TOTAL, internal + 2 + PAGE_OFFSET);
    }
    var indicator = document.getElementById('page-indicator');
    if (start === end) {
      indicator.textContent = '${labels.page} ' + start + ' ${labels.of} ' + DISPLAY_TOTAL;
    } else {
      indicator.textContent = '${labels.page} ' + start + ' - ' + end + ' ${labels.of} ' + DISPLAY_TOTAL;
    }
  }

  pageFlip.on('flip', function() {
    updatePageIndicator();
    playSound();
  });

  updatePageIndicator();

  // ===== Navigation =====
  document.getElementById('btn-prev').addEventListener('click', function() {
    if (SWAP_NAV) pageFlip.flipNext(); else pageFlip.flipPrev();
  });

  document.getElementById('btn-next').addEventListener('click', function() {
    if (SWAP_NAV) pageFlip.flipPrev(); else pageFlip.flipNext();
  });

  var goToInput = document.getElementById('go-to-input');
  goToInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      var page = parseInt(goToInput.value);
      if (page >= MIN_PAGE && page <= DISPLAY_TOTAL) {
        goToDisplayPage(page);
        goToInput.value = '';
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowLeft') {
      if (SWAP_NAV) pageFlip.flipPrev(); else pageFlip.flipNext();
    } else if (e.key === 'ArrowRight') {
      if (SWAP_NAV) pageFlip.flipNext(); else pageFlip.flipPrev();
    }
  });

  // ===== Scroll to flip =====
  var scrollTimeout = null;
  container.addEventListener('wheel', function(e) {
    e.preventDefault();
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(function() { scrollTimeout = null; }, 400);
    if (e.deltaY > 0) {
      if (SWAP_NAV) pageFlip.flipPrev(); else pageFlip.flipNext();
    } else if (e.deltaY < 0) {
      if (SWAP_NAV) pageFlip.flipNext(); else pageFlip.flipPrev();
    }
  }, { passive: false });

  // ===== Zoom =====
  var zoomLevels = [50, 75, 100, 150, 200];
  var zoomLabel = document.getElementById('zoom-label');

  function updateZoom() {
    wrapper.style.transform = 'scale(' + (zoomLevel / 100) + ')';
    zoomLabel.textContent = zoomLevel + '%';
  }

  document.getElementById('btn-zoom-in').addEventListener('click', function() {
    var idx = zoomLevels.indexOf(zoomLevel);
    if (idx < zoomLevels.length - 1) { zoomLevel = zoomLevels[idx + 1]; updateZoom(); }
  });

  document.getElementById('btn-zoom-out').addEventListener('click', function() {
    var idx = zoomLevels.indexOf(zoomLevel);
    if (idx > 0) { zoomLevel = zoomLevels[idx - 1]; updateZoom(); }
  });

  // ===== Fullscreen =====
  document.getElementById('btn-fullscreen').addEventListener('click', function() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  });

  // ===== Go to page (shared) =====
  function goToDisplayPage(displayPage) {
    var total = TOTAL_PAGES + COVER_OFFSET;
    var actualPage = displayPage - PAGE_OFFSET;
    var internal = SWAP_NAV ? total - actualPage : actualPage - 1;
    pageFlip.turnToPage(Math.max(0, Math.min(total - 1, internal)));
  }

  // ===== Thumbnails =====
  var thumbBar = document.getElementById('thumb-bar');
  var thumbsVisible = false;
  var btnThumbs = document.getElementById('btn-thumbs');

  // Build thumbnails — for RTL, iterate reversed so first page appears on the right
  function addThumb(src, pageNum) {
    var btn = document.createElement('button');
    btn.className = 'thumb-item';
    var img = document.createElement('img');
    img.src = src;
    var num = document.createElement('span');
    num.textContent = pageNum;
    btn.appendChild(img);
    btn.appendChild(num);
    btn.addEventListener('click', function() { goToDisplayPage(pageNum); });
    thumbBar.appendChild(btn);
  }

  if (IS_RTL) {
    for (var i = PAGES.length - 1; i >= 0; i--) {
      addThumb(PAGES[i], (TOTAL_PAGES - i) + PAGE_OFFSET);
    }
  } else {
    PAGES.forEach(function(src, i) {
      addThumb(src, (i + 1) + PAGE_OFFSET);
    });
  }

  function toggleThumbs() {
    thumbsVisible = !thumbsVisible;
    thumbBar.style.display = thumbsVisible ? 'flex' : 'none';
    btnThumbs.classList.toggle('active', thumbsVisible);
  }
  btnThumbs.addEventListener('click', toggleThumbs);

  // ===== Table of Contents =====
  var tocPanel = document.getElementById('toc-panel');
  var tocVisible = false;
  window.toggleToc = function() {
    tocVisible = !tocVisible;
    if (tocPanel) tocPanel.style.display = tocVisible ? 'flex' : 'none';
    var btnToc = document.getElementById('btn-toc');
    if (btnToc) btnToc.classList.toggle('active', tocVisible);
  };
  var btnToc = document.getElementById('btn-toc');
  if (btnToc) btnToc.addEventListener('click', function() { toggleToc(); });
  // Wire ToC item clicks
  if (tocPanel) {
    tocPanel.querySelectorAll('.toc-item').forEach(function(item) {
      item.addEventListener('click', function() {
        var page = parseInt(item.getAttribute('data-page'));
        if (!isNaN(page)) goToDisplayPage(page);
      });
    });
  }

  // ===== Mute toggle =====
  var btnMute = document.getElementById('btn-mute');
  if (btnMute) {
    btnMute.addEventListener('click', function() {
      isMuted = !isMuted;
      btnMute.classList.toggle('active', isMuted);
      btnMute.innerHTML = isMuted
        ? '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    });
  }

})();
`;
}
