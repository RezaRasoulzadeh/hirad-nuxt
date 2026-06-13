<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

interface Category {
  id: string | number
  name: string
  slug: string
  is_visible: boolean
}

const categories = ref<Category[]>([]) 
const colorMode = useColorMode()
const showSidebar = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')

const searchInputRef = ref<{ input: HTMLInputElement } | null>(null)

// Map to NavigationMenuItem from @nuxt/ui
const headerItems = computed<NavigationMenuItem[]>(() => 
  categories.value
    .filter((i: Category) => i.is_visible)
    .map((item: Category) => ({
      label: item.name,
      onSelect: () => handleNavClick(item)
    }))
)

function handleNavClick(item: Category) {
  if (typeof shouldOpenSidebar === 'function' && shouldOpenSidebar(item)) {
    showSidebar.value = true
  } else {
    navigateTo(`/${item.slug}`)
  }
}

function toggleSearch() {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    nextTick(() => {
      searchInputRef.value?.input?.focus()
    })
  } else {
    searchQuery.value = ''
  }
}

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-gray-200 dark:border-neutral-800">
    <div class="h-1 bg-brand" />
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 gap-4">

      <!-- Logo -->
      <NuxtLink to="/" class="flex-shrink-0">
        <img src="~/assets/Logo-Small.png" alt="لوگو" class="h-10 w-auto" />
      </NuxtLink>

      <!-- Nav links (desktop) -->
      <nav class="hidden md:flex flex-1 justify-center">
        <UNavigationMenu :items="headerItems" />
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-3">

        <!-- Search -->
        <div class="flex items-center gap-2">
          <UInput
            v-if="showSearch"
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="جستجو..."
            dir="rtl"
            class="transition-all duration-300"
            :ui="{ root: 'rounded-xl' }"
          />
          <UButton
            :icon="showSearch ? 'i-lucide-x' : 'i-lucide-search'"
            color="neutral"
            variant="ghost"
            aria-label="Search"
            @click="toggleSearch"
          />
        </div>

        <!-- Dark mode -->
        <UButton
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          aria-label="Theme"
          @click="toggleColorMode"
        />

        <!-- Mobile menu -->
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="md:hidden"
          aria-label="Menu"
          @click="showSidebar = true"
        />
      </div>
    </div>
  </header>

  <AppNav v-if="showSidebar" :items="categories.filter((i: Category) => i.is_visible)" @close="showSidebar = false" />
</template>