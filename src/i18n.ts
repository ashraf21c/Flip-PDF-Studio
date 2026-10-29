import { Language } from './types';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  dropzoneTitle: string;
  browseFiles: string;
  trySamplePdf: string;
  batchQueue: string;
  filesSelected: string;
  totalSize: string;
  clearQueue: string;
  convertAll: string;
  converting: string;
  previewFlipbook: string;
  exportStandalone: string;
  exportBatch: string;
  readingDirection: string;
  leftToRight: string;
  leftToRightDesc: string;
  rightToLeft: string;
  rightToLeftDesc: string;
  colorSettings: string;
  colorOriginal: string;
  grayscale: string;
  blackAndWhite: string;
  bwThreshold: string;
  compressionSettings: string;
  compressionQualityColorSettings: string;
  settingsWizard: string;
  imageQuality: string;
  renderResolution: string;
  dpiStandard: string;
  dpiHigh: string;
  dpiUltra: string;
  pageSeparation: string;
  pageSeparationDesc: string;
  firstPageCover: string;
  lastPageCover: string;
  selectMoreSinglePages: string;
  coverBadge: string;
  backCoverBadge: string;
  singleBadge: string;
  spreadBadge: string;
  customPagesNotice: string;
  selectAllCovers: string;
  allAsSpreads: string;
  allAsSingles: string;
  interactivePreview: string;
  fullscreen: string;
  exitFullscreen: string;
  pageScrubber: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  soundEffects: string;
  hardCover: string;
  autoPlay: string;
  pageOf: string;
  exportModalTitle: string;
  exportModalSubtitle: string;
  exportZipTitle: string;
  exportZipDesc: string;
  exportHtmlTitle: string;
  exportHtmlDesc: string;
  exportImagesTitle: string;
  exportImagesDesc: string;
  downloadNow: string;
  preparingExport: string;
  crossPlatformNote: string;
  windowsLinuxCompatible: string;
  offlineReady: string;
  close: string;
  backToStudio: string;
  removeFile: string;
  pagesCount: string;
  statusReady: string;
  statusConverting: string;
  statusCompleted: string;
  statusError: string;
  sampleBookletName: string;
  readingModeTooltip: string;
  dragOrClickPrompt: string;
  languageName: string;
  readMeBtn: string;
  readMeTitle: string;
  readMeSubtitle: string;
  tabOcr: string;
  tabEmbed: string;
  ocrTitle: string;
  ocrDesc: string;
  embedTitle: string;
  embedDesc: string;
  copySnippet: string;
  copied: string;
  applyOcrPreset: string;
  ocrPresetApplied: string;
  ocrOneClickPreset: string;
  ocrPresetDesc: string;
  standardPreset: string;
  presetApplied: string;
  rightBound: string;
  leftBound: string;
  clientSideOnly: string;
  ocrActiveBanner: string;
  colorOriginalDesc: string;
  colorGrayscaleDesc: string;
  colorBwDesc: string;
  testedEngineNote: string;
  coverPageSub: string;
  backCoverPageSub: string;
  pageNumberPrefix: string;
  pagesWord: string;
  selectedBadge: string;
  convertBtn: string;
  convertedCountLabel: string;
  recommendedBadge: string;
  crossPlatformTitle: string;
  crossPlatformExtractNote: string;
  downloaded: string;
  firstPageTitle: string;
  lastPageTitle: string;
  devManual: string;
  embedHelpNote: string;
  ocrRule1Title: string;
  ocrRule1Desc: string;
  ocrRule2Title: string;
  ocrRule2Desc: string;
  ocrRule3Title: string;
  ocrRule3Desc: string;
  ocrRule4Title: string;
  ocrRule4Desc: string;
  ocrRule5Title: string;
  ocrRule5Desc: string;
  ocrRule6Title: string;
  ocrRule6Desc: string;
  exportProgressTitle: string;
  exportProgressPackagingPages: string;
  exportProgressGeneratingViewer: string;
  exportProgressCompressingArchive: string;
  exportProgressEmbeddingAssets: string;
  exportProgressCompilingReader: string;
  exportProgressFinalizing: string;
  exportProgressCompleted: string;
  exportProgressCurrentFile: string;
  exportProgressStep1: string;
  exportProgressStep2: string;
  exportProgressStep3: string;
  exportFormatZip: string;
  exportFormatHtml: string;
  exportFormatImages: string;
  exportingInProgress: string;
  exportFailed: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'FlipStudio PDF',
    appSubtitle: 'Cross-platform PDF to interactive 3D Flipbook converter',
    dropzoneTitle: 'Drag & drop PDF files here',
    browseFiles: 'Browse PDF Files',
    trySamplePdf: 'Load Sample Booklet',
    batchQueue: 'Batch Conversion Queue',
    filesSelected: 'files in queue',
    totalSize: 'Total Size',
    clearQueue: 'Clear Queue',
    convertAll: 'Convert All to Flipbooks',
    converting: 'Rendering & Converting...',
    previewFlipbook: 'Open Flipbook',
    exportStandalone: 'Export Flipbook',
    exportBatch: 'Export All (ZIP)',
    readingDirection: 'Reading Direction',
    leftToRight: 'Left to Right (LTR)',
    leftToRightDesc: 'Books, magazines, and technical docs',
    rightToLeft: 'Right to Left (RTL)',
    rightToLeftDesc: 'Arabic, Persian, Hebrew, and Japanese manga',
    colorSettings: 'Color Mode',
    colorOriginal: 'Full Color',
    grayscale: 'Grayscale',
    blackAndWhite: 'Black & White',
    bwThreshold: 'Threshold Cutoff',
    compressionSettings: 'Compression & Quality',
    compressionQualityColorSettings: 'Compression, Quality & Color Settings',
    settingsWizard: 'Settings Wizard',
    imageQuality: 'Image Compression',
    renderResolution: 'Render Scale (DPI)',
    dpiStandard: 'Standard (Compact)',
    dpiHigh: 'High (Crisp Text)',
    dpiUltra: 'Ultra (Print-Ready)',
    pageSeparation: 'Page Layout & Cover Separation',
    pageSeparationDesc: 'Define which pages open individually (like covers) vs as two-page spreads.',
    firstPageCover: '1st page: Front Cover (Single)',
    lastPageCover: 'Last page: Back Cover (Single)',
    selectMoreSinglePages: 'Click on any page below to toggle it as a standalone single page / custom split layout',
    coverBadge: 'Front Cover',
    backCoverBadge: 'Back Cover',
    singleBadge: 'Single Page',
    spreadBadge: '2-Page Spread',
    customPagesNotice: 'Custom single pages will display alone without pairing into a spread.',
    selectAllCovers: 'Default (Covers Single)',
    allAsSpreads: 'All as Spreads',
    allAsSingles: 'All Single Pages',
    interactivePreview: 'Interactive 3D Flipbook Reader',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    pageScrubber: 'Page Navigation',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Reset Zoom',
    soundEffects: 'Page Turn Sound',
    hardCover: '3D Hardcover Effect',
    autoPlay: 'Auto Flip',
    pageOf: 'of',
    exportModalTitle: 'Export Standalone Flipbook',
    exportModalSubtitle: 'Compatible with Windows & Linux. Zero web-server needed, opens directly offline in any browser.',
    exportZipTitle: 'Complete Offline Package (.ZIP)',
    exportZipDesc: 'Includes HTML viewer, stylesheets, scripts, and high-res optimized pages. Double-click to launch offline.',
    exportHtmlTitle: 'Self-Contained Single File (.HTML)',
    exportHtmlDesc: 'All pages and flipbook engine bundled into a single standalone HTML file. Ultra portable.',
    exportImagesTitle: 'Optimized Page Images (.ZIP)',
    exportImagesDesc: 'Extract all pages processed with your chosen color and compression settings.',
    downloadNow: 'Download Package',
    preparingExport: 'Packaging flipbook assets...',
    crossPlatformNote: 'Fully tested on Ubuntu / Debian / Fedora Linux and Windows 10/11 Chrome, Firefox & Edge.',
    windowsLinuxCompatible: 'Windows & Linux Compatible',
    offlineReady: '100% Offline Ready',
    close: 'Close',
    backToStudio: 'Back to Converter Studio',
    removeFile: 'Remove',
    pagesCount: 'Pages',
    statusReady: 'Ready',
    statusConverting: 'Converting',
    statusCompleted: 'Ready to Read',
    statusError: 'Failed',
    sampleBookletName: 'Architecture & Design Portfolio.pdf',
    readingModeTooltip: 'Select whether the flipbook opens from the left or right edge',
    dragOrClickPrompt: 'or click to browse from your device',
    languageName: 'English',
    readMeBtn: 'ReadMe & Embed',
    readMeTitle: 'FlipStudio Documentation & Integration',
    readMeSubtitle: 'OCR-optimized conversion guidelines and ready-to-use web embed code snippets',
    tabOcr: 'OCR Guidelines',
    tabEmbed: 'Web Embedding',
    ocrTitle: 'Guidelines for OCR-Supported Output',
    ocrDesc: 'Maximize text extraction accuracy (Tesseract, Cloud Vision, Textract) with these recommended settings:',
    embedTitle: 'Web Embedding Code Samples',
    embedDesc: 'Easily embed the exported offline flipbook package into your web application or CMS:',
    copySnippet: 'Copy Code',
    copied: 'Copied!',
    applyOcrPreset: 'Apply OCR Optimization Preset',
    ocrPresetApplied: 'OCR Preset Applied!',
    ocrOneClickPreset: 'OCR 1-Click Preset',
    ocrPresetDesc: 'Sets Ultra 2.0x (300 DPI), pure Black & White, and 95% quality for character recognition',
    standardPreset: 'Standard Preset',
    presetApplied: 'Applied',
    rightBound: 'Right-bound',
    leftBound: 'Left-bound',
    clientSideOnly: 'No Cloud Upload / 100% Client-Side',
    ocrActiveBanner: 'OCR Mode Active: Pure Black & White (Cutoff 128), Ultra 2.0x (300 DPI), and 95% quality. Optimized for OCR text extraction (Tesseract, Cloud Vision, Textract).',
    colorOriginalDesc: 'True 24-bit sRGB color preservation',
    colorGrayscaleDesc: '8-bit luminance balanced grayscale',
    colorBwDesc: 'High contrast pure monochrome binary',
    testedEngineNote: 'Windows & Linux Tested Offline Engine',
    coverPageSub: 'Opens alone on the right (or left in RTL) as front cover',
    backCoverPageSub: 'Closes the flipbook alone as the final back cover',
    pageNumberPrefix: 'Page',
    pagesWord: 'Pages',
    selectedBadge: 'Selected',
    convertBtn: 'Convert',
    convertedCountLabel: 'converted',
    recommendedBadge: 'Recommended',
    crossPlatformTitle: 'Cross-Platform Execution:',
    crossPlatformExtractNote: 'Once extracted, simply open index.html directly in your browser.',
    downloaded: 'Downloaded!',
    firstPageTitle: 'First Page',
    lastPageTitle: 'Last Page',
    devManual: 'FlipStudio Developer Manual',
    embedHelpNote: 'Both the .ZIP Package and the Single .HTML file can be embedded directly inside any iframe. Because all assets and scripts are bundled with zero external dependencies, they load instantly on both Windows and Linux hosting environments.',
    ocrRule1Title: '01. Color Mode: Pure Black & White (BW)',
    ocrRule1Desc: 'Set Color Mode to Black & White (BW). Binarizing pages eliminates colored backgrounds, paper bleed-through, halftones, and color noise that trigger character false-positives in OCR classifiers.',
    ocrRule2Title: '02. Threshold Cutoff (120–135)',
    ocrRule2Desc: 'Default threshold 128 works for 90% of documents. For thin Arabic fonts or delicate Japanese strokes, lower threshold to 110–120 to avoid broken glyphs.',
    ocrRule3Title: '03. Render Resolution: High (1.5x) or Ultra (2.0x)',
    ocrRule3Desc: 'OCR accuracy drops significantly below 200 DPI. Selecting 1.5x (150 DPI) or 2.0x (300 DPI) ensures crisp serif contours and sharp diacritics.',
    ocrRule4Title: '04. Compression Quality ≥ 90%',
    ocrRule4Desc: 'Keep compression at 90%–95%. Aggressive JPEG compression introduces 8x8 DCT ringing artifacts around text edges that confuse OCR neural networks.',
    ocrRule5Title: '05. Covers as Single Pages (Default Checked)',
    ocrRule5Desc: 'Keep 1st Page Cover and Last Page Back Cover isolated as single pages to prevent boundary distortion and maintain uniform page bounding boxes.',
    ocrRule6Title: '06. Reading Direction Alignment (LTR / RTL)',
    ocrRule6Desc: 'For Arabic and right-bound volumes, ensure RTL is selected so batch extraction pipeline processes page numbers in true reading sequence.',
    exportProgressTitle: 'Export Progress',
    exportProgressPackagingPages: 'Packaging high-resolution page assets...',
    exportProgressGeneratingViewer: 'Generating 3D interactive viewer engine...',
    exportProgressCompressingArchive: 'Compressing and archiving files...',
    exportProgressEmbeddingAssets: 'Embedding high-res images and flipbook engine...',
    exportProgressCompilingReader: 'Compiling standalone HTML reader...',
    exportProgressFinalizing: 'Finalizing package and preparing download...',
    exportProgressCompleted: 'Export complete! Download started.',
    exportProgressCurrentFile: 'Processing',
    exportProgressStep1: 'Prepare Assets',
    exportProgressStep2: 'Assemble Viewer',
    exportProgressStep3: 'Compress & Export',
    exportFormatZip: 'ZIP Package',
    exportFormatHtml: 'Single HTML',
    exportFormatImages: 'Images ZIP',
    exportingInProgress: 'Exporting...',
    exportFailed: 'Export failed. Please retry.',
  },
  ar: {
    appTitle: 'فليب ستوديو PDF',
    appSubtitle: 'محول ملفات PDF إلى كتب رقمية تفاعلية ثلاثية الأبعاد متوافق مع ويندوز ولينكس',
    dropzoneTitle: 'اسحب وأفلت ملفات PDF هنا',
    browseFiles: 'تصفح ملفات PDF',
    trySamplePdf: 'تحميل كتيب تجريبي',
    batchQueue: 'قائمة المعالجة الجماعية',
    filesSelected: 'ملفات في قائمة الانتظار',
    totalSize: 'الحجم الإجمالي',
    clearQueue: 'إفراغ القائمة',
    convertAll: 'تحويل الكل إلى كتب تفاعلية',
    converting: 'جارٍ المعالجة والتحويل...',
    previewFlipbook: 'فتح الكتاب التفاعلي',
    exportStandalone: 'تصدير الكتاب التفاعلي',
    exportBatch: 'تصدير الكل (ملف مضغوط ZIP)',
    readingDirection: 'اتجاه القراءة',
    leftToRight: 'من اليسار إلى اليمين (LTR)',
    leftToRightDesc: 'للكتب والمجلات والوثائق',
    rightToLeft: 'من اليمين إلى اليسار (RTL)',
    rightToLeftDesc: 'للكتب العربية والمصاحف والمانغا والوثائق الشرقية',
    colorSettings: 'نظام الألوان',
    colorOriginal: 'ألوان كاملة',
    grayscale: 'تدرج رمادي',
    blackAndWhite: 'أبيض وأسود نقي (أحادي)',
    bwThreshold: 'حد عتبة التباين',
    compressionSettings: 'الضغط وجودة الصور',
    compressionQualityColorSettings: 'إعدادات الضغط والجودة والألوان',
    settingsWizard: 'معالج الإعدادات',
    imageQuality: 'نسبة جودة الضغط',
    renderResolution: 'دقة الوضوح (DPI)',
    dpiStandard: 'قياسي (حجم صغير وسريع)',
    dpiHigh: 'عالي (نصوص واضحة وحادة)',
    dpiUltra: 'فائق (جودة طباعة)',
    pageSeparation: 'تخطيط الصفحات وفصل الأغلفة',
    pageSeparationDesc: 'تحديد الصفحات التي تفتح بمفردها (مثل الأغلفة) أو كصفحات مزدوجة متقابلة.',
    firstPageCover: 'الصفحة الأولى: غلاف أمامي منفصل',
    lastPageCover: 'الصفحة الأخيرة: غلاف خلفي منفصل',
    selectMoreSinglePages: 'انقر على أي صفحة أدناه لتعيينها كصفحة منفصلة فردية أو تقسيم التخطيط',
    coverBadge: 'الغلاف الأمامي',
    backCoverBadge: 'الغلاف الخلفي',
    singleBadge: 'صفحة فردية',
    spreadBadge: 'صفحتان متقابلتان',
    customPagesNotice: 'الصفحات الفردية المحددة ستظهر بشكل مستقل دون دمجها في صفحة مزدوجة.',
    selectAllCovers: 'افتراضي (الأغلفة فردية)',
    allAsSpreads: 'الكل صفحات مزدوجة',
    allAsSingles: 'الكل صفحات فردية',
    interactivePreview: 'قارئ الكتب التفاعلي ثلاثي الأبعاد',
    fullscreen: 'ملء الشاشة',
    exitFullscreen: 'إنهاء ملء الشاشة',
    pageScrubber: 'التنقل بين الصفحات',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    resetZoom: 'إعادة الضبط',
    soundEffects: 'صوت تقليب الورق',
    hardCover: 'مظهر الغلاف السميك (Hardcover)',
    autoPlay: 'تقليب تلقائي',
    pageOf: 'من',
    exportModalTitle: 'تصدير كتاب تفاعلي مستقل',
    exportModalSubtitle: 'متوافق تماماً مع أنظمة ويندوز ولينكس. يعمل محلياً بدون إنترنت في أي متصفح.',
    exportZipTitle: 'حزمة كاملة بدون إنترنت (.ZIP)',
    exportZipDesc: 'تحتوي على قارئ HTML وأوراق الأنماط ومحرك التقليب والصفحات بدقة عالية. انقر نقراً مزدوجاً للتشغيل.',
    exportHtmlTitle: 'ملف HTML واحد مستقل ومدمج (.HTML)',
    exportHtmlDesc: 'ملف واحد خفيف يحتوي على كافة الصفحات ومحرك التقليب مدمجاً بالكامل. سهل النقل والمشاركة.',
    exportImagesTitle: 'صور الصفحات المحسنة (.ZIP)',
    exportImagesDesc: 'استخراج كافة الصفحات بعد تطبيق إعدادات الألوان والضغط المختارة.',
    downloadNow: 'تحميل الحزمة الآن',
    preparingExport: 'جارٍ تجهيز ملفات الكتاب التفاعلي...',
    crossPlatformNote: 'تم اختباره وتوافقه على أنظمة لينكس (أوبونتو/فيدورا/ديبيان) وويندوز 10/11 عبر كروم وفايرفوكس وإيدج.',
    windowsLinuxCompatible: 'متوافق مع ويندوز ولينكس',
    offlineReady: 'يعمل ١٠٠٪ بدون إنترنت',
    close: 'إغلاق',
    backToStudio: 'العودة إلى استوديو التحويل',
    removeFile: 'حذف',
    pagesCount: 'صفحات',
    statusReady: 'جاهز',
    statusConverting: 'جارٍ التحويل',
    statusCompleted: 'جاهز للتصفح',
    statusError: 'حدث خطأ',
    sampleBookletName: 'كتيب التصميم والمعمار العربي.pdf',
    readingModeTooltip: 'اختر ما إذا كان الكتاب يبدأ بالفتح من الجهة اليمنى أو اليسرى',
    dragOrClickPrompt: 'أو اضغط للتصفح من جهازك',
    languageName: 'العربية',
    readMeBtn: 'دليل الاستخدام والتضمين',
    readMeTitle: 'دليل فليب ستوديو والتكامل البرمجي',
    readMeSubtitle: 'إرشادات مخرجات التعرف الضوئي على الحروف (OCR) ونماذج كود التضمين في المواقع',
    tabOcr: 'إرشادات الـ OCR',
    tabEmbed: 'أكواد التضمين',
    ocrTitle: 'إرشادات مخرجات تدعم التعرف الضوئي على النصوص (OCR)',
    ocrDesc: 'للحصول على أعلى دقة استخراج نصوص بواسطة محركات OCR (مثل Tesseract وCloud Vision وTextract):',
    embedTitle: 'أمثلة برمجية لتضمين الكتاب التفاعلي في المواقع',
    embedDesc: 'ضع حزمة الكتاب التفاعلي المصدرة في خادمك واستخدم أحد الأكواد التالية:',
    copySnippet: 'نسخ الكود',
    copied: 'تم النسخ!',
    applyOcrPreset: 'تطبيق إعدادات الـ OCR تلقائياً',
    ocrPresetApplied: 'تم تطبيق إعدادات الـ OCR!',
    ocrOneClickPreset: 'وضع الـ OCR بنقرة واحدة',
    ocrPresetDesc: 'يضبط دقة فائقة 2.0x (300 DPI) وأبيض وأسود نقي وجودة 95٪ لاستخراج النصوص بدقة',
    standardPreset: 'الوضع الافتراضي (ألوان)',
    presetApplied: 'تم التطبيق',
    rightBound: 'ربط يمين',
    leftBound: 'ربط يسار',
    clientSideOnly: 'بدون رفع سحابي / معالجة محلية بالكامل',
    ocrActiveBanner: 'وضع الـ OCR مفعل: أبيض وأسود نقي (عتبة 128)، دقة فائقة 2.0x (300 DPI)، وجودة ضغط 95٪. مهيأ لاستخراج النصوص بأعلى دقة.',
    colorOriginalDesc: 'حفظ كامل الألوان الأصلية 24-بت sRGB',
    colorGrayscaleDesc: 'تدرج رمادي متوازن 8-بت',
    colorBwDesc: 'أبيض وأسود نقي عالي التباين وثنائي',
    testedEngineNote: 'محرك محلي مُختبر على ويندوز ولينكس',
    coverPageSub: 'تفتح بمفردها على اليمين (أو اليسار في اتجاه RTL) كغلاف أمامي',
    backCoverPageSub: 'تغلق الكتاب بمفردها كغلاف خلفي أخير',
    pageNumberPrefix: 'صفحة',
    pagesWord: 'صفحات',
    selectedBadge: 'محدد',
    convertBtn: 'تحويل',
    convertedCountLabel: 'تم تحويلها',
    recommendedBadge: 'موصى به',
    crossPlatformTitle: 'التشغيل على مختلف الأنظمة:',
    crossPlatformExtractNote: 'بعد فك الضغط، يكفي فتح ملف index.html مباشرة في المتصفح.',
    downloaded: 'تم التحميل!',
    firstPageTitle: 'الصفحة الأولى',
    lastPageTitle: 'الصفحة الأخيرة',
    devManual: 'دليل مطوري فليب ستوديو',
    embedHelpNote: 'يمكن تضمين كل من حزمة .ZIP وملف .HTML المدمج مباشرة داخل أي إطار iframe. ونظراً لعدم وجود أي ارتباطات خارجية، يتم التحميل فورياً على أي استضافة ويندوز أو لينكس.',
    ocrRule1Title: '01. نظام الألوان: أبيض وأسود نقي (BW)',
    ocrRule1Desc: 'اضبط الألوان على أبيض وأسود نقي. عزل الصفحات ثنائياً يزيل الخلفيات الملونة وتسريب الحبر وتدرجات الطباعة التي تسبب أخطاء في محركات التعرف الضوئي.',
    ocrRule2Title: '02. حد عتبة التباين (120–135)',
    ocrRule2Desc: 'القيمة الافتراضية 128 ممتازة لمعظم المستندات. للخطوط العربية الدقيقة وحركات التشكيل، اخفض العتبة إلى 110–120 لتفادي تقطع الحروف.',
    ocrRule3Title: '03. دقة الوضوح: عالي (1.5x) أو فائق (2.0x)',
    ocrRule3Desc: 'تنخفض دقة الـ OCR كثيراً دون 200 DPI. اختيار 1.5x (150 DPI) أو 2.0x (300 DPI) يضمن حواف نصية حادة وتماسك للحروف.',
    ocrRule4Title: '04. جودة الضغط ≥ 90%',
    ocrRule4Desc: 'حافظ على الجودة بين 90% و95%. الضغط العالي يسبب تشوهات 8x8 DCT حول أطراف الكلمات تؤدي إلى تشويش الذكاء الاصطناعي.',
    ocrRule5Title: '05. فصل الأغلفة كصفحات فردية (محدد افتراضياً)',
    ocrRule5Desc: 'إبقاء الغلافين الأمامي والخلفي كصفحتين منفصلتين يمنع تشوه حدود الصفحات ويحافظ على استقامة مربعات النصوص.',
    ocrRule6Title: '06. مطابقة اتجاه القراءة (RTL / LTR)',
    ocrRule6Desc: 'للمستندات والمطبوعات العربية، تأكد من اختيار اتجاه اليمين إلى اليسار (RTL) لترتيب صفحات الاستخراج بالتسلسل الصحيح.',
    exportProgressTitle: 'تقدم التصدير',
    exportProgressPackagingPages: 'جارٍ تجميع وتجهيز صور الصفحات عالية الدقة...',
    exportProgressGeneratingViewer: 'جارٍ توليد محرك العرض التفاعلي ثلاثي الأبعاد...',
    exportProgressCompressingArchive: 'جارٍ ضغط وأرشفة ملفات الحزمة...',
    exportProgressEmbeddingAssets: 'جارٍ تضمين الصور ومحرك التقليب بالكامل...',
    exportProgressCompilingReader: 'جارٍ تجميع قارئ HTML المستقل...',
    exportProgressFinalizing: 'جارٍ إنهاء تجهيز حزمة التنزيل...',
    exportProgressCompleted: 'اكتمل التصدير بنجاح! بدأ التحميل.',
    exportProgressCurrentFile: 'معالجة',
    exportProgressStep1: 'تجهيز الصفحات',
    exportProgressStep2: 'بناء المحرك',
    exportProgressStep3: 'الضغط والتصدير',
    exportFormatZip: 'حزمة ZIP',
    exportFormatHtml: 'ملف HTML',
    exportFormatImages: 'صور ZIP',
    exportingInProgress: 'جارٍ التصدير...',
    exportFailed: 'فشل التصدير. يرجى إعادة المحاولة.',
  },
  ja: {
    appTitle: 'FlipStudio PDF',
    appSubtitle: 'Windows・Linux対応 3Dパラパラ電子書籍コンバーター',
    dropzoneTitle: 'PDFファイルをここにドラッグ＆ドロップ',
    browseFiles: 'PDFファイルを選択',
    trySamplePdf: 'サンプル冊子を読み込む',
    batchQueue: '変換キュー（バッチ処理）',
    filesSelected: '件のファイル',
    totalSize: '合計サイズ',
    clearQueue: 'キューをクリア',
    convertAll: 'すべてフリップブックに変換',
    converting: 'レンダリング・変換中...',
    previewFlipbook: 'フリップブックを開く',
    exportStandalone: 'フリップブックを出力',
    exportBatch: 'すべて一括出力 (ZIP)',
    readingDirection: '開き方向（綴じ方向）',
    leftToRight: '左開き（左から右 / LTR）',
    leftToRightDesc: '書籍、ビジネス文書、パンフレットなど',
    rightToLeft: '右開き（右から左 / RTL）',
    rightToLeftDesc: '日本の漫画、縦書き書籍、アラビア語文書など',
    colorSettings: 'カラーモード',
    colorOriginal: 'フルカラー',
    grayscale: 'グレースケール',
    blackAndWhite: 'モノクロ2値（白黒・軽量化）',
    bwThreshold: '白黒しきい値',
    compressionSettings: '圧縮・画質設定',
    compressionQualityColorSettings: '圧縮・画質・カラー設定',
    settingsWizard: '設定ウィザード',
    imageQuality: '画像圧縮品質',
    renderResolution: '解像度スケール（DPI）',
    dpiStandard: '標準（軽量・高速）',
    dpiHigh: '高解像度（鮮明な文字）',
    dpiUltra: '超高精細（印刷品質）',
    pageSeparation: 'ページ割り・表紙個別設定',
    pageSeparationDesc: '表紙や裏表紙など、見開きではなく単ページとして表示するページを指定します。',
    firstPageCover: '1ページ目：表紙（単ページ）',
    lastPageCover: '最終ページ：裏表紙（単ページ）',
    selectMoreSinglePages: '下のサムネイルをクリックして任意のページを単ページ/見開きに切り替えられます',
    coverBadge: '表紙',
    backCoverBadge: '裏表紙',
    singleBadge: '単ページ',
    spreadBadge: '見開き',
    customPagesNotice: '単ページに設定されたページは見開きにならず独立して表示されます。',
    selectAllCovers: '標準（表紙・裏表紙のみ単ページ）',
    allAsSpreads: 'すべて見開き',
    allAsSingles: 'すべて単ページ',
    interactivePreview: '3Dフリップブックプレビュー',
    fullscreen: 'フルスクリーン',
    exitFullscreen: 'フルスクリーン解除',
    pageScrubber: 'ページ送りバー',
    zoomIn: '拡大',
    zoomOut: '縮小',
    resetZoom: '等倍に戻す',
    soundEffects: 'ページめくり効果音',
    hardCover: 'ハードカバー質感（3D）',
    autoPlay: '自動めくり',
    pageOf: '/',
    exportModalTitle: 'スタンドアロン型フリップブック出力',
    exportModalSubtitle: 'WindowsおよびLinuxに完全対応。Webサーバー不要でオフラインでダブルクリック起動できます。',
    exportZipTitle: '完全オフラインパッケージ (.ZIP)',
    exportZipDesc: 'HTMLビューア、スタイル、スクリプト、高画質画像が揃ったパッケージ。オフラインで即閲覧可能。',
    exportHtmlTitle: '単一自己完結型ファイル (.HTML)',
    exportHtmlDesc: 'すべてのページ画像とフリップブックエンジンを1つのHTMLファイルに統合。配布に最適。',
    exportImagesTitle: '最適化済みページ画像 (.ZIP)',
    exportImagesDesc: '指定したカラーモードおよび圧縮率で処理された全ページ画像を抽出。',
    downloadNow: 'パッケージをダウンロード',
    preparingExport: 'パッケージ生成中...',
    crossPlatformNote: 'Windows 10/11、Ubuntu / Debian / Fedora LinuxのChrome、Firefox、Edgeで動作確認済み。',
    windowsLinuxCompatible: 'Windows & Linux 対応',
    offlineReady: '100% オフライン動作',
    close: '閉じる',
    backToStudio: 'スタジオに戻る',
    removeFile: '削除',
    pagesCount: 'ページ',
    statusReady: '準備完了',
    statusConverting: '変換中',
    statusCompleted: '閲覧可能',
    statusError: 'エラー',
    sampleBookletName: '建築・デザイン作品集_ポートフォリオ.pdf',
    readingModeTooltip: '本の開き方向（右開き・左開き）を選択します',
    dragOrClickPrompt: 'またはクリックして端末から選択',
    languageName: '日本語',
    readMeBtn: 'ReadMe・埋め込みガイド',
    readMeTitle: 'FlipStudio ドキュメント・Web埋め込み',
    readMeSubtitle: 'OCRテキスト認識最適化ガイドラインおよびWeb埋め込み用コードサンプル',
    tabOcr: 'OCR最適化指針',
    tabEmbed: 'Web埋め込みコード',
    ocrTitle: 'OCR（文字認識）対応出力のガイドライン',
    ocrDesc: 'Tesseract、Cloud Vision、TextractなどのOCRエンジンで最高精度の文字抽出を得るための推奨設定：',
    embedTitle: 'Webサイトへのフリップブック埋め込みコード',
    embedDesc: '出力したオフラインフリップブックをWebサーバーやCMSに配置し、以下のコードで埋め込み可能です：',
    copySnippet: 'コードをコピー',
    copied: 'コピーしました！',
    applyOcrPreset: 'OCR最適化プリセットを適用',
    ocrPresetApplied: 'OCRプリセットを適用しました！',
    ocrOneClickPreset: 'OCR 1クリック設定',
    ocrPresetDesc: '超高精細2.0x (300 DPI)、モノクロ2値化、画質95%に自動設定し文字認識精度を最大化',
    standardPreset: '標準カラー設定',
    presetApplied: '適用済み',
    rightBound: '右開き',
    leftBound: '左開き',
    clientSideOnly: 'クラウドへのアップロード不要 / 完全端末内処理',
    ocrActiveBanner: 'OCRモード有効: モノクロ2値化（しきい値128）、超高解像度2.0x（300 DPI相当）、画質95%に自動最適化中。Tesseract、Cloud Vision、Textract等に対応。',
    colorOriginalDesc: 'RGBオリジナルカラーを完全に維持',
    colorGrayscaleDesc: '8ビットの階調バランスのとれたグレースケール',
    colorBwDesc: '高コントラストな完全モノクロ2値化',
    testedEngineNote: 'Windows・Linux動作検証済みオフラインエンジン',
    coverPageSub: '表紙として見開きにならず単独で開きます',
    backCoverPageSub: '裏表紙として最後に単独で本を閉じます',
    pageNumberPrefix: 'ページ',
    pagesWord: 'ページ',
    selectedBadge: '選択中',
    convertBtn: '変換',
    convertedCountLabel: '変換完了',
    recommendedBadge: '推奨',
    crossPlatformTitle: 'クロスプラットフォーム実行:',
    crossPlatformExtractNote: '解凍後、ブラウザで index.html を直接開くだけで閲覧できます。',
    downloaded: 'ダウンロード完了！',
    firstPageTitle: '最初のページ',
    lastPageTitle: '最後のページ',
    devManual: 'FlipStudio 開発者マニュアル',
    embedHelpNote: '.ZIPパッケージおよび単一.HTMLファイルは、どちらもそのままiframe内に直接埋め込み可能です。外部依存関係がないため、WindowsやLinuxのWebサーバーで瞬時に高速起動します。',
    ocrRule1Title: '01. カラーモード: 完全モノクロ2値化 (BW)',
    ocrRule1Desc: 'カラーモードをモノクロ2値に設定します。ページを白黒2値化することで、OCRエンジンでの誤認識の原因となる背景色、インク裏写り、網点ノイズを排除します。',
    ocrRule2Title: '02. 白黒しきい値 (120–135)',
    ocrRule2Desc: '標準値128はほとんどの書類に適しています。細い文字や繊細な日本語の漢字・かな文字の線のかすれを防ぐには110〜120前後に調整します。',
    ocrRule3Title: '03. 解像度スケール: 高 (1.5x) または 超高精細 (2.0x)',
    ocrRule3Desc: 'OCR認識精度は200 DPIを下回ると急激に低下します。1.5x (150 DPI) または 2.0x (300 DPI相当) を選択して明瞭な文字輪郭を確保します。',
    ocrRule4Title: '04. 画像品質 ≥ 90%',
    ocrRule4Desc: '品質は90%〜95%を推奨します。過度なJPEG圧縮によるブロックノイズ（DCTリンギング）は文字認識モデルを混乱させます。',
    ocrRule5Title: '05. 表紙・裏表紙の単ページ設定（標準で有効）',
    ocrRule5Desc: '表紙と裏表紙を見開きから除外し単独ページとして保つことで、ページの歪みを防ぎ均一なテキスト矩形領域を抽出できます。',
    ocrRule6Title: '06. 開き方向の一致 (LTR / RTL)',
    ocrRule6Desc: 'アラビア語や縦書き・右開き冊子の場合はRTLを選択することで、OCRバッチ抽出時のページ順序が自然な読書順と一致します。',
    exportProgressTitle: 'エクスポート進捗',
    exportProgressPackagingPages: '高解像度ページ画像をアーカイブ中...',
    exportProgressGeneratingViewer: '3Dインタラクティブ閲覧エンジンを生成中...',
    exportProgressCompressingArchive: 'ZIPファイルを圧縮・パッケージ化中...',
    exportProgressEmbeddingAssets: 'ページ画像とフリップブックエンジンを埋め込み中...',
    exportProgressCompilingReader: 'スタンドアロンHTMLリーダーをコンパイル中...',
    exportProgressFinalizing: 'パッケージを完了しダウンロードを準備中...',
    exportProgressCompleted: 'エクスポート完了！ダウンロードが開始されました。',
    exportProgressCurrentFile: '処理中',
    exportProgressStep1: 'ページ準備',
    exportProgressStep2: 'エンジン構築',
    exportProgressStep3: '圧縮・出力',
    exportFormatZip: 'ZIPパッケージ',
    exportFormatHtml: '単一HTML',
    exportFormatImages: '画像ZIP',
    exportingInProgress: 'エクスポート中...',
    exportFailed: 'エクスポートに失敗しました。再試行してください。',
  },
};
