<template>
  <div class="collapse collapse-arrow bg-base-100 border border-base-200 rounded-xl shadow-xs">
    <input type="checkbox" />
    <div class="collapse-title font-bold text-sm text-base-content/80">
      سوالات متداول دسته‌بندی (FAQ)
    </div>
    <div class="collapse-content space-y-4 pt-2">
      <div class="space-y-3">
        <div v-for="(faq, idx) in modelValue" :key="'faq-' + idx" class="border border-base-200 rounded-xl p-4 bg-base-50/50 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-base-content/60">سوال متداول #{{ (idx + 1).toLocaleString('fa-IR') }}</span>
            <button type="button" @click="removeItem(idx)" class="btn btn-xs btn-square btn-ghost text-error">
              <Trash2 class="size-4" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" v-model="faq.title.en" placeholder="Question (EN)" dir="ltr" class="input input-sm input-bordered rounded-lg" />
            <input type="text" v-model="faq.title.fa" placeholder="پرسش متداول (FA)" class="input input-sm input-bordered rounded-lg" />
            <textarea v-model="faq.description.en" placeholder="Answer (EN)" rows="2" dir="ltr" class="textarea textarea-sm textarea-bordered rounded-lg"></textarea>
            <textarea v-model="faq.description.fa" placeholder="پاسخ کوتاه (FA)" rows="2" class="textarea textarea-sm textarea-bordered rounded-lg"></textarea>
          </div>
        </div>
      </div>
      <button type="button" @click="addItem" class="btn btn-sm btn-block btn-dashed border-primary text-primary bg-primary/5 rounded-xl font-bold">
        <PlusCircle class="size-4" />
        افزودن پرسش و پاسخ جدید
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2, PlusCircle } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: Array<{ title: { en?: string; fa?: string }; description: { en?: string; fa?: string }; }>;
}>();

const emit = defineEmits(['update:modelValue']);

function addItem() {
  const items = [...props.modelValue];
  items.push({ title: { en: '', fa: '' }, description: { en: '', fa: '' } });
  emit('update:modelValue', items);
}

function removeItem(idx: number) {
  const items = [...props.modelValue];
  items.splice(idx, 1);
  emit('update:modelValue', items);
}
</script>