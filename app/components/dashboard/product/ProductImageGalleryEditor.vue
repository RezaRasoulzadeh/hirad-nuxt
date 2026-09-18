<template>
  <div class="w-full">
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      
      <!-- Primary Image Render Block -->
      <div v-if="primaryImage" class="relative group aspect-square rounded-xl border-2 border-primary overflow-hidden shadow-sm bg-base-100">
        <img :src="getThumbnailUrl(primaryImage)" alt="Primary asset snapshot" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-base-content/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          <span class="badge badge-primary badge-sm font-bold text-[10px]">تصویر اصلی</span>
        </div>
        <button 
          type="button"
          @click.stop="onRemovePrimary"
          class="btn btn-circle btn-error btn-xs absolute top-1.5 right-1.5 shadow-md"
        >
          <Trash class="w-3 h-3 text-white" />
        </button>
      </div>

      <!-- Secondary Ordered Image Loop Tiles -->
      <div 
        v-for="(img, index) in secondaryImages"
        :key="getImageKey(img, index)"
        class="relative group aspect-square rounded-xl border border-base-200 overflow-hidden shadow-sm bg-base-100 transition-all hover:border-neutral/40"
      >
        <img :src="getThumbnailUrl(img)" alt="Gallery node snapshot" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-base-content/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            type="button"
            @click.stop="onSetPrimary(img)"
            class="btn btn-xs btn-neutral rounded-lg font-bold text-[10px]"
          >
            تنظیم به عنوان اصلی
          </button>
        </div>
        <button 
          type="button"
          @click.stop="onRemoveImage(img)"
          class="btn btn-circle btn-error btn-xs absolute top-1.5 right-1.5 shadow-md"
        >
          <Trash class="w-3 h-3 text-white" />
        </button>
      </div>

      <!-- Add Image Modal Button Box Trigger -->
      <button 
        type="button" 
        @click.stop.prevent="$emit('open-modal')"
        class="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl text-base-content/40 hover:border-primary hover:text-primary transition-all bg-base-100/50"
      >
        <FilePlus class="w-6 h-6 mb-1" />
        <span class="text-[11px] font-bold">افزودن تصویر</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FilePlus, Trash } from 'lucide-vue-next'
import { useRuntimeConfig } from '#imports'
import type { ProductImage } from '~/composables/useProductList';
import { useDashboardConfirm } from '~/composables/useDashboardConfirm'


const props = defineProps<{
  images: ProductImage[]
}>()

const emit = defineEmits<{
  'set-primary': [image: ProductImage]
  'remove-image': [image: ProductImage]
  'open-modal': []
}>()

const config = useRuntimeConfig()
const confirm = useDashboardConfirm()
const getThumbnailUrl = (img: ProductImage) => {
  const base = config.public.apiBase || '/api'
  return `${base}${img.image_url}`
}

const primaryImage = computed(() => props.images?.find(img => img.is_primary))
const secondaryImages = computed(() => {
  if (!props.images) return []
  return props.images
    .filter(img => !img.is_primary)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
})

const getImageKey = (image: ProductImage, index: number) => (
  image.media_asset_id || `${image.image_url}-${image.sort_order ?? index}-${index}`
)

const onRemoveImage = async (image: ProductImage) => {
  const confirmed = await confirm({
    title: 'حذف تصویر',
    message: 'آیا از حذف این تصویر اطمینان دارید؟',
    confirmLabel: 'حذف تصویر',
    variant: 'danger'
  })
  if (confirmed) {
    emit('remove-image', image)
  }
}

const onRemovePrimary = async () => {
  const image = primaryImage.value
  if (!image) return
  await onRemoveImage(image)
}

const onSetPrimary = (image: ProductImage) => {
  emit('set-primary', image)
}
</script>
