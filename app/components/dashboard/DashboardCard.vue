<template>
  <div class="p-6 rounded-box bg-base-100 border border-base-200 shadow-sm flex items-center justify-between">
    <div>
      <h3 class="text-sm font-medium text-base-content/70">{{ title }}</h3>
      <p class="text-3xl font-bold mt-1 text-base-content">
        {{ count !== undefined ? count.toLocaleString('fa-IR') : (0).toLocaleString('fa-IR') }}
      </p>
    </div>
    <div class="p-3 rounded-full bg-primary text-primary-content shadow-sm">
      <component :is="iconComponent" class="size-6" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Folder, Package, Newspaper, Mail } from "lucide-vue-next";

const props = defineProps<{
  title: string;
  count: number | undefined;
  icon: "Folder" | "Package" | "Newspaper" | "Mail";
}>();

const iconComponent = computed(() => {
  const iconMap = { Folder, Package, Newspaper, Mail };
  return iconMap[props.icon] || Package;
});
</script>