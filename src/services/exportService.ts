import JSZip from 'jszip';
import { ConvertedPage, ConversionSettings, Language } from '../types';

interface ExportPackageOptions {
  bookTitle: string;
  pages: ConvertedPage[];
  settings: ConversionSettings;
  language: Language;
}

/**
 * Generates the clean standalone Flipbook HTML & JS template
 * supporting both LTR and RTL reading directions, touch/mouse dragging,
 * 3D page turning, zoom, and sound synthesizer.
 */
function generateFlipbookHtml(options: {
  bookTitle: string;
  totalPages: number;
  readingDirection: 'ltr' | 'rtl';
  isRtlUi: boolean;
  pagePathsOrDataUrls: string[];
  singlePageFlags: boolean[];
  hardCover: boolean;
  soundEnabled: boolean;
  isInline: boolean;
  language?: Language;
}): string {
  const {
    bookTitle,
    totalPages,
    readingDirection,
    isRtlUi,
    pagePathsOrDataUrls,
    singlePageFlags,
    hardCover,
    soundEnabled,
    language = isRtlUi ? 'ar' : 'en',
  } = options;

  const uiDir = isRtlUi ? 'rtl' : 'ltr';
  const pagesJson = JSON.stringify(pagePathsOrDataUrls);
  const singleFlagsJson = JSON.stringify(singlePageFlags);
  const docSubtitle =
    language === 'ar'
      ? 'كتاب تفاعلي'
      : language === 'ja'
      ? 'インタラクティブ・フリップブック'
      : 'Interactive Flipbook';

  return `<!DOCTYPE html>
<html lang="${language}" dir="${uiDir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0">
  <title>${escapeHtml(bookTitle)} - ${docSubtitle}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; }
    body {
      background-color: #09090b;
      color: #f4f4f5;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: #18181b;
      border-bottom: 1px solid #27272a;
      z-index: 50;
    }
    .brand {
      font-weight: 600;
      font-size: 14px;
      letter-spacing: -0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .badge {
      font-size: 11px;
      padding: 2px 6px;
      border-radius: 4px;
      background: #27272a;
      color: #a1a1aa;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button {
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #f4f4f5;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    button:hover { background: #3f3f46; }
    button:active { transform: scale(0.97); }
    button:disabled { opacity: 0.35; cursor: not-allowed; }
    #viewport {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      perspective: 2400px;
      background: radial-gradient(circle at center, #1c1917 0%, #09090b 80%);
    }
    #book-container {
      position: relative;
      display: flex;
      transform-style: preserve-3d;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85);
      border-radius: 4px;
    }
    .page-sheet {
      position: relative;
      background: #ffffff;
      overflow: hidden;
      box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.08);
      backface-visibility: hidden;
    }
    .page-sheet img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      pointer-events: none;
    }
    .spine-shadow {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 30px;
      pointer-events: none;
      z-index: 10;
    }
    .spine-left { right: 0; background: linear-gradient(to right, transparent, rgba(0,0,0,0.22)); }
    .spine-right { left: 0; background: linear-gradient(to left, transparent, rgba(0,0,0,0.22)); }
    .nav-hitbox {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 15%;
      min-width: 60px;
      z-index: 30;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .nav-hitbox:hover { opacity: 1; }
    .nav-left { left: 0; background: linear-gradient(to right, rgba(0,0,0,0.3), transparent); }
    .nav-right { right: 0; background: linear-gradient(to left, rgba(0,0,0,0.3), transparent); }
    .nav-arrow {
      background: rgba(24, 24, 27, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.15);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }
    footer {
      height: 52px;
      background: #18181b;
      border-top: 1px solid #27272a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      z-index: 50;
    }
    .controls-center {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .scrubber {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    input[type=range] {
      accent-color: #f59e0b;
      cursor: pointer;
      width: 140px;
    }
    .corner-fold {
      position: absolute;
      width: 50px;
      height: 50px;
      bottom: 0;
      z-index: 20;
      cursor: pointer;
      opacity: 0.6;
      transition: opacity 0.2s;
    }
    .corner-fold:hover { opacity: 1; }
    .corner-right {
      right: 0;
      background: linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(0,0,0,0.2) 65%);
    }
    .corner-left {
      left: 0;
      background: linear-gradient(225deg, transparent 50%, rgba(255,255,255,0.4) 50%, rgba(0,0,0,0.2) 65%);
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span>${escapeHtml(bookTitle)}</span>
      <span class="badge">${readingDirection.toUpperCase()}</span>
      <span class="badge">${totalPages} ${language === 'ar' ? 'صفحة' : language === 'ja' ? 'ページ' : 'Pages'}</span>
    </div>
    <div class="actions">
      <button id="btn-sound" title="${language === 'ar' ? 'تبديل الصوت' : language === 'ja' ? '音声切り替え' : 'Toggle Sound'}">${soundEnabled ? (language === 'ar' ? '🔊 الصوت' : language === 'ja' ? '🔊 音' : '🔊 Sound') : (language === 'ar' ? '🔇 كتم' : language === 'ja' ? '🔇 消音' : '🔇 Muted')}</button>
      <button id="btn-zoom-in" title="${language === 'ar' ? 'تكبير' : language === 'ja' ? '拡大' : 'Zoom In'}">+</button>
      <button id="btn-zoom-out" title="${language === 'ar' ? 'تصغير' : language === 'ja' ? '縮小' : 'Zoom Out'}">-</button>
      <button id="btn-fullscreen" title="${language === 'ar' ? 'ملء الشاشة' : language === 'ja' ? '全画面表示' : 'Toggle Fullscreen'}">⛶</button>
    </div>
  </header>

  <main id="viewport">
    <div id="nav-prev" class="nav-hitbox nav-left"><div class="nav-arrow">${readingDirection === 'rtl' ? '❯' : '❮'}</div></div>
    <div id="nav-next" class="nav-hitbox nav-right"><div class="nav-arrow">${readingDirection === 'rtl' ? '❮' : '❯'}</div></div>

    <div id="book-container">
      <div id="left-page-container" class="page-sheet">
        <div class="spine-shadow spine-left"></div>
        <img id="left-page-img" src="" alt="Left Page" />
        <div class="corner-fold corner-left" id="corner-prev"></div>
      </div>
      <div id="right-page-container" class="page-sheet">
        <div class="spine-shadow spine-right"></div>
        <img id="right-page-img" src="" alt="Right Page" />
        <div class="corner-fold corner-right" id="corner-next"></div>
      </div>
    </div>
  </main>

  <footer>
    <div class="status-indicator">
      <span id="page-display-label">${language === 'ar' ? 'صفحة 1' : language === 'ja' ? 'ページ 1' : 'Page 1'} / ${totalPages}</span>
    </div>

    <div class="controls-center">
      <button id="btn-first" title="${language === 'ar' ? 'الصفحة الأولى' : language === 'ja' ? '最初のページ' : 'First Page'}">⏮</button>
      <button id="btn-prev" title="${language === 'ar' ? 'الصفحة السابقة' : language === 'ja' ? '前のページ' : 'Previous Page'}">${readingDirection === 'rtl' ? '▶' : '◀'}</button>
      <div class="scrubber">
        <input type="range" id="page-range" min="1" max="${totalPages}" value="1">
      </div>
      <button id="btn-next" title="${language === 'ar' ? 'الصفحة التالية' : language === 'ja' ? '次のページ' : 'Next Page'}">${readingDirection === 'rtl' ? '◀' : '▶'}</button>
      <button id="btn-last" title="${language === 'ar' ? 'الصفحة الأخيرة' : language === 'ja' ? '最後のページ' : 'Last Page'}">⏭</button>
    </div>

    <div>
      <button id="btn-autoplay" title="${language === 'ar' ? 'تقليب تلقائي' : language === 'ja' ? '自動めくり' : 'Auto Flip'}">▶ ${language === 'ar' ? 'تلقائي' : language === 'ja' ? '自動' : 'Auto'}</button>
    </div>
  </footer>

  <script>
    (function() {
      const pages = ${pagesJson};
      const singleFlags = ${singleFlagsJson};
      const readingDir = '${readingDirection}';
      const isRtl = readingDir === 'rtl';
      let soundEnabled = ${soundEnabled};
      const hardCover = ${hardCover};

      let currentSpreadIndex = 0;
      let zoomLevel = 1.0;
      let autoPlayInterval = null;

      // Group pages into spreads according to single/cover rules
      const spreads = [];
      let i = 0;
      while (i < pages.length) {
        if (singleFlags[i]) {
          spreads.push({ isSingle: true, pageIndex: i, left: null, right: pages[i], pageNums: [i + 1] });
          i++;
        } else {
          const p1 = pages[i];
          const p2 = (i + 1 < pages.length && !singleFlags[i + 1]) ? pages[i + 1] : null;
          spreads.push({
            isSingle: false,
            left: isRtl ? p2 : p1,
            right: isRtl ? p1 : p2,
            pageNums: p2 ? [i + 1, i + 2] : [i + 1]
          });
          i += p2 ? 2 : 1;
        }
      }

      // Audio setup
      let audioCtx = null;
      function playFlipSound() {
        if (!soundEnabled) return;
        try {
          if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          const t = audioCtx.currentTime;
          const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
          const data = buf.getChannelData(0);
          for (let k = 0; k < data.length; k++) data[k] = (Math.random() * 2 - 1) * Math.exp(-k / (data.length * 0.4));
          const src = audioCtx.createBufferSource();
          src.buffer = buf;
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200, t);
          filter.frequency.exponentialRampToValueAtTime(500, t + 0.14);
          const gain = audioCtx.createGain();
          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
          src.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);
          src.start();
        } catch(e) {}
      }

      // Sizing
      const container = document.getElementById('book-container');
      const leftPageEl = document.getElementById('left-page-container');
      const rightPageEl = document.getElementById('right-page-container');
      const leftImg = document.getElementById('left-page-img');
      const rightImg = document.getElementById('right-page-img');
      const label = document.getElementById('page-display-label');
      const range = document.getElementById('page-range');

      function resize() {
        const vp = document.getElementById('viewport');
        const vw = vp.clientWidth - 40;
        const vh = vp.clientHeight - 40;
        const spread = spreads[currentSpreadIndex];
        const isSingle = spread.isSingle;

        const targetAspect = isSingle ? 0.707 : 1.414;
        let w = vw;
        let h = w / targetAspect;
        if (h > vh) {
          h = vh;
          w = h * targetAspect;
        }

        w *= zoomLevel;
        h *= zoomLevel;

        const pageW = isSingle ? w : w / 2;
        container.style.width = Math.round(w) + 'px';
        container.style.height = Math.round(h) + 'px';

        if (isSingle) {
          leftPageEl.style.display = 'none';
          rightPageEl.style.display = 'block';
          rightPageEl.style.width = Math.round(w) + 'px';
          rightPageEl.style.height = Math.round(h) + 'px';
        } else {
          leftPageEl.style.display = 'block';
          rightPageEl.style.display = 'block';
          leftPageEl.style.width = Math.round(pageW) + 'px';
          leftPageEl.style.height = Math.round(h) + 'px';
          rightPageEl.style.width = Math.round(pageW) + 'px';
          rightPageEl.style.height = Math.round(h) + 'px';
        }
      }

      function renderSpread(idx, playSound = false) {
        if (idx < 0) idx = 0;
        if (idx >= spreads.length) idx = spreads.length - 1;
        currentSpreadIndex = idx;
        const spread = spreads[idx];

        const pagePrefix = '${language === 'ar' ? 'صفحة' : language === 'ja' ? 'ページ' : 'Page'} ';
        const pagesPrefix = '${language === 'ar' ? 'صفحات' : language === 'ja' ? 'ページ' : 'Pages'} ';

        if (spread.isSingle) {
          leftImg.src = '';
          rightImg.src = spread.right;
          label.textContent = pagePrefix + spread.pageNums[0] + ' / ' + pages.length;
          range.value = spread.pageNums[0];
        } else {
          leftImg.src = spread.left || '';
          rightImg.src = spread.right || '';
          label.textContent = pagesPrefix + spread.pageNums.join('-') + ' / ' + pages.length;
          range.value = spread.pageNums[0];
        }

        resize();
        if (playSound) playFlipSound();

        // 3D curl animation effect
        container.style.transform = 'scale(' + zoomLevel + ') rotateY(' + (isRtl ? '-1deg' : '1deg') + ')';
        setTimeout(() => {
          container.style.transform = 'scale(' + zoomLevel + ') rotateY(0deg)';
        }, 200);
      }

      function next() {
        if (currentSpreadIndex < spreads.length - 1) {
          renderSpread(currentSpreadIndex + 1, true);
        }
      }

      function prev() {
        if (currentSpreadIndex > 0) {
          renderSpread(currentSpreadIndex - 1, true);
        }
      }

      // Wiring controls
      document.getElementById('nav-next').onclick = isRtl ? prev : next;
      document.getElementById('nav-prev').onclick = isRtl ? next : prev;
      document.getElementById('corner-next').onclick = isRtl ? prev : next;
      document.getElementById('corner-prev').onclick = isRtl ? next : prev;
      document.getElementById('btn-next').onclick = isRtl ? prev : next;
      document.getElementById('btn-prev').onclick = isRtl ? next : prev;
      document.getElementById('btn-first').onclick = () => renderSpread(0, true);
      document.getElementById('btn-last').onclick = () => renderSpread(spreads.length - 1, true);

      range.oninput = (e) => {
        const targetPage = parseInt(e.target.value, 10);
        const foundIdx = spreads.findIndex(s => s.pageNums.includes(targetPage));
        if (foundIdx !== -1) renderSpread(foundIdx, false);
      };

      const txtSoundOn = '${language === 'ar' ? '🔊 الصوت' : language === 'ja' ? '🔊 音' : '🔊 Sound'}';
      const txtSoundMuted = '${language === 'ar' ? '🔇 كتم' : language === 'ja' ? '🔇 消音' : '🔇 Muted'}';
      const txtAutoPlay = '▶ ${language === 'ar' ? 'تلقائي' : language === 'ja' ? '自動' : 'Auto'}';
      const txtAutoPause = '⏸ ${language === 'ar' ? 'إيقاف' : language === 'ja' ? '一時停止' : 'Pause'}';

      document.getElementById('btn-sound').onclick = (e) => {
        soundEnabled = !soundEnabled;
        e.target.textContent = soundEnabled ? txtSoundOn : txtSoundMuted;
      };

      document.getElementById('btn-zoom-in').onclick = () => {
        zoomLevel = Math.min(zoomLevel + 0.2, 2.0);
        resize();
      };
      document.getElementById('btn-zoom-out').onclick = () => {
        zoomLevel = Math.max(zoomLevel - 0.2, 0.7);
        resize();
      };
      document.getElementById('btn-fullscreen').onclick = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      };

      document.getElementById('btn-autoplay').onclick = (e) => {
        if (autoPlayInterval) {
          clearInterval(autoPlayInterval);
          autoPlayInterval = null;
          e.target.textContent = txtAutoPlay;
        } else {
          e.target.textContent = txtAutoPause;
          autoPlayInterval = setInterval(() => {
            if (currentSpreadIndex >= spreads.length - 1) {
              clearInterval(autoPlayInterval);
              autoPlayInterval = null;
              e.target.textContent = txtAutoPlay;
            } else {
              isRtl ? prev() : next();
            }
          }, 3500);
        }
      };

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') isRtl ? prev() : next();
        else if (e.key === 'ArrowLeft') isRtl ? next() : prev();
        else if (e.key === 'f') document.getElementById('btn-fullscreen').click();
      });

      window.addEventListener('resize', resize);
      renderSpread(0, false);
    })();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export interface ExportProgress {
  percent: number;
  stage:
    | 'packaging_pages'
    | 'generating_viewer'
    | 'compressing_archive'
    | 'embedding_assets'
    | 'compiling_reader'
    | 'finalizing'
    | 'completed';
  currentFile?: string;
  processedCount?: number;
  totalCount?: number;
}

export type ExportProgressCallback = (progress: ExportProgress) => void;

/**
 * Builds a completely self-contained offline ZIP package
 * with individual JPEG page files and a standalone viewer HTML.
 */
export async function buildStandaloneZipPackage(
  options: ExportPackageOptions,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  const { bookTitle, pages, settings, language } = options;
  const zip = new JSZip();

  onProgress?.({
    percent: 5,
    stage: 'packaging_pages',
    processedCount: 0,
    totalCount: pages.length,
    currentFile: 'index.html',
  });

  // Create pages directory
  const pagesFolder = zip.folder('pages');
  const relativePagePaths: string[] = [];
  const singleFlags: boolean[] = [];

  for (let idx = 0; idx < pages.length; idx++) {
    const page = pages[idx];
    const filename = `page_${(idx + 1).toString().padStart(3, '0')}.jpg`;
    relativePagePaths.push(`pages/${filename}`);
    singleFlags.push(page.isSinglePage);

    // Strip header and save binary data
    const base64Data = page.dataUrl.split(',')[1];
    pagesFolder?.file(filename, base64Data, { base64: true });

    // Progress from 5% to 45% as pages are packed
    const pagePercent = 5 + Math.round(((idx + 1) / pages.length) * 40);
    onProgress?.({
      percent: pagePercent,
      stage: 'packaging_pages',
      currentFile: `pages/${filename}`,
      processedCount: idx + 1,
      totalCount: pages.length,
    });

    // Yield control to UI thread every 2 pages
    if (idx % 2 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  onProgress?.({
    percent: 48,
    stage: 'generating_viewer',
    currentFile: 'index.html',
    processedCount: pages.length,
    totalCount: pages.length,
  });

  const htmlContent = generateFlipbookHtml({
    bookTitle,
    totalPages: pages.length,
    readingDirection: settings.readingDirection,
    isRtlUi: language === 'ar',
    pagePathsOrDataUrls: relativePagePaths,
    singlePageFlags: singleFlags,
    hardCover: settings.hardCover,
    soundEnabled: settings.soundEnabled,
    isInline: false,
    language,
  });

  zip.file('index.html', htmlContent);

  // Instructions readme for Windows and Linux with OCR guidelines and web embedding samples
  const readmeContent = `=====================================================
${bookTitle} - Standalone Offline 3D Flipbook
=====================================================

1. COMPATIBILITY & LAUNCHING:
- Windows (Windows 10, 11, etc.):
  Double-click "index.html" to open in Microsoft Edge, Google Chrome, or Mozilla Firefox.

- Linux (Ubuntu, Debian, Fedora, Arch, etc.):
  Double-click "index.html" or run in terminal:
  xdg-open index.html
  or right-click -> Open With -> Firefox / Chrome / Brave.

- Reading Direction: ${settings.readingDirection.toUpperCase()}
  (Keyboard arrows and navigation controls respect this direction).

- 100% Offline: Zero internet, Node.js, or external web-server required.

=====================================================
2. GUIDELINES FOR OCR-SUPPORTED OUTPUT:
=====================================================
If you plan to process page images through OCR engines (Tesseract, Google Cloud Vision, AWS Textract):
- Color Mode: Set to pure Black & White (BW) binary threshold (threshold ~128). This eliminates background halftones, scan bleeding, and paper discoloration.
- Resolution Scale: Use High (1.5x / 150 DPI) or Ultra (2.0x / 300 DPI equivalent) to preserve crisp font stroke contours.
- Compression Quality: Keep compression quality >= 90% (0.90 - 0.95) to prevent 8x8 DCT ringing artifacts around text edges.
- Cover & Page Separation: Keep 1st Page Cover and Last Page Back Cover checked as single pages to preserve standard rectangular page bounding boxes.

=====================================================
3. CODE SAMPLES FOR WEB EMBEDDING:
=====================================================

[A. HTML Responsive Embed]
<div style="position: relative; width: 100%; height: 750px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.4);">
  <iframe src="/flipbook/index.html" width="100%" height="100%" frameborder="0" allow="fullscreen" allowfullscreen></iframe>
</div>

[B. Python Flask / FastAPI Embed]
from flask import Flask, send_from_directory
import os
app = Flask(__name__)

@app.route('/flipbook/<path:filename>')
def serve_flipbook(filename):
    return send_from_directory(os.path.join(app.root_path, 'static', 'flipbook'), filename)

[C. Ruby on Rails Embed]
# In your View template (ERB):
<%= content_tag :div, class: "flipbook-container", style: "height: 800px; width: 100%;" do %>
  <%= content_tag :iframe, nil, src: "/flipbooks/sample/index.html", style: "width: 100%; height: 100%; border: none;", allowfullscreen: true %>
<% end %>

[D. PHP / WordPress Embed]
<?php
$flipbookUrl = '/assets/flipbook/index.html';
?>
<iframe src="<?php echo htmlspecialchars($flipbookUrl, ENT_QUOTES, 'UTF-8'); ?>" style="width: 100%; height: 800px; border: none;" allowfullscreen></iframe>
`;

  zip.file('README.txt', readmeContent);

  onProgress?.({
    percent: 50,
    stage: 'compressing_archive',
    currentFile: 'package.zip',
  });

  const blob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      // Scale metadata.percent (0 - 100%) to (50% - 98%)
      const zipPercent = 50 + Math.round((metadata.percent / 100) * 48);
      onProgress?.({
        percent: Math.min(zipPercent, 98),
        stage: 'compressing_archive',
        currentFile: metadata.currentFile || 'package.zip',
      });
    }
  );

  onProgress?.({
    percent: 100,
    stage: 'completed',
    currentFile: 'package.zip',
  });

  return blob;
}

/**
 * Builds a single, self-contained, portable .HTML file
 * with page images embedded directly as base64 data URLs.
 */
export async function buildSingleFileHtml(
  options: ExportPackageOptions,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  const { bookTitle, pages, settings, language } = options;

  onProgress?.({
    percent: 10,
    stage: 'embedding_assets',
    processedCount: 0,
    totalCount: pages.length,
  });

  const dataUrls: string[] = [];
  const singleFlags: boolean[] = [];

  for (let i = 0; i < pages.length; i++) {
    dataUrls.push(pages[i].dataUrl);
    singleFlags.push(pages[i].isSinglePage);

    const pageLabel = language === 'ar' ? 'صفحة' : language === 'ja' ? 'ページ' : 'Page';
    const percent = 10 + Math.round(((i + 1) / pages.length) * 55);
    onProgress?.({
      percent,
      stage: 'embedding_assets',
      currentFile: `${pageLabel} ${i + 1}`,
      processedCount: i + 1,
      totalCount: pages.length,
    });

    if (i % 2 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  onProgress?.({
    percent: 75,
    stage: 'compiling_reader',
    currentFile: 'flipbook.html',
    processedCount: pages.length,
    totalCount: pages.length,
  });

  await new Promise((r) => setTimeout(r, 30));

  const htmlContent = generateFlipbookHtml({
    bookTitle,
    totalPages: pages.length,
    readingDirection: settings.readingDirection,
    isRtlUi: language === 'ar',
    pagePathsOrDataUrls: dataUrls,
    singlePageFlags: singleFlags,
    hardCover: settings.hardCover,
    soundEnabled: settings.soundEnabled,
    isInline: true,
    language,
  });

  onProgress?.({
    percent: 95,
    stage: 'finalizing',
    currentFile: 'flipbook.html',
  });

  await new Promise((r) => setTimeout(r, 30));

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });

  onProgress?.({
    percent: 100,
    stage: 'completed',
    currentFile: 'flipbook.html',
  });

  return blob;
}

/**
 * Builds a ZIP archive containing all extracted and processed page images
 */
export async function buildImagesZip(
  options: ExportPackageOptions,
  onProgress?: ExportProgressCallback
): Promise<Blob> {
  const { pages } = options;
  const zip = new JSZip();

  onProgress?.({
    percent: 5,
    stage: 'packaging_pages',
    processedCount: 0,
    totalCount: pages.length,
  });

  for (let idx = 0; idx < pages.length; idx++) {
    const page = pages[idx];
    const filename = `page_${(idx + 1).toString().padStart(3, '0')}.jpg`;
    const base64Data = page.dataUrl.split(',')[1];
    zip.file(filename, base64Data, { base64: true });

    const pagePercent = 5 + Math.round(((idx + 1) / pages.length) * 45);
    onProgress?.({
      percent: pagePercent,
      stage: 'packaging_pages',
      currentFile: filename,
      processedCount: idx + 1,
      totalCount: pages.length,
    });

    if (idx % 2 === 0) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  onProgress?.({
    percent: 52,
    stage: 'compressing_archive',
    currentFile: 'images.zip',
  });

  const blob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      const zipPercent = 52 + Math.round((metadata.percent / 100) * 46);
      onProgress?.({
        percent: Math.min(zipPercent, 98),
        stage: 'compressing_archive',
        currentFile: metadata.currentFile || 'images.zip',
      });
    }
  );

  onProgress?.({
    percent: 100,
    stage: 'completed',
    currentFile: 'images.zip',
  });

  return blob;
}
