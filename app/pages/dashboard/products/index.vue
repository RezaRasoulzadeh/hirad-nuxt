<template>
  <div class="w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">مدیریت محصولات</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">مشاهده، جستجو و تغییر ساختار محصولات بر اساس دسته‌بندی درختواره‌ای.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-2">
        <button
          ref="jsonImportTrigger"
          type="button"
          @click="openJsonImport"
          :disabled="loading || fetchError || !productCategoryOptions.length"
          class="btn btn-outline btn-primary font-bold px-5 h-12 rounded-xl text-sm"
        >
          افزودن محصول با JSON
        </button>
        <button
          type="button"
          @click="navigateTo('/dashboard/products/new')"
          class="btn btn-primary font-bold px-6 h-12 rounded-xl text-sm"
        >
          افزودن محصول جدید
        </button>
      </div>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-20 rounded-xl bg-base-100 border border-base-200 animate-pulse"></div>
    </div>

    <div v-else-if="fetchError" class="alert alert-error rounded-xl text-sm font-medium shadow-sm flex items-center justify-between">
      <span>خطا در بارگذاری ساختار دسته‌بندی و محصولات.</span>
      <button class="btn btn-sm btn-ghost text-error-content" @click="loadDashboardData">تلاش مجدد</button>
    </div>
    
    <div v-else-if="parentCategories.length" class="space-y-4">
      <ParentCategoryGroup 
        v-for="parentCategory in parentCategories" 
        :key="`parent-${parentCategory.id}`" 
        :parent-category="parentCategory"
        @edit="handleEditProduct"
        @duplicate="handleDuplicateProduct"
        @remove="handleProductRemoval"
      />
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      <p class="text-sm text-base-content/50">هیچ دسته‌بندی ساختار یافته‌ای در سیستم یافت نشد.</p>
    </div>

    <div
      v-if="jsonImportOpen"
      class="modal modal-open z-[100] bg-black/50"
      role="presentation"
      @keydown.esc.stop.prevent="closeJsonImport"
      @keydown="trapJsonImportFocus"
    >
      <section
        class="modal-box w-11/12 max-w-3xl rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="json-import-title"
        aria-describedby="json-import-help"
        dir="rtl"
      >
        <div class="mb-5 flex items-start justify-between gap-4 border-b border-base-200 pb-4">
          <div>
            <h2 id="json-import-title" class="text-lg font-bold text-base-content">افزودن محصول با JSON</h2>
            <p class="mt-1 text-sm leading-6 text-base-content/65">ساختار کامل محصول را وارد کنید یا فایل JSON آن را انتخاب کنید.</p>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle"
            aria-label="بستن پنجره"
            :disabled="jsonImportSubmitting"
            @click="closeJsonImport"
          >
            ×
          </button>
        </div>

        <div class="space-y-4">
          <div class="form-control w-full">
            <label for="product-json-category" class="label pb-1">
              <span class="label-text font-semibold">دسته‌بندی محصول</span>
            </label>
            <select
              id="product-json-category"
              v-model="jsonSelectedCategoryId"
              class="select select-bordered w-full rounded-xl"
              :disabled="jsonImportSubmitting"
              @change="handleJsonCategoryChange"
            >
              <option value="">انتخاب زیردسته محصول</option>
              <option v-for="category in productCategoryOptions" :key="category.id" :value="String(category.id)">
                {{ category.label }}
              </option>
            </select>
            <p class="mt-1 text-xs text-base-content/55">شناسه دسته‌بندی انتخاب‌شده در فیلد category_id قالب JSON قرار می‌گیرد.</p>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="btn btn-sm btn-outline btn-primary rounded-lg" :disabled="jsonImportSubmitting" @click="jsonFileInput?.click()">
                انتخاب فایل JSON
              </button>
              <span v-if="jsonFilename" class="max-w-56 truncate text-xs text-base-content/60">{{ jsonFilename }}</span>
              <span v-else class="text-xs text-base-content/50">فایل با پسوند .json</span>
              <input ref="jsonFileInput" type="file" accept=".json,application/json" class="sr-only" @change="handleJsonFileSelected" />
            </div>
            <button type="button" class="btn btn-ghost btn-sm rounded-lg" :disabled="jsonImportSubmitting" @click="loadJsonTemplate">
              نمایش قالب محصول
            </button>
          </div>

          <label for="product-json-input" class="label pb-1">
            <span class="label-text font-semibold">محتوای JSON محصول</span>
          </label>
          <textarea
            id="product-json-input"
            ref="jsonEditor"
            v-model="jsonText"
            dir="ltr"
            spellcheck="false"
            autocomplete="off"
            class="textarea textarea-bordered min-h-72 w-full rounded-xl font-mono text-xs leading-6 focus:textarea-primary"
            placeholder="ساختار JSON محصول را اینجا وارد کنید..."
            :disabled="jsonImportSubmitting"
            @input="handleJsonTextInput"
          />

          <p v-if="jsonImportError" class="alert alert-error rounded-xl py-3 text-sm" role="alert">{{ jsonImportError }}</p>
          <div id="json-import-help" class="space-y-1 text-xs leading-6 text-base-content/55">
            <p>نام کلیدها و شکل هر آیتم آرایه باید دقیقاً حفظ شود. در features و features_fa، عنوان هر ویژگی را به‌عنوان کلید همان شیء بنویسید؛ از کلید ثابت feature_key_en یا feature_key_fa استفاده نکنید.</p>
            <p>اگر بخشی داده‌ای ندارد، آرایه را خالی بگذارید؛ ردیف‌های نمونه را قبل از ثبت کامل یا حذف کنید.</p>
          </div>
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn btn-ghost rounded-xl" :disabled="jsonImportSubmitting" @click="closeJsonImport">بستن</button>
          <button type="button" class="btn btn-primary rounded-xl px-6 font-bold" :disabled="jsonImportSubmitting || !jsonText.trim()" @click="submitJsonProduct">
            <span v-if="jsonImportSubmitting" class="loading loading-spinner loading-xs"></span>
            {{ jsonImportSubmitting ? 'در حال ثبت...' : 'ثبت محصول' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch, nextTick } from 'vue'
import { navigateTo } from '#imports'
import ParentCategoryGroup from '~/components/dashboard/product/ParentCategoryGroup.vue'
import type { CategoryItem } from '~/types/categoryItem'
import type { ProductCategoryAction, ProductItem } from '~/types/productItem'
import { useDashboardConfirm } from '~/composables/useDashboardConfirm'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

interface CategoryNode extends CategoryItem {
  children?: CategoryNode[]
}

interface UiChildCategory extends CategoryNode {
  products?: any[] | null
  productsLoaded?: boolean
  expanded?: boolean
  productsLoading?: boolean
}

interface UiParentCategory extends CategoryNode {
  children: UiChildCategory[]
  expanded?: boolean
}

const loading = ref(true)
const fetchError = ref(false)
const rawCategories = ref<CategoryNode[]>([])
const confirm = useDashboardConfirm()
const toast = useToast()
const expansionStorageKey = 'hirad-dashboard-products-expansion-v1'
const expansionPersistenceReady = ref(false)
const jsonImportOpen = ref(false)
const jsonImportSubmitting = ref(false)
const jsonText = ref('')
const jsonSelectedCategoryId = ref('')
const jsonFilename = ref('')
const jsonImportError = ref('')
const jsonFileInput = ref<HTMLInputElement | null>(null)
const jsonEditor = ref<HTMLTextAreaElement | null>(null)
const jsonImportTrigger = ref<HTMLButtonElement | null>(null)

interface SavedExpansionState {
  parents: string[]
  children: string[]
}

const restoreExpansionState = () => {
  let savedState: SavedExpansionState = { parents: [], children: [] }

  try {
    const serializedState = localStorage.getItem(expansionStorageKey)
    if (serializedState) {
      const parsedState = JSON.parse(serializedState) as Partial<SavedExpansionState>
      savedState = {
        parents: Array.isArray(parsedState.parents) ? parsedState.parents.filter((slug): slug is string => typeof slug === 'string') : [],
        children: Array.isArray(parsedState.children) ? parsedState.children.filter((key): key is string => typeof key === 'string') : []
      }
    }
  } catch (err) {
    console.warn('Could not restore expanded product categories:', err)
  }

  const expandedParents = new Set(savedState.parents)
  const expandedChildren = new Set(savedState.children)
  parentCategories.value.forEach(parent => {
    parent.expanded = expandedParents.has(parent.slug)
    parent.children.forEach(child => {
      child.expanded = expandedChildren.has(`${parent.slug}/${child.slug}`)
    })
  })
  expansionPersistenceReady.value = true
}

const compareOrder = (a: { sort_order?: number | null; name?: string | null }, b: { sort_order?: number | null; name?: string | null }) => {
  if (a.sort_order == null && b.sort_order == null) return (a.name || '').localeCompare(b.name || '', 'fa')
  if (a.sort_order == null) return 1
  if (b.sort_order == null) return -1
  return a.sort_order - b.sort_order
}

const compareProductOrder = (a: ProductItem, b: ProductItem) => {
  if (a.sort_order == null && b.sort_order == null) return (a.name || '').localeCompare(b.name || '', 'fa')
  if (a.sort_order == null) return 1
  if (b.sort_order == null) return -1
  return a.sort_order - b.sort_order
}

const productJsonTemplate = () => ({
  category_id: productCategoryOptions.value.find(category => category.value === jsonSelectedCategoryId.value)?.id ?? '',
  sku: '',
  name: '',
  slug: '',
  price: 0,
  discount_price: 0,
  stock_quantity: 0,
  sort_order: null,
  is_active: false,
  short_description: {
    name: '',
    name_fa: '',
    description: '',
    description_fa: '',
    images: [{ media_asset_id: '', is_primary: true, image_url: '', sort_order: 0 }],
    features: [{ '<feature title in English>': '<feature value>' }],
    features_fa: [{ '<عنوان ویژگی به فارسی>': '<مقدار ویژگی>' }]
  },
  long_description: {
    applications: [{ title: '', title_fa: '', icon: '', description: '', description_fa: '' }],
    specifications: [{ name: '', name_fa: '', description: '', description_fa: '' }],
    explanation: [{ title: '', title_fa: '', image: '', description: '', description_fa: '' }],
    faq: [{ title: { en: '', fa: '' }, description: { en: '', fa: '' } }]
  }
})

const openJsonImport = async () => {
  jsonText.value = ''
  jsonSelectedCategoryId.value = ''
  jsonFilename.value = ''
  jsonImportError.value = ''
  if (jsonFileInput.value) jsonFileInput.value.value = ''
  jsonImportOpen.value = true
  await nextTick()
  jsonEditor.value?.focus()
}

const closeJsonImport = () => {
  if (jsonImportSubmitting.value) return
  jsonImportOpen.value = false
  nextTick(() => jsonImportTrigger.value?.focus())
}

const trapJsonImportFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return

  const modal = event.currentTarget as HTMLElement
  const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
    'button:not(:disabled), input:not(:disabled), textarea:not(:disabled)'
  ))
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const loadJsonTemplate = () => {
  jsonText.value = JSON.stringify(productJsonTemplate(), null, 2)
  jsonFilename.value = ''
  jsonImportError.value = ''
  if (jsonFileInput.value) jsonFileInput.value.value = ''
}

const handleJsonFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.name.toLowerCase().endsWith('.json')) {
    jsonImportError.value = 'فقط فایل با پسوند .json قابل انتخاب است.'
    input.value = ''
    return
  }

  try {
    jsonText.value = await file.text()
    jsonFilename.value = file.name
    jsonImportError.value = ''
    if (jsonSelectedCategoryId.value) handleJsonCategoryChange()
    else syncSelectedCategoryFromJson()
  } catch {
    jsonImportError.value = 'خواندن فایل JSON انجام نشد. دوباره تلاش کنید.'
  }
}

const isJsonObject = (value: unknown): value is Record<string, any> => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
)

const handleJsonCategoryChange = () => {
  jsonImportError.value = ''
  try {
    const product = JSON.parse(jsonText.value)
    if (!isJsonObject(product)) return
    product.category_id = productCategoryOptions.value.find(category => category.value === jsonSelectedCategoryId.value)?.id ?? ''
    jsonText.value = JSON.stringify(product, null, 2)
  } catch {
    // The selected category will be included when the sample template is loaded.
  }
}

const syncSelectedCategoryFromJson = () => {
  try {
    const product = JSON.parse(jsonText.value)
    if (!isJsonObject(product) || product.category_id == null) return
    const option = productCategoryOptions.value.find(category => String(category.id) === String(product.category_id))
    jsonSelectedCategoryId.value = option?.value || ''
  } catch {
    // Keep the current selection while the JSON is incomplete or invalid.
  }
}

const handleJsonTextInput = () => {
  jsonImportError.value = ''
  syncSelectedCategoryFromJson()
}

const validateStringFields = (value: unknown, path: string, fields: string[], requiredAny: string[]) => {
  if (!Array.isArray(value)) {
    jsonImportError.value = `${path} باید آرایه باشد.`
    return false
  }

  const invalidIndex = value.findIndex(item => (
    !isJsonObject(item)
    || fields.some(field => typeof item[field] !== 'string')
    || !requiredAny.some(field => typeof item[field] === 'string' && item[field].trim())
  ))
  if (invalidIndex !== -1) {
    jsonImportError.value = `ساختار آیتم شماره ${invalidIndex + 1} در ${path} صحیح نیست. کلیدهای ${fields.join(', ')} الزامی هستند و حداقل یکی از ${requiredAny.join('، ')} باید مقدار داشته باشد.`
    return false
  }

  return true
}

const validateFeatures = (value: unknown, path: string) => {
  if (!Array.isArray(value)) {
    jsonImportError.value = `${path} باید آرایه باشد.`
    return false
  }

  const invalidIndex = value.findIndex(item => (
    !isJsonObject(item)
    || Object.keys(item).length === 0
    || Object.entries(item).some(([key, featureValue]) => !key.trim() || typeof featureValue !== 'string' || !featureValue.trim())
  ))
  if (invalidIndex !== -1) {
    jsonImportError.value = `هر آیتم در ${path} باید یک یا چند کلید ویژگی با مقدار متنی داشته باشد.`
    return false
  }

  return true
}

const parseJsonProduct = (): Record<string, any> | null => {
  jsonImportError.value = ''

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText.value)
  } catch (err) {
    jsonImportError.value = `ساختار JSON معتبر نیست: ${(err as Error).message}`
    return null
  }

  if (!isJsonObject(parsed)) {
    jsonImportError.value = 'JSON باید یک شیء محصول باشد، نه آرایه یا مقدار تکی.'
    return null
  }

  const product = parsed
  if (typeof product.category_id !== 'string' && typeof product.category_id !== 'number') {
    jsonImportError.value = 'فیلد category_id برای انتخاب دسته‌بندی محصول الزامی است.'
    return null
  }
  if (typeof product.sku !== 'string' || !product.sku.trim()) {
    jsonImportError.value = 'فیلد sku الزامی است.'
    return null
  }
  if (typeof product.name !== 'string' || !product.name.trim()) {
    jsonImportError.value = 'فیلد name الزامی است.'
    return null
  }
  if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0) {
    jsonImportError.value = 'فیلد price باید یک عدد صفر یا بزرگ‌تر باشد.'
    return null
  }
  if (typeof product.stock_quantity !== 'number' || !Number.isFinite(product.stock_quantity) || product.stock_quantity < 0) {
    jsonImportError.value = 'فیلد stock_quantity باید یک عدد صفر یا بزرگ‌تر باشد.'
    return null
  }
  if (!isJsonObject(product.short_description)
    || typeof product.short_description.name !== 'string'
    || !product.short_description.name.trim()
    || typeof product.short_description.name_fa !== 'string'
    || !product.short_description.name_fa.trim()) {
    jsonImportError.value = 'فیلدهای short_description.name و short_description.name_fa الزامی هستند.'
    return null
  }
  if (!Array.isArray(product.short_description.images)) {
    jsonImportError.value = 'short_description.images باید آرایه‌ای از تصاویر محصول باشد.'
    return null
  }
  const invalidImageIndex = product.short_description.images.findIndex((image: unknown) => (
    !isJsonObject(image)
    || typeof image.image_url !== 'string'
    || !image.image_url.trim()
    || (image.media_asset_id != null && typeof image.media_asset_id !== 'string')
    || (image.is_primary != null && typeof image.is_primary !== 'boolean')
    || (image.sort_order != null && typeof image.sort_order !== 'number')
  ))
  if (invalidImageIndex !== -1) {
    jsonImportError.value = `ساختار تصویر شماره ${invalidImageIndex + 1} در short_description.images صحیح نیست.`
    return null
  }
  if (!validateFeatures(product.short_description.features, 'short_description.features')
    || !validateFeatures(product.short_description.features_fa, 'short_description.features_fa')) return null
  if (!isJsonObject(product.long_description)) {
    jsonImportError.value = 'فیلد long_description باید یک شیء شامل اطلاعات تکمیلی محصول باشد.'
    return null
  }
  if (!validateStringFields(product.long_description.applications, 'long_description.applications', ['title', 'title_fa', 'icon', 'description', 'description_fa'], ['title', 'title_fa'])
    || !validateStringFields(product.long_description.specifications, 'long_description.specifications', ['name', 'name_fa', 'description', 'description_fa'], ['name', 'name_fa'])
    || !validateStringFields(product.long_description.explanation, 'long_description.explanation', ['title', 'title_fa', 'image', 'description', 'description_fa'], ['title', 'title_fa'])) return null
  if (!Array.isArray(product.long_description.faq)) {
    jsonImportError.value = 'long_description.faq باید آرایه باشد.'
    return null
  }
  const invalidFaqIndex = product.long_description.faq.findIndex((faq: unknown) => (
    !isJsonObject(faq)
    || !isJsonObject(faq.title)
    || typeof faq.title.en !== 'string'
    || typeof faq.title.fa !== 'string'
    || !isJsonObject(faq.description)
    || typeof faq.description.en !== 'string'
    || typeof faq.description.fa !== 'string'
    || (!faq.title.en.trim() && !faq.title.fa.trim())
  ))
  if (invalidFaqIndex !== -1) {
    jsonImportError.value = `ساختار پرسش شماره ${invalidFaqIndex + 1} در long_description.faq صحیح نیست.`
    return null
  }

  return product
}

const submitJsonProduct = async () => {
  if (jsonImportSubmitting.value) return

  const productData = parseJsonProduct()
  if (!productData) return

  const target = parentCategories.value
    .map(parent => ({
      parent,
      child: parent.children.find(child => String(child.id) === String(productData.category_id))
    }))
    .find(item => item.child)

  if (!target?.child) {
    jsonImportError.value = 'category_id با هیچ‌یک از زیردسته‌های محصول موجود در داشبورد مطابقت ندارد.'
    return
  }

  jsonImportSubmitting.value = true
  jsonImportError.value = ''
  try {
    const response = await $fetch<any>('/api/products', {
      method: 'POST',
      body: productData
    })

    if (response?.success === false) {
      throw new Error(response.message || 'API محصول را ثبت نکرد.')
    }

    const createdProduct = isJsonObject(response?.data) ? response.data as ProductItem : response as ProductItem
    target.parent.expanded = true
    target.child.expanded = true
    target.child.productsLoaded = true

    if (createdProduct?.slug) {
      const products = target.child.products || []
      const exists = products.some(item => (
        (createdProduct.id != null && String(item.id) === String(createdProduct.id))
        || item.slug === createdProduct.slug
      ))
      if (!exists) target.child.products = [createdProduct, ...products].sort(compareProductOrder)
    }

    try {
      const latestResponse = await $fetch<{ data?: ProductItem[] }>('/api/products', {
        query: { category: target.child.slug }
      })
      if (Array.isArray(latestResponse?.data)) {
        target.child.products = [...latestResponse.data].sort(compareProductOrder)
      }
    } catch (refreshError) {
      console.error('Could not refresh the product category after JSON import:', refreshError)
    }

    jsonImportOpen.value = false
    await nextTick()
    jsonImportTrigger.value?.focus()
    toast.success('محصول با موفقیت از JSON ثبت شد.')
  } catch (err) {
    console.error('JSON product import failed:', err)
    const error = err as { data?: { statusMessage?: string; message?: string }; statusMessage?: string; message?: string }
    jsonImportError.value = error.data?.statusMessage || error.data?.message || error.statusMessage || error.message || 'ثبت محصول انجام نشد.'
  } finally {
    jsonImportSubmitting.value = false
  }
}

// Unified data loading sequence handles auth check first, then drops straight into the collection pipeline
const loadDashboardData = async () => {
  loading.value = true
  fetchError.value = false
  try {
    // 1. Session verification check
    await $fetch('/api/dashboard/stats', { method: 'GET' })
    
    // 2. Fetch structural tree data
    const response = await $fetch<{ success: boolean; data: CategoryNode[] }>('/api/categories', { method: 'GET' })
    if (response?.success && response.data) {
      rawCategories.value = response.data
      if (import.meta.client) restoreExpansionState()
    }
  } catch (err) {
    console.error('[Dashboard Products Resource Load Failed]:', err)
    fetchError.value = true
  } finally {
    loading.value = false
  }
}

const parentCategories = computed<UiParentCategory[]>(() => {
  if (!rawCategories.value.length) return []
  return reactive([...rawCategories.value]
    .filter(cat => !cat.parent_id && cat.slug !== 'blog') 
    .map(parent => ({
      ...parent,
      expanded: false,
      children: [...(parent.children || [])]
        .filter(child => child.slug !== 'blog') 
        .map(child => ({
          ...child,
          expanded: false,
          products: null,
          productsLoaded: false,
          productsLoading: false
        }))
        .sort(compareOrder)
    }))
    .sort(compareOrder))
})

const productCategoryOptions = computed(() => parentCategories.value.flatMap(parent => (
  parent.children.map(child => ({
    id: child.id,
    value: String(child.id),
    label: `${parent.name} / ${child.name}`
  }))
)))

watch(
  () => ({
    parents: parentCategories.value.filter(parent => parent.expanded).map(parent => parent.slug),
    children: parentCategories.value.flatMap(parent => parent.children
      .filter(child => child.expanded)
      .map(child => `${parent.slug}/${child.slug}`))
  }),
  (state) => {
    if (!import.meta.client || !expansionPersistenceReady.value) return

    try {
      localStorage.setItem(expansionStorageKey, JSON.stringify(state))
    } catch (err) {
      console.warn('Could not save expanded product categories:', err)
    }
  }
)

const handleEditProduct = (slug: string) => {
  navigateTo(`/dashboard/products/${encodeURIComponent(slug)}`)
}

const handleDuplicateProduct = async ({ product, categorySlug }: ProductCategoryAction) => {
  const confirmed = await confirm({
    title: 'کپی محصول',
    message: 'آیا از کپی کردن این محصول اطمینان دارید؟',
    confirmLabel: 'کپی محصول',
    variant: 'primary'
  })
  if (!confirmed) return

  const sourceCategory = parentCategories.value
    .flatMap(parent => parent.children)
    .find(child => child.slug === categorySlug)

  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `/api/products/duplicate/${encodeURIComponent(product.slug)}`,
      { method: 'POST' }
    )

    if (response?.success && response.data) {
      const newProduct = response.data as ProductItem & { category_slug?: string }
      const targetCategory = sourceCategory ?? parentCategories.value
        .flatMap(parent => parent.children)
        .find(child => (
          (!!newProduct.category_slug && child.slug === newProduct.category_slug)
          || (newProduct.category_id != null && String(child.id) === String(newProduct.category_id))
        ))

      if (targetCategory) {
        const currentProducts = targetCategory.products || []
        const isAlreadyListed = (products: ProductItem[]) => newProduct.id != null
          && products.some(product => String(product.id) === String(newProduct.id))

        if (!isAlreadyListed(currentProducts)) {
          targetCategory.products = [newProduct, ...currentProducts]
        }
        targetCategory.productsLoaded = true

        try {
          const latestResponse = await $fetch<{ data?: ProductItem[] }>('/api/products', {
            query: { category: targetCategory.slug }
          })

          if (Array.isArray(latestResponse?.data)) {
            const latestProducts = [...latestResponse.data]
            if (!isAlreadyListed(latestProducts)) latestProducts.unshift(newProduct)
            targetCategory.products = latestProducts.sort(compareProductOrder)
          }
        } catch (refreshError) {
          console.error('Could not refresh the product category after duplication:', refreshError)
        }
      }
      toast.success('محصول با موفقیت کپی شد.')
    }
  } catch (err) {
    console.error('Duplication flow failed:', err)
    toast.error('خطا در کپی برداری محصول.')
  }
}

const handleProductRemoval = async ({ product, categorySlug }: ProductCategoryAction) => {
  const productName = product.short_description?.name_fa || product.name || product.slug
  const confirmed = await confirm({
    title: 'حذف محصول',
    message: `آیا از حذف محصول «${productName}» اطمینان دارید؟`,
    confirmLabel: 'حذف محصول',
    variant: 'danger'
  })
  if (!confirmed) return

  try {
    await $fetch(`/api/products/${encodeURIComponent(product.slug)}`, {
      method: 'DELETE'
    })

    const targetCategory = parentCategories.value
      .flatMap(parent => parent.children)
      .find(child => child.slug === categorySlug)

    if (targetCategory) {
      try {
        const latestResponse = await $fetch<{ data?: ProductItem[] }>('/api/products', {
          query: { category: targetCategory.slug }
        })

        if (Array.isArray(latestResponse?.data)) {
          targetCategory.products = [...latestResponse.data].sort(compareProductOrder)
          targetCategory.productsLoaded = true
        } else {
          throw new Error('Product list refresh returned no product list.')
        }
      } catch (refreshError) {
        console.error('Could not refresh the product category after deletion:', refreshError)
        const products = targetCategory.products || []
        const productIndex = product.id != null
          ? products.findIndex(item => String(item.id) === String(product.id))
          : products.findIndex(item => item.slug === product.slug)
        if (productIndex !== -1) {
          targetCategory.products = products.filter((_, index) => index !== productIndex)
        }
      }
    }
    toast.success('محصول با موفقیت حذف شد.')
  } catch (err) {
    console.error('Delete target execution failed:', err)
    toast.error('خطا در حذف محصول.')
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>
