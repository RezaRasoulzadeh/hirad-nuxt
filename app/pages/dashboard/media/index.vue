<template>
  <div class="w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">مدیریت رسانه‌ها</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">مدیریت فایل‌ها، تصاویر شاخص و اسناد آپلود شده در سیستم.</p>
      </div>
      <button @click="showUploadModal = true" class="btn btn-primary font-bold px-6 h-12 rounded-xl text-sm">
        بارگذاری فایل جدید
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="aspect-square bg-base-100 rounded-2xl border border-base-200 animate-pulse"></div>
    </div>

    <div v-else-if="!assets.length" class="flex flex-col items-center justify-center py-16 bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      <p class="text-sm text-base-content/50">هیچ فایلی بارگذاری نشده است.</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      <div v-for="asset in assets" :key="asset.id" class="group bg-base-100 rounded-2xl border border-base-200 shadow-xs overflow-hidden flex flex-col transition-all hover:shadow-md">
        <button @click="openPreviewModal(asset)" type="button" class="w-full aspect-video flex items-center justify-center bg-base-200/40 relative overflow-hidden focus:outline-hidden">
          <img 
            v-if="isImage(asset.file_url)" 
            :src="config.public.apiBase + asset.file_url" 
            :alt="asset.description" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
            loading="lazy"
          />
          <div v-else class="text-sm font-black text-base-content/40 uppercase tracking-wider bg-base-300 px-4 py-1.5 rounded-lg">
            {{ getFileExtension(asset.file_url) }}
          </div>
        </button>
        
        <div class="p-4 grow flex flex-col justify-between gap-3">
          <p class="text-xs sm:text-sm font-medium text-base-content line-clamp-2 min-h-10">{{ asset.description }}</p>
          <div class="grid grid-cols-2 gap-2 mt-auto">
            <button @click="openEditModal(asset)" type="button" class="btn btn-sm btn-secondary font-bold rounded-xl text-xs">
              ویرایش جزئیات
            </button>
            <button @click="removeAsset(asset.id)" type="button" class="btn btn-sm btn-error btn-outline font-bold rounded-xl text-xs">
              حذف رسانه
            </button>
          </div>
        </div>
      </div>
    </div>

    <MediaUploadModal v-if="showUploadModal" @close="showUploadModal = false" @asset-uploaded="handleAssetUploaded" />
    <MediaEditModal v-if="showEditModal" :asset="selectedAsset!" @close="closeEditModal" @asset-updated="handleAssetUpdated" />
    <MediaPreviewModal v-if="showPreviewModal" :asset="selectedAsset!" @close="closePreviewModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from '~/composables/useToast';
import MediaUploadModal from '~/components/dashboard/media/MediaUploadModal.vue';
import MediaEditModal from '~/components/dashboard/media/MediaEditModal.vue';
import MediaPreviewModal from '~/components/dashboard/media/MediaPreviewModal.vue';

definePageMeta({ layout: 'dashboard' });

interface Asset {
  id: string;
  file_url: string;
  description: string;
}

const config = useRuntimeConfig();
const toast = useToast();

const assets = ref<Asset[]>([]);
const loading = ref(false);

const showUploadModal = ref(false);
const showEditModal = ref(false);
const showPreviewModal = ref(false);
const selectedAsset = ref<Asset | null>(null);

const isImage = (url: string): boolean => {
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(getFileExtension(url));
};

const getFileExtension = (url: string): string => {
  return url.split('.').pop()?.toLowerCase() || '';
};

const fetchAssets = async () => {
  loading.value = true;
  try {
    const res: any = await $fetch('/api/media', { method: 'GET' });
    if (res?.success && res?.data) {
      assets.value = res.data;
    } else if (Array.isArray(res)) {
      assets.value = res;
    }
  } catch (error) {
    toast.error('خطا در دریافت لیست فایل‌ها.');
  } finally {
    loading.value = false;
  }
};

const handleAssetUploaded = () => {
  showUploadModal.value = false;
  fetchAssets();
};

const openEditModal = (asset: Asset) => {
  selectedAsset.value = asset;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedAsset.value = null;
};

const handleAssetUpdated = () => {
  closeEditModal();
  fetchAssets();
};

const openPreviewModal = (asset: Asset) => {
  selectedAsset.value = asset;
  showPreviewModal.value = true;
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  selectedAsset.value = null;
};

const removeAsset = async (assetId: string) => {
  if (!window.confirm('آیا از حذف دائمی این رسانه اطمینان دارید؟')) return;
  try {
    await $fetch(`/api/media/${assetId}`, { method: 'DELETE' });
    toast.success('رسانه مورد نظر با موفقیت حذف شد.');
    await fetchAssets();
  } catch (error) {
    toast.error('حذف رسانه با خطا مواجه شد.');
  }
};

onMounted(fetchAssets);
</script>