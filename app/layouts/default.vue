<template>
  <div dir="rtl" class="flex min-h-screen flex-col bg-base-100 text-base-content font-sans">
    
    <header class="sticky top-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-base-100/80 backdrop-blur-md transition-colors duration-300">
      <div class="mx-auto max-w-[1920px] px-4 sm:px-6 xl:px-20 navbar h-18 justify-between gap-4">
        
        <div class="navbar-start w-auto shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <img :src="LogoWide" alt="Hirad Logo" class="h-12 w-auto select-none object-contain dark:brightness-110" loading="eager" />
          </NuxtLink>
        </div>

        <div class="navbar-center hidden md:flex grow justify-center h-full items-center">
          <ul class="menu menu-horizontal px-1 gap-4 font-medium h-full items-center">
            <li v-for="item in items" :key="item.to" class="h-full flex items-center">
              <NuxtLink 
                :to="item.to" 
                class="h-full px-4 pt-2.5 rounded-none text-base-content hover:bg-primary/5 hover:text-primary hover:border-primary border-b-2 border-transparent transition-all duration-300 ease-in-out gap-2 group" 
                active-class="!text-primary"
              >
                <component :is="item.icon" class="size-4 transition-transform duration-300 group-hover:scale-110" />
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="navbar-end w-auto shrink-0 flex items-center gap-3">
          <button @click="toggleTheme" class="btn btn-ghost btn-circle swap swap-rotate" aria-label="Toggle Theme">
            <Sun v-if="isDark" class="size-5" />
            <Moon v-else class="size-5" />
          </button>

          <button class="btn btn-neutral btn-sm hidden sm:inline-flex gap-2">
            <User class="size-4" />
            ورود / ثبت‌نام
          </button>

          <div class="dropdown dropdown-end md:hidden">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
              <Menu class="size-5" />
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-xl z-1 w-56 p-4 shadow-lg border border-neutral-200 dark:border-neutral-800 gap-2 mt-2">
              <li v-for="item in items" :key="item.to">
                <NuxtLink 
                  :to="item.to" 
                  class="p-3 text-base rounded-none text-base-content border-0 hover:bg-primary/5 transition-all duration-300 ease-in-out" 
                  active-class="!text-primary border-s-2 bg-primary/5"
                >
                  <component :is="item.icon" class="size-5" />
                  {{ item.label }}
                </NuxtLink>
              </li>
              <div class="divider my-1"></div>
              <li>
                <button class="btn btn-primary btn-block gap-2 text-primary-content">
                  <User class="size-4" />
                  ورود / ثبت‌نام
                </button>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </header>

    <main class="grow">
      <slot />
    </main>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { House, Info, Newspaper, Phone, ShoppingBag, Sun, Moon, Menu, User, Mail, MapPin } from 'lucide-vue-next';
import LogoWide from '~/assets/Logo-wide.png'

const items = [
  { label: 'صفحه اصلی', to: '/', icon: House },
  { label: 'محصولات', to: '/products', icon: ShoppingBag },
  { label: 'اخبار و مقالات', to: '/news', icon: Newspaper },
  { label: 'درباره ما', to: '/about', icon: Info },
  { label: 'تماس با ما', to: '/contact', icon: Phone }
]

const isDark = ref(false)

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  const themeName = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', themeName)
  localStorage.setItem('theme', themeName)
}
</script>