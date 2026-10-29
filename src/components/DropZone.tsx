import React, { useState, useRef } from 'react';
import { Upload, FileUp, Sparkles, ShieldCheck, Terminal, Laptop } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface DropZoneProps {
  currentLang: Language;
  onFilesSelected: (files: File[]) => void;
  onLoadSample: () => void;
  isLoadingSample: boolean;
  onApplyOcrPreset?: () => void;
  isOcrPreset?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  currentLang,
  onFilesSelected,
  onLoadSample,
  isLoadingSample,
  onApplyOcrPreset,
  isOcrPreset = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[currentLang];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files).filter(
        (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      );
      if (selected.length > 0) {
        onFilesSelected(selected);
      }
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
        isDragging
          ? 'border-amber-400 bg-amber-500/10 scale-[1.005]'
          : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 hover:bg-neutral-900/70'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
      />

      <div className="mx-auto flex max-w-xl flex-col items-center">
        {/* Animated Icon Container */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 text-amber-400 shadow-inner ring-1 ring-neutral-700/80">
          <Upload className={`h-8 w-8 transition-transform ${isDragging ? 'scale-110 -translate-y-1' : ''}`} />
        </div>

        <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6">
          {t.dropzoneTitle}
        </h3>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-950 hover:bg-amber-400 transition-colors shadow-md cursor-pointer active:scale-95"
          >
            <FileUp className="h-4 w-4" />
            <span>{t.browseFiles}</span>
          </button>

          <button
            onClick={onLoadSample}
            disabled={isLoadingSample}
            className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{isLoadingSample ? t.converting : t.trySamplePdf}</span>
          </button>

          {onApplyOcrPreset && (
            <button
              onClick={onApplyOcrPreset}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                isOcrPreset
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                  : 'border border-neutral-700 bg-neutral-800/80 text-neutral-200 hover:bg-neutral-700 hover:text-white'
              }`}
              title={t.ocrPresetDesc}
            >
              <Sparkles className="h-4 w-4 text-amber-400 fill-current" />
              <span>{t.ocrOneClickPreset}</span>
              {isOcrPreset && <span className="text-xs font-mono font-bold text-amber-400">✓</span>}
            </button>
          )}
        </div>

        {/* Feature & Platform Trust Footers */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-neutral-800/80 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Laptop className="h-4 w-4 text-neutral-500" />
            <span>{t.windowsLinuxCompatible}</span>
          </div>
          <span className="text-neutral-700">·</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>{t.offlineReady}</span>
          </div>
          <span className="text-neutral-700">·</span>
          <div className="flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-sky-400" />
            <span>{t.clientSideOnly}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
