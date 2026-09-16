<template>
  <section class="relative w-full overflow-visible" dir="rtl">
    <div class="relative mx-auto max-w-[1880px] overflow-visible px-5">
      <AnimatedCircuitBorder side="right" :bottom-y="650" />

      <div class="container relative z-20 mx-auto px-10 pt-16 pb-20 md:px-12 lg:px-16">
    <div class="flex flex-col items-center text-center mb-10 px-4">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">
        {{ promiseContent.eyebrow }}
      </span>
      <h2 class="text-base-content text-3xl md:text-3xl font-black tracking-tight">
        {{ promiseContent.title }}
      </h2>
      <div class="bg-primary h-1 w-12 mt-4 rounded-full opacity-80" />
      <p class="text-base-content/70 mx-auto text-sm leading-relaxed mt-4">
        {{ promiseContent.description }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
      <div 
        v-for="(item, index) in promiseContent.items"
        :key="index"
        class="flex flex-col items-center text-center group"
      >
        <div class="mb-6 p-4 bg-base-200 rounded-2xl group-hover:scale-105 transition-transform duration-300">
          <img 
            :src="resolveIcon(item.icon)"
            :alt="item.title"
            width="48"
            height="48"
            class="w-12 h-12 object-contain block"
            loading="lazy"
            @error="usePlaceholder"
          />
        </div>
        
        <h3 class="text-xl font-bold text-base-content mb-3">
          {{ item.title }}
        </h3>
        
        <p class="text-base-content/80 text-sm leading-relaxed font-normal max-w-sm">
          {{ item.description }}
        </p>
      </div>
    </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedCircuitBorder from './AnimatedCircuitBorder.vue'
import type { HomePage } from '~/composables/useHomePage'
import placeholderImage from '~/assets/placeholder.png'
import commitmentImage from '~/assets/icons/commitment.png'
import flexibilityImage from '~/assets/icons/flexibility.png'
import motivationImage from '~/assets/icons/motivation.png'
import skillImage from '~/assets/icons/skill.png'
import { normalizeLocalAssetUrl } from '~/utils/resolveAssetUrl'

const localIconsByName: Record<string, string> = {
  'commitment.png': commitmentImage,
  'flexibility.png': flexibilityImage,
  'motivation.png': motivationImage,
  'skill.png': skillImage,
}

const props = defineProps<{ page?: HomePage | null }>()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || '/api'

const defaultItems = [
  {
    title: 'متعهد',
    description: 'تعهد برای ما اعتماد می‌آفریند. ما همواره به قول خود پایبندیم و باور داریم که تمامی مشتریان و همکاران می‌توانند روی ما حساب کنند.',
    icon: commitmentImage
  },
  {
    title: 'انگیزه‌مند',
    description: 'ما همیشه در تلاشیم تا بهترین راه‌حل‌ها را برای مشتریان خود بیابیم. هدف نهایی ما رضایت کامل آن‌هاست و این بزرگترین انگیزه ماست.',
    icon: motivationImage
  },
  {
    title: 'با‌ صلاحیت',
    description: 'دانش تخصصی در حوزه‌های فنی و بازرگانی، پایه‌ای استوار برای توسعه و ارائه راه‌حل‌هایی دقیقاً مطابق با نیازهای واقعی مشتریان ماست.',
    icon: skillImage
  },
  {
    title: 'منعطف',
    description: 'ما به دستورالعمل‌های خشک پایبند نیستیم. تمرکز اصلی ما بر خواسته‌های فردی مشتریان است و آن‌ها را به فرآیندهای داخلی ترجیح می‌دهیم.',
    icon: flexibilityImage
  }
]

const promiseContent = computed(() => {
  const saved = props.page?.content?.brand_promise
  return {
    eyebrow: saved?.eyebrow || 'Brand Promise',
    title: saved?.title || 'تعهد هیراد',
    description: saved?.description || 'چشم‌انداز این شرکت تبدیل شدن به همکاری مورد اعتماد برای تولید کنندگان و تامین کننده‌ای مطمئن برای مشتریان می باشد.',
    items: saved?.items?.length ? saved.items : defaultItems,
  }
})

const resolveIcon = (value?: string): string => {
  if (!value) return normalizeLocalAssetUrl(placeholderImage)
  if (value.startsWith('http')) return value
  if (value.startsWith('/_nuxt/')) return value
  if (value.startsWith('/')) return `${apiBase}${value}`
  return normalizeLocalAssetUrl(localIconsByName[value] || value)
}

const usePlaceholder = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.onerror = null
  image.src = normalizeLocalAssetUrl(placeholderImage)
}
</script>
