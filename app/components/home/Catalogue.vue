<template>
  <section class="w-full pb-8 bg-base-100" dir="rtl">
    <div class="container mx-auto px-4">

      <div class="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/40">

        <!-- Decorative Blurs -->
        <div class="absolute -top-20 -right-20 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div class="absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/5 blur-3xl" />

        <div class="relative flex flex-col lg:flex-row items-center gap-12 p-8 md:p-12 lg:p-16">

          <!-- Content -->
          <div class="w-full lg:w-7/12 text-center lg:text-right">

            <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
              Product Catalogue
            </span>

            <h2 class="text-3xl md:text-4xl font-black text-base-content tracking-tight">
              کاتالوگ محصولات هیراد
            </h2>

            <div class="h-1 w-12 bg-primary rounded-full mt-4 mb-6 mx-auto lg:mx-0" />

            <p class="text-base-content/70 leading-loose text-justify mb-8">
              برای آشنایی بیشتر با مشخصات فنی، استانداردهای بین‌المللی،
              جزئیات محصولات و تجهیزات صنایع نفت، گاز، پتروشیمی،
              نیروگاهی، غذایی و دارویی، نسخه جامع کاتالوگ شرکت
              تجهیز فرآیند هیراد را دریافت نمایید.
            </p>

            <NuxtLink to="/about/catalogue" class="btn btn-primary gap-2 px-8 group">
              <span class="pt-1">مشاهده و دریافت کاتالوگ</span>

              <ArrowLeft class="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
            </NuxtLink>

          </div>
          <!-- Catalogue -->
          <div class="w-full lg:w-5/12 flex justify-center">
            <img src="~/assets/catalogue.png" alt="کاتالوگ هیراد"
              class="max-h-105 object-contain drop-shadow-2xl transition-transform duration-300 hover:-translate-y-2 hover:scale-110" />
          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>