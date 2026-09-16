<template>
  <div ref="circuitFrameRef" class="circuit-border" aria-hidden="true">
    <svg
      class="absolute inset-0 size-full overflow-visible"
      viewBox="0 0 1000 700"
      fill="none"
      preserveAspectRatio="none"
    >
      <path :d="circuitPath" class="circuit-border__halo" />
      <path :d="circuitPath" class="circuit-border__rail" />
      <CircuitFluidPulse :path="circuitPath" :duration="duration" />
    </svg>

    <span class="circuit-border__terminal" :style="topTerminalStyle" />

    <span class="circuit-border__junctions" :style="junctionStyle">
      <i v-for="dot in 3" :key="dot" :class="{ 'is-active': dot === 2 }" />
    </span>

    <span v-if="showEndNode" class="circuit-border__terminal" :style="endTerminalStyle" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CircuitFluidPulse from './CircuitFluidPulse.vue'
import { useCircuitGeometry } from '~/composables/useCircuitGeometry'

const props = withDefaults(defineProps<{
  side?: 'left' | 'right'
  topAnchorX?: number
  bottomAnchorX?: number
  bottomY?: number
  junctionY?: number
  duration?: number
  showEndNode?: boolean
}>(), {
  side: 'left',
  topAnchorX: 500,
  bottomAnchorX: 215,
  bottomY: 610,
  junctionY: 476,
  duration: 7200,
  showEndNode: true,
})

const { circuitFrameRef, topCornerOffset, bottomCornerOffset } = useCircuitGeometry()

const circuitPath = computed(() => {
  const edgeX = props.side === 'left' ? 18 : 982
  const topCornerX = props.side === 'left'
    ? edgeX + topCornerOffset.value
    : edgeX - topCornerOffset.value
  const bottomCornerX = props.side === 'left'
    ? edgeX + bottomCornerOffset.value
    : edgeX - bottomCornerOffset.value

  return [
    `M${props.topAnchorX} 30`,
    `H${topCornerX}`,
    `L${edgeX} 74`,
    `V${props.bottomY - 58}`,
    `L${bottomCornerX} ${props.bottomY}`,
    `H${props.bottomAnchorX}`,
  ].join('')
})

const pointStyle = (x: number, y: number) => ({
  left: `calc(${x / 10}% - 0.375rem)`,
  top: `calc(${y / 7}% - 0.375rem)`,
})

const topTerminalStyle = computed(() => pointStyle(props.topAnchorX, 30))
const endTerminalStyle = computed(() => pointStyle(props.bottomAnchorX, props.bottomY))
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
