<template>
  <div class="drawer-side z-50">
    <label 
      for="layout-drawer" 
      aria-label="close sidebar" 
      class="drawer-overlay"
    ></label>
    
    <div class="w-full md:w-96 bg-base-100 text-base-content border-neutral-200 dark:border-neutral-800 flex flex-col h-[80vh] md:h-full mt-auto md:mt-0 rounded-t-3xl md:rounded-t-none border-t md:border-t-0 border-r md:border-r">
      
      <div class="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center shrink-0">
        <h3 class="font-bold text-lg text-primary">دسته‌بندی محصولات</h3>
        <button @click="$emit('close')" class="btn btn-ghost btn-circle btn-sm">
          <X class="size-5" />
        </button>
      </div>

      <div dir="ltr" class="grow overflow-y-auto overflow-x-hidden no-scrollbar">
        <div dir="rtl" class="p-4">
          <div v-if="loading" class="flex justify-center items-center py-12">
            <span class="loading loading-spinner loading-md text-primary"></span>
          </div>

          <ul v-else class="menu menu-md p-0 w-full gap-2">
            <li v-for="cat in sortedCategories" :key="cat?.id">
              <details v-if="cat?.children && cat.children.length > 0">
                <summary class="text-base font-semibold text-base-content py-2.5 transition-colors duration-200 hover:text-primary! hover:bg-primary/5! focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit group">
                  <div 
                    v-if="cat?.image_url" 
                    class="size-7 shrink-0 transition-colors duration-200 bg-base-content group-hover:bg-primary"
                    :style="{ 
                      maskImage: `url(${getIconUrl(cat.image_url)})`,
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      maskSize: 'contain',
                      WebkitMaskImage: `url(${getIconUrl(cat.image_url)})`,
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      WebkitMaskSize: 'contain'
                    }"
                  ></div>
                  <Folder v-else class="size-7 text-primary opacity-70 shrink-0" />
                  <div class="flex flex-col gap-0.5">
                    <span>{{ cat?.name }}</span>
                    <span v-if="cat?.meta_title" class="text-sm font-normal text-base-content/50 group-hover:text-primary/70 transition-colors duration-200" dir="ltr text-right">{{ cat.meta_title }}</span>
                  </div>
                </summary>
                
                <ul class="before:right-4 before:left-auto mr-3 ml-0 pr-3 pl-0 gap-2 border-r border-neutral-200 dark:border-neutral-800">
                  <li v-for="child in [...cat.children].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))" :key="child?.id">
                    <NuxtLink 
                      :to="`/categories/${child?.slug}`" 
                      @click="$emit('close')" 
                      active-class="neutral-link"
                      exact-class="neutral-link"
                      class="text-sm py-2 transition-colors duration-200 hover:text-primary hover:bg-primary/5 focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit group"
                    >
                      <div 
                        v-if="child?.image_url" 
                        class="size-6 shrink-0 transition-colors duration-200 bg-base-content group-hover:bg-primary"
                        :style="{ 
                          maskImage: `url(${getIconUrl(child.image_url)})`,
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          maskSize: 'contain',
                          WebkitMaskImage: `url(${getIconUrl(child.image_url)})`,
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          WebkitMaskSize: 'contain'
                        }"
                      ></div>
                      <div class="flex flex-col gap-0.5">
                        <span>{{ child?.name }}</span>
                        <span v-if="child?.meta_title" class="text-xs font-normal text-base-content/50 group-hover:text-primary/70 transition-colors duration-200" dir="ltr text-right">{{ child.meta_title }}</span>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </details>
              
              <NuxtLink 
                v-else 
                :to="`/product/${cat?.slug}`" 
                @click="$emit('close')" 
                active-class="neutral-link"
                exact-class="neutral-link"
                class="text-base font-semibold text-base-content py-2.5 transition-colors duration-200 hover:text-primary hover:bg-primary/5 focus:bg-transparent focus:text-inherit active:bg-transparent active:text-inherit group"
              >
                <div 
                  v-if="cat?.image_url" 
                  class="size-7 shrink-0 transition-colors duration-200 bg-base-content group-hover:bg-primary"
                  :style="{ 
                    maskImage: `url(${getIconUrl(cat.image_url)})`,
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskImage: `url(${getIconUrl(cat.image_url)})`,
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain'
                  }"
                ></div>
                <FileText v-else class="size-7 text-primary opacity-70 shrink-0" />
                <div class="flex flex-col gap-0.5">
                  <span>{{ cat?.name }}</span>
                  <span v-if="cat?.meta_title" class="text-sm font-normal text-base-content/50 group-hover:text-primary/70 transition-colors duration-200" dir="ltr text-right">{{ cat.meta_title }}</span>
                </div>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, Folder, FileText } from 'lucide-vue-next'
import type { Category } from '~/composables/useCategories'

const props = defineProps<{
  loading: boolean
  categories: Category[]
}>()

defineEmits(['close'])

const config = useRuntimeConfig()
const baseUrl = config?.public?.apiBase || 'http://localhost:3000/api'

const getIconUrl = (url: string) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

const sortedCategories = computed(() => {
  if (!Array.isArray(props.categories)) return []
  return [...props.categories]
    .filter(cat => cat && cat.category_type === 'product' && cat.parent_id === null)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
})
</script>

<style scoped>
/* Target WebKit and standard engines inside this component scope */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>