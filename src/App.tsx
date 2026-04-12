import { useState, useCallback, useEffect, useMemo } from 'react';
import type { Language } from './types';
import { I18nContext, translate, type TranslationKey } from './i18n';
import { SettingsContext, useSettingsReducer } from './hooks/useBookSettings';
import { usePdfProcessor } from './hooks/usePdfProcessor';
import { exportAsHtml } from './services/exportService';
import Sidebar from './components/Layout/Sidebar';
import PreviewArea from './components/Layout/PreviewArea';
import styles from './App.module.css';

export default function App() {
  const [language, setLanguageState] = useState<Language>('ar');
  const [settings, dispatch] = useSettingsReducer();
  const pdfProcessor = usePdfProcessor();
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Update HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);
      dispatch({ type: 'SET_LANGUAGE', payload: lang });
    },
    [dispatch]
  );

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language]
  );

  const handleExport = useCallback(async () => {
    const pages =
      settings.displayMode === 'spread'
        ? pdfProcessor.data.spreadPages
        : pdfProcessor.data.pages;
    await exportAsHtml(settings, pages, pdfProcessor.data.textData);
  }, [settings, pdfProcessor.data]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      <SettingsContext.Provider value={{ settings, dispatch }}>
        <div className={styles.appContainer} data-dir={dir}>
          <Sidebar
            onFileSelect={pdfProcessor.processPdf}
            isProcessing={pdfProcessor.isProcessing}
            progress={pdfProcessor.progress}
            hasPages={pdfProcessor.data.pages.length > 0}
            onExport={handleExport}
          />
          <PreviewArea
            pdfData={pdfProcessor.data}
            isProcessing={pdfProcessor.isProcessing}
            progress={pdfProcessor.progress}
          />
        </div>
      </SettingsContext.Provider>
    </I18nContext.Provider>
  );
}
