<script setup lang="ts">
import { Headset } from 'lucide-vue-next';

</script>

<template>
  <section class="w-full pb-8 bg-base-100">
    <div class="container mx-auto px-4 lg:px-8">
      <div class="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200/40 py-16 px-4">
        
        <div class="absolute -top-20 -right-20 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div class="absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div class="relative z-10 flex flex-col items-center text-center mb-10 px-4">
          <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3" dir="ltr">
            Request Quote
          </span>
          <h2 class="text-base-content text-3xl md:text-3xl font-black tracking-tight">
            درخواست قیمت
          </h2>
          <div class="bg-primary h-1 w-12 mt-4 rounded-full opacity-80" />
          <p class="text-base-content/70 mx-auto text-sm leading-relaxed mt-4">
            اگر نیازهای خاصی دارید یا به راه‌حل سفارشی نیازمندید، لطفاً برای دریافت قیمت با ما تماس بگیرید.
            تیم ما با خوشحالی آماده پاسخگویی به نیازهای شماست.
          </p>
        </div>

        <div class="relative z-10 text-center">
          <NuxtLink
            to="/contact"
            class="btn btn-primary outline-1 outline-offset-3 outline-dashed outline-transparent hover:outline-primary border-0 rounded-xl font-bold px-12 py-6 transition-all"
          >
            <Headset class="size-5"/>
            <span class="pt-1">ارتباط با کارشناسان</span>
          </NuxtLink>
        </div>

      </div>
    </div>
  </section>
</template>