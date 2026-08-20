<template>
  <section
    class="relative z-1 overflow-visible px-3 py-8 2xl:pt-16 md:bg-[url('~/assets/About-Section-BG.jpg')] md:bg-size-[70vw_auto] md:bg-center md:bg-no-repeat md:px-5 md:py-12 2xl:bg-size-[60vw_auto] 2xl:bg-position-[2rem_center]"
    dir="rtl">
    <div ref="sectionContentRef" class="relative mx-auto min-h-170 max-w-[1880px] overflow-visible">
      <div class="pointer-events-none absolute inset-0 z-10 hidden md:block" aria-hidden="true">
        <svg class="absolute inset-0 hidden size-full overflow-visible md:block lg:hidden" viewBox="0 0 1000 700"
          fill="none" preserveAspectRatio="none">
          <path :d="`M715 30H${982 - topCornerOffset}L982 74V${bottomLineY - 58}L${982 - bottomCornerOffset} ${bottomLineY}H785`"
            class="about-circuit-line" />
        </svg>
        <svg class="absolute inset-0 hidden size-full overflow-visible lg:block" viewBox="0 0 1000 700" fill="none"
          preserveAspectRatio="none">
          <path :d="`M725 30H${982 - topCornerOffset}L982 74V${bottomLineY - 58}L${982 - bottomCornerOffset} ${bottomLineY}H785`"
            class="about-circuit-line" />
        </svg>

        <i
          class="absolute top-[calc(4.286%-0.3125rem)] left-[calc(71.5%-0.3125rem)] size-2.5 rounded-full bg-primary lg:left-[calc(72.5%-0.3125rem)]" />
        <span class="absolute top-[68%] right-[calc(1.8%-0.3125rem)] flex flex-col gap-2">
          <i v-for="dot in 3" :key="dot" class="size-2.5 rounded-full bg-primary" />
        </span>
      </div>

      <div
        class="relative z-20 flex min-h-170 items-center px-5 py-10 sm:px-8 md:ml-auto md:w-[57%] md:px-12 md:py-16 lg:w-[55%] lg:px-16 2xl:px-24">
        <div class="w-full">
          <header class="mb-7 text-center">
            <span class="mb-3 block font-sans text-xs font-bold tracking-[0.24em] text-primary uppercase">
              {{ about.eyebrow }}
            </span>
            <h2 class="text-3xl font-black tracking-tight text-base-content md:text-4xl">{{ about.title }}</h2>
            <div class="mx-auto mt-4 h-1 w-12 rounded-full bg-primary opacity-80" aria-hidden="true" />
          </header>

          <p class="whitespace-pre-line text-justify text-sm leading-8 text-base-content/70 md:leading-9">
            {{ about.description }}
          </p>

          <div class="mt-8 mb-16 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-0">
            <article v-for="(feature, index) in about.features.slice(0, 3)" :key="`${feature.title}-${index}`"
              class="flex flex-col items-center px-4 text-center sm:border-l sm:border-base-300 sm:last:border-l-0">
              <component :is="featureIcons[index]" class="mb-3 size-9 text-primary" :stroke-width="1.5"
                aria-hidden="true" />
              <h3 class="max-w-full truncate whitespace-nowrap text-sm font-bold leading-6 text-primary">
                {{ feature.title }}
              </h3>
              <p class="mt-1 max-w-full truncate whitespace-nowrap text-xs leading-6 text-base-content/65">
                {{ feature.description }}
              </p>
            </article>
          </div>

          <div ref="ctaRowRef" class="flex justify-center">
            <NuxtLink :to="about.cta_url || '/about'"
              class="group inline-flex min-h-11 min-w-64 items-center justify-center gap-3 rounded-xl border border-primary bg-base-100 px-6 text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-content">
              <span>{{ about.cta_label }}</span>
              <ChevronLeft class="size-4 transition-transform group-hover:-translate-x-1" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronLeft, Factory, Globe2, UsersRound } from 'lucide-vue-next'
import type { HomeAboutSection, HomePage } from '~/composables/useHomePage'
import { useCircuitGeometry } from '~/composables/useCircuitGeometry'

const props = defineProps<{ page?: HomePage | null }>()
const {
  circuitFrameRef: sectionContentRef,
  topCornerOffset,
  bottomCornerOffset,
} = useCircuitGeometry()
const ctaRowRef = ref<HTMLElement | null>(null)
const bottomLineY = ref(590)
let sectionResizeObserver: ResizeObserver | undefined

const defaultAbout: HomeAboutSection = {
  eyebrow: 'About Hirad',
  title: 'درباره تجهیز فرآیند هیراد',
  description: 'شرکت تجهیز فرآیند هیراد در سال ۱۳۹۷ با شماره ثبت ۵۲۵۴۷۰ در تهران تأسیس شد و طی سال‌های اخیر فعالیت خود را بر ارائه خدمات تأمین، تدارکات، مهندسی، و بازرگانی تخصصی در حوزه نفت، گاز، پالایش، پتروشیمی، نیروگاه، صنایع تولیدی، غذایی و دارویی متمرکز کرده است. این شرکت با بهره‌گیری از شبکه گسترده تأمین‌کنندگان داخلی و بین‌المللی، یکی از عرضه‌کنندگان فعال لوله، اتصالات، شیرآلات صنعتی، فلنج، ابزار دقیق، مواد شیمیایی و تجهیزات خاص طرح‌ها و پروژه‌های صنعتی در کشور به شمار می‌رود. در راستای ارتقای کیفیت و مدیریت یکپارچه، شرکت موفق به پیاده‌سازی و اخذ گواهی‌های ISO 9001، ISO 14001، ISO 29001، ISO 45001 و IMS شده است. همچنین شرکت در فهرست بلند تأمین‌کنندگان مورد تأیید وزارت نفت (AVL) ثبت گردیده که بیانگر احراز صلاحیت‌های فنی و مدیریتی و امکان مشارکت در فرآیندهای مناقصات و تأمین در صنایع نفت و گاز است. پایبندی به استانداردهای بین‌المللی از جمله ASME، ANSI، API، EN، DIN، BS و ISO، تحویل کالا با نظارت نهادهای بازرسی و ارائه گواهی‌های معتبر فنی از اصول اساسی فعالیت شرکت تجهیز فرآیند هیراد محسوب می‌شود.',
  cta_label: 'مشاهده کامل معرفی شرکت',
  cta_url: '/about',
  features: [
    { title: 'تأمین و تدارک تجهیزات', description: 'برای پروژه‌های صنعتی در سراسر کشور' },
    { title: 'استانداردهای بین‌المللی', description: '(ASME, ANSI, API, EN, DIN, BS)' },
    { title: '+10 سال تجربه', description: 'در صنایع مختلف' },
  ],
}

const about = computed<HomeAboutSection>(() => {
  const saved = props.page?.content?.about_section
  return {
    ...defaultAbout,
    ...saved,
    description: !saved?.description || saved.description.includes('در سال ۱۳۹۴ با هدف')
      ? defaultAbout.description
      : saved.description,
    features: saved?.features?.length
      ? saved.features.map(feature => ({
          title: feature.value ? `${feature.value} ${feature.title}` : feature.title,
          description: feature.description,
        }))
      : defaultAbout.features,
  }
})

const featureIcons = [Factory, Globe2, UsersRound]

const syncBottomLine = () => {
  const section = sectionContentRef.value
  const button = ctaRowRef.value
  if (!section || !button) return

  const sectionRect = section.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()
  const buttonCenter = buttonRect.top + buttonRect.height / 2 - sectionRect.top
  bottomLineY.value = Math.max(150, Math.min(680, buttonCenter / sectionRect.height * 700))
}

onMounted(async () => {
  await nextTick()
  syncBottomLine()
  sectionResizeObserver = new ResizeObserver(syncBottomLine)
  if (sectionContentRef.value) sectionResizeObserver.observe(sectionContentRef.value)
  if (ctaRowRef.value) sectionResizeObserver.observe(ctaRowRef.value)
})

onBeforeUnmount(() => sectionResizeObserver?.disconnect())
</script>

<style scoped>
.about-circuit-line {
  stroke: var(--color-primary);
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
}
</style>
