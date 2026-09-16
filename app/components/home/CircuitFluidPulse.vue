<template>
  <g
    class="circuit-fluid-pulse"
    aria-hidden="true"
    :style="{
      '--pulse-duration': `${props.duration}ms`,
      '--secondary-delay': `${props.duration * -0.56}ms`,
    }"
  >
    <path
      :d="path"
      class="circuit-fluid-pulse__path circuit-fluid-pulse__glow"
      pathLength="100"
      fill="none"
      stroke="var(--color-primary)"
      stroke-linecap="round"
      stroke-width="8"
    />
    <path
      :d="path"
      class="circuit-fluid-pulse__path circuit-fluid-pulse__core"
      pathLength="100"
      fill="none"
      stroke="var(--color-primary)"
      stroke-linecap="round"
      stroke-width="2.4"
    />
    <path
      :d="path"
      class="circuit-fluid-pulse__path circuit-fluid-pulse__glow circuit-fluid-pulse__secondary"
      pathLength="100"
      fill="none"
      stroke="var(--color-primary)"
      stroke-linecap="round"
      stroke-width="6"
    />
    <path
      :d="path"
      class="circuit-fluid-pulse__path circuit-fluid-pulse__core circuit-fluid-pulse__secondary"
      pathLength="100"
      fill="none"
      stroke="var(--color-primary)"
      stroke-linecap="round"
      stroke-width="1.8"
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
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 8 92;
  stroke-dashoffset: 100;
  animation: circuit-fluid-pulse var(--pulse-duration, 7s) linear infinite;
}

.circuit-fluid-pulse__glow {
  opacity: 0.11;
  filter: drop-shadow(0 0 4px color-mix(in oklab, var(--color-primary) 42%, transparent));
}

.circuit-fluid-pulse__core {
  opacity: 0.95;
  filter: drop-shadow(0 0 1.5px color-mix(in oklab, var(--color-primary) 60%, transparent));
}

.circuit-fluid-pulse__secondary {
  animation-delay: var(--secondary-delay);
  stroke-dasharray: 4 96;
  opacity: 0.46;
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
