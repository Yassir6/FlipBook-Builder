import type { ProcessingProgress } from '../../types';
import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import LanguageToggle from '../Sidebar/LanguageToggle';
import FileUpload from '../Sidebar/FileUpload';
import SettingsSection from '../Sidebar/SettingsSection';
import DisplayModeSelect from '../Sidebar/DisplayModeSelect';
import DirectionSelect from '../Sidebar/DirectionSelect';
import ColorSettings from '../Sidebar/ColorSettings';
import BorderSettings from '../Sidebar/BorderSettings';
import BackgroundSettings from '../Sidebar/BackgroundSettings';
import CoverSettings from '../Sidebar/CoverSettings';
import BindingSettings from '../Sidebar/BindingSettings';
import SizeSettings from '../Sidebar/SizeSettings';
import SoundSettings from '../Sidebar/SoundSettings';
import ExportButton from '../Sidebar/ExportButton';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  progress: ProcessingProgress | null;
  hasPages: boolean;
  onExport?: () => Promise<void>;
}

export default function Sidebar({ onFileSelect, isProcessing, progress, hasPages, onExport }: SidebarProps) {
  const { t } = useTranslation();
  const { settings } = useBookSettings();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('appTitle')}</h1>
        <LanguageToggle />
      </div>

      <div className={styles.content}>
        <FileUpload
          onFileSelect={onFileSelect}
          isProcessing={isProcessing}
          progress={progress}
        />

        {hasPages && (
          <>
            <SettingsSection title={t('displayMode')} defaultOpen>
              <DisplayModeSelect />
            </SettingsSection>

            <SettingsSection title={t('readingDirection')} defaultOpen>
              <DirectionSelect />
            </SettingsSection>

            <SettingsSection title={t('colors')}>
              <ColorSettings />
            </SettingsSection>

            <SettingsSection title={t('borders')}>
              <BorderSettings />
            </SettingsSection>

            <SettingsSection title={t('background')}>
              <BackgroundSettings />
            </SettingsSection>

            <SettingsSection title={t('cover')}>
              <CoverSettings />
            </SettingsSection>

            <SettingsSection title={t('binding')}>
              <BindingSettings />
            </SettingsSection>

            <SettingsSection title={t('size')}>
              <SizeSettings />
            </SettingsSection>

            <SettingsSection title={t('sound')}>
              <SoundSettings />
            </SettingsSection>
          </>
        )}
      </div>

      {hasPages && (
        <div className={styles.footer}>
          <ExportButton onExport={onExport} />
        </div>
      )}
    </aside>
  );
}
