export type ReadingDirection = 'ltr' | 'rtl';
export type ColorMode = 'color' | 'grayscale' | 'bw';
export type PageLayoutType = 'single' | 'spread';

export type Language = 'en' | 'ar' | 'ja';

export interface PageInfo {
  pageNumber: number; // 1-based
  width: number;
  height: number;
  aspectRatio: number;
  thumbnailUrl?: string;
  isSinglePage: boolean; // true for covers or standalone single pages
  isCover: boolean; // 1st page
  isBackCover: boolean; // last page
}

export interface ConversionSettings {
  readingDirection: ReadingDirection;
  colorMode: ColorMode;
  bwThreshold: number; // 0-255, default 128
  quality: number; // 0.3 - 1.0, default 0.85
  scale: number; // 1.0 (standard) to 2.5 (ultra sharp), default 1.5
  separateFirstPageCover: boolean; // default: true
  separateLastPageCover: boolean; // default: true
  customSinglePages: number[]; // custom 1-based page numbers forced as single
  hardCover: boolean; // 3D thick cover feel
  soundEnabled: boolean; // paper turn sound
  autoPlay: boolean;
  autoPlaySpeed: number; // seconds per turn
}

export interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  width: number;
  height: number;
  isSinglePage: boolean;
}

export interface PDFFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  totalPages: number;
  status: 'idle' | 'rendering_thumbnails' | 'ready' | 'converting' | 'completed' | 'error';
  progress: number; // 0 - 100
  errorMessage?: string;
  pages: PageInfo[];
  convertedPages?: ConvertedPage[];
  customSettings?: Partial<ConversionSettings>;
}

export interface FlipbookSpread {
  spreadIndex: number;
  leftPage?: ConvertedPage;
  rightPage?: ConvertedPage;
  isSingle: boolean;
  pageNumbers: number[];
}
