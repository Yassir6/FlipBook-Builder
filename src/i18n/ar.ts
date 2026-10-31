const ar = {
  // App
  appTitle: 'مُنشئ الكتاب التفاعلي',

  // File Upload
  uploadFile: 'رفع ملف',
  dropPdfHere: 'اسحب ملف PDF هنا',
  orClickToSelect: 'أو اضغط لاختيار ملف',
  supportedFormat: 'يدعم ملفات PDF',
  processing: 'جاري المعالجة...',
  loading: 'جاري التحميل...',
  renderingPages: 'جاري تحويل الصفحات...',
  extractingText: 'جاري استخراج النصوص...',
  pageOf: 'صفحة {current} من {total}',

  // Display Mode
  displayMode: 'وضع العرض',
  fullPage: 'صفحة كاملة',
  spreadMode: 'نصف صفحة',

  // Direction
  readingDirection: 'اتجاه القراءة',
  rtl: 'يمين لليسار',
  ltr: 'يسار لليمين',

  // Colors
  colors: 'الألوان',
  backgroundColor: 'لون الخلفية',
  frontCoverColor: 'لون الغلاف الأمامي',
  backCoverColor: 'لون الغلاف الخلفي',
  toolbarColor: 'لون شريط الأدوات',
  toolbarTextColor: 'لون النص في الشريط',

  // Borders
  borders: 'الحواف',
  borderType: 'نوع الحواف',
  borderNone: 'بدون',
  borderSolid: 'خط بسيط',
  borderShadow: 'ظل',
  borderDouble: 'مزدوج',
  borderThickness: 'السماكة',
  thin: 'رفيع',
  medium: 'متوسط',
  thick: 'سميك',
  borderColor: 'لون الحواف',
  cornerRadius: 'زوايا الكتاب',
  shadowEnabled: 'ظل الكتاب',
  shadowColor: 'لون الظل',
  shadowIntensity: 'شدة الظل',

  // Background
  background: 'الخلفية',
  backgroundType: 'نوع الخلفية',
  solidColor: 'لون ثابت',
  gradient: 'تدرج لوني',
  image: 'صورة',
  pattern: 'نمط',
  uploadBackgroundImage: 'رفع صورة خلفية',
  gradientAngle: 'زاوية التدرج',
  patternWood: 'خشب',
  patternMarble: 'رخام',
  patternFabric: 'قماش',
  patternOldPaper: 'ورق قديم',

  // Cover
  cover: 'الغلاف',
  coverMode: 'نوع الغلاف',
  coverCustom: 'غلاف مخصص',
  coverFirstPage: 'الصفحة الأولى',
  coverNone: 'بدون غلاف',
  startFromZero: 'ترقيم الصفحات',
  startFrom1: 'يبدأ من 1',
  startFrom0: 'يبدأ من 0',
  pageLabel: 'صفحة',
  frontCoverImage: 'صورة الغلاف الأمامي',
  backCoverImage: 'صورة الغلاف الخلفي',
  uploadLogo: 'رفع لوقو',
  bookTitle: 'عنوان الكتاب',
  titleFont: 'خط العنوان',
  titleSize: 'حجم العنوان',
  titleColor: 'لون العنوان',

  // Binding
  binding: 'نوع التجليد',
  bindingPerfect: 'تجليد عادي',
  bindingHardcover: 'غلاف صلب',
  bindingMagazine: 'مجلة',
  bindingSpiral: 'تجليد حلزوني',
  bindingJapanese: 'تجليد ياباني',

  // Size
  size: 'الحجم',
  sizeAuto: 'تلقائي',
  sizeSmall: 'صغير',
  sizeMedium: 'متوسط',
  sizeLarge: 'كبير',
  sizeCustom: 'مخصص',
  width: 'العرض',
  height: 'الارتفاع',

  // Sound
  sound: 'الصوت',
  flipSound: 'صوت التقليب',
  soundPaper: 'ورق كلاسيكي',
  soundSoft: 'ناعم',
  soundCrisp: 'حاد',
  soundHeavy: 'كتاب سميك',
  soundMagazine: 'مجلة لامعة',
  soundRealistic: 'صوت واقعي',
  soundNone: 'بدون صوت',
  soundOn: 'تشغيل الصوت',
  soundOff: 'كتم الصوت',
  playPreview: 'تشغيل',

  // Actions
  preview: 'معاينة',
  exportHtml: 'تصدير HTML',
  exporting: 'جاري التصدير...',
  download: 'تحميل',
  downloadFile: 'تحميل الملف',
  downloadPdf: 'تحميل بصيغة PDF',
  exportOptions: 'خيارات التصدير',
  showDownloadButton: 'إظهار زر التحميل',
  downloadButtonHelp: 'عرض زر لتحميل الكتاب PDF في الملف النهائي',
  generatingPdf: 'جاري إنشاء ملف PDF...',

  // Navigation
  previousPage: 'الصفحة السابقة',
  nextPage: 'الصفحة التالية',
  goToPage: 'انتقل إلى صفحة',
  pageIndicator: 'صفحة {start} - {end} من {total}',
  singlePageIndicator: 'صفحة {page} من {total}',
  tableOfContents: 'فهرس المحتويات',
  thumbnails: 'المصغرات',
  search: 'بحث',
  searchPlaceholder: 'ابحث في الكتاب...',
  searchResults: 'نتائج البحث',
  noResults: 'لا توجد نتائج',
  resultCount: '{count} نتيجة',

  // Zoom
  zoom: 'التكبير',
  zoomIn: 'تكبير',
  zoomOut: 'تصغير',
  zoomReset: 'إعادة ضبط',

  // Fullscreen
  fullscreen: 'ملء الشاشة',
  exitFullscreen: 'إنهاء ملء الشاشة',

  // Language
  language: 'اللغة',
  arabic: 'عربي',
  english: 'EN',
} as const;

export type TranslationKey = keyof typeof ar;
export default ar;
