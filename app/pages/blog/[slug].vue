<template>
  <div class="w-full min-h-screen bg-base-100 pb-20" dir="rtl">
    
    <div v-if="status === 'pending'" class="min-h-[60vh] flex flex-col justify-center items-center gap-4">
      <span class="loading loading-ring loading-lg text-primary"></span>
      <p class="text-sm text-base-content/50 font-medium">در حال بارگذاری مقاله...</p>
    </div>

    <section
      v-else-if="error"
      class="flex flex-col items-center justify-center min-h-[60vh] py-16 gap-3 text-center px-4 max-w-md mx-auto"
    >
      <div class="bg-error/10 rounded-full p-5">
        <WifiOff class="size-8 text-error" />
      </div>
      <p class="text-base-content font-bold">خطا در دریافت مقاله</p>
      <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
      <button class="btn btn-sm btn-error btn-soft px-6 mt-2" @click="refresh()">تلاش مجدد</button>
    </section>

    <section
      v-else-if="!post"
      class="flex flex-col items-center justify-center min-h-[60vh] py-16 gap-3 text-center px-4 max-w-md mx-auto"
    >
      <div class="bg-base-200 rounded-full p-5">
        <SearchX class="size-8 text-base-content" />
      </div>
      <p class="text-base-content font-bold">مقاله مورد نظر یافت نشد</p>
      <p class="text-base-content/50 text-sm">این مطلب ممکن است حذف شده باشد یا آدرس وارد شده اشتباه است.</p>
      <NuxtLink to="/" class="btn btn-sm btn-outline px-6 mt-2">بازگشت به خانه</NuxtLink>
    </section>

    <div v-else>
      <section class="relative container mx-auto px-6 lg:px-0 bg-base-100 flex flex-col lg:flex-row items-stretch overflow-hidden rounded-b-3xl" dir="rtl">
  
  <div class="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-20 text-right z-10 order-first">
    <span class="badge badge-primary font-bold text-xs mb-4 px-3 py-2.5 rounded-md self-start">
      آخرین بروزرسانی: {{ formatDate(post.updated_at) }}
    </span>
    <h1 class="text-3xl md:text-5xl font-black text-base-content mb-6 max-w-2xl leading-tight">
      {{ post.title }}
    </h1>
    <p class="text-base text-base-content/70 max-w-2xl leading-relaxed text-justify">
      {{ post.summary }}
    </p>
  </div>

  <div class="w-full lg:w-1/2 relative min-h-87.5 lg:min-h-[55vh] overflow-hidden order-last lg:order-0">
    <img
      :src="resolveAssetUrl(post.cover_image_url)"
      :alt="post.title"
      class="absolute inset-0 w-full h-full object-scale-down select-none"
      loading="eager"
    />
    
    <div class="absolute inset-0 bg-linear-to-r from-base-100 via-base-100/40 via-30% to-transparent pointer-events-none z-10" />
  </div>

</section>

      <main class="container mx-auto px-4 md:px-0 mt-12">
        <div class="flex flex-col gap-2">
          <BlogBlockRenderer 
            v-for="(block, index) in post.content.body" 
            :key="index" 
            :block="block" 
          />
        </div>
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRoute, useAsyncData } from '#app'
import { computed } from 'vue'
import { WifiOff, SearchX } from 'lucide-vue-next'
import { useBlog } from '~/composables/useBlogSingle'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'
import BlogBlockRenderer from '~/components/blog/BlockRenderer.vue'

const route = useRoute()
const { fetchPostByRawSlug } = useBlog()

const rawSlugSegment = computed(() => {
  const pathParts = route.path.split('/')
  return pathParts[pathParts.length - 1] || ''
})

const { data: response, status, error, refresh } = await useAsyncData(
  `blog-${rawSlugSegment.value}`,
  () => fetchPostByRawSlug(rawSlugSegment.value),
  {
    watch: [rawSlugSegment]
  }
)

const post = computed(() => response.value?.data || null)

useSeoMeta({
  title: () => post.value?.title || post.value?.meta_title || 'وبلاگ هیراد',
  description: () => post.value?.summary || post.value?.meta_description || ''
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>