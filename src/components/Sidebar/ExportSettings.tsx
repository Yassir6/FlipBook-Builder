import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import styles from './shared/shared.module.css';

export default function ExportSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  return (
    <>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={settings.exportOptions.downloadButton}
          onChange={(e) =>
            dispatch({ type: 'SET_EXPORT', payload: { downloadButton: e.target.checked } })
          }
        />
        {t('showDownloadButton')}
      </label>
      <span className={styles.label} style={{ opacity: 0.7, lineHeight: 1.4 }}>
        {t('downloadButtonHelp')}
      </span>
    </>
  );
}
