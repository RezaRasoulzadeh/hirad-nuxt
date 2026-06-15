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
                            class="size-16 object-contain transition-all group-hover:not-data-error:filter-[invert(21%)_sepia(41%)_saturate(2097%)_hue-rotate(312deg)_brightness(91%)_contrast(97%)]"
                            loading="lazy" />
                    </div>
                    <div>
                        <p class="font-bold text-base-content group-hover:text-primary transition-colors leading-snug">
                            {{ child.name }}
                        </p>
                        <p class="text-xs text-base-content/40 font-sans mt-0.5">
                            {{ child.meta_title || '' }}
                        </p>
                    </div>
                </NuxtLink>
            </div>
        </template>

        <template v-else>
            <div class="flex items-center gap-3 mb-4">
                <p class="text-sm text-base-content/60">تعداد محصولات این دسته‌ب بندی:</p>
                <span class="text-primary font-bold text-sm">—</span>
            </div>
            <div class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
                <div class="bg-base-200 rounded-full p-5">
                    <Package class="size-8 text-base-content" />
                </div>
                <p class="text-base-content font-bold">محصولی یافت نشد</p>
                <p class="text-base-content/50 text-sm">محصولات این دسته‌بندی به زودی اضافه خواهند شد.</p>
            </div>
        </template>

    </section>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'
import placeholderImg from '~/assets/placeholder.png'
import type { Category } from '~/composables/useCategories'

defineProps<{
    hasChildren: boolean
    sortedChildren: Category[]
    resolveUrl: (path?: string | null) => string
}>()

const handleImgError = (e: Event) => {
    const target = e.target as HTMLImageElement
    if (target.src !== placeholderImg) {
        target.src = placeholderImg
        target.setAttribute('data-error', 'true')
    }
}
</script>