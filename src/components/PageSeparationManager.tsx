import React from 'react';
import {
  BookOpen,
  LayoutGrid,
  BookmarkCheck,
  CheckSquare,
  Square,
  SplitSquareVertical,
  BookMarked,
  Info,
} from 'lucide-react';
import { ConversionSettings, Language, PageInfo } from '../types';
import { translations } from '../i18n';

interface PageSeparationManagerProps {
  currentLang: Language;
  pages: PageInfo[];
  settings: ConversionSettings;
  onSettingsChange: (newSettings: ConversionSettings) => void;
  disabled?: boolean;
}

export const PageSeparationManager: React.FC<PageSeparationManagerProps> = ({
  currentLang,
  pages,
  settings,
  onSettingsChange,
  disabled = false,
}) => {
  const t = translations[currentLang];
  const total = pages.length;

  if (total === 0) return null;

  const isFirstCover = settings.separateFirstPageCover;
  const isLastCover = settings.separateLastPageCover;
  const customSingles = settings.customSinglePages;

  // Toggle custom page
  const handleTogglePage = (pageNum: number) => {
    if (disabled) return;

    // If it's page 1, toggle separateFirstPageCover
    if (pageNum === 1) {
      onSettingsChange({
        ...settings,
        separateFirstPageCover: !settings.separateFirstPageCover,
      });
      return;
    }

    // If it's last page, toggle separateLastPageCover
    if (pageNum === total && total > 1) {
      onSettingsChange({
        ...settings,
        separateLastPageCover: !settings.separateLastPageCover,
      });
      return;
    }

    // Otherwise toggle customSinglePages list
    let updated: number[];
    if (customSingles.includes(pageNum)) {
      updated = customSingles.filter((p) => p !== pageNum);
    } else {
      updated = [...customSingles, pageNum].sort((a, b) => a - b);
    }

    onSettingsChange({
      ...settings,
      customSinglePages: updated,
    });
  };

  // Preset: Reset to Default (1st and last cover single)
  const handlePresetDefault = () => {
    onSettingsChange({
      ...settings,
      separateFirstPageCover: true,
      separateLastPageCover: true,
      customSinglePages: [],
    });
  };

  // Preset: All Spreads (no covers isolated)
  const handlePresetAllSpreads = () => {
    onSettingsChange({
      ...settings,
      separateFirstPageCover: false,
      separateLastPageCover: false,
      customSinglePages: [],
    });
  };

  // Preset: All Singles (pure 1-page reader)
  const handlePresetAllSingles = () => {
    const all = Array.from({ length: total }, (_, i) => i + 1);
    onSettingsChange({
      ...settings,
      separateFirstPageCover: true,
      separateLastPageCover: true,
      customSinglePages: all.filter((p) => p !== 1 && p !== total),
    });
  };

  // Helper to determine status for page card
  const getPageStatus = (pageNum: number) => {
    if (pageNum === 1) {
      return {
        isSingle: isFirstCover,
        badgeText: t.coverBadge,
        colorClass: isFirstCover
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-neutral-800 text-neutral-400 border-neutral-700',
      };
    }
    if (pageNum === total && total > 1) {
      return {
        isSingle: isLastCover,
        badgeText: t.backCoverBadge,
        colorClass: isLastCover
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-neutral-800 text-neutral-400 border-neutral-700',
      };
    }
    const isCustom = customSingles.includes(pageNum);
    return {
      isSingle: isCustom,
      badgeText: isCustom ? t.singleBadge : t.spreadBadge,
      colorClass: isCustom
        ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
        : 'bg-neutral-800/80 text-neutral-400 border-neutral-700/60',
    };
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-amber-400" />
            <h4 className="font-semibold text-white text-sm tracking-tight">
              {t.pageSeparation}
            </h4>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            {t.pageSeparationDesc}
          </p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
          <button
            type="button"
            disabled={disabled}
            onClick={handlePresetDefault}
            className="px-2.5 py-1 rounded font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {t.selectAllCovers}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={handlePresetAllSpreads}
            className="px-2.5 py-1 rounded font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {t.allAsSpreads}
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={handlePresetAllSingles}
            className="px-2.5 py-1 rounded font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {t.allAsSingles}
          </button>
        </div>
      </div>

      {/* Primary Cover Checkboxes (Checked by default as requested!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-3.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
        {/* 1st Page Cover Checkbox */}
        <label className="flex items-start gap-3 p-2.5 rounded-md hover:bg-neutral-900/60 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={isFirstCover}
            disabled={disabled}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                separateFirstPageCover: e.target.checked,
              })
            }
            className="mt-0.5 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {t.firstPageCover}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                {t.pageNumberPrefix} 1
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {t.coverPageSub}
            </p>
          </div>
        </label>

        {/* Latest Page Back Cover Checkbox */}
        <label className="flex items-start gap-3 p-2.5 rounded-md hover:bg-neutral-900/60 transition-colors cursor-pointer">
          <input
            type="checkbox"
            checked={isLastCover}
            disabled={disabled}
            onChange={(e) =>
              onSettingsChange({
                ...settings,
                separateLastPageCover: e.target.checked,
              })
            }
            className="mt-0.5 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 h-4 w-4 cursor-pointer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {t.lastPageCover}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                {t.pageNumberPrefix} {total}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              {t.backCoverPageSub}
            </p>
          </div>
        </label>
      </div>

      {/* Interactive Page Thumbnail Strip & Custom Split Selector */}
      <div>
        <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-neutral-500" />
            <span>{t.selectMoreSinglePages}</span>
          </span>
          <span className="font-mono text-neutral-500 text-[11px]">
            {total} {t.pagesCount}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {pages.map((p) => {
            const status = getPageStatus(p.pageNumber);
            return (
              <div
                key={p.pageNumber}
                onClick={() => handleTogglePage(p.pageNumber)}
                className={`group relative rounded-lg border p-1.5 transition-all cursor-pointer flex flex-col items-center ${
                  status.isSingle
                    ? 'border-amber-500/50 bg-neutral-900 ring-1 ring-amber-500/20'
                    : 'border-neutral-800 bg-neutral-950/40 hover:border-neutral-700'
                }`}
              >
                {/* Thumbnail Preview Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                  {p.thumbnailUrl ? (
                    <img
                      src={p.thumbnailUrl}
                      alt={`Page ${p.pageNumber}`}
                      className="h-full w-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="font-mono text-xs text-neutral-600">
                      P.{p.pageNumber}
                    </span>
                  )}

                  {/* Corner indicator */}
                  <div className="absolute top-1 right-1">
                    {status.isSingle ? (
                      <CheckSquare className="h-3.5 w-3.5 text-amber-400 drop-shadow" />
                    ) : (
                      <Square className="h-3.5 w-3.5 text-neutral-500/80 drop-shadow" />
                    )}
                  </div>
                </div>

                {/* Page Label & Badge */}
                <div className="mt-1.5 flex w-full items-center justify-between text-[11px] px-0.5">
                  <span className="font-mono text-neutral-400 font-medium">
                    #{p.pageNumber}
                  </span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded border font-mono ${status.colorClass}`}
                  >
                    {status.isSingle ? t.singleBadge : t.spreadBadge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
