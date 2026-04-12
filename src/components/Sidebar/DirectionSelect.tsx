import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import styles from './shared/shared.module.css';

export default function DirectionSelect() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  return (
    <div className={styles.toggleGroup}>
      <button
        className={`${styles.toggleOption} ${settings.direction === 'rtl' ? styles.toggleActive : ''}`}
        onClick={() => dispatch({ type: 'SET_DIRECTION', payload: 'rtl' })}
      >
        {t('rtl')}
      </button>
      <button
        className={`${styles.toggleOption} ${settings.direction === 'ltr' ? styles.toggleActive : ''}`}
        onClick={() => dispatch({ type: 'SET_DIRECTION', payload: 'ltr' })}
      >
        {t('ltr')}
      </button>
    </div>
  );
}
