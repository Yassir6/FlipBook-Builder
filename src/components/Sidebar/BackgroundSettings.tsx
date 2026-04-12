import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import SelectControl from './shared/SelectControl';
import ColorPicker from './shared/ColorPicker';
import SliderControl from './shared/SliderControl';
import ImageUpload from './shared/ImageUpload';
import type { PatternType } from '../../types';
import styles from './shared/shared.module.css';

const PATTERNS: { value: PatternType; labelKey: 'patternWood' | 'patternMarble' | 'patternFabric' | 'patternOldPaper' }[] = [
  { value: 'wood', labelKey: 'patternWood' },
  { value: 'marble', labelKey: 'patternMarble' },
  { value: 'fabric', labelKey: 'patternFabric' },
  { value: 'old-paper', labelKey: 'patternOldPaper' },
];

export default function BackgroundSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function setBg(payload: Record<string, unknown>) {
    dispatch({ type: 'SET_BACKGROUND', payload });
  }

  return (
    <>
      <SelectControl
        label={t('backgroundType')}
        value={settings.background.type}
        options={[
          { value: 'solid', label: t('solidColor') },
          { value: 'gradient', label: t('gradient') },
          { value: 'image', label: t('image') },
          { value: 'pattern', label: t('pattern') },
        ]}
        onChange={(v) => setBg({ type: v })}
      />

      {settings.background.type === 'solid' && (
        <ColorPicker
          label={t('backgroundColor')}
          value={settings.colors.background}
          onChange={(v) => dispatch({ type: 'SET_COLORS', payload: { background: v } })}
        />
      )}

      {settings.background.type === 'gradient' && (
        <>
          <div className={styles.row}>
            <ColorPicker
              label="1"
              value={settings.background.gradientColors[0]}
              onChange={(v) =>
                setBg({ gradientColors: [v, settings.background.gradientColors[1]] })
              }
            />
            <ColorPicker
              label="2"
              value={settings.background.gradientColors[1]}
              onChange={(v) =>
                setBg({ gradientColors: [settings.background.gradientColors[0], v] })
              }
            />
          </div>
          <SliderControl
            label={t('gradientAngle')}
            value={settings.background.gradientAngle}
            min={0}
            max={360}
            unit="°"
            onChange={(v) => setBg({ gradientAngle: v })}
          />
        </>
      )}

      {settings.background.type === 'image' && (
        <ImageUpload
          label={t('uploadBackgroundImage')}
          value={settings.background.imageData}
          onChange={(v) => setBg({ imageData: v })}
        />
      )}

      {settings.background.type === 'pattern' && (
        <SelectControl
          label={t('pattern')}
          value={settings.background.pattern}
          options={PATTERNS.map((p) => ({
            value: p.value,
            label: t(p.labelKey),
          }))}
          onChange={(v) => setBg({ pattern: v })}
        />
      )}
    </>
  );
}
