import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import SelectControl from './shared/SelectControl';
import ColorPicker from './shared/ColorPicker';
import SliderControl from './shared/SliderControl';
import styles from './shared/shared.module.css';

export default function BorderSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function setBorder(payload: Record<string, unknown>) {
    dispatch({ type: 'SET_BORDER', payload });
  }

  return (
    <>
      <SelectControl
        label={t('borderType')}
        value={settings.border.type}
        options={[
          { value: 'none', label: t('borderNone') },
          { value: 'solid', label: t('borderSolid') },
          { value: 'shadow', label: t('borderShadow') },
          { value: 'double', label: t('borderDouble') },
        ]}
        onChange={(v) => setBorder({ type: v })}
      />
      {settings.border.type !== 'none' && (
        <>
          <SelectControl
            label={t('borderThickness')}
            value={settings.border.thickness}
            options={[
              { value: 'thin', label: t('thin') },
              { value: 'medium', label: t('medium') },
              { value: 'thick', label: t('thick') },
            ]}
            onChange={(v) => setBorder({ thickness: v })}
          />
          <ColorPicker
            label={t('borderColor')}
            value={settings.border.color}
            onChange={(v) => setBorder({ color: v })}
          />
        </>
      )}
      <SliderControl
        label={t('cornerRadius')}
        value={settings.border.radius}
        min={0}
        max={20}
        unit="px"
        onChange={(v) => setBorder({ radius: v })}
      />
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={settings.border.shadow}
          onChange={(e) => setBorder({ shadow: e.target.checked })}
        />
        {t('shadowEnabled')}
      </label>
      {settings.border.shadow && (
        <>
          <ColorPicker
            label={t('shadowColor')}
            value={settings.border.shadowColor.startsWith('rgba') ? '#1A1714' : settings.border.shadowColor}
            onChange={(v) => setBorder({ shadowColor: v })}
          />
          <SliderControl
            label={t('shadowIntensity')}
            value={settings.border.shadowIntensity}
            min={0}
            max={100}
            unit="%"
            onChange={(v) => setBorder({ shadowIntensity: v })}
          />
        </>
      )}
    </>
  );
}
