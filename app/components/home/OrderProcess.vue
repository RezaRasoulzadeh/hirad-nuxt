<template>
  <section class="w-full bg-base-100 py-16 md:py-24" dir="rtl">
    <div class="container mx-auto px-4">
      <div class="mb-12 flex flex-col items-center text-center md:mb-16">
        <span class="mb-3 text-xs font-bold tracking-[0.2em] text-primary uppercase">
          Order Process
        </span>
        <h2 class="text-3xl font-black tracking-tight text-base-content">
          روند ثبت و تکمیل سفارش
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
            <component :is="step.icon" class="size-12" :stroke-width="1.65" />
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
  </section>
</template>

<script setup lang="ts">
import {
  PhoneCall,
  MessageSquare,
  FileText,
  CheckSquare,
  Truck,
  ShieldCheck,
} from 'lucide-vue-next'

const steps = [
  {
    id: 1,
    fa: 'تماس اولیه',
    en: 'Contact',
    desc: 'ارتباط اولیه و طرح موضوع با کارشناسان هیراد',
    icon: PhoneCall,
  },
  {
    id: 2,
    fa: 'مشاوره فنی',
    en: 'Consultation',
    desc: 'بررسی دقیق قطعات، فیتینگ‌ها و فیلترهای درخواستی',
    icon: MessageSquare,
  },
  {
    id: 3,
    fa: 'صدور پیش‌فاکتور',
    en: 'Proforma Invoice',
    desc: 'شفاف‌سازی قیمت‌ها و مشخص کردن دقیق زمان تحویل',
    icon: FileText,
  },
  {
    id: 4,
    fa: 'ثبت نهایی درخواست',
    en: 'Order Registration',
    desc: 'نهایی کردن سفارش صنعتی و آغاز فرآیند تامین یا تولید',
    icon: CheckSquare,
  },
  {
    id: 5,
    fa: 'بسته‌بندی و ارسال',
    en: 'Delivery',
    desc: 'بسته‌بندی استاندارد ایمن و ارسال به موقع تجهیزات مکانیکی',
    icon: Truck,
  },
  {
    id: 6,
    fa: 'تضمین کیفیت',
    en: 'Warranty',
    desc: 'پشتیبانی فنی مهندسی و ارائه تاییدیه کنترل کیفیت نهایی',
    icon: ShieldCheck,
  },
]
</script>
