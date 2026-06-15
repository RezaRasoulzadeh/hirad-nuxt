<template>
  <section class="my-8 md:my-16">
    <div class="bg-base-200 w-full py-10">
      <div class="container mx-auto px-4 lg:px-0">
        <div class="flex flex-col md:flex-row gap-8 items-center">

          <div class="w-full order-2 md:order-1">
            <img
              :src="imageUrl"
              :alt="banner.title_fa"
              loading="lazy"
              class="w-full max-h-144 object-scale-down rounded-2xl"
            />
          </div>

          <div class="w-full order-1 md:order-2 flex flex-col gap-4">
            <h3 class="text-2xl md:text-3xl font-black text-base-content">
              {{ banner.title_fa }}
            </h3>

            <div
              v-if="banner.items?.length"
              class="rounded-2xl border border-base-300 overflow-hidden bg-base-100"
            >
              <div
                v-for="(item, idx) in banner.items"
                :key="idx"
              >
                <div class="bg-primary px-4 py-3 flex items-center gap-3">
                  <span class="size-6 rounded-full bg-white text-primary text-xs font-black flex items-center justify-center shrink-0">
                    {{ idx + 1 }}
                  </span>
                  <h4 class="text-primary-content font-bold text-sm">
                    {{ item.sub_title_fa }}
                  </h4>
                </div>
                <div class="px-4 py-3 text-sm text-base-content/80 border-b border-base-200">
                  {{ item.description_fa }}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PageContent } from '~/composables/useCategoryPage'

const props = defineProps<{
  banner: NonNullable<PageContent['banner']>
  resolveUrl: (path?: string | null) => string
}>()

const imageUrl = computed(() => props.resolveUrl(props.banner.image))
</script>