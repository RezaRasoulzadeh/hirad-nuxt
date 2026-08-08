<template>
  <section ref="sectionRef"
    class="relative isolate min-h-[calc(100svh-72px)] bg-[url('~/assets/hero-background.jpg')] bg-cover bg-center text-base-content"
    aria-labelledby="home-hero-title">
    <div class="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-linear-to-b from-transparent to-base-100" aria-hidden="true" />

    <div class="pointer-events-none absolute top-2 left-4 z-20 hidden gap-2 md:grid 2xl:left-4" dir="rtl"
      aria-label="مزیت‌های هیراد">
      <div v-for="point in qualityPoints" :key="point.title"
        class="flex min-h-10 w-46 items-center gap-3 rounded-xl border border-base-300 bg-base-100/90 px-3 py-2 text-primary shadow-sm backdrop-blur-md"
        dir="ltr">
        <component :is="point.icon" class="size-8" aria-hidden="true" />
        <span class="flex w-full flex-col text-base-content">
          <b class="text-xs">{{ point.title }}</b>
          <small class="mt-1 text-[10px] text-base-content/65" dir="ltr">{{ point.subtitle }}</small>
        </span>
      </div>
    </div>

    <div class="relative mx-4 flex min-h-[calc(100svh-72px)] max-w-[1920px] flex-col justify-center py-6 2xl:mx-12 lg:py-8">
      <div class="flex w-full min-w-0 flex-col md:flex-row md:items-stretch" dir="rtl">
        <div class="z-2 order-1 lg:mt-10 2xl:mt-16 flex w-full min-w-0 flex-col text-center md:basis-[40%] md:text-right">
          <p class="mb-2 text-sm font-bold text-primary lg:text-base">شرکت تجهیز فرآیند هیراد</p>
          <h1 id="home-hero-title"
            class="m-0 w-full text-3xl leading-[1.4] font-black tracking-tight text-base-content md:text-[clamp(2rem,2.45vw,3rem)]">
            {{ heroTitle }}
          </h1>
          <i class="mx-auto my-2 block h-0.75 w-8 rounded-full bg-primary md:mx-0" aria-hidden="true" />
          <p class="m-0 w-full text-sm leading-8 text-base-content/65 md:text-justify">
            {{ heroDescription }}
          </p>

          <div class="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
            <button type="button"
              class="inline-flex h-12 min-w-42 cursor-pointer items-center justify-center gap-2 rounded-lg border border-primary bg-primary px-5 text-sm font-bold text-primary-content transition hover:-translate-y-0.5 hover:shadow-lg"
              @click="isDrawerOpen = true">
              مشاهده محصولات
              <ArrowLeft class="size-5" />
            </button>
            <NuxtLink to="/about/catalogue"
              class="inline-flex h-12 min-w-42 items-center justify-center gap-2 rounded-lg border border-primary bg-base-100/70 px-5 text-sm font-bold text-primary transition hover:-translate-y-0.5 hover:shadow-lg">
              دریافت کاتالوگ
              <Download class="size-5" />
            </NuxtLink>
          </div>

          <nav v-if="visibleItems.length" class="mt-4 flex w-full flex-col gap-2 md:grid md:grid-cols-5 lg:mt-10"
            aria-label="دسته‌بندی محصولات">
            <NuxtLink v-for="item in visibleItems" :key="item.url" :to="item.url"
              class="group relative flex min-h-20 min-w-0 flex-row items-center gap-3 overflow-hidden rounded-xl border border-base-300 bg-base-100/90 px-4 py-3 text-base-content shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:min-h-42 md:flex-col md:gap-0 md:px-1 md:text-center">
              <div class="grid size-12 shrink-0 place-items-center text-primary md:mb-1 md:size-14">
                <img v-if="item.icon" :src="resolveIcon(item.icon)" alt="" class="max-size-14 object-contain">
                <PackageOpen v-else class="size-8" aria-hidden="true" />
              </div>
              <div class="flex min-w-0 flex-1 flex-col text-right md:items-center md:text-center">
                <strong class="max-w-full truncate text-sm leading-6 md:mt-2">{{ cleanTitle(item.title_fa) }}</strong>
                <small class="max-w-full truncate text-[10px] leading-5 text-base-content/60">{{
                  cleanTitle(item.meta_title) || item.sub_title_fa }}</small>
              </div>
              <ArrowLeft
                class="ms-auto size-4 shrink-0 text-primary transition-transform group-hover:-translate-x-1 md:mt-auto md:ms-0"
                aria-hidden="true" />
              <span
                class="absolute inset-y-3 right-0 w-1 rounded-l-full bg-primary md:inset-x-3 md:top-auto md:bottom-0 md:h-1 md:w-auto md:rounded-t-full md:rounded-b-none" />
            </NuxtLink>
          </nav>
        </div>

        <div
          class="order-2 mx-4 mt-5 flex w-[calc(100%-2rem)] min-w-0 items-center md:mx-0 md:mt-0 md:w-full md:basis-[60%]"
          dir="ltr">
          <img src="~/assets/hero.jpg" alt="مجموعه تجهیزات و شیرآلات صنعتی هیراد" fetchpriority="high"
            class="block h-auto w-full object-contain mix-blend-multiply">
        </div>
      </div>

      <div class="mx-auto mt-3 grid w-full max-w-6xl grid-cols-2 px-2 py-2 md:grid-cols-4 md:px-7"
        aria-label="آمار شرکت">
        <div v-for="stat in stats" :key="stat.label"
          class="flex items-center justify-start gap-3 border-b border-base-300 px-4 py-3 odd:border-l nth-last-[-n+2]:border-b-0 md:justify-center md:border-b-0 md:border-l md:px-0 md:py-0 md:odd:border-l md:last:border-l-0">
          <component :is="stat.icon" class="size-8 text-primary" :stroke-width="1.5" aria-hidden="true" />
          <div class="flex flex-col"><strong class="text-xl leading-none text-base-content" dir="ltr">{{ stat.value
              }}</strong><span class="mt-1 text-xs text-base-content/70">{{ stat.label }}</span></div>
        </div>
      </div>

      <button type="button"
        class="mx-auto mt-2 lg:mt-10 flex cursor-pointer flex-col items-center gap-1 text-base-content/40"
        aria-label="رفتن به بخش بعد" @click="scrollDown">
        <span class="font-sans text-[8px] font-bold tracking-[.16em]">SCROLL</span>
        <span class="flex h-7 w-4 justify-center rounded-full border-2 border-current pt-1"><i
            class="h-1.5 w-0.5 animate-bounce rounded-full bg-primary" /></span>
        <ArrowDown class="size-3.5 animate-bounce" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  ArrowLeft, ArrowDown, Download, PackageOpen, ShieldCheck, Globe2, Headphones,
  Award, Box, Factory, Building2,
} from 'lucide-vue-next'
import type { HomePage } from '~/composables/useHomePage'
import { useCategories } from '~/composables/useCategories'

const props = defineProps<{ page: HomePage | null }>()
const config = useRuntimeConfig()
const baseUrl = config.public.apiBase ?? '/api'
const { fetchCategories, productCategories } = useCategories()
const isDrawerOpen = useState<boolean>('productsDrawerOpen', () => false)
const sectionRef = ref<HTMLElement | null>(null)

const activeHero = computed(() => props.page?.content?.image_gallery?.[0])
const heroTitle = computed(() =>
  activeHero.value?.title_fa || props.page?.title || props.page?.meta_title || 'تجهیزات صنعتی هیراد'
)
const heroDescription = computed(() =>
  activeHero.value?.description_fa || props.page?.summary || props.page?.meta_description || ''
)

const visibleItems = computed(() => [...productCategories.value]
  .sort((a, b) => a.sort_order - b.sort_order)
  .slice(0, 5)
  .map(cat => ({
    url: `/categories/${cat.slug}`,
    icon: cat.image_url ?? '',
    title_fa: cat.name,
    meta_title: cat.meta_title,
    sub_title_fa: cat.description ?? '',
  })))

const qualityPoints = [
  { icon: ShieldCheck, title: 'استانداردهای بین‌المللی', subtitle: 'ISO / ASME / DIN' },
  { icon: Globe2, title: 'تأمین جهانی', subtitle: 'Worldwide Supply' },
  { icon: Headphones, title: 'پشتیبانی مهندسی', subtitle: 'Engineering Support' },
]

const stats = [
  { icon: Award, value: '10+', label: 'سال تجربه' },
  { icon: Box, value: '3500+', label: 'محصول' },
  { icon: Factory, value: '120+', label: 'پروژه موفق' },
  { icon: Building2, value: '20+', label: 'کشور تأمین' },
]

const cleanTitle = (value?: string | null) => value?.split('|')[0]?.trim() ?? ''
const resolveIcon = (url: string) => url.startsWith('http')
  ? url
  : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`

const scrollDown = () => sectionRef.value?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })

onMounted(fetchCategories)
</script>
