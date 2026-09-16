<template>
  <section v-if="brands.length" class="w-full bg-[url('~/assets/Brand-section-bg.jpg')] bg-cover bg-top" dir="rtl">
    <div class="relative mx-auto w-full max-w-[1880px]">
      <AnimatedCircuitBorder side="left" :bottom-y="670" />
      <div class="relative z-20 px-4 py-12 md:px-12 md:py-16">
      <div class="mb-8 flex flex-col items-center text-center">
        <span class="mb-2 text-xs font-bold tracking-widest text-primary">BRANDS</span>
        <h2 class="text-2xl font-black text-base-content md:text-4xl">همکاری با برندهای معتبر جهانی</h2>
        <span class="mt-4 h-1 w-10 rounded-full bg-primary" />
        <p class="mt-4 text-sm leading-8 text-base-content/70 md:text-base">
          هیراد با همکاری تولیدکنندگان پیشرو و معتبر جهانی، تجهیزات صنعتی با کیفیت بالا را برای پروژه‌های نفت، گاز، پتروشیمی، نیروگاهی و صنایع فرآیندی تأمین می‌کند.
        </p>
      </div>

      <div ref="brandsPanelRef" @keydown.esc="showAllBrands = false">
      <div class="rounded-3xl border border-base-300/70 bg-base-100/95 p-4 md:p-7">
        <div ref="brandsGridViewportRef" class="brands-grid-viewport" :style="{ maxHeight: brandsGridMaxHeight }">
        <div ref="brandsGridRef" :id="brandsGridId" class="brands-grid grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-10">
          <a v-for="brand in shuffledBrands" :key="`${brand.name}-${brand.logo_url}`"
            :href="brand.website_url || undefined" :target="brand.website_url ? '_blank' : undefined"
            :rel="brand.website_url ? 'noopener noreferrer' : undefined"
            class="group flex min-h-20 items-center justify-center rounded-xl border border-base-300 bg-base-100 p-4 text-center"
            :class="{ 'cursor-default': !brand.website_url }"
            :title="brand.name_fa || brand.name">
            <img :src="resolveAssetUrl(brand.logo_url)" :alt="brand.name_fa || brand.name"
              class="h-14 w-full object-contain opacity-65 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              loading="lazy">
          </a>
        </div>
        </div>

      </div>

      <div v-if="brands.length > 2" class="mt-6 flex items-center justify-center gap-3 text-sm text-base-content/70 md:text-base">
        <span class="h-px w-6 shrink-0 bg-primary/70 sm:w-10" aria-hidden="true" />
        <button type="button" :aria-expanded="showAllBrands" :aria-controls="brandsGridId"
          class="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-2 text-center transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          @click.stop="showAllBrands = !showAllBrands">
          <span v-if="showAllBrands" class="pointer-events-none">نمایش کمتر برندها</span>
          <span v-else class="pointer-events-none">و بیش از <strong class="text-xl text-primary" dir="ltr">40</strong> برند معتبر دیگر ...</span>
          <ChevronDown class="pointer-events-none size-4 shrink-0 transition-transform motion-reduce:transition-none"
            :class="{ 'rotate-180': showAllBrands }" aria-hidden="true" />
        </button>
        <span class="h-px w-6 shrink-0 bg-primary/70 sm:w-10" aria-hidden="true" />
      </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import AnimatedCircuitBorder from './AnimatedCircuitBorder.vue'
import type { HomeBrand } from '~/composables/useHomePage'

const props = defineProps<{ brands: HomeBrand[] }>()

const showAllBrands = ref(false)
const shuffledBrands = ref<HomeBrand[]>(props.brands)
const brandsPanelRef = ref<HTMLElement | null>(null)
const brandsGridViewportRef = ref<HTMLElement | null>(null)
const brandsGridRef = ref<HTMLElement | null>(null)
const brandsGridMaxHeight = ref('11.75rem')
const brandsGridId = useId()
let brandsGridResizeObserver: ResizeObserver | undefined
let hasMounted = false

const shuffleBrands = (brands: HomeBrand[]) => {
  const shuffled = [...brands]

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }

  if (shuffled.length > 1 && shuffled.every((brand, index) => brand === brands[index])) {
    ;[shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]]
  }

  return shuffled
}

const updateBrandsGridHeight = () => {
  if (showAllBrands.value && brandsGridRef.value) {
    brandsGridMaxHeight.value = `${brandsGridRef.value.scrollHeight}px`
  }
}

const collapseOnOutsideClick = (event: MouseEvent) => {
  if (showAllBrands.value && event.target instanceof Node && !brandsPanelRef.value?.contains(event.target)) {
    showAllBrands.value = false
  }
}

onMounted(() => document.addEventListener('click', collapseOnOutsideClick))
onMounted(() => {
  hasMounted = true
  shuffledBrands.value = shuffleBrands(props.brands)

  if (typeof ResizeObserver !== 'undefined' && brandsGridRef.value) {
    brandsGridResizeObserver = new ResizeObserver(updateBrandsGridHeight)
    brandsGridResizeObserver.observe(brandsGridRef.value)
  }
})

watch(() => props.brands, (brands) => {
  shuffledBrands.value = hasMounted ? shuffleBrands(brands) : brands
}, { immediate: true })

watch(showAllBrands, async (expanded) => {
  await nextTick()
  brandsGridMaxHeight.value = expanded ? `${brandsGridRef.value?.scrollHeight ?? 0}px` : '11.75rem'
})

onBeforeUnmount(() => {
  document.removeEventListener('click', collapseOnOutsideClick)
  brandsGridResizeObserver?.disconnect()
})
</script>

<style scoped>
.brands-grid-viewport {
  overflow: hidden;
  transition: max-height 650ms cubic-bezier(0.22, 0.61, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  .brands-grid-viewport {
    transition: none;
  }
}
</style>
