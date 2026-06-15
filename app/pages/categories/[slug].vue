<template>
  <!-- Loading -->
  <div v-if="pending" class="min-h-screen flex items-center justify-center">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <!-- Error -->
  <div v-else-if="pageError || !pageData"
    class="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
    <div class="bg-error/10 rounded-full p-5">
      <WifiOff class="size-8 text-error" />
    </div>
    <p class="text-base-content font-bold text-lg">خطا در دریافت اطلاعات</p>
    <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
    <button class="btn btn-sm btn-error btn-soft" @click="refresh()">تلاش مجدد</button>
  </div>

  <!-- Page -->
  <div v-else dir="rtl" class="min-h-screen">

    <div v-if="parentCategory" class="container mx-auto px-4 lg:px-8 pt-6 pb-2">
      <nav class="breadcrumbs text-sm text-base-content/50">
        <ul>
          <li>
            <NuxtLink :to="`/categories/${parentCategory.slug}`" class="hover:text-primary transition-colors">
              {{ parentCategory.name || parentCategory.meta_title }}
            </NuxtLink>
          </li>
          <li class="text-base-content font-semibold">
            {{ pageData.title }} | {{ pageData.meta_title }}
          </li>
        </ul>
      </nav>
    </div>

    <CategoryHero :title="pageData.title" :cover-image-url="resolveUrl(pageData.cover_image_url)"
      :hero="pageData.content.hero" />

    <SubcategoryGrid :has-children="hasChildren" :sorted-children="sortedChildren" :resolve-url="resolveUrl"
      :products="products" :total="total" :pending="productsPending" :error="productsError" :has-more="hasMore"
      @retry="refreshProducts" @load-more="loadMore" />

    <CategoryBanner v-if="pageData.content?.banner" :banner="pageData.content.banner" :resolve-url="resolveUrl" />

    <ApplicationsSection v-if="pageData.content?.applications?.length" :items="pageData.content.applications"
      :resolve-url="resolveUrl" />

    <AskForQuote class="mb-12" />
    <FaqSection v-if="pageData.content?.faq?.length" :items="pageData.content.faq" />
    <WhyChooseUs />

  </div>
</template>

<script setup lang="ts">
import { WifiOff, ChevronLeft } from 'lucide-vue-next'
import { useCategoryPage } from '~/composables/useCategoryPage'
import { useCategoryTree } from '~/composables/useCategoryTree'
import { useProductList } from '~/composables/useProductList'

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

const {
  products,
  total,
  pending: productsPending,
  error: productsErrorRef,
  hasMore,
  loadMore,
  refresh: refreshProducts,
} = useProductList(slug)

const productsError = computed<Error | null>(() => {
  const error = productsErrorRef.value
  return ((error ?? null) as Error | null)
})

await fetchCategories()
</script>