import { Volume2, Play } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import { previewSound } from '../../services/soundService';
import type { SoundType } from '../../types';
import styles from './SoundSettings.module.css';
import sharedStyles from './shared/shared.module.css';

const SOUNDS: { value: SoundType; labelAr: string; labelEn: string }[] = [
  { value: 'paper', labelAr: 'ورق كلاسيكي', labelEn: 'Classic Paper' },
  { value: 'soft', labelAr: 'ناعم', labelEn: 'Soft Whoosh' },
  { value: 'crisp', labelAr: 'حاد', labelEn: 'Crisp Snap' },
  { value: 'heavy', labelAr: 'كتاب سميك', labelEn: 'Heavy Book' },
  { value: 'magazine', labelAr: 'مجلة لامعة', labelEn: 'Glossy Magazine' },
  { value: 'realistic', labelAr: 'صوت واقعي', labelEn: 'Realistic' },
  { value: 'none', labelAr: 'بدون صوت', labelEn: 'No Sound' },
];

export default function SoundSettings() {
  const { t, language } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function selectSound(type: SoundType) {
    dispatch({
      type: 'SET_SOUND',
      payload: { type, enabled: type !== 'none' },
    });
  }

  return (
    <div className={styles.soundSettings}>
      <div className={styles.soundList}>
        {SOUNDS.map((s) => (
          <div
            key={s.value}
            className={`${styles.soundItem} ${settings.sound.type === s.value ? styles.soundItemActive : ''}`}
            onClick={() => selectSound(s.value)}
          >
            <Volume2 size={16} className={styles.soundIcon} />
            <span className={styles.soundLabel}>
              {language === 'ar' ? s.labelAr : s.labelEn}
            </span>
            {s.value !== 'none' && (
              <button
                className={styles.playBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  previewSound(s.value);
                }}
                title={language === 'ar' ? 'تشغيل' : 'Play'}
              >
                <Play size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
