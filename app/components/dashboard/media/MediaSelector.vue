// components/dashboard/media/MediaSelector.vue
<template>
  <div v-if="isOpen" class="modal modal-open bg-black/60 z-60 transition-all duration-200">
    <div class="modal-box max-w-4xl w-full h-[80vh] p-0 flex flex-col overflow-hidden bg-base-100 rounded-2xl border border-base-200 shadow-xl">
      
      <!-- Top Sticky Bar -->
      <div class="p-5 border-b border-base-200 flex items-center justify-between bg-base-50/50 shrink-0">
        <h3 class="text-lg font-bold text-base-content">{{ modalTitle }}</h3>
        <button @click="$emit('close')" type="button" class="btn btn-sm btn-circle btn-ghost">
          <X class="size-5" />
        </button>
      </div>

      <!-- Action Sub-header Strip -->
      <div class="flex shrink-0 flex-col gap-3 border-b border-base-200 bg-base-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <MediaTypeFilter v-model="activeKind" :disabled="loading || loadingMore" />
        <button @click="isUploadModalOpen = true" type="button" class="btn btn-primary btn-sm rounded-xl font-bold px-5">
          بارگذاری فایل جدید
        </button>
      </div>

      <!-- Scrollable Grid Context Area -->
      <div class="flex-1 overflow-y-auto p-4 bg-base-50/30">
        <div v-if="loading" class="h-full min-h-75 flex items-center justify-center">
          <span class="loading loading-spinner loading-md text-primary"></span>
        </div>

        <div v-else-if="!assets.length" class="h-full min-h-75 flex flex-col items-center justify-center text-center p-8">
          <p class="text-sm text-base-content/50">{{ emptyMessage }}</p>
        </div>

        <!-- Solid structural CSS Grid layout -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button 
            v-for="asset in assets"
            :key="asset.id" 
            @click="selectAsset(asset)"
            type="button"
            class="group bg-base-100 rounded-xl border border-base-200 overflow-hidden flex flex-col cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200 text-right w-full"
          >
            <!-- Image containment slot with forced 1:1 view bounds -->
            <div class="w-full aspect-square bg-base-200/50 overflow-hidden relative flex items-center justify-center shrink-0">
              <img 
                v-if="isImageMediaAsset(asset)"
                :src="config.public.apiBase + asset.file_url" 
                :alt="asset.description" 
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                loading="lazy"
                decoding="async"
              />
              <div v-else class="text-xs font-black text-base-content/40 uppercase tracking-wider bg-base-300/60 px-3 py-1 rounded-md">
                {{ getMediaFileExtension(asset.file_url) }}
              </div>
            </div>

            <!-- Content Title Area -->
            <div class="p-2.5 w-full bg-base-100 border-t border-base-100 group-hover:border-base-200 truncate">
              <p class="text-xs font-medium text-base-content truncate select-none">
                {{ asset.description || 'بدون توضیحات' }}
              </p>
            </div>
          </button>
        </div>
        <button v-if="hasMore" type="button" :disabled="loadingMore"
          class="btn btn-outline btn-primary mx-auto mt-5 flex" @click="loadMore">
          <span v-if="loadingMore" class="loading loading-spinner loading-xs" />
          نمایش موارد بیشتر
        </button>
      </div>

    </div>
    <MediaUploadModal 
      v-if="isUploadModalOpen"
      @close="isUploadModalOpen = false"
      @asset-uploaded="handleAssetUploaded"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { X } from 'lucide-vue-next';
import MediaUploadModal from '~/components/dashboard/media/MediaUploadModal.vue';
import MediaTypeFilter from '~/components/dashboard/media/MediaTypeFilter.vue';
import type { DashboardMediaAsset, MediaAssetKind } from '~/utils/mediaAssets';
import { getMediaFileExtension, isImageMediaAsset } from '~/utils/mediaAssets';

const props = withDefaults(defineProps<{
  modalTitle?: string
  isOpen?: boolean
  defaultKind?: MediaAssetKind
}>(), {
  modalTitle: 'انتخاب رسانه دیجیتال',
  isOpen: true,
  defaultKind: 'all',
});

const { modalTitle, isOpen } = toRefs(props);

const emit = defineEmits(['close', 'file-selected']);
const config = useRuntimeConfig();

const assets = ref<DashboardMediaAsset[]>([]);
const loading = ref(false);
const isUploadModalOpen = ref(false);
const activeKind = ref<MediaAssetKind>(props.defaultKind);
const PAGE_SIZE = 40;
const hasMore = ref(false);
const loadingMore = ref(false);

const emptyMessage = computed(() => {
  if (activeKind.value === 'image') return 'تصویری برای انتخاب پیدا نشد.';
  if (activeKind.value === 'document') return 'سندی برای انتخاب پیدا نشد.';
  return 'هیچ رسانه یا فایلی در سیستم پیدا نشد.';
});

const fetchAssets = async () => {
  loading.value = true;
  try {
    const res: any = await $fetch('/api/media', { method: 'GET', query: { offset: 0, limit: PAGE_SIZE, kind: activeKind.value } });
    if (res?.success && res?.data) {
      assets.value = res.data;
    } else if (Array.isArray(res)) {
      assets.value = res;
    }
    hasMore.value = Boolean(res?.pagination?.has_more);
  } catch (error) {
    assets.value = [];
  } finally {
    loading.value = false;
  }
};

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    const res: any = await $fetch('/api/media', {
      method: 'GET',
      query: { offset: assets.value.length, limit: PAGE_SIZE, kind: activeKind.value }
    });
    if (Array.isArray(res?.data)) assets.value.push(...res.data);
    hasMore.value = Boolean(res?.pagination?.has_more);
  } finally {
    loadingMore.value = false;
  }
};

const selectAsset = (asset: DashboardMediaAsset) => {
  emit('file-selected', asset.file_url, asset.id);
  emit('close');
};

const handleAssetUploaded = () => {
  isUploadModalOpen.value = false;
  fetchAssets(); 
};

onMounted(() => {
  fetchAssets();
});

watch(activeKind, () => fetchAssets());
</script>
