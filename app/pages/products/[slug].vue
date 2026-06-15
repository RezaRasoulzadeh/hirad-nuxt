<template>
  <div>
    <div v-if="pending" class="min-h-screen flex items-center justify-center bg-base-100">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error || !product"
      class="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4 bg-base-100" dir="rtl">
      <div class="bg-error/10 rounded-full p-5">
        <WifiOff class="size-8 text-error" />
      </div>
      <p class="text-base-content font-bold text-lg">خطا در دریافت اطلاعات</p>
      <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
      <button class="btn btn-sm btn-error btn-soft" @click="refresh?.()">تلاش مجدد</button>
    </div>

    <div v-else class="bg-base-200/30 min-h-screen pb-16">
      <ProductBreadcrumb 
        :parentCategory="lineage.parentCategory" 
        :currentCategory="lineage.currentCategory"
        :productName="product?.short_description?.name_fa || 'محصول'" 
        :product-meta="product?.short_description?.name || 'محصول'" 
      />

      <main class="mt-4 flex flex-col gap-10">
        <div class="container mx-auto px-4 lg:px-0 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          <div class="w-full">
            <ProductGallery :images="sortedImages || []" v-model:activeImage="activeImage" />
          </div>

          <div class="w-full flex flex-col gap-6">
            <ProductInfo 
              :sku="product?.sku || '---'" 
              :name="product?.name || '---'"
              :nameFa="product?.short_description?.name_fa"
              :description="product?.short_description?.description || ''"
              :descriptionFa="product?.short_description?.description_fa" 
              :copiedSku="copiedSku"
              @copySku="copyToClipboard(product?.sku || '')" 
            />

            <ProductFeatures
              :features="product?.short_description?.features_fa || product?.short_description?.features || []" 
            />

            <div class="card bg-base-100 border border-base-200 shadow-sm" dir="rtl">
              <div class="card-body p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="flex flex-col gap-1 items-center sm:items-start">
                  <span class="text-xs text-base-content/60 font-bold">قیمت واحد محصول:</span>
                  <span class="text-xl font-black text-primary">
                    {{ formatPrice(product?.price) }}
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                  <a href="tel:+989352557163" class="btn btn-primary outline-1 outline-offset-3 outline-dashed outline-transparent hover:outline-primary text-base-content flex items-center gap-2 py-6 rounded-xl">
                    <Phone class="size-5"/>
                    استعلام قیمت و موجودی
                  </a>
                  <a href="tel:+982166420839" class="btn btn-dash btn-primary text-base-content flex items-center gap-2 py-6 rounded-xl">
                    تماس با کارشناس فنی
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="container mx-auto px-4 lg:px-0 mt-4">
          <ProductTabs 
            v-model:activeTab="activeTab"
            :specifications="product?.long_description?.specifications || []"
            :explanations="product?.long_description?.explanation || []" 
          />
        </div>

        <SharedApplications 
          :items="product?.long_description?.applications || []" 
          :resolveUrl="resolveUrl"
          variant="list" 
          :showHeading="true" 
        />
        <div class="w-full">
        <SharedFaq 
          v-if="product?.long_description?.faq?.length" :items="product?.long_description?.faq || []" 
        />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Phone, WifiOff } from 'lucide-vue-next'
import { useProduct } from '~/composables/useProduct'
import { useRuntimeConfig, useAsyncData } from '#app'
import { useCategories } from '~/composables/useCategories'
import placeholderImg from '~/assets/placeholder.png'

const config = useRuntimeConfig()
const apiBase = (config.public.apiBase as string) || ''

const { fetchCategories, getCategoryLineage } = useCategories()

const {
  product,
  pending,
  error,
  refresh,
  activeImage,
  copiedSku,
  activeTab,
  sortedImages,
  copyToClipboard,
  formatPrice
} = useProduct()

await useAsyncData('init-categories', () => fetchCategories())

const lineage = computed(() => {
  const categoryId = product.value?.category_id
  if (!categoryId) return { currentCategory: null, parentCategory: null }
  return getCategoryLineage(categoryId).value
})

function resolveUrl(path?: string | null): string {
  if (!path) return placeholderImg
  if (path.startsWith('http')) return path
  return `${apiBase}${path}`
}
</script>