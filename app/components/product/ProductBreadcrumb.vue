<template>
  <div class="container mx-auto px-4 lg:px-0 pt-6 pb-2" dir="rtl">
    <nav class="breadcrumbs text-sm text-base-content/50">
      <ul>
        <li v-if="parentCategory">
          <NuxtLink :to="`/categories/${parentCategory.slug}`" class="hover:text-primary transition-colors">
            {{ parentCategory?.name ?? ""}}
          </NuxtLink>
        </li>
        <li v-if="currentCategory">
          <NuxtLink :to="`/categories/${currentCategory.slug}`" class="hover:text-primary transition-colors">
            {{ currentCategory?.name }} | {{ currentCategory?.meta_title }}
          </NuxtLink>
        </li>
        <li class="text-base-content font-semibold">
          {{ productName }} | {{ productMeta ?? "" }}
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
export interface BreadcrumbCategory {
  name: string
  slug: string
  meta_title?: string | null
}

defineProps<{
  parentCategory?: BreadcrumbCategory | null
  currentCategory?: BreadcrumbCategory | null
  productName?: string
  productMeta?: string
}>()
</script>