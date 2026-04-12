import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import type { SizePreset } from '../../types';
import styles from './shared/shared.module.css';

const PRESETS: { value: SizePreset; labelKey: 'sizeAuto' | 'sizeSmall' | 'sizeMedium' | 'sizeLarge' | 'sizeCustom' }[] = [
  { value: 'auto', labelKey: 'sizeAuto' },
  { value: 'small', labelKey: 'sizeSmall' },
  { value: 'medium', labelKey: 'sizeMedium' },
  { value: 'large', labelKey: 'sizeLarge' },
  { value: 'custom', labelKey: 'sizeCustom' },
];

export default function SizeSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function setSize(payload: Record<string, unknown>) {
    dispatch({ type: 'SET_SIZE', payload });
  }

  return (
    <>
      <div className={styles.toggleGroup}>
        {PRESETS.map((p) => (
          <button
            key={p.value}
            className={`${styles.toggleOption} ${settings.size.preset === p.value ? styles.toggleActive : ''}`}
            onClick={() => setSize({ preset: p.value })}
          >
            {t(p.labelKey)}
          </button>
        ))}
      </div>
      {settings.size.preset === 'custom' && (
        <div className={styles.row}>
          <label className={styles.field}>
            <span className={styles.label}>{t('width')}</span>
            <input
              type="number"
              value={settings.size.width}
              onChange={(e) => setSize({ width: Number(e.target.value) })}
              min={400}
              max={2560}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>{t('height')}</span>
            <input
              type="number"
              value={settings.size.height}
              onChange={(e) => setSize({ height: Number(e.target.value) })}
              min={300}
              max={1920}
              className={styles.input}
            />
          </label>
        </div>
      )}
    </>
  );
}
