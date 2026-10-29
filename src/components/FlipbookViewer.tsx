import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  Download,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { ConvertedPage, ConversionSettings, FlipbookSpread, Language } from '../types';
import { translations } from '../i18n';
import { soundService } from '../services/soundService';

interface FlipbookViewerProps {
  currentLang: Language;
  bookTitle: string;
  pages: ConvertedPage[];
  settings: ConversionSettings;
  onBackToStudio: () => void;
  onOpenExport: () => void;
}

export const FlipbookViewer: React.FC<FlipbookViewerProps> = ({
  currentLang,
  bookTitle,
  pages,
  settings,
  onBackToStudio,
  onOpenExport,
}) => {
  const t = translations[currentLang];
  const isRtl = settings.readingDirection === 'rtl';

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [turningDirection, setTurningDirection] = useState<'forward' | 'backward' | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Group pages into spreads according to single page flags and RTL/LTR rules
  const spreads: FlipbookSpread[] = useMemo(() => {
    const list: FlipbookSpread[] = [];
    let i = 0;
    let spreadIdx = 0;

    while (i < pages.length) {
      const page = pages[i];
      if (page.isSinglePage) {
        // Standalone cover or forced single page
        list.push({
          spreadIndex: spreadIdx++,
          leftPage: isRtl ? page : undefined,
          rightPage: isRtl ? undefined : page,
          isSingle: true,
          pageNumbers: [page.pageNumber],
        });
        i++;
      } else {
        const nextIdx = i + 1;
        const page1 = pages[i];
        const page2 = nextIdx < pages.length && !pages[nextIdx].isSinglePage ? pages[nextIdx] : undefined;

        if (page2) {
          list.push({
            spreadIndex: spreadIdx++,
            leftPage: isRtl ? page2 : page1,
            rightPage: isRtl ? page1 : page2,
            isSingle: false,
            pageNumbers: [page1.pageNumber, page2.pageNumber],
          });
          i += 2;
        } else {
          list.push({
            spreadIndex: spreadIdx++,
            leftPage: isRtl ? page1 : undefined,
            rightPage: isRtl ? undefined : page1,
            isSingle: true,
            pageNumbers: [page1.pageNumber],
          });
          i++;
        }
      }
    }

    return list;
  }, [pages, isRtl]);

  const currentSpread = spreads[currentSpreadIndex] || spreads[0];

  // Sound triggering
  const triggerFlipAudio = () => {
    if (soundEnabled) {
      soundService.playFlip();
    }
  };

  const handleNext = () => {
    if (currentSpreadIndex < spreads.length - 1) {
      setTurningDirection('forward');
      triggerFlipAudio();
      setCurrentSpreadIndex((prev) => prev + 1);
      setTimeout(() => setTurningDirection(null), 300);
    }
  };

  const handlePrev = () => {
    if (currentSpreadIndex > 0) {
      setTurningDirection('backward');
      triggerFlipAudio();
      setCurrentSpreadIndex((prev) => prev - 1);
      setTimeout(() => setTurningDirection(null), 300);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (isRtl) handlePrev();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) handleNext();
        else handlePrev();
      } else if (e.key === 'f') {
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, spreads.length, isRtl, isFullscreen]);

  // Autoplay management
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentSpreadIndex((prev) => {
          if (prev >= spreads.length - 1) {
            setIsAutoPlaying(false);
            return prev;
          }
          triggerFlipAudio();
          return prev + 1;
        });
      }, 3500);
    } else {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isAutoPlaying, spreads.length, soundEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentPageDisplay = useMemo(() => {
    if (!currentSpread) return '';
    if (currentSpread.isSingle) {
      return `${t.pageNumberPrefix} ${currentSpread.pageNumbers[0]} ${t.pageOf} ${pages.length}`;
    }
    return `${t.pagesWord} ${currentSpread.pageNumbers.join(' - ')} ${t.pageOf} ${pages.length}`;
  }, [currentSpread, pages.length, t.pageOf, t.pageNumberPrefix, t.pagesWord]);

  return (
    <div
      ref={viewerRef}
      className={`relative flex flex-col h-[calc(100vh-4rem)] w-full bg-neutral-950 overflow-hidden select-none ${
        isFullscreen ? 'h-screen' : ''
      }`}
    >
      {/* Top Toolbar */}
      <div className="flex h-12 w-full items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 z-40 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStudio}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white px-2.5 py-1.5 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.backToStudio}</span>
          </button>
          <div className="h-4 w-px bg-neutral-800" />
          <span className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
            {bookTitle}
          </span>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
            {isRtl ? 'RTL' : 'LTR'}
          </span>
        </div>

        {/* Center: Current Spread Label */}
        <div className="text-xs font-mono text-neutral-300 hidden md:block">
          {currentPageDisplay}
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-neutral-700 bg-neutral-800 text-amber-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            title={t.soundEffects}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-neutral-800/80 rounded-md border border-neutral-700/80 p-0.5">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700 transition-colors cursor-pointer"
              title={t.zoomOut}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 text-neutral-300 min-w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700 transition-colors cursor-pointer"
              title={t.zoomIn}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            {zoom !== 1.0 && (
              <button
                onClick={() => setZoom(1.0)}
                className="p-1 text-neutral-400 hover:text-amber-400 rounded hover:bg-neutral-700 transition-colors cursor-pointer"
                title={t.resetZoom}
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md border border-neutral-800 bg-neutral-800/60 text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors cursor-pointer"
            title={isFullscreen ? t.exitFullscreen : t.fullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>

          {/* Export Action */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-colors cursor-pointer shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.exportStandalone}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Book Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden bg-radial from-neutral-900 via-neutral-950 to-black">
        {/* Previous navigation overlay (Left side in LTR, Right side in RTL) */}
        <button
          onClick={isRtl ? handleNext : handlePrev}
          disabled={isRtl ? currentSpreadIndex >= spreads.length - 1 : currentSpreadIndex === 0}
          className={`absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-700/80 text-white shadow-xl backdrop-blur-md transition-all cursor-pointer hover:bg-neutral-800 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        {/* Next navigation overlay (Right side in LTR, Left side in RTL) */}
        <button
          onClick={isRtl ? handlePrev : handleNext}
          disabled={isRtl ? currentSpreadIndex === 0 : currentSpreadIndex >= spreads.length - 1}
          className={`absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/80 border border-neutral-700/80 text-white shadow-xl backdrop-blur-md transition-all cursor-pointer hover:bg-neutral-800 hover:scale-105 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed`}
          aria-label="Next Page"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* 3D Realistic Book Shell */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${zoom})`,
          }}
        >
          <div
            className={`flex items-center justify-center rounded-md transition-all duration-300 ${
              settings.hardCover ? 'p-1.5 bg-neutral-900 border border-neutral-700/80 shadow-2xl ring-1 ring-black' : ''
            }`}
          >
            {/* Book Spread Container with 3D drop shadow */}
            <div
              className={`relative flex items-stretch overflow-hidden rounded bg-white shadow-2xl transition-all duration-300 ${
                turningDirection === 'forward'
                  ? 'rotate-y-1 -skew-y-0.5'
                  : turningDirection === 'backward'
                  ? '-rotate-y-1 skew-y-0.5'
                  : ''
              }`}
              style={{
                boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 25px rgba(0,0,0,0.5)',
                maxHeight: 'min(76vh, 850px)',
              }}
            >
              {/* Left Page */}
              {currentSpread.leftPage ? (
                <div
                  onClick={isRtl ? handleNext : handlePrev}
                  className="relative group cursor-pointer overflow-hidden bg-white flex items-center justify-center"
                  style={{
                    width: currentSpread.isSingle ? 'auto' : 'clamp(280px, 40vw, 560px)',
                    height: 'clamp(380px, 68vh, 800px)',
                  }}
                >
                  <img
                    src={currentSpread.leftPage.dataUrl}
                    alt={`Page ${currentSpread.leftPage.pageNumber}`}
                    className="h-full w-full object-contain pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle inner spine shadow on right edge of left page */}
                  {!currentSpread.isSingle && (
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-black/25 via-black/10 to-transparent pointer-events-none" />
                  )}

                  {/* Corner Fold Hint */}
                  <div className="absolute bottom-0 left-0 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-black/30 via-white/40 to-transparent pointer-events-none" />
                </div>
              ) : null}

              {/* Center Spine Seam Divider (Visible in 2-page spreads) */}
              {!currentSpread.isSingle && (
                <div className="relative w-1.5 shrink-0 bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 shadow-inner z-20" />
              )}

              {/* Right Page */}
              {currentSpread.rightPage ? (
                <div
                  onClick={isRtl ? handlePrev : handleNext}
                  className="relative group cursor-pointer overflow-hidden bg-white flex items-center justify-center"
                  style={{
                    width: currentSpread.isSingle ? 'clamp(320px, 45vw, 600px)' : 'clamp(280px, 40vw, 560px)',
                    height: 'clamp(380px, 68vh, 800px)',
                  }}
                >
                  <img
                    src={currentSpread.rightPage.dataUrl}
                    alt={`Page ${currentSpread.rightPage.pageNumber}`}
                    className="h-full w-full object-contain pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle inner spine shadow on left edge of right page */}
                  {!currentSpread.isSingle && (
                    <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                  )}

                  {/* Corner Fold Hint */}
                  <div className="absolute bottom-0 right-0 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tl from-black/30 via-white/40 to-transparent pointer-events-none" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scrubber & Transport Bar */}
      <div className="flex h-14 w-full items-center justify-between border-t border-neutral-800 bg-neutral-900/90 px-4 z-40">
        {/* Autoplay Toggle */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
            isAutoPlaying
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
              : 'border-neutral-800 bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800 hover:text-white'
          }`}
        >
          {isAutoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{t.autoPlay}</span>
        </button>

        {/* Center: Interactive Scrubber Slider */}
        <div className="flex items-center gap-3 max-w-md w-full px-4">
          <span className="text-[11px] font-mono text-neutral-400">1</span>
          <input
            type="range"
            min="0"
            max={spreads.length - 1}
            value={currentSpreadIndex}
            onChange={(e) => {
              setCurrentSpreadIndex(parseInt(e.target.value, 10));
              triggerFlipAudio();
            }}
            className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <span className="text-[11px] font-mono text-neutral-400">
            {pages.length}
          </span>
        </div>

        {/* Spread jumper buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setCurrentSpreadIndex(0);
              triggerFlipAudio();
            }}
            disabled={currentSpreadIndex === 0}
            className="px-2 py-1 text-xs text-neutral-400 hover:text-white rounded hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
            title={t.firstPageTitle}
          >
            ⏮
          </button>
          <button
            onClick={() => {
              setCurrentSpreadIndex(spreads.length - 1);
              triggerFlipAudio();
            }}
            disabled={currentSpreadIndex === spreads.length - 1}
            className="px-2 py-1 text-xs text-neutral-400 hover:text-white rounded hover:bg-neutral-800 disabled:opacity-30 cursor-pointer"
            title={t.lastPageTitle}
          >
            ⏭
          </button>
        </div>
      </div>
    </div>
  );
};
