<template>
  <section class="container w-full mx-auto px-6 py-8 md:py-16" dir="rtl">
    <div class="flex flex-col items-center text-center mb-10 px-4">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3" dir="ltr">
        Why Choose Us?
      </span>
      <h2 class="text-base-content text-3xl md:text-3xl font-black tracking-tight">
        چرا ما را انتخاب کنید؟
      </h2>
      <div class="bg-primary h-1 w-12 mt-4 rounded-full opacity-80" />
      <p class="text-base-content/70 mx-auto text-sm leading-relaxed mt-4 max-w-xl">
        ما با تکیه بر تجربه، دانش فنی و تعهد به کیفیت، بهترین راه‌حل‌ها را برای مشتریان خود ارائه می‌دهیم.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div 
        v-for="(item, idx) in items" 
        :key="idx"
        class="flex flex-col items-center text-center group"
      >
        <div class="mb-6 p-4 bg-base-200 rounded-2xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
          <component
            :is="item.icon"
            class="w-12 h-12 text-primary"
            :stroke-width="1.5"
          />
        </div>
        
        <h3 class="text-xl font-bold text-base-content mb-3">
          {{ item.title }}
        </h3>
        
        <p class="text-base-content/80 text-sm leading-relaxed font-normal max-w-sm">
          {{ item.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BrainCircuit, Headset, BadgeCheck } from 'lucide-vue-next'

const items = [
  {
    title: 'تجربه و تخصص',
    description: 'تیم ما با سال‌ها تجربه در صنعت، توانایی ارائه راه‌حل‌های دقیق و کارآمد را دارد.',
    icon: BrainCircuit,
  },
  {
    title: 'پشتیبانی قوی',
    description: 'ما همواره در کنار مشتریان خود هستیم و آماده پاسخگویی به سوالات و نیازهای آن‌ها هستیم.',
    icon: Headset,
  },
  {
    title: 'کیفیت بالا',
    description: 'تمامی محصولات ما با رعایت استانداردهای بین‌المللی تولید و تأمین می‌شوند.',
    icon: BadgeCheck,
  },
]
</script>