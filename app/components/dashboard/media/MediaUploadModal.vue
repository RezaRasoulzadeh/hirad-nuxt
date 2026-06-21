<template>
  <div class="modal modal-open bg-black/60 z-70 transition-all duration-200">
    <div class="modal-box max-w-md w-full bg-base-100 rounded-2xl border border-base-200 p-6 relative">
      <h3 class="text-lg font-bold text-base-content mb-4">بارگذاری فایل رسانه جدید</h3>
      
      <form @submit.prevent="submitUpload" class="space-y-4">
        <div class="form-control w-full">
          <label class="label font-semibold text-xs text-base-content/70">انتخاب فایل</label>
          <input 
            type="file" 
            @change="handleFileChange" 
            required 
            class="file-input file-input-bordered file-input-primary w-full rounded-xl text-sm"
          />
        </div>
        
        <div class="form-control w-full">
          <label class="label font-semibold text-xs text-base-content/70">توضیحات فایل</label>
          <input 
            type="text" 
            v-model="description" 
            required 
            class="input input-bordered w-full rounded-xl text-sm"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" @click="$emit('close')" class="btn btn-ghost rounded-xl px-5 text-sm">
            انصراف
          </button>
          <button type="submit" :disabled="uploading" class="btn btn-primary rounded-xl font-bold px-6 text-sm">
            <span v-if="uploading" class="loading loading-spinner loading-xs"></span>
            {{ uploading ? 'در حال بارگذاری...' : 'شروع بارگذاری' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '~/composables/useToast';

const emit = defineEmits(['close', 'asset-uploaded']);
const toast = useToast();

const file = ref<Blob | null>(null);
const description = ref('');
const uploading = ref(false);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const selectedFile = target.files?.[0];
  
  if (selectedFile) {
    file.value = selectedFile;
    
    // Only pre-fill if the user hasn't typed anything in the description yet
    if (!description.value.trim()) {
      // Strips the extension from the filename
      description.value = selectedFile.name.replace(/\.[^/.]+$/, "");
    }
  } else {
    file.value = null;
  }
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

const submitUpload = async () => {
  if (!file.value || !description.value) return;
  uploading.value = true;

  const formData = new FormData();
  formData.append('file', file.value);
  formData.append('description', description.value);
  formData.append('uploader_id', getUploaderId());

  try {
    await $fetch('/api/dashboard/media', {
      method: 'POST',
      body: formData
    });
    toast.success('فایل با موفقیت بارگذاری شد.');
    emit('asset-uploaded');
  } catch (error) {
    toast.error('بارگذاری فایل با خطا مواجه گردید.');
  } finally {
    uploading.value = false;
  }
};
</script>