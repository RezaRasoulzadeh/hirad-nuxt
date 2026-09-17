<template>
  <div class="w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">مدیریت محصولات</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">مشاهده، جستجو و تغییر ساختار محصولات بر اساس دسته‌بندی درختواره‌ای.</p>
      </div>
      <button
        @click="navigateTo('/dashboard/products/new')"
        class="btn btn-primary font-bold px-6 h-12 rounded-xl text-sm"
      >
        افزودن محصول جدید
      </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
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
          productsLoaded: false
        }))
        .sort(compareOrder)
    }))
    .sort(compareOrder))
})

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
