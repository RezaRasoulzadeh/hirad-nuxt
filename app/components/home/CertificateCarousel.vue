<template>
  <section v-if="certificates.length" class="bg-base-100 text-base-content pt-10 overflow-hidden select-none">
    <div class="flex flex-col items-center text-center mb-6 px-4">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3">
        Certificates & Standards
      </span>
      <h2 class="text-base-content text-3xl md:text-3xl font-black tracking-tight">
        {{ title }}
      </h2>
      <div class="bg-primary h-1 w-12 mt-4 rounded-full opacity-80" />
      <p class="text-base-content/70 max-w-2xl mx-auto text-sm leading-relaxed mt-4">
        {{ summary }}
      </p>
    </div>

    <div class="relative mx-auto h-100 md:h-130 flex items-center justify-center px-4 lg:px-16">
      <button 
        @click="prev" 
        class="absolute left-2 md:left-16 2xl:left-48 z-60 btn btn-circle text-base-content hover:scale-110 transition pointer-events-auto"
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>

      <div
        ref="carouselStage"
        class="relative w-full h-full flex items-center justify-center perspective-container"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerCancel"
        @pointerleave="handlePointerCancel"
        @click="handleStageClick"
      >
        <div 
          v-for="(item, index) in certificates" 
          :key="index"
          class="absolute w-[min(70vw,320px)] aspect-[1/1.414] transition-all duration-500 ease-out card-item"
          :class="{
            'is-active': activeIndex === index,
            'is-hovered': hoveredIndex === index,
            'is-shifting-left': activeIndex === index && shiftDirection === 'left',
            'is-shifting-right': activeIndex === index && shiftDirection === 'right'
          }"
          :style="getCardStyle(index)"
        >
          <div class="relative w-full h-full card-hover-layer">
            <div 
              class="relative w-full h-full card-flip-layer"
              :class="{ 'is-flipped': flippedCards[index] && activeIndex === index }"
            >
              <!-- Front Side: Pure Image Only -->
              <div class="card-face absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
                <img 
                  :src="`${config.public.apiBase}${item.image}`" 
                  :alt="item.title_fa"
                  class="w-full h-full object-cover" 
                  loading="lazy" 
                />
              </div>

              <!-- Back Side: Information -->
              <div class="card-face card-face-back absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-base-200 text-base-content p-6 flex flex-col justify-between text-right" dir="rtl">
                <div>
                  <div class="flex justify-center items-center border-b border-base-content/10 pb-3 mb-4">
                    <h3 class="text-lg font-black text-primary">{{ item.title_fa }}</h3>
                    
                  </div>
                  <p class="text-sm leading-relaxed text-center text-base-content/80 overflow-y-auto max-h-70 pl-1">
                    {{ item.description_fa }}
                  </p>
                </div>
                <div class="text-center">
                  <span class="text-xs text-base-content/50 uppercase tracking-wider font-mono">{{ item.title }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        @click="next" 
        class="absolute right-2 md:right-16 2xl:right-48 z-60 btn btn-circle text-base-content hover:scale-110 transition pointer-events-auto"
        aria-label="Next"
      >
        <ChevronRight />
      </button>
    </div>

    <!-- Strictly static display indicators (Actions and pointers removed) -->
    <div class="flex justify-center gap-2 mt-6 pointer-events-none select-none">
      <div 
        v-for="(_, index) in certificates" 
        :key="index" 
        class="h-2 rounded-full transition-all duration-300"
        :class="activeIndex === index ? 'w-6 bg-primary' : 'w-2 bg-base-content/30'"
      ></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import type { StyleValue } from 'vue'
import type { PageData } from '~/composables/useCertificates'

const props = defineProps<{
  data: PageData | null
}>()

const config = useRuntimeConfig()
const carouselStage = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const isMounted = ref(false)
const flippedCards = ref<Record<number, boolean>>({})
const shiftDirection = ref<'left' | 'right' | null>(null)
const hoveredIndex = ref<number | null>(null)
const didSwipe = ref(false)
const pointerStartX = ref(0)
const pointerStartY = ref(0)
const pointerCurrentX = ref(0)
const pointerCurrentY = ref(0)
const isPointerDown = ref(false)
let shiftTimer: ReturnType<typeof setTimeout> | null = null
let shiftFrame: number | null = null
let swipeResetTimer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  isMounted.value = true
})

onBeforeUnmount(() => {
  if (shiftTimer) clearTimeout(shiftTimer)
  if (shiftFrame) cancelAnimationFrame(shiftFrame)
  if (swipeResetTimer) clearTimeout(swipeResetTimer)
})

const certificates = computed(() => {
  const list = props.data?.content?.Certificates || []
  return [...list].sort((a, b) => a.order - b.order)
})

const title = computed(() => props.data?.title || 'گواهی‌ها')
const summary = computed(() => props.data?.summary || '')

const getCardStyle = (index: number): StyleValue => {
  const total = certificates.value.length
  if (!total) return {}

  if (!isMounted.value) {
    return {
      position: 'absolute',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      opacity: index === 0 ? 1 : 0,
      zIndex: index === 0 ? 30 : 10
    }
  }

  let diff = index - activeIndex.value
  diff = normalizeDiff(diff, total)

  const absDiff = Math.abs(diff)
  if (absDiff > 2) {
    return { opacity: 0, visibility: 'hidden', pointerEvents: 'none' }
  }

  const translateX = diff * getCardSpacing()
  const translateZ = -absDiff * 100
  const scale = 1 - absDiff * 0.12
  const rotateY = diff * -18
  const zIndex = 50 - absDiff * 10

  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
    zIndex,
    opacity: 1,
    pointerEvents: 'auto'
  }
}

const handleCardClick = (index: number) => {
  if (didSwipe.value) return

  if (activeIndex.value === index) {
    flippedCards.value[index] = !flippedCards.value[index]
  } else {
    setActive(index, getShortestDirection(index))
  }
}

const handleStageClick = (event: MouseEvent) => {
  if (didSwipe.value) return

  const targetIndex = getIndexFromPoint(event.clientX, event.clientY)
  if (targetIndex === null) return

  handleCardClick(targetIndex)
}

const next = () => {
  if (!certificates.value.length) return
  resetFlips()
  triggerShift('left')
  activeIndex.value = (activeIndex.value + 1) % certificates.value.length
}

const prev = () => {
  if (!certificates.value.length) return
  resetFlips()
  triggerShift('right')
  activeIndex.value = (activeIndex.value - 1 + certificates.value.length) % certificates.value.length
}

const setActive = (index: number, direction = getShortestDirection(index)) => {
  if (activeIndex.value === index) return
  resetFlips()
  triggerShift(direction)
  activeIndex.value = index
}

const resetFlips = () => {
  flippedCards.value = {}
}

const handlePointerDown = (event: PointerEvent) => {
  pointerStartX.value = event.clientX
  pointerStartY.value = event.clientY
  pointerCurrentX.value = event.clientX
  pointerCurrentY.value = event.clientY
  isPointerDown.value = true
}

const handlePointerMove = (event: PointerEvent) => {
  hoveredIndex.value = getIndexFromPoint(event.clientX, event.clientY)

  if (!isPointerDown.value) return

  pointerCurrentX.value = event.clientX
  pointerCurrentY.value = event.clientY
}

const handlePointerUp = () => {
  if (!isPointerDown.value) return

  const deltaX = pointerCurrentX.value - pointerStartX.value
  const deltaY = pointerCurrentY.value - pointerStartY.value
  isPointerDown.value = false

  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) return

  didSwipe.value = true
  if (swipeResetTimer) clearTimeout(swipeResetTimer)

  if (deltaX < 0) {
    next()
  } else {
    prev()
  }

  swipeResetTimer = setTimeout(() => {
    didSwipe.value = false
  }, 180)
}

const handlePointerCancel = () => {
  isPointerDown.value = false
  hoveredIndex.value = null
}

const getIndexFromPoint = (clientX: number, clientY: number): number | null => {
  const stage = carouselStage.value
  const total = certificates.value.length
  if (!stage || !total) return null

  const rect = stage.getBoundingClientRect()
  const stageCenterX = rect.left + rect.width / 2
  const stageCenterY = rect.top + rect.height / 2
  const localX = clientX - stageCenterX
  const localY = clientY - stageCenterY

  const candidates = certificates.value
    .map((_, index) => {
      const diff = normalizeDiff(index - activeIndex.value, total)
      const absDiff = Math.abs(diff)
      if (absDiff > 2) return null

      const scale = 1 - absDiff * 0.12
      const centerX = diff * getCardSpacing()
      const width = getCardWidth() * scale
      const height = getCardWidth() * 1.414 * scale
      const isActive = diff === 0
      const hitWidth = isActive ? width * 0.62 : width
      const hitHeight = isActive ? height * 0.82 : height
      const insideX = Math.abs(localX - centerX) <= hitWidth / 2
      const insideY = Math.abs(localY) <= hitHeight / 2

      if (!insideX || !insideY) return null

      return {
        index,
        distance: Math.abs(localX - centerX) + absDiff * 18
      }
    })
    .filter((candidate): candidate is { index: number; distance: number } => candidate !== null)
    .sort((a, b) => a.distance - b.distance)

  return candidates[0]?.index ?? null
}

const normalizeDiff = (diff: number, total: number) => {
  if (diff < -Math.floor(total / 2)) return diff + total
  if (diff > Math.floor(total / 2)) return diff - total

  return diff
}

const getCardWidth = () => {
  if (!import.meta.client) return 320

  return Math.min(window.innerWidth * 0.7, 320)
}

const getCardSpacing = () => {
  const stageWidth = carouselStage.value?.getBoundingClientRect().width ?? 900

  return Math.min(300, Math.max(190, stageWidth * 0.4))
}

const triggerShift = (direction: 'left' | 'right') => {
  shiftDirection.value = null
  if (shiftTimer) clearTimeout(shiftTimer)
  if (shiftFrame) cancelAnimationFrame(shiftFrame)

  shiftFrame = requestAnimationFrame(() => {
    shiftDirection.value = direction
    shiftTimer = setTimeout(() => {
      shiftDirection.value = null
    }, 520)
  })
}

const getShortestDirection = (targetIndex: number): 'left' | 'right' => {
  const total = certificates.value.length
  if (!total) return 'left'

  const forwardSteps = (targetIndex - activeIndex.value + total) % total
  const backwardSteps = (activeIndex.value - targetIndex + total) % total

  return forwardSteps <= backwardSteps ? 'left' : 'right'
}
</script>

<style scoped>
.perspective-container {
  cursor: pointer;
  perspective: 1200px;
  transform-style: preserve-3d;
  touch-action: pan-y;
}

.card-item {
  pointer-events: none;
  transform-style: preserve-3d;
}

.card-hover-layer {
  perspective: 1400px;
  pointer-events: none;
  transform-style: preserve-3d;
  transition: transform 220ms ease, filter 220ms ease;
}

.card-item.is-hovered .card-hover-layer {
  filter: brightness(1.04);
  transform: translateY(-10px) scale(1.045);
}

.card-item.is-active.is-hovered .card-hover-layer {
  transform: translateY(-14px) scale(1.065);
}

.card-flip-layer {
  transform-style: preserve-3d;
  transform-origin: center center;
  transition: transform 760ms cubic-bezier(0.22, 0.61, 0.36, 1);
  will-change: transform;
}

.card-flip-layer.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  pointer-events: none;
  transform: rotateY(0deg) translateZ(1px);
}

.card-face-back {
  transform: rotateY(180deg) translateZ(1px);
}

.card-item.is-shifting-left .card-hover-layer {
  animation: card-shift-left 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.card-item.is-shifting-right .card-hover-layer {
  animation: card-shift-right 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

@keyframes card-shift-left {
  0% {
    transform: translateX(24px) scale(0.98);
  }
  55% {
    transform: translateX(-10px) scale(1.045);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}

@keyframes card-shift-right {
  0% {
    transform: translateX(-24px) scale(0.98);
  }
  55% {
    transform: translateX(10px) scale(1.045);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}
</style>
