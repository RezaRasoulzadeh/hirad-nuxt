<template>
  <section ref="sectionRef" class="relative w-full min-h-[90vh] overflow-hidden bg-base-100">
    <div class="flex flex-col md:flex-row md:items-stretch">
      <HeroTextColumn 
        :meta-title="page?.meta_title ?? ''"
        :gallery="gallery"
        :active-slide="activeSlide"
        :items="items"
        :mask-style="maskStyle"
        @select-slide="goToSlide"
      />
      <HeroHotspotImage 
        :items="items"
        :hotspots="hotspots"
        :mask-style="maskStyle"
      />
    </div>

    <div 
      @click="scrollDown"
      class="hidden xl:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-30 cursor-pointer pointer-events-auto select-none group"
    >
      <span class="text-[10px] font-sans font-bold tracking-[0.125em] text-base-content/50 uppercase transition-colors group-hover:text-base-content/70">
        Scroll
      </span>
      <div class="relative w-6 h-10 rounded-3xl border-2 border-base-content/30 flex items-start justify-center pt-2 group-hover:border-base-content/50 transition-colors">
        <div class="w-1 h-2.5 bg-primary rounded-full animate-scroll-wheel"></div>
      </div>
      <ArrowDown class="size-3.5 text-base-content/40 transition-all group-hover:translate-y-0.5 group-hover:text-base-content/60" />
    </div>

    <div class="xl:hidden w-full px-4 border-t border-base-300">
      <NuxtLink
        v-for="item in items"
        :key="item.url ?? ''"
        :to="item.url ?? '/'"
        class="group flex items-center gap-4 px-6 py-4 border-b border-base-300 last:border-b-0 transition-colors duration-200 hover:bg-primary/5"
      >
        <div class="icon-mask size-10 shrink-0 bg-base-content/30 group-hover:bg-primary transition-colors duration-200" :style="maskStyle(item.icon ?? '')" />
        <div class="flex flex-col gap-0.5 min-w-0">
          <span class="text-base font-bold text-base-content group-hover:text-primary transition-colors duration-200">
            {{ (item.title_fa ?? '').split('|')[0]?.trim() ?? '' }} | {{ (item.meta_title ?? '').split('|')[0]?.trim() ?? '' }}
          </span>
          <span class="text-sm text-base-content/40 truncate">{{ item.sub_title_fa ?? '' }}</span>
        </div>
        <ChevronLeft class="size-5 text-base-content/20 group-hover:text-primary transition-colors duration-200 mr-auto shrink-0" />
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ArrowDown } from 'lucide-vue-next'
import type { HomePage } from '~/composables/useHomePage'
import { useCategories } from '~/composables/useCategories'
import HeroTextColumn from './HeroTextColumn.vue'
import HeroHotspotImage from './HeroHotspotImage.vue'

const props = defineProps<{ page: HomePage | null }>()
const config = useRuntimeConfig()
const baseUrl = config?.public?.apiBase ?? 'http://localhost:3000/api'

const { fetchCategories, productCategories } = useCategories()

const sectionRef = ref<HTMLElement | null>(null)
const activeSlide = ref(0)
let slideTimer: ReturnType<typeof setInterval> | null = null

const items = computed(() => {
  return productCategories.value.map(cat => ({
    url: `/categories/${cat.slug}`,
    icon: cat.image_url ?? '',
    title_fa: cat.name,
    meta_title: cat.meta_title,
    sub_title_fa: cat.description ?? ''
  }))
})

const gallery = computed(() => props.page?.content?.image_gallery ?? [])

const scrollDown = () => {
  if (sectionRef.value) {
    const nextElement = sectionRef.value.nextElementSibling
    if (nextElement) {
      nextElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({
        top: sectionRef.value.offsetHeight,
        behavior: 'smooth'
      })
    }
  }
}

const goToSlide = (i: number) => {
  activeSlide.value = i
  resetTimer()
}

const nextSlide = () => {
  if (gallery.value.length > 0) {
    activeSlide.value = (activeSlide.value + 1) % gallery.value.length
  }
}

const resetTimer = () => {
  if (slideTimer) clearInterval(slideTimer)
  slideTimer = setInterval(nextSlide, 4000)
}

onMounted(async () => {
  await fetchCategories()
  if (gallery.value.length > 1) resetTimer()
})

onUnmounted(() => {
  if (slideTimer) clearInterval(slideTimer)
})

const maskStyle = (url: string): Record<string, string> => {
  if (!url) return {}
  const src = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  return {
    maskImage: `url(${src})`,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskSize: 'contain',
  }
}

const hotspots = [
  { top: '28%', left: '60%', cardAlign: 'card-left' },
  { top: '55%', left: '43%', cardAlign: 'card-right' },
  { top: '68%', left: '26%', cardAlign: 'card-left' },
  { top: '38%', left: '52%', cardAlign: 'card-left' },
]
</script>

<style scoped>
@keyframes scroll-wheel {
  0% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(12px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
}
.animate-scroll-wheel {
  animation: scroll-wheel 2s infinite ease-in-out;
}
</style>