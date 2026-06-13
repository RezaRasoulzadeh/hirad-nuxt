<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useCategories } from '~/composables/useCategories'

const route = useRoute()
const config = useRuntimeConfig()
const baseURL = config.public.baseURL as string

const { categories, loadCategories, getCategoryBySlug } = useCategories()

// SSR-Safe data pre-fetching during node compilation pipeline execution
if (!categories.value.length) {
  await loadCategories()
}

// Compute the current active clean route key slug
const currentSlug = computed(() => {
  const path = route.path.replace(/^\//, '')
  return path === '' ? '' : path
})

const activeCategory = computed(() => getCategoryBySlug(currentSlug.value))

// Determine if the contextual panel should render based on active path configurations
const showSidebar = computed(() => !!activeCategory.value?.has_sidebar)

// Recursive dynamic node parser tailored for native Nuxt UI menu data contracts
const mapItemToMenu = (item: any): NavigationMenuItem => {
  const hasChildren = !!item.children?.length
  
  return {
    label: item.name,
    description: item.meta_title ?? undefined,
    to: !hasChildren ? (item.slug === '' ? '/' : `/${item.slug}`) : undefined,
    avatar: item.image_url ? { src: `${baseURL}${item.image_url}` } : undefined,
    icon: !item.image_url && !hasChildren ? 'i-lucide-dot' : undefined,
    children: hasChildren ? item.children.map((c: any) => mapItemToMenu(c)) : undefined
  }
}

// Transform the active category sub-tree for the aside bar layout panel
const asideNavigationItems = computed<NavigationMenuItem[]>(() => {
  if (!activeCategory.value) return []

  // If the current category has child variants, make them the root. Otherwise fallback to siblings.
  const coreSourceNodes = activeCategory.value.children?.length
    ? activeCategory.value.children
    : categories.value.find(c => c.id === activeCategory.value?.parent_id)?.children ?? []

  return coreSourceNodes.map(item => mapItemToMenu(item))
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-neutral-900 antialiased font-sans text-gray-900 dark:text-neutral-100" dir="rtl">
    
    <AppHeader />

    <div class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        
        <aside 
          v-if="showSidebar && asideNavigationItems.length" 
          class="w-full md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-l border-gray-200 dark:border-neutral-800 pb-6 md:pb-0 md:pl-6"
        >
          <div class="sticky top-24">
            <div class="mb-4 px-3">
              <h2 class="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                {{ activeCategory?.name }}
              </h2>
            </div>

            <UNavigationMenu
              orientation="vertical"
              :items="asideNavigationItems"
              class="w-full"
              :ui="{
                root: 'w-full text-right',
                base: 'py-3 px-4 text-sm font-medium transition-colors duration-200 rounded-lg',
                active: 'text-brand bg-brand-50/50 dark:bg-brand-950/20 font-semibold',
                inactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800/40 hover:text-brand'
              }"
            />
          </div>
        </aside>

        <main class="flex-1 min-w-0">
          <slot />
        </main>

      </div>
    </div>

    <AppFooter />

  </div>
</template>