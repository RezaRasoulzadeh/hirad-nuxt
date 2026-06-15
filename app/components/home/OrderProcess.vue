<template>
    <section class="w-full py-24 bg-base-200" dir="rtl">
        <div class="container mx-auto px-4">

            <div class="flex flex-col items-center text-center mb-10">
                <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
                    Order Process
                </span>
                <h2 class="text-3xl md:text-3xl font-black text-base-content tracking-tight">
                    روند ثبت و تکمیل سفارش
                </h2>
                <div class="h-1 w-12 bg-primary mt-4 rounded-full opacity-80" />
            </div>
            <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 lg:gap-12">

                <div
                    class="hidden xl:block absolute top-11 left-1/2 -translate-x-1/2 w-[83.34%] h-0.5 bg-linear-to-r from-base-300 via-primary/30 to-base-300 z-0" />

                <div v-for="(step, index) in steps" :key="step.id"
                    class="group relative flex flex-col items-center text-center z-10">
                    <div class="relative mb-6">
                        <div
                            class="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div
                            class="relative size-20 rounded-full bg-base-100 border border-base-300 text-base-content/70 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-content group-hover:-translate-y-1 shadow-sm">
                            <component :is="step.icon" class="size-7" :stroke-width="1.75" />
                        </div>

                        <span
                            class="absolute -top-1 -right-1 font-sans text-xs font-black size-6 rounded-full bg-base-300 text-base-content flex items-center justify-center border-2 border-base-100 group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300">
                            {{ step.id }}
                        </span>
                    </div>

                    <div class="flex flex-col items-center max-w-60">
                        <h3
                            class="text-lg font-black text-base-content mb-1 tracking-tight group-hover:text-primary transition-colors duration-200">
                            {{ step.fa }}
                        </h3>

                        <span
                            class="text-[10px] font-bold tracking-wider uppercase text-base-content/40 mb-3 font-sans">
                            {{ step.en }}
                        </span>

                        <p class="text-xs text-base-content/60 leading-relaxed font-medium">
                            {{ step.desc }}
                        </p>
                    </div>

                    <div v-if="index < steps.length - 1"
                        class="xl:hidden my-4 text-base-content/20 font-light last:hidden">
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
    ShieldCheck
} from 'lucide-vue-next'

const steps = [
    {
        id: 1,
        fa: 'تماس اولیه',
        en: 'Contact',
        desc: 'ارتباط اولیه و طرح موضوع با کارشناسان هیراد',
        icon: PhoneCall
    },
    {
        id: 2,
        fa: 'مشاوره فنی',
        en: 'Consultation',
        desc: 'بررسی دقیق قطعات، فیتینگ‌ها و فیلترهای درخواستی',
        icon: MessageSquare
    },
    {
        id: 3,
        fa: 'صدور پیش‌فاکتور',
        en: 'Proforma Invoice',
        desc: 'شفاف‌سازی قیمت‌ها و مشخص کردن دقیق زمان تحویل',
        icon: FileText
    },
    {
        id: 4,
        fa: 'ثبت نهایی درخواست',
        en: 'Order Registration',
        desc: 'نهایی کردن سفارش صنعتی و آغاز فرآیند تامین یا تولید',
        icon: CheckSquare
    },
    {
        id: 5,
        fa: 'بسته‌بندی و ارسال',
        en: 'Delivery',
        desc: 'بسته‌بندی استاندارد ایمن و ارسال به موقع تجهیزات مکانیکی',
        icon: Truck
    },
    {
        id: 6,
        fa: 'تضمین کیفیت',
        en: 'Warranty',
        desc: 'پشتیبانی فنی مهندسی و ارائه تاییدیه کنترل کیفیت نهایی',
        icon: ShieldCheck
    }
]
</script>