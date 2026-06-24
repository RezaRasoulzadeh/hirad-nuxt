<template>
  <div class="w-full flex flex-col pt-6" dir="rtl">
    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <span class="loading loading-spinner loading-md text-primary"></span>
      <span class="text-xs font-semibold text-base-content/50">در حال بارگذاری اطلاعات مطلب...</span>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <div class="p-3 rounded-full bg-error/10 text-error">
        <WifiOff class="size-6" />
      </div>
      <h3 class="text-base font-bold text-base-content">خطا در برقراری ارتباط</h3>
      <p class="text-xs text-base-content/50">بارگذاری اطلاعات صفحه با خطا مواجه شد.</p>
      <button @click="() => refresh()" class="btn btn-sm btn-error btn-soft font-bold rounded-xl px-4 mt-2">
        تلاش مجدد
      </button>
    </div>

    <div v-else class="w-full bg-base-100 rounded-2xl border border-base-200 shadow-sm flex flex-col relative">
      <div class="sticky top-0 z-30 flex flex-col border-b border-base-200 bg-base-100/95 backdrop-blur-md rounded-t-2xl divide-y divide-base-100">
        <div class="flex flex-col md:flex-row md:items-center justify-between p-6 gap-4">
          <div>
            <h1 class="text-xl font-bold text-base-content">
              {{ isEditMode ? 'ویرایش مطلب بلاگ' : 'ایجاد مطلب جدید' }}
            </h1>
            <p class="text-xs text-base-content/50 mt-0.5 font-mono" v-if="formData.slug">{{ formData.slug }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3 self-end md:self-auto">
            <div class="form-control">
              <label class="label cursor-pointer gap-2.5 select-none justify-start py-0">
                <input v-model="formData.is_published" type="checkbox" class="checkbox checkbox-primary checkbox-sm rounded-md" />
                <span class="label-text font-bold text-xs sm:text-sm text-base-content/80">نمایش و انتشار آنی در وبلاگ</span>
              </label>
            </div>
            <button @click="previewMode = !previewMode" class="btn btn-secondary btn-soft font-bold rounded-xl text-sm h-11 min-h-0 px-5">
              {{ previewMode ? 'ویرایش متن' : 'پیش‌نمایش مطلب' }}
            </button>
            <button @click="handleCancel" class="btn btn-ghost font-bold rounded-xl text-sm h-11 min-h-0 px-5">
              انصراف
            </button>
            <button @click="handleSave" :disabled="saving" class="btn btn-primary font-bold rounded-xl text-sm h-11 min-h-0 px-6">
              <span v-if="saving" class="loading loading-spinner loading-xs"></span>
              {{ isEditMode ? 'بروزرسانی مطلب' : 'انتشار مطلب' }}
            </button>
          </div>
        </div>
        
        <div v-if="!previewMode" class="flex flex-wrap gap-2 justify-center p-4 bg-base-50/50">
          <button v-for="blockType in blockTypes" :key="blockType.type" @click="addBlock(blockType.type)"
            class="btn btn-sm btn-outline btn-secondary font-bold rounded-xl text-xs gap-1.5 px-3">
            <component :is="blockType.icon" class="size-3.5 opacity-70" />
            {{ blockType.label }}
          </button>
        </div>
      </div>

      <div v-if="previewMode" class="p-6 bg-base-50/50 border-b border-base-200">
        <h2 class="text-base font-bold mb-4 text-base-content/70 flex items-center gap-2">
          <Eye class="size-4" /> پیش‌نمایش زنده ساختار
        </h2>
        <BlogPreview :formData="formData" />
      </div>

      <div v-else class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">عنوان مطلب (FA) *</span></label>
            <input v-model="formData.title" type="text" class="input input-bordered w-full rounded-xl focus:input-primary" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">عنوان متا (Meta Title - EN)</span></label>
            <input v-model="formData.meta_title" type="text" class="input input-bordered w-full rounded-xl focus:input-primary font-mono" dir="ltr" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">خلاصه مطلب (FA) *</span></label>
            <textarea v-model="formData.summary" rows="3" class="textarea textarea-bordered w-full rounded-xl focus:textarea-primary min-h-22"></textarea>
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">توضیحات متا (Meta Description - EN)</span></label>
            <textarea v-model="formData.meta_description" rows="3" class="textarea textarea-bordered w-full rounded-xl focus:textarea-primary min-h-22 font-mono" dir="ltr"></textarea>
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">نامک پیوند (Slug) *</span></label>
            <input v-model="formData.slug" type="text" class="input input-bordered w-full rounded-xl focus:input-primary font-mono" dir="ltr" :disabled="isEditMode" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">تصویر شاخص مطلب (Cover)</span></label>
            <div class="grid grid-cols-1 gap-2">
              <div v-if="formData.cover_image_url" class="relative group w-32 aspect-square rounded-xl border-2 border-primary overflow-hidden shadow-sm bg-base-100">
                <img :src="config.public.apiBase + formData.cover_image_url" alt="Cover snapshot" class="w-full h-full object-cover" />
                <button type="button" @click="formData.cover_image_url = ''" class="btn btn-circle btn-error btn-xs absolute top-1.5 right-1.5 shadow-md">
                  <Trash class="w-3 h-3 text-white" />
                </button>
              </div>
              <button v-else type="button" @click="openMediaPicker(-1)" class="w-32 aspect-square flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl text-base-content/40 hover:border-primary hover:text-primary transition-all bg-base-100/50">
                <FilePlus class="w-6 h-6 mb-1" />
                <span class="text-[11px] font-bold">انتخاب کاور</span>
              </button>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-base text-base-content">بلوک‌های محتوایی متون بلاگ</h3>
          <div class="badge badge-secondary badge-soft font-mono text-xs py-2.5 px-3 rounded-lg">
            {{ formData.content.body.length.toLocaleString('fa-IR') }} بلوک تعریف شده
          </div>
        </div>

        <div class="min-h-50 border-2 border-dashed border-base-300 bg-base-50/20 rounded-2xl p-4 space-y-4">
          <div v-if="formData.content.body.length" class="space-y-4">
            <div v-for="(block, index) in formData.content.body" :key="`block-${index}`"
              class="group relative border border-base-200 bg-base-100 hover:shadow-sm transition-all duration-200 rounded-2xl overflow-hidden flex flex-col">
              
              <div class="flex items-center justify-between border-b border-base-200 bg-base-50 px-4 py-2 select-none">
                <span class="badge badge-sm font-bold bg-secondary/10 text-secondary border-none rounded-md uppercase font-mono text-[10px]">
                  {{ block.type }}
                </span>
                <div class="flex items-center gap-1">
                  <button @click="moveBlockUp(index)" :disabled="index === 0" class="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content disabled:opacity-20">
                    <ArrowUp class="size-4" />
                  </button>
                  <button @click="moveBlockDown(index)" :disabled="index === formData.content.body.length - 1" class="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content disabled:opacity-20">
                    <ArrowDown class="size-4" />
                  </button>
                  <button @click="removeBlock(index)" class="btn btn-ghost btn-xs btn-circle text-error/60 hover:bg-error/10 hover:text-error">
                    <X class="size-4" />
                  </button>
                </div>
              </div>

              <div class="p-5">
                <div v-if="block.type === 'heading'" class="space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-base-content/60">سطح عنوان:</span>
                    <select v-model="block.level" class="select select-bordered select-xs rounded-lg font-mono">
                      <option v-for="h in 6" :key="h" :value="h">H{{ h }}</option>
                    </select>
                  </div>
                  <input v-model="block.text" type="text" placeholder="Heading content string (English Translation)" class="input input-bordered input-sm w-full rounded-xl font-mono text-xs" dir="ltr">
                  <input v-model="block.text_fa" type="text" placeholder="متن عنوان بخش (فارسی)" class="input input-bordered input-sm w-full rounded-xl text-sm font-semibold">
                </div>

                <div v-else-if="block.type === 'paragraph'" class="space-y-3">
                  <textarea v-model="block.text" placeholder="Paragraph language core strings (English text body)" rows="3" class="textarea textarea-bordered textarea-sm w-full rounded-xl font-mono text-xs min-h-18" dir="ltr"></textarea>
                  <textarea v-model="block.text_fa" placeholder="متن پاراگراف محتوایی (فارسی)" rows="3" class="textarea textarea-bordered textarea-sm w-full rounded-xl text-sm min-h-18"></textarea>
                </div>

                <div v-else-if="block.type === 'image'" class="space-y-3">
                  <div class="grid grid-cols-1 gap-2">
                    <div v-if="block.src" class="relative group w-36 aspect-square rounded-xl border-2 border-primary overflow-hidden shadow-sm bg-base-100">
                      <img :src="config.public.apiBase + block.src" alt="Block image asset" class="w-full h-full object-cover" />
                      <button type="button" @click="block.src = ''" class="btn btn-circle btn-error btn-xs absolute top-1.5 right-1.5 shadow-md">
                        <Trash class="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <button v-else type="button" @click="openMediaPicker(index)" class="w-36 aspect-square flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-xl text-base-content/40 hover:border-primary hover:text-primary transition-all bg-base-100/50">
                      <FilePlus class="w-6 h-6 mb-1" />
                      <span class="text-[11px] font-bold">افزودن تصویر</span>
                    </button>
                  </div>
                  <input v-model="block.alt" type="text" placeholder="Alternative SEO Description Text (Alt)" class="input input-bordered input-sm w-full rounded-xl text-xs mt-2">
                  <input v-model="block.caption" type="text" placeholder="توضیحات زیر تصویر بلاگ (اختیاری)" class="input input-bordered input-sm w-full rounded-xl text-xs">
                </div>

                <div v-else-if="block.type === 'quote'" class="space-y-3">
                  <textarea v-model="block.text" placeholder="Quote standard block text content (English translation)" rows="2" class="textarea textarea-bordered textarea-sm w-full rounded-xl font-mono text-xs min-h-14" dir="ltr"></textarea>
                  <textarea v-model="block.text_fa" placeholder="متن نقل قول مورد نظر (فارسی)" rows="2" class="textarea textarea-bordered textarea-sm w-full rounded-xl text-sm min-h-14"></textarea>
                  <input v-model="block.author" type="text" placeholder="نام نویسنده / منبع نقل قول" class="input input-bordered input-sm w-full rounded-xl text-xs">
                </div>

                <div v-else-if="block.type === 'list'" class="space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-base-content/60">نوع لیست ساختاری:</span>
                    <select v-model="block.style" class="select select-bordered select-xs rounded-lg text-xs">
                      <option value="unordered">نشانه‌دار (Bullet)</option>
                      <option value="ordered">عددی (Ordered)</option>
                    </select>
                  </div>
                  <div class="space-y-2">
                    <div v-for="(item, itemIndex) in block.items" :key="itemIndex" class="flex gap-2 items-start border-s-2 border-base-200 ps-3 py-1">
                      <div class="flex-1 space-y-2">
                        <input v-model="item.text" type="text" placeholder="List item element content string (English)" class="input input-bordered input-sm w-full rounded-xl font-mono text-xs" dir="ltr">
                        <input v-model="item.text_fa" type="text" placeholder="متن آیتم لیست (فارسی)" class="input input-bordered input-sm w-full rounded-xl text-xs">
                      </div>
                      <button @click="removeListItem(block, itemIndex)" class="btn btn-ghost btn-xs btn-circle text-error/70 mt-1">✕</button>
                    </div>
                    <button @click="addListItem(block)" class="btn btn-xs btn-dashed btn-success btn-soft font-bold rounded-lg px-3 mt-1">
                      + افزودن آیتم جدید به لیست
                    </button>
                  </div>
                </div>

                <div v-else-if="block.type === 'code'" class="space-y-3">
                  <input v-model="block.language" type="text" placeholder="Syntax Highlighting Identifier Language (e.g., rust, javascript)" class="input input-bordered input-sm w-full rounded-xl font-mono text-xs" dir="ltr">
                  <textarea v-model="block.content" placeholder="Source Code Payload..." rows="5" class="textarea textarea-bordered textarea-sm w-full rounded-xl font-mono text-xs min-h-30 resize-y bg-base-900 text-neutral-content" dir="ltr"></textarea>
                </div>

                <div v-else-if="block.type === 'link'" class="space-y-3">
                  <input v-model="block.url" type="url" placeholder="Resource Destination URL Path (https://...)" class="input input-bordered input-sm w-full rounded-xl font-mono text-xs" dir="ltr">
                  <input v-model="block.text" type="text" placeholder="Visible Anchor Target Label text (English)" class="input input-bordered input-sm w-full rounded-xl font-mono text-xs" dir="ltr">
                  <input v-model="block.text_fa" type="text" placeholder="عنوان نمایشی پیوند متنی (فارسی)" class="input input-bordered input-sm w-full rounded-xl text-xs">
                </div>

                <div v-else-if="block.type === 'video'" class="space-y-3">
                  <input v-model="block.url" type="url" placeholder="Streaming Resource Frame Host Link URL" class="input input-bordered input-sm w-full rounded-xl font-mono text-xs" dir="ltr">
                  <input v-model="block.caption" type="text" placeholder="توضیحات زیر ویدیو ضمیمه شده (اختیاری)" class="input input-bordered input-sm w-full rounded-xl text-xs">
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
            <div class="p-3 rounded-full bg-base-200 text-base-content/40">
              <SearchX class="size-6" />
            </div>
            <h3 class="text-sm font-bold text-base-content/50">هیچ بلوک محتوایی برای این پست ایجاد نشده است</h3>
            <p class="text-xs text-base-content/40">با استفاده از منوی زیر می‌توانید انواع بلوک‌های متنی، تصویری یا کدهای برنامه را اضافه کنید.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Library Asset Picker Modal -->
    <div v-if="isMediaModalOpen" class="modal modal-open bg-black/60 z-60 transition-all duration-200">
      <div class="modal-box max-w-4xl w-full h-[80vh] p-0 flex flex-col overflow-hidden bg-base-100 rounded-2xl border border-base-200 shadow-xl">
        <div class="p-5 border-b border-base-200 flex items-center justify-between bg-base-50/50 shrink-0">
          <h3 class="text-lg font-bold text-base-content">انتخاب رسانه دیجیتال</h3>
          <button @click="isMediaModalOpen = false" type="button" class="btn btn-sm btn-circle btn-ghost">
            <X class="size-5" />
          </button>
        </div>

        <div class="p-4 bg-base-100 border-b border-base-200 flex justify-end shrink-0">
          <button @click="isUploadModalOpen = true" type="button" class="btn btn-primary btn-sm rounded-xl font-bold px-5">
            بارگذاری فایل جدید
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 bg-base-50/30">
          <div v-if="mediaLoading" class="h-full min-h-75 flex items-center justify-center">
            <span class="loading loading-spinner loading-md text-primary"></span>
          </div>

          <div v-else-if="!assets.length" class="h-full min-h-75 flex flex-col items-center justify-center text-center p-8">
            <p class="text-sm text-base-content/50">هیچ رسانه یا فایلی در سیستم پیدا نشد.</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <button 
              v-for="asset in assets" 
              :key="asset.id" 
              @click="selectAsset(asset)"
              type="button"
              class="group bg-base-100 rounded-xl border border-base-200 overflow-hidden flex flex-col cursor-pointer hover:border-primary hover:shadow-md transition-all duration-200 text-right w-full"
            >
              <div class="w-full aspect-square bg-base-200/50 overflow-hidden relative flex items-center justify-center shrink-0">
                <img 
                  v-if="isImage(asset.file_url)" 
                  :src="config.public.apiBase + asset.file_url" 
                  :alt="asset.description" 
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  loading="lazy"
                />
                <div v-else class="text-xs font-black text-base-content/40 uppercase tracking-wider bg-base-300/60 px-3 py-1 rounded-md">
                  {{ getFileExtension(asset.file_url) }}
                </div>
              </div>

              <div class="p-2.5 w-full bg-base-100 border-t border-base-100 group-hover:border-base-200 truncate">
                <p class="text-xs font-medium text-base-content truncate select-none">
                  {{ asset.description || 'بدون توضیحات' }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <MediaUploadModal 
        v-if="isUploadModalOpen"
        @close="isUploadModalOpen = false"
        @asset-uploaded="handleAssetUploaded"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { onBeforeRouteLeave } from '#app'
import { useRuntimeConfig } from '#imports'
import BlogPreview from './BlogPreview.vue'
import MediaUploadModal from '~/components/dashboard/media/MediaUploadModal.vue'
import { ArrowDown, ArrowUp, Code2, Heading, ImageIcon, LetterTextIcon, Link, List, Quote, Video, X, Eye, WifiOff, SearchX, FilePlus, Trash } from 'lucide-vue-next'
import { useBlogEditor, type BlockType } from '~/composables/useBlogEditor'

interface Asset {
  id: string
  file_url: string
  description: string
}

const blockTypes = [
  { type: 'paragraph' as BlockType, label: 'پاراگراف متن', icon: LetterTextIcon },
  { type: 'heading' as BlockType, label: 'تیتر و عنوان', icon: Heading },
  { type: 'image' as BlockType, label: 'تصویر ضمیمه', icon: ImageIcon },
  { type: 'quote' as BlockType, label: 'نقل قول', icon: Quote },
  { type: 'list' as BlockType, label: 'لیست تعریفی', icon: List },
  { type: 'code' as BlockType, label: 'بلوک سورس کد', icon: Code2 },
  { type: 'link' as BlockType, label: 'پیوند خارجی', icon: Link },
  { type: 'video' as BlockType, label: 'ویدیو پلیر', icon: Video },
]

const config = useRuntimeConfig()
const {
  formData,
  previewMode,
  saving,
  status,
  error,
  isEditMode,
  refresh,
  saveData,
  addBlock,
  removeBlock,
  moveBlockUp,
  moveBlockDown,
  addListItem,
  removeListItem
} = await useBlogEditor()

let isDirty = false
watch(formData, () => {
  isDirty = true
}, { deep: true })

const handleSave = async () => {
  await saveData()
  isDirty = false
}

const handleCancel = () => {
  navigateTo('/dashboard/blog')
}

onBeforeRouteLeave((to, from, next) => {
  if (isDirty && !confirm('تغییرات ذخیره نشده است. آیا مایل به خروج هستید؟')) {
    next(false)
  } else {
    next()
  }
})

const isMediaModalOpen = ref(false)
const isUploadModalOpen = ref(false)
const mediaLoading = ref(false)
const assets = ref<Asset[]>([])
const activeTargetBlockIndex = ref<number>(-1) 

const isImage = (url: string): boolean => {
  const ext = getFileExtension(url)
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)
}

const getFileExtension = (url: string): string => {
  return url.split('.').pop()?.toLowerCase() || ''
}

const fetchAssets = async () => {
  mediaLoading.value = true
  try {
    const res: any = await $fetch('/api/media', { method: 'GET' })
    if (res?.success && res?.data) {
      assets.value = res.data
    } else if (Array.isArray(res)) {
      assets.value = res
    }
  } catch (err) {
    assets.value = []
  } finally {
    mediaLoading.value = false
  }
}

const openMediaPicker = (index: number) => {
  activeTargetBlockIndex.value = index
  isMediaModalOpen.value = true
  fetchAssets()
}

const selectAsset = (asset: Asset) => {
  if (activeTargetBlockIndex.value === -1) {
    formData.value.cover_image_url = asset.file_url
  } else {
    const block = formData.value.content.body[activeTargetBlockIndex.value]
    if (block && block.type === 'image') {
      block.src = asset.file_url
    }
  }
  isMediaModalOpen.value = false
}

const handleAssetUploaded = () => {
  isUploadModalOpen.value = false
  fetchAssets()
}
</script>