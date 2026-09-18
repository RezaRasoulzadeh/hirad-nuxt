<template>
  <div class="overflow-hidden rounded-xl border border-base-300 bg-base-100">
    <div v-if="$slots.header" class="border-b border-base-300 px-5 py-4 md:px-6">
      <slot name="header" />
    </div>
    <div class="overflow-x-auto">
      <table class="w-full min-w-[680px] border-collapse text-start text-sm">
        <slot />
      </table>
    </div>
  </div>
</template>
