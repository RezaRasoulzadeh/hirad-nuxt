<template>
  <footer class="border-t border-neutral-200 dark:border-neutral-800 bg-base-200/50">
    <div class="mx-auto max-w-[1920px] px-4 py-12 sm:px-6 xl:px-20 footer sm:footer-horizontal justify-between items-start gap-8">
      <aside class="space-y-4 max-w-sm">
        <img :src="LogoWide" alt="Hirad Logo" class="h-12 w-auto dark:brightness-110" />
        <p class="text-sm text-base-content/70 leading-relaxed">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
        </p>
      </aside>

      <nav>
        <h6 class="footer-title opacity-100 font-bold mb-4 text-sm text-base-content">دسترسی سریع</h6>
        <div class="flex flex-col gap-2.5 text-sm text-base-content/80">
          <NuxtLink v-for="item in items" :key="item.to" :to="item.to" class="link link-hover flex items-center gap-1.5 group">
            <component :is="item.icon" class="size-4 opacity-70 group-hover:scale-110 transition-transform duration-300" />
            {{ item.label }}
          </NuxtLink>
        </div>
      </nav>

      <nav>
        <h6 class="footer-title opacity-100 font-bold mb-4 text-sm text-base-content">ارتباط با ما</h6>
        <div class="flex flex-col gap-3 text-sm text-base-content/80">
          <div class="flex items-center gap-2">
            <Phone class="size-4" />
            <span dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</span>
          </div>
          <div class="flex items-center gap-2">
            <Mail class="size-4" />
            <span>info@hirad.com</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPin class="size-4" />
            <span>تهران، خیابان آزادی</span>
          </div>
        </div>
      </nav>
    </div>

    <div class="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-base-content/50">
      <p>© {{ new Date().getFullYear() }} هیراد. تمامی حقوق محفوظ است.</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { House, Info, Newspaper, Phone, ShoppingBag, Mail, MapPin } from 'lucide-vue-next';
import LogoWide from '~/assets/Logo-wide.png'

const items = [
  { label: 'صفحه اصلی', to: '/', icon: House },
  { label: 'محصولات', to: '/products', icon: ShoppingBag },
  { label: 'اخبار و مقالات', to: '/news', icon: Newspaper },
  { label: 'درباره ما', to: '/about', icon: Info },
  { label: 'تماس با ما', to: '/contact', icon: Phone }
]
</script>