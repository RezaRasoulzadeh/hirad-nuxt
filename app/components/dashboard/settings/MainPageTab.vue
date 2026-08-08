<template>
  <form v-if="modelValue" @submit.prevent="$emit('save')">
    <div class="space-y-6">
      <div class="form-control w-full">
        <label class="label font-bold text-sm text-base-content/80">Title</label>
        <input v-model="modelValue.title" type="text" class="input input-bordered w-full" />
      </div>

      <div class="form-control w-full">
        <label class="label font-bold text-sm text-base-content/80">Summary</label>
        <textarea v-model="modelValue.summary" class="textarea textarea-bordered w-full h-24 resize-none"></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control w-full">
          <label class="label font-bold text-sm text-base-content/80">Meta Title</label>
          <input v-model="modelValue.meta_title" type="text" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full">
          <label class="label font-bold text-sm text-base-content/80">Meta Description</label>
          <textarea v-model="modelValue.meta_description" class="textarea textarea-bordered w-full h-12 resize-none"></textarea>
        </div>
      </div>

      <div class="divider text-base-content/50 font-medium text-xs">Hero Images</div>
      <div v-for="(image, idx) in modelValue.content?.image_gallery || []" :key="'hero-' + idx" class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title flex items-center justify-between font-medium text-sm">
          <span>{{ image.title || image.title_fa || 'تصویر بدون نام' }}</span>
          <button type="button" @click.stop="modelValue.content.image_gallery.splice(idx, 1)" class="btn btn-ghost btn-xs text-error">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div class="form-control w-full">
            <label class="label text-xs font-bold text-base-content/70">Image URL</label>
            <div class="join w-full">
              <input v-model="image.url" type="text" class="input input-bordered join-item grow w-full" />
              <button type="button" @click="$emit('select-media', idx, 'hero')" class="btn join-item">انتخاب فایل</button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="image.title" type="text" placeholder="Title (EN)" class="input input-bordered w-full" />
            <input v-model="image.title_fa" type="text" placeholder="Title (FA)" class="input input-bordered w-full" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea v-model="image.description" placeholder="Description (EN)" class="textarea textarea-bordered w-full h-20 resize-none"></textarea>
            <textarea v-model="image.description_fa" placeholder="Description (FA)" class="textarea textarea-bordered w-full h-20 resize-none"></textarea>
          </div>
        </div>
      </div>
      <button type="button" @click="addHeroImage" class="btn btn-outline btn-dashed btn-success btn-block">
        <PlusCircle class="w-4 h-4 ml-2" /> افزودن تصویر جدید
      </button>

      <div class="divider text-base-content/50 font-medium text-xs">برندها</div>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div v-for="(brand, idx) in modelValue.content?.brands || []" :key="'brand-' + idx"
          class="relative rounded-xl border border-base-300 bg-base-200/50 p-4">
          <button type="button" @click="modelValue.content.brands.splice(idx, 1)"
            class="btn btn-ghost btn-sm btn-circle absolute top-2 left-2 text-error" aria-label="حذف برند">
            <Trash2 class="size-4" />
          </button>

          <div class="mb-4 flex h-28 items-center justify-center rounded-lg border border-base-300 bg-base-100 p-3">
            <img v-if="brand.logo_url" :src="resolveAssetUrl(brand.logo_url)" :alt="brand.name_fa || brand.name"
              class="h-full w-full object-contain">
            <span v-else class="text-xs text-base-content/40">لوگوی برند</span>
          </div>

          <div class="space-y-3">
            <div class="join w-full">
              <input v-model="brand.logo_url" type="text" placeholder="Logo URL"
                class="input input-bordered join-item min-w-0 grow" />
              <button type="button" @click="$emit('select-media', idx, 'brand')" class="btn join-item">انتخاب فایل</button>
            </div>
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input v-model="brand.name_fa" type="text" placeholder="نام فارسی" class="input input-bordered w-full" />
              <input v-model="brand.name" type="text" placeholder="Name (EN)" class="input input-bordered w-full" dir="ltr" />
            </div>
            <input v-model="brand.website_url" type="url" placeholder="https://brand.com"
              class="input input-bordered w-full" dir="ltr" />
          </div>
        </div>
      </div>
      <button type="button" @click="addBrand" class="btn btn-outline btn-dashed btn-primary btn-block">
        <PlusCircle class="w-4 h-4 ml-2" /> افزودن برند
      </button>

      <button type="submit" class="btn btn-primary btn-block mt-6">ذخیره تغییرات صفحه اصلی</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Trash2, PlusCircle } from 'lucide-vue-next'

const props = defineProps<{ modelValue: any }>()
defineEmits(['save', 'select-media'])

const addHeroImage = () => {
  if (!props.modelValue.content) props.modelValue.content = {}
  if (!props.modelValue.content.image_gallery) props.modelValue.content.image_gallery = []
  props.modelValue.content.image_gallery.push({ url: '', title: '', title_fa: '', description: '', description_fa: '' })
}

const addBrand = () => {
  if (!props.modelValue.content) props.modelValue.content = {}
  if (!props.modelValue.content.brands) props.modelValue.content.brands = []
  props.modelValue.content.brands.push({ name: '', name_fa: '', logo_url: '', website_url: '' })
}
</script>
