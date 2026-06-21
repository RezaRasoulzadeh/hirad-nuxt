<template>
  <div class="collapse collapse-plus bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
    <input type="checkbox" class="peer" :checked="expandedItems.has(0)" @change="$emit('toggle-expand', 0)" />
    
    <div class="collapse-title text-sm font-bold text-base-content/80 bg-base-50/40 flex items-center justify-between pointer-events-none">
      <span>ویژگی‌های فنی محصول (Product Features)</span>
    </div>

    <div class="collapse-content p-4! space-y-3 bg-base-100">
      <div
        v-for="(feature, index) in features"
        :key="`feature-${index}`"
        class="border border-base-200 rounded-xl p-4 bg-base-50/20 transition-all hover:bg-base-50/50 relative group"
      >
        <div class="flex items-center justify-between border-b border-base-100 pb-3 mb-4">
          <div class="flex items-center gap-2">
            <span class="badge badge-sm badge-neutral font-mono">#{{ index + 1 }}</span>
            <span class="text-sm font-bold text-base-content">{{ getFeatureTitle(feature) }}</span>
          </div>
          <button
            type="button"
            @click.stop="$emit('remove-feature', index)"
            class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-control w-full">
            <label class="label py-1!"><span class="label-text-alt font-medium text-base-content/60">Key (EN)</span></label>
            <input
              :value="getFeatureKey(feature)"
              @input="(e) => $emit('update-feature-key', index, 'en', (e.target as HTMLInputElement).value)"
              placeholder="e.g., voltage, material"
              class="input input-sm input-bordered rounded-lg w-full focus:input-primary font-mono text-xs"
            />
          </div>
          
          <div class="form-control w-full">
            <label class="label py-1!"><span class="label-text-alt font-medium text-base-content/60">Value (EN)</span></label>
            <input
              :value="getFeatureValue(feature)"
              @input="(e) => $emit('update-feature-value', index, 'en', (e.target as HTMLInputElement).value)"
              placeholder="e.g., 24V DC, brass"
              class="input input-sm input-bordered rounded-lg w-full focus:input-primary text-xs"
            />
          </div>

          <div class="form-control w-full">
            <label class="label py-1!"><span class="label-text-alt font-medium text-base-content/60">کلید (FA)</span></label>
            <input
              :value="getFeatureKey(featuresFa[index] || {})"
              @input="(e) => $emit('update-feature-key', index, 'fa', (e.target as HTMLInputElement).value)"
              placeholder="مثال: ولتاژ، متریال"
              dir="rtl"
              class="input input-sm input-bordered rounded-lg w-full focus:input-primary text-xs font-semibold"
            />
          </div>

          <div class="form-control w-full">
            <label class="label py-1!"><span class="label-text-alt font-medium text-base-content/60">مقدار (FA)</span></label>
            <input
              :value="getFeatureValue(featuresFa[index] || {})"
              @input="(e) => $emit('update-feature-value', index, 'fa', (e.target as HTMLInputElement).value)"
              placeholder="مثال: ۲۴ ولت DC"
              dir="rtl"
              class="input input-sm input-bordered rounded-lg w-full focus:input-primary text-xs"
            />
          </div>
        </div>
      </div>

      <button 
        type="button" 
        @click="$emit('add-feature')" 
        class="btn btn-block btn-outline btn-success border-dashed rounded-xl h-11 min-h-0 text-xs font-bold gap-2 mt-2"
      >
        <PlusCircle class="w-4 h-4" />
        افزودن ویژگی فنی جدید
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusCircle, Trash2 } from 'lucide-vue-next'

interface Feature {
  [key: string]: string
}

interface Props {
  features: Feature[]
  featuresFa: Feature[]
  expandedItems: Set<number>
}

const props = defineProps<Props>()

defineEmits<{
  'add-feature': []
  'remove-feature': [index: number]
  'toggle-expand': [index: number]
  'update-feature-key': [index: number, lang: 'en' | 'fa', value: string]
  'update-feature-value': [index: number, lang: 'en' | 'fa', value: string]
}>()

const getFeatureKey = (feature: Feature): string => Object.keys(feature)[0] || ''
const getFeatureValue = (feature: Feature): string => {
  const key = getFeatureKey(feature)
  return key ? feature[key] ?? '' : ''
}

const getFeatureTitle = (feature: Feature): string => {
  const key = getFeatureKey(feature)
  const val = getFeatureValue(feature)
  return key && val ? `${key}: ${val}` : key || 'ویژگی بدون عنوان'
}
</script>