<template>
  <div class="flex flex-col gap-4 w-full select-none" dir="rtl">
    <div 
      @click="isViewerOpen = true"
      class="w-full aspect-square md:aspect-4/3 rounded-3xl overflow-hidden bg-base-200 border border-base-300 relative group cursor-zoom-in shadow-xs"
    >
      <img 
        :src="activeImageUrl" 
        alt="Product Image" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
      />

      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div class="p-3 bg-base-100/20 backdrop-blur-md rounded-full text-white border border-white/20">
          <Maximize2 class="size-6" />
        </div>
      </div>

      <template v-if="allImages.length > 1">
        <button 
          @click.stop="prevImage"
          class="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-base-100/70 backdrop-blur-md text-base-content border border-base-200/40 hover:bg-base-100 shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
        >
          <ChevronRight class="size-5" />
        </button>
        <button 
          @click.stop="nextImage"
          class="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-base-100/70 backdrop-blur-md text-base-content border border-base-200/40 hover:bg-base-100 shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
        >
          <ChevronLeft class="size-5" />
        </button>
      </template>
    </div>

    <div v-if="allImages.length > 1" class="relative group/thumbs">
      <button 
        v-if="canScrollStart" 
        @click="scrollThumbs('start')"
        class="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-xl bg-base-100/90 backdrop-blur-sm border border-base-200 shadow-sm hover:bg-base-100 transition-all opacity-0 group-hover/thumbs:opacity-100 cursor-pointer"
      >
        <ChevronRight class="size-4" />
      </button>

      <button 
        v-if="canScrollEnd" 
        @click="scrollThumbs('end')"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-xl bg-base-100/90 backdrop-blur-sm border border-base-200 shadow-sm hover:bg-base-100 transition-all opacity-0 group-hover/thumbs:opacity-100 cursor-pointer"
      >
        <ChevronLeft class="size-4" />
      </button>

      <div 
        ref="thumbsContainer" 
        @scroll="onThumbsScroll"
        class="w-full overflow-x-auto overflow-y-hidden py-2 -my-2 scrollbar-none"
      >
        <div class="flex items-center gap-2 px-1">
          <button 
            v-for="(imgUrl, index) in allImages" 
            :key="index" 
            @click="setActiveImage(index, imgUrl)"
            class="w-28 aspect-4/3 rounded-xl overflow-hidden shrink-0 border transition-all duration-300 bg-base-200 origin-center hover:scale-105 cursor-pointer"
            :class="currentIndex === index
              ? 'border-primary ring-4 ring-primary/10 shadow-md scale-95 opacity-100'
              : 'border-base-300 opacity-70 hover:opacity-100'"
          >
            <img :src="imgUrl" alt="Thumbnail" class="w-full h-full object-cover pointer-events-none" />
          </button>
        </div>
      </div>
    </div>

    <FullscreenImageViewer 
      :is-open="isViewerOpen" 
      :images="allImages" 
      :initial-index="currentIndex"
      @close="isViewerOpen = false" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRuntimeConfig } from '#app'
import { Maximize2, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import type { ProductImage } from '~/composables/useProductList'
import placeholderImg from '~/assets/placeholder.png'
import FullscreenImageViewer from '@/components/shared/FullScreenImage.vue'

const props = defineProps<{
  images: ProductImage[]
  activeImage: string | null
}>()

const emit = defineEmits<{
  (e: 'update:activeImage', url: string | null): void
}>()

const config = useRuntimeConfig()
const isViewerOpen = ref(false)
const thumbsContainer = ref<HTMLElement | null>(null)
const canScrollStart = ref(false)
const canScrollEnd = ref(false)

const allImages = computed<string[]>(() => {
  if (!props.images || props.images.length === 0) return [placeholderImg]
  
  const baseUrl = config.public.apiBase || ''
  return props.images.map(img => {
    const path = img.image_url || ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    return `${baseUrl}${path}`
  })
})

const currentIndex = computed(() => {
  if (!props.activeImage) return 0
  const idx = allImages.value.findIndex(url => url.endsWith(props.activeImage!))
  return idx === -1 ? 0 : idx
})

const activeImageUrl = computed(() => {
  return allImages.value[currentIndex.value] || placeholderImg
})

const setActiveImage = (index: number, fullUrl: string) => {
  const originalPath = props.images[index]?.image_url || fullUrl
  emit('update:activeImage', originalPath)
}

const nextImage = () => {
  if (!allImages.value.length) return
  const nextIdx = (currentIndex.value + 1) % allImages.value.length
  setActiveImage(nextIdx, allImages.value[nextIdx]!)
}

const prevImage = () => {
  if (!allImages.value.length) return
  const prevIdx = (currentIndex.value - 1 + allImages.value.length) % allImages.value.length
  setActiveImage(prevIdx, allImages.value[prevIdx]!)
}

const onThumbsScroll = () => {
  const el = thumbsContainer.value
  if (!el) return
  const sl = el.scrollLeft
  canScrollStart.value = sl < -4
  canScrollEnd.value = sl > -(el.scrollWidth - el.clientWidth - 4)
}

const scrollThumbs = (dir: 'start' | 'end') => {
  const el = thumbsContainer.value
  if (!el) return
  el.scrollBy({ left: dir === 'start' ? 200 : -200, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(() => {
    const el = thumbsContainer.value
    if (!el) return
    onThumbsScroll()
    canScrollEnd.value = el.scrollWidth > el.clientWidth
  })
})

watch(allImages, () => nextTick(onThumbsScroll), { deep: true })
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>