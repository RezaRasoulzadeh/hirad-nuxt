<template>
  <div dir="rtl" class="min-h-screen bg-base-100 text-base-content font-sans">
    <input id="layout-drawer" type="checkbox" class="drawer-toggle" aria-label="منوی کشویی محصولات"
      v-model="isDrawerOpen" />

    <div class="drawer-content flex flex-col min-h-screen">
      <LayoutHeader @open-drawer="isDrawerOpen = true" />

      <main class="grow w-full">
        <slot />
      </main>

      <LayoutFooter @open-drawer="isDrawerOpen = true"/>
    </div>

    <LayoutDrawer @close="isDrawerOpen = false" :loading="loading" :categories="categories" />

    <GlobalToast />
    <FloatingContact />
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'
import GlobalToast from '~/components/shared/GlobalToast.vue'
import FloatingContact from '~/components/shared/FloatingContact.vue'

interface ApiResponse {
  code: number
  success: boolean
  message: string
  data: Category[]
}

const isDrawerOpen = useState<boolean>('productsDrawerOpen', () => false)

const config = useRuntimeConfig()
const baseUrl = config?.public?.apiBase || '/api'

const categories = useState<Category[]>('categories', () => [])
const loading = useState<boolean>('categories-loading', () => false)

await callOnce('layout-categories', async () => {
  loading.value = true
  try {
    const response = await $fetch<ApiResponse>(`${baseUrl}/categories`)
    categories.value = response?.success && Array.isArray(response.data) ? response.data : []
  } catch {
    categories.value = []
  } finally {
    loading.value = false
  }
})
</script>

<style>
@media (max-width: 767px) {
  .drawer-side {
    align-items: flex-end;
  }

  .drawer-toggle~.drawer-side .drawer-overlay+* {
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .drawer-toggle:checked~.drawer-side .drawer-overlay+* {
    transform: translateY(0);
  }
}
</style>