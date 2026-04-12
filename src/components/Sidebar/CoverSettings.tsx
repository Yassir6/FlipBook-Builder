import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import type { CoverMode } from '../../types';
import ImageUpload from './shared/ImageUpload';
import ColorPicker from './shared/ColorPicker';
import SliderControl from './shared/SliderControl';
import styles from './shared/shared.module.css';

export default function CoverSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function setCover(payload: Record<string, unknown>) {
    dispatch({ type: 'SET_COVER', payload });
  }

  const modes: { value: CoverMode; label: string }[] = [
    { value: 'custom', label: t('coverCustom') },
    { value: 'first-page', label: t('coverFirstPage') },
    { value: 'none', label: t('coverNone') },
  ];

  return (
    <>
      <div className={styles.field}>
        <span className={styles.label}>{t('coverMode')}</span>
        <div className={styles.toggleGroup}>
          {modes.map((m) => (
            <button
              key={m.value}
              className={`${styles.toggleOption} ${settings.cover.mode === m.value ? styles.toggleActive : ''}`}
              onClick={() => setCover({ mode: m.value })}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>{t('startFromZero')}</span>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleOption} ${!settings.cover.startFromZero ? styles.toggleActive : ''}`}
            onClick={() => setCover({ startFromZero: false })}
          >
            {t('startFrom1')}
          </button>
          <button
            className={`${styles.toggleOption} ${settings.cover.startFromZero ? styles.toggleActive : ''}`}
            onClick={() => setCover({ startFromZero: true })}
          >
            {t('startFrom0')}
          </button>
        </div>
      </div>

      {settings.cover.mode === 'custom' && (
        <>
          <ImageUpload
            label={t('frontCoverImage')}
            value={settings.cover.frontCoverImage}
            onChange={(v) => setCover({ frontCoverImage: v })}
          />
          <ImageUpload
            label={t('backCoverImage')}
            value={settings.cover.backCoverImage}
            onChange={(v) => setCover({ backCoverImage: v })}
          />
          {!settings.cover.frontCoverImage && (
            <>
              <ImageUpload
                label={t('uploadLogo')}
                value={settings.cover.logoData}
                onChange={(v) => setCover({ logoData: v })}
              />
              <label className={styles.field}>
                <span className={styles.label}>{t('bookTitle')}</span>
                <input
                  type="text"
                  value={settings.cover.title}
                  onChange={(e) => setCover({ title: e.target.value })}
                  placeholder={t('bookTitle')}
                  className={styles.input}
                />
              </label>
              <ColorPicker
                label={t('titleColor')}
                value={settings.cover.titleColor}
                onChange={(v) => setCover({ titleColor: v })}
              />
              <SliderControl
                label={t('titleSize')}
                value={settings.cover.titleSize}
                min={16}
                max={64}
                unit="px"
                onChange={(v) => setCover({ titleSize: v })}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
