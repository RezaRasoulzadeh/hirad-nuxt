<template>
  <section class="relative w-full overflow-visible bg-base-100" dir="rtl">
    <div class="relative mx-auto min-h-170 max-w-[1880px] overflow-visible px-5">
      <AnimatedCircuitBorder side="right" :bottom-y="650" />

      <div class="relative z-20 mx-auto px-5 pt-16 pb-24 md:px-12 lg:px-16 2xl:px-20">
        <header class="mb-10 flex flex-col items-center text-center md:mb-12">
          <span class="mb-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
            Product Catalogue
          </span>
          <h2 class="text-3xl font-black tracking-tight text-base-content">
            کاتالوگ محصولات هیراد
          </h2>
          <div class="mt-4 h-1 w-12 rounded-full bg-primary opacity-80" aria-hidden="true" />
        </header>

        <div class="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          <div class="min-w-0 text-center lg:text-right">
            <p class="text-sm leading-8 text-base-content/65 md:text-base md:leading-9">
              با مجموعه محصولات و تجهیزات تخصصی هیراد برای صنایع نفت، گاز، پتروشیمی
              و نیروگاهی آشنا شوید. در این کاتالوگ، اطلاعات شیرآلات صنعتی، اتصالات،
              ابزار دقیق و تجهیزات فرآیندی همراه با مشخصات فنی و استانداردهای مرتبط
              گردآوری شده است تا بتوانید گزینه‌های مورد نیاز پروژه خود را دقیق‌تر
              بررسی و مقایسه کنید.
            </p>

            <ul class="my-8 grid grid-cols-2 gap-y-6 sm:grid-cols-4 lg:my-10" aria-label="گروه‌های محصولات کاتالوگ">
              <li v-for="category in catalogueCategories" :key="category.label"
                class="flex min-w-0 flex-col items-center gap-3 px-2 text-center sm:border-base-300 sm:[&+li]:border-r">
                <span class="flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                  <component v-if="category.icon" :is="category.icon" class="size-8" :stroke-width="1.5" aria-hidden="true" />
                  <svg v-else class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path :d="category.path" />
                  </svg>
                </span>
                <span class="text-xs font-bold leading-6 text-base-content/85 xl:text-sm">{{ category.label }}</span>
              </li>
            </ul>

            <div class="flex justify-center">
              <NuxtLink to="/about/catalogue" class="group btn btn-primary min-h-12 gap-3 rounded-xl px-6 font-bold sm:px-10">
                <span class="pt-1">مشاهده و دریافت کاتالوگ</span>
                <ArrowLeft class="size-4 transition-transform duration-200 motion-safe:group-hover:-translate-x-1" />
              </NuxtLink>
            </div>
          </div>

          <div class="relative isolate flex min-w-0 items-center justify-center pt-10 lg:pt-12">
            <span class="pointer-events-none absolute inset-x-0 top-0 -z-10 text-center font-sans text-[clamp(3.5rem,9vw,10rem)] leading-none font-black tracking-[-0.06em] text-base-content/[0.035] select-none"
              aria-hidden="true" dir="ltr">CATALOG</span>
            <span class="pointer-events-none absolute inset-x-[8%] top-[18%] bottom-[8%] -z-10 -rotate-12 rounded-[50%] border border-primary/10"
              aria-hidden="true" />
            <img :src="normalizeLocalAssetUrl(catalogueImage)" alt="کاتالوگ هیراد"
              width="4894" height="2775" loading="lazy" decoding="async"
              class="h-auto w-full max-h-120 object-contain drop-shadow-2xl transition-transform duration-300 motion-safe:hover:-translate-y-2" />
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, Gauge } from 'lucide-vue-next'
import AnimatedCircuitBorder from './AnimatedCircuitBorder.vue'
import catalogueImage from '~/assets/catalogue.png'
import { normalizeLocalAssetUrl } from '~/utils/resolveAssetUrl'

const catalogueCategories = [
  {
    label: 'لوله و تیوب', icon: null,
    path: 'M5 3h14a3 3 0 0 1 0 6H5M5 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM5 15h14a3 3 0 0 1 0 6H5M5 15a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  },
  {
    label: 'اتصالات', icon: null,
    path: 'M3 5h6v3H3zM15 5h6v3h-6zM4 8v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8M8 8v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8',
  },
  { label: 'ابزار دقیق', icon: Gauge, path: '' },
  {
    label: 'شیرآلات صنعتی', icon: null,
    path: 'M8 3h8M12 3v12M3 12h4l5 3-5 3H3zM21 12h-4l-5 3 5 3h4zM3 11v8M21 11v8',
  },
]
</script>
