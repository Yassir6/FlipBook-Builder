import { useRef, useState, useCallback, useMemo, useEffect, forwardRef, type RefObject } from 'react';
import HTMLFlipBook from 'react-pageflip';
import type { PdfData } from '../../hooks/usePdfProcessor';
import { useBookSettings } from '../../hooks/useBookSettings';
import { useTranslation } from '../../i18n';
import { useFullscreen } from '../../hooks/useFullscreen';
import { playFlipSound } from '../../services/soundService';
import { SIZE_PRESETS, BORDER_THICKNESS_VALUES, BINDING_PRESETS } from '../../utils/constants';
import Toolbar from './Toolbar';
import ThumbnailBar from './ThumbnailBar';
import TableOfContents from './TableOfContents';
import styles from './FlipBook.module.css';

interface FlipBookProps {
  pdfData: PdfData;
  containerRef: RefObject<HTMLDivElement | null>;
  onExport?: () => Promise<void>;
  onDownloadPdf?: () => Promise<void>;
}

// Page component that react-pageflip requires
const BookPage = forwardRef<HTMLDivElement, { imageData: string; pageNum: number }>(
  ({ imageData, pageNum }, ref) => (
    <div className={styles.page} ref={ref} data-page={pageNum}>
      <img src={imageData} alt={`Page ${pageNum}`} className={styles.pageImage} />
    </div>
  )
);
BookPage.displayName = 'BookPage';

// Cover page component
const CoverPage = forwardRef<
  HTMLDivElement,
  { color: string; imageData?: string | null; title?: string; titleColor?: string; titleSize?: number; logoData?: string | null }
>(({ color, imageData, title, titleColor, titleSize, logoData }, ref) => (
  <div className={styles.coverPage} ref={ref} style={{ background: imageData ? 'none' : color }}>
    {imageData ? (
      <img src={imageData} alt="" className={styles.coverImage} />
    ) : (
      <>
        {logoData && <img src={logoData} alt="" className={styles.coverLogo} />}
        {title && (
          <h2
            className={styles.coverTitle}
            style={{ color: titleColor, fontSize: `${titleSize}px` }}
          >
            {title}
          </h2>
        )}
      </>
    )}
  </div>
));
CoverPage.displayName = 'CoverPage';

export default function FlipBook({ pdfData, containerRef, onExport: _onExport, onDownloadPdf }: FlipBookProps) {
  const { settings } = useBookSettings();
  const { t } = useTranslation();
  const bookRef = useRef<any>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [containerSize, setContainerSize] = useState({ width: 1200, height: 800 });
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Reset page when mode or direction changes
  useEffect(() => {
    setCurrentPage(0);
  }, [settings.displayMode, settings.direction]);

  // Measure available space
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [containerRef]);

  // Choose pages based on display mode
  const sourcePages = settings.displayMode === 'spread' ? pdfData.spreadPages : pdfData.pages;

  const isSpread = settings.displayMode === 'spread';
  // RTL always needs swapped nav and reversed pages
  const swapNav = settings.direction === 'rtl';

  const displayPages = useMemo(() => {
    if (settings.direction === 'rtl') {
      if (isSpread) {
        const result = [];
        for (let i = sourcePages.length - 2; i >= 0; i -= 2) {
          result.push(sourcePages[i]!);
          if (sourcePages[i + 1]) result.push(sourcePages[i + 1]!);
        }
        return result;
      }
      return [...sourcePages].reverse();
    }
    return sourcePages;
  }, [sourcePages, settings.direction, isSpread]);

  const totalPages = displayPages.length;
  const pageOffset = settings.cover.startFromZero ? -1 : 0;
  const coverOffset = settings.cover.mode === 'custom' ? 2 : 0;
  const displayTotal = totalPages + coverOffset + pageOffset;

  // Map internal page index to display page number
  const getDisplayPageNum = useCallback(
    (internalIndex: number): number => {
      if (swapNav) {
        return totalPages - internalIndex + pageOffset;
      }
      return internalIndex + 1 + pageOffset;
    },
    [swapNav, totalPages, pageOffset]
  );

  // Get the two currently visible page numbers
  const getVisiblePages = useCallback(
    (internalIndex: number): [number, number] => {
      if (swapNav) {
        const right = totalPages - internalIndex + pageOffset;
        const left = right - 1;
        return [Math.max(pageOffset, left), Math.min(displayTotal, right)];
      }
      const left = internalIndex + 1 + pageOffset;
      const right = internalIndex + 2 + pageOffset;
      return [Math.max(pageOffset, left), Math.min(displayTotal, right)];
    },
    [swapNav, totalPages, pageOffset, displayTotal]
  );

  const handleFlip = useCallback(
    (e: { data: number }) => {
      setCurrentPage(e.data);
      if (settings.sound.enabled && !isMuted) {
        playFlipSound(settings.sound.type).catch(() => {});
      }
    },
    [settings.sound.enabled, settings.sound.type, isMuted]
  );

  // Navigation functions (inverted for RTL)
  const flipNext = useCallback(() => {
    if (swapNav) {
      bookRef.current?.pageFlip()?.flipPrev();
    } else {
      bookRef.current?.pageFlip()?.flipNext();
    }
  }, [swapNav]);

  const flipPrev = useCallback(() => {
    if (swapNav) {
      bookRef.current?.pageFlip()?.flipNext();
    } else {
      bookRef.current?.pageFlip()?.flipPrev();
    }
  }, [swapNav]);

  // Scroll to flip pages
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => { scrollTimeout = null; }, 400);
      if (e.deltaY > 0) {
        if (swapNav) {
          bookRef.current?.pageFlip()?.flipPrev();
        } else {
          bookRef.current?.pageFlip()?.flipNext();
        }
      } else if (e.deltaY < 0) {
        if (swapNav) {
          bookRef.current?.pageFlip()?.flipNext();
        } else {
          bookRef.current?.pageFlip()?.flipPrev();
        }
      }
    }
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef, swapNav]);

  const goToPage = useCallback(
    (displayPageNum: number) => {
      // Convert display page number (which may be 0-based) back to internal index
      const actualPage = displayPageNum - pageOffset;
      let internalIndex: number;
      if (swapNav) {
        internalIndex = totalPages - actualPage;
      } else {
        internalIndex = actualPage - 1;
      }
      bookRef.current?.pageFlip()?.turnToPage(Math.max(0, Math.min(totalPages - 1, internalIndex)));
    },
    [swapNav, totalPages, pageOffset]
  );

  // Compute book dimensions — fill available space
  const bookSize = useMemo(() => {
    const thumbOffset = showThumbnails ? 100 : 0;
    const padding = 100 + thumbOffset;
    const availW = containerSize.width - 100;
    const availH = containerSize.height - padding;

    if (settings.size.preset === 'custom') {
      return { width: settings.size.width / 2, height: settings.size.height };
    }
    if (settings.size.preset !== 'auto') {
      const preset = SIZE_PRESETS[settings.size.preset];
      return { width: preset.width / 2, height: preset.height };
    }

    const firstPage = sourcePages[0];
    if (firstPage) {
      const pageAspect = firstPage.width / firstPage.height;
      const maxPageW = availW / 2;
      const maxPageH = availH;

      let pageW: number, pageH: number;
      if (maxPageW / maxPageH > pageAspect) {
        pageH = maxPageH;
        pageW = pageH * pageAspect;
      } else {
        pageW = maxPageW;
        pageH = pageW / pageAspect;
      }

      return {
        width: Math.round(pageW),
        height: Math.round(pageH),
      };
    }
    return { width: Math.round(availW / 2), height: availH };
  }, [settings.size, sourcePages, containerSize, showThumbnails]);

  // Book border/shadow styles
  const bookStyle = useMemo(() => {
    const s: React.CSSProperties = {};
    const b = settings.border;

    if (b.type === 'solid') {
      s.border = `${BORDER_THICKNESS_VALUES[b.thickness]}px solid ${b.color}`;
    } else if (b.type === 'double') {
      s.border = `${BORDER_THICKNESS_VALUES[b.thickness]}px double ${b.color}`;
    }

    if (b.radius > 0) {
      s.borderRadius = `${b.radius}px`;
    }

    if (b.shadow || b.type === 'shadow') {
      const intensity = b.shadowIntensity / 100;
      // Parse shadowColor (supports hex like #1A1714 or rgba(...))
      const parseColor = (c: string): string => {
        const m = c.trim().match(/^#([0-9a-f]{6})$/i);
        if (m && m[1]) {
          const r = parseInt(m[1].substring(0, 2), 16);
          const g = parseInt(m[1].substring(2, 4), 16);
          const bl = parseInt(m[1].substring(4, 6), 16);
          return `${r}, ${g}, ${bl}`;
        }
        const rgbaMatch = c.match(/rgba?\(([^)]+)\)/);
        if (rgbaMatch && rgbaMatch[1]) {
          const parts = rgbaMatch[1].split(',').slice(0, 3).map((p) => p.trim());
          return parts.join(', ');
        }
        return '26, 23, 20';
      };
      const rgb = parseColor(b.shadowColor);
      s.boxShadow = `0 4px 16px rgba(${rgb},${(0.35 * intensity).toFixed(3)}), 0 20px 48px rgba(${rgb},${(0.5 * intensity).toFixed(3)})`;
    }

    return s;
  }, [settings.border]);

  const visiblePages = getVisiblePages(currentPage);

  // Generate ToC entries based on actual displayed pages count
  const tocEntries = useMemo(() => {
    const entries = [];
    for (let i = 0; i < totalPages; i++) {
      entries.push({ title: '', pageIndex: i, children: [] as import('../../types').OutlineItem[] });
    }
    return entries;
  }, [totalPages]);

  // Cover mode: 'custom' adds separate cover pages, 'first-page' treats first/last PDF page as cover, 'none' = no cover
  const showCover = settings.cover.mode !== 'none';
  const hasCustomCover = settings.cover.mode === 'custom';

  if (displayPages.length === 0) return null;

  return (
    <div className={styles.flipBookContainer}>
      {/* Overlay panels */}
      {showToc && (
        <TableOfContents
          outline={tocEntries}
          pageOffset={pageOffset}
          onGoToPage={goToPage}
          onClose={() => setShowToc(false)}
        />
      )}
      <div
        className={`${styles.bookWrapper} ${styles[`binding${settings.binding.type.charAt(0).toUpperCase()}${settings.binding.type.slice(1)}`] || ''}`}
        ref={bookContainerRef}
        style={{
          ...bookStyle,
          transform: `scale(${zoom / 100})`,
        }}
      >
        <HTMLFlipBook
          key={`${settings.displayMode}-${settings.direction}-${settings.cover.mode}-${settings.binding.type}-${totalPages}`}
          ref={bookRef}
          width={bookSize.width}
          height={bookSize.height}
          size="fixed"
          minWidth={200}
          maxWidth={4000}
          minHeight={200}
          maxHeight={4000}
          showCover={showCover}
          drawShadow={BINDING_PRESETS[settings.binding.type].drawShadow}
          maxShadowOpacity={BINDING_PRESETS[settings.binding.type].maxShadowOpacity}
          flippingTime={BINDING_PRESETS[settings.binding.type].flippingTime}
          usePortrait={false}
          startZIndex={0}
          autoSize={false}
          mobileScrollSupport={false}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={BINDING_PRESETS[settings.binding.type].showPageCorners}
          disableFlipByClick={false}
          startPage={settings.direction === 'rtl' ? (showCover ? totalPages + (hasCustomCover ? 1 : -1) : totalPages - 1) : 0}
          onFlip={handleFlip}
          className={styles.flipBook ?? ''}
          style={{}}
          renderOnlyPageLengthChange={false}
        >
          {[
            ...(hasCustomCover
              ? [
                  <CoverPage
                    key={swapNav ? 'back-cover' : 'front-cover'}
                    color={swapNav ? settings.colors.backCover : settings.colors.frontCover}
                    imageData={swapNav ? settings.cover.backCoverImage : settings.cover.frontCoverImage}
                    title={swapNav ? undefined : settings.cover.title}
                    titleColor={swapNav ? undefined : settings.cover.titleColor}
                    titleSize={swapNav ? undefined : settings.cover.titleSize}
                    logoData={swapNav ? undefined : settings.cover.logoData}
                  />,
                ]
              : []),
            ...displayPages.map((page, idx) => (
              <BookPage
                key={page.index}
                imageData={page.imageData}
                pageNum={getDisplayPageNum(idx)}
              />
            )),
            ...(hasCustomCover
              ? [
                  <CoverPage
                    key={swapNav ? 'front-cover' : 'back-cover'}
                    color={swapNav ? settings.colors.frontCover : settings.colors.backCover}
                    imageData={swapNav ? settings.cover.frontCoverImage : settings.cover.backCoverImage}
                    title={swapNav ? settings.cover.title : undefined}
                    titleColor={swapNav ? settings.cover.titleColor : undefined}
                    titleSize={swapNav ? settings.cover.titleSize : undefined}
                    logoData={swapNav ? settings.cover.logoData : undefined}
                  />,
                ]
              : []),
          ]}
        </HTMLFlipBook>
      </div>

      {/* Thumbnail bar */}
      {showThumbnails && (
        <ThumbnailBar
          pages={sourcePages}
          currentPage={visiblePages[0]}
          pageOffset={pageOffset}
          onGoToPage={goToPage}
        />
      )}

      <Toolbar
        currentPages={visiblePages}
        totalPages={displayTotal}
        zoom={zoom}
        isFullscreen={isFullscreen}
        hasOutline={totalPages > 0}
        showThumbnails={showThumbnails}
        showToc={showToc}
        onPrev={flipPrev}
        onNext={flipNext}
        onGoToPage={goToPage}
        onZoomChange={setZoom}
        onToggleFullscreen={toggleFullscreen}
        isMuted={isMuted}
        onToggleThumbnails={() => setShowThumbnails((v) => !v)}
        onToggleToc={() => setShowToc((v) => !v)}
        onToggleMute={() => setIsMuted((v) => !v)}
        onDownload={onDownloadPdf}
      />
    </div>
  );
}
