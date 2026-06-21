<template>
  <div class="collapse collapse-plus bg-base-100 border border-base-200 rounded-2xl shadow-sm overflow-hidden">
    <input type="checkbox" class="peer" :checked="expandedItems.has(0)" @change="$emit('toggle-expand', 0)" />
    
    <div class="collapse-title text-sm font-bold text-base-content/80 bg-base-50/40 flex items-center justify-between pointer-events-none">
      <span>{{ title }}</span>
    </div>

    <div class="collapse-content p-4! space-y-3 bg-base-100">
      <div
        v-for="(item, index) in items"
        :key="`${sectionType}-${index}`"
        class="border border-base-200 rounded-xl p-4 bg-base-50/20 hover:bg-base-50/50 transition-all relative group"
      >
        <div class="flex items-center justify-between border-b border-base-100 pb-2 mb-4">
          <div class="flex items-center gap-2">
            <span class="badge badge-sm badge-neutral font-mono">#{{ index + 1 }}</span>
            <span class="text-xs font-bold text-base-content/70">{{ getItemTitle(item) }}</span>
          </div>
          <button
            type="button"
            @click.stop="$emit('remove-item', index)"
            class="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-3">
          <!-- Applications Template Blocks -->
          <template v-if="sectionType === 'applications'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model="item.title" placeholder="Title (EN)" class="input input-bordered input-sm rounded-lg text-xs" />
              <input v-model="item.title_fa" placeholder="عنوان (FA)" dir="rtl" class="input input-bordered input-sm rounded-lg text-xs font-semibold" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea v-model="item.description" placeholder="Description (EN)" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-15"></textarea>
              <textarea v-model="item.description_fa" placeholder="توضیحات کاربرد (FA)" dir="rtl" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-15"></textarea>
            </div>
            <div class="flex items-center gap-2">
              <input v-model="item.icon" placeholder="Icon Asset File URL" readonly class="input input-bordered input-sm rounded-lg text-xs flex-1 bg-base-200/50 font-mono" />
              <button @click="$emit('open-media', index)" type="button" class="btn btn-neutral btn-sm rounded-lg text-xs px-4">انتخاب آیکون</button>
            </div>
          </template>

          <!-- Specifications Template Blocks -->
          <template v-else-if="sectionType === 'specifications'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model="item.name" placeholder="Specification Name (EN)" class="input input-bordered input-sm rounded-lg text-xs" />
              <input v-model="item.name_fa" placeholder="نام مشخصه (FA)" dir="rtl" class="input input-bordered input-sm rounded-lg text-xs font-semibold" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea v-model="item.description" placeholder="Value / Description (EN)" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-15"></textarea>
              <textarea v-model="item.description_fa" placeholder="مقدار / مشخصات فنی (FA)" dir="rtl" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-15"></textarea>
            </div>
          </template>

          <!-- Explanation Template Blocks -->
          <template v-else-if="sectionType === 'explanation'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model="item.title" placeholder="Title (EN)" class="input input-bordered input-sm rounded-lg text-xs" />
              <input v-model="item.title_fa" placeholder="عنوان بخش تکمیلی (FA)" dir="rtl" class="input input-bordered input-sm rounded-lg text-xs font-semibold" />
            </div>
            <div class="flex items-center gap-2">
              <input v-model="item.image" placeholder="Section Illustration Image URL" readonly class="input input-bordered input-sm rounded-lg text-xs flex-1 bg-base-200/50 font-mono" />
              <button @click="$emit('open-media', index)" type="button" class="btn btn-neutral btn-sm rounded-lg text-xs px-4">انتخاب تصویر</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea v-model="item.description" placeholder="Detailed Body Paragraph (EN)" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-17.5"></textarea>
              <textarea v-model="item.description_fa" placeholder="متن کامل پاراگراف (FA)" dir="rtl" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-17.5"></textarea>
            </div>
          </template>

          <!-- FAQ Template Blocks -->
          <template v-else-if="sectionType === 'faq'">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input v-model="item.title.en" placeholder="Question (EN)" class="input input-bordered input-sm rounded-lg text-xs" />
              <input v-model="item.title.fa" placeholder="پرسش متداول (FA)" dir="rtl" class="input input-bordered input-sm rounded-lg text-xs font-semibold" />
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <textarea v-model="item.description.en" placeholder="Answer Formulation (EN)" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-15"></textarea>
              <textarea v-model="item.description.fa" placeholder="پاسخ شبیه‌سازی شده (FA)" dir="rtl" class="textarea textarea-bordered textarea-sm rounded-lg text-xs min-h-15"></textarea>
            </div>
          </template>
        </div>
      </div>

      <button 
        type="button" 
        @click="$emit('add-item')" 
        class="btn btn-block btn-outline btn-neutral border-dashed rounded-xl h-11 min-h-0 text-xs font-bold gap-2 mt-2"
      >
        <PlusCircle class="w-4 h-4" />
        افزودن سطر جدید به این بخش
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusCircle, Trash2 } from 'lucide-vue-next'

interface Props {
  title: string
  items: any[]
  expandedItems: Set<number>
  sectionType?: 'applications' | 'specifications' | 'explanation' | 'faq'
}

const props = withDefaults(defineProps<Props>(), {
  sectionType: 'applications'
})

defineEmits<{
  'add-item': []
  'remove-item': [index: number]
  'toggle-expand': [index: number]
  'open-media': [index: number]
}>()

const getItemTitle = (item: any): string => {
  switch (props.sectionType) {
    case 'applications': return item.title || 'کاربرد جدید بدون عنوان'
    case 'specifications': return item.name || 'مشخصات فنی جدید'
    case 'explanation': return item.title || 'بخش تکمیلی جدید'
    case 'faq': return item.title?.en || item.title?.fa || 'سوال متداول جدید'
    default: return 'آیتم ساختار یافته جدید'
  }
}
</script>