import { useCallback, useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { useTranslation } from '../../i18n';
import type { ProcessingProgress } from '../../types';
import ProgressBar from '../common/ProgressBar';
import styles from './FileUpload.module.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  progress: ProcessingProgress | null;
}

export default function FileUpload({ onFileSelect, isProcessing, progress }: FileUploadProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (isProcessing && progress) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.processing}>
          <FileText size={24} className={styles.processingIcon} />
          <p className={styles.processingText}>
            {progress.phase === 'loading' && t('loading')}
            {progress.phase === 'rendering' &&
              t('pageOf', { current: progress.current, total: progress.total })}
            {progress.phase === 'extracting' && t('extractingText')}
            {progress.phase === 'done' && t('processing')}
          </p>
          <ProgressBar percent={progress.percent} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload size={24} strokeWidth={1.5} className={styles.icon} />
        <span className={styles.label}>{t('dropPdfHere')}</span>
        <span className={styles.hint}>{t('orClickToSelect')}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className={styles.hiddenInput}
      />
    </div>
  );
}
