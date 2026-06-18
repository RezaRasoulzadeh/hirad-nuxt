<template>
  <NuxtLink 
    :to="`/blog/${post.slug}`"
    class="flex flex-col h-full bg-base-200/50 rounded-(--radius-box) border border-base-content/5 overflow-hidden group hover:border-primary/20 hover:shadow-md transition-all duration-300 text-right cursor-pointer"
  >
    <div class="relative w-full aspect-4/3 bg-base-300 overflow-hidden shrink-0">
      <img 
        :src="resolveAssetUrl(post.cover_image_url)" 
        :alt="post.title" 
        loading="lazy"
        class="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500 ease-out" 
      />
      <div class="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
    </div>

    <div class="flex flex-col flex-1 p-5">
      <span class="text-[11px] font-medium text-primary mb-2 block tracking-wider" dir="ltr">
        {{ formatDate(post.updated_at) }}
      </span>
      
      <h3 class="text-lg font-bold text-base-content line-clamp-1 group-hover:text-primary transition-colors duration-200 mb-2">
        {{ post.title }}
      </h3>
      
      <p class="text-sm text-base-content/65 leading-relaxed text-justify line-clamp-3 mb-5">
        {{ post.summary }}
      </p>

      <div class="mt-auto pt-2 border-t border-base-content/5 flex justify-end">
        <span class="btn btn-sm btn-ghost text-primary hover:bg-primary/10 group-hover:gap-3 transition-all duration-200 p-0 px-3 -mr-3 pointer-events-none">
          <span>مشاهده مقاله</span>
          <ArrowLeft class="size-4" />
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import type { BlogPost } from '~/composables/useBlog'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'

defineProps<{
  post: BlogPost
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>