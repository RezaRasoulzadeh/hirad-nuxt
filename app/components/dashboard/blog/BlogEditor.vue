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
            <button ref="jsonImportTrigger" type="button" class="btn btn-outline btn-primary font-bold rounded-xl text-sm h-11 min-h-0 px-4" @click="openJsonImport()">
              ورود JSON
            </button>
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
            <input v-model="formData.slug" type="text" class="input input-bordered w-full rounded-xl focus:input-primary font-mono" dir="ltr" />
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

                <div v-else-if="block.type === 'html'" class="space-y-3">
                  <p class="alert alert-info rounded-xl py-2 text-xs leading-6">این بلوک فقط HTML و CSS ایستا را نمایش می‌دهد. اسکریپت‌ها و منابع خارجی در پیش‌نمایش و وب‌سایت اجرا یا بارگذاری نمی‌شوند.</p>
                  <div class="form-control">
                    <label class="label py-1"><span class="label-text font-semibold">HTML</span></label>
                    <textarea v-model="block.html" placeholder="<section class=&quot;custom-card&quot;>...</section>" rows="8" class="textarea textarea-bordered textarea-sm w-full rounded-xl font-mono text-xs leading-6" dir="ltr" spellcheck="false"></textarea>
                  </div>
                  <div class="form-control">
                    <label class="label py-1"><span class="label-text font-semibold">CSS</span></label>
                    <textarea v-model="block.css" placeholder=".custom-card { padding: 1rem; border: 1px solid #ddd; }" rows="8" class="textarea textarea-bordered textarea-sm w-full rounded-xl font-mono text-xs leading-6" dir="ltr" spellcheck="false"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
            <div class="p-3 rounded-full bg-base-200 text-base-content/40">
              <SearchX class="size-6" />
            </div>
            <h3 class="text-sm font-bold text-base-content/50">هیچ بلوک محتوایی برای این پست ایجاد نشده است</h3>
            <p class="text-xs text-base-content/40">با استفاده از منوی زیر می‌توانید بلوک‌های متنی، تصویری، کد یا HTML و CSS ایستا اضافه کنید.</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isJsonImportOpen"
      class="modal modal-open z-[100] bg-black/50"
      role="presentation"
      @click.self="closeJsonImport"
      @keydown.esc.stop.prevent="closeJsonImport"
      @keydown="trapJsonImportFocus"
    >
      <section
        class="modal-box w-11/12 max-w-3xl rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blog-json-title"
        aria-describedby="blog-json-help"
        dir="rtl"
      >
        <div class="mb-5 flex items-start justify-between gap-4 border-b border-base-200 pb-4">
          <div>
            <h2 id="blog-json-title" class="text-lg font-bold text-base-content">{{ isDirectJsonImport ? 'ثبت مطلب با JSON' : 'ورود JSON مطلب' }}</h2>
            <p class="mt-1 text-sm leading-6 text-base-content/65">
              {{ isDirectJsonImport ? 'JSON کامل مطلب را وارد کنید یا قالب آماده را ویرایش کنید؛ پس از ثبت، مطلب به‌صورت پیش‌نویس ذخیره می‌شود.' : 'JSON مطلب را وارد کنید یا از قالب آماده استفاده کنید. داده‌ها در ویرایشگر بارگذاری می‌شوند تا پیش از ذخیره بررسی‌شان کنید.' }}
            </p>
          </div>
          <button type="button" class="btn btn-ghost btn-sm btn-circle" aria-label="بستن پنجره" :disabled="saving" @click="closeJsonImport">
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex flex-wrap items-center gap-2">
              <button type="button" class="btn btn-sm btn-outline btn-primary rounded-lg" :disabled="saving" @click="jsonFileInput?.click()">انتخاب فایل JSON</button>
              <span v-if="jsonFilename" class="max-w-56 truncate text-xs text-base-content/60">{{ jsonFilename }}</span>
              <span v-else class="text-xs text-base-content/50">فایل با پسوند .json</span>
              <input ref="jsonFileInput" type="file" accept=".json,application/json" class="sr-only" :disabled="saving" @change="handleJsonFileSelected" />
            </div>
            <button type="button" class="btn btn-ghost btn-sm rounded-lg" :disabled="saving" @click="loadJsonTemplate">نمایش قالب مطلب</button>
          </div>

          <label for="blog-json-input" class="label pb-1">
            <span class="label-text font-semibold">محتوای JSON مطلب</span>
          </label>
          <textarea
            id="blog-json-input"
            ref="jsonEditor"
            v-model="jsonText"
            dir="ltr"
            spellcheck="false"
            autocomplete="off"
            class="textarea textarea-bordered min-h-72 w-full rounded-xl font-mono text-xs leading-6 focus:textarea-primary"
            placeholder="قالب JSON را نمایش دهید یا ساختار مطلب را اینجا وارد کنید..."
            :disabled="saving"
            @input="jsonImportError = ''"
          />

          <p v-if="jsonImportError" class="alert alert-error rounded-xl py-3 text-sm" role="alert">{{ jsonImportError }}</p>
          <div id="blog-json-help" class="space-y-1 text-xs leading-6 text-base-content/55">
            <p>فیلدهای title، slug و content.body الزامی هستند. بلوک‌های پشتیبانی‌شده: heading، paragraph، quote، image، list، code، link، video و html؛ بلوک html فیلدهای رشته‌ای html و css دارد.</p>
            <p>برای متن‌ها از text و text_fa استفاده کنید. در image نشانی فایل را در src و text بگذارید؛ در list متن هر زبان را با خط جدید جدا کنید و همان موارد را در items هم قرار دهید.</p>
            <p>در code متن را در text و content قرار دهید؛ در link، فیلد text نشانی مقصد و text_fa عنوان نمایشی است؛ در video، text نشانی embed مانند youtube.com/embed/... است.</p>
            <p>بلوک html فقط HTML و CSS ایستا را در iframe ایزوله نمایش می‌دهد؛ اسکریپت و بارگذاری منابع خارجی مجاز نیست.</p>
            <p>برای SEO، meta_title و meta_description را بنویسید؛ این دو مقدار در عنوان و توضیحات صفحه، Open Graph و Twitter استفاده می‌شوند. cover_image_url تصویر پیش‌نمایش شبکه‌های اجتماعی است.</p>
            <p>ورود JSON فقط فرم فعلی را پر می‌کند؛ برای ثبت مطلب، دکمه ذخیره و انتشار را بزنید.</p>
          </div>
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn btn-ghost rounded-xl" :disabled="saving" @click="closeJsonImport">بستن</button>
          <button type="button" class="btn btn-primary rounded-xl px-6 font-bold" :disabled="!jsonText.trim() || saving" @click="applyJsonImport">
            <span v-if="saving" class="loading loading-spinner loading-xs"></span>
            {{ isDirectJsonImport ? 'ثبت مطلب' : 'بارگذاری در ویرایشگر' }}
          </button>
        </div>
      </section>
    </div>

    <MediaSelector
      v-if="isMediaModalOpen"
      modal-title="انتخاب رسانه دیجیتال"
      default-kind="image"
      @close="isMediaModalOpen = false"
      @file-selected="selectAsset"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { onBeforeRouteLeave } from '#app'
import { useRuntimeConfig } from '#imports'
import BlogPreview from './BlogPreview.vue'
import MediaSelector from '~/components/dashboard/media/MediaSelector.vue'
import { ArrowDown, ArrowUp, Code2, Heading, ImageIcon, LetterTextIcon, Link, List, Quote, Video, X, Eye, WifiOff, SearchX, FilePlus, Trash } from 'lucide-vue-next'
import { useBlogEditor, type BlockType } from '~/composables/useBlogEditor'
import { useDashboardConfirm } from '~/composables/useDashboardConfirm'

const blockTypes = [
  { type: 'paragraph' as BlockType, label: 'پاراگراف متن', icon: LetterTextIcon },
  { type: 'heading' as BlockType, label: 'تیتر و عنوان', icon: Heading },
  { type: 'image' as BlockType, label: 'تصویر ضمیمه', icon: ImageIcon },
  { type: 'quote' as BlockType, label: 'نقل قول', icon: Quote },
  { type: 'list' as BlockType, label: 'لیست تعریفی', icon: List },
  { type: 'code' as BlockType, label: 'بلوک سورس کد', icon: Code2 },
  { type: 'link' as BlockType, label: 'پیوند خارجی', icon: Link },
  { type: 'video' as BlockType, label: 'ویدیو پلیر', icon: Video },
  { type: 'html' as BlockType, label: 'HTML و CSS ایستا', icon: Code2 },
]

const config = useRuntimeConfig()
const route = useRoute()
const confirm = useDashboardConfirm()
const toast = useToast()
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
const isDirectJsonImport = route.query.import === 'json' && !isEditMode.value

let savedSnapshot = JSON.stringify(formData.value)
let isDirty = false
watch(formData, () => {
  isDirty = JSON.stringify(formData.value) !== savedSnapshot
}, { deep: true })

watch(status, async (currentStatus) => {
  if (currentStatus !== 'success') return
  await nextTick()
  savedSnapshot = JSON.stringify(formData.value)
  isDirty = false
})

const handleSave = async () => {
  await saveData()
  isDirty = false
}

const handleCancel = async () => {
  if (isDirty) {
    const confirmed = await confirm({
      title: 'تغییرات ذخیره نشده',
      message: 'تغییرات ذخیره نشده است. آیا مایل به خروج هستید؟',
      confirmLabel: 'خروج بدون ذخیره',
      variant: 'danger'
    })
    if (!confirmed) return
    isDirty = false
  }

  await navigateTo('/dashboard/blog')
}

onBeforeRouteLeave(async (_to, _from, next) => {
  if (!isDirty) {
    next()
    return
  }

  const confirmed = await confirm({
    title: 'تغییرات ذخیره نشده',
    message: 'تغییرات ذخیره نشده است. آیا مایل به خروج هستید؟',
    confirmLabel: 'خروج بدون ذخیره',
    variant: 'danger'
  })
  next(confirmed)
})

const isJsonImportOpen = ref(false)
const jsonText = ref('')
const jsonFilename = ref('')
const jsonImportError = ref('')
const jsonFileInput = ref<HTMLInputElement | null>(null)
const jsonEditor = ref<HTMLTextAreaElement | null>(null)
const jsonImportTrigger = ref<HTMLButtonElement | null>(null)

const blogJsonTemplate = () => ({
  title: '',
  slug: '',
  summary: '',
  is_published: false,
  cover_image_url: '',
  meta_title: '',
  meta_description: '',
  content: {
    title: '',
    title_fa: '',
    summary: '',
    summary_fa: '',
    body: [
      {
        type: 'heading',
        level: 2,
        text: 'Section heading in English',
        text_fa: 'عنوان بخش به فارسی'
      },
      {
        type: 'paragraph',
        text: 'English paragraph. Provide the full technical explanation here.',
        text_fa: 'متن پاراگراف به فارسی'
      },
      {
        type: 'quote',
        text: 'Quoted text',
        text_fa: 'متن نقل قول',
        author: 'Source or author'
      },
      {
        type: 'image',
        src: '/uploads/example-image.jpg',
        text: '/uploads/example-image.jpg',
        alt: 'Image description',
        caption: 'Image caption',
        text_fa: 'توضیح تصویر'
      },
      {
        type: 'list',
        text: 'First item\nSecond item',
        text_fa: 'مورد اول\nمورد دوم',
        style: 'unordered',
        items: [
          { text: 'First item', text_fa: 'مورد اول' },
          { text: 'Second item', text_fa: 'مورد دوم' }
        ]
      },
      {
        type: 'code',
        language: 'text',
        text: 'Paste code or technical text here.',
        content: 'Paste code or technical text here.'
      },
      {
        type: 'link',
        text: 'https://example.com/technical-reference',
        url: 'https://example.com/technical-reference',
        text_fa: 'عنوان پیوند'
      },
      {
        type: 'video',
        text: 'https://www.youtube.com/embed/VIDEO_ID',
        url: 'https://www.youtube.com/embed/VIDEO_ID',
        caption: 'Video description'
      },
      {
        type: 'html',
        html: '<section class="feature-card"><h2>عنوان بخش</h2><p>توضیحات کوتاه این بخش.</p></section>',
        css: '.feature-card { padding: 1.5rem; border: 1px solid #ddd; border-radius: 1rem; }\n.feature-card h2 { margin: 0 0 0.75rem; font-size: 1.25rem; }'
      }
    ]
  }
})

const openJsonImport = async (showTemplate = false) => {
  jsonText.value = JSON.stringify(showTemplate ? blogJsonTemplate() : formData.value, null, 2)
  jsonFilename.value = ''
  jsonImportError.value = ''
  if (jsonFileInput.value) jsonFileInput.value.value = ''
  isJsonImportOpen.value = true
  await nextTick()
  jsonEditor.value?.focus()
}

const closeJsonImport = () => {
  if (saving.value) return
  isJsonImportOpen.value = false
  nextTick(() => jsonImportTrigger.value?.focus())
}

const trapJsonImportFocus = (event: KeyboardEvent) => {
  if (event.key !== 'Tab') return

  const modal = event.currentTarget as HTMLElement
  const focusable = Array.from(modal.querySelectorAll<HTMLElement>(
    'button:not(:disabled), input:not(:disabled), textarea:not(:disabled)'
  ))
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

const loadJsonTemplate = () => {
  jsonText.value = JSON.stringify(blogJsonTemplate(), null, 2)
  jsonFilename.value = ''
  jsonImportError.value = ''
  if (jsonFileInput.value) jsonFileInput.value.value = ''
}

const handleJsonFileSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.name.toLowerCase().endsWith('.json')) {
    jsonImportError.value = 'فقط فایل با پسوند .json قابل انتخاب است.'
    input.value = ''
    return
  }

  try {
    jsonText.value = await file.text()
    jsonFilename.value = file.name
    jsonImportError.value = ''
  } catch {
    jsonImportError.value = 'خواندن فایل JSON انجام نشد. دوباره تلاش کنید.'
  }
}

const isJsonObject = (value: unknown): value is Record<string, unknown> => (
  value !== null && typeof value === 'object' && !Array.isArray(value)
)

const importedString = (value: unknown, field: string, fallback = '') => {
  if (value == null) return fallback
  if (typeof value !== 'string') throw new Error(`فیلد ${field} باید متن باشد.`)
  return value
}

const normalizeImportedBlog = (value: unknown) => {
  if (!isJsonObject(value)) throw new Error('JSON باید یک شیء مطلب باشد.')
  if (typeof value.title !== 'string' || !value.title.trim()) throw new Error('فیلد title الزامی است و باید متن باشد.')
  if (typeof value.slug !== 'string' || !value.slug.trim()) throw new Error('فیلد slug الزامی است و باید متن باشد.')

  let rawContent = value.content
  if (typeof rawContent === 'string') {
    try {
      rawContent = JSON.parse(rawContent)
    } catch {
      throw new Error('فیلد content شامل JSON معتبر نیست.')
    }
  }
  if (!isJsonObject(rawContent) || !Array.isArray(rawContent.body)) {
    throw new Error('فیلد content باید یک شیء با آرایه body باشد.')
  }

  const supportedTypes = new Set<BlockType>(['paragraph', 'heading', 'image', 'quote', 'list', 'code', 'link', 'video', 'html'])
  const body = rawContent.body.map((entry, index) => {
    if (!isJsonObject(entry) || typeof entry.type !== 'string' || !supportedTypes.has(entry.type as BlockType)) {
      throw new Error(`نوع بلوک شماره ${index + 1} معتبر نیست.`)
    }

    const stringFields = ['text', 'text_fa', 'src', 'alt', 'caption', 'author', 'language', 'content', 'url', 'style', 'html', 'css']
    const strings = Object.fromEntries(stringFields.map(field => [field, importedString(entry[field], `content.body[${index}].${field}`)]))
    const level = entry.level == null ? 2 : entry.level
    if (typeof level !== 'number' || !Number.isInteger(level) || level < 1 || level > 6) {
      throw new Error(`سطح عنوان بلوک شماره ${index + 1} باید عددی بین 1 تا 6 باشد.`)
    }

    let items: { text: string; text_fa: string }[] = []
    if (entry.items != null) {
      if (!Array.isArray(entry.items)) throw new Error(`فیلد items در بلوک شماره ${index + 1} باید آرایه باشد.`)
      items = entry.items.map((item, itemIndex) => {
        if (!isJsonObject(item)) throw new Error(`آیتم ${itemIndex + 1} در بلوک شماره ${index + 1} معتبر نیست.`)
        return {
          text: importedString(item.text, `items[${itemIndex}].text`),
          text_fa: importedString(item.text_fa, `items[${itemIndex}].text_fa`)
        }
      })
    }

    return {
      type: entry.type as BlockType,
      level,
      ...strings,
      style: strings.style || (entry.type === 'list' ? 'unordered' : ''),
      items: entry.type === 'list' && items.length === 0 ? [{ text: '', text_fa: '' }] : items
    }
  })

  if (value.is_published != null && typeof value.is_published !== 'boolean') {
    throw new Error('فیلد is_published باید true یا false باشد.')
  }

  return {
    title: value.title,
    slug: value.slug,
    summary: importedString(value.summary, 'summary'),
    is_published: value.is_published === true,
    cover_image_url: importedString(value.cover_image_url, 'cover_image_url'),
    meta_title: importedString(value.meta_title, 'meta_title'),
    meta_description: importedString(value.meta_description, 'meta_description'),
    content: {
      body,
      title: importedString(rawContent.title, 'content.title'),
      title_fa: importedString(rawContent.title_fa, 'content.title_fa'),
      summary: importedString(rawContent.summary, 'content.summary'),
      summary_fa: importedString(rawContent.summary_fa, 'content.summary_fa')
    }
  }
}

const applyJsonImport = async () => {
  jsonImportError.value = ''
  try {
    const imported = normalizeImportedBlog(JSON.parse(jsonText.value))
    if (isDirectJsonImport) {
      saving.value = true
      const response = await $fetch<any>('/api/pages', {
        method: 'POST',
        body: {
          category_id: 'b2139ae7-e352-441e-99b6-910114d2f9a7',
          ...imported,
          is_published: false
        }
      })
      if (response?.success === false) throw new Error(response.message || 'ثبت مطلب انجام نشد.')
      isDirty = false
      saving.value = false
      closeJsonImport()
      toast.success('مطلب با JSON ثبت و به‌صورت پیش‌نویس ذخیره شد.')
      await navigateTo('/dashboard/blog')
      return
    }

    if (isDirty) {
      const confirmed = await confirm({
        title: 'جایگزینی محتوای مطلب',
        message: 'بارگذاری این JSON جایگزین همه تغییرات فعلی و ذخیره‌نشده مطلب می‌شود. ادامه می‌دهید؟',
        confirmLabel: 'جایگزینی اطلاعات',
        variant: 'danger'
      })
      if (!confirmed) return
    }

    formData.value = {
      ...formData.value,
      ...imported,
      category_id: 'b2139ae7-e352-441e-99b6-910114d2f9a7'
    }
    closeJsonImport()
  } catch (error) {
    jsonImportError.value = error instanceof Error ? error.message : 'JSON مطلب معتبر نیست.'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  if (route.query.import === 'json') void openJsonImport(true)
})

const isMediaModalOpen = ref(false)
const activeTargetBlockIndex = ref<number>(-1) 

const openMediaPicker = (index: number) => {
  activeTargetBlockIndex.value = index
  isMediaModalOpen.value = true
}

const selectAsset = (fileUrl: string) => {
  if (activeTargetBlockIndex.value === -1) {
    formData.value.cover_image_url = fileUrl
  } else {
    const block = formData.value.content.body[activeTargetBlockIndex.value]
    if (block && block.type === 'image') {
      block.src = fileUrl
    }
  }
  isMediaModalOpen.value = false
}
</script>
