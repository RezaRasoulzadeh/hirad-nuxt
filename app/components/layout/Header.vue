<template>
  <header
    class="sticky top-0 z-40 border-b border-neutral-200 dark:border-neutral-800 bg-base-100/80 backdrop-blur-md border-t-4 border-t-primary transition-colors duration-300">
    <div class="mx-auto max-w-[1920px] px-4 lg:px-16 navbar h-18 justify-between gap-4">

      <div class="navbar-start w-auto shrink-0">
        <NuxtLink to="/"
          class="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <img :src="LogoWide" alt="Hirad Logo" class="h-12 w-auto select-none object-contain dark:brightness-110"
            loading="eager" />
        </NuxtLink>
      </div>

      <div class="navbar-center hidden md:flex grow justify-center h-full items-center min-w-0">
        <ul class="menu menu-horizontal px-1 gap-4 font-medium h-full items-center whitespace-nowrap">
          <li class="h-full flex items-center">
            <NuxtLink to="/"
              class="h-full px-4 pt-2.5 rounded-none text-base-content hover:bg-primary/5 hover:text-primary hover:border-primary border-b-2 border-transparent transition-all duration-300 ease-in-out gap-2 group"
              active-class="!text-primary">
              <House class="size-4 transition-transform duration-300 group-hover:scale-110" />
              صفحه اصلی
            </NuxtLink>
          </li>

          <li class="h-full flex items-center">
            <button @click="$emit('open-drawer')"
              class="h-full px-4 pt-2.5 rounded-none text-base-content hover:bg-primary/5 hover:text-primary hover:border-primary border-b-2 border-transparent transition-all duration-300 ease-in-out gap-2 group layout-nav-btn">
              <ShoppingBag class="size-4 transition-transform duration-300 group-hover:scale-110" />
              محصولات
            </button>
          </li>

          <li class="h-full flex items-center">
            <NuxtLink to="/news"
              class="h-full px-4 pt-2.5 rounded-none text-base-content hover:bg-primary/5 hover:text-primary hover:border-primary border-b-2 border-transparent transition-all duration-300 ease-in-out gap-2 group"
              active-class="!text-primary">
              <Newspaper class="size-4 transition-transform duration-300 group-hover:scale-110" />
              اخبار و مقالات
            </NuxtLink>
          </li>

          <li class="h-full flex items-center">
            <div class="relative h-full flex items-center group">
              <div tabindex="0" role="button"
                class="h-full px-4 rounded-none text-base-content border-transparent transition-all duration-300 ease-in-out flex items-center gap-2 group-hover:text-primary">
                <Info class="size-4 transition-transform duration-300 group-hover:scale-110" />
                درباره ما
                <ChevronDown class="size-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180" />
              </div>

              <div class="absolute top-full left-0 right-0 hidden group-hover:block pt-2 z-50">
                <ul
                  class="menu bg-base-100 rounded-xl w-56 p-2 shadow-lg border border-neutral-200 dark:border-neutral-800 gap-0.5">
                  <li>
                    <NuxtLink to="/about/company" active-class="!text-primary bg-primary/5"
                      class="py-2.5 focus:bg-transparent text-right">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium">معرفی شرکت</span>
                        <span class="text-xs text-base-content/40 font-normal">About Company</span>
                      </div>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/about/certificates" active-class="!text-primary bg-primary/5"
                      class="py-2.5 focus:bg-transparent text-right">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium">گواهینامه‌ها و استانداردها</span>
                        <span class="text-xs text-base-content/40 font-normal">Certificates</span>
                      </div>
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/about/catalogue" active-class="!text-primary bg-primary/5"
                      class="py-2.5 focus:bg-transparent text-right">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium">کاتالوگ محصولات</span>
                        <span class="text-xs text-base-content/40 font-normal">Catalogue</span>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li class="h-full flex items-center">
            <NuxtLink to="/contact"
              class="h-full px-4 pt-2.5 rounded-none text-base-content hover:bg-primary/5 hover:text-primary hover:border-primary border-b-2 border-transparent transition-all duration-300 ease-in-out gap-2 group"
              active-class="!text-primary">
              <Phone class="size-4 transition-transform duration-300 group-hover:scale-110" />
              تماس با ما
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="navbar-end w-auto shrink-0 flex items-center gap-3 justify-end">

        <Search />

        <button @click="toggleTheme" class="btn btn-ghost btn-circle swap swap-rotate" aria-label="Toggle Theme">
          <Sun v-if="isDark" class="size-5" />
          <Moon v-else class="size-5" />
        </button>

        <div class="dropdown dropdown-end md:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle" aria-label="منوی اصلی">
            <Menu class="size-5" />
          </div>
          <ul tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-xl z-50 w-56 p-3 shadow-lg border border-neutral-200 dark:border-neutral-800 gap-1 mt-2">
            <li>
              <NuxtLink to="/" class="p-3 text-base text-base-content hover:bg-primary/5 transition-all duration-300"
                active-class="!text-primary border-s-2 bg-primary/5">
                <House class="size-5" />
                صفحه اصلی
              </NuxtLink>
            </li>
            <li>
              <button @click="$emit('open-drawer')"
                class="p-3 text-base text-right text-base-content border-0 hover:bg-primary/5 transition-all duration-300 w-full flex items-center gap-5">
                <ShoppingBag class="size-5" />
                محصولات
              </button>
            </li>
            <li>
              <NuxtLink to="/news"
                class="p-3 text-base text-base-content hover:bg-primary/5 transition-all duration-300"
                active-class="!text-primary border-s-2 bg-primary/5">
                <Newspaper class="size-5" />
                اخبار و مقالات
              </NuxtLink>
            </li>
            <li>
              <details class="w-full group">
                <summary
                  class="p-3 text-base text-base-content hover:bg-primary/5 transition-all duration-300 list-none flex items-center justify-between w-full select-none cursor-pointer">
                  <div class="flex items-center gap-5">
                    <Info class="size-5" />
                    <span>درباره ما</span>
                  </div>
                </summary>
                <ul class="mr-4 ml-0 pr-3 pl-0 border-r border-neutral-200 dark:border-neutral-800 gap-1 my-1">
                  <li>
                    <NuxtLink to="/about/company" active-class="!text-primary bg-primary/5"
                      class="flex flex-col items-start gap-0"><span>معرفی شرکت</span></NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/about/certificates" active-class="!text-primary bg-primary/5"
                      class="flex flex-col items-start gap-0"><span>گواهینامه‌ها</span></NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/about/catalogue" active-class="!text-primary bg-primary/5"
                      class="flex flex-col items-start gap-0"><span>کاتالوگ محصولات</span></NuxtLink>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <NuxtLink to="/contact"
                class="p-3 text-base text-base-content hover:bg-primary/5 transition-all duration-300"
                active-class="!text-primary border-s-2 bg-primary/5">
                <Phone class="size-5" />
                تماس با ما
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { House, Info, Newspaper, Phone, ShoppingBag, Sun, Moon, Menu, ChevronDown } from 'lucide-vue-next'
import LogoWide from '~/assets/Logo-wide.png'
import Search from '../shared/Search.vue'

defineEmits(['open-drawer'])

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