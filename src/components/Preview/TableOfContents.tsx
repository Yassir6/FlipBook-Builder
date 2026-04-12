import { X } from 'lucide-react';
import type { OutlineItem } from '../../types';
import { useTranslation } from '../../i18n';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  outline: OutlineItem[];
  pageOffset: number;
  onGoToPage: (page: number) => void;
  onClose: () => void;
}

/** Replace "Slide N" with localized "صفحة N" / "Page N", applying page offset */
function localizeTitle(title: string, pageLabel: string, pageOffset: number): string {
  return title.replace(/^Slide\s+(\d+)/i, (_, num) => `${pageLabel} ${parseInt(num) + pageOffset}`);
}

function TocEntry({
  item,
  depth,
  pageOffset,
  pageLabel,
  onGoToPage,
}: {
  item: OutlineItem;
  depth: number;
  pageOffset: number;
  pageLabel: string;
  onGoToPage: (page: number) => void;
}) {
  const displayPage = item.pageIndex + 1 + pageOffset;
  const title = item.title
    ? localizeTitle(item.title, pageLabel, pageOffset)
    : `${pageLabel} ${displayPage}`;
  return (
    <>
      <button
        className={styles.tocItem}
        style={{ paddingInlineStart: `${16 + depth * 16}px` }}
        onClick={() => onGoToPage(displayPage)}
      >
        <span className={styles.tocTitle}>{title}</span>
        <span className={styles.tocPage}>{displayPage}</span>
      </button>
      {item.children.map((child, i) => (
        <TocEntry key={i} item={child} depth={depth + 1} pageOffset={pageOffset} pageLabel={pageLabel} onGoToPage={onGoToPage} />
      ))}
    </>
  );
}

export default function TableOfContents({ outline, pageOffset, onGoToPage, onClose }: TableOfContentsProps) {
  const { t } = useTranslation();
  const pageLabel = t('pageLabel');

  return (
    <div className={styles.tocPanel}>
      <div className={styles.tocHeader}>
        <h3 className={styles.tocHeading}>{t('tableOfContents')}</h3>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className={styles.tocList}>
        {outline.length === 0 ? (
          <p className={styles.tocEmpty}>{t('noResults')}</p>
        ) : (
          outline.map((item, i) => (
            <TocEntry key={i} item={item} depth={0} pageOffset={pageOffset} pageLabel={pageLabel} onGoToPage={onGoToPage} />
          ))
        )}
      </div>
    </div>
  );
}
