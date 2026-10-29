import React from 'react';
import {
  FileText,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Language, PDFFileItem } from '../types';
import { translations } from '../i18n';

interface BatchQueueListProps {
  currentLang: Language;
  items: PDFFileItem[];
  activeItemId: string | null;
  onSelectItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onConvertItem: (id: string) => void;
  onConvertAll: () => void;
  onClearQueue: () => void;
  onOpenReader: (id: string) => void;
  onExportItem?: (id: string) => void;
  isProcessingAny: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export const BatchQueueList: React.FC<BatchQueueListProps> = ({
  currentLang,
  items,
  activeItemId,
  onSelectItem,
  onRemoveItem,
  onConvertItem,
  onConvertAll,
  onClearQueue,
  onOpenReader,
  onExportItem,
  isProcessingAny,
}) => {
  const t = translations[currentLang];

  if (items.length === 0) return null;

  const totalBytes = items.reduce((acc, item) => acc + item.size, 0);
  const completedCount = items.filter((i) => i.status === 'completed').length;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6 shadow-sm">
      {/* Batch Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-800 text-amber-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm tracking-tight">
              {t.batchQueue}
            </h4>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="font-mono">{items.length} {t.filesSelected}</span>
              <span>·</span>
              <span className="font-mono">{formatBytes(totalBytes)}</span>
              {completedCount > 0 && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-mono">
                    {completedCount} {t.convertedCountLabel}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isProcessingAny}
            onClick={onClearQueue}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-rose-400 rounded-md border border-neutral-800 hover:border-neutral-700 bg-neutral-900/60 transition-colors cursor-pointer disabled:opacity-50"
          >
            {t.clearQueue}
          </button>

          <button
            type="button"
            disabled={isProcessingAny}
            onClick={onConvertAll}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isProcessingAny ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            <span>{t.convertAll}</span>
          </button>
        </div>
      </div>

      {/* Item Rows */}
      <div className="divide-y divide-neutral-800/80">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          const isConverting = item.status === 'converting';
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              className={`group flex flex-col md:flex-row md:items-center justify-between gap-3 py-3.5 px-3 rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-800/60 border border-neutral-700/60'
                  : 'hover:bg-neutral-850'
              }`}
            >
              {/* File details & thumbnail */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Mini thumbnail if ready */}
                <div className="h-10 w-8 shrink-0 overflow-hidden rounded bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                  {item.pages[0]?.thumbnailUrl ? (
                    <img
                      src={item.pages[0].thumbnailUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <FileText className="h-4 w-4 text-neutral-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs text-white truncate max-w-xs md:max-w-md">
                      {item.name}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {t.selectedBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                    <span className="font-mono">{item.totalPages} {t.pagesCount}</span>
                    <span>·</span>
                    <span className="font-mono">{formatBytes(item.size)}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                {/* Status indicator */}
                {isConverting && (
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-amber-400">
                      {item.progress}%
                    </span>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{t.statusCompleted}</span>
                  </div>
                )}

                {item.status === 'ready' && (
                  <span className="text-xs text-neutral-400">
                    {t.statusReady}
                  </span>
                )}

                {item.status === 'error' && (
                  <div className="flex items-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{t.statusError}</span>
                  </div>
                )}

                {/* Primary Button */}
                {isCompleted ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenReader(item.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>{t.previewFlipbook}</span>
                    </button>
                    {onExportItem && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onExportItem(item.id);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30 transition-colors cursor-pointer"
                        title={t.exportStandalone}
                      >
                        <Download className="h-3 w-3" />
                        <span className="hidden sm:inline">{t.exportStandalone}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isConverting || isProcessingAny}
                    onClick={(e) => {
                      e.stopPropagation();
                      onConvertItem(item.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>{t.convertBtn}</span>
                  </button>
                )}

                {/* Delete button */}
                <button
                  type="button"
                  disabled={isConverting}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveItem(item.id);
                  }}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-40"
                  title={t.removeFile}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
