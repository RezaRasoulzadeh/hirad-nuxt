<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

interface NavItem {
  id: string | number
  name: string
  slug: string
  image_url?: string
  meta_title?: string
  children?: NavItem[]
}

const props = defineProps<{
  items: NavItem[]
}>()

const emit = defineEmits(['close'])
const config = useRuntimeConfig()
const baseURL = config.public.baseURL as string

const isOpen = ref(true)

watch(isOpen, (value) => {
  if (!value) {
    emit('close')
  }
})

// Recursively builds the uniform tree hierarchy expected by Nuxt UI v3
const formatNavigation = (list: NavItem[]): NavigationMenuItem[] => {
  return list.map((item) => {
    const hasChildren = !!item.children?.length
    
    return {
      label: item.name,
      description: item.meta_title,
      to: !hasChildren ? (item.slug === '' ? '/' : `/${item.slug}`) : undefined,
      children: hasChildren ? formatNavigation(item.children!) : undefined,
      onSelect: () => {
        if (!hasChildren) {
          isOpen.value = false
        }
      }
    }
  })
}

const navigationLinks = computed(() => formatNavigation(props.items))
</script>

<template>
  <USlideover v-model="isOpen" side="left">
    <div class="flex flex-col h-full bg-white dark:bg-neutral-900" dir="rtl">
      
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
        <img src="~/assets/Logo-wide.png" alt="لوگو" class="h-10 object-contain" />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          aria-label="Close"
          @click="isOpen = false"
        />
      </div>

      <nav class="flex-1 overflow-y-auto p-4">
        <UNavigationMenu 
          orientation="vertical"
          :items="navigationLinks" 
          class="w-full text-right"
        />
      </nav>
      
    </div>
  </USlideover>
</template>