import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { ColorMode, ConversionSettings, ConvertedPage, PageInfo } from '../types';

// Configure the worker for Vite
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Apply color transformation (grayscale, black & white threshold) to canvas context
 */
export function applyColorFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mode: ColorMode,
  bwThreshold: number = 128
) {
  if (mode === 'color') return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const len = data.length;

  if (mode === 'grayscale') {
    for (let i = 0; i < len; i += 4) {
      // Standard perceptual luminance weights
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
  } else if (mode === 'bw') {
    for (let i = 0; i < len; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const binary = gray >= bwThreshold ? 255 : 0;
      data[i] = binary;
      data[i + 1] = binary;
      data[i + 2] = binary;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

/**
 * Inspect a PDF file and extract page count, dimensions, and quick thumbnails
 */
export async function inspectPdfFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ totalPages: number; pages: PageInfo[] }> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const pages: PageInfo[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: 1.0 });

    // Generate low-res thumbnail for manager
    const thumbScale = Math.min(240 / viewport.width, 320 / viewport.height);
    const thumbViewport = page.getViewport({ scale: thumbScale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(thumbViewport.width);
    canvas.height = Math.floor(thumbViewport.height);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      await page.render({
        canvasContext: ctx,
        viewport: thumbViewport,
      }).promise;
    }

    const isCover = i === 1;
    const isBackCover = i === totalPages && totalPages > 1;

    pages.push({
      pageNumber: i,
      width: viewport.width,
      height: viewport.height,
      aspectRatio: viewport.width / viewport.height,
      thumbnailUrl: canvas.toDataURL('image/jpeg', 0.65),
      isSinglePage: isCover || isBackCover, // Default: 1st and last pages are single
      isCover,
      isBackCover,
    });

    if (onProgress) {
      onProgress(Math.round((i / totalPages) * 100));
    }
  }

  return { totalPages, pages };
}

/**
 * Convert full PDF pages to high-quality compressed images with selected color mode and page layout
 */
export async function convertPdfPages(
  file: File,
  pagesInfo: PageInfo[],
  settings: ConversionSettings,
  onProgress?: (current: number, total: number) => void
): Promise<ConvertedPage[]> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const totalPages = pdfDoc.numPages;

  const convertedPages: ConvertedPage[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: settings.scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable');
    }

    // Fill white background in case PDF has transparent areas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport,
    }).promise;

    // Apply color settings (color / grayscale / bw)
    applyColorFilter(ctx, canvas.width, canvas.height, settings.colorMode, settings.bwThreshold);

    // Determine if page is single
    const isFirstCover = i === 1 && settings.separateFirstPageCover;
    const isLastCover = i === totalPages && settings.separateLastPageCover;
    const isCustomSingle = settings.customSinglePages.includes(i);
    const isSinglePage = isFirstCover || isLastCover || isCustomSingle;

    // Convert to compressed JPEG data URL
    const dataUrl = canvas.toDataURL('image/jpeg', settings.quality);

    convertedPages.push({
      pageNumber: i,
      dataUrl,
      width: canvas.width,
      height: canvas.height,
      isSinglePage,
    });

    if (onProgress) {
      onProgress(i, totalPages);
    }
  }

  return convertedPages;
}
