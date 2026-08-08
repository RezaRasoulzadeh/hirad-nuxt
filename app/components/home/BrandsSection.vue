<template>
  <section v-if="brands.length" class="w-full bg-[url('~/assets/Brand-section-bg.jpg')] bg-cover bg-top py-12 md:py-16" dir="rtl">
    <div class="mx-auto w-full max-w-[1920px] px-4 2xl:px-12">
      <div class="mb-8 flex flex-col items-center text-center">
        <span class="mb-2 text-xs font-bold tracking-widest text-primary">BRANDS</span>
        <h2 class="text-2xl font-black text-base-content md:text-4xl">همکاری با برندهای معتبر جهانی</h2>
        <span class="mt-4 h-1 w-10 rounded-full bg-primary" />
        <p class="mt-4 text-sm leading-8 text-base-content/70 md:text-base">
          هیراد با همکاری تولیدکنندگان پیشرو و معتبر جهانی، تجهیزات صنعتی با کیفیت بالا را برای پروژه‌های نفت، گاز، پتروشیمی، نیروگاهی و صنایع فرآیندی تأمین می‌کند.
        </p>
      </div>

      <div class="rounded-3xl border border-base-300/70 bg-base-100/85 p-4 backdrop-blur-sm md:p-7">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-10">
          <a v-for="(brand, index) in brands" :key="`${brand.name}-${index}`"
            :href="brand.website_url || undefined" :target="brand.website_url ? '_blank' : undefined"
            :rel="brand.website_url ? 'noopener noreferrer' : undefined"
            class="group flex min-h-20 items-center justify-center rounded-xl border border-base-300 bg-base-100 p-4 text-center"
            :class="{ 'cursor-default': !brand.website_url, 'max-md:hidden': index >= 10 && !showAllBrands }"
            :title="brand.name_fa || brand.name">
            <img :src="resolveAssetUrl(brand.logo_url)" :alt="brand.name_fa || brand.name"
              class="h-14 w-full object-contain opacity-65 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              loading="lazy">
          </a>
        </div>

        <button v-if="brands.length > 10" type="button"
          class="btn btn-ghost btn-sm mx-auto mt-4 flex text-primary md:hidden" @click="showAllBrands = !showAllBrands">
          {{ showAllBrands ? 'نمایش کمتر' : 'مشاهده همه برندها' }}
          <ChevronDown class="size-4 transition-transform" :class="{ 'rotate-180': showAllBrands }" />
        </button>
      </div>

      <div class="mt-6 flex items-center justify-center gap-3 text-sm text-base-content/70 md:text-base">
        <span class="h-px w-10 bg-primary/70" />
        <p>و بیش از <strong class="text-xl text-primary" dir="ltr">40</strong> برند معتبر دیگر ...</p>
        <span class="h-px w-10 bg-primary/70" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { HomeBrand } from '~/composables/useHomePage'

defineProps<{ brands: HomeBrand[] }>()

const showAllBrands = ref(false)
</script>
