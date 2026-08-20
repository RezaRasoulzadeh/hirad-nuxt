<template>
  <section class="relative w-full overflow-visible bg-base-100" dir="rtl">
    <div ref="circuitFrameRef" class="relative mx-auto min-h-170 max-w-[1880px] overflow-visible px-5">
      <div class="pointer-events-none absolute inset-0 z-10 hidden md:block" aria-hidden="true">
        <svg class="absolute inset-0 size-full overflow-visible" viewBox="0 0 1000 700" fill="none"
          preserveAspectRatio="none">
          <path :d="`M500 30H${18 + topCornerOffset}L18 74V552L${18 + bottomCornerOffset} 610H215`"
            class="order-circuit-line" />
        </svg>
        <i class="absolute top-[calc(4.286%_-_0.3125rem)] left-[calc(50%_-_0.3125rem)] size-2.5 rounded-full bg-primary" />
        <span class="absolute top-[68%] left-[calc(1.8%_-_0.3125rem)] flex flex-col gap-2">
          <i v-for="dot in 3" :key="dot" class="size-2.5 rounded-full bg-primary" />
        </span>
        <i class="absolute top-[calc(87.143%_-_0.3125rem)] left-[calc(21.5%_-_0.3125rem)] size-2.5 rounded-full bg-primary" />
      </div>

      <div class="container relative z-20 mx-auto px-10 pt-16 pb-12 md:px-12 lg:px-16">
      <div class="mb-12 flex flex-col items-center text-center md:mb-16">
        <span class="mb-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
          {{ orderContent.eyebrow }}
        </span>
        <h2 class="text-3xl font-black tracking-tight text-base-content">
          {{ orderContent.title }}
        </h2>
        <div class="mt-4 h-1 w-12 rounded-full bg-primary opacity-80" />
      </div>

      <div class="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-3">
        <div class="absolute inset-x-0 top-36 z-0 hidden h-12 items-center lg:flex" aria-hidden="true" dir="ltr">
          <img src="~/assets/svg/left-end.svg" alt="" class="h-12 w-7 shrink-0">
          <template v-for="index in steps.length" :key="`pipe-${index}`">
            <img src="~/assets/svg/pipe-segment.svg" alt="" class="h-12 min-w-0 flex-1">
            <img v-if="index < steps.length" src="~/assets/svg/between-connector.svg" alt=""
              class="z-1 -mx-1.25 h-12 w-7 shrink-0">
          </template>
          <img src="~/assets/svg/right-end.svg" alt="" class="h-12 w-7 shrink-0">
        </div>

        <div v-for="(step, index) in steps" :key="step.id"
          class="relative z-1 flex flex-col items-center text-center">
          <div class="relative flex size-28 items-center justify-center rounded-full border border-base-300 bg-base-100 text-primary ring-8 ring-base-200/55">
            <img :src="resolveIcon(step.icon)" :alt="step.fa" class="size-12 object-contain" @error="usePlaceholder">
            <span class="absolute -top-3 -right-3 flex size-7 items-center justify-center rounded-full border border-primary bg-base-100 font-sans text-sm font-black text-primary pt-1">
              {{ step.id }}
            </span>
          </div>

          <img src="~/assets/svg/top-connector.svg" alt=""
            class="relative z-2 -mt-1 hidden h-15 w-10 object-contain lg:block" aria-hidden="true">

          <div class="relative mt-3 hidden h-14 border-s border-dashed border-base-content/25 lg:block" aria-hidden="true">
            <span class="absolute -bottom-1 -left-1 size-2 rounded-full bg-primary ring-2 ring-base-100" />
          </div>

          <div class="mt-5 flex max-w-60 flex-col items-center lg:mt-3">
            <h3 class="mb-1 text-lg font-black tracking-tight text-base-content">
              {{ step.fa }}
            </h3>
            <span class="mb-3 font-sans text-[10px] font-bold tracking-wider text-base-content/40 uppercase">
              {{ step.en }}
            </span>
            <p class="text-xs leading-7 font-medium text-base-content/60">
              {{ step.desc }}
            </p>
          </div>

          <div v-if="index < steps.length - 1" class="my-2 text-2xl text-primary/35 lg:hidden" aria-hidden="true">
            ↓
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCircuitGeometry } from '~/composables/useCircuitGeometry'
import { computed } from 'vue'
import type { HomePage } from '~/composables/useHomePage'
import placeholderImage from '~/assets/placeholder.png'

const { circuitFrameRef, topCornerOffset, bottomCornerOffset } = useCircuitGeometry()
const props = defineProps<{ page?: HomePage | null }>()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || '/api'

const defaultSteps = [
  {
    id: 1,
    fa: 'تماس اولیه',
    en: 'Contact',
    desc: 'ارتباط اولیه و طرح موضوع با کارشناسان هیراد',
  },
  {
    id: 2,
    fa: 'مشاوره فنی',
    en: 'Consultation',
    desc: 'بررسی دقیق قطعات، فیتینگ‌ها و فیلترهای درخواستی',
  },
  {
    id: 3,
    fa: 'صدور پیش‌فاکتور',
    en: 'Proforma Invoice',
    desc: 'شفاف‌سازی قیمت‌ها و مشخص کردن دقیق زمان تحویل',
  },
  {
    id: 4,
    fa: 'ثبت نهایی درخواست',
    en: 'Order Registration',
    desc: 'نهایی کردن سفارش صنعتی و آغاز فرآیند تامین یا تولید',
  },
  {
    id: 5,
    fa: 'بسته‌بندی و ارسال',
    en: 'Delivery',
    desc: 'بسته‌بندی استاندارد ایمن و ارسال به موقع تجهیزات مکانیکی',
  },
  {
    id: 6,
    fa: 'تضمین کیفیت',
    en: 'Warranty',
    desc: 'پشتیبانی فنی مهندسی و ارائه تاییدیه کنترل کیفیت نهایی',
  },
]

const orderContent = computed(() => {
  const saved = props.page?.content?.order_process
  return {
    eyebrow: saved?.eyebrow || 'Order Process',
    title: saved?.title || 'روند ثبت و تکمیل سفارش',
    steps: saved?.steps?.length
      ? saved.steps
      : defaultSteps.map(({ fa, en, desc }) => ({ title: fa, subtitle: en, description: desc, icon: '' })),
  }
})

const steps = computed(() => orderContent.value.steps.map((step, index) => ({
  id: index + 1,
  fa: step.title,
  en: step.subtitle,
  desc: step.description,
  icon: step.icon,
})))

const resolveIcon = (value?: string) => {
  if (!value) return placeholderImage
  if (value.startsWith('http')) return value
  return `${apiBase}${value.startsWith('/') ? '' : '/'}${value}`
}

const usePlaceholder = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.onerror = null
  image.src = placeholderImage
}
</script>

<style scoped>
.order-circuit-line {
  stroke: var(--color-primary);
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
}
</style>
