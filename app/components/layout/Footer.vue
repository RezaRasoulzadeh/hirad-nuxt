<template>
  <footer class="relative overflow-hidden border-t border-base-300 bg-base-100 text-base-content" dir="rtl">
    <!-- Background image -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-107.5 overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-top bg-no-repeat opacity-20"
        :style="{ backgroundImage: `url(${HeroImage})` }" />

      <!-- Fade background into current DaisyUI theme -->
      <div class="absolute inset-0 bg-linear-to-b from-base-100/20 via-base-100/30 to-base-100" />
    </div>

    <!-- Main cards -->
    <div class="container relative z-10 mx-auto grid grid-cols-1 gap-5 px-4 pb-7 pt-14 md:grid-cols-2 xl:grid-cols-4">
      <!-- Company -->
      <aside class="card min-h-88.75 border border-base-300 bg-base-100/30 backdrop-blur-sm">
        <div class="card-body items-center p-7 text-center">
          <div class="flex min-h-26.25 items-center justify-center">
            <img :src="LogoWide" alt="Hirad Logo" class="block h-24 w-auto max-w-full object-contain dark:hidden" />

            <img :src="LogoWideDark" alt="Hirad Logo" class="hidden h-24 w-auto max-w-full object-contain dark:block" />
          </div>

          <span class="mt-4 block h-0.5 w-16 rounded-full bg-primary" />

          <p class="text-justify text-sm leading-8 text-base-content/70">
            تأمین‌کننده تخصصی تجهیزات ابزار دقیق، شیرآلات صنعتی، اتصالات و ملزومات پایپینگ
            برای صنایع نفت، گاز، پتروشیمی، نیروگاهی و صنایع فرآیندی.
          </p>

          <div class="mt-auto flex items-center justify-center gap-2 pt-6">
            <a v-for="social in socials" :key="social.label" :href="social.href" target="_blank"
              rel="noopener noreferrer" class="btn btn-circle btn-ghost p-2 border border-base-300
              text-base-content/70 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
              :aria-label="social.label">
              <component :is="social.icon" class="size-5" />
            </a>
          </div>
        </div>
      </aside>

      <!-- Quick access -->
      <nav class="card min-h-88.75 border border-base-300 bg-base-100/30 backdrop-blur-sm">
        <div class="card-body p-7">
          <FooterHeading title="دسترسی سریع" />

          <div class="mt-3 flex flex-col">
            <template v-for="(item, index) in items" :key="item.label">
              <button v-if="item.emit" type="button" class="group flex min-h-11 w-full items-center gap-3 rounded-lg px-2
                text-right text-sm text-base-content/70 transition
                hover:bg-base-200 hover:text-primary" @click="$emit(item.emit)">
                <component :is="item.icon"
                  class="size-4.5 shrink-0 opacity-70 transition-transform group-hover:scale-110" />
                <span>{{ item.label }}</span>
              </button>

              <NuxtLink v-else :to="item.to!" class="group flex min-h-11 items-center gap-3 rounded-lg px-2
                text-sm text-base-content/70 transition
                hover:bg-base-200 hover:text-primary">
                <component :is="item.icon"
                  class="size-4.5 shrink-0 opacity-70 transition-transform group-hover:scale-110" />
                <span>{{ item.label }}</span>
              </NuxtLink>

              <div v-if="index !== items.length - 1" class="mx-2 border-b border-base-200" />
            </template>
          </div>
        </div>
      </nav>

      <!-- Contact -->
      <nav class="card min-h-88.75 border border-base-300 bg-base-100/30 backdrop-blur-sm">
        <div class="card-body p-7">
          <FooterHeading title="ارتباط با ما" />

          <div class="mt-4 flex flex-col gap-5">
            <a href="tel:+982166420839" class="group flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full
                border border-primary/15 bg-primary/5 text-primary
                transition group-hover:bg-primary/10">
                <Phone class="size-4.5" />
              </span>

              <span>
                <span class="block text-xs text-base-content/50">تلفن</span>
                <span class="mt-1 block text-sm text-base-content/75 group-hover:text-primary" dir="ltr">
                  ۰۲۱-۶۶۴۲۰۸۳۹
                </span>
              </span>
            </a>

            <a href="tel:+989352557163" class="group flex items-center gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full
                border border-primary/15 bg-primary/5 text-primary
                transition group-hover:bg-primary/10">
                <Smartphone class="size-4.5" />
              </span>

              <span>
                <span class="block text-xs text-base-content/50">موبایل</span>
                <span class="mt-1 block text-sm text-base-content/75 group-hover:text-primary" dir="ltr">
                  ۰۹۳۵-۲۵۵۷۱۶۳
                </span>
              </span>
            </a>

            <div class="flex items-start gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full
                border border-primary/15 bg-primary/5 text-primary">
                <MapPin class="size-4.5" />
              </span>

              <span>
                <span class="block text-xs text-base-content/50">آدرس</span>
                <span class="mt-1 block text-sm leading-7 text-base-content/75">
                  تهران، خیابان ستارخان، خیابان نیایش، کوچه موثق‌نژاد، پلاک ۱، واحد یک
                </span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <!-- Certificates -->
      <nav class="card min-h-88.75 border border-base-300 bg-base-100/30 backdrop-blur-sm">
        <div class="card-body p-7">
          <FooterHeading title="مجوزها و گواهینامه‌ها" />

          <div class="mt-5 flex items-center justify-center gap-3">
            <a href="#" target="_blank" rel="noopener noreferrer" class="flex size-28 items-center justify-center rounded-box
              border border-base-300 bg-base-100
              transition hover:-translate-y-1 hover:border-primary/30">
              <img :src="PlaceHolder" alt="نماد اعتماد الکترونیکی" class="size-24 rounded-xl object-cover" />
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer" class="flex size-28 items-center justify-center rounded-box
              border border-base-300 bg-base-100
              transition hover:-translate-y-1 hover:border-primary/30">
              <img :src="PlaceHolder" alt="نشان ساماندهی" class="size-24 rounded-xl object-cover" />
            </a>
          </div>

          <div class="divider my-3 before:bg-base-300 after:bg-base-300" />

          <div class="flex items-center gap-4 rounded-box bg-base-200/70 p-4">
            <div class="flex size-12 shrink-0 items-center justify-center rounded-box bg-primary/10 text-primary">
              <ShieldCheck class="size-7" />
            </div>

            <div>
              <h3 class="text-sm font-bold text-base-content">
                شرکت ثبت‌شده و معتبر
              </h3>

              <p class="mt-1 text-xs leading-6 text-base-content/60">
                دارای مجوزهای لازم از مراجع ذی‌صلاح
              </p>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Features -->
    <div class="relative z-10 border-y border-base-300 bg-base-100/90 backdrop-blur-sm">
      <div class="container mx-auto grid grid-cols-1 px-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(feature, index) in features" :key="feature.title"
          class="relative flex min-h-23 items-center justify-center gap-4 px-5 py-5">
          <div v-if="index !== features.length - 1"
            class="absolute left-0 top-1/2 hidden h-11 -translate-y-1/2 border-l border-base-300 lg:block" />

          <div class="flex size-12 shrink-0 items-center justify-center rounded-box bg-primary/10 text-primary">
            <component :is="feature.icon" class="size-7" :stroke-width="1.7" />
          </div>

          <div>
            <h3 class="text-sm font-bold text-base-content">
              {{ feature.title }}
            </h3>

            <p class="mt-1 text-xs text-base-content/55">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Copyright -->
    <div class="relative z-10 bg-base-100">
      <div class="container mx-auto grid grid-cols-1 items-center gap-3
        px-4 py-5 text-center text-xs text-base-content/50
        md:grid-cols-3 md:text-right">

        <p class="text-center md:text-left">
          طراحی و توسعه با
          <Heart class="mx-1 inline size-3.5 fill-red-600 text-red-600" />
          توسط تیم هیراد
        </p>
        <p class="text-center">
          تمامی حقوق این وب‌سایت محفوظ است.
        </p>

        <p class="md:text-right" dir="ltr">
          HIRAD Process Equipment Co. © {{ currentYear }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  Award,
  Headphones,
  Heart,
  House,
  Info,
  Instagram,
  Mail,
  MapPin,
  MessageCircleCheck,
  MessageCircleMore,
  Newspaper,
  PackageCheck,
  Phone,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck
} from 'lucide-vue-next'

import LogoWide from '~/assets/Logo-wide.png'
import LogoWideDark from '~/assets/Logo-wide-dark.png'
import HeroImage from '~/assets/hero.jpg'
import PlaceHolder from '~/assets/placeholder.png'

defineEmits<{
  (event: 'open-drawer'): void
}>()

interface FooterItem {
  label: string
  to?: string
  emit?: 'open-drawer'
  icon: any
}

interface SocialItem {
  label: string
  href: string
  icon: any
}

interface FeatureItem {
  title: string
  description: string
  icon: any
}

const currentYear = new Date()
  .getFullYear()
  .toLocaleString('en-US', { useGrouping: false })

const items: FooterItem[] = [
  { label: 'صفحه اصلی', to: '/', icon: House },
  { label: 'محصولات', emit: 'open-drawer', icon: ShoppingBag },
  { label: 'مقالات و اخبار', to: '/blog', icon: Newspaper },
  { label: 'درباره ما', to: '/about', icon: Info },
  { label: 'تماس با ما', to: '/contact', icon: Phone }
]

const socials: SocialItem[] = [
  {
    label: 'Email',
    href: 'mailto:info@hiradprocess.com',
    icon: Mail
  },
  {
    label: 'WhatsApp',
    href: '#',
    icon: MessageCircleMore
  },
  {
    label: 'Instagram',
    href: '#',
    icon: Instagram
  },
  {
    label: 'Telegram',
    href: '#',
    icon: Send
  },
  {
    label: 'Bale',
    href: '#',
    icon: MessageCircleCheck
  }
]

const features: FeatureItem[] = [
  {
    title: 'گارانتی معتبر',
    description: 'گارانتی و خدمات پس از فروش',
    icon: ShieldCheck
  },
  {
    title: 'تحویل سریع',
    description: 'ارسال به سراسر کشور',
    icon: Truck
  },
  {
    title: 'مهندسی و پشتیبانی',
    description: 'مشاوره فنی و مهندسی',
    icon: Headphones
  },
  {
    title: 'کیفیت برتر',
    description: 'تضمین کیفیت محصولات',
    icon: Award
  }
]
</script>

<script lang="ts">
import { defineComponent, h } from 'vue'

const FooterHeading = defineComponent({
  name: 'FooterHeading',

  props: {
    title: {
      type: String,
      required: true
    }
  },

  setup(props) {
    return () =>
      h('div', { class: 'flex flex-col items-center text-center' }, [
        h(
          'h2',
          {
            class: 'text-base font-bold tracking-normal text-base-content'
          },
          props.title
        ),
        h('span', {
          class: 'mt-4 block h-0.5 w-16 rounded-full bg-primary'
        })
      ])
  }
})

export default {
  components: {
    FooterHeading
  }
}
</script>