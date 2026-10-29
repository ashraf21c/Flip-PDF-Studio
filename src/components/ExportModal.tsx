import React, { useState } from 'react';
import {
  X,
  Archive,
  FileCode,
  Image,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Laptop,
} from 'lucide-react';
import { ConvertedPage, ConversionSettings, Language } from '../types';
import { translations } from '../i18n';
import {
  buildStandaloneZipPackage,
  buildSingleFileHtml,
  buildImagesZip,
  ExportProgress,
} from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  bookTitle: string;
  pages: ConvertedPage[];
  settings: ConversionSettings;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  bookTitle,
  pages,
  settings,
}) => {
  const [exportType, setExportType] = useState<'zip' | 'html' | 'images'>('zip');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const t = translations[currentLang];

  if (!isOpen) return null;

  const getStageLabel = (stage: ExportProgress['stage']) => {
    switch (stage) {
      case 'packaging_pages':
        return t.exportProgressPackagingPages;
      case 'generating_viewer':
        return t.exportProgressGeneratingViewer;
      case 'compressing_archive':
        return t.exportProgressCompressingArchive;
      case 'embedding_assets':
        return t.exportProgressEmbeddingAssets;
      case 'compiling_reader':
        return t.exportProgressCompilingReader;
      case 'finalizing':
        return t.exportProgressFinalizing;
      case 'completed':
        return t.exportProgressCompleted;
      default:
        return t.preparingExport;
    }
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      setDownloadSuccess(false);
      setExportError(null);
      setExportProgress({
        percent: 0,
        stage: exportType === 'html' ? 'embedding_assets' : 'packaging_pages',
        processedCount: 0,
        totalCount: pages.length,
      });

      const sanitizedTitle = (bookTitle || 'flipbook')
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_\u0600-\u06FF\u3040-\u30FF\u4E00-\u9FAF-]/g, '_');

      let blob: Blob;
      let filename: string;

      const progressCallback = (prog: ExportProgress) => {
        setExportProgress(prog);
      };

      if (exportType === 'zip') {
        blob = await buildStandaloneZipPackage(
          {
            bookTitle,
            pages,
            settings,
            language: currentLang,
          },
          progressCallback
        );
        filename = `${sanitizedTitle}_flipbook_offline.zip`;
      } else if (exportType === 'html') {
        blob = await buildSingleFileHtml(
          {
            bookTitle,
            pages,
            settings,
            language: currentLang,
          },
          progressCallback
        );
        filename = `${sanitizedTitle}_flipbook.html`;
      } else {
        blob = await buildImagesZip(
          {
            bookTitle,
            pages,
            settings,
            language: currentLang,
          },
          progressCallback
        );
        filename = `${sanitizedTitle}_pages.zip`;
      }

      // Trigger browser download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Export error:', err);
      setExportError(t.exportFailed);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {t.exportModalTitle}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {t.exportModalSubtitle}
          </p>
        </div>

        {/* Format Selector */}
        <div className={`space-y-3 mb-6 ${isExporting ? 'pointer-events-none opacity-60' : ''}`}>
          {/* Format 1: Standalone ZIP Package */}
          <div
            onClick={() => setExportType('zip')}
            className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
              exportType === 'zip'
                ? 'border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/20'
                : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
            }`}
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Archive className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {t.exportZipTitle}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {t.recommendedBadge}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.exportZipDesc}
              </p>
            </div>
          </div>

          {/* Format 2: Self-Contained Single File HTML */}
          <div
            onClick={() => setExportType('html')}
            className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
              exportType === 'html'
                ? 'border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/20'
                : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
            }`}
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
              <FileCode className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-white">
                {t.exportHtmlTitle}
              </span>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.exportHtmlDesc}
              </p>
            </div>
          </div>

          {/* Format 3: Converted Page Images */}
          <div
            onClick={() => setExportType('images')}
            className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
              exportType === 'images'
                ? 'border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/20'
                : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
            }`}
          >
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Image className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-white">
                {t.exportImagesTitle}
              </span>
              <p className="text-xs text-neutral-400 mt-0.5">
                {t.exportImagesDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time Export Progress Card */}
        {(isExporting || downloadSuccess) && exportProgress && (
          <div className="mb-6 rounded-xl border border-amber-500/30 bg-neutral-950 p-4 shadow-lg ring-1 ring-amber-500/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    downloadSuccess
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {downloadSuccess ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">
                      {t.exportProgressTitle}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                      {exportType === 'zip'
                        ? t.exportFormatZip
                        : exportType === 'html'
                        ? t.exportFormatHtml
                        : t.exportFormatImages}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {downloadSuccess ? t.exportProgressCompleted : getStageLabel(exportProgress.stage)}
                  </p>
                </div>
              </div>

              <div className="text-end shrink-0 pl-3">
                <span
                  className={`font-mono text-sm font-bold ${
                    downloadSuccess ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {downloadSuccess ? '100%' : `${exportProgress.percent}%`}
                </span>
              </div>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden border border-neutral-700/50">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  downloadSuccess
                    ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                }`}
                style={{ width: `${downloadSuccess ? 100 : Math.max(exportProgress.percent, 4)}%` }}
              />
            </div>

            {/* Footer info: current file & step pipeline */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-neutral-400 pt-0.5">
              <div className="min-w-0 flex items-center gap-1.5 font-mono text-neutral-400">
                {exportProgress.currentFile ? (
                  <>
                    <span className="text-neutral-500">{t.exportProgressCurrentFile}:</span>
                    <span className="text-neutral-200 truncate max-w-[200px]">{exportProgress.currentFile}</span>
                  </>
                ) : (
                  <span>
                    {pages.length} {t.pagesWord}
                  </span>
                )}
              </div>

              {/* 3 Steps Pipeline Tracker */}
              <div className="flex items-center gap-1 font-mono">
                <span
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    exportProgress.percent >= 45 || downloadSuccess
                      ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  1. {t.exportProgressStep1}
                </span>
                <span className="text-neutral-600">{currentLang === 'ar' ? '‹' : '›'}</span>
                <span
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    exportProgress.percent >= 55 || downloadSuccess
                      ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  2. {t.exportProgressStep2}
                </span>
                <span className="text-neutral-600">{currentLang === 'ar' ? '‹' : '›'}</span>
                <span
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    exportProgress.percent >= 98 || downloadSuccess
                      ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  3. {t.exportProgressStep3}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error notification banner if any */}
        {exportError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{exportError}</span>
          </div>
        )}

        {/* Windows & Linux instructions callout */}
        <div className="mb-6 rounded-lg bg-neutral-950 p-3.5 border border-neutral-800 text-xs text-neutral-400">
          <div className="flex items-center gap-2 text-neutral-300 font-medium mb-1">
            <Laptop className="h-4 w-4 text-amber-400" />
            <span>{t.crossPlatformTitle}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {t.crossPlatformNote} {t.crossPlatformExtractNote}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          >
            {t.close}
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-semibold text-neutral-950 transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  {exportProgress ? `${exportProgress.percent}% ` : ''}
                  {t.exportingInProgress}
                </span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-neutral-950" />
                <span>{t.downloaded}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>{t.downloadNow}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
