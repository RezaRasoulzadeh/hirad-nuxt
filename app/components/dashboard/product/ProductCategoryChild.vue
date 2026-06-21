<template>
  <div class="bg-base-100 transition-colors">
    <div 
      @click="handleToggle"
      class="flex items-center justify-between p-4 pl-6 hover:bg-base-200/50 cursor-pointer select-none transition-colors"
    >
      <div class="flex items-center gap-3">
        <component :is="childCategory.expanded ? ChevronDown : ChevronRight" class="w-4 h-4 text-base-content/60" />

        <img 
          v-if="childCategory.image_url" 
          :src="getImageUrl(childCategory.image_url)" 
          :alt="childCategory.name || ''"
          class="size-6 object-contain transition-all 
          [:is([data-theme=dark],.dark)_&]:not-data-error:filter-[brightness(0)_invert(80%)]"
          loading="lazy"
        />

        <span class="font-semibold text-sm text-base-content">{{ childCategory.name }}</span>
        <span class="text-xs text-base-content/40 font-mono">({{ childCategory.meta_title || childCategory.slug }})</span>

        <span v-if="childCategory.products" class="badge badge-sm badge-ghost font-medium">
          {{ childCategory.products.length }} محصول
        </span>
        <span v-else-if="childCategory.expanded && !childCategory.productsLoaded" class="loading loading-spinner loading-xs text-primary"></span>
      </div>
    </div>

    <div v-if="childCategory.expanded" class="bg-base-200/30 px-6 pb-4 pt-1">
      <div v-if="!childCategory.productsLoaded" class="flex items-center justify-center gap-2 py-6 text-sm text-base-content/50">
        <span class="loading loading-spinner loading-sm text-primary"></span>
        در حال بارگذاری محصولات...
      </div>

      <div v-else-if="childCategory.products?.length" class="space-y-2">
        <div 
          v-for="product in childCategory.products" 
          :key="product.id"
          class="flex items-center justify-between p-3 bg-base-100 rounded-xl border border-base-200 hover:border-base-300 transition-all shadow-sm"
        >
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <p class="font-bold text-sm text-base-content">
                {{ product.short_description?.name_fa || product.name || 'محصول بدون نام' }}
              </p>
              <span 
                class="badge badge-sm font-bold border-none"
                :class="product.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'"
              >
                {{ product.is_active ? "منتشر شده" : "پیش‌نویس" }}
              </span>
            </div>
            <div class="text-xs font-mono text-base-content/40">{{ product.slug }}</div>
          </div>

          <div class="flex items-center gap-1.5">
            <div class="tooltip tooltip-top" data-tip="کپی محصول">
              <button 
                @click.stop="$emit('duplicate', product.slug)"
                class="btn btn-square btn-sm btn-ghost text-info hover:bg-info/10"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>

            <div class="tooltip tooltip-top" data-tip="ویرایش محصول">
              <button 
                @click.stop="$emit('edit', product.slug)"
                class="btn btn-square btn-sm btn-ghost text-base-content/70 hover:bg-base-content/10"
              >
                <PenSquare class="w-4 h-4" />
              </button>
            </div>

            <div class="tooltip tooltip-top" data-tip="حذف محصول">
              <button 
                @click.stop="$emit('remove-product', product.slug)"
                class="btn btn-square btn-sm btn-ghost text-error hover:bg-error/10"
              >
                <Trash class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-xs text-base-content/40 py-6 bg-base-100 rounded-xl border border-dashed border-base-200">
        هیچ محصولی در این دسته‌بندی یافت نشد.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, ChevronDown, PenSquare, Trash, Copy } from 'lucide-vue-next'
import { useRuntimeConfig } from '#imports'
import type { ProductItem } from '~/types/productItem'
import type { CategoryItem } from '~/types/categoryItem'

const emit = defineEmits(['toggle', 'fetch-products', 'edit', 'remove-product', 'duplicate'])

interface ChildCategory extends CategoryItem {
  products?: ProductItem[] | null
  productsLoaded?: boolean
  expanded?: boolean
}

const props = defineProps<{
  childCategory: ChildCategory
}>()

const config = useRuntimeConfig()

const getImageUrl = (urlPath: string) => {
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) {
    return urlPath
  }
  return `${config.public.apiBase}${urlPath}`
}

const handleToggle = () => {
  emit('toggle', props.childCategory.slug)

  if (!props.childCategory.productsLoaded) {
    emit('fetch-products', props.childCategory.slug)
  }
}
</script>