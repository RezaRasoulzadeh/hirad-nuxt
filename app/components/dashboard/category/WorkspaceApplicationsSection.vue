<template>
  <div class="collapse collapse-arrow bg-base-100 border border-base-200 rounded-xl shadow-xs">
    <input type="checkbox" />
    <div class="collapse-title font-bold text-sm text-base-content/80">
      کاربردها و ویژگی‌ها (Applications)
    </div>
    <div class="collapse-content space-y-4 pt-2">
      <div class="space-y-3">
        <div v-for="(app, idx) in modelValue" :key="'app-' + idx" class="border border-base-200 rounded-xl p-4 bg-base-50/50 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-base-content/60">ویژگی کاربردی #{{ (idx + 1).toLocaleString('fa-IR') }}</span>
            <button type="button" @click="removeItem(idx)" class="btn btn-xs btn-square btn-ghost text-error">
              <Trash2 class="size-4" />
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" v-model="app.title" placeholder="Application Title (EN)" dir="ltr" class="input input-sm input-bordered rounded-lg" />
            <input type="text" v-model="app.title_fa" placeholder="عنوان ویژگی (FA)" class="input input-sm input-bordered rounded-lg" />
            <textarea v-model="app.description" placeholder="Description (EN)" rows="2" dir="ltr" class="textarea textarea-sm textarea-bordered rounded-lg"></textarea>
            <textarea v-model="app.description_fa" placeholder="توضیحات کاربرد (FA)" rows="2" class="textarea textarea-sm textarea-bordered rounded-lg"></textarea>
          </div>
          <div class="form-control w-full">
            <div class="flex gap-2 items-center">
              <input type="text" v-model="app.icon" placeholder="آدرس آیکون یا تصویر ویژگی" dir="ltr" class="input input-sm input-bordered flex-1 rounded-lg" />
              <button @click="$emit('select-asset', `app_icon_${idx}`)" type="button" class="btn btn-xs btn-outline btn-success h-8 rounded-lg px-3">انتخاب فایل</button>
            </div>
          </div>
        </div>
      </div>
      <button type="button" @click="addItem" class="btn btn-sm btn-block btn-dashed border-primary text-primary bg-primary/5 rounded-xl font-bold">
        <PlusCircle class="size-4" />
        افزودن کاربرد جدید
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2, PlusCircle } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: Array<{ id?: number | string; title?: string; title_fa?: string; icon?: string; description?: string; description_fa?: string; }>;
}>();

const emit = defineEmits(['update:modelValue', 'select-asset']);

function addItem() {
  const items = [...props.modelValue];
  items.push({ id: items.length + 1, title: '', title_fa: '', icon: '', description: '', description_fa: '' });
  emit('update:modelValue', items);
}

function removeItem(idx: number) {
  const items = [...props.modelValue];
  items.splice(idx, 1);
  emit('update:modelValue', items);
}
</script>