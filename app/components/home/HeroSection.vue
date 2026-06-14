<template>
  <section class="hero-section relative w-full overflow-hidden bg-base-200" style="min-height: 560px;">

    <!-- Background image from gallery -->
    <div class="absolute inset-0 z-0">
      <img
        v-if="gallery[0]"
        :src="getUrl(gallery[0].url)"
        :alt="gallery[0].title_fa"
        class="w-full h-full object-cover object-center"
      />
      <div class="absolute inset-0 bg-gradient-to-l from-base-100/10 via-base-100/30 to-base-100/80" />
    </div>

    <!-- Text block — right side (RTL) -->
    <div class="relative z-10 flex flex-col justify-center h-full min-h-[560px] px-8 lg:px-20 py-16 max-w-lg">
      <p class="text-primary font-bold text-sm tracking-widest uppercase mb-3 opacity-80">
        {{ page?.meta_title }}
      </p>
      <h1 class="text-3xl lg:text-4xl font-black text-base-content leading-snug mb-4">
        {{ gallery[0]?.title_fa }}
      </h1>
      <p class="text-base-content/60 text-sm leading-relaxed">
        {{ page?.summary }}
      </p>
    </div>

    <!-- Hotspot buttons — positioned over image -->
    <div class="absolute inset-0 z-20 pointer-events-none">
      <button
        v-for="(spot, i) in hotspots"
        :key="i"
        class="hotspot pointer-events-auto absolute"
        :style="{ top: spot.top, left: spot.left }"
        @mouseenter="activeIndex = i"
        @mouseleave="activeIndex = null"
        @focus="activeIndex = i"
        @blur="activeIndex = null"
        @click="navigateTo(items[i]?.url)"
        :aria-label="items[i]?.title_fa"
      >
        <!-- Plus ring -->
        <span class="hotspot-ring" :class="{ active: activeIndex === i }">
          <span class="hotspot-dot">
            <Plus class="size-4 text-white" />
          </span>
        </span>

        <!-- Popup card -->
        <Transition name="pop">
          <div
            v-if="activeIndex === i && items[i]"
            class="hotspot-card"
            :class="spot.cardAlign"
          >
            <div
              class="icon-mask size-10 mb-2 mx-auto bg-primary"
              :style="maskStyle(items[i].icon)"
            />
            <p class="text-sm font-bold text-base-content leading-tight">{{ items[i].title_fa }}</p>
            <p class="text-xs text-base-content/50 mt-0.5 leading-snug">{{ items[i].sub_title_fa }}</p>
          </div>
        </Transition>
      </button>
    </div>

    <!-- Category strip at bottom -->
    <div class="absolute bottom-0 left-0 right-0 z-30 bg-base-100/80 backdrop-blur-md border-t border-base-300">
      <div class="flex items-stretch divide-x divide-x-reverse divide-base-300 overflow-x-auto">
        <NuxtLink
          v-for="item in items"
          :key="item.url"
          :to="item.url"
          class="cat-strip-item group flex items-center gap-3 px-6 py-4 flex-1 min-w-[160px] transition-colors duration-200 hover:bg-primary/5"
        >
          <div
            class="icon-mask size-8 shrink-0 bg-base-content/40 group-hover:bg-primary transition-colors duration-200"
            :style="maskStyle(item.icon)"
          />
          <div class="flex flex-col gap-0 min-w-0">
            <span class="text-sm font-semibold text-base-content group-hover:text-primary transition-colors duration-200 truncate">
              {{ item.title_fa.split('|')[0].trim() }}
            </span>
            <span class="text-xs text-base-content/40 truncate">{{ item.sub_title_fa }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { HomePage } from '~/composables/useHomePage'

const props = defineProps<{
  page: HomePage | null
}>()

const config = useRuntimeConfig()
const baseUrl = config?.public?.apiBase || 'http://localhost:3000/api'

const activeIndex = ref<number | null>(null)

const items = computed(() => props.page?.content?.ItemSection ?? [])
const gallery = computed(() => props.page?.content?.image_gallery ?? [])

const getUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl.replace('/api', '')}${url.startsWith('/') ? '' : '/'}${url}`
}

const maskStyle = (url: string) => {
  const src = getUrl(url)
  return {
    maskImage: `url(${src})`,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'contain',
    WebkitMaskImage: `url(${src})`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    WebkitMaskSize: 'contain',
  }
}

// Hotspot positions over the industrial image — tweak to match your background image
const hotspots = [
  { top: '28%', left: '62%', cardAlign: 'card-top-right' },   // Valves — top valve area
  { top: '52%', left: '44%', cardAlign: 'card-top-left' },    // Connectors — center fittings
  { top: '65%', left: '28%', cardAlign: 'card-top-right' },   // Pipes — pipe run left
  { top: '38%', left: '55%', cardAlign: 'card-bottom-right' },// Flanges — flange cluster
]
</script>

<style scoped>
/* Hotspot button */
.hotspot {
  transform: translate(-50%, -50%);
}

.hotspot-ring {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: 2px solid var(--color-primary);
  background: color-mix(in oklch, var(--color-primary) 20%, transparent);
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  cursor: pointer;
}

.hotspot-ring.active,
.hotspot-ring:hover {
  background: var(--color-primary);
  box-shadow: 0 0 0 6px color-mix(in oklch, var(--color-primary) 25%, transparent);
}

.hotspot-dot {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pulse animation on hotspots */
.hotspot-ring::before {
  content: '';
  position: absolute;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  border: 2px solid var(--color-primary);
  animation: pulse-ring 2s ease-out infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}

/* Popup card */
.hotspot-card {
  position: absolute;
  width: 160px;
  background: var(--color-base-100);
  border: 1px solid var(--color-base-300);
  border-radius: 1rem;
  padding: 0.875rem;
  text-align: center;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.15);
  pointer-events: none;
  z-index: 10;
}

.card-top-right  { bottom: calc(100% + 12px); left: 50%; transform: translateX(-10%); }
.card-top-left   { bottom: calc(100% + 12px); right: 50%; transform: translateX(10%); }
.card-bottom-right { top: calc(100% + 12px); left: 50%; transform: translateX(-10%); }
.card-bottom-left  { top: calc(100% + 12px); right: 50%; transform: translateX(10%); }

/* Pop transition */
.pop-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.pop-leave-active { transition: opacity 0.1s ease, transform 0.1s ease; }
.pop-enter-from  { opacity: 0; transform: translateX(-10%) scale(0.92); }
.pop-leave-to    { opacity: 0; transform: translateX(-10%) scale(0.92); }

/* Icon mask */
.icon-mask {
  display: block;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hotspot-ring::before { animation: none; }
}
</style>