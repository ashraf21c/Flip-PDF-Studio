import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Globe, Check, Sparkles, BookMarked, HelpCircle, FileText } from 'lucide-react';
import { Language, ReadingDirection } from '../types';
import { translations } from '../i18n';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  readingDirection: ReadingDirection;
  activeView: 'studio' | 'reader';
  onViewChange: (view: 'studio' | 'reader') => void;
  hasConvertedPages: boolean;
  onOpenExport: () => void;
  onOpenReadMe: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  readingDirection,
  activeView,
  onViewChange,
  hasConvertedPages,
  onOpenExport,
  onOpenReadMe,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[currentLang];

  const languages: { code: Language; label: string; native: string; dir: 'ltr' | 'rtl' }[] = [
    { code: 'en', label: 'English', native: 'English', dir: 'ltr' },
    { code: 'ar', label: 'Arabic', native: 'العربية', dir: 'rtl' },
    { code: 'ja', label: 'Japanese', native: '日本語', dir: 'ltr' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 md:px-8 backdrop-blur-md">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-white text-base">FlipStudio</span>
            <span className="text-[11px] font-mono tracking-wider text-amber-400/90 uppercase px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              PDF · 3D
            </span>
          </div>
        </div>
      </div>

      {/* Middle Zone: View Mode Switcher */}
      <div className="flex items-center gap-1 rounded-lg bg-neutral-900/90 p-1 border border-neutral-800 text-xs">
        <button
          onClick={() => onViewChange('studio')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeView === 'studio'
              ? 'bg-neutral-800 text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>{t.batchQueue}</span>
        </button>

        <button
          onClick={() => {
            if (hasConvertedPages) onViewChange('reader');
          }}
          disabled={!hasConvertedPages}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
            activeView === 'reader'
              ? 'bg-neutral-800 text-white shadow-sm'
              : hasConvertedPages
              ? 'text-neutral-400 hover:text-neutral-200 cursor-pointer'
              : 'text-neutral-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <BookMarked className="h-3.5 w-3.5 text-emerald-400" />
          <span>{t.interactivePreview}</span>
        </button>
      </div>

      {/* Actions & Language Zone */}
      <div className="flex items-center gap-3">
        {/* Reading Direction Pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 bg-neutral-900 border border-neutral-800 px-2.5 py-1.5 rounded-md font-mono">
          <span className="text-neutral-500">{readingDirection === 'rtl' ? '📖 RTL' : '📖 LTR'}</span>
          <span className="text-[10px] text-neutral-400">
            {readingDirection === 'rtl' ? t.rightBound : t.leftBound}
          </span>
        </div>

        {/* ReadMe & Embed Guide Button */}
        <button
          onClick={onOpenReadMe}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:text-amber-300 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
          title={t.readMeTitle}
        >
          <FileText className="h-3.5 w-3.5 text-amber-400" />
          <span className="hidden sm:inline">{t.readMeBtn}</span>
          <span className="sm:hidden">ReadMe</span>
        </button>

        {/* Quick Export Button if pages converted */}
        {hasConvertedPages && (
          <button
            onClick={onOpenExport}
            className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-colors shadow-sm cursor-pointer"
          >
            {t.exportStandalone}
          </button>
        )}

        {/* Language Toggle Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
            aria-expanded={langMenuOpen}
            aria-label="Toggle language"
          >
            <Globe className="h-3.5 w-3.5 text-neutral-400" />
            <span className="font-sans">
              {languages.find((l) => l.code === currentLang)?.native}
            </span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 rounded-lg border border-neutral-800 bg-neutral-900 py-1.5 shadow-xl ring-1 ring-black/40 z-50">
              <div className="px-3 py-1 text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                Language / اللغة / 言語
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setLangMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                    currentLang === lang.code
                      ? 'bg-amber-500/10 text-amber-300 font-medium'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex flex-col text-start">
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-neutral-500">{lang.label}</span>
                  </div>
                  {currentLang === lang.code && <Check className="h-3.5 w-3.5 text-amber-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
