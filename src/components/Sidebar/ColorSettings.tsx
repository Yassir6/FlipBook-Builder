import { useTranslation } from '../../i18n';
import { useBookSettings } from '../../hooks/useBookSettings';
import ColorPicker from './shared/ColorPicker';

export default function ColorSettings() {
  const { t } = useTranslation();
  const { settings, dispatch } = useBookSettings();

  function setColor(key: string, value: string) {
    dispatch({ type: 'SET_COLORS', payload: { [key]: value } });
  }

  return (
    <>
      <ColorPicker
        label={t('backgroundColor')}
        value={settings.colors.background}
        onChange={(v) => setColor('background', v)}
      />
      <ColorPicker
        label={t('frontCoverColor')}
        value={settings.colors.frontCover}
        onChange={(v) => setColor('frontCover', v)}
      />
      <ColorPicker
        label={t('backCoverColor')}
        value={settings.colors.backCover}
        onChange={(v) => setColor('backCover', v)}
      />
      <ColorPicker
        label={t('toolbarColor')}
        value={settings.colors.toolbar}
        onChange={(v) => setColor('toolbar', v)}
      />
      <ColorPicker
        label={t('toolbarTextColor')}
        value={settings.colors.toolbarText}
        onChange={(v) => setColor('toolbarText', v)}
      />
    </>
  );
}
