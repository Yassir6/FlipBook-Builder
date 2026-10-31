export type DisplayMode = 'full' | 'spread';
export type Direction = 'rtl' | 'ltr';
export type Language = 'ar' | 'en';
export type BorderType = 'none' | 'solid' | 'shadow' | 'double';
export type BorderThickness = 'thin' | 'medium' | 'thick';
export type BackgroundType = 'solid' | 'gradient' | 'image' | 'pattern';
export type PatternType = 'wood' | 'marble' | 'fabric' | 'old-paper';
export type SizePreset = 'auto' | 'small' | 'medium' | 'large' | 'custom';

export interface ColorSettings {
  background: string;
  frontCover: string;
  backCover: string;
  toolbar: string;
  toolbarText: string;
}

export interface BorderSettings {
  type: BorderType;
  thickness: BorderThickness;
  color: string;
  radius: number;
  shadow: boolean;
  shadowColor: string;
  shadowIntensity: number;
}

export interface BackgroundSettings {
  type: BackgroundType;
  gradientColors: [string, string];
  gradientAngle: number;
  imageData: string | null;
  pattern: PatternType;
}

export interface CoverSettings {
  mode: CoverMode;
  startFromZero: boolean;
  frontCoverImage: string | null;
  backCoverImage: string | null;
  logoData: string | null;
  title: string;
  titleFont: string;
  titleSize: number;
  titleColor: string;
}

export interface SizeSettings {
  preset: SizePreset;
  width: number;
  height: number;
}

export type BindingType = 'perfect' | 'hardcover' | 'magazine' | 'spiral' | 'japanese';

export interface BindingSettings {
  type: BindingType;
}

export type CoverMode = 'custom' | 'first-page' | 'none';

export type SoundType = 'paper' | 'soft' | 'crisp' | 'heavy' | 'magazine' | 'realistic' | 'none';

export interface SoundSettings {
  enabled: boolean;
  type: SoundType;
}

export interface ExportSettings {
  downloadButton: boolean;
}

export interface BookSettings {
  displayMode: DisplayMode;
  direction: Direction;
  language: Language;
  colors: ColorSettings;
  border: BorderSettings;
  background: BackgroundSettings;
  cover: CoverSettings;
  binding: BindingSettings;
  size: SizeSettings;
  sound: SoundSettings;
  exportOptions: ExportSettings;
}
