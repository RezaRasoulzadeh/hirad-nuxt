<template>
  <div class="border-signal" :style="signalStyle" aria-hidden="true">
    <!-- Equal-width pieces form one light streak, fading at both ends.
         Its brightest midpoint shares the nodes' arrival clock. -->
    <span v-for="index in 15" :key="index" class="border-signal__traveller"
      :style="{
        '--lag': `${(index - 8) * 28}ms`,
        '--strength': `${Math.sin((index - 1) / 14 * Math.PI) ** 2 * 0.9}`,
      }" />

    <span v-for="node in nodes" :key="node.id" class="border-signal__node"
      :class="{ 'border-signal__node--terminal': node.terminal, 'border-signal__node--relay': node.id === 'relay-1' }"
      :style="{
        left: `${node.x}px`, top: `${node.y}px`,
        '--arrival-delay': `${(0.08 + 0.82 * node.progress - 0.015 - 1) * duration}ms`,
      }">
      <i class="border-signal__node-light" />
      <i class="border-signal__node-ring" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** The shared border's six vertices in its 1000 × 700 viewBox. */
  points: [number, number][]
  frameSize: { width: number, height: number }
  junctionY: number
  duration: number
  showEndNode: boolean
}>()

// Geometry is calculated only when the frame or props change. CSS owns the clock.
const geometry = computed(() => {
  const points = props.points.map(([x, y]) => ({
    x: x * props.frameSize.width / 1000,
    y: y * props.frameSize.height / 700,
  }))
  const distances = [0]
  for (let i = 1; i < points.length; i++) {
    const previous = points[i - 1]!
    const point = points[i]!
    distances.push(distances[i - 1]! + Math.hypot(point.x - previous.x, point.y - previous.y))
  }
  return { points, distances, length: distances.at(-1)! }
})

const signalStyle = computed(() => ({
  '--signal-path': `path('${geometry.value.points.map((point, i) =>
    `${i ? 'L' : 'M'}${point.x} ${point.y}`).join(' ')}')`,
  '--signal-duration': `${props.duration}ms`,
}))

const nodes = computed(() => {
  const { points, distances, length } = geometry.value
  const start = points[0]!
  const upperCorner = points[2]!
  const lowerCorner = points[3]!
  const end = points[5]!
  const relays = [-14, 0, 14].map((offset, index) => {
    const y = Math.max(upperCorner.y, Math.min(lowerCorner.y,
      props.junctionY * props.frameSize.height / 700 + offset))
    return {
      id: `relay-${index}`, x: upperCorner.x, y, terminal: false,
      progress: (distances[2]! + y - upperCorner.y) / length,
    }
  })
  return [
    { id: 'source', ...start, progress: 0, terminal: true },
    ...relays,
    ...(props.showEndNode ? [{ id: 'destination', ...end, progress: 1, terminal: true }] : []),
  ]
})
</script>

<style scoped>
.border-signal {
  --signal-highlight: #e53945;
  position: absolute;
  inset: 0;
  pointer-events: none;
  color: var(--color-primary);
}

.border-signal__traveller {
  --lag: 0ms;
  --strength: 0.9;
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 2px;
  border-radius: 1px;
  color: var(--signal-highlight);
  background: linear-gradient(90deg, transparent, currentColor 25%, currentColor 75%, transparent);
  opacity: 0;
  offset-path: var(--signal-path);
  offset-anchor: center;
  offset-rotate: auto;
  animation: border-signal-travel var(--signal-duration) linear infinite;
  animation-delay: calc(0ms - var(--signal-duration) + var(--lag));
}

.border-signal__node {
  position: absolute;
  width: 5px;
  height: 5px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 2px var(--color-base-100);
}

.border-signal__node--relay {
  width: 8px;
  height: 8px;
}

.border-signal__node--terminal {
  width: 12px;
  height: 12px;
}

.border-signal__node-light,
.border-signal__node-ring {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  animation: border-signal-receive var(--signal-duration) linear infinite;
  animation-delay: var(--arrival-delay);
}

.border-signal__node-light {
  background: var(--signal-highlight);
}

.border-signal__node--terminal .border-signal__node-light {
  inset: 3px;
}

.border-signal__node-ring {
  inset: -4px;
  border: 1px solid currentColor;
  animation-name: border-signal-ring;
}

/* Emission, constant-speed transit, reception, then a quiet interval.
   Every traveller resets while invisible; trailing light clears the destination. */
@keyframes border-signal-travel {
  0%, 8% { offset-distance: 0%; opacity: 0; }
  11% { opacity: var(--strength); }
  87% { opacity: var(--strength); }
  90%, 100% { offset-distance: 100%; opacity: 0; }
}

/* Peak brightness matches the streak's midpoint, measured along the actual rail. */
@keyframes border-signal-receive {
  0%, 9%, 100% { opacity: 0; }
  1.5% { opacity: 0.9; }
  4% { opacity: 0.4; }
}

@keyframes border-signal-ring {
  0% { opacity: 0; transform: scale(0.75); }
  1.5% { opacity: 0.25; }
  8%, 100% { opacity: 0; transform: scale(1.35); }
}

@supports not (offset-path: path('M0 0 L1 1')) {
  .border-signal__traveller,
  .border-signal__node-light,
  .border-signal__node-ring { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .border-signal__traveller,
  .border-signal__node-light,
  .border-signal__node-ring { animation: none; display: none; }
}
</style>
