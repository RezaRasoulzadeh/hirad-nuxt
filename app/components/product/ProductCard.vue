<template>
  <div
    class="card card-border border-base-300 bg-base-200 rounded-3xl overflow-hidden flex flex-col md:flex-row md:h-72"
  >
    <!-- Image -->
    <NuxtLink
      :to="`/product/${item.slug}`"
      class="md:w-1/4 shrink-0 overflow-hidden"
    >
      <img
        v-if="primaryImage"
        :src="primaryImage"
        :alt="item.short_description?.name_fa ?? item.name"
        loading="lazy"
        class="w-full h-48 md:h-full object-cover object-center"
      />
      <div
        v-else
        class="w-full h-48 md:h-full bg-base-200 flex items-center justify-center text-base-content/30 text-sm"
      >
        تصویر موجود نیست
      </div>
    </NuxtLink>

    <!-- Body -->
    <div class="flex flex-col flex-1 p-5 gap-3">

      <!-- SKU + Name -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          class="flex items-center gap-1 text-primary font-semibold text-sm cursor-copy"
          :title="'کپی کد: ' + item.sku"
          @click="copyToClipboard(item.sku)"
        >
          <Copy class="size-4" />
          <span class="pt-1">{{ item.sku }}</span>
        </button>
        <span
          v-if="copied"
          class="text-xs text-primary"
        >کپی شد!</span>
        <NuxtLink
          :to="`/product/${item.slug}`"
          class="font-bold text-xl text-base-content hover:text-primary transition-colors leading-snug"
        >
          {{ item.short_description?.name_fa ?? item.name }} | 
          <span class="text-lg">{{ item.short_description?.name ?? item.name }}</span>
        </NuxtLink>
      </div>

      <!-- Description -->
      <p
        v-if="item.short_description?.description_fa"
        class="text-sm text-base-content/70 line-clamp-2 text-justify"
      >
        {{ item.short_description.description_fa }}
      </p>

      <!-- Features -->
      <div
        v-if="item.short_description?.features_fa?.length"
        class="grid grid-cols-1 md:grid-cols-3 gap-2"
      >
        <div
          v-for="(feature, i) in item.short_description.features_fa.slice(0, 6)"
          :key="i"
          class="bg-base-300 rounded-xl px-3 py-2"
        >
          <p class="text-xs font-bold text-base-content/70">
            {{ Object.keys(feature)[0] }}
          </p>
          <p class="text-xs text-base-content/60">
            {{ Object.values(feature)[0] }}
          </p>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Price + Actions -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

        <!-- Price -->
        <div class="flex flex-col items-start">
          <template v-if="item.price && item.price !== 0">
            <span
              v-if="item.discount_price && item.discount_price > 0"
              class="text-sm text-base-content/40 line-through"
            >
              {{ formatPrice(item.price) }}
            </span>
            <span class="text-primary font-bold text-lg">
              {{ formatPrice(effectivePrice) }}
            </span>
          </template>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <NuxtLink
            :to="`/product/${item.slug}`"
            class="btn btn-primary rounded-xl py-3 min-w-42 flex-1 md:flex-none gap-1 outline-1 outline-offset-2 outline-dashed outline-transparent hover:outline-primary transition-all"
          >
            <ScanText class="size-4" />
            مشاهده محصول
          </NuxtLink>
          <button class="btn btn-dash btn-primary py-3 min-w-42 rounded-xl flex-1 md:flex-none gap-1">
            <PhoneCall class="size-4" />
            مشاوره با کارشناسان
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Copy, PhoneCall, ScanText } from 'lucide-vue-next'
import type { Product } from '~/composables/useProductList'

const props = defineProps<{ item: Product; resolveUrl: (path?: string | null) => string }>()

const copied = ref(false)

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 1200)
}

const effectivePrice = computed(() => {
  const { price, discount_price } = props.item
  return discount_price && discount_price > 0 ? price - discount_price : price
})

const formatPrice = (price: number): string => {
  return `${new Intl.NumberFormat('fa-IR').format(price)} ریال`
}

const primaryImage = computed(() => {
  const images = props.item.short_description?.images
  if (!images?.length) return ''
  const primary = images.find(img => img.is_primary) ?? images[0]
  return primary?.image_url ? props.resolveUrl(primary.image_url) : ''
})
</script>