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
  TableProperties,
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
      fa: 'ابزارهای این مجموعه در حال آماده‌سازی هستند.',
      en: 'The tools in this collection are in preparation.',
    },
    directoryTitle: { fa: 'فهرست ابزارها', en: 'Tool directory' },
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
    id: 'catalogue',
    title: { fa: 'جداول کاتالوگ هیراد', en: 'Hirad Catalogue Tables' },
    description: {
      fa: 'جداول تعاملی کاتالوگ محصولات برای مراجعه سریع‌تر به اطلاعات فنی.',
      en: 'Interactive catalogue tables for faster access to product information.',
    },
    icon: TableProperties,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
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
      fa: 'بررسی ابعاد، ضخامت و وزن لوله بر اساس استانداردهای ASME B36.10 و B36.19.',
      en: 'Planned lookup for pipe dimensions, wall thickness and weight under ASME B36.10 and B36.19.',
    },
    icon: Ruler,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
  },
  {
    id: 'material-database',
    title: { fa: 'پایگاه مواد', en: 'Material Database' },
    description: {
      fa: 'مشخصات مواد ASTM برای اتصالات، قطعات فورج‌شده و ریخته‌گری‌ها.',
      en: 'Planned ASTM material reference for fittings, forgings and castings.',
    },
    icon: FlaskConical,
    status: { fa: 'در حال آماده‌سازی', en: 'In preparation' },
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
