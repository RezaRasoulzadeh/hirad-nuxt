<template>
  <div v-if="isOpen" class="modal modal-open bg-black/60 z-50 transition-all duration-200">
    <div class="modal-box max-w-5xl w-full h-[85vh] p-0 flex flex-col overflow-hidden bg-base-100 rounded-2xl shadow-xl border border-base-200">
      
      <div class="p-6 border-b border-base-200 flex items-center justify-between bg-base-50/50">
        <div>
          <h2 class="text-xl font-bold text-base-content">مدیریت دسته‌بندی و صفحه آرایی</h2>
          <p class="text-xs text-base-content/50 mt-0.5">
            {{ category ? `ویرایش دسته‌بندی: ${formCategory.name}` : 'ایجاد دسته‌بندی محصولی جدید' }}
          </p>
        </div>
        <button @click="$emit('close')" class="btn btn-sm btn-circle btn-ghost text-base-content/60">
          <X class="size-5" />
        </button>
      </div>

      <div class="bg-base-100 border-b border-base-200 px-6 flex gap-4">
        <button type="button" @click="activeTab = 'basic'" class="py-3 text-sm font-bold border-b-2 transition-all" :class="activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'">
          تنظیمات اصلی دسته‌بندی
        </button>
        <button type="button" @click="activeTab = 'page'" class="py-3 text-sm font-bold border-b-2 transition-all flex items-center gap-1.5" :class="activeTab === 'page' ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'">
          <span>ساختار محتوایی صفحه</span>
          <span v-if="loadingPage" class="loading loading-spinner loading-xs text-primary"></span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-base-50/30">
        <form @submit.prevent="submitWorkspace" class="space-y-6">
          
          <div v-show="activeTab === 'basic'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="form-control w-full">
              <label class="label font-semibold text-xs text-base-content/70">نام دسته‌بندی</label>
              <input type="text" v-model="formCategory.name" required class="input input-bordered w-full rounded-xl" />
            </div>
            <div class="form-control w-full">
              <label class="label font-semibold text-xs text-base-content/70">ترتیب چیدمان</label>
              <input type="number" v-model.number="formCategory.sort_order" class="input input-bordered w-full rounded-xl" />
            </div>
            <div class="form-control w-full md:col-span-2">
              <label class="label font-semibold text-xs text-base-content/70">دسته‌بندی والد</label>
              <select v-model="formCategory.parent_id" class="select select-bordered w-full rounded-xl">
                <option :value="null">بدون والد (دسته‌بندی اصلی)</option>
                <option v-for="cat in availableParents" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-control w-full md:col-span-2">
              <label class="label font-semibold text-xs text-base-content/70">توضیحات کوتاه</label>
              <textarea v-model="formCategory.description" rows="2" class="textarea textarea-bordered w-full rounded-xl resize-none"></textarea>
            </div>
            <div class="form-control w-full">
              <label class="label font-semibold text-xs text-base-content/70">Meta Title</label>
              <input type="text" v-model="formCategory.meta_title" class="input input-bordered w-full rounded-xl" />
            </div>
            <div class="form-control w-full">
              <label class="label font-semibold text-xs text-base-content/70">Meta Description</label>
              <input type="text" v-model="formCategory.meta_description" class="input input-bordered w-full rounded-xl" />
            </div>
            <div class="form-control w-full md:col-span-2">
              <label class="label font-semibold text-xs text-base-content/70">تصویر شاخص دسته‌بندی</label>
              <div class="flex gap-2 items-center">
                <input type="text" v-model="formCategory.image_url" dir="ltr" class="input input-bordered flex-1 rounded-xl" />
                <button @click="openAssetSelector('category_image')" type="button" class="btn btn-outline btn-success rounded-xl font-bold px-5">انتخاب فایل</button>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'page'" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base-100 p-4 rounded-xl border border-base-200 shadow-xs">
              <div class="form-control w-full">
                <label class="label font-semibold text-xs text-base-content/70">عنوان صفحه (مطابق نام دسته‌بندی)</label>
                <input type="text" :value="formCategory.name" readonly placeholder="همگام با نام دسته‌بندی بالا" class="input input-bordered bg-base-200 text-base-content/50 w-full rounded-xl" />
              </div>
              <div class="form-control w-full">
                <label class="label font-semibold text-xs text-base-content/70">تصویر کاور صفحه (Cover Image)</label>
                <div class="flex gap-2 items-center">
                  <input type="text" v-model="pageData.cover_image_url" dir="ltr" class="input input-bordered flex-1 rounded-xl" />
                  <button @click="openAssetSelector('cover_image')" type="button" class="btn btn-outline btn-success rounded-xl font-bold px-4">انتخاب</button>
                </div>
              </div>
              <div class="form-control w-full md:col-span-2">
                <label class="label font-semibold text-xs text-base-content/70">خلاصه صفحه محتوایی</label>
                <textarea v-model="pageData.summary" rows="2" class="textarea textarea-bordered w-full rounded-xl"></textarea>
              </div>
            </div>

            <div class="collapse collapse-arrow bg-base-100 border border-base-200 rounded-xl shadow-xs">
              <input type="checkbox" checked />
              <div class="collapse-title font-bold text-sm text-base-content/80">تنظیمات هدر اصلی صفحه (Hero Unit)</div>
              <div class="collapse-content space-y-4 pt-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" v-model="pageData.content.hero.title" placeholder="Hero Title (EN)" dir="ltr" class="input input-sm input-bordered rounded-lg" />
                  <input type="text" v-model="pageData.content.hero.title_fa" placeholder="عنوان هدر (FA)" class="input input-sm input-bordered rounded-lg" />
                  <input type="text" v-model="pageData.content.hero.sub_title" placeholder="Hero Subtitle (EN)" dir="ltr" class="input input-sm input-bordered rounded-lg" />
                  <input type="text" v-model="pageData.content.hero.sub_title_fa" placeholder="زیرعنوان هدر (FA)" class="input input-sm input-bordered rounded-lg" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <textarea v-model="pageData.content.hero.description" placeholder="Hero Description (EN)" rows="2" dir="ltr" class="textarea textarea-sm textarea-bordered rounded-lg"></textarea>
                  <textarea v-model="pageData.content.hero.description_fa" placeholder="توضیحات کامل هدر (FA)" rows="2" class="textarea textarea-sm textarea-bordered rounded-lg"></textarea>
                </div>
              </div>
            </div>

            <div v-if="!formCategory.parent_id" class="collapse collapse-arrow bg-base-100 border border-base-200 rounded-xl shadow-xs">
              <input type="checkbox" />
              <div class="collapse-title font-bold text-sm text-base-content/80">مدیریت بنر تبلیغاتی / محتوایی</div>
              <div class="collapse-content space-y-4 pt-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" v-model="pageData.content.banner.title" placeholder="Banner Title (EN)" dir="ltr" class="input input-sm input-bordered rounded-lg" />
                  <input type="text" v-model="pageData.content.banner.title_fa" placeholder="عنوان بنر (FA)" class="input input-sm input-bordered rounded-lg" />
                  <input type="text" v-model="pageData.content.banner.link" placeholder="لینک کلیک بنر (URL)" dir="ltr" class="input input-sm input-bordered rounded-lg md:col-span-2" />
                </div>
                <div class="form-control w-full">
                  <label class="label font-semibold text-xs text-base-content/60">آدرس تصویر بنر</label>
                  <div class="flex gap-2 items-center">
                    <input type="text" v-model="pageData.content.banner.image" dir="ltr" class="input input-sm input-bordered flex-1 rounded-lg" />
                    <button @click="openAssetSelector('banner_image')" type="button" class="btn btn-xs btn-outline btn-success h-8 rounded-lg px-3">انتخاب تصویر</button>
                  </div>
                </div>

                <div class="border-t border-base-200 pt-4">
                  <h4 class="font-bold text-xs text-base-content/70 mb-3">آیتم‌های جزئیات بنر</h4>
                  <div class="space-y-3">
                    <div v-for="(item, idx) in pageData.content.banner.items" :key="'bn-item-' + idx" class="border border-base-200 rounded-xl p-3 bg-base-50/50">
                      <div class="flex justify-between items-center mb-3">
                        <span class="text-xs font-bold text-base-content/60">آیتم #{{ (idx + 1).toLocaleString('fa-IR') }}</span>
                        <button type="button" @click="pageData.content.banner.items.splice(idx, 1)" class="btn btn-xs btn-square btn-ghost text-error"><Trash2 class="size-4" /></button>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input type="text" v-model="item.sub_title" placeholder="Subtitle (EN)" dir="ltr" class="input input-xs input-bordered rounded-md" />
                        <input type="text" v-model="item.sub_title_fa" placeholder="زیرعنوان (FA)" class="input input-xs input-bordered rounded-md" />
                        <textarea v-model="item.description" placeholder="Description (EN)" rows="2" dir="ltr" class="textarea textarea-xs textarea-bordered rounded-md"></textarea>
                        <textarea v-model="item.description_fa" placeholder="توضیحات (FA)" rows="2" class="textarea textarea-xs textarea-bordered rounded-md"></textarea>
                      </div>
                    </div>
                  </div>
                  <button type="button" @click="pageData.content.banner.items.push({ sub_title: '', sub_title_fa: '', description: '', description_fa: '' })" class="btn btn-sm btn-block btn-dashed border-primary text-primary bg-primary/5 rounded-xl font-bold mt-3">
                    <PlusCircle class="size-4" /> افزودن آیتم جدید به بنر
                  </button>
                </div>
              </div>
            </div>

            <WorkspaceApplicationsSection v-model="pageData.content.applications" @select-asset="openAssetSelector" />

            <WorkspaceFaqSection v-model="pageData.content.faq" />
          </div>

          <div class="border-t border-base-200 pt-4 flex items-center justify-end gap-2 bg-base-100">
            <button type="button" @click="$emit('close')" class="btn btn-ghost rounded-xl px-6">انصراف</button>
            <button type="submit" :disabled="submitting" class="btn btn-primary rounded-xl font-bold px-10">
              <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
              {{ category ? 'بروزرسانی نهایی قطعی' : 'ایجاد دسته‌بندی و صفحه' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <MediaManagerModal v-if="isMediaSelectorOpen" modalTitle="انتخاب رسانه دیجیتال" @close="isMediaSelectorOpen = false" @file-selected="captureFileAttachment" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Trash2, PlusCircle } from 'lucide-vue-next';
import MediaManagerModal from '~/components/dashboard/media/MediaSelector.vue';
import WorkspaceFaqSection from '~/components/dashboard/category/WorkspaceFaqSection.vue';
import WorkspaceApplicationsSection from '~/components/dashboard/category/WorkspaceApplicationsSection.vue';
import { useCategoryWorkspace, type CategoryNode } from '~/composables/useCategoryWorkspace';

const props = defineProps<{
  isOpen: boolean;
  category: CategoryNode | null;
  allCategories: CategoryNode[];
}>();

const emit = defineEmits(['close', 'saved']);

const { activeTab, submitting, loadingPage, formCategory, pageData, availableParents, submitWorkspace } = useCategoryWorkspace(props, emit);

const isMediaSelectorOpen = ref(false);
const assetTargetMarker = ref<string | null>(null);

function openAssetSelector(target: string) {
  assetTargetMarker.value = target;
  isMediaSelectorOpen.value = true;
}

function captureFileAttachment(fileUrl: string) {
  if (assetTargetMarker.value === 'category_image') {
    formCategory.value.image_url = fileUrl;
  } else if (assetTargetMarker.value === 'cover_image') {
    pageData.value.cover_image_url = fileUrl;
  } else if (assetTargetMarker.value === 'banner_image') {
    pageData.value.content.banner.image = fileUrl;
  } else if (assetTargetMarker.value?.startsWith('app_icon_')) {
    const idx = parseInt(assetTargetMarker.value.replace('app_icon_', ''), 10);
    if (!isNaN(idx) && pageData.value.content.applications[idx]) {
      pageData.value.content.applications[idx].icon = fileUrl;
    }
  }
  isMediaSelectorOpen.value = false;
  assetTargetMarker.value = null;
}
</script>