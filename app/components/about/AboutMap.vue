<template>
  <section class="container mx-auto px-4 lg:px-0 py-12 lg:py-20" dir="rtl">
    <div class="flex flex-col items-center text-center mb-10 px-4">
      <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3" dir="ltr">
        Our Footprint
      </span>
      <h2 class="text-base-content text-3xl lg:text-3xl font-black tracking-tight">
        پروژه‌ها و مشتریان ما در سراسر ایران
      </h2>
      <div class="bg-primary h-1 w-12 mt-4 rounded-full opacity-80" />
      <p class="text-base-content/70 mx-auto text-sm leading-relaxed mt-4 max-w-xl">
        روی هرکدام از نقاط یا لیست کلیک کنید تا جزئیات پروژه را ببینید.
      </p>
    </div>

    <div class="flex flex-col-reverse lg:flex-row gap-6 lg:gap-10">
      <div
        ref="listContainerRef"
        class="grid grid-cols-1 gap-2 lg:w-1/2 lg:max-h-176 lg:overflow-y-auto p-1"
      >
        <button
          v-for="(point, idx) in points"
          :key="`${point.name}-${idx}`"
          type="button"
          class="text-right p-4 border rounded-box transition-colors field-animate"
          :style="{ '--fi': idx }"
          :class="activeIndex === idx
            ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
            : 'border-base-200 hover:border-primary/40 hover:bg-base-200/40'"
          @mouseenter="hoverIndex = idx"
          @mouseleave="hoverIndex = null"
          @click="toggleActive(idx)"
        >
          <h3 class="font-bold text-base text-primary">{{ point.name_fa }}</h3>
          <p class="text-sm text-base-content/50 mt-0.5">{{ point.location }}</p>
          <p class="text-sm text-base-content/70 mt-1.5 leading-6">{{ point.description_fa }}</p>
        </button>
      </div>

      <div ref="mapWrapperRef" class="relative w-full lg:w-1/2 overflow-visible">
        <div class="relative w-full inline-block">
          <img
            ref="mapImgRef"
            src="~/assets/Map.svg"
            alt="نقشه پروژه‌های هیراد در ایران"
            class="w-full h-auto select-none pointer-events-none block"
            draggable="false"
            @load="updateMapDimensions"
          />

          <button
            v-for="(point, idx) in points"
            :key="`dot-${point.name}-${idx}`"
            type="button"
            class="absolute -translate-x-1/2 -translate-y-1/2 group data-dot z-10"
            :style="{ left: `${point.x}%`, top: `${point.y}%` }"
            :aria-label="point.name_fa"
            @mouseenter="hoverIndex = idx"
            @mouseleave="hoverIndex = null"
            @click="toggleActive(idx)"
          >
            <span
              class="block w-3 h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-primary border-2 border-base-100 shadow-md transition-transform duration-200 pointer-events-none"
              :class="activeIndex === idx || hoverIndex === idx ? 'scale-150 ring-2 ring-primary/40' : 'group-hover:scale-125'"
            ></span>
            <span
              v-if="activeIndex !== idx"
              class="absolute inset-0 rounded-full bg-primary opacity-40 animate-ping pointer-events-none"
            ></span>
          </button>

          <div
            v-if="activePoint"
            ref="popoverRef"
            class="absolute z-20 p-4 bg-base-100 border border-base-300 rounded-box shadow-lg text-center transition-all duration-150"
            :class="popoverWidthClass"
            :style="popoverStyle"
          >
            <button
              type="button"
              class="absolute left-2 top-2 text-base-content/40 hover:text-base-content"
              aria-label="بستن"
              @click="activeIndex = null"
            >
              <X class="size-4" />
            </button>
            <h3 class="font-bold text-lg text-base-content pl-5">{{ activePoint.name_fa }}</h3>
            <div class="h-px w-full bg-base-300 my-2"></div>
            <p class="text-sm text-base-content/50">{{ activePoint.location }}</p>
            <p class="text-sm text-base-content/70 mt-2 leading-6">{{ activePoint.description_fa }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { X } from 'lucide-vue-next'
import type { MapPoint } from '~/composables/useAboutCompany'

const props = defineProps<{
  points: MapPoint[]
}>()

const listContainerRef = ref<HTMLElement | null>(null)
const mapWrapperRef = ref<HTMLElement | null>(null)
const mapImgRef = ref<HTMLImageElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

const activeIndex = ref<number | null>(null)
const hoverIndex = ref<number | null>(null)

const mapWidth = ref(0)
const mapHeight = ref(0)
let resizeObserver: ResizeObserver | null = null

const effectiveIndex = computed(() => 
  activeIndex.value !== null ? activeIndex.value : hoverIndex.value
)

const activePoint = computed(() =>
  effectiveIndex.value !== null ? props.points[effectiveIndex.value] ?? null : null
)

const popoverWidthClass = computed(() => {
  const point = activePoint.value
  if (!point) return 'w-60'
  return point.x >= 25 && point.x <= 75 ? 'w-60' : 'w-52'
})

const popoverStyle = computed(() => {
  if (effectiveIndex.value === null || mapWidth.value === 0) return {}
  const point = props.points[effectiveIndex.value]
  if (!point) return {}

  const style: Record<string, string> = {}
  
  const topPixel = (point.y * mapHeight.value) / 100
  const leftPixel = (point.x * mapWidth.value) / 100

  if (point.y > 50) {
    style.bottom = `${mapHeight.value - topPixel + 12}px`
  } else {
    style.top = `${topPixel + 12}px`
  }

  if (point.x >= 25 && point.x <= 75) {
    style.left = `${leftPixel}px`
    style.transform = 'translateX(-50%)'
  } else if (point.x > 75) {
    style.right = `${mapWidth.value - leftPixel}px`
  } else {
    style.left = `${leftPixel}px`
  }

  return style
})

function toggleActive(idx: number) {
  activeIndex.value = activeIndex.value === idx ? null : idx
}

function updateMapDimensions() {
  if (mapImgRef.value) {
    mapWidth.value = mapImgRef.value.clientWidth
    mapHeight.value = mapImgRef.value.clientHeight
  }
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  
  const clickedDot = target.closest('.data-dot')
  const clickedList = listContainerRef.value?.contains(target)
  const clickedPopover = popoverRef.value?.contains(target)

  if (!clickedDot && !clickedList && !clickedPopover) {
    activeIndex.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('resize', updateMapDimensions)
  
  if (mapImgRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateMapDimensions()
    })
    resizeObserver.observe(mapImgRef.value)
    updateMapDimensions()
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateMapDimensions)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>