/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  ConversionSettings,
  Language,
  PDFFileItem,
  ReadingDirection,
} from './types';
import { translations } from './i18n';
import { inspectPdfFile, convertPdfPages } from './services/pdfService';
import { createSamplePdfFile } from './services/samplePdfService';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { BatchQueueList } from './components/BatchQueueList';
import { ConversionSettingsPanel } from './components/ConversionSettingsPanel';
import { PageSeparationManager } from './components/PageSeparationManager';
import { FlipbookViewer } from './components/FlipbookViewer';
import { ExportModal } from './components/ExportModal';
import { ReadMeModal } from './components/ReadMeModal';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeView, setActiveView] = useState<'studio' | 'reader'>('studio');
  const [files, setFiles] = useState<PDFFileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isReadMeOpen, setIsReadMeOpen] = useState(false);

  // Global Conversion & Layout Settings
  const [globalSettings, setGlobalSettings] = useState<ConversionSettings>({
    readingDirection: 'ltr',
    colorMode: 'color',
    bwThreshold: 128,
    quality: 0.85,
    scale: 1.5,
    separateFirstPageCover: true, // Checked by default as requested!
    separateLastPageCover: true, // Checked by default as requested!
    customSinglePages: [],
    hardCover: true,
    soundEnabled: true,
    autoPlay: false,
    autoPlaySpeed: 3.5,
  });

  const t = translations[currentLang];

  // Sync HTML dir & lang attributes when language changes
  useEffect(() => {
    const isRtl = currentLang === 'ar';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // Automatically suggest RTL reading direction if switching to Arabic
    if (isRtl && globalSettings.readingDirection !== 'rtl') {
      setGlobalSettings((prev) => ({ ...prev, readingDirection: 'rtl' }));
    }
  }, [currentLang]);

  // Handle language change from Header
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
  };

  // Add new PDF files into the batch queue
  const handleFilesSelected = async (newFiles: File[]) => {
    const newItems: PDFFileItem[] = [];

    for (const file of newFiles) {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const item: PDFFileItem = {
        id,
        file,
        name: file.name,
        size: file.size,
        totalPages: 0,
        status: 'rendering_thumbnails',
        progress: 0,
        pages: [],
      };
      newItems.push(item);
    }

    setFiles((prev) => [...prev, ...newItems]);
    if (!activeFileId && newItems.length > 0) {
      setActiveFileId(newItems[0].id);
    }

    // Inspect each new file asynchronously to extract pages & thumbnails
    for (const item of newItems) {
      try {
        const { totalPages, pages } = await inspectPdfFile(item.file, (prog) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress: prog } : f))
          );
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  totalPages,
                  pages,
                  status: 'ready',
                  progress: 0,
                }
              : f
          )
        );
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to inspect PDF';
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: message,
                }
              : f
          )
        );
      }
    }
  };

  // Load sample booklet with one click
  const handleLoadSample = async () => {
    try {
      setIsLoadingSample(true);
      const sampleFile = await createSamplePdfFile();
      await handleFilesSelected([sampleFile]);
    } catch (err) {
      console.error('Error generating sample booklet:', err);
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Active file pointer
  const activeFile = files.find((f) => f.id === activeFileId) || files[0] || null;

  // Convert a single item
  const convertSingleItem = useCallback(
    async (fileId: string) => {
      const targetItem = files.find((f) => f.id === fileId);
      if (!targetItem || targetItem.pages.length === 0) return;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: 'converting', progress: 0 } : f
        )
      );

      try {
        const converted = await convertPdfPages(
          targetItem.file,
          targetItem.pages,
          globalSettings,
          (current, total) => {
            const percent = Math.round((current / total) * 100);
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: percent } : f
              )
            );
          }
        );

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: 'completed',
                  progress: 100,
                  convertedPages: converted,
                }
              : f
          )
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Conversion failed';
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, status: 'error', errorMessage: msg, progress: 0 }
              : f
          )
        );
      }
    },
    [files, globalSettings]
  );

  // Convert all queued items in batch
  const handleConvertAll = async () => {
    setIsProcessingQueue(true);
    for (const item of files) {
      if (item.status === 'ready' || item.status === 'completed') {
        await convertSingleItem(item.id);
      }
    }
    setIsProcessingQueue(false);
  };

  // Remove file from batch queue
  const handleRemoveItem = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (activeFileId === id) {
      const remaining = files.filter((f) => f.id !== id);
      setActiveFileId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  // Clear entire queue
  const handleClearQueue = () => {
    setFiles([]);
    setActiveFileId(null);
  };

  // Open Flipbook in Interactive Reader
  const handleOpenReader = (id: string) => {
    setActiveFileId(id);
    setActiveView('reader');
  };

  const hasAnyConverted = files.some(
    (f) => f.status === 'completed' && f.convertedPages && f.convertedPages.length > 0
  );

  // Current active converted pages for flipbook reader / export
  const activeConvertedPages = activeFile?.convertedPages || [];

  // Apply OCR-optimized conversion settings preset
  const handleApplyOcrPreset = () => {
    setGlobalSettings((prev) => ({
      ...prev,
      colorMode: 'bw',
      bwThreshold: 128,
      scale: 2.0,
      quality: 0.95,
      separateFirstPageCover: true,
      separateLastPageCover: true,
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        readingDirection={globalSettings.readingDirection}
        activeView={activeView}
        onViewChange={setActiveView}
        hasConvertedPages={hasAnyConverted}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenReadMe={() => setIsReadMeOpen(true)}
      />

      {/* Main View Router */}
      {activeView === 'reader' && activeConvertedPages.length > 0 ? (
        <FlipbookViewer
          currentLang={currentLang}
          bookTitle={activeFile?.name || t.interactivePreview}
          pages={activeConvertedPages}
          settings={globalSettings}
          onBackToStudio={() => setActiveView('studio')}
          onOpenExport={() => setIsExportModalOpen(true)}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
          {/* Hero Welcome / Drag-Drop Zone */}
          <section>
            <DropZone
              currentLang={currentLang}
              onFilesSelected={handleFilesSelected}
              onLoadSample={handleLoadSample}
              isLoadingSample={isLoadingSample}
              onApplyOcrPreset={handleApplyOcrPreset}
              isOcrPreset={
                globalSettings.colorMode === 'bw' &&
                globalSettings.scale >= 2.0 &&
                globalSettings.quality >= 0.9 &&
                globalSettings.separateFirstPageCover &&
                globalSettings.separateLastPageCover
              }
            />
          </section>

          {/* If files exist, show Batch Queue */}
          {files.length > 0 && (
            <section>
              <BatchQueueList
                currentLang={currentLang}
                items={files}
                activeItemId={activeFileId}
                onSelectItem={(id) => setActiveFileId(id)}
                onRemoveItem={handleRemoveItem}
                onConvertItem={convertSingleItem}
                onConvertAll={handleConvertAll}
                onClearQueue={handleClearQueue}
                onOpenReader={handleOpenReader}
                onExportItem={(id) => {
                  setActiveFileId(id);
                  setIsExportModalOpen(true);
                }}
                isProcessingAny={isProcessingQueue}
              />
            </section>
          )}

          {/* Global Conversion Settings (Reading Direction, Color, Compression) */}
          <section>
            <ConversionSettingsPanel
              currentLang={currentLang}
              settings={globalSettings}
              onSettingsChange={setGlobalSettings}
              disabled={isProcessingQueue}
            />
          </section>

          {/* Page Separation & Custom Layout Manager (for active file) */}
          {activeFile && activeFile.pages.length > 0 && (
            <section>
              <PageSeparationManager
                currentLang={currentLang}
                pages={activeFile.pages}
                settings={globalSettings}
                onSettingsChange={setGlobalSettings}
                disabled={isProcessingQueue}
              />
            </section>
          )}
        </main>
      )}

      {/* Export Modal */}
      {activeFile && activeConvertedPages.length > 0 && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          currentLang={currentLang}
          bookTitle={activeFile.name}
          pages={activeConvertedPages}
          settings={globalSettings}
        />
      )}

      {/* ReadMe & Embed Guide Modal */}
      <ReadMeModal
        isOpen={isReadMeOpen}
        onClose={() => setIsReadMeOpen(false)}
        currentLang={currentLang}
        onApplyOcrPreset={handleApplyOcrPreset}
      />
    </div>
  );
}
