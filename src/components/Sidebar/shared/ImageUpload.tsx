import { useRef } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { fileToBase64 } from '../../../utils/base64';
import styles from './shared.module.css';

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
}

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      onChange(base64);
    }
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {value ? (
        <div className={styles.imagePreviewWrap}>
          <img src={value} alt="" className={styles.imagePreview} />
          <button
            className={styles.imageRemove}
            onClick={() => onChange(null)}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          className={styles.imageUploadBtn}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus size={18} />
          <span>{label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
