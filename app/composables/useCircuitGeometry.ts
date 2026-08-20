import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export const useCircuitGeometry = () => {
  const circuitFrameRef = ref<HTMLElement | null>(null)
  const frameRatio = ref(700 / 1000)
  let observer: ResizeObserver | undefined

  const syncRatio = () => {
    const frame = circuitFrameRef.value
    if (!frame?.offsetWidth || !frame.offsetHeight) return
    frameRatio.value = frame.offsetHeight / frame.offsetWidth
  }

  const cornerOffset = (verticalUnits: number) => computed(() =>
    Math.max(10, Math.min(70, verticalUnits * frameRatio.value * (1000 / 700)))
  )

  onMounted(() => {
    syncRatio()
    observer = new ResizeObserver(syncRatio)
    if (circuitFrameRef.value) observer.observe(circuitFrameRef.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  return {
    circuitFrameRef,
    topCornerOffset: cornerOffset(44),
    bottomCornerOffset: cornerOffset(58),
  }
}
