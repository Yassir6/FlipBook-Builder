import { createContext, useContext, useReducer, type Dispatch } from 'react';
import type { BookSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/constants';

type SettingsAction =
  | { type: 'SET_DISPLAY_MODE'; payload: BookSettings['displayMode'] }
  | { type: 'SET_DIRECTION'; payload: BookSettings['direction'] }
  | { type: 'SET_LANGUAGE'; payload: BookSettings['language'] }
  | { type: 'SET_COLORS'; payload: Partial<BookSettings['colors']> }
  | { type: 'SET_BORDER'; payload: Partial<BookSettings['border']> }
  | { type: 'SET_BACKGROUND'; payload: Partial<BookSettings['background']> }
  | { type: 'SET_COVER'; payload: Partial<BookSettings['cover']> }
  | { type: 'SET_BINDING'; payload: Partial<BookSettings['binding']> }
  | { type: 'SET_SIZE'; payload: Partial<BookSettings['size']> }
  | { type: 'SET_SOUND'; payload: Partial<BookSettings['sound']> }
  | { type: 'SET_EXPORT'; payload: Partial<BookSettings['exportOptions']> }
  | { type: 'RESET' };

function settingsReducer(state: BookSettings, action: SettingsAction): BookSettings {
  switch (action.type) {
    case 'SET_DISPLAY_MODE':
      return { ...state, displayMode: action.payload };
    case 'SET_DIRECTION':
      return { ...state, direction: action.payload };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
        direction: action.payload === 'ar' ? 'rtl' : 'ltr',
      };
    case 'SET_COLORS':
      return { ...state, colors: { ...state.colors, ...action.payload } };
    case 'SET_BORDER':
      return { ...state, border: { ...state.border, ...action.payload } };
    case 'SET_BACKGROUND':
      return { ...state, background: { ...state.background, ...action.payload } };
    case 'SET_COVER':
      return { ...state, cover: { ...state.cover, ...action.payload } };
    case 'SET_BINDING':
      return { ...state, binding: { ...state.binding, ...action.payload } };
    case 'SET_SIZE':
      return { ...state, size: { ...state.size, ...action.payload } };
    case 'SET_SOUND':
      return { ...state, sound: { ...state.sound, ...action.payload } };
    case 'SET_EXPORT':
      return { ...state, exportOptions: { ...state.exportOptions, ...action.payload } };
    case 'RESET':
      return DEFAULT_SETTINGS;
    default:
      return state;
  }
}

export interface SettingsContextValue {
  settings: BookSettings;
  dispatch: Dispatch<SettingsAction>;
}

export const SettingsContext = createContext<SettingsContextValue | null>(null);

export function useBookSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useBookSettings must be used within SettingsProvider');
  return ctx;
}

export function useSettingsReducer() {
  return useReducer(settingsReducer, DEFAULT_SETTINGS);
}

export type { SettingsAction };
