<template>
  <div class="form-control w-full">
    <label :for="forId" class="mb-2 block text-sm font-medium text-base-content/75">
      {{ label }} <span v-if="required" class="text-primary" aria-hidden="true">*</span>
    </label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; forId: string; required?: boolean }>()
</script>
