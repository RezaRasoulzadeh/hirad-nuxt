<template>
  <div ref="circuitFrameRef" class="circuit-border" :class="{ 'circuit-border--signal': animation === 'signal' }" aria-hidden="true">
    <svg
      class="absolute inset-0 size-full overflow-visible"
      viewBox="0 0 1000 700"
      fill="none"
      preserveAspectRatio="none"
    >
      <path :d="circuitPath" class="circuit-border__halo" />
      <path :d="circuitPath" class="circuit-border__rail" />
      <CircuitFluidPulse v-if="animation === 'pulse'" :path="circuitPath" :duration="duration" />
    </svg>

    <CircuitBorderSignal v-if="animation === 'signal'"
      :points="circuitPoints" :frame-size="frameSize" :junction-y="junctionY"
      :duration="duration" :show-end-node="showEndNode" />

    <template v-else>
      <span class="circuit-border__terminal" :style="topTerminalStyle" />

      <span class="circuit-border__junctions" :style="junctionStyle">
        <i v-for="dot in 3" :key="dot" :class="{ 'is-active': dot === 2 }" />
      </span>

      <span v-if="showEndNode" class="circuit-border__terminal" :style="endTerminalStyle" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CircuitFluidPulse from './CircuitFluidPulse.vue'
import CircuitBorderSignal from './CircuitBorderSignal.vue'
import { useCircuitGeometry } from '~/composables/useCircuitGeometry'

// Place inside a relatively positioned section frame. Anchors use the 1000 × 700 viewBox.
const props = withDefaults(defineProps<{
  side?: 'left' | 'right'
  topAnchorX?: number
  bottomAnchorX?: number
  bottomY?: number
  junctionY?: number
  duration?: number
  showEndNode?: boolean
  animation?: 'pulse' | 'signal'
}>(), {
  side: 'left',
  topAnchorX: 500,
  bottomY: 610,
  junctionY: 476,
  duration: 9000,
  showEndNode: true,
  animation: 'signal',
})

const { circuitFrameRef, frameSize, topCornerOffset, bottomCornerOffset } = useCircuitGeometry()
const bottomAnchorX = computed(() => props.bottomAnchorX ?? (props.side === 'right' ? 785 : 215))

const circuitPoints = computed<[number, number][]>(() => {
  const edgeX = props.side === 'left' ? 18 : 982
  const topCornerX = props.side === 'left'
    ? edgeX + topCornerOffset.value
    : edgeX - topCornerOffset.value
  const bottomCornerX = props.side === 'left'
    ? edgeX + bottomCornerOffset.value
    : edgeX - bottomCornerOffset.value

  return [
    [props.topAnchorX, 30],
    [topCornerX, 30],
    [edgeX, 74],
    [edgeX, props.bottomY - 58],
    [bottomCornerX, props.bottomY],
    [bottomAnchorX.value, props.bottomY],
  ]
})

const circuitPath = computed(() => circuitPoints.value
  .map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(''))

const pointStyle = (x: number, y: number) => ({
  left: `calc(${x / 10}% - 0.375rem)`,
  top: `calc(${y / 7}% - 0.375rem)`,
})

const topTerminalStyle = computed(() => pointStyle(props.topAnchorX, 30))
const endTerminalStyle = computed(() => pointStyle(bottomAnchorX.value, props.bottomY))
const junctionStyle = computed(() => ({
  left: props.side === 'left'
    ? 'calc(1.8% - 0.3125rem)'
    : 'calc(98.2% - 0.3125rem)',
  top: `calc(${props.junctionY / 7}% - 1.3125rem)`,
}))
</script>

<style scoped>
.circuit-border {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 10;
  display: none;
}

.circuit-border__halo,
.circuit-border__rail {
  fill: none;
  vector-effect: non-scaling-stroke;
}

.circuit-border--signal .circuit-border__halo {
  opacity: 0;
}

.circuit-border--signal .circuit-border__rail {
  stroke: var(--color-primary);
  stroke-width: 1;
  opacity: 1;
  stroke-linejoin: round;
}

.circuit-border__halo {
  stroke: var(--color-primary);
  stroke-width: 7;
  opacity: 0.045;
}

.circuit-border__rail {
  stroke: color-mix(in oklab, var(--color-primary) 58%, var(--color-base-300));
  stroke-width: 1.25;
  opacity: 0.82;
}

.circuit-border__terminal {
  position: absolute;
  display: block;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid color-mix(in oklab, var(--color-primary) 72%, white);
  border-radius: 9999px;
  background: var(--color-base-100);
  box-shadow:
    0 0 0 3px color-mix(in oklab, var(--color-primary) 10%, transparent),
    0 0 14px color-mix(in oklab, var(--color-primary) 24%, transparent);
}

.circuit-border__terminal::after {
  position: absolute;
  inset: 2px;
  border-radius: inherit;
  background: var(--color-primary);
  content: '';
}

.circuit-border__junctions {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.circuit-border__junctions i {
  display: block;
  width: 0.36rem;
  height: 0.36rem;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--color-primary) 55%, var(--color-base-300));
  box-shadow: 0 0 0 2px var(--color-base-100);
}

.circuit-border__junctions i.is-active {
  width: 0.58rem;
  height: 0.58rem;
  background: var(--color-primary);
  box-shadow:
    0 0 0 3px var(--color-base-100),
    0 0 0 5px color-mix(in oklab, var(--color-primary) 12%, transparent);
}

@media (min-width: 48rem) {
  .circuit-border {
    display: block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .circuit-border__terminal,
  .circuit-border__junctions i {
    box-shadow: none;
  }
}
</style>
