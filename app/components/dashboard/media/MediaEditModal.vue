<template>
  <div class="modal modal-open bg-black/60 z-70 transition-all duration-200">
    <div class="modal-box max-w-md w-full bg-base-100 rounded-2xl border border-base-200 p-6 relative">
      <h3 class="text-lg font-bold text-base-content mb-4">ویرایش اطلاعات رسانه</h3>
      
      <form @submit.prevent="submitUpdate" class="space-y-4">
        <div class="form-control w-full">
          <label class="label font-semibold text-xs text-base-content/70">جایگزینی فایل (اختیاری)</label>
          <input 
            type="file" 
            @change="handleFileChange" 
            class="file-input file-input-bordered w-full rounded-xl text-sm"
          />
        </div>
        
        <div class="form-control w-full">
          <label class="label font-semibold text-xs text-base-content/70">توضیحات فایل</label>
          <input 
            type="text" 
            v-model="editedDescription" 
            required 
            class="input input-bordered w-full rounded-xl text-sm"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="$emit('close')" class="btn btn-ghost rounded-xl px-5 text-sm">
            انصراف
          </button>
          <button type="submit" :disabled="updating" class="btn btn-primary rounded-xl font-bold px-6 text-sm">
            <span v-if="updating" class="loading loading-spinner loading-xs"></span>
            {{ updating ? 'در حال ذخیره‌سازی...' : 'بروزرسانی نهایی' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '~/composables/useToast';

interface Asset {
  id: string;
  file_url: string;
  description: string;
}

const props = defineProps<{ asset: Asset }>();
const emit = defineEmits(['close', 'asset-updated']);
const toast = useToast();

// Use global window inference here as well
const file = ref<Blob | null>(null);
const editedDescription = ref(props.asset.description);
const updating = ref(false);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] || null;
};

const getUploaderId = (): string => {
  if (import.meta.client) {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString).user_id || '78a95bd8-c59c-4c92-a1a7-f56d5a3ed3ed';
      } catch (e) {}
    }
  }
  return '78a95bd8-c59c-4c92-a1a7-f56d5a3ed3ed';
};

const submitUpdate = async () => {
  updating.value = true;
  const formData = new FormData();
  if (file.value) formData.append('file', file.value);
  formData.append('description', editedDescription.value);
  formData.append('uploader_id', getUploaderId());

  try {
    await $fetch(`/api/media/${props.asset.id}`, {
      method: 'PUT',
      body: formData
    });
    toast.success('تغییرات فایل با موفقیت اعمال شد.');
    emit('asset-updated');
  } catch (error) {
    toast.error('ویرایش فایل با خطا مواجه شد.');
  } finally {
    updating.value = false;
  }
};
</script>