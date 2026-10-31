import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  List,
  GalleryHorizontalEnd,
  Volume2,
  VolumeX,
  Download,
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import { ZOOM_LEVELS } from '../../utils/constants';
import PageIndicator from './PageIndicator';
import styles from './Toolbar.module.css';

interface ToolbarProps {
  currentPages: [number, number];
  totalPages: number;
  zoom: number;
  isFullscreen: boolean;
  hasOutline: boolean;
  showThumbnails: boolean;
  showToc: boolean;
  isMuted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGoToPage: (page: number) => void;
  onZoomChange: (zoom: number) => void;
  onToggleFullscreen: () => void;
  onToggleThumbnails: () => void;
  onToggleToc: () => void;
  onToggleMute: () => void;
  onDownload?: () => void | Promise<void>;
}

export default function Toolbar({
  currentPages,
  totalPages,
  zoom,
  isFullscreen,
  hasOutline,
  showThumbnails,
  showToc,
  isMuted,
  onPrev,
  onNext,
  onGoToPage,
  onZoomChange,
  onToggleFullscreen,
  onToggleThumbnails,
  onToggleToc,
  onToggleMute,
  onDownload,
}: ToolbarProps) {
  const { t, dir } = useTranslation();
  const { settings } = useBookSettings();
  const [goToValue, setGoToValue] = useState('');

  const minPage = currentPages[0] !== undefined && currentPages[0] < 1 ? 0 : 1;

  const handleGoTo = () => {
    const page = parseInt(goToValue);
    if (page >= minPage && page <= totalPages) {
      onGoToPage(page);
      setGoToValue('');
    }
  };

  const handleZoomIn = () => {
    const idx = ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number]);
    if (idx < ZOOM_LEVELS.length - 1) {
      onZoomChange(ZOOM_LEVELS[idx + 1]!);
    }
  };

  const handleZoomOut = () => {
    const idx = ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number]);
    if (idx > 0) {
      onZoomChange(ZOOM_LEVELS[idx - 1]!);
    }
  };

  const toolbarStyle = {
    background: settings.colors.toolbar,
    color: settings.colors.toolbarText,
  };

  // In RTL, prev/next arrows swap visual direction
  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div className={styles.toolbar} style={toolbarStyle}>
      {/* Features section */}
      <div className={styles.toolsSection}>
        <button
          className={`${styles.iconBtn} ${showThumbnails ? styles.iconBtnActive : ''}`}
          onClick={onToggleThumbnails}
          title={t('thumbnails')}
        >
          <GalleryHorizontalEnd size={18} />
        </button>
        {hasOutline && (
          <button
            className={`${styles.iconBtn} ${showToc ? styles.iconBtnActive : ''}`}
            onClick={onToggleToc}
            title={t('tableOfContents')}
          >
            <List size={18} />
          </button>
        )}
        <div className={styles.separator} />
      </div>

      {/* Navigation section */}
      <div className={styles.navSection}>
        <button
          className={styles.iconBtn}
          onClick={onPrev}
          title={t('previousPage')}
        >
          <PrevIcon size={20} />
        </button>

        <PageIndicator
          currentPages={currentPages}
          totalPages={totalPages}
        />

        <button
          className={styles.iconBtn}
          onClick={onNext}
          title={t('nextPage')}
        >
          <NextIcon size={20} />
        </button>
      </div>

      <div className={styles.goToSection}>
        <input
          type="number"
          value={goToValue}
          onChange={(e) => setGoToValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGoTo()}
          placeholder={t('goToPage')}
          min={minPage}
          max={totalPages}
          className={styles.goToInput}
          style={{ color: settings.colors.toolbarText, borderColor: `${settings.colors.toolbarText}33` }}
        />
      </div>

      {/* Zoom + fullscreen */}
      <div className={styles.toolsSection}>
        <button className={styles.iconBtn} onClick={handleZoomOut} title={t('zoomOut')}>
          <ZoomOut size={18} />
        </button>
        <span className={styles.zoomLabel}>{zoom}%</span>
        <button className={styles.iconBtn} onClick={handleZoomIn} title={t('zoomIn')}>
          <ZoomIn size={18} />
        </button>

        <div className={styles.separator} />

        {settings.sound.enabled && (
          <button
            className={`${styles.iconBtn} ${isMuted ? styles.iconBtnActive : ''}`}
            onClick={onToggleMute}
            title={isMuted ? t('soundOn') : t('soundOff')}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}

        {onDownload && settings.exportOptions.downloadButton && (
          <button
            className={styles.iconBtn}
            onClick={() => { void onDownload(); }}
            title={t('downloadPdf')}
          >
            <Download size={18} />
          </button>
        )}

        <button className={styles.iconBtn} onClick={onToggleFullscreen} title={t('fullscreen')}>
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
}
