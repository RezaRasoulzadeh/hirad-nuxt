<template>
  <section
    class="w-full py-10 bg-base-100"
    dir="rtl"
  >
    <div class="container mx-auto px-4">

      <!-- Title -->
      <div class="flex flex-col items-center text-center mb-4">
        <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
          About Hirad
        </span>

        <h2 class="text-3xl md:text-4xl font-black text-base-content tracking-tight">
          درباره تجهیز فرآیند هیراد
        </h2>

        <div class="h-1 w-12 bg-primary mt-4 rounded-full opacity-80" />
      </div>

      <!-- Content -->
      <div class="container mx-auto">

        <div
          class="relative"
        >

          <div
            class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          />

          <div
            class="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          />

          <p
            class="relative text-base-content/80 leading-loose text-justify text-sm md:text-base"
          >
            شرکت تجهیز فرآیند هیراد در سال ۱۳۹۴ در تهران (شماره ثبت ۵۲۵۴۷۰)
            با هدف تأمین، تدارک و ارائه تجهیزات و خدمات فنی مهندسی مورد نیاز
            صنایع نفت، گاز، پتروشیمی، پالایشگاه‌ها، نیروگاه‌ها، صنایع تولیدی،
            غذایی و دارویی تأسیس شد.

            این شرکت همواره در همکاری با برندهای معتبر جهانی و
            تولیدکنندگان داخلی تلاش می‌کند تا تجهیزات اصیل، باکیفیت و
            مقرون‌به‌صرفه را به مشتریان ارائه دهد.

            تجهیز فرآیند هیراد با رعایت استانداردهای بین‌المللی
            (ASME, ANSI, API, EN, DIN, BS, ISO)
            و ارائه گواهینامه‌های معتبر، آماده پاسخگویی به نیازهای صنایع
            مختلف کشور است.
          </p>

          <div class="flex justify-center mt-4">
            <NuxtLink
              to="/about"
              class="btn btn-dash btn-primary gap-2 px-8 group"
            >
              <span>مشاهده کامل معرفی شرکت</span>
              <ChevronLeft
                class="size-4 transition-transform duration-200 group-hover:-translate-x-1"
              />
            </NuxtLink>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft } from 'lucide-vue-next'
</script>