<template>
  <form v-if="modelValue" @submit.prevent="$emit('save')">
    <div class="space-y-4">
      <div v-for="(cert, idx) in modelValue.content?.Certificates || []" :key="'cert-' + idx" class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title flex items-center justify-between font-medium text-sm">
          <div class="flex items-center gap-2">
            <span>{{ cert.title || 'گواهی بدون نام' }}</span>
            <span v-if="cert.showOnHomepage" class="badge badge-success badge-sm text-white">صفحه اصلی</span>
          </div>
          <button type="button" @click.stop="modelValue.content.Certificates.splice(idx, 1)" class="btn btn-ghost btn-xs text-error">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
        <div class="collapse-content flex flex-col gap-4 bg-base-100 pt-4 lg:flex-row lg:items-start">
          <AssetPickerField v-model="cert.image" label="تصویر گواهی" class="w-full lg:w-64 lg:shrink-0"
            @select="$emit('select-media', idx, 'cert')" />
          <div class="min-w-0 grow space-y-4">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input v-model="cert.title" type="text" placeholder="Title (EN)" class="input input-bordered w-full" />
              <input v-model="cert.title_fa" type="text" placeholder="Title (FA)" class="input input-bordered w-full" />
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <textarea v-model="cert.description" placeholder="Description (EN)" class="textarea textarea-bordered h-20 w-full resize-none"></textarea>
              <textarea v-model="cert.description_fa" placeholder="Description (FA)" class="textarea textarea-bordered h-20 w-full resize-none"></textarea>
            </div>
            <div class="flex w-full items-center justify-between gap-6 rounded-lg bg-base-200/40 p-3 md:justify-start">
              <label class="label cursor-pointer space-x-2 space-x-reverse select-none">
                <input v-model="cert.showOnHomepage" type="checkbox" class="checkbox checkbox-primary checkbox-sm" />
                <span class="label-text text-xs font-medium">نمایش در صفحه اصلی</span>
              </label>
              <div class="flex items-center gap-2">
                <span class="text-xs font-medium text-base-content/70">ترتیب چیدمان:</span>
                <input v-model.number="cert.order" type="number" class="input input-bordered input-sm w-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="button" @click="addCertificate" class="btn btn-outline btn-dashed btn-success btn-block">
        <PlusCircle class="w-4 h-4 mr-2" /> افزودن گواهی جدید
      </button>
      <button type="submit" class="btn btn-primary btn-block mt-6">ذخیره تغییرات گواهی‌ها</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Trash2, PlusCircle } from 'lucide-vue-next'
import AssetPickerField from './AssetPickerField.vue'

const props = defineProps<{ modelValue: any }>()
defineEmits(['save', 'select-media'])

const addCertificate = () => {
  if (!props.modelValue.content) props.modelValue.content = {}
  if (!props.modelValue.content.Certificates) props.modelValue.content.Certificates = []
  props.modelValue.content.Certificates.push({ title: '', description: '', title_fa: '', description_fa: '', image: '', showOnHomepage: false, order: 0 })
}
</script>
