<template>
  <div ref="containerRef" class="relative flex-1 order-1 md:order-2 bg-base-100">
    <div class="relative w-full" style="padding-bottom: 56.25%;">
      <img
        src="~/assets/hero.jpg"
        alt="تجهیزات صنعتی هیراد"
        class="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />
      <div class="absolute inset-0 bg-linear-to-r from-base-100/60 via-transparent to-transparent pointer-events-none hidden md:block" />

      <button
        v-for="(spot, i) in hotspots"
        :key="i"
        class="hotspot absolute"
        :class="activeIndex === i ? 'z-99' : 'z-20'"
        :style="{ top: spot.top, left: spot.left }"
        @mouseenter="onMouseEnter(i)"
        @mouseleave="onMouseLeave"
        @click.stop="toggleHotspot(i)"
        :aria-label="items[i]?.title_fa ?? ''"
      >
        <span class="hotspot-ring" :class="{ active: activeIndex === i }">
          <Plus class="size-3 md:size-4 text-white" />
        </span>

        <Transition name="pop">
          <div 
            v-if="activeIndex === i && items[i] != null" 
            class="hotspot-card card-bottom" 
            :class="spot.cardAlign"
            @click.stop
          >
            <div class="icon-mask size-8 md:size-10 mb-2 mx-auto bg-primary" :style="maskStyle(items[i]!.icon ?? '')" />
            <p class="text-sm font-bold text-base-content leading-tight">
              {{ (items[i]!.title_fa ?? '').split('|')[0]?.trim() ?? '' }}
            </p>
            <p class="text-xs text-base-content/50 mt-1 leading-snug">
              {{ items[i]!.sub_title_fa ?? '' }}
            </p>
            
            <button 
              class="btn btn-primary btn-xs w-full mt-3 rounded-md font-medium text-[11px]"
              @click="navigateTo(items[i]!.url ?? '/')"
            >
              مشاهده محصولات
            </button>
          </div>
        </Transition>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { StyleValue } from 'vue'

defineProps<{
  items: any[]
  hotspots: Array<{ top: string; left: string; cardAlign: string }>
  maskStyle: (url: string) => StyleValue
}>()

const activeIndex = ref<number | null>(null)
const isLockedOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggleHotspot = (index: number) => {
  if (activeIndex.value === index) {
    closeCard()
  } else {
    activeIndex.value = index
    isLockedOpen.value = true
    setupOutsideListeners()
  }
}

const onMouseEnter = (index: number) => {
  if (!isLockedOpen.value && window.matchMedia('(min-width: 768px)').matches) {
    activeIndex.value = index
  }
}

const onMouseLeave = () => {
  if (!isLockedOpen.value && window.matchMedia('(min-width: 768px)').matches) {
    activeIndex.value = null
  }
}

const setupOutsideListeners = () => {
  window.addEventListener('click', handleOutsideClick)
  window.addEventListener('touchstart', handleOutsideClick)
}

const closeCard = () => {
  activeIndex.value = null
  isLockedOpen.value = false
  window.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('touchstart', handleOutsideClick)
}

const handleOutsideClick = (event: Event) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closeCard()
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('click', handleOutsideClick)
  window.removeEventListener('touchstart', handleOutsideClick)
})
</script>

<style scoped>
.hotspot {
  transform: translate(-50%, -50%);
}

.hotspot-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  border: 2px solid var(--color-primary);
  background: color-mix(in oklch, var(--color-primary) 25%, transparent);
  backdrop-filter: blur(4px);
  transition: background 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

@media (min-width: 768px) {
  .hotspot-ring { width: 2.25rem; height: 2.25rem; }
}

.hotspot-ring.active,
.hotspot-ring:hover {
  background: var(--color-primary);
  box-shadow: 0 0 0 6px color-mix(in oklch, var(--color-primary) 25%, transparent);
}

.hotspot-ring::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 9999px;
  border: 2px solid var(--color-primary);
  animation: pulse-ring 2.5s ease-out infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0%   { transform: scale(1); opacity: 0.7; }
  100% { transform: scale(2.2); opacity: 0; }
}

.hotspot-card {
  position: absolute;
  width: 148px;
  background: var(--color-base-100);
  border: 1px solid var(--color-base-300);
  border-radius: 0.875rem;
  padding: 0.875rem;
  text-align: center;
  box-shadow: 0 8px 32px rgb(0 0 0 / 0.18);
  white-space: normal;
}

.hotspot-card::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 12px;
  bottom: 100%;
}

@media (min-width: 768px) {
  .hotspot-card { width: 176px; }
}

.card-bottom { top: calc(100% + 10px); }
.card-left   { left: 50%; transform: translateX(-20%); }
.card-right  { right: 50%; transform: translateX(20%); }

.pop-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.pop-leave-active { transition: opacity 0.1s ease; }
.pop-enter-from   { opacity: 0; transform: translateX(-20%) scale(0.9); }
.pop-leave-to     { opacity: 0; }

.icon-mask { display: block; }

@media (prefers-reduced-motion: reduce) {
  .hotspot-ring::before { animation: none; }
}
</style>