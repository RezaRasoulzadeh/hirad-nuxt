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

    <div v-if="status === 'pending'" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-20 rounded-xl bg-base-100 border border-base-200 animate-pulse"></div>
    </div>

    <div v-else-if="error" class="alert alert-error rounded-xl text-sm font-medium shadow-sm flex items-center justify-between">
      <span>{{ error.message || 'خطا در بارگذاری ساختار دسته‌بندی و محصولات.' }}</span>
      <button class="btn btn-sm btn-ghost text-error-content" @click="() => refresh()">تلاش مجدد</button>
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
import { computed } from 'vue'
import { navigateTo, useFetch } from '#imports'
import ParentCategoryGroup from '~/components/dashboard/product/ParentCategoryGroup.vue'
import type { CategoryItem } from '~/types/categoryItem'

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

interface ApiResponse {
  success: boolean
  data: CategoryNode[]
}

const { data: categoriesResponse, status, error, refresh } = await useFetch<ApiResponse>('/api/dashboard/categories', {
  lazy: true
})

const parentCategories = computed<UiParentCategory[]>(() => {
  if (!categoriesResponse.value?.data) return []
  return [...categoriesResponse.value.data]
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
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
})

const handleEditProduct = (slug: string) => {
  navigateTo(`/dashboard/products/${encodeURIComponent(slug)}`)
}

const handleDuplicateProduct = async (slug: string) => {
  const confirmed = window.confirm('آیا از کپی کردن این محصول اطمینان دارید؟')
  if (!confirmed) return

  try {
    const response = await $fetch<{ success: boolean; data: any }>(
      `/api/dashboard/products/duplicate/${encodeURIComponent(slug)}`,
      { method: 'POST' }
    )

    if (response?.success && response.data) {
      const newProduct = response.data

      for (const parent of parentCategories.value) {
        for (const child of parent.children) {
          if (child.slug === newProduct.category_slug || child.id === newProduct.category_id) {
            if (child.products) {
              child.products.unshift(newProduct)
            }
            break
          }
        }
      }
      alert('محصول با موفقیت کپی شد.')
    }
  } catch (err) {
    console.error('Duplication flow failed:', err)
    alert('خطا در کپی برداری محصول.')
  }
}

const handleProductRemoval = async (slug: string) => {
  const confirmed = window.confirm('آیا از حذف این محصول اطمینان دارید؟')
  if (!confirmed) return

  try {
    await $fetch(`/api/dashboard/products/${encodeURIComponent(slug)}`, {
      method: 'DELETE'
    })
    
    for (const parent of parentCategories.value) {
      for (const child of parent.children) {
        if (child.products) {
          child.products = child.products.filter(p => p.slug !== slug)
        }
      }
    }
  } catch (err) {
    console.error('Delete target execution failed:', err)
  }
}
</script>