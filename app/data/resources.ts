import type { Component } from 'vue'
import {
  BookOpen,
  Calculator,
  CircleGauge,
  FileCheck2,
  FileSpreadsheet,
  FlaskConical,
  Ruler,
  Scale,
  Wrench,
} from 'lucide-vue-next'

export interface ResourceText {
  fa: string
  en: string
}

export interface ResourceCardDefinition {
  id: string
  title: ResourceText
  description: ResourceText
  icon: Component
  to?: string
  status?: ResourceText
}

export interface StandardCategoryDefinition {
  code: string
  title: ResourceText
  description: ResourceText
}

export const resourcesCopy = {
  nav: {
    title: { fa: 'منابع مهندسی', en: 'Engineering Resources' },
    home: { fa: 'صفحه اصلی', en: 'Home' },
    breadcrumb: { fa: 'مسیر صفحه', en: 'Breadcrumb' },
    overview: { fa: 'معرفی منابع', en: 'Overview' },
    standards: { fa: 'استانداردها و مستندات', en: 'Standards & Documents' },
  },
  card: {
    open: { fa: 'مشاهده بخش', en: 'Open section' },
    upcoming: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
  landing: {
    eyebrow: { fa: 'مرجع مهندسی هیراد', en: 'Engineering Resources' },
    title: { fa: 'منابع مهندسی، همراه پروژه‌های شما', en: 'Engineering resources for your projects' },
    seoTitle: { fa: 'منابع مهندسی | تجهیز فرآیند هیراد', en: 'Engineering Resources | Hirad' },
    description: {
      fa: 'ابزارهای مهندسی، استانداردها و راهنماهای فنی برای انتخاب و بررسی تجهیزات در پروژه‌های نفت، گاز و پتروشیمی؛ منابعی که در کنار تجربه تیم هیراد، همراه شما خواهند بود.',
      en: 'Engineering tools, standards and technical guides for equipment selection in oil, gas and petrochemical projects, alongside the experience of the Hirad team.',
    },
    exploreTools: { fa: 'مشاهده ابزارها', en: 'Explore tools' },
    browseStandards: { fa: 'مرور استانداردها', en: 'Browse standards' },
    categoriesEyebrow: { fa: 'منابع تخصصی', en: 'Technical Resources' },
    categoriesTitle: { fa: 'از اطلاعات فنی تا انتخاب تجهیزات', en: 'From technical information to equipment selection' },
    categoriesDescription: {
      fa: 'منابع موردنیاز خود را در چهار بخش تخصصی دنبال کنید.',
      en: 'Explore four dedicated areas of engineering knowledge.',
    },
    supportTitle: { fa: 'همراه شما در انتخاب تجهیزات', en: 'Support for equipment selection' },
    supportDescription: {
      fa: 'برای دریافت راهنمایی درباره انتخاب محصول، استاندارد یا مستندات فنی با تیم هیراد در تماس باشید.',
      en: 'Talk to the Hirad team about product selection, applicable standards or technical documentation.',
    },
    contact: { fa: 'تماس با هیراد', en: 'Contact Hirad' },
  },
  tools: {
    eyebrow: { fa: 'ابزارهای مهندسی', en: 'Engineering Tools' },
    title: { fa: 'ابزارهای مهندسی', en: 'Engineering Tools' },
    seoTitle: { fa: 'ابزارهای مهندسی | منابع هیراد', en: 'Engineering Tools | Hirad Resources' },
    description: {
      fa: 'مجموعه‌ای از ابزارهای کاربردی برای بررسی سریع داده‌ها و تصمیم‌گیری در پروژه‌های مهندسی.',
      en: 'A planned set of practical tools for quick checks and decisions in engineering projects.',
    },
    note: {
      fa: 'ابزارهای منتخب هم‌اکنون قابل استفاده‌اند و سایر بخش‌ها به‌تدریج تکمیل می‌شوند.',
      en: 'Selected tools are available now, with more sections being prepared.',
    },
    directoryTitle: { fa: 'فهرست ابزارها', en: 'Tool directory' },
  },
  pipeDimensions: {
    eyebrow: { fa: 'ابزار مهندسی', en: 'Engineering Tool' },
    title: { fa: 'ابعاد و وزن لوله', en: 'Pipe Dimensions & Weight' },
    seoTitle: { fa: 'ابعاد و وزن لوله | ابزارهای مهندسی هیراد', en: 'Pipe Dimensions & Weight | Hirad Engineering Tools' },
    description: {
      fa: 'بررسی ابعاد، ضخامت، وزن و حجم داخلی لوله بر پایه استانداردهای ASME B36.10 و B36.19.',
      en: 'Look up pipe dimensions, wall thickness, weight and internal volume based on ASME B36.10 and B36.19.',
    },
    standard: { fa: 'استاندارد', en: 'Standard' },
    nps: { fa: 'سایز اسمی لوله (NPS)', en: 'Nominal Pipe Size (NPS)' },
    schedule: { fa: 'رده لوله (Schedule)', en: 'Pipe Schedule' },
    unitSystem: { fa: 'سیستم واحدها', en: 'Unit system' },
    metric: { fa: 'متریک', en: 'Metric' },
    imperial: { fa: 'امپریال', en: 'Imperial' },
    selectPlaceholder: { fa: 'انتخاب کنید', en: 'Select' },
    resultTitle: { fa: 'نتیجه بررسی', en: 'Lookup result' },
    comparisonTitle: { fa: 'مقایسه رده‌ها', en: 'Schedule comparison' },
    comparisonDescription: { fa: 'رده‌های موجود برای سایز و استاندارد انتخاب‌شده در جدول زیر نمایش داده می‌شوند.', en: 'Available schedules for the selected size and standard are shown below.' },
    npsLabel: { fa: 'سایز اسمی', en: 'Nominal size' },
    dnLabel: { fa: 'قطر اسمی (DN)', en: 'Nominal diameter (DN)' },
    outsideDiameter: { fa: 'قطر خارجی (OD)', en: 'Outside diameter (OD)' },
    wallThickness: { fa: 'ضخامت جداره', en: 'Wall thickness' },
    insideDiameter: { fa: 'قطر داخلی (ID)', en: 'Inside diameter (ID)' },
    mass: { fa: 'جرم واحد طول', en: 'Mass per unit length' },
    area: { fa: 'مساحت مقطع داخلی', en: 'Internal cross-sectional area' },
    volume: { fa: 'حجم داخلی واحد طول', en: 'Internal volume per unit length' },
    shippingVolume: { fa: 'حجم حمل لوله', en: 'Shipping volume' },
    scheduleColumn: { fa: 'رده', en: 'Schedule' },
    unavailable: { fa: 'برای این انتخاب داده‌ای در جدول محلی موجود نیست.', en: 'No local table data is available for this selection.' },
    sourceValue: { fa: 'مقدار منبع', en: 'Source value' },
    calculatedValue: { fa: 'مقدار محاسبه‌شده', en: 'Calculated value' },
    sourceNote: { fa: 'جدول کاتالوگ هیراد بر پایه استانداردهای ASME B36.10 و B36.19 تنظیم شده است؛ ابعاد، جرم و حجم حمل از جدول گرفته می‌شوند و قطر داخلی، مساحت و حجم داخلی محاسبه می‌شوند.', en: 'Hirad catalogue tables are based on ASME B36.10 and B36.19. Dimensions, mass and shipping volume are taken from the tables; inside diameter, area and internal volume are calculated.' },
    reference: { fa: 'مرجع داده', en: 'Data reference' },
    downloadSource: { fa: 'دانلود جدول کاتالوگ هیراد', en: 'Download Hirad catalogue table' },
    downloadMetric: { fa: 'دانلود فایل', en: 'Download File' },
    downloadImperial: { fa: 'دانلود فایل', en: 'Download File' },
  },
  materialDatabase: {
    eyebrow: { fa: 'مرجع مهندسی', en: 'Engineering Reference' },
    title: { fa: 'پایگاه مواد اتصالات جوشی لوله', en: 'Pipe Welding Fittings Material Database' },
    seoTitle: { fa: 'مرجع مواد اتصالات جوشی لوله | منابع هیراد', en: 'Pipe Welding Fittings Material Reference | Hirad Resources' },
    description: {
      fa: 'جست‌وجو و مقایسه داده‌های مواد اتصالات جوشی لوله بر پایه شناسه‌های مشخصات و گریدهای ASTM.',
      en: 'Search and compare pipe welding fitting material data using ASTM specification and grade identifiers.',
    },
    search: { fa: 'جست‌وجوی مواد', en: 'Search materials' },
    searchPlaceholder: { fa: 'مثل A234 WPB، WP316L یا S31803', en: 'e.g. A234 WPB, WP316L or S31803' },
    clearSearch: { fa: 'پاک‌کردن جست‌وجو', en: 'Clear search' },
    specification: { fa: 'مشخصات / شماره', en: 'Specification / number' },
    grade: { fa: 'طبقه‌بندی / گرید', en: 'Classification / grade' },
    family: { fa: 'گروه ماده', en: 'Material group' },
    allSpecifications: { fa: 'همه مشخصات', en: 'All specifications' },
    allGrades: { fa: 'همه گریدها', en: 'All grades' },
    allFamilies: { fa: 'همه گروه‌ها', en: 'All material groups' },
    clearFilters: { fa: 'پاک‌کردن فیلترها', en: 'Clear filters' },
    results: { fa: 'نتایج مواد', en: 'Material results' },
    resultCount: { fa: 'رکورد', en: 'records' },
    noResults: { fa: 'ماده‌ای با این عبارت یا فیلترها در داده‌های محلی یافت نشد.', en: 'No material in the local dataset matches this search and filter combination.' },
    viewDetails: { fa: 'مشاهده جزئیات', en: 'View details' },
    selected: { fa: 'رکورد انتخاب‌شده', en: 'Selected record' },
    addComparison: { fa: 'افزودن به مقایسه', en: 'Add to comparison' },
    removeComparison: { fa: 'حذف از مقایسه', en: 'Remove from comparison' },
    comparisonLimit: { fa: 'حداکثر سه ماده را می‌توان هم‌زمان مقایسه کرد.', en: 'Up to three materials can be compared at once.' },
    identification: { fa: 'شناسایی', en: 'Identification' },
    sourceIdentifier: { fa: 'شناسه ماده', en: 'Material identifier' },
    notSpecified: { fa: 'در داده مرجع مشخص نشده', en: 'Not specified in the reference dataset' },
    composition: { fa: 'ترکیب شیمیایی', en: 'Chemical Composition' },
    compositionNote: { fa: 'مقادیر عیناً با همان عبارت و دقت منبع نمایش داده شده‌اند.', en: 'Values retain the source expression and precision.' },
    mechanical: { fa: 'خواص مکانیکی', en: 'Mechanical Properties' },
    tensileStrengthMin: { fa: 'حداقل استحکام کششی (T.S)', en: 'Minimum tensile strength (T.S)' },
    yieldStrengthMin: { fa: 'حداقل استحکام تسلیم (Y.S)', en: 'Minimum yield strength (Y.S)' },
    elongationBreak: { fa: 'ازدیاد طول در شکست (EL. %)', en: 'Elongation at break (EL. %)' },
    reductionOfArea: { fa: 'کاهش سطح (R.A %)', en: 'Reduction of area (R.A %)' },
    hardnessMax: { fa: 'حداکثر سختی (HB)', en: 'Maximum hardness (HB)' },
    sourceNotes: { fa: 'یادداشت منبع', en: 'Source note' },
    reference: { fa: 'مرجع', en: 'Reference' },
    referenceTitle: { fa: 'کاتالوگ هیراد — مواد متداول اتصالات جوشی لوله', en: 'Hirad Catalogue — Usual Materials for Pipe Welding Fittings' },
    referenceNote: {
      fa: 'مقادیر نمایش‌داده‌شده از جدول کاتالوگ هیراد گردآوری شده‌اند. شناسه‌های مواد به مشخصات ASTM ذکرشده برای هر رکورد اشاره دارند. این مرجع وب‌سایت جایگزین مشخصات حاکم ASTM نیست.',
      en: 'Displayed values are transcribed from the Hirad Catalogue table. Material identifiers refer to the applicable ASTM specifications cited for each record. This website reference does not replace the governing ASTM specification.',
    },
    viewOriginal: { fa: 'مشاهده جدول اصلی', en: 'View original table' },
    comparison: { fa: 'مقایسه مواد', en: 'Material comparison' },
    viewComparison: { fa: 'مشاهده مقایسه', en: 'View comparison' },
    comparisonSelected: { fa: 'ماده برای مقایسه انتخاب شده', en: 'material selected for comparison' },
    comparisonDifference: { fa: 'هایلایت کم‌رنگ یعنی مقدار منبع بین رکوردها متفاوت است.', en: 'A soft highlight marks source values that differ between records.' },
    comparisonDescription: { fa: 'مقادیر رکوردهای انتخاب‌شده در کنار یکدیگر نمایش داده می‌شوند؛ بدون رتبه‌بندی یا توصیه مهندسی.', en: 'Selected source records are shown side by side, without ranking or engineering recommendations.' },
    clearComparison: { fa: 'پاک‌کردن مقایسه', en: 'Clear comparison' },
  },
  standards: {
    eyebrow: { fa: 'استانداردها و مستندات فنی', en: 'Standards & Documents' },
    title: { fa: 'استانداردها و مستندات فنی', en: 'Standards & Technical Documents' },
    seoTitle: { fa: 'استانداردها و مستندات فنی | منابع هیراد', en: 'Standards & Technical Documents | Hirad Resources' },
    description: {
      fa: 'مرجع سازمان‌یافته‌ای برای استانداردها، مشخصات فنی و مستندات مورد استفاده در صنایع فرآیندی.',
      en: 'A structured reference for standards, specifications and technical documents used in process industries.',
    },
    emptyTitle: { fa: 'مجموعه مستندات در حال آماده‌سازی است', en: 'The document collection is in preparation' },
    emptyDescription: {
      fa: 'هنوز مستندی در این بخش منتشر نشده است. منابع فنی پس از بررسی، در دسته‌بندی‌های بالا قرار خواهند گرفت.',
      en: 'No documents have been published yet. Technical references will be added to these categories after review.',
    },
    familiesTitle: { fa: 'دسته‌بندی مراجع', en: 'Reference categories' },
  },
} as const

export const resourceCategories: ResourceCardDefinition[] = [
  {
    id: 'tools',
    title: { fa: 'ابزارهای مهندسی', en: 'Engineering Tools' },
    description: {
      fa: 'ابزارها و محاسبه‌گرهای کاربردی برای بررسی‌های روزمره مهندسی.',
      en: 'Practical tools and calculators for everyday engineering checks.',
    },
    icon: Wrench,
    to: '/resources/tools',
  },
  {
    id: 'standards',
    title: { fa: 'استانداردها و مستندات فنی', en: 'Standards & Technical Documents' },
    description: {
      fa: 'دسترسی ساختاریافته به استانداردها و مراجع فنی پروژه‌ها.',
      en: 'Structured access to the standards and technical references behind projects.',
    },
    icon: FileCheck2,
    to: '/resources/standards',
  },
  {
    id: 'references',
    title: { fa: 'مراجع فنی', en: 'Technical References' },
    description: {
      fa: 'راهنماها و مطالب فنی منتخب برای پشتیبانی از طراحی و تأمین.',
      en: 'Selected guides and technical material to support design and procurement.',
    },
    icon: BookOpen,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
]

export const resourceTools: ResourceCardDefinition[] = [
  {
    id: 'pipe-dimensions',
    title: { fa: 'ابعاد و وزن لوله', en: 'Pipe Dimensions & Weight' },
    description: {
      fa: 'بررسی ابعاد، ضخامت و وزن لوله بر پایه استانداردهای ASME B36.10 و B36.19.',
      en: 'Look up pipe dimensions, wall thickness and weight based on ASME B36.10 and B36.19.',
    },
    icon: Ruler,
    to: '/resources/tools/pipe-dimensions',
  },
  {
    id: 'material-database',
    title: { fa: 'مواد اتصالات جوشی لوله', en: 'Pipe Welding Fittings Materials' },
    description: {
      fa: 'جست‌وجو، بررسی و مقایسه داده‌های مواد اتصالات جوشی لوله.',
      en: 'Search and compare pipe welding fitting material data.',
    },
    icon: FlaskConical,
    to: '/resources/tools/material-database',
  },
  {
    id: 'valve-seat-material',
    title: { fa: 'انتخاب‌گر متریال سیت شیر', en: 'Valve Seat Material Selector' },
    description: {
      fa: 'انتخاب متریال مناسب سیت شیر بر اساس شرایط کاری و سیال.',
      en: 'A future selector for valve seat materials based on service conditions and media.',
    },
    icon: CircleGauge,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
  {
    id: 'unit-converters',
    title: { fa: 'تبدیل واحدها', en: 'Unit Converters' },
    description: {
      fa: 'تبدیل سریع واحدهای متداول فشار، دما، طول، جرم و دبی.',
      en: 'Planned conversions for common pressure, temperature, length, mass and flow units.',
    },
    icon: Scale,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
  {
    id: 'engineering-calculators',
    title: { fa: 'محاسبه‌گرهای مهندسی', en: 'Engineering Calculators' },
    description: {
      fa: 'مجموعه‌ای از محاسبه‌گرهای فنی برای بررسی‌های مهندسی منتخب.',
      en: 'A planned collection of focused calculators for selected engineering checks.',
    },
    icon: Calculator,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
  {
    id: 'catalogue-tables',
    title: { fa: 'جداول کاتالوگ هیراد', en: 'Hirad Catalogue Tables' },
    description: {
      fa: 'جداول تعاملی برای مراجعه سریع به اطلاعات فنی کاتالوگ محصولات هیراد.',
      en: 'Planned interactive tables for quick access to Hirad catalogue information.',
    },
    icon: FileSpreadsheet,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
]

export const standardCategories: StandardCategoryDefinition[] = [
  { code: 'API', title: { fa: 'استانداردهای API', en: 'API Standards' }, description: { fa: 'استانداردهای مؤسسه نفت آمریکا', en: 'American Petroleum Institute standards' } },
  { code: 'ASME', title: { fa: 'استانداردهای ASME', en: 'ASME Standards' }, description: { fa: 'کدها و استانداردهای مهندسی مکانیک', en: 'Mechanical engineering codes and standards' } },
  { code: 'ASTM', title: { fa: 'استانداردهای ASTM', en: 'ASTM Standards' }, description: { fa: 'استانداردهای مواد و آزمون‌ها', en: 'Materials and testing standards' } },
  { code: 'NACE', title: { fa: 'استانداردهای NACE', en: 'NACE Standards' }, description: { fa: 'مراجع خوردگی و حفاظت از مواد', en: 'Corrosion and materials protection references' } },
  { code: 'MSS', title: { fa: 'استانداردهای MSS', en: 'MSS Standards' }, description: { fa: 'استانداردهای انجمن استانداردسازی تولیدکنندگان', en: 'Manufacturers Standardization Society standards' } },
  { code: 'ISO', title: { fa: 'استانداردهای ISO', en: 'ISO Standards' }, description: { fa: 'استانداردهای بین‌المللی', en: 'International standards' } },
  { code: 'DIN', title: { fa: 'استانداردهای DIN', en: 'DIN Standards' }, description: { fa: 'استانداردهای مؤسسه استاندارد آلمان', en: 'German Institute for Standardization references' } },
  { code: 'BS', title: { fa: 'استانداردهای BS', en: 'BS Standards' }, description: { fa: 'استانداردهای بریتانیا', en: 'British Standards references' } },
]
