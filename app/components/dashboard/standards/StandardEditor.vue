<template>
  <div class="space-y-6" dir="rtl">
    <div v-if="loading" class="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-base-200 bg-base-100">
      <span class="loading loading-spinner loading-md text-primary" />
      <p class="text-sm text-base-content/55">در حال بارگذاری استاندارد...</p>
    </div>

    <div v-else-if="loadError" class="alert alert-error rounded-xl">
      <span>{{ getApiErrorMessage(loadError, 'اطلاعات استاندارد بارگذاری نشد.') }}</span>
      <button type="button" class="btn btn-sm" @click="loadStandard">تلاش مجدد</button>
    </div>

    <form v-else class="space-y-6" @submit.prevent="saveStandard">
      <header class="flex flex-col gap-4 rounded-2xl border border-base-200 bg-base-100 p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs font-bold tracking-[0.18em] text-primary uppercase" lang="en" dir="ltr">Standards Management</p>
          <h1 class="mt-2 text-2xl font-bold">{{ isEditMode ? 'ویرایش استاندارد' : 'افزودن استاندارد' }}</h1>
          <p v-if="form.designation" class="mt-1 font-mono text-xs text-base-content/50" dir="ltr">{{ form.designation }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <label class="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-base-300 px-4 text-sm font-semibold">
            <input v-model="form.is_published" type="checkbox" class="toggle toggle-primary toggle-sm" />
            منتشر شود
          </label>
          <NuxtLink to="/dashboard/standards" class="btn btn-ghost min-h-11 rounded-xl">انصراف</NuxtLink>
          <button type="submit" class="btn btn-primary min-h-11 rounded-xl px-6 font-bold" :disabled="saving">
            <span v-if="saving" class="loading loading-spinner loading-xs" />
            {{ isEditMode ? 'ذخیره تغییرات' : 'ایجاد استاندارد' }}
          </button>
        </div>
      </header>

      <div v-if="validationErrors.length" class="alert alert-error items-start rounded-xl" role="alert">
        <CircleAlert class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <ul class="list-disc space-y-1 pe-5 text-sm">
          <li v-for="error in validationErrors" :key="error">{{ error }}</li>
        </ul>
      </div>

      <section class="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm sm:p-6" aria-labelledby="standard-identity-heading">
        <div class="mb-5">
          <h2 id="standard-identity-heading" class="text-lg font-bold">مشخصات مرجع</h2>
          <p class="mt-1 text-xs leading-6 text-base-content/55">شناسه‌های فنی به همان شکل رسمی و با حروف لاتین ثبت شوند.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div class="grid w-full gap-2">
            <label for="standard-organization" class="text-sm font-semibold">سازمان / ناشر <span class="text-error">*</span></label>
            <select id="standard-organization" v-model="organizationChoice" required class="select select-bordered w-full rounded-xl" @change="handleOrganizationChoice">
              <option value="" disabled>سازمان استاندارد را انتخاب کنید</option>
              <option v-for="item in organizationOptions" :key="item" :value="item">{{ item }}</option>
              <option value="other">سایر سازمان‌ها</option>
            </select>
            <input v-if="organizationChoice === 'other'" v-model="form.organization" required maxlength="80" dir="ltr" class="input input-bordered mt-1 w-full rounded-xl font-mono" placeholder="نام یا کد سازمان" />
          </div>
          <label class="form-control w-full">
            <span class="label font-semibold">کد / شناسه استاندارد <span class="text-error">*</span></span>
            <input v-model="form.designation" required maxlength="160" dir="ltr" class="input input-bordered w-full rounded-xl font-mono" placeholder="ASME B16.5" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">موضوع فارسی <span class="text-error">*</span></span>
            <input v-model="form.category_fa" required maxlength="120" class="input input-bordered w-full rounded-xl" placeholder="فلنج‌ها و اتصالات" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">موضوع انگلیسی</span>
            <input v-model="form.category_en" maxlength="120" dir="ltr" class="input input-bordered w-full rounded-xl" placeholder="Flanges & Fittings" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">ویرایش / بازنگری</span>
            <input v-model="form.edition" maxlength="120" dir="ltr" class="input input-bordered w-full rounded-xl" placeholder="Edition or revision as published" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">سال انتشار</span>
            <input v-model.number="form.publication_year" type="number" min="1800" max="2200" dir="ltr" class="input input-bordered w-full rounded-xl" placeholder="2024" />
          </label>
          <div class="grid w-full gap-2">
            <div class="flex items-center justify-between gap-3">
              <label for="standard-slug" class="text-sm font-semibold">نامک پیوند</label>
              <button type="button" class="btn btn-ghost btn-xs text-primary" @click="toggleSlugEditing">{{ slugEditing ? 'پایان ویرایش' : 'ویرایش دستی' }}</button>
            </div>
            <input id="standard-slug" v-model="form.slug" maxlength="160" dir="ltr" :readonly="!slugEditing" class="input input-bordered w-full rounded-xl font-mono read-only:bg-base-200/60" @input="slugManuallyEdited = true" @blur="finishSlugEditing" />
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-xs text-base-content/50">بر اساس شناسه استاندارد به‌صورت خودکار ساخته می‌شود.</span>
              <button v-if="slugManuallyEdited" type="button" class="btn btn-link btn-xs h-auto min-h-0 p-0 text-primary" @click="useAutomaticSlug">ساخت خودکار</button>
            </div>
            <span v-if="form.slug" class="text-xs text-base-content/45" dir="ltr">/resources/standards/{{ form.slug }}</span>
          </div>
          <label class="form-control w-full">
            <span class="label font-semibold">ترتیب نمایش</span>
            <input v-model.number="form.sort_order" type="number" min="0" dir="ltr" class="input input-bordered w-full rounded-xl" placeholder="Optional" />
          </label>
          <label class="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-base-300 px-4 md:col-span-2">
            <input v-model="form.is_featured" type="checkbox" class="checkbox checkbox-primary checkbox-sm" />
            <span>
              <span class="block text-sm font-bold">نمایش به‌عنوان مرجع منتخب</span>
              <span class="block text-xs text-base-content/50">موارد منتخب پیش از سایر نتایج نمایش داده می‌شوند.</span>
            </span>
          </label>
        </div>
      </section>

      <section class="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm sm:p-6" aria-labelledby="standard-content-heading">
        <div class="mb-5">
          <h2 id="standard-content-heading" class="text-lg font-bold">محتوای عمومی</h2>
          <p class="mt-1 text-xs leading-6 text-base-content/55">متن فارسی در سایت نمایش داده می‌شود و معادل انگلیسی برای توسعه چندزبانه نگهداری می‌شود.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <label class="form-control w-full">
            <span class="label font-semibold">عنوان فارسی <span class="text-error">*</span></span>
            <input v-model="form.title_fa" required maxlength="300" class="input input-bordered w-full rounded-xl" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">عنوان انگلیسی</span>
            <input v-model="form.title_en" maxlength="300" dir="ltr" class="input input-bordered w-full rounded-xl" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">توضیح کوتاه فارسی <span class="text-error">*</span></span>
            <textarea v-model="form.short_description_fa" required maxlength="600" rows="4" class="textarea textarea-bordered w-full rounded-xl leading-7" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">توضیح کوتاه انگلیسی</span>
            <textarea v-model="form.short_description_en" maxlength="600" rows="4" dir="ltr" class="textarea textarea-bordered w-full rounded-xl leading-7" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">توضیحات کامل فارسی</span>
            <textarea v-model="form.content_fa" rows="9" class="textarea textarea-bordered w-full rounded-xl leading-8" placeholder="اطلاعات مرجع و کاربرد استاندارد؛ بدون بازنشر متن دارای حق نشر" />
          </label>
          <label class="form-control w-full">
            <span class="label font-semibold">توضیحات کامل انگلیسی</span>
            <textarea v-model="form.content_en" rows="9" dir="ltr" class="textarea textarea-bordered w-full rounded-xl leading-7" />
          </label>
        </div>
      </section>

      <section class="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm sm:p-6" aria-labelledby="standard-links-heading">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 id="standard-links-heading" class="text-lg font-bold">پیوندها و منابع مجاز</h2>
            <p class="mt-1 max-w-2xl text-xs leading-6 text-base-content/55">تنها به منبع رسمی یا فایل‌هایی پیوند دهید که هیراد مجوز انتشار آن‌ها را دارد.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="btn btn-outline btn-primary min-h-10 rounded-xl px-4" @click="addResource">افزودن پیوند</button>
            <button type="button" class="btn btn-outline btn-success min-h-10 rounded-xl px-4" @click="mediaOpen = true">انتخاب از رسانه</button>
          </div>
        </div>
        <label class="mt-5 grid w-full gap-2">
          <span class="text-sm font-semibold">نشانی منبع رسمی</span>
          <input v-model="form.official_url" type="url" dir="ltr" class="input input-bordered min-h-11 w-full rounded-xl" placeholder="https://www.asme.org/codes-standards/..." />
        </label>
        <div v-if="form.resources.length" class="mt-5 space-y-4">
          <fieldset v-for="(resource, index) in form.resources" :key="resource.id" class="rounded-2xl border border-base-200 bg-base-200/20 p-4 sm:p-5">
            <div class="mb-4 flex items-center justify-between gap-3 border-b border-base-200 pb-3">
              <legend class="text-sm font-bold">منبع {{ index + 1 }}</legend>
              <button type="button" class="btn btn-ghost btn-sm min-h-9 rounded-lg px-2 text-error" @click="removeResource(index)">
                <Trash2 class="size-4" aria-hidden="true" /> حذف منبع
              </button>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <label class="grid w-full gap-2">
                <span class="text-xs font-semibold">عنوان فارسی</span>
                <input v-model="resource.label_fa" maxlength="160" class="input input-bordered min-h-11 w-full rounded-xl" />
              </label>
              <label class="grid w-full gap-2" dir="ltr">
                <span class="text-xs font-semibold">عنوان انگلیسی</span>
                <input v-model="resource.label_en" maxlength="160" dir="ltr" class="input input-bordered min-h-11 w-full rounded-xl" />
              </label>
              <label class="grid w-full gap-2 md:col-span-2" dir="ltr">
                <span class="text-xs font-semibold" dir="rtl">نشانی</span>
                <input v-model="resource.url" dir="ltr" class="input input-bordered min-h-11 w-full rounded-xl font-mono" />
              </label>
              <label class="grid w-full gap-2">
                <span class="text-xs font-semibold">نوع منبع</span>
                <select v-model="resource.kind" class="select select-bordered min-h-11 w-full rounded-xl">
                <option value="official">منبع رسمی</option>
                <option value="document">فایل / سند مجاز</option>
                <option value="reference">مرجع تکمیلی</option>
                </select>
              </label>
            </div>
          </fieldset>
        </div>
        <div v-else class="mt-5 rounded-xl border border-dashed border-base-300 px-5 py-8 text-center text-sm text-base-content/50">منبع تکمیلی یا فایل پیوستی ثبت نشده است.</div>
      </section>

      <section class="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm sm:p-6" aria-labelledby="standard-seo-heading">
        <div class="mb-5">
          <h2 id="standard-seo-heading" class="text-lg font-bold">فراداده و سئو</h2>
          <p class="mt-1 text-xs leading-6 text-base-content/55">در صورت خالی بودن، عنوان و توضیح کوتاه استاندارد استفاده می‌شود.</p>
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          <div class="grid w-full gap-2"><label for="meta-title-fa" class="text-sm font-semibold">عنوان متا فارسی</label><input id="meta-title-fa" v-model="form.meta_title_fa" maxlength="300" class="input input-bordered w-full rounded-xl" /></div>
          <div class="grid w-full gap-2" dir="ltr"><label for="meta-title-en" class="text-sm font-semibold">Meta title (EN)</label><input id="meta-title-en" v-model="form.meta_title_en" maxlength="300" class="input input-bordered w-full rounded-xl" /></div>
          <div class="grid w-full gap-2"><label for="meta-description-fa" class="text-sm font-semibold">توضیح متا فارسی</label><textarea id="meta-description-fa" v-model="form.meta_description_fa" maxlength="600" rows="4" class="textarea textarea-bordered w-full rounded-xl" /></div>
          <div class="grid w-full gap-2" dir="ltr"><label for="meta-description-en" class="text-sm font-semibold">Meta description (EN)</label><textarea id="meta-description-en" v-model="form.meta_description_en" maxlength="600" rows="4" class="textarea textarea-bordered w-full rounded-xl" /></div>
        </div>
      </section>
    </form>

    <MediaSelector
      v-if="mediaOpen"
      :is-open="mediaOpen"
      modal-title="انتخاب فایل مجاز استاندارد"
      default-kind="document"
      @close="mediaOpen = false"
      @file-selected="addMediaResource"
    />
  </div>
</template>

<script setup lang="ts">
import { CircleAlert, Trash2 } from 'lucide-vue-next'
import MediaSelector from '~/components/dashboard/media/MediaSelector.vue'
import type { StandardApiResponse, StandardDraft, StandardEntry, StandardResourceLink } from '~/types/standard'
import { emptyStandardDraft, standardSlugFromDesignation, validateStandardDraft } from '~/utils/standards'
import { getApiErrorMessage, getApiSuccessMessage } from '~/utils/apiFeedback'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const confirm = useDashboardConfirm()
const isEditMode = computed(() => typeof route.params.slug === 'string' && route.params.slug !== 'new')
const currentSlug = computed(() => isEditMode.value ? String(route.params.slug) : '')
const form = ref<StandardDraft>(emptyStandardDraft())
const loading = ref(isEditMode.value)
const saving = ref(false)
const loadError = ref<unknown>(null)
const validationErrors = ref<string[]>([])
const mediaOpen = ref(false)
const organizationChoice = ref('')
const slugEditing = ref(false)
const slugManuallyEdited = ref(false)
let dirty = false
let hydrated = false

const organizationOptions = ['API', 'ASME', 'ASTM', 'MSS', 'AMPP', 'NACE', 'ISO', 'BSI', 'IGS']

watch(form, () => {
  if (hydrated) dirty = true
}, { deep: true })

watch(() => [form.value.designation, form.value.organization, form.value.title_en], () => {
  if (!isEditMode.value && !slugManuallyEdited.value) form.value.slug = generatedSlug()
})

function generatedSlug(): string {
  const source = form.value.designation || [form.value.organization, form.value.title_en].filter(Boolean).join(' ')
  return standardSlugFromDesignation(source)
}

function handleOrganizationChoice(): void {
  if (organizationChoice.value === 'other') {
    if (organizationOptions.includes(form.value.organization)) form.value.organization = ''
    return
  }
  form.value.organization = organizationChoice.value
}

function syncOrganizationChoice(): void {
  organizationChoice.value = organizationOptions.includes(form.value.organization)
    ? form.value.organization
    : form.value.organization ? 'other' : ''
}

function toggleSlugEditing(): void {
  slugEditing.value = !slugEditing.value
  if (slugEditing.value) slugManuallyEdited.value = true
  else finishSlugEditing()
}

function finishSlugEditing(): void {
  slugEditing.value = false
  form.value.slug = form.value.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function useAutomaticSlug(): void {
  slugManuallyEdited.value = false
  slugEditing.value = false
  form.value.slug = generatedSlug()
}

function resourceId(): string {
  return globalThis.crypto?.randomUUID?.() || `resource-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function addResource(): void {
  form.value.resources.push({ id: resourceId(), label_fa: '', label_en: '', url: '', kind: 'reference' })
}

function addMediaResource(url: string): void {
  const filename = url.split('/').pop()?.replace(/^[a-f0-9-]+_/, '').replace(/\.[^.]+$/, '') || ''
  form.value.resources.push({ id: resourceId(), label_fa: filename, label_en: '', url, kind: 'document' })
  mediaOpen.value = false
}

function removeResource(index: number): void {
  form.value.resources.splice(index, 1)
}

async function loadStandard(): Promise<void> {
  if (!isEditMode.value) {
    hydrated = true
    loading.value = false
    return
  }
  loading.value = true
  loadError.value = null
  try {
    const response = await $fetch<StandardApiResponse<StandardEntry>>(`/api/standards/manage/${encodeURIComponent(currentSlug.value)}`)
    const { id: _id, backend_slug: _backendSlug, created_at: _created, updated_at: _updated, ...draft } = response.data
    form.value = draft
    syncOrganizationChoice()
    slugManuallyEdited.value = true
    await nextTick()
    dirty = false
    hydrated = true
  } catch (error) {
    loadError.value = error
  } finally {
    loading.value = false
  }
}

async function saveStandard(): Promise<void> {
  if (!form.value.slug) form.value.slug = generatedSlug()
  validationErrors.value = validateStandardDraft(form.value)
  if (validationErrors.value.length) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  saving.value = true
  try {
    const url = isEditMode.value
      ? `/api/standards/manage/${encodeURIComponent(currentSlug.value)}`
      : '/api/standards/manage'
    const response = await $fetch(url, { method: isEditMode.value ? 'PUT' : 'POST', body: form.value })
    dirty = false
    toast.success(getApiSuccessMessage(response, 'استاندارد ذخیره شد.'))
    await router.push('/dashboard/standards')
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'ذخیره استاندارد انجام نشد.'))
  } finally {
    saving.value = false
  }
}

onBeforeRouteLeave(async () => {
  if (!dirty || saving.value) return true
  return confirm({
    title: 'تغییرات ذخیره‌نشده',
    message: 'تغییرات این استاندارد ذخیره نشده است. آیا مایل به خروج هستید؟',
    confirmLabel: 'خروج بدون ذخیره',
    variant: 'danger',
  })
})

await loadStandard()
</script>
