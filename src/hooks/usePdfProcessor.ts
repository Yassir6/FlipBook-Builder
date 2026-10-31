import { useState, useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PageData, PageTextData, PDFMetadata, OutlineItem, ProcessingProgress } from '../types';
import { loadPdf, getPdfMetadata, processAllPages, getOutline } from '../services/pdfService';
import { createSpreadPages, createThumbnails } from '../services/imageService';
import { fileToArrayBuffer } from '../utils/base64';

export interface PdfData {
  pdf: PDFDocumentProxy | null;
  metadata: PDFMetadata | null;
  pages: PageData[];
  spreadPages: PageData[];
  textData: PageTextData[];
  thumbnails: string[];
  outline: OutlineItem[];
  /** The exact bytes of the uploaded PDF — used for downloading the original file unchanged. */
  originalPdfBytes: Uint8Array | null;
  /** Original file name of the uploaded PDF. */
  originalFileName: string | null;
}

export interface PdfProcessorState {
  data: PdfData;
  isProcessing: boolean;
  progress: ProcessingProgress | null;
  error: string | null;
}

const initialData: PdfData = {
  pdf: null,
  metadata: null,
  pages: [],
  spreadPages: [],
  textData: [],
  thumbnails: [],
  outline: [],
  originalPdfBytes: null,
  originalFileName: null,
};

export function usePdfProcessor() {
  const [state, setState] = useState<PdfProcessorState>({
    data: initialData,
    isProcessing: false,
    progress: null,
    error: null,
  });

  const processPdf = useCallback(async (file: File) => {
    setState({
      data: initialData,
      isProcessing: true,
      progress: { phase: 'loading', current: 0, total: 0, percent: 0 },
      error: null,
    });

    try {
      // Load PDF
      const arrayBuffer = await fileToArrayBuffer(file);
      // Keep a snapshot of the original bytes — pdfjs will consume the buffer,
      // so copy before passing in.
      const originalPdfBytes = new Uint8Array(arrayBuffer.slice(0));
      const pdf = await loadPdf(arrayBuffer);
      const metadata = await getPdfMetadata(pdf);

      setState((prev) => ({
        ...prev,
        data: { ...prev.data, pdf, metadata, originalPdfBytes, originalFileName: file.name },
        progress: { phase: 'rendering', current: 0, total: metadata.pageCount, percent: 0 },
      }));

      // Render all pages and extract text
      const { pages, textData } = await processAllPages(pdf, (progress) => {
        setState((prev) => ({ ...prev, progress }));
      });

      // Get outline
      const outline = await getOutline(pdf);

      // Generate thumbnails
      setState((prev) => ({
        ...prev,
        progress: { phase: 'extracting', current: 0, total: pages.length, percent: 90 },
      }));
      const thumbnails = await createThumbnails(pages);

      // Create spread pages (direction-neutral, reversal happens in display layer)
      const spreadPages = await createSpreadPages(pages);

      setState({
        data: {
          pdf,
          metadata,
          pages,
          spreadPages,
          textData,
          thumbnails,
          outline,
          originalPdfBytes,
          originalFileName: file.name,
        },
        isProcessing: false,
        progress: { phase: 'done', current: metadata.pageCount, total: metadata.pageCount, percent: 100 },
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        progress: null,
        error: err instanceof Error ? err.message : 'Failed to process PDF',
      }));
    }
  }, []);

  return {
    ...state,
    processPdf,
  };
}
