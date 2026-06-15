<template>
  <!-- Loading -->
  <div v-if="pending" class="min-h-screen flex items-center justify-center">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <!-- Error -->
  <div
    v-else-if="pageError || !pageData"
    class="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4"
  >
    <div class="bg-error/10 rounded-full p-5">
      <WifiOff class="size-8 text-error" />
    </div>
    <p class="text-base-content font-bold text-lg">خطا در دریافت اطلاعات</p>
    <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
    <button class="btn btn-sm btn-error btn-soft" @click="refresh()">تلاش مجدد</button>
  </div>

  <!-- Page -->
  <div v-else dir="rtl" class="min-h-screen">

    <!-- Breadcrumb -->
    <div class="container mx-auto px-4 lg:px-8 pt-6 pb-2" v-if="parentCategory">
      <nav class="text-sm flex items-center gap-2 text-base-content/50">
        <NuxtLink
          :to="`/categories/${parentCategory.slug}`"
          class="hover:text-primary transition-colors"
        >
          {{ parentCategory.meta_title || parentCategory.name }}
        </NuxtLink>
        <ChevronLeft class="size-3.5" />
        <span class="text-base-content font-semibold">
          {{ pageData.title }} | {{ pageData.meta_title }}
        </span>
      </nav>
    </div>

    <CategoryHero
      :title="pageData.title"
      :cover-image-url="resolveUrl(pageData.cover_image_url)"
      :hero="pageData.content.hero"
    />

    <SubcategoryGrid
      :has-children="hasChildren"
      :sorted-children="sortedChildren"
      :resolve-url="resolveUrl"
    />

    <CategoryBanner
      v-if="pageData.content?.banner"
      :banner="pageData.content.banner"
      :resolve-url="resolveUrl"
    />

    <ApplicationsSection
      v-if="pageData.content?.applications?.length"
      :items="pageData.content.applications"
      :resolve-url="resolveUrl"
    />

    <AskForQuote class="mb-12" />

    <WhyChooseUs />

    <FaqSection
      v-if="pageData.content?.faq?.length"
      :items="pageData.content.faq"
    />

  </div>
</template>

<script setup lang="ts">
import { WifiOff, ChevronLeft } from 'lucide-vue-next'
import { useCategoryPage } from '~/composables/useCategoryPage'
import { useCategoryTree } from '~/composables/useCategoryTree'

import CategoryHero from '~/components/category/CategoryHero.vue'
import CategoryBanner from '~/components/category/CategoryBanner.vue'
import SubcategoryGrid from '~/components/category/SubcategoryGrid.vue'
import ApplicationsSection from '~/components/category/ApplicationsSection.vue'
import AskForQuote from '~/components/category/AskForQuote.vue'
import WhyChooseUs from '~/components/category/WhyChooseUs.vue'
import FaqSection from '~/components/category/FaqSection.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { pageData, pageError, pending, refresh, resolveUrl } = useCategoryPage(slug)

const { fetchCategories, parentCategory, hasChildren, sortedChildren } = useCategoryTree(slug)
await fetchCategories()
</script>