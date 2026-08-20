<template>
  <g class="circuit-fluid-pulse" aria-hidden="true">
    <path ref="guideRef" :d="path" fill="none" stroke="none" />
    <path :d="pulsePath" fill="var(--color-primary)" />
  </g>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  path: string
  duration?: number
}>(), {
  duration: 7000,
})

const guideRef = ref<SVGPathElement | null>(null)
const pulsePath = ref('')
let frameId: number | undefined
let startedAt = 0

const expansionRadius = 27 / 1000
const maxExpansion = 1.35
const normalHalfWidth = 1.25 / 2
const sampleCount = 48

const renderPulse = (time: number) => {
  const guide = guideRef.value
  if (!guide) return

  const totalLength = guide.getTotalLength()
  if (!totalLength) return

  if (!startedAt) startedAt = time
  const center = ((time - startedAt) % props.duration) / props.duration * totalLength
  const radius = expansionRadius * totalLength
  const upper: string[] = []
  const lower: string[] = []

  for (let index = 0; index <= sampleCount; index += 1) {
    const relative = -radius + radius * 2 * index / sampleCount
    const position = Math.min(totalLength, Math.max(0, center + relative))
    const point = guide.getPointAtLength(position)
    const tangentRange = Math.max(0.5, totalLength / 1200)
    const before = guide.getPointAtLength(Math.max(0, position - tangentRange))
    const after = guide.getPointAtLength(Math.min(totalLength, position + tangentRange))
    const dx = after.x - before.x
    const dy = after.y - before.y
    const magnitude = Math.hypot(dx, dy) || 1
    const normalX = -dy / magnitude
    const normalY = dx / magnitude
    const distance = Math.abs(relative)
    const expansion = distance < radius
      ? maxExpansion * (1 + Math.cos(Math.PI * distance / radius)) / 2
      : 0
    const halfWidth = normalHalfWidth + expansion

    upper.push(`${point.x + normalX * halfWidth},${point.y + normalY * halfWidth}`)
    lower.push(`${point.x - normalX * halfWidth},${point.y - normalY * halfWidth}`)
  }

  pulsePath.value = `M${upper.join('L')}L${lower.reverse().join('L')}Z`
  frameId = requestAnimationFrame(renderPulse)
}

const start = async () => {
  if (!import.meta.client || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (frameId) cancelAnimationFrame(frameId)
  startedAt = 0
  await nextTick()
  frameId = requestAnimationFrame(renderPulse)
}

watch(() => props.path, start)
onMounted(start)
onBeforeUnmount(() => {
  if (frameId) cancelAnimationFrame(frameId)
})
</script>

<style scoped>
.circuit-fluid-pulse {
  shape-rendering: geometricPrecision;
}
</style>
