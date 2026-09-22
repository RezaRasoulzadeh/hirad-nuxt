<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs font-bold tracking-[0.18em] text-primary uppercase" lang="en" dir="ltr">Standards Management</p>
        <h1 class="mt-2 text-2xl font-bold">مدیریت استانداردها</h1>
        <p class="mt-1 text-xs leading-6 text-base-content/60 sm:text-sm">ایجاد و مدیریت مراجع استاندارد در بخش منابع مهندسی.</p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <button type="button" class="btn btn-outline btn-primary min-h-12 rounded-xl px-5 font-bold" @click="openJsonImport">افزودن با JSON</button>
        <NuxtLink to="/dashboard/standards/new" class="btn btn-primary min-h-12 rounded-xl px-6 font-bold">افزودن استاندارد</NuxtLink>
      </div>
    </header>

    <section class="grid gap-3 rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_minmax(10rem,0.35fr)_minmax(10rem,0.35fr)]" aria-label="فیلتر استانداردها">
      <label class="input input-bordered flex w-full items-center gap-2 rounded-xl">
        <Search class="size-4 text-base-content/40" aria-hidden="true" />
        <input v-model="query" type="search" class="grow" placeholder="جست‌وجوی کد، عنوان یا موضوع" />
      </label>
      <select v-model="organization" class="select select-bordered w-full rounded-xl" aria-label="فیلتر سازمان">
        <option value="">همه سازمان‌ها</option>
        <option v-for="item in organizations" :key="item" :value="item">{{ item }}</option>
      </select>
      <select v-model="statusFilter" class="select select-bordered w-full rounded-xl" aria-label="فیلتر وضعیت انتشار">
        <option value="">همه وضعیت‌ها</option>
        <option value="published">منتشرشده</option>
        <option value="draft">پیش‌نویس</option>
      </select>
    </section>

    <div v-if="status === 'pending'" class="space-y-3">
      <div v-for="item in 4" :key="item" class="h-28 animate-pulse rounded-xl border border-base-200 bg-base-100" />
    </div>

    <section v-else-if="error" class="flex flex-col items-center gap-3 rounded-2xl border border-base-200 bg-base-100 px-5 py-16 text-center">
      <WifiOff class="size-8 text-error" aria-hidden="true" />
      <h2 class="font-bold">استانداردها بارگذاری نشدند</h2>
      <p class="text-sm text-base-content/55">ارتباط با سرور را بررسی و دوباره تلاش کنید.</p>
      <button type="button" class="btn btn-sm btn-error btn-soft" @click="refresh">تلاش مجدد</button>
    </section>

    <section v-else-if="filteredStandards.length" class="space-y-3" aria-label="فهرست استانداردها">
      <article v-for="standard in filteredStandards" :key="standard.id" class="flex flex-col gap-4 rounded-xl border border-base-200 bg-base-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex min-w-0 items-start gap-4">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/5 px-2 text-center text-xs font-black text-primary" lang="en" dir="ltr">{{ standard.organization }}</span>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="font-mono text-sm font-bold" lang="en" dir="ltr">{{ standard.designation }}</h2>
              <span class="badge badge-sm" :class="standard.is_published ? 'badge-success badge-soft' : 'badge-warning badge-soft'">{{ standard.is_published ? 'منتشرشده' : 'پیش‌نویس' }}</span>
              <span v-if="standard.is_featured" class="badge badge-primary badge-soft badge-sm">منتخب</span>
            </div>
            <p class="mt-1 truncate font-semibold">{{ standard.title_fa }}</p>
            <p class="mt-1 text-xs text-base-content/50">{{ standard.category_fa }}<span v-if="standard.edition"> · {{ standard.edition }}</span><span v-if="standard.publication_year"> · <bdi>{{ standard.publication_year }}</bdi></span></p>
          </div>
        </div>
        <div class="flex shrink-0 items-center justify-end gap-1">
          <NuxtLink v-if="standard.is_published" :to="`/resources/standards/${standard.slug}`" target="_blank" class="btn btn-ghost btn-sm btn-square" aria-label="مشاهده عمومی">
            <ExternalLink class="size-4" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink :to="`/dashboard/standards/${standard.slug}`" class="btn btn-ghost btn-sm btn-square text-info" aria-label="ویرایش استاندارد">
            <Pencil class="size-4" aria-hidden="true" />
          </NuxtLink>
          <button type="button" class="btn btn-ghost btn-sm btn-square text-error" :disabled="deletingSlug === standard.slug" aria-label="حذف استاندارد" @click="removeStandard(standard)">
            <span v-if="deletingSlug === standard.slug" class="loading loading-spinner loading-xs" />
            <Trash2 v-else class="size-4" aria-hidden="true" />
          </button>
        </div>
      </article>
    </section>

    <section v-else class="flex flex-col items-center gap-3 rounded-2xl border border-base-200 bg-base-100 px-5 py-16 text-center">
      <FileSearch class="size-9 text-base-content/35" aria-hidden="true" />
      <h2 class="font-bold">{{ standards.length ? 'نتیجه‌ای با این فیلترها پیدا نشد' : 'هنوز استانداردی ثبت نشده است' }}</h2>
      <p class="text-sm text-base-content/55">{{ standards.length ? 'عبارت جست‌وجو یا فیلترها را تغییر دهید.' : 'نخستین مرجع استاندارد را از همین صفحه ایجاد کنید.' }}</p>
    </section>

    <div v-if="jsonImportOpen" class="modal modal-open z-70 bg-black/50" role="presentation" @keydown.esc.stop.prevent="closeJsonImport">
      <section class="modal-box w-11/12 max-w-3xl rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="standard-json-title" aria-describedby="standard-json-help">
        <div class="flex items-start justify-between gap-4 border-b border-base-200 pb-4">
          <div>
            <h2 id="standard-json-title" class="text-lg font-bold">افزودن استاندارد با JSON</h2>
            <p class="mt-1 text-sm leading-6 text-base-content/60">اطلاعات یک استاندارد را با ساختار فرم مدیریت وارد کنید.</p>
          </div>
          <button type="button" class="btn btn-ghost btn-sm btn-circle" aria-label="بستن پنجره" :disabled="jsonSubmitting" @click="closeJsonImport"><X class="size-4" aria-hidden="true" /></button>
        </div>

        <div class="mt-5 space-y-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="btn btn-sm btn-outline btn-primary rounded-lg" :disabled="jsonSubmitting" @click="jsonFileInput?.click()">انتخاب فایل JSON</button>
              <span v-if="jsonFilename" class="max-w-60 truncate text-xs text-base-content/60">{{ jsonFilename }}</span>
              <span v-else class="text-xs text-base-content/50">فایل با پسوند .json</span>
              <input ref="jsonFileInput" type="file" accept=".json,application/json" class="sr-only" @change="readJsonFile" />
            </div>
            <button type="button" class="btn btn-ghost btn-sm rounded-lg" :disabled="jsonSubmitting" @click="loadJsonTemplate">نمایش قالب استاندارد</button>
          </div>

          <div class="grid gap-2">
            <label for="standard-json-input" class="text-sm font-semibold">محتوای JSON</label>
            <textarea id="standard-json-input" v-model="jsonText" dir="ltr" spellcheck="false" autocomplete="off" class="textarea textarea-bordered min-h-80 w-full rounded-xl font-mono text-xs leading-6 focus:textarea-primary" placeholder="ساختار JSON استاندارد را اینجا وارد کنید..." :disabled="jsonSubmitting" />
          </div>

          <p v-if="jsonImportError" class="alert alert-error rounded-xl py-3 text-sm" role="alert">{{ jsonImportError }}</p>
          <div id="standard-json-help" class="text-xs leading-6 text-base-content/55">
            <p>فیلدهای organization، designation، title_fa، short_description_fa و category_fa الزامی هستند. اگر slug خالی باشد، از designation به‌صورت خودکار ساخته می‌شود.</p>
            <p>برای پیش‌نویس، مقدار is_published را false نگه دارید. پیوند فایل رسانه می‌تواند با <span class="font-mono" dir="ltr">/uploads/</span> آغاز شود.</p>
          </div>
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn btn-ghost rounded-xl" :disabled="jsonSubmitting" @click="closeJsonImport">بستن</button>
          <button type="button" class="btn btn-primary rounded-xl px-6 font-bold" :disabled="jsonSubmitting || !jsonText.trim()" @click="submitJsonStandard">
            <span v-if="jsonSubmitting" class="loading loading-spinner loading-xs" />
            {{ jsonSubmitting ? 'در حال ثبت...' : 'ثبت استاندارد' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExternalLink, FileSearch, Pencil, Search, Trash2, WifiOff, X } from 'lucide-vue-next'
import type { StandardApiResponse, StandardEntry } from '~/types/standard'
import { emptyStandardDraft, filterStandards, normalizeStandardDraft, validateStandardDraft } from '~/utils/standards'
import { getApiErrorMessage, getApiSuccessMessage } from '~/utils/apiFeedback'

definePageMeta({ layout: 'dashboard' })

const toast = useToast()
const confirm = useDashboardConfirm()
const query = ref('')
const organization = ref('')
const statusFilter = ref('')
const deletingSlug = ref<string | null>(null)
const jsonImportOpen = ref(false)
const jsonSubmitting = ref(false)
const jsonText = ref('')
const jsonFilename = ref('')
const jsonImportError = ref('')
const jsonFileInput = ref<HTMLInputElement | null>(null)
const { data: response, status, error, refresh } = await useFetch<StandardApiResponse<StandardEntry[]>>('/api/standards/manage', { lazy: true })
const standards = computed(() => response.value?.data || [])
const organizations = computed(() => [...new Set(standards.value.map(item => item.organization))].sort((a, b) => a.localeCompare(b, 'en')))
const filteredStandards = computed(() => filterStandards(standards.value, query.value, organization.value, '').filter((standard) => {
  if (statusFilter.value === 'published') return standard.is_published
  if (statusFilter.value === 'draft') return !standard.is_published
  return true
}))

function openJsonImport(): void {
  jsonImportOpen.value = true
  jsonImportError.value = ''
}

function closeJsonImport(): void {
  if (jsonSubmitting.value) return
  jsonImportOpen.value = false
  jsonText.value = ''
  jsonFilename.value = ''
  jsonImportError.value = ''
  if (jsonFileInput.value) jsonFileInput.value.value = ''
}

function loadJsonTemplate(): void {
  jsonText.value = JSON.stringify(emptyStandardDraft(), null, 2)
  jsonFilename.value = ''
  jsonImportError.value = ''
}

async function readJsonFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  jsonFilename.value = file.name
  jsonImportError.value = ''
  try {
    jsonText.value = await file.text()
  } catch {
    jsonImportError.value = 'خواندن فایل JSON انجام نشد.'
  }
}

async function submitJsonStandard(): Promise<void> {
  jsonImportError.value = ''
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText.value)
  } catch {
    jsonImportError.value = 'ساختار JSON معتبر نیست.'
    return
  }

  const draft = normalizeStandardDraft(parsed)
  const errors = validateStandardDraft(draft)
  if (errors.length) {
    jsonImportError.value = errors.join(' ')
    return
  }

  jsonSubmitting.value = true
  try {
    const result = await $fetch('/api/standards/manage', { method: 'POST', body: draft })
    toast.success(getApiSuccessMessage(result, 'استاندارد با موفقیت ایجاد شد.'))
    jsonSubmitting.value = false
    closeJsonImport()
    await refresh()
  } catch (importError) {
    jsonImportError.value = getApiErrorMessage(importError, 'ثبت استاندارد انجام نشد.')
  } finally {
    jsonSubmitting.value = false
  }
}

async function removeStandard(standard: StandardEntry): Promise<void> {
  const approved = await confirm({
    title: 'حذف استاندارد',
    message: `آیا از حذف «${standard.designation}» اطمینان دارید؟ این عملیات قابل بازگشت نیست.`,
    confirmLabel: 'حذف استاندارد',
    variant: 'danger',
  })
  if (!approved) return
  deletingSlug.value = standard.slug
  try {
    const result = await $fetch(`/api/standards/manage/${encodeURIComponent(standard.slug)}`, { method: 'DELETE' })
    toast.success(getApiSuccessMessage(result, 'استاندارد حذف شد.'))
    await refresh()
  } catch (deleteError) {
    toast.error(getApiErrorMessage(deleteError, 'حذف استاندارد انجام نشد.'))
  } finally {
    deletingSlug.value = null
  }
}
</script>
