import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Code2,
  FileCheck2,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Sliders,
  Maximize2,
  Terminal,
} from 'lucide-react';
import { Language, ConversionSettings } from '../types';
import { translations } from '../i18n';

interface ReadMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onApplyOcrPreset?: () => void;
}

type EmbedLanguage = 'html' | 'flask' | 'ruby' | 'php';

export const ReadMeModal: React.FC<ReadMeModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onApplyOcrPreset,
}) => {
  const [activeTab, setActiveTab] = useState<'ocr' | 'embed'>('ocr');
  const [activeEmbedLang, setActiveEmbedLang] = useState<EmbedLanguage>('html');
  const [copied, setCopied] = useState(false);
  const [ocrApplied, setOcrApplied] = useState(false);

  const t = translations[currentLang];

  if (!isOpen) return null;

  const codeSnippets: Record<EmbedLanguage, { title: string; filename: string; code: string }> = {
    html: {
      title: 'HTML5 Responsive Embed',
      filename: 'embed.html',
      code: `<!-- 1. Place the extracted 'flipbook' folder in your public web root -->
<!-- 2. Responsive 16:9 or full-viewport container -->
<div style="position: relative; width: 100%; max-width: 1200px; height: 750px; margin: 0 auto; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border-radius: 8px; overflow: hidden;">
  <iframe
    src="/flipbook/index.html"
    title="Interactive Flipbook"
    width="100%"
    height="100%"
    frameborder="0"
    allow="fullscreen"
    allowfullscreen="true"
    loading="lazy"
    style="border: none; display: block;"
  ></iframe>
</div>

<!-- Optional: Direct Fullscreen Launch Button -->
<button onclick="document.querySelector('iframe').requestFullscreen()" style="margin-top: 12px; padding: 8px 16px; background: #f59e0b; color: #000; font-weight: 600; border: none; border-radius: 6px; cursor: pointer;">
  Open Fullscreen Flipbook
</button>`,
    },
    flask: {
      title: 'Python (Flask / FastAPI)',
      filename: 'app.py',
      code: `from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# Route 1: Serve the complete standalone flipbook package
@app.route('/flipbook/<path:filename>')
def serve_flipbook(filename):
    flipbook_dir = os.path.join(app.root_path, 'static', 'flipbook')
    return send_from_directory(flipbook_dir, filename)

# Route 2: Render in your template
@app.route('/catalog')
def view_catalog():
    # Inside templates/catalog.html:
    # <iframe src="{{ url_for('serve_flipbook', filename='index.html') }}" width="100%" height="800px" frameborder="0" allowfullscreen></iframe>
    return render_template('catalog.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)`,
    },
    ruby: {
      title: 'Ruby (Ruby on Rails / Sinatra)',
      filename: 'flipbook_controller.rb',
      code: `# --- Ruby on Rails (6.x / 7.x / 8.x) ---
# Place exported package in: Rails.root.join('public', 'flipbooks', 'sample')
# Then in any View (ERB / HAML):
<%= content_tag :div, class: "flipbook-wrapper", style: "height: 800px; width: 100%;" do %>
  <%= content_tag :iframe, nil, 
        src: "/flipbooks/sample/index.html", 
        style: "width: 100%; height: 100%; border: none;", 
        allow: "fullscreen", 
        allowfullscreen: true %>
<% end %>

# --- Sinatra Endpoint Example ---
require 'sinatra'

get '/reader' do
  # Direct pass-through of the flipbook
  send_file File.join(settings.public_folder, 'flipbook', 'index.html')
end`,
    },
    php: {
      title: 'PHP (Vanilla / WordPress / Laravel)',
      filename: 'flipbook.php',
      code: `<?php
/**
 * FlipStudio Standalone Flipbook Embed for PHP & WordPress
 */
$flipbookUrl = '/assets/flipbook/index.html';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flipbook Showcase</title>
</head>
<body style="margin: 0; background: #09090b;">
  <div style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;">
    <iframe 
      src="<?php echo htmlspecialchars($flipbookUrl, ENT_QUOTES, 'UTF-8'); ?>"
      style="width: 100%; height: 100%; border: none;"
      allow="fullscreen"
      allowfullscreen
    ></iframe>
  </div>
</body>
</html>`,
    },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeEmbedLang].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyPreset = () => {
    if (onApplyOcrPreset) {
      onApplyOcrPreset();
      setOcrApplied(true);
      setTimeout(() => setOcrApplied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                {t.readMeTitle}
              </h3>
              <p className="text-xs text-neutral-400">
                {t.readMeSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-800 bg-neutral-900/60">
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'ocr'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            <span>{t.tabOcr}</span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`flex items-center gap-2 pb-3 px-1 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'embed'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>{t.tabEmbed}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-neutral-200">
          {activeTab === 'ocr' ? (
            <div className="space-y-6">
              {/* Introduction & Quick Preset Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                <div>
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <span>{t.ocrTitle}</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-lg">
                    {t.ocrDesc}
                  </p>
                </div>

                {onApplyOcrPreset && (
                  <button
                    onClick={handleApplyPreset}
                    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                      ocrApplied
                        ? 'bg-emerald-500 text-neutral-950'
                        : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                    }`}
                  >
                    {ocrApplied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t.ocrPresetApplied}</span>
                      </>
                    ) : (
                      <>
                        <Sliders className="h-4 w-4" />
                        <span>{t.applyOcrPreset}</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Actionable OCR Guidelines List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Color Mode */}
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{t.ocrRule1Title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.ocrRule1Desc}
                  </p>
                </div>

                {/* 2. Threshold Cutoff */}
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{t.ocrRule2Title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.ocrRule2Desc}
                  </p>
                </div>

                {/* 3. Render Resolution */}
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{t.ocrRule3Title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.ocrRule3Desc}
                  </p>
                </div>

                {/* 4. Compression Quality */}
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{t.ocrRule4Title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.ocrRule4Desc}
                  </p>
                </div>

                {/* 5. Page Separation */}
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{t.ocrRule5Title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.ocrRule5Desc}
                  </p>
                </div>

                {/* 6. Reading Direction */}
                <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-white">{t.ocrRule6Title}</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {t.ocrRule6Desc}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {t.embedTitle}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.embedDesc}
                </p>
              </div>

              {/* Language Selector Bar */}
              <div className="flex items-center gap-2 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
                {(
                  [
                    { id: 'html', label: 'HTML5 (Universal)' },
                    { id: 'flask', label: 'Python (Flask / FastAPI)' },
                    { id: 'ruby', label: 'Ruby on Rails / Sinatra' },
                    { id: 'php', label: 'PHP / WordPress' },
                  ] as { id: EmbedLanguage; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveEmbedLang(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                      activeEmbedLang === item.id
                        ? 'bg-neutral-800 text-amber-300 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-800 bg-neutral-900/80">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-mono text-xs text-neutral-300">
                      {codeSnippets[activeEmbedLang].filename}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      ({codeSnippets[activeEmbedLang].title})
                    </span>
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>{t.copySnippet}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-4 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed max-h-[360px]">
                  <code>{codeSnippets[activeEmbedLang].code}</code>
                </pre>
              </div>

              {/* Embedding Note */}
              <div className="rounded-lg bg-neutral-950 p-3.5 border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2.5">
                <span className="font-mono text-amber-400 text-sm">💡</span>
                <p className="leading-relaxed">
                  {t.embedHelpNote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-800 bg-neutral-950/80">
          <span className="text-xs text-neutral-500 font-mono">
            {t.devManual}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
