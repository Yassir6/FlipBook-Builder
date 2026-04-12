import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './SettingsSection.module.css';

interface SettingsSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function SettingsSection({ title, defaultOpen = false, children }: SettingsSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.section}>
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.title}>{title}</span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>
      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
}
