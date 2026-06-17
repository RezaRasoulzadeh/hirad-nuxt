<template>
  <section ref="sectionRef" class="bg-base-200 border-y border-base-300 py-12 md:py-16" dir="rtl">
    <div class="container mx-auto px-4 lg:px-0">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 text-center">
        <div
          v-for="(stat, idx) in parsedStats"
          :key="stat.label"
          class="flex flex-col gap-2 field-animate"
          :style="{ '--fi': idx }"
        >
          <span class="text-4xl md:text-5xl font-black text-primary tabular-nums">
            {{ stat.prefix }}{{ toFaDigits(displayValues[idx] ?? 0) }}
          </span>
          <span class="text-xs md:text-sm text-base-content/60 font-medium">
            {{ stat.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { toFaDigits } from '~/utils/toFaDigits'

const props = defineProps<{
  stats: { label: string; value: string }[]
}>()

const COUNT_DURATION_MS = 1400

const parsedStats = computed(() =>
  props.stats.map(stat => {
    const match = stat.value.match(/^(\D*)(\d+)(\D*)$/)
    const target = match ? parseInt(match[2] ?? '0', 10) : 0
    const prefix = match?.[1] ?? ''
    const suffix = match?.[3] ?? ''
    return { label: stat.label, target, prefix, suffix }
  })
)

const displayValues = ref<number[]>(props.stats.map(() => 0))
const sectionRef = ref<HTMLElement | null>(null)
const hasAnimated = ref(false)

let observer: IntersectionObserver | null = null

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function runCountUp() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  const targets = parsedStats.value.map(s => s.target)
  const startTime = performance.now()

  function tick(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / COUNT_DURATION_MS, 1)
    const eased = easeOutCubic(progress)

    displayValues.value = targets.map(target => Math.round(target * eased))

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      displayValues.value = targets
    }
  }

  requestAnimationFrame(tick)
}

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined' || !sectionRef.value) {
    displayValues.value = parsedStats.value.map(s => s.target)
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        runCountUp()
      }
    },
    { threshold: 0.3 }
  )

  observer.observe(sectionRef.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>