import { useTranslation } from '../../i18n';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.option} ${language === 'ar' ? styles.active : ''}`}
        onClick={() => setLanguage('ar')}
      >
        {t('arabic')}
      </button>
      <button
        className={`${styles.option} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
      >
        {t('english')}
      </button>
    </div>
  );
}
