import { useTranslation } from '../../i18n';
import styles from './PageIndicator.module.css';

interface PageIndicatorProps {
  currentPages: [number, number];
  totalPages: number;
}

export default function PageIndicator({ currentPages, totalPages }: PageIndicatorProps) {
  const { t } = useTranslation();

  const [start, end] = currentPages;
  const text =
    start === end
      ? t('singlePageIndicator', { page: start, total: totalPages })
      : t('pageIndicator', { start, end, total: totalPages });

  return <span className={styles.indicator}>{text}</span>;
}
