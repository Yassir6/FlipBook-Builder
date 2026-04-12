import { BookOpen, BookMarked, Newspaper, Disc3, Scroll } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import type { BindingType } from '../../types';
import styles from './BindingSettings.module.css';

const BINDINGS: { value: BindingType; labelKey: string; icon: typeof BookOpen }[] = [
  { value: 'perfect', labelKey: 'bindingPerfect', icon: BookOpen },
  { value: 'hardcover', labelKey: 'bindingHardcover', icon: BookMarked },
  { value: 'magazine', labelKey: 'bindingMagazine', icon: Newspaper },
  { value: 'spiral', labelKey: 'bindingSpiral', icon: Disc3 },
  { value: 'japanese', labelKey: 'bindingJapanese', icon: Scroll },
];

export default function BindingSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function select(type: BindingType) {
    dispatch({ type: 'SET_BINDING', payload: { type } });
  }

  return (
    <div className={styles.bindingList}>
      {BINDINGS.map((b) => {
        const Icon = b.icon;
        const isActive = settings.binding.type === b.value;
        return (
          <button
            key={b.value}
            className={`${styles.bindingItem} ${isActive ? styles.bindingItemActive : ''}`}
            onClick={() => select(b.value)}
          >
            <Icon size={18} className={styles.bindingIcon} />
            <span className={styles.bindingLabel}>{t(b.labelKey as any)}</span>
          </button>
        );
      })}
    </div>
  );
}
