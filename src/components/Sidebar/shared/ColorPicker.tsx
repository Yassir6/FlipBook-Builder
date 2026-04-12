import { useState, useRef, useEffect } from 'react';
import styles from './shared.module.css';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const PRESET_COLORS = [
  // Row 1 - Neutrals
  '#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E',
  '#757575', '#616161', '#424242', '#212121', '#000000',
  // Row 2 - Warm
  '#FFEBEE', '#FFCDD2', '#EF9A9A', '#EF5350', '#E53935',
  '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#F57C00',
  // Row 3 - Cool
  '#E3F2FD', '#90CAF9', '#42A5F5', '#1E88E5', '#1565C0',
  '#E8F5E9', '#A5D6A7', '#66BB6A', '#43A047', '#2E7D32',
  // Row 4 - Accent
  '#F3E5F5', '#CE93D8', '#AB47BC', '#8E24AA', '#6A1B9A',
  '#FFF9C4', '#FFF176', '#FFEE58', '#FDD835', '#F9A825',
];

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.field} ref={wrapRef}>
      <span className={styles.label}>{label}</span>
      <div
        className={styles.colorInputWrap}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.colorPreview} style={{ background: value }} />
        <span className={styles.colorHex}>{value}</span>
      </div>

      {isOpen && (
        <div className={styles.colorPopover}>
          <div className={styles.colorSwatches}>
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                className={`${styles.colorSwatch} ${value === color ? styles.colorSwatchActive : ''}`}
                style={{ background: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                title={color}
              />
            ))}
          </div>
          <div className={styles.colorCustomRow}>
            <input
              ref={inputRef}
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={styles.colorNativeInput}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
              }}
              onBlur={(e) => {
                let v = e.target.value.trim();
                if (!v.startsWith('#')) v = '#' + v;
                if (/^#[0-9A-Fa-f]{6}$/.test(v)) onChange(v);
              }}
              className={styles.colorHexInput}
              maxLength={7}
              placeholder="#000000"
            />
          </div>
        </div>
      )}
    </div>
  );
}
