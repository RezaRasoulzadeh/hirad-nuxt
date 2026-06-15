<template>
  <!-- Skeleton (SSR + initial load) -->
  <section v-if="pending" class="container mx-auto px-4 lg:px-0 py-6 flex flex-col gap-4">
    <div class="skeleton h-5 w-40 rounded-xl" />
    <div
      v-for="n in 3"
      :key="n"
      class="flex flex-col md:flex-row gap-0 rounded-3xl overflow-hidden border border-base-300"
    >
      <!-- Image skeleton -->
      <div class="skeleton md:w-1/4 h-48 md:h-72 shrink-0 rounded-none" />
      <!-- Content skeleton -->
      <div class="flex flex-col gap-3 p-5 flex-1">
        <div class="skeleton h-4 w-32 rounded-lg" />
        <div class="skeleton h-5 w-3/4 rounded-lg" />
        <div class="skeleton h-4 w-full rounded-lg" />
        <div class="skeleton h-4 w-2/3 rounded-lg" />
        <div class="grid grid-cols-2 gap-2 mt-1">
          <div v-for="k in 4" :key="k" class="skeleton h-12 rounded-xl" />
        </div>
        <div class="flex-1" />
        <div class="flex justify-between items-center">
          <div class="skeleton h-6 w-24 rounded-lg" />
          <div class="flex gap-2">
            <div class="skeleton h-9 w-32 rounded-2xl" />
            <div class="skeleton h-9 w-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Error -->
  <section
    v-else-if="error"
    class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4"
  >
    <div class="bg-error/10 rounded-full p-5">
      <WifiOff class="size-8 text-error" />
    </div>
    <p class="text-base-content font-bold">خطا در دریافت محصولات</p>
    <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
    <button class="btn btn-sm btn-error btn-soft" @click="$emit('retry')">تلاش مجدد</button>
  </section>

  <!-- Empty -->
  <section
    v-else-if="!products.length"
    class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4"
  >
    <div class="bg-base-200 rounded-full p-5">
      <SearchX class="size-8 text-base-content" />
    </div>
    <p class="text-base-content font-bold">محصولی یافت نشد</p>
    <p class="text-base-content/50 text-sm">محصولات این دسته‌بندی به زودی اضافه خواهند شد.</p>
  </section>

  <!-- Products -->
  <section v-else class="container mx-auto px-4 lg:px-0 py-6 flex flex-col gap-6">

    <!-- Count -->
    <div class="flex items-center gap-2 text-sm text-base-content/60">
      <span>تعداد محصولات:</span>
      <span class="text-primary font-bold">{{ total.toLocaleString('fa-IR') }}</span>
    </div>

    <!-- List -->
    <div class="flex flex-col gap-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :item="product"
        :resolve-url="resolveUrl"
      />
    </div>

    <div v-if="hasMore" class="flex justify-center pt-2">
      <button
        class="btn btn-outline btn-primary rounded-2xl px-10"
        @click="$emit('load-more')"
      >
        نمایش بیشتر
      </button>
    </div>

  </section>
</template>

<script setup lang="ts">
import { WifiOff, SearchX } from 'lucide-vue-next'
import ProductCard from '~/components/product/ProductCard.vue'
import type { Product } from '~/composables/useProductList'

defineProps<{
  products: Product[]
  total: number
  pending: boolean
  error: Error | null
  hasMore: boolean
  resolveUrl: (path?: string | null) => string
}>()

defineEmits<{
  retry: []
  'load-more': []
}>()
</script>