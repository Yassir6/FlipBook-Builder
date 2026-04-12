import { useState } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from '../../i18n';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  onExport?: () => Promise<void>;
}

export default function ExportButton({ onExport }: ExportButtonProps) {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  async function handleClick() {
    if (isExporting || !onExport) return;
    setIsExporting(true);
    try {
      await onExport();
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      className={styles.exportBtn}
      onClick={handleClick}
      disabled={isExporting}
    >
      <Download size={18} />
      <span>{isExporting ? t('exporting') : t('exportHtml')}</span>
    </button>
  );
}
