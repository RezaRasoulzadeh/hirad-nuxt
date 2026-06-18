<template>
  <div class="w-full text-right font-sans" dir="rtl">
    
    <template v-if="block.type === 'heading'">
      <h2 v-if="block.level === 2" class="text-2xl md:text-3xl font-black text-base-content mt-8 mb-4 leading-tight">
        {{ block.text_fa || block.text }}
      </h2>
      <h3 v-else class="text-xl md:text-2xl font-bold text-base-content mt-6 mb-3 leading-snug">
        {{ block.text_fa || block.text }}
      </h3>
    </template>

    <template v-else-if="block.type === 'paragraph'">
      <p class="text-base text-base-content/80 leading-relaxed text-justify mb-5 whitespace-pre-line">
        {{ block.text_fa || block.text }}
      </p>
    </template>

    <template v-else-if="block.type === 'quote'">
      <div class="alert alert-neutral bg-base-200/80 border-r-4 border-l-0 border-primary my-6 p-5 rounded-xl shadow-xs flex flex-col items-start gap-1">
        <h4 class="text-lg font-bold text-primary">
          {{ block.text_fa || block.text }}
        </h4>
        <p v-if="block.author" class="text-sm text-base-content/75 leading-relaxed text-justify">
          {{ block.author }}
        </p>
      </div>
    </template>

    <template v-else-if="block.type === 'image'">
      <figure class="my-6 flex flex-col items-center gap-2 bg-base-200/30 p-2 rounded-2xl border border-base-content/5">
        <img 
          :src="resolveAssetUrl(block.text)" 
          alt="محتوای مقاله"
          loading="lazy"
          class="rounded-xl max-h-[50vh] object-contain w-full"
        />
        <figcaption v-if="block.text_fa" class="text-xs text-base-content/50 italic px-2 text-center">
          {{ block.text_fa }}
        </figcaption>
      </figure>
    </template>

    <template v-else-if="block.type === 'list'">
      <ul class="list-disc list-inside space-y-2 mb-5 pr-4 text-base text-base-content/80 marker:text-primary">
        <li 
          v-for="(item, idx) in splitListItems(block.text_fa || block.text)" 
          :key="idx"
          class="leading-relaxed text-justify"
        >
          {{ item }}
        </li>
      </ul>
    </template>

    <template v-else-if="block.type === 'code'">
      <div class="mockup-code bg-neutral text-neutral-content my-6 text-left shadow-md font-mono text-sm border border-neutral-focus" dir="ltr">
        <pre class="px-5"><code>{{ block.text }}</code></pre>
      </div>
    </template>

    <template v-else-if="block.type === 'link'">
      <div class="my-4">
        <a 
          :href="block.text" 
          target="_blank" 
          rel="noopener noreferrer"
          class="link link-primary inline-flex items-center gap-1 font-bold transition-all hover:gap-2"
        >
          <span>{{ block.text_fa || 'مشاهده پیوند مرتبط' }}</span>
          <ExternalLink class="size-4" />
        </a>
      </div>
    </template>

    <template v-else-if="block.type === 'video'">
      <div class="my-6 overflow-hidden rounded-2xl shadow-lg border border-base-content/5 aspect-video bg-black">
        <iframe
          :src="block.text"
          class="w-full h-full"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'

interface BlogBlock {
  type: 'heading' | 'paragraph' | 'quote' | 'image' | 'list' | 'code' | 'link' | 'video'
  level?: number
  text: string
  text_fa?: string
  author?: string
}

defineProps<{
  block: BlogBlock
}>()

function splitListItems(rawText: string): string[] {
  if (!rawText) return []
  return rawText
    .split('\n')
    .map(item => item.replace(/^[*\-\s\d.]+/g, '').trim()) // Clear markdown artifact items cleanly
    .filter(Boolean)
}
</script>