<template>
  <div class="breadcrumbs text-sm" dir="rtl">
    <ul>
      <li>
        <NuxtLink to="/dashboard">داشبورد</NuxtLink>
      </li>
      <li v-for="(crumb, index) in computedCrumbs" :key="crumb.path">
        <NuxtLink v-if="index < computedCrumbs.length - 1" :to="crumb.path">
          {{ crumb.name }}
        </NuxtLink>
        <template v-else>
          {{ crumb.name }}
        </template>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from '#app';

interface MenuItem {
  name: string;
  path: string;
}

const props = defineProps<{
  menuItems: MenuItem[];
}>();

const route = useRoute();

const computedCrumbs = computed(() => {
  const currentPath = typeof route.path === 'string' ? route.path : '';
  const cleanPath = currentPath.split('?')[0] || '';
  const segments = cleanPath.split('/').filter(Boolean);

  if (segments.length <= 1 || segments[0] !== 'dashboard') {
    return [];
  }

  const list: Array<{ name: string; path: string }> = [];
  let progressivePath = '/dashboard';

  for (let i = 1; i < segments.length; i++) {
    progressivePath += `/${segments[i]}`;
    const matchedItem = props.menuItems.find(item => item.path === progressivePath);
    const fallbackName = segments[i] || '';
    
    list.push({
      name: matchedItem ? matchedItem.name : fallbackName,
      path: progressivePath
    });
  }

  return list;
});
</script>