<template>
  <div class="w-full min-h-screen bg-base-100 pb-20 rounded-2xl overflow-hidden border border-base-200 shadow-xs" dir="rtl">
    <div>
      <section class="relative container mx-auto px-6 lg:px-0 bg-base-100 flex flex-col lg:flex-row items-stretch overflow-hidden rounded-b-3xl">
        
        <div class="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-20 text-right z-10 order-first">
          <span class="badge badge-primary font-bold text-xs mb-4 px-3 py-2.5 rounded-md self-start">
            آخرین بروزرسانی: {{ formatDate(new Date().toISOString()) }}
          </span>
          <h1 class="text-3xl md:text-5xl font-black text-base-content mb-6 max-w-2xl leading-tight">
            {{ title }}
          </h1>
          <p class="text-base text-base-content/70 max-w-2xl leading-relaxed text-justify">
            {{ summary }}
          </p>
        </div>

        <div class="w-full lg:w-1/2 relative min-h-87.5 lg:min-h-[55vh] overflow-hidden order-last lg:order-0">
          <img
            v-if="coverImageUrl"
            :src="coverImageUrl"
            :alt="title"
            class="absolute inset-0 w-full h-full object-scale-down select-none"
            loading="eager"
          />
          <div v-else class="absolute inset-0 bg-base-200 flex items-center justify-center text-base-content/30 text-xs font-bold">
            بدون تصویر کاور
          </div>
          
          <div class="absolute inset-0 bg-linear-to-r from-base-100 via-base-100/40 via-30% to-transparent pointer-events-none z-10" />
        </div>

      </section>

      <main class="container mx-auto px-4 md:px-0 mt-12">
        <div v-if="bodyBlocks.length" class="flex flex-col gap-2">
          <template v-for="(block, index) in bodyBlocks" :key="index">
            <BlogBlockRenderer v-if="isKnownBlockType(block.type)" :block="block" />
            <div v-else class="alert alert-warning my-2 text-xs font-bold" role="alert">
              <span>نوع بلوک ناشناخته: {{ block.type }}</span>
            </div>
          </template>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
          <div class="bg-base-200 rounded-full p-5">
            <SearchX class="size-8 text-base-content/50" />
          </div>
          <p class="text-base-content/50 text-sm font-medium">هنوز محتوایی برای این نوشته اضافه نشده است</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SearchX } from 'lucide-vue-next'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'
import BlogBlockRenderer from '~/components/blog/BlockRenderer.vue'

interface BlogContentBlock {
  type: 'heading' | 'paragraph' | 'quote' | 'image' | 'list' | 'code' | 'link' | 'video'
  level?: number
  text: string
  text_fa?: string
  author?: string
  src?: string
}

interface BlogContent {
  title?: string
  summary?: string
  body?: BlogContentBlock[]
}

interface BlogFormData {
  cover_image_url?: string | null
  content?: BlogContent
  meta_title?: string
  meta_description?: string
  is_published: boolean
  slug?: string
}

interface Props {
  formData: BlogFormData
}

const props = defineProps<Props>()

const KNOWN_BLOCK_TYPES = new Set([
  'heading', 'paragraph', 'quote', 'image', 'list', 'code', 'link', 'video',
])

function isKnownBlockType(type: string): boolean {
  return KNOWN_BLOCK_TYPES.has(type)
}

const coverImageUrl = computed(() =>
  props.formData.cover_image_url ? resolveAssetUrl(props.formData.cover_image_url) : null
)

const title = computed(() =>
  props.formData.content?.title || props.formData.meta_title || 'بدون عنوان'
)

const summary = computed(() =>
  props.formData.content?.summary || props.formData.meta_description || 'خلاصه‌ای ارائه نشده است'
)

const bodyBlocks = computed(() => props.formData.content?.body ?? [])

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>