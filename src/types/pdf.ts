export interface PageData {
  index: number;
  imageData: string; // base64 data URL
  width: number;
  height: number;
}

export interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageTextData {
  pageIndex: number;
  items: TextItem[];
  fullText: string;
}

export interface PDFMetadata {
  title: string;
  author: string;
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
}

export interface OutlineItem {
  title: string;
  pageIndex: number;
  children: OutlineItem[];
}

export interface ProcessingProgress {
  phase: 'loading' | 'rendering' | 'extracting' | 'done';
  current: number;
  total: number;
  percent: number;
}
