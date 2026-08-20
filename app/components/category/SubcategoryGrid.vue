<template>
    <section class="container mx-auto px-4 lg:px-0 py-6">

        <template v-if="hasChildren">
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                <NuxtLink v-for="child in sortedChildren" :key="child.id" :to="`/categories/${child.slug}`"
                    class="group flex flex-col items-center text-center gap-3 bg-base-100 border border-base-300 hover:border-dashed hover:border-primary rounded-3xl p-4 transition-all duration-200 hover:-translate-y-0.5">
                    <div
                        class="size-24 rounded-2xl bg-base-200 flex items-center justify-center transition-colors overflow-hidden">
                        <img :src="child.image_url ? resolveUrl(child.image_url) : placeholderImg" :alt="child.name"
                            :data-error="!child.image_url ? 'true' : undefined" @error="handleImgError"
                            class="size-16 object-contain transition-all group-hover:not-data-error:filter-[invert(21%)_sepia(41%)_saturate(2097%)_hue-rotate(312deg)_brightness(91%)_contrast(97%)]" loading="lazy" />
                    </div>
                    <div>
                        <p class="font-bold text-base-content group-hover:text-primary transition-colors leading-snug">
                            {{ child.name }} | {{ child.meta_title ?? "" }}
                        </p>
                        <p class="text-xs text-base-content/50 font-sans mt-0.5">
                            {{ child.meta_title || '' }}
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </template>

        <template v-else>
            <ProductList :products="products" :total="total" :pending="pending" :error="error" :has-more="hasMore"
                :resolve-url="resolveUrl" @retry="$emit('retry')" @load-more="$emit('load-more')" />
        </template>

    </section>
</template>

<script setup lang="ts">
import placeholderImg from '~/assets/placeholder.png'
import type { Category } from '~/composables/useCategories'
import type { Product } from '~/composables/useProductList'
import ProductList from '~/components/product/ProductList.vue'

defineProps<{
    hasChildren: boolean
    sortedChildren: Category[]
    resolveUrl: (path?: string | null) => string
    products: Product[]
    total: number
    pending: boolean
    error: Error | null
    hasMore: boolean
}>()

defineEmits<{
    retry: []
    'load-more': []
}>()

const handleImgError = (e: Event) => {
    const target = e.target as HTMLImageElement
    if (target.src !== placeholderImg) {
        target.src = placeholderImg
        target.setAttribute('data-error', 'true')
    }
}
</script>
