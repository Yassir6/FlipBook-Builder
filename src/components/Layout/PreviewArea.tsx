import { useRef } from 'react';
import type { ProcessingProgress } from '../../types';
import type { PdfData } from '../../hooks/usePdfProcessor';
import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import FlipBook from '../Preview/FlipBook';
import ProgressBar from '../common/ProgressBar';
import { Upload } from 'lucide-react';
import styles from './PreviewArea.module.css';

interface PreviewAreaProps {
  pdfData: PdfData;
  isProcessing: boolean;
  progress: ProcessingProgress | null;
  onExport?: () => Promise<void>;
  onDownloadPdf?: () => Promise<void>;
}

export default function PreviewArea({ pdfData, isProcessing, progress, onExport, onDownloadPdf }: PreviewAreaProps) {
  const { t } = useTranslation();
  const { settings } = useBookSettings();
  const containerRef = useRef<HTMLDivElement>(null);

  const hasPages = pdfData.pages.length > 0;

  // Apply background styles from settings
  const bgStyle = getBackgroundStyle(settings.colors.background, settings.background);

  return (
    <div className={styles.previewArea} style={bgStyle} ref={containerRef}>
      {isProcessing && progress && (
        <div className={styles.processingOverlay}>
          <div className={styles.processingCard}>
            <div className={styles.processingIcon}>
              <div className={styles.spinner} />
            </div>
            <p className={styles.processingText}>
              {progress.phase === 'loading' && t('loading')}
              {progress.phase === 'rendering' &&
                t('pageOf', { current: progress.current, total: progress.total })}
              {progress.phase === 'extracting' && t('extractingText')}
            </p>
            <ProgressBar percent={progress.percent} />
          </div>
        </div>
      )}

      {!hasPages && !isProcessing && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Upload size={48} strokeWidth={1} />
          </div>
          <p className={styles.emptyTitle}>{t('appTitle')}</p>
          <p className={styles.emptyDescription}>{t('dropPdfHere')}</p>
        </div>
      )}

      {hasPages && !isProcessing && (
        <FlipBook pdfData={pdfData} containerRef={containerRef} onExport={onExport} onDownloadPdf={onDownloadPdf} />
      )}
    </div>
  );
}

function getBackgroundStyle(
  bgColor: string,
  bg: { type: string; gradientColors: [string, string]; gradientAngle: number; imageData: string | null }
): React.CSSProperties {
  switch (bg.type) {
    case 'gradient':
      return {
        background: `linear-gradient(${bg.gradientAngle}deg, ${bg.gradientColors[0]}, ${bg.gradientColors[1]})`,
      };
    case 'image':
      return bg.imageData
        ? { backgroundImage: `url(${bg.imageData})`, backgroundSize: 'cover', backgroundPosition: 'center' }
        : { background: bgColor };
    default:
      return { background: bgColor };
  }
}
