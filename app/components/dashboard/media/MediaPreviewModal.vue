<template>
  <div class="modal modal-open bg-black/70 z-70 p-4 transition-all duration-200" @click="$emit('close')">
    <div class="modal-box max-w-4xl w-full h-[80vh] p-0 flex flex-col overflow-hidden bg-base-100 rounded-2xl border border-base-200 shadow-2xl" @click.stop>
      
      <div class="p-4 border-b border-base-200 flex items-center justify-between bg-base-50/50">
        <h3 class="text-sm font-bold text-base-content truncate max-w-xl">{{ asset?.description || 'پیش‌نمایش فایل' }}</h3>
        <button @click="$emit('close')" type="button" class="btn btn-sm btn-circle btn-ghost">
          <X class="size-5" />
        </button>
      </div>

      <div class="flex-1 overflow-auto p-4 flex items-center justify-center bg-base-200/20">
        <img 
          v-if="isImage" 
          :src="config.public.apiBase + asset.file_url" 
          :alt="asset?.description" 
          class="max-w-full max-h-full object-contain rounded-lg" 
        />

        <iframe 
          v-else-if="isPdf" 
          :src="config.public.apiBase + asset.file_url" 
          class="w-full h-full rounded-lg bg-base-100" 
          frameborder="0"
        ></iframe>
        
        <div v-else class="text-center p-8 max-w-sm">
          <p class="text-sm text-base-content/60 mb-4">پیش‌نمایش این فرمت فایل پشتیبانی نمی‌شود. جهت دریافت از گزینه دانلود استفاده نمایید.</p>
          <a 
            :href="config.public.apiBase + asset.file_url" 
            target="_blank"
            download
            class="btn btn-primary rounded-xl font-bold px-6 text-sm"
          >
            دانلود مستقیم فایل
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';

interface Asset {
  id: string;
  file_url: string;
  description: string;
}

const props = defineProps<{ asset: Asset }>();
defineEmits(['close']);

const config = useRuntimeConfig();

const ext = computed(() => props.asset?.file_url.split('.').pop()?.toLowerCase() || '');
const isImage = computed(() => ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext.value));
const isPdf = computed(() => ext.value === 'pdf');
</script>