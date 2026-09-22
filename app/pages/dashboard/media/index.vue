<template>
  <div class="w-full space-y-6 pb-48 sm:pb-28 lg:pb-24">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">مدیریت رسانه‌ها</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">مدیریت فایل‌ها، تصاویر شاخص و اسناد آپلود شده در سیستم.</p>
      </div>
      <button @click="showUploadModal = true" class="btn btn-primary font-bold px-6 h-12 rounded-xl text-sm">
        بارگذاری فایل جدید
      </button>
    </div>

    <section class="flex flex-col gap-3 rounded-2xl border border-base-200 bg-base-100 p-4 sm:flex-row sm:items-center sm:justify-between" aria-labelledby="media-type-filter-title">
      <div>
        <h2 id="media-type-filter-title" class="text-sm font-bold">نوع فایل</h2>
        <p class="mt-1 text-xs text-base-content/50">نمایش همه فایل‌ها یا تفکیک ساده تصاویر و اسناد.</p>
      </div>
      <MediaTypeFilter v-model="activeKind" :disabled="loading" />
    </section>

    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="aspect-square bg-base-100 rounded-2xl border border-base-200 animate-pulse"></div>
    </div>

    <div v-else-if="!assets.length" class="flex flex-col items-center justify-center py-16 bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      <p class="text-sm text-base-content/50">{{ emptyMessage }}</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      <div v-for="asset in assets" :key="asset.id" class="group bg-base-100 rounded-2xl border border-base-200 shadow-xs overflow-hidden flex flex-col transition-all hover:shadow-md">
        <button @click="openPreviewModal(asset)" type="button" class="w-full aspect-video flex items-center justify-center bg-base-200/40 relative overflow-hidden focus:outline-hidden">
          <img 
            v-if="isImageMediaAsset(asset)"
            :src="config.public.apiBase + asset.file_url" 
            :alt="asset.description" 
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
            loading="lazy"
          />
          <div v-else class="text-sm font-black text-base-content/40 uppercase tracking-wider bg-base-300 px-4 py-1.5 rounded-lg">
            {{ getMediaFileExtension(asset.file_url) }}
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

    <div v-if="totalAssets > 0" class="fixed inset-x-0 bottom-20 z-30 border-t border-base-200 bg-base-100/95 shadow-[0_-6px_20px_rgba(0,0,0,0.06)] backdrop-blur-sm lg:bottom-0 lg:right-80">
      <div class="container mx-auto flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <p class="text-xs text-base-content/60 sm:text-sm">
          نمایش {{ ((currentPage - 1) * PAGE_SIZE) + 1 }} تا {{ Math.min(currentPage * PAGE_SIZE, totalAssets) }} از {{ totalAssets }} رسانه
        </p>

        <div v-if="totalPages > 1" class="flex items-center gap-1" dir="ltr">
          <button type="button" class="btn btn-sm btn-ghost" :disabled="currentPage === 1 || loading" aria-label="صفحه قبلی"
            @click="goToPage(currentPage - 1)">
            قبلی
          </button>

          <template v-for="(page, index) in pageNumbers" :key="`${page}-${index}`">
            <span v-if="page === 'ellipsis'" class="px-1 text-base-content/50">…</span>
            <button v-else type="button" class="btn btn-sm min-w-9" :class="page === currentPage ? 'btn-primary' : 'btn-ghost'"
              :aria-current="page === currentPage ? 'page' : undefined" :disabled="loading" @click="goToPage(page)">
              {{ page }}
            </button>
          </template>

          <button type="button" class="btn btn-sm btn-ghost" :disabled="currentPage === totalPages || loading" aria-label="صفحه بعدی"
            @click="goToPage(currentPage + 1)">
            بعدی
          </button>
        </div>
      </div>
    </div>

    <MediaUploadModal v-if="showUploadModal" @close="showUploadModal = false" @asset-uploaded="handleAssetUploaded" />
    <MediaEditModal v-if="showEditModal" :asset="selectedAsset!" @close="closeEditModal" @asset-updated="handleAssetUpdated" />
    <MediaPreviewModal v-if="showPreviewModal" :asset="selectedAsset!" @close="closePreviewModal" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useToast } from '~/composables/useToast';
import { useDashboardConfirm } from '~/composables/useDashboardConfirm';
import MediaUploadModal from '~/components/dashboard/media/MediaUploadModal.vue';
import MediaEditModal from '~/components/dashboard/media/MediaEditModal.vue';
import MediaPreviewModal from '~/components/dashboard/media/MediaPreviewModal.vue';
import MediaTypeFilter from '~/components/dashboard/media/MediaTypeFilter.vue';
import type { DashboardMediaAsset, MediaAssetKind } from '~/utils/mediaAssets';
import { getMediaFileExtension, isImageMediaAsset } from '~/utils/mediaAssets';

definePageMeta({ layout: 'dashboard' });

const config = useRuntimeConfig();
const toast = useToast();
const confirm = useDashboardConfirm();

const assets = ref<DashboardMediaAsset[]>([]);
const loading = ref(false);
const activeKind = ref<MediaAssetKind>('all');
const currentPage = ref(1);
const totalAssets = ref(0);
const PAGE_SIZE = 40;
const totalPages = computed(() => Math.max(1, Math.ceil(totalAssets.value / PAGE_SIZE)));
const pageNumbers = computed<(number | 'ellipsis')[]>(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1);
  }

  if (currentPage.value <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', totalPages.value];
  }

  if (currentPage.value >= totalPages.value - 3) {
    return [1, 'ellipsis', totalPages.value - 4, totalPages.value - 3, totalPages.value - 2, totalPages.value - 1, totalPages.value];
  }

  return [1, 'ellipsis', currentPage.value - 1, currentPage.value, currentPage.value + 1, 'ellipsis', totalPages.value];
});

const showUploadModal = ref(false);
const showEditModal = ref(false);
const showPreviewModal = ref(false);
const selectedAsset = ref<DashboardMediaAsset | null>(null);
const emptyMessage = computed(() => {
  if (activeKind.value === 'image') return 'هنوز تصویری بارگذاری نشده است.';
  if (activeKind.value === 'document') return 'هنوز سندی بارگذاری نشده است.';
  return 'هیچ فایلی بارگذاری نشده است.';
});

const fetchAssets = async (page = currentPage.value) => {
  loading.value = true;
  try {
    const res: any = await $fetch('/api/media', {
      method: 'GET',
      query: { offset: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE, kind: activeKind.value }
    });

    if (res?.success && res?.data) {
      assets.value = res.data;
    } else if (Array.isArray(res)) {
      assets.value = res;
    }

    currentPage.value = page;
    totalAssets.value = Number(res?.pagination?.total) || assets.value.length;

    if (!assets.value.length && page > 1 && totalAssets.value > 0) {
      await fetchAssets(page - 1);
    }
  } catch (error) {
    toast.error('خطا در دریافت لیست فایل‌ها.');
  } finally {
    loading.value = false;
  }
};

const handleAssetUploaded = () => {
  showUploadModal.value = false;
  fetchAssets(1);
};

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  fetchAssets(page);
};

const openEditModal = (asset: DashboardMediaAsset) => {
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

const openPreviewModal = (asset: DashboardMediaAsset) => {
  selectedAsset.value = asset;
  showPreviewModal.value = true;
};

const closePreviewModal = () => {
  showPreviewModal.value = false;
  selectedAsset.value = null;
};

const removeAsset = async (assetId: string) => {
  const confirmed = await confirm({
    title: 'حذف رسانه',
    message: 'آیا از حذف دائمی این رسانه اطمینان دارید؟',
    confirmLabel: 'حذف رسانه',
    variant: 'danger'
  });
  if (!confirmed) return;
  try {
    await $fetch(`/api/media/${assetId}`, { method: 'DELETE' });
    toast.success('رسانه مورد نظر با موفقیت حذف شد.');
    await fetchAssets();
  } catch (error) {
    toast.error('حذف رسانه با خطا مواجه شد.');
  }
};

watch(activeKind, () => fetchAssets(1));
onMounted(fetchAssets);
</script>
