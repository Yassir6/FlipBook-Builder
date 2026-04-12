import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import styles from './shared/shared.module.css';

export default function DisplayModeSelect() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  return (
    <div className={styles.toggleGroup}>
      <button
        className={`${styles.toggleOption} ${settings.displayMode === 'full' ? styles.toggleActive : ''}`}
        onClick={() => dispatch({ type: 'SET_DISPLAY_MODE', payload: 'full' })}
      >
        {t('fullPage')}
      </button>
      <button
        className={`${styles.toggleOption} ${settings.displayMode === 'spread' ? styles.toggleActive : ''}`}
        onClick={() => dispatch({ type: 'SET_DISPLAY_MODE', payload: 'spread' })}
      >
        {t('spreadMode')}
      </button>
    </div>
  );
}
