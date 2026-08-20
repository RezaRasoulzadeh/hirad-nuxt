<template>
  <footer class="relative overflow-hidden border-t border-base-300 bg-base-100 text-base-content" dir="rtl">
    <img :src="FooterBackground" alt="" aria-hidden="true"
      class="pointer-events-none absolute left-0 top-0 h-auto w-full origin-center -scale-x-100 object-contain object-top-left opacity-90 mix-blend-multiply lg:w-[60vw]" />

    <div class="relative z-10 mx-auto w-full max-w-[1720px] px-5 pb-10 pt-44 sm:pt-56 md:px-8 md:pt-64 lg:pt-72 xl:pt-80">
      <div class="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.05fr_.7fr_.95fr_1.4fr] lg:gap-0">
        <aside class="flex flex-col lg:pl-9">
          <NuxtLink to="/" class="inline-flex w-fit rounded-lg focus-visible:outline-2 focus-visible:outline-primary">
            <img :src="LogoWide" alt="تجهیز فرآیند هیراد" class="block h-auto w-64 max-w-full object-contain" />
          </NuxtLink>
          <span class="mt-7 h-0.5 w-11 rounded-full bg-primary" />
          <p class="mt-5 max-w-sm text-justify text-sm leading-8 text-base-content/65">
            تأمین‌کننده تخصصی تجهیزات ابزار دقیق، شیرآلات صنعتی، اتصالات و ملزومات پایپینگ برای صنایع نفت، گاز، پتروشیمی، نیروگاهی و صنایع فرآیندی.
          </p>
          <div class="mt-7 flex w-full max-w-sm flex-wrap items-center justify-between gap-3">
            <a v-for="social in socials" :key="social.label" :href="social.href" target="_blank" rel="noopener noreferrer"
              class="flex size-11 items-center justify-center rounded-full border border-base-300 bg-base-100/80 text-primary shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:text-primary-content hover:shadow-md"
              :aria-label="social.label">
              <component :is="social.icon" class="size-5" />
            </a>
          </div>
        </aside>

        <nav class="lg:border-r lg:border-base-300 lg:px-9">
          <FooterHeading title="دسترسی سریع" />
          <div class="mt-6 flex flex-col gap-1">
            <template v-for="item in items" :key="item.label">
              <button v-if="item.emit" type="button" class="group flex min-h-10 w-full items-center gap-3 rounded-lg px-2 text-right text-sm text-base-content/65 transition hover:bg-primary/5 hover:text-primary" @click="$emit(item.emit)">
                <component :is="item.icon" class="size-4.5 shrink-0 transition-transform group-hover:scale-110" />
                <span>{{ item.label }}</span>
              </button>
              <NuxtLink v-else :to="item.to!" class="group flex min-h-10 items-center gap-3 rounded-lg px-2 text-sm text-base-content/65 transition hover:bg-primary/5 hover:text-primary">
                <component :is="item.icon" class="size-4.5 shrink-0 transition-transform group-hover:scale-110" />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </template>
          </div>
        </nav>

        <address class="not-italic lg:border-r lg:border-base-300 lg:px-9">
          <FooterHeading title="ارتباط با ما" />
          <div class="mt-6 flex flex-col gap-4">
            <a v-if="primaryPhone" :href="primaryPhone.href" class="group flex items-center gap-3 text-sm text-base-content/70 hover:text-primary">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-100/80 text-primary shadow-sm"><Phone class="size-4.5" /></span>
              <span dir="ltr">{{ primaryPhone.value }}</span>
            </a>
            <a v-if="mobilePhone" :href="mobilePhone.href" class="group flex items-center gap-3 text-sm text-base-content/70 hover:text-primary">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-100/80 text-primary shadow-sm"><Smartphone class="size-4.5" /></span>
              <span dir="ltr">{{ mobilePhone.value }}</span>
            </a>
            <a v-if="primaryEmail" :href="primaryEmail.href" class="group flex items-center gap-3 text-sm text-base-content/70 hover:text-primary">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-100/80 text-primary shadow-sm"><Mail class="size-4.5" /></span>
              <span dir="ltr">{{ primaryEmail.value }}</span>
            </a>
            <div class="flex items-start gap-3 text-sm leading-7 text-base-content/70">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full border border-base-300 bg-base-100/80 text-primary shadow-sm"><MapPin class="size-4.5" /></span>
              <span>{{ contactData.address.value }}</span>
            </div>
          </div>
        </address>

        <div class="lg:border-r lg:border-base-300 lg:pr-9">
          <div class="overflow-hidden rounded-2xl border border-base-300 bg-base-100/60 p-3 shadow-lg shadow-base-content/5 backdrop-blur-sm">
            <img :src="FooterPainting" alt="نمای معماری ساختمان شرکت تجهیز فرآیند هیراد" class="aspect-[2.3/1] w-full rounded-xl object-cover" loading="lazy" />
          </div>
          <div class="mt-6 grid grid-cols-2 sm:grid-cols-4">
            <div v-for="(feature, index) in features" :key="feature.title" class="relative flex flex-col items-center px-2 py-3 text-center">
              <span v-if="index" class="absolute right-0 top-1/2 hidden h-14 -translate-y-1/2 border-r border-base-300 sm:block" />
              <component :is="feature.icon" class="size-8 text-primary" :stroke-width="1.55" />
              <h3 class="mt-3 text-xs font-bold leading-6 text-base-content">{{ feature.title }}</h3>
              <p class="mt-1 text-[11px] leading-5 text-base-content/50">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10 h-px bg-primary" />

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
  Phone,
  Send,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck
} from 'lucide-vue-next'

import LogoWide from '~/assets/Logo-wide.png'
import FooterBackground from '~/assets/Footer-bg.png'
import FooterPainting from '~/assets/footer-painting.png'
import contactData from '~/data/contact.json'

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

const primaryPhone = contactData.phones.find(item => item.primary) ?? null
const mobilePhone = contactData.phones.find(item => item.label.toString().includes('تلفن همراه')) ?? null
const primaryEmail = contactData.emails.find(item => item.primary) ?? null

const items: FooterItem[] = [
  { label: 'صفحه اصلی', to: '/', icon: House },
  { label: 'محصولات', emit: 'open-drawer', icon: ShoppingBag },
  { label: 'مقالات و اخبار', to: '/blog', icon: Newspaper },
  { label: 'درباره ما', to: '/about', icon: Info },
  { label: 'تماس با ما', to: '/contact', icon: Phone }
]

const socialIconMap = {
  whatsapp: MessageCircleMore,
  telegram: Send,
  instagram: Instagram,
  bale: MessageCircleCheck,
  rubika: MessageCircleMore
}

const socials: SocialItem[] = [
  ...(primaryEmail ? [{ label: 'ایمیل', href: primaryEmail.href, icon: Mail }] : []),
  ...contactData.socials.slice(0, 4).map(item => ({
    label: item.label,
    href: item.href,
    icon: socialIconMap[item.platform as keyof typeof socialIconMap]
  }))
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
      h('div', { class: 'flex flex-col items-start text-right' }, [
        h(
          'h2',
          {
            class: 'text-base font-bold tracking-normal text-base-content'
          },
          props.title
        ),
        h('span', {
          class: 'mt-4 block h-0.5 w-10 rounded-full bg-primary'
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
