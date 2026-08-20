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
          class="size-6 object-contain transition-all"
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

      <TransitionGroup v-else-if="localProducts.length" name="reorder" tag="div" class="space-y-2">
        <div 
          v-for="(product, index) in localProducts"
          :key="product.id"
          class="transition-all duration-200" @dragover.prevent="setDropIndex($event, index)"
          @drop.stop.prevent="dropProduct"
        >
          <div v-if="dropIndex === index" class="mb-2 h-14 rounded-xl border-2 border-dashed border-primary/55 bg-primary/8" />
          <div draggable="true" @dragstart.stop="draggedIndex = index" @dragend="clearDrag"
            class="flex items-center justify-between rounded-xl border border-base-200 bg-base-100 p-3 shadow-sm transition-all hover:border-base-300"
            :class="{ 'opacity-45 scale-[0.99]': draggedIndex === index, 'ring-2 ring-primary/30 bg-primary/5': highlightedId === product.id }">
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
            <span class="cursor-grab px-1 text-base-content/35 active:cursor-grabbing" title="برای جابه‌جایی بکشید">
              <GripVertical class="size-4.5" />
            </span>
            <button class="btn btn-square btn-sm btn-ghost" :disabled="index === 0" title="انتقال به بالا"
              @click.stop="moveProduct(index, -1)"><ArrowUp class="size-4" /></button>
            <button class="btn btn-square btn-sm btn-ghost" :disabled="index === localProducts.length - 1"
              title="انتقال به پایین" @click.stop="moveProduct(index, 1)"><ArrowDown class="size-4" /></button>
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
          <div v-if="index === localProducts.length - 1 && dropIndex === localProducts.length"
            class="mt-2 h-14 rounded-xl border-2 border-dashed border-primary/55 bg-primary/8" />
        </div>
      </TransitionGroup>

      <div v-else class="text-center text-xs text-base-content/40 py-6 bg-base-100 rounded-xl border border-dashed border-base-200">
        هیچ محصولی در این دسته‌بندی یافت نشد.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ArrowDown, ArrowUp, ChevronRight, ChevronDown, Copy, GripVertical, PenSquare, Trash } from 'lucide-vue-next'
import { useRuntimeConfig } from '#imports'
import type { ProductItem } from '~/types/productItem'
import type { CategoryItem } from '~/types/categoryItem'
import { useToast } from '~/composables/useToast'
import { getApiErrorMessage } from '~/utils/apiFeedback'

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
const toast = useToast()
const localProducts = ref<ProductItem[]>([])
const draggedIndex = ref<number | null>(null)
const dropIndex = ref<number | null>(null)
const highlightedId = ref<string | null>(null)

watch(() => props.childCategory.products, (products) => {
  localProducts.value = [...(products || [])].sort((a, b) => {
    if (a.sort_order == null && b.sort_order == null) return (a.name || '').localeCompare(b.name || '', 'fa')
    if (a.sort_order == null) return 1
    if (b.sort_order == null) return -1
    return a.sort_order - b.sort_order
  })
}, { immediate: true, deep: true })

const persistOrder = async (previous: ProductItem[]) => {
  localProducts.value.forEach((item, index) => { item.sort_order = index })
  try {
    await $fetch('/api/products/reorder', {
      method: 'PUT',
      body: { category_id: props.childCategory.id, ids: localProducts.value.map(item => item.id) },
    })
  } catch (error) {
    localProducts.value = previous
    toast.error(getApiErrorMessage(error, 'ذخیره ترتیب محصولات انجام نشد.'))
  }
}

const moveProduct = (index: number, offset: number) => {
  const previous = [...localProducts.value]
  const target = index + offset
  if (target < 0 || target >= localProducts.value.length) return
  const [item] = localProducts.value.splice(index, 1)
  if (!item) return
  localProducts.value.splice(target, 0, item)
  highlight(item.id)
  persistOrder(previous)
}

const setDropIndex = (event: DragEvent, index: number) => {
  if (draggedIndex.value == null) return
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  dropIndex.value = event.clientY < bounds.top + bounds.height / 2 ? index : index + 1
}

const clearDrag = () => {
  draggedIndex.value = null
  dropIndex.value = null
}

const dropProduct = () => {
  const previous = [...localProducts.value]
  const sourceIndex = draggedIndex.value
  let targetIndex = dropIndex.value
  clearDrag()
  if (sourceIndex == null || targetIndex == null) return
  const [item] = localProducts.value.splice(sourceIndex, 1)
  if (!item) return
  if (sourceIndex < targetIndex) targetIndex -= 1
  if (sourceIndex === targetIndex) return
  localProducts.value.splice(targetIndex, 0, item)
  highlight(item.id)
  persistOrder(previous)
}

const highlight = (id: string) => {
  highlightedId.value = id
  window.setTimeout(() => { if (highlightedId.value === id) highlightedId.value = null }, 700)
}

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

<style scoped>
.reorder-move { transition: transform 280ms ease; }
</style>
