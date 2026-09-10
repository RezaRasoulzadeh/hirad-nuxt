<template>
  <g class="circuit-fluid-pulse" aria-hidden="true" :style="{ '--pulse-duration': `${props.duration}ms` }">
    <path
      :d="path"
      class="circuit-fluid-pulse__path"
      pathLength="100"
      fill="none"
      stroke="var(--color-primary)"
      stroke-linecap="round"
      stroke-width="3"
    />
  </g>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  path: string
  duration?: number
}>(), {
  duration: 7000,
})
</script>

<style scoped>
.circuit-fluid-pulse {
  pointer-events: none;
}

.circuit-fluid-pulse__path {
  stroke-dasharray: 0 17 6 77;
  stroke-dashoffset: 100;
  animation: circuit-fluid-pulse var(--pulse-duration, 7s) linear infinite;
}

@keyframes circuit-fluid-pulse {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .circuit-fluid-pulse__path {
    animation: none;
    opacity: 0;
  }
}
</style>
