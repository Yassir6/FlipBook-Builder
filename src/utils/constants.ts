import type { BookSettings } from '../types';

export const SIZE_PRESETS = {
  auto: { width: 0, height: 0 },
  small: { width: 800, height: 600 },
  medium: { width: 1024, height: 768 },
  large: { width: 1280, height: 960 },
} as const;

export const ZOOM_LEVELS = [50, 75, 100, 150, 200] as const;

export const BORDER_THICKNESS_VALUES = {
  thin: 1,
  medium: 2,
  thick: 4,
} as const;

export const BINDING_PRESETS = {
  perfect: { flippingTime: 600, drawShadow: true, maxShadowOpacity: 0.3, showPageCorners: true },
  hardcover: { flippingTime: 800, drawShadow: true, maxShadowOpacity: 0.5, showPageCorners: true },
  magazine: { flippingTime: 400, drawShadow: true, maxShadowOpacity: 0.2, showPageCorners: true },
  spiral: { flippingTime: 500, drawShadow: false, maxShadowOpacity: 0, showPageCorners: false },
  japanese: { flippingTime: 900, drawShadow: true, maxShadowOpacity: 0.15, showPageCorners: false },
} as const;

export const PDF_RENDER_SCALE = 2.0;
export const THUMBNAIL_SCALE = 0.2;
export const BATCH_SIZE = 4;

export const DEFAULT_SETTINGS: BookSettings = {
  displayMode: 'full',
  direction: 'rtl',
  language: 'ar',
  colors: {
    background: '#FAF8F5',
    frontCover: '#1A1714',
    backCover: '#1A1714',
    toolbar: '#1A1714',
    toolbarText: '#FAF8F5',
  },
  border: {
    type: 'shadow',
    thickness: 'medium',
    color: '#E5E0D8',
    radius: 4,
    shadow: true,
    shadowColor: 'rgba(26, 23, 20, 0.3)',
    shadowIntensity: 50,
  },
  background: {
    type: 'solid',
    gradientColors: ['#FAF8F5', '#E5E0D8'],
    gradientAngle: 135,
    imageData: null,
    pattern: 'wood',
  },
  cover: {
    mode: 'custom',
    startFromZero: false,
    frontCoverImage: null,
    backCoverImage: null,
    logoData: null,
    title: '',
    titleFont: 'IBM Plex Sans Arabic',
    titleSize: 32,
    titleColor: '#FAF8F5',
  },
  binding: {
    type: 'perfect',
  },
  size: {
    preset: 'auto',
    width: 1024,
    height: 768,
  },
  sound: {
    enabled: true,
    type: 'paper',
  },
  exportOptions: {
    downloadButton: true,
  },
};
