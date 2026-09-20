<template>
  <div class="dashboard-overview space-y-7" dir="rtl">
    <header class="overview-header">
      <div class="min-w-0 text-start">
        <p class="text-xs font-bold tracking-[0.2em] text-primary uppercase" lang="en" dir="rtl">Website analytics</p>
        <h1 class="mt-2 text-2xl font-black leading-relaxed text-base-content md:text-3xl">نمای کلی وب‌سایت</h1>
        <p class="mt-1 text-sm leading-7 text-base-content/60">نگاهی به بازدیدها، عملکرد صفحات و محتوای هیراد.</p>
      </div>
      <div class="header-controls">
        <div class="min-w-0">
          <label for="analytics-range" class="mb-1.5 block text-xs text-base-content/60">بازه گزارش بازدید</label>
          <select id="analytics-range" v-model="selectedRange" class="select h-11 w-full min-w-0 rounded-lg border-base-300 bg-base-100 text-sm">
            <option :value="7">۷ روز گذشته</option>
            <option :value="30">۳۰ روز گذشته</option>
            <option :value="90">۹۰ روز گذشته</option>
          </select>
        </div>
        <button type="button" class="btn btn-outline btn-primary h-11 min-h-11 gap-2 rounded-lg px-3 text-xs shadow-none" :disabled="isRefreshing" @click="refreshAll">
          <RefreshCw class="size-4 shrink-0" :class="{ 'motion-safe:animate-spin': isRefreshing }" aria-hidden="true" />
          به‌روزرسانی
        </button>
      </div>
    </header>

    <section aria-labelledby="content-heading" :aria-busy="contentStatus === 'pending'">
      <div class="section-heading">
        <h2 id="content-heading">مدیریت محتوا</h2>
        <span class="text-xs text-base-content/55">مجموع کل</span>
      </div>
      <div v-if="contentError" class="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-error/20 bg-base-100 px-4 py-2 text-sm" role="status">
        <span class="text-base-content/65">آمار محتوا دریافت نشد.</span>
        <button type="button" class="btn btn-ghost min-h-11 text-primary shadow-none" :disabled="contentStatus === 'pending'" @click="refreshContent()">تلاش مجدد</button>
      </div>
      <div class="content-grid">
        <NuxtLink v-for="card in contentCards" :key="card.to" :to="card.to" class="content-card group">
          <div class="flex items-center gap-3">
            <span class="icon-tile"><component :is="card.icon" class="size-5" :stroke-width="1.5" aria-hidden="true" /></span>
            <span class="text-sm font-medium">{{ card.label }}</span>
            <ChevronLeft class="ms-auto size-4 shrink-0 text-base-content/35 group-hover:text-primary" aria-hidden="true" />
          </div>
          <div class="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span v-if="contentStatus === 'pending' && !contentStats" class="h-8 w-12 rounded bg-base-200 motion-safe:animate-pulse" aria-label="در حال دریافت"></span>
            <strong v-else class="text-2xl font-bold tabular-nums">{{ card.value }}</strong>
            <span class="text-xs leading-6" :class="card.attention ? 'text-primary' : 'text-base-content/55'">{{ card.hint }}</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section aria-labelledby="traffic-heading" class="space-y-4" :aria-busy="status === 'pending'">
      <div class="section-heading !mb-0">
        <h2 id="traffic-heading">عملکرد بازدید</h2>
        <span class="text-xs text-base-content/55">{{ fa(selectedRange) }} روز گذشته</span>
      </div>
      <div v-if="status === 'pending'" role="status" class="sr-only">در حال به‌روزرسانی گزارش بازدید</div>
      <div v-if="status === 'pending' && !analytics" class="metric-grid">
        <div v-for="item in 4" :key="item" class="panel h-40 motion-safe:animate-pulse"><div class="h-3 w-20 rounded bg-base-200"></div><div class="mt-6 h-8 w-28 rounded bg-base-200"></div></div>
      </div>
      <div v-else-if="error" class="panel flex flex-col items-center gap-3 py-12 text-center" role="status">
        <span class="icon-tile"><WifiOff class="size-6" aria-hidden="true" /></span>
        <p class="font-bold">گزارش بازدید در دسترس نیست</p>
        <p class="text-sm text-base-content/60">دریافت اطلاعات انجام نشد. دوباره تلاش کنید.</p>
        <button type="button" class="btn btn-outline btn-primary min-h-11 shadow-none" @click="refresh()">تلاش مجدد</button>
      </div>

      <template v-else-if="analytics">
        <div class="metric-grid">
          <article v-for="(card, index) in summaryCards" :key="card.label" class="panel metric-card" :class="{ 'metric-primary': index === 0 }">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-sm font-medium text-base-content/70">{{ card.label }}</h3>
              <component :is="card.icon" class="size-5 shrink-0 text-primary/75" :stroke-width="1.5" aria-hidden="true" />
            </div>
            <p class="mt-5 text-3xl font-black leading-tight tabular-nums">{{ card.value }}</p>
            <p class="mt-3 text-xs leading-6 text-base-content/55">{{ card.hint }}</p>
          </article>
        </div>

        <div class="report-grid">
          <article class="panel">
            <div class="panel-heading">
              <div><h3>روند بازدید</h3><p>بازدید صفحات و بازدیدکنندگان یکتا در هر روز</p></div>
              <ChartNoAxesColumn class="size-5 shrink-0 text-primary/70" aria-hidden="true" />
            </div>
            <div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-base-content/65">
              <button
                type="button"
                class="flex items-center gap-2 rounded px-1 py-1 transition-colors hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                :class="{ 'text-base-content/40': !showViews }"
                :aria-pressed="showViews"
                :disabled="!showVisitors"
                @click="toggleViews"
              >
                <i class="h-0.5 w-5 rounded bg-primary" :class="{ 'opacity-35': !showViews }" aria-hidden="true"></i>
                بازدید صفحات
              </button>
              <button
                type="button"
                class="flex items-center gap-2 rounded px-1 py-1 transition-colors hover:text-base-content focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                :class="{ 'text-base-content/40': !showVisitors }"
                :aria-pressed="showVisitors"
                :disabled="!showViews"
                @click="toggleVisitors"
              >
                <i class="w-5 border-t-2 border-dashed border-secondary" :class="{ 'opacity-35': !showVisitors }" aria-hidden="true"></i>
                بازدیدکننده یکتا
              </button>
            </div>
            <div v-if="hasDailyData" class="chart-scroll mt-4 overflow-x-auto" tabindex="0" role="region" aria-label="نمودار روزانه؛ برای مشاهده کامل در نمایشگر کوچک پیمایش کنید">
              <div class="chart-canvas relative min-w-[480px]">
                <svg class="block w-full" viewBox="0 0 720 270" role="img" aria-labelledby="traffic-chart-title" dir="ltr">
                <title id="traffic-chart-title">روند روزانه بازدید در {{ fa(analytics.range) }} روز گذشته؛ {{ fa(analytics.summary.pageViews) }} بازدید و {{ fa(analytics.summary.uniqueVisitors) }} بازدیدکننده یکتا</title>
                <defs>
                  <linearGradient id="views-area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.12" />
                    <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.01" />
                  </linearGradient>
                </defs>
                <g v-for="tick in chartTicks" :key="tick.value">
                  <line x1="48" :y1="tick.y" x2="692" :y2="tick.y" stroke="var(--color-base-300)" stroke-dasharray="3 5" />
                  <text x="35" :y="tick.y + 4" text-anchor="end" fill="currentColor" class="text-[11px] text-base-content/55">{{ fa(tick.value) }}</text>
                </g>
                <path v-if="showViews" :d="areaPath" fill="url(#views-area)" />
                <line v-if="activeChartPoint !== null" :x1="chartX(activeChartPoint)" y1="28" :x2="chartX(activeChartPoint)" y2="218" stroke="var(--color-primary)" stroke-dasharray="2 4" stroke-opacity="0.35" />
                <polyline v-if="showViews" :points="viewsPoints" fill="none" stroke="var(--color-primary)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
                <polyline v-if="showVisitors" :points="visitorsPoints" fill="none" stroke="var(--color-secondary)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke-dasharray="5 5" />
                <template v-for="(day, index) in analytics.daily" :key="day.date">
                  <circle
                    v-if="showViews"
                    :cx="chartX(index)"
                    :cy="chartY(day.pageViews)"
                    :r="activeChartPoint === index ? 5 : 3"
                    fill="var(--color-base-100)"
                    stroke="var(--color-primary)"
                    stroke-width="1.5"
                    tabindex="0"
                    role="button"
                    :aria-label="`${shortDate(day.date)}: ${fa(day.pageViews)} بازدید صفحه، ${fa(day.uniqueVisitors)} بازدیدکننده یکتا`"
                    @mouseenter="setActiveChartPoint(index)"
                    @mouseleave="clearActiveChartPoint"
                    @focus="setActiveChartPoint(index)"
                    @blur="clearActiveChartPoint"
                    @click="setActiveChartPoint(index)"
                  >
                    <title>{{ shortDate(day.date) }}: {{ fa(day.pageViews) }} بازدید، {{ fa(day.uniqueVisitors) }} بازدیدکننده یکتا</title>
                  </circle>
                  <circle
                    v-if="showVisitors"
                    :cx="chartX(index)"
                    :cy="chartY(day.uniqueVisitors)"
                    :r="activeChartPoint === index ? 4 : 2.5"
                    fill="var(--color-base-100)"
                    stroke="var(--color-secondary)"
                    stroke-width="1.25"
                    tabindex="0"
                    role="button"
                    :aria-label="`${shortDate(day.date)}: ${fa(day.uniqueVisitors)} بازدیدکننده یکتا، ${fa(day.pageViews)} بازدید صفحه`"
                    @mouseenter="setActiveChartPoint(index)"
                    @mouseleave="clearActiveChartPoint"
                    @focus="setActiveChartPoint(index)"
                    @blur="clearActiveChartPoint"
                    @click="setActiveChartPoint(index)"
                  />
                </template>
                <text v-for="label in chartLabels" :key="label.date" :x="label.x" y="255" :text-anchor="label.anchor" fill="currentColor" class="text-[11px] text-base-content/55">{{ shortDate(label.date) }}</text>
                </svg>
                <div
                  v-if="activeChartPoint !== null"
                  class="chart-tooltip pointer-events-none absolute z-10 min-w-36 rounded-lg border border-base-300 bg-base-100 px-3 py-2 text-xs shadow-sm"
                  :style="chartTooltipStyle"
                  dir="rtl"
                >
                  <p class="font-bold text-base-content">{{ shortDate(activeChartPointData.date) }}</p>
                  <p v-if="showViews" class="mt-1 text-primary">بازدید صفحات: <bdi dir="ltr" class="font-bold">{{ fa(activeChartPointData.pageViews) }}</bdi></p>
                  <p v-if="showVisitors" class="text-secondary">بازدیدکننده یکتا: <bdi dir="ltr" class="font-bold">{{ fa(activeChartPointData.uniqueVisitors) }}</bdi></p>
                </div>
              </div>
            </div>
            <div v-else class="empty-state min-h-60">
              <ChartNoAxesColumn class="size-8 text-primary/40" :stroke-width="1.5" aria-hidden="true" />
              <p class="font-medium text-base-content/75">هنوز بازدیدی ثبت نشده است</p>
              <p>با ثبت بازدیدهای جدید، نمودار اینجا نمایش داده می‌شود.</p>
            </div>
          </article>

          <article class="panel">
            <div class="panel-heading">
              <div><h3>کیفیت بازدید</h3><p>نگاهی به تعامل بازدیدکنندگان</p></div>
              <Gauge class="size-5 shrink-0 text-primary/70" aria-hidden="true" />
            </div>
            <div class="mt-6 rounded-lg bg-base-200/70 p-4">
              <div class="flex items-center justify-between gap-3">
                <span class="text-sm text-base-content/65">نرخ تک‌صفحه‌ای</span>
                <strong class="text-2xl font-bold tabular-nums">{{ analytics.summary.sessions ? `${fa(analytics.summary.bounceRate)}٪` : '—' }}</strong>
              </div>
              <progress class="progress progress-primary mt-4 block h-1.5 w-full" :value="analytics.summary.bounceRate" max="100" aria-label="نرخ جلسات تک‌صفحه‌ای"></progress>
              <p class="mt-3 text-xs leading-6 text-base-content/55">سهم جلسه‌هایی که تنها یک صفحه را دیده‌اند.</p>
            </div>
            <dl class="mt-2 divide-y divide-base-300 text-sm">
              <div class="flex items-center justify-between gap-3 py-4"><dt class="text-base-content/65">صفحه در هر جلسه</dt><dd class="font-bold tabular-nums">{{ pagesPerSession }}</dd></div>
              <div class="flex items-center justify-between gap-3 py-4"><dt class="text-base-content/65">میانگین زمان فعال</dt><dd class="font-bold tabular-nums">{{ analytics.summary.sessions ? formatDuration(analytics.summary.averageSessionDurationSeconds) : '—' }}</dd></div>
            </dl>
            <p class="border-t border-base-300 pt-3 text-xs leading-6 text-base-content/55">ماندگاری بر اساس زمان فعال در صفحات محاسبه می‌شود.</p>
          </article>
        </div>

        <article class="panel !p-0 overflow-hidden">
          <div class="panel-heading p-5 md:p-6">
            <div><h3>محبوب‌ترین صفحات</h3><p>صفحات پربازدید، به ترتیب تعداد بازدید</p></div>
            <span class="rounded-md bg-primary/5 px-2.5 py-1.5 text-xs text-primary">{{ fa(analytics.topPages.length) }} صفحه</span>
          </div>
          <div v-if="analytics.topPages.length" class="overflow-x-auto" tabindex="0" role="region" aria-label="جدول محبوب‌ترین صفحات">
            <table class="table w-full min-w-[570px] text-sm">
              <caption class="sr-only">بازدید، بازدیدکنندگان یکتا و میانگین ماندگاری صفحات</caption>
              <thead class="border-y border-base-300 bg-base-200/60 text-xs text-base-content/60">
                <tr><th scope="col" class="w-12 ps-5 md:ps-6">رتبه</th><th scope="col">صفحه</th><th scope="col" class="text-center">بازدید</th><th scope="col" class="text-center">یکتا</th><th scope="col" class="pe-5 text-end md:pe-6">ماندگاری</th></tr>
              </thead>
              <tbody>
                <tr v-for="(page, index) in analytics.topPages" :key="page.path" class="border-base-300 hover:bg-base-200/40">
                  <td class="ps-5 text-base-content/45 md:ps-6">{{ fa(index + 1) }}</td>
                  <th scope="row" class="py-4 font-normal"><p class="font-medium">{{ pageTitle(page.path) }}</p><bdi class="mt-1 block max-w-80 break-all text-xs leading-5 text-base-content/55" dir="ltr">{{ page.path }}</bdi></th>
                  <td class="text-center"><strong class="tabular-nums">{{ fa(page.views) }}</strong><div class="mx-auto mt-2 h-1 w-14 overflow-hidden rounded-full bg-base-200" aria-hidden="true"><div class="h-full rounded-full bg-primary/65" :style="{ width: `${page.views / Math.max(1, analytics.topPages[0]?.views ?? 1) * 100}%` }"></div></div></td>
                  <td class="text-center tabular-nums text-base-content/65">{{ fa(page.uniqueVisitors) }}</td>
                  <td class="pe-5 text-end tabular-nums text-base-content/65 md:pe-6">{{ formatDuration(page.averageDurationSeconds) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-state border-t border-base-300"><FileBarChart class="size-7 text-primary/40" aria-hidden="true" /><p>صفحات پربازدید پس از ثبت بازدیدها نمایش داده می‌شوند.</p></div>
        </article>

        <div class="breakdown-grid">
          <article class="panel">
            <div class="panel-heading"><div><h3>دستگاه‌ها</h3><p>سهم دستگاه‌ها از بازدید صفحات</p></div><MonitorSmartphone class="size-5 shrink-0 text-primary/70" aria-hidden="true" /></div>
            <div v-if="analytics.devices.length" class="mt-6 space-y-5">
              <div v-for="device in analytics.devices" :key="device.name">
                <div class="mb-2.5 flex items-center gap-2 text-sm">
                  <component :is="deviceIcon(device.name)" class="size-4 text-base-content/45" aria-hidden="true" />
                  <span>{{ deviceLabel(device.name) }}</span><span class="ms-auto text-xs tabular-nums text-base-content/55">{{ fa(device.views) }} بازدید</span><strong class="w-12 text-end tabular-nums">{{ fa(device.percentage) }}٪</strong>
                </div>
                <div class="h-1.5 overflow-hidden rounded-full bg-base-200" aria-hidden="true"><div class="h-full rounded-full" :class="device.name === 'mobile' ? 'bg-secondary' : device.name === 'tablet' ? 'bg-base-content/35' : 'bg-primary'" :style="{ width: `${device.percentage}%` }"></div></div>
              </div>
            </div>
            <div v-else class="empty-state"><MonitorSmartphone class="size-7 text-primary/40" aria-hidden="true" /><p>اطلاعات دستگاه‌ها هنوز ثبت نشده است.</p></div>
          </article>
          <article class="panel">
            <div class="panel-heading"><div><h3>منابع ورود</h3><p>منابع ثبت‌شده برای بازدیدها</p></div><ExternalLink class="size-5 shrink-0 text-primary/70" aria-hidden="true" /></div>
            <ol v-if="analytics.referrers.length" class="mt-5 divide-y divide-base-300">
              <li v-for="(source, index) in analytics.referrers" :key="source.name" class="flex items-center gap-3 py-3 text-sm">
                <span class="w-5 shrink-0 text-xs text-base-content/40">{{ fa(index + 1) }}</span><bdi class="min-w-0 flex-1 break-all" dir="ltr">{{ source.name }}</bdi><span class="shrink-0 rounded-md bg-base-200 px-2.5 py-1 text-xs font-bold tabular-nums">{{ fa(source.views) }} بازدید</span>
              </li>
            </ol>
            <div v-else class="empty-state"><ExternalLink class="size-7 text-primary/40" aria-hidden="true" /><p>منبع ورودی برای این بازه ثبت نشده است.</p></div>
          </article>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Activity, ChartNoAxesColumn, ChevronLeft, Clock3, ExternalLink, FileBarChart, FolderTree, Gauge, Mail, Monitor, MonitorSmartphone, Newspaper, Package, RefreshCw, Smartphone, Tablet, Users, WifiOff } from 'lucide-vue-next'

definePageMeta({ layout: 'dashboard' })

interface AnalyticsResponse {
  range: number
  summary: { pageViews: number; uniqueVisitors: number; sessions: number; averageSessionDurationSeconds: number; bounceRate: number }
  daily: Array<{ date: string; pageViews: number; uniqueVisitors: number; sessions: number }>
  topPages: Array<{ path: string; views: number; uniqueVisitors: number; averageDurationSeconds: number }>
  devices: Array<{ name: string; views: number; percentage: number }>
  referrers: Array<{ name: string; views: number }>
}

interface ContentStats {
  product_categories: number
  products: number
  blog_pages: number
  form_submissions: number
  unread_form_submissions: number
  content?: {
    categories?: { total: number; visible: number }
    products?: { total: number; active: number }
    messages?: { total: number; unread: number; processed: number }
    blog?: { total: number }
  }
}

const selectedRange = ref(7)
const showViews = ref(true)
const showVisitors = ref(true)
const activeChartPoint = ref<number | null>(null)
const { data: analytics, status, error, refresh } = await useFetch('/api/analytics/stats', {
  lazy: true,
  query: computed(() => ({ range: selectedRange.value })),
  transform: (response: { data: AnalyticsResponse }) => response.data,
})
const { data: contentStats, status: contentStatus, error: contentError, refresh: refreshContent } = await useFetch('/api/dashboard/stats', {
  lazy: true,
  transform: (response: { data: ContentStats }) => response.data,
})
const isRefreshing = computed(() => status.value === 'pending' || contentStatus.value === 'pending')
const refreshAll = () => Promise.all([refresh(), refreshContent()])
const fa = (value: number) => value.toLocaleString('fa-IR', { maximumFractionDigits: 1 })
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return minutes ? `${fa(minutes)} دقیقه${remainder ? ` و ${fa(remainder)} ثانیه` : ''}` : `${fa(seconds)} ثانیه`
}
const shortDate = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('fa-IR', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const pageTitles: Record<string, string> = {
  '/': 'صفحه اصلی', '/about': 'درباره ما', '/contact': 'تماس با ما', '/blog': 'بلاگ',
  '/resources': 'منابع مهندسی', '/resources/tools': 'ابزارهای مهندسی', '/resources/standards': 'استانداردها',
  '/resources/tools/pipe-dimensions': 'ابعاد لوله', '/resources/tools/material-database': 'بانک اطلاعات مواد',
}
const pageTitle = (path: string) => pageTitles[path] || (path.startsWith('/product/') ? 'صفحه محصول' : path.startsWith('/categories/') ? 'دسته‌بندی محصولات' : path.startsWith('/blog/') ? 'مطلب وبلاگ' : 'صفحه داخلی')
const deviceLabel = (name: string) => ({ desktop: 'دسکتاپ', mobile: 'موبایل', tablet: 'تبلت' } as Record<string, string>)[name] || 'سایر'
const deviceIcon = (name: string) => name === 'mobile' ? Smartphone : name === 'tablet' ? Tablet : Monitor

const summaryCards = computed(() => analytics.value ? [
  { label: 'بازدید صفحات', value: fa(analytics.value.summary.pageViews), hint: 'مجموع بازدید در بازه انتخابی', icon: FileBarChart },
  { label: 'بازدیدکننده یکتا', value: fa(analytics.value.summary.uniqueVisitors), hint: 'بازدیدکنندگان بدون شمارش تکراری', icon: Users },
  { label: 'جلسه‌های بازدید', value: fa(analytics.value.summary.sessions), hint: 'مجموع جلسه‌های ثبت‌شده', icon: Activity },
  { label: 'میانگین ماندگاری', value: analytics.value.summary.sessions ? formatDuration(analytics.value.summary.averageSessionDurationSeconds) : '—', hint: 'زمان فعال در هر جلسه', icon: Clock3 },
] : [])

const contentCards = computed(() => {
  const stats = contentError.value ? null : contentStats.value
  const categories = stats?.content?.categories
  const products = stats?.content?.products
  const messages = stats?.content?.messages
  const count = (value?: number) => value === undefined ? '—' : fa(value)
  const unread = messages?.unread ?? stats?.unread_form_submissions
  return [
    { label: 'محصولات', value: count(products?.total ?? stats?.products), hint: products ? `${fa(products.active)} محصول فعال` : 'مدیریت محصولات', to: '/dashboard/products', icon: Package, attention: false },
    { label: 'دسته‌بندی‌ها', value: count(categories?.total ?? stats?.product_categories), hint: categories ? `${fa(categories.visible)} دسته قابل نمایش` : 'مدیریت دسته‌بندی‌ها', to: '/dashboard/categories', icon: FolderTree, attention: false },
    { label: 'پیام‌ها', value: count(messages?.total ?? stats?.form_submissions), hint: unread === undefined ? 'مشاهده صندوق پیام‌ها' : `${fa(unread)} پیام خوانده‌نشده`, to: '/dashboard/forms', icon: Mail, attention: !!unread },
    { label: 'بلاگ‌ها', value: count(stats?.content?.blog?.total ?? stats?.blog_pages), hint: 'مدیریت مطالب وبلاگ', to: '/dashboard/blog', icon: Newspaper, attention: false },
  ]
})

const hasDailyData = computed(() => analytics.value?.daily.some(day => day.pageViews > 0) ?? false)
const activeChartPointData = computed(() => analytics.value?.daily[activeChartPoint.value ?? 0] ?? { date: '', pageViews: 0, uniqueVisitors: 0, sessions: 0 })
const pagesPerSession = computed(() => analytics.value?.summary.sessions ? fa(analytics.value.summary.pageViews / analytics.value.summary.sessions) : '—')
const chartMax = computed(() => Math.max(3, Math.ceil(Math.max(0, ...(analytics.value?.daily.map(day => day.pageViews) ?? [])) / 3) * 3))
const chartX = (index: number) => 48 + index / Math.max(1, (analytics.value?.daily.length ?? 1) - 1) * 644
const chartY = (value: number) => 218 - value / chartMax.value * 190
const chartTicks = computed(() => Array.from({ length: 4 }, (_, index) => ({ value: chartMax.value * index / 3, y: chartY(chartMax.value * index / 3) })))
const viewsPoints = computed(() => analytics.value?.daily.map((day, index) => `${chartX(index)},${chartY(day.pageViews)}`).join(' ') ?? '')
const visitorsPoints = computed(() => analytics.value?.daily.map((day, index) => `${chartX(index)},${chartY(day.uniqueVisitors)}`).join(' ') ?? '')
const areaPath = computed(() => viewsPoints.value ? `M 48,218 L ${viewsPoints.value.split(' ').join(' L ')} L ${chartX((analytics.value?.daily.length ?? 1) - 1)},218 Z` : '')
const chartLabels = computed(() => {
  const days = analytics.value?.daily ?? []
  return days.flatMap((day, index) => [0, Math.floor((days.length - 1) / 2), days.length - 1].includes(index)
    ? [{
        date: day.date,
        // Center endpoint labels inside a generous inset so Persian month names cannot spill out.
        x: index === 0 ? 82 : index === days.length - 1 ? 652 : chartX(index),
        anchor: 'middle',
      }]
    : [])
})
const chartTooltipStyle = computed(() => ({
  left: `${chartX(activeChartPoint.value ?? 0) / 720 * 100}%`,
  top: `${Math.max(8, chartY(Math.max(activeChartPointData.value.pageViews, activeChartPointData.value.uniqueVisitors)) / 270 * 100 - 2)}%`,
  transform: activeChartPoint.value === 0 ? 'translateX(0)' : activeChartPoint.value === (analytics.value?.daily.length ?? 1) - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
}))
const setActiveChartPoint = (index: number) => { activeChartPoint.value = index }
const clearActiveChartPoint = () => { activeChartPoint.value = null }
const toggleViews = () => { if (showVisitors.value) showViews.value = !showViews.value }
const toggleVisitors = () => { if (showViews.value) showVisitors.value = !showVisitors.value }
</script>

<style scoped>
.overview-header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-base-300); }
.header-controls { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: .5rem; width: 100%; }
.section-heading { display: flex; align-items: baseline; justify-content: space-between; gap: .75rem; margin-bottom: 1rem; }
.section-heading h2 { font-size: .875rem; font-weight: 700; }
.content-grid, .metric-grid, .report-grid, .breakdown-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
.panel, .content-card { min-width: 0; border: 1px solid var(--color-base-300); border-radius: .75rem; background: var(--color-base-100); padding: 1.25rem; }
.content-card { display: block; transition: border-color 160ms, background-color 160ms; }
.content-card:hover { border-color: color-mix(in srgb, var(--color-primary) 40%, transparent); background: color-mix(in srgb, var(--color-primary) 2%, var(--color-base-100)); }
.icon-tile { display: inline-flex; flex-shrink: 0; align-items: center; justify-content: center; padding: .625rem; border-radius: .5rem; color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 5%, transparent); }
.metric-card { position: relative; overflow: hidden; }
.metric-primary { border-color: color-mix(in srgb, var(--color-primary) 20%, var(--color-base-300)); background: color-mix(in srgb, var(--color-primary) 3%, var(--color-base-100)); }
.metric-primary::before { content: ''; position: absolute; inset-inline-start: 0; top: 1.25rem; bottom: 1.25rem; width: 3px; border-radius: 2px; background: var(--color-primary); }
.panel-heading { display: flex; align-items: start; justify-content: space-between; gap: 1rem; }
.panel-heading h3 { font-size: 1rem; font-weight: 700; line-height: 1.75; }
.panel-heading p { margin-top: .25rem; font-size: .75rem; line-height: 1.75; color: color-mix(in srgb, var(--color-base-content) 60%, transparent); }
.empty-state { display: flex; min-height: 11rem; flex-direction: column; align-items: center; justify-content: center; gap: .75rem; padding: 2rem 1rem; text-align: center; font-size: .8125rem; line-height: 1.75; color: color-mix(in srgb, var(--color-base-content) 60%, transparent); }
.chart-tooltip { white-space: nowrap; }
.dashboard-overview :is(a, button, select, [tabindex]):focus-visible { outline: 2px solid var(--color-primary); outline-offset: 3px; }
@media (min-width: 640px) { .content-grid, .metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .header-controls { width: 20rem; } }
@media (min-width: 768px) { .panel { padding: 1.5rem; } }
@media (min-width: 1280px) { .content-grid, .metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } .report-grid { grid-template-columns: minmax(0, 1.7fr) minmax(280px, 1fr); } .breakdown-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .metric-card { padding: 1.25rem; } }
@media (prefers-reduced-motion: reduce) { .content-card { transition: none; } }
</style>
