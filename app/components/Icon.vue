<script setup lang="ts">
const props = defineProps<{ name: string; class?: string }>()

const modules = import.meta.glob('~/assets/icons/*.svg', {
  eager: true,
  query: '?component',
  import: 'default',
})

const iconComponent = computed(() => {
  const key = Object.keys(modules).find(k => k.endsWith(`/${props.name}.svg`))
  return key ? modules[key] : null
})
</script>

<template>
  <component :is="iconComponent" :class="props.class ?? 'w-6 h-6'" />
</template>