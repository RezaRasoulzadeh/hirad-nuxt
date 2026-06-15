<template>
  <div class="w-full" dir="rtl">
    <div role="tablist" class="tabs tabs-bordered w-full md:w-auto mb-6 flex border-b border-base-200">
      <button 
        role="tab" 
        class="tab text-base font-bold pb-3 px-6 h-auto transition-all duration-200 border-b-2 -mb-0.5"
        :class="activeTab === 'specifications' ? 'tab-active text-primary border-primary' : 'border-transparent text-base-content/60 hover:text-base-content'"
        @click="$emit('update:activeTab', 'specifications')"
      >
        مشخصات فنی تکمیلی
      </button>
      <button 
        role="tab" 
        class="tab text-base font-bold pb-3 px-6 h-auto transition-all duration-200 border-b-2 -mb-0.5"
        :class="activeTab === 'explanation' ? 'tab-active text-primary border-primary' : 'border-transparent text-base-content/60 hover:text-base-content'"
        @click="$emit('update:activeTab', 'explanation')"
      >
        توضیحات تکمیلی
      </button>
    </div>

    <div class="mt-4 relative overflow-hidden min-h-50">
      <Transition mode="out-in" name="tab-fade">
        <div :key="activeTab">
          <div v-if="activeTab === 'specifications'">
            <div v-if="specifications && specifications.length > 0" class="overflow-x-auto border border-base-200 rounded-xl shadow-sm">
              <table class="table table-zebra w-full bg-base-100">
                <thead>
                  <tr class="bg-base-200/80 text-base-content/80 text-sm">
                    <th class="text-right py-4 pr-6 font-bold w-1/3">پارامتر</th>
                    <th class="text-right py-4 pl-6 font-bold w-2/3">مقدار</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(spec, idx) in specifications" :key="idx" class="hover:bg-base-200/40 transition-colors">
                    <td class="font-bold text-base-content/90 pr-6 py-4">{{ spec.name_fa || spec.name }}</td>
                    <td class="text-base-content/80 pl-6 py-4 select-all">{{ spec.description_fa || spec.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 text-base-content/50 bg-base-100 border border-base-200 rounded-xl">
              مشخصات فنی در دسترس نیست.
            </div>
          </div>

          <div v-if="activeTab === 'explanation'">
            <div v-if="explanations && explanations.length > 0" class="flex flex-col gap-6">
              <div v-for="(section, idx) in explanations" :key="section.title || idx" class="bg-base-100 border border-base-200 rounded-xl p-6 shadow-sm">
                <h4 class="text-xl font-bold mb-4 text-base-content">{{ section.title_fa || section.title }}</h4>
                <div v-if="section.image" class="mb-4 max-w-2xl">
                  <img :src="resolveImageUrl(section.image)" :alt="section.title_fa || section.title" class="rounded-xl border border-base-200 max-w-full h-auto shadow-md" />
                </div>
                <p class="text-base-content/80 leading-relaxed text-justify">{{ section.description_fa || section.description }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-base-content/50 bg-base-100 border border-base-200 rounded-xl">
              توضیحات بیشتری برای این محصول ثبت نشده است.
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'
import type { SpecificationItem } from '~/composables/useProduct'

defineProps<{
  activeTab: 'specifications' | 'explanation'
  specifications: SpecificationItem[]
  explanations: any[]
}>()

defineEmits<{
  (e: 'update:activeTab', tab: 'specifications' | 'explanation'): void
}>()

const config = useRuntimeConfig()

const resolveImageUrl = (imagePath: string): string => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath
  
  const baseUrl = config.public.apiBase || ''
  return `${baseUrl}${imagePath}`
}
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>