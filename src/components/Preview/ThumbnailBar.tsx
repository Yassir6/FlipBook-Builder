import { useRef, useEffect, useMemo } from 'react';
import type { PageData } from '../../types';
import { useBookSettings } from '../../hooks/useBookSettings';
import styles from './ThumbnailBar.module.css';

interface ThumbnailBarProps {
  pages: PageData[];
  currentPage: number;
  pageOffset: number;
  onGoToPage: (page: number) => void;
}

export default function ThumbnailBar({ pages, currentPage, pageOffset, onGoToPage }: ThumbnailBarProps) {
  const { settings } = useBookSettings();
  const isRtl = settings.direction === 'rtl';
  const activeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // For RTL: reverse the array so first page appears on the right side
  const orderedPages = useMemo(() => {
    if (!isRtl) return pages.map((page, i) => ({ page, originalIndex: i }));
    return [...pages].reverse().map((page, i) => ({ page, originalIndex: pages.length - 1 - i }));
  }, [pages, isRtl]);

  // Scroll to the right end on mount in RTL mode (so first pages are visible)
  useEffect(() => {
    if (isRtl && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [isRtl, pages.length]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentPage]);

  return (
    <div className={styles.thumbnailBar} ref={scrollRef}>
      <div className={styles.strip}>
        {orderedPages.map(({ page, originalIndex }) => {
          const pageNum = originalIndex + 1 + pageOffset;
          const isActive = pageNum === currentPage || pageNum === currentPage + 1;
          return (
            <button
              key={originalIndex}
              ref={isActive ? activeRef : undefined}
              className={`${styles.thumb} ${isActive ? styles.thumbActive : ''}`}
              onClick={() => onGoToPage(pageNum)}
              title={`${pageNum}`}
            >
              <img src={page.imageData} alt={`${pageNum}`} className={styles.thumbImg} />
              <span className={styles.thumbNum}>{pageNum}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
