<template>
  <section class="relative w-full overflow-visible" dir="rtl">
    <div ref="circuitFrameRef" class="relative mx-auto max-w-[1880px] overflow-visible px-5">
      <div class="pointer-events-none absolute inset-0 z-10 hidden md:block" aria-hidden="true">
        <svg class="absolute inset-0 size-full overflow-visible" viewBox="0 0 1000 700" fill="none"
          preserveAspectRatio="none">
          <path :d="`M500 30H${18 + topCornerOffset}L18 74V592L${18 + bottomCornerOffset} 650H215`"
            class="promise-circuit-line" />
          <CircuitFluidPulse
            :path="`M500 30H${18 + topCornerOffset}L18 74V592L${18 + bottomCornerOffset} 650H215`" />
        </svg>
        <i class="absolute top-[calc(4.286%_-_0.3125rem)] left-[calc(50%_-_0.3125rem)] size-2.5 rounded-full bg-primary" />
        <span class="absolute top-[68%] left-[calc(1.8%_-_0.3125rem)] flex flex-col gap-2">
          <i v-for="dot in 3" :key="dot" class="size-2.5 rounded-full bg-primary" />
        </span>
        <i class="absolute top-[calc(92.857%_-_0.3125rem)] left-[calc(21.5%_-_0.3125rem)] size-2.5 rounded-full bg-primary" />
      </div>

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
import { useCircuitGeometry } from '~/composables/useCircuitGeometry'
import { computed } from 'vue'
import CircuitFluidPulse from './CircuitFluidPulse.vue'
import type { HomePage } from '~/composables/useHomePage'
import placeholderImage from '~/assets/placeholder.png'

const { circuitFrameRef, topCornerOffset, bottomCornerOffset } = useCircuitGeometry()
const props = defineProps<{ page?: HomePage | null }>()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || '/api'

const glob = import.meta.glob('~/assets/icons/*.png', { 
  eager: true, 
  import: 'default' 
}) as Record<string, string>

const defaultItems = [
  {
    title: 'متعهد',
    description: 'تعهد برای ما اعتماد می‌آفریند. ما همواره به قول خود پایبندیم و باور داریم که تمامی مشتریان و همکاران می‌توانند روی ما حساب کنند.',
    icon: 'commitment.png'
  },
  {
    title: 'انگیزه‌مند',
    description: 'ما همیشه در تلاشیم تا بهترین راه‌حل‌ها را برای مشتریان خود بیابیم. هدف نهایی ما رضایت کامل آن‌هاست و این بزرگترین انگیزه ماست.',
    icon: 'motivation.png'
  },
  {
    title: 'با‌ صلاحیت',
    description: 'دانش تخصصی در حوزه‌های فنی و بازرگانی، پایه‌ای استوار برای توسعه و ارائه راه‌حل‌هایی دقیقاً مطابق با نیازهای واقعی مشتریان ماست.',
    icon: 'skill.png'
  },
  {
    title: 'منعطف',
    description: 'ما به دستورالعمل‌های خشک پایبند نیستیم. تمرکز اصلی ما بر خواسته‌های فردی مشتریان است و آن‌ها را به فرآیندهای داخلی ترجیح می‌دهیم.',
    icon: 'flexibility.png'
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
  if (!value) return placeholderImage
  if (value.startsWith('http')) return value
  if (value.startsWith('/')) return `${apiBase}${value}`
  return glob[`/assets/icons/${value}`] || placeholderImage
}

const usePlaceholder = (event: Event) => {
  const image = event.currentTarget as HTMLImageElement
  image.onerror = null
  image.src = placeholderImage
}
</script>

<style scoped>
.promise-circuit-line {
  stroke: var(--color-primary);
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
}
</style>
