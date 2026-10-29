import React from 'react';
import {
  Sliders,
  AlignLeft,
  AlignRight,
  Palette,
  Minimize2,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ColorMode, ConversionSettings, Language, ReadingDirection } from '../types';
import { translations } from '../i18n';

interface ConversionSettingsPanelProps {
  currentLang: Language;
  settings: ConversionSettings;
  onSettingsChange: (newSettings: ConversionSettings) => void;
  disabled?: boolean;
}

export const ConversionSettingsPanel: React.FC<ConversionSettingsPanelProps> = ({
  currentLang,
  settings,
  onSettingsChange,
  disabled = false,
}) => {
  const t = translations[currentLang];

  const updateSetting = <K extends keyof ConversionSettings>(key: K, value: ConversionSettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const isOcrPreset =
    settings.colorMode === 'bw' &&
    settings.scale >= 2.0 &&
    settings.quality >= 0.9 &&
    settings.separateFirstPageCover &&
    settings.separateLastPageCover;

  const handleApplyOcrPreset = () => {
    onSettingsChange({
      ...settings,
      colorMode: 'bw',
      bwThreshold: 128,
      scale: 2.0,
      quality: 0.95,
      separateFirstPageCover: true,
      separateLastPageCover: true,
    });
  };

  const handleApplyStandardPreset = () => {
    onSettingsChange({
      ...settings,
      colorMode: 'color',
      scale: 1.5,
      quality: 0.85,
    });
  };

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-800 mb-5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-400" />
          <h4 className="font-semibold text-white text-sm tracking-tight">
            {t.settingsWizard}
          </h4>
        </div>

        {/* 1-Click Preset Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={handleApplyOcrPreset}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isOcrPreset
                ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-400/50 shadow-amber-500/20'
                : 'bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-amber-500/30 hover:border-amber-400/60'
            }`}
            title={t.ocrPresetDesc}
          >
            <Sparkles className="h-3.5 w-3.5 fill-current" />
            <span>{t.ocrOneClickPreset}</span>
            {isOcrPreset && (
              <span className="text-[10px] bg-neutral-950/20 px-1 py-0.2 rounded font-mono font-bold">
                ✓
              </span>
            )}
          </button>

          <button
            type="button"
            disabled={disabled}
            onClick={handleApplyStandardPreset}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
          >
            {t.standardPreset}
          </button>
        </div>
      </div>

      {/* OCR Active Notification Banner */}
      {isOcrPreset && (
        <div className="mb-5 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span>{t.ocrActiveBanner}</span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-amber-400/90 bg-amber-500/20 px-2 py-0.5 rounded font-medium">
            300 DPI · B&W
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Reading Direction (LTR / RTL) */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
            <span className="text-neutral-400">01.</span> {t.readingDirection}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => updateSetting('readingDirection', 'ltr')}
              className={`flex flex-col items-start p-3 rounded-lg border text-start transition-all cursor-pointer ${
                settings.readingDirection === 'ltr'
                  ? 'border-amber-500/50 bg-amber-500/10 text-white'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                <AlignLeft className="h-3.5 w-3.5 text-amber-400" />
                <span>LTR</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {t.leftToRight}
              </p>
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => updateSetting('readingDirection', 'rtl')}
              className={`flex flex-col items-start p-3 rounded-lg border text-start transition-all cursor-pointer ${
                settings.readingDirection === 'rtl'
                  ? 'border-amber-500/50 bg-amber-500/10 text-white'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold mb-1">
                <AlignRight className="h-3.5 w-3.5 text-amber-400" />
                <span>RTL</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                {t.rightToLeft}
              </p>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400">
            {settings.readingDirection === 'rtl' ? t.rightToLeftDesc : t.leftToRightDesc}
          </p>
        </div>

        {/* 2. Color Settings (Color / Grayscale / B&W) */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
            <span className="text-neutral-400">02.</span> {t.colorSettings}
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
            {(
              [
                { mode: 'color', label: t.colorOriginal },
                { mode: 'grayscale', label: t.grayscale },
                { mode: 'bw', label: t.blackAndWhite },
              ] as { mode: ColorMode; label: string }[]
            ).map((item) => (
              <button
                key={item.mode}
                type="button"
                disabled={disabled}
                onClick={() => updateSetting('colorMode', item.mode)}
                className={`py-2 px-2 text-xs font-medium rounded-md transition-all truncate cursor-pointer ${
                  settings.colorMode === item.mode
                    ? 'bg-neutral-800 text-amber-300 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* If Black & White, reveal threshold slider */}
          {settings.colorMode === 'bw' && (
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>{t.bwThreshold}</span>
                <span className="font-mono text-neutral-300">{settings.bwThreshold}</span>
              </div>
              <input
                type="range"
                min="64"
                max="200"
                step="2"
                value={settings.bwThreshold}
                onChange={(e) => updateSetting('bwThreshold', parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
            </div>
          )}
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <Palette className="h-3 w-3 text-neutral-500" />
            <span>
              {settings.colorMode === 'bw'
                ? t.colorBwDesc
                : settings.colorMode === 'grayscale'
                ? t.colorGrayscaleDesc
                : t.colorOriginalDesc}
            </span>
          </div>
        </div>

        {/* 3. Compression & Resolution */}
        <div className="space-y-3">
          <label className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
            <span className="text-neutral-400">03.</span> {t.compressionSettings}
          </label>

          {/* Quality Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
              <span>{t.imageQuality}</span>
              <span className="font-mono text-amber-400">
                {Math.round(settings.quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.35"
              max="1.0"
              step="0.05"
              value={settings.quality}
              onChange={(e) => updateSetting('quality', parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Scale / DPI Selector */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
              <span>{t.renderResolution}</span>
              <span className="font-mono text-neutral-300">{settings.scale}x</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { scale: 1.0, label: t.dpiStandard },
                { scale: 1.5, label: t.dpiHigh },
                { scale: 2.0, label: t.dpiUltra },
              ].map((opt) => (
                <button
                  key={opt.scale}
                  type="button"
                  disabled={disabled}
                  onClick={() => updateSetting('scale', opt.scale)}
                  className={`py-1.5 px-1 text-[11px] font-medium rounded border transition-all text-center cursor-pointer ${
                    settings.scale === opt.scale
                      ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  {opt.label.split(' ')[0]} ({opt.scale}x)
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Experience Toggles */}
      <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          {/* Sound Effect Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 hover:text-white">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
            />
            {settings.soundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-neutral-500" />
            )}
            <span>{t.soundEffects}</span>
          </label>

          {/* Hardcover Effect Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 hover:text-white">
            <input
              type="checkbox"
              checked={settings.hardCover}
              onChange={(e) => updateSetting('hardCover', e.target.checked)}
              className="rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-0 focus:ring-offset-0 h-4 w-4"
            />
            <Layers className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.hardCover}</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
          <Sparkles className="h-3.5 w-3.5 text-amber-400/80" />
          <span>{t.testedEngineNote}</span>
        </div>
      </div>
    </div>
  );
};
