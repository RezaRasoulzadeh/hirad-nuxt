<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-base-200/50" dir="rtl">
    <div
      class="mx-auto max-w-[1920px] px-6 py-12 xl:px-20 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 items-start">

      <aside class="space-y-5">
        <img :src="LogoWide" alt="Hirad Logo" class="h-28 w-auto dark:brightness-110" />
        <p class="text-sm text-base-content/70 leading-relaxed text-justify">
          شرکت تجهیز فرآیند هیراد از سال ۱۳۹۴ با شماره ثبت ۵۲۵۴۷۰ در تهران تأسیس شده و در زمینه تأمین و تدارک تجهیزات
          فنی و صنعتی برای صنایع نفت، گاز، پتروشیمی، نیروگاه‌ها و صنایع دارویی و غذایی فعالیت می‌کند.
        </p>
      </aside>

      <nav class="lg:ms-16">
        <h2 class="footer-title opacity-100 font-bold mb-4 text-base text-base-content tracking-normal">دسترسی سریع</h2>
        <div class="flex flex-col gap-3 text-base text-base-content/80">
          <template v-for="item in items" :key="item.label">
            <button v-if="item.emit" @click="$emit(item.emit)"
              class="link link-hover hover:text-primary flex items-center gap-2 group transition-colors duration-200 w-full text-right bg-transparent border-none p-0 cursor-pointer font-normal">
              <component :is="item.icon"
                class="size-5 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              {{ item.label }}
            </button>

            <NuxtLink v-else :to="item.to!"
              class="link link-hover hover:text-primary flex items-center gap-2 group transition-colors duration-200">
              <component :is="item.icon"
                class="size-5 opacity-70 group-hover:scale-110 transition-transform duration-300" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </div>
      </nav>

      <nav>
        <h2 class="footer-title opacity-100 font-bold mb-4 text-base text-base-content tracking-normal">ارتباط با ما
        </h2>
        <div class="flex flex-col gap-3.5 text-base text-base-content/80">
          <a href="tel:+982166420839"
            class="link link-hover hover:text-primary flex items-center gap-2 group transition-colors duration-200">
            <Phone class="size-5 opacity-70 group-hover:scale-110 transition-transform duration-300" />
            <span dir="ltr">۰۲۱-۶۶۴۲۰۸۳۹</span>
          </a>
          <a href="tel:+982166429816"
            class="link link-hover hover:text-primary flex items-center gap-2 group transition-colors duration-200">
            <Phone class="size-5 opacity-70 group-hover:scale-110 transition-transform duration-300" />
            <span dir="ltr">۰۲۱-۶۶۴۲۹۸۱۶</span>
          </a>
          <a href="tel:+989352557163"
            class="link link-hover hover:text-primary flex items-center gap-2 group transition-colors duration-200">
            <Smartphone class="size-5 opacity-70 group-hover:scale-110 transition-transform duration-300" />
            <span dir="ltr">۰۹۳۵-۲۵۵۷۱۶۳</span>
          </a>
          <div class="flex items-start gap-2 group">
            <MapPin class="size-5 mt-1 opacity-70 group-hover:scale-110 transition-transform duration-300 shrink-0" />
            <span class="leading-relaxed">تهران، خیابان ستارخان، خیابان نیایش، کوچه موثق نژاد، پلاک ۱، واحد یک</span>
          </div>
        </div>
      </nav>

      <nav>
        <h2 class="footer-title opacity-100 font-bold mb-4 text-base text-base-content tracking-normal">مجوزها و
          گواهینامه‌ها
        </h2>
        <div
          class="flex flex-wrap gap-4 bg-base-100 p-4 rounded-2xl border border-base-content/5 justify-center md:justify-start">
          <a href="#" target="_blank" rel="noopener noreferrer"
            class="w-20 h-20 bg-base-200 rounded-xl flex items-center justify-center hover:bg-base-300 transition-colors duration-200">
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer"
            class="w-20 h-20 bg-base-200 rounded-xl flex items-center justify-center hover:bg-base-300 transition-colors duration-200">
          </a>
        </div>

        <div class="mt-6">
          <h3 class="footer-title opacity-100 font-bold mb-3 text-sm text-base-content/40 tracking-normal text-center">
           هیراد در شبکه‌های اجتماعی و پیام‌رسان‌ها
          </h3>

          <div class="flex items-center gap-2.5 justify-center">
            <a v-for="social in socials" :key="social.label" :href="social.href" target="_blank"
              rel="noopener noreferrer"
              class="p-2.5 rounded-xl bg-base-200 text-base-content/70 hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200 group"
              :aria-label="social.label">
              <component :is="social.icon" class="size-5 group-hover:scale-110 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </nav>

    </div>

    <div class="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-sm text-base-content/50">
      <p>{{ new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false }) }} هیراد. تمامی حقوق محفوظ است.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { House, Info, Newspaper, Phone, Smartphone, ShoppingBag, MapPin, Linkedin, Send, Instagram, MessageCircleCheck, MessageCircleMore, Mail } from 'lucide-vue-next';
import LogoWide from '~/assets/Logo-wide.png'

defineEmits(['open-drawer'])

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

const items: FooterItem[] = [
  { label: 'صفحه اصلی', to: '/', icon: House },
  { label: 'محصولات', emit: 'open-drawer', icon: ShoppingBag },
  { label: 'اخبار و مقالات', to: '/news', icon: Newspaper },
  { label: 'درباره ما', to: '/about', icon: Info },
  { label: 'تماس با ما', to: '/contact', icon: Phone }
]

const socials: SocialItem[] = [
  { label: 'WhatsApp', href: '#', icon: MessageCircleMore },
  { label: 'Telegram', href: '#', icon: Send },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Bale', href: '#', icon: MessageCircleCheck },
  { label: 'Email', href: '#', icon: Mail }
]
</script>