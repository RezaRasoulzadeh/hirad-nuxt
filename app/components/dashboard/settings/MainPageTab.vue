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

      <div class="divider text-base-content/50 font-medium text-xs">محتوای صفحه اصلی</div>
      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title font-bold text-base-content/80">بخش درباره هیراد</div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="form-control w-full">
            <label class="label text-xs font-bold text-base-content/70">عنوان انگلیسی کوچک</label>
            <input v-model="modelValue.content.about_section.eyebrow" type="text" dir="ltr"
              class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label text-xs font-bold text-base-content/70">عنوان اصلی</label>
            <input v-model="modelValue.content.about_section.title" type="text" class="input input-bordered w-full" />
          </div>
        </div>

        <div class="form-control w-full">
          <label class="label text-xs font-bold text-base-content/70">متن معرفی</label>
          <textarea v-model="modelValue.content.about_section.description"
            class="textarea textarea-bordered min-h-36 w-full resize-y" />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div class="form-control w-full">
            <label class="label text-xs font-bold text-base-content/70">متن دکمه</label>
            <input v-model="modelValue.content.about_section.cta_label" type="text" class="input input-bordered w-full" />
          </div>
          <div class="form-control w-full">
            <label class="label text-xs font-bold text-base-content/70">لینک دکمه</label>
            <input v-model="modelValue.content.about_section.cta_url" type="text" dir="ltr"
              class="input input-bordered w-full" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div v-for="(feature, idx) in modelValue.content.about_section.features" :key="`about-feature-${idx}`"
            class="space-y-3 rounded-xl border border-base-300 bg-base-100 p-4">
            <div class="flex items-center justify-between">
              <strong class="text-sm">ویژگی {{ idx + 1 }}</strong>
              <button type="button" class="btn btn-ghost btn-xs text-error"
                aria-label="حذف ویژگی" @click="removeAboutFeature(idx)">
                <Trash2 class="size-4" />
              </button>
            </div>
            <input v-model="feature.title" type="text" placeholder="عنوان ویژگی"
              class="input input-bordered w-full" />
            <textarea v-model="feature.description" placeholder="توضیح ویژگی"
              class="textarea textarea-bordered h-20 w-full resize-none" />
          </div>
        </div>
          <button v-if="modelValue.content.about_section.features.length < 3" type="button"
            class="btn btn-outline btn-dashed btn-primary btn-block" @click="addAboutFeature">
            <PlusCircle class="size-4 ml-2" /> افزودن ویژگی
          </button>
        </div>
      </div>

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

const defaultAboutSection = () => ({
  eyebrow: 'About Hirad',
  title: 'درباره تجهیز فرآیند هیراد',
  description: 'شرکت تجهیز فرآیند هیراد در سال ۱۳۹۷ با شماره ثبت ۵۲۵۴۷۰ در تهران تأسیس شد و طی سال‌های اخیر فعالیت خود را بر ارائه خدمات تأمین، تدارکات، مهندسی، و بازرگانی تخصصی در حوزه نفت، گاز، پالایش، پتروشیمی، نیروگاه، صنایع تولیدی، غذایی و دارویی متمرکز کرده است. این شرکت با بهره‌گیری از شبکه گسترده تأمین‌کنندگان داخلی و بین‌المللی، یکی از عرضه‌کنندگان فعال لوله، اتصالات، شیرآلات صنعتی، فلنج، ابزار دقیق، مواد شیمیایی و تجهیزات خاص طرح‌ها و پروژه‌های صنعتی در کشور به شمار می‌رود. در راستای ارتقای کیفیت و مدیریت یکپارچه، شرکت موفق به پیاده‌سازی و اخذ گواهی‌های ISO 9001، ISO 14001، ISO 29001، ISO 45001 و IMS شده است. همچنین شرکت در فهرست بلند تأمین‌کنندگان مورد تأیید وزارت نفت (AVL) ثبت گردیده که بیانگر احراز صلاحیت‌های فنی و مدیریتی و امکان مشارکت در فرآیندهای مناقصات و تأمین در صنایع نفت و گاز است. پایبندی به استانداردهای بین‌المللی از جمله ASME، ANSI، API، EN، DIN، BS و ISO، تحویل کالا با نظارت نهادهای بازرسی و ارائه گواهی‌های معتبر فنی از اصول اساسی فعالیت شرکت تجهیز فرآیند هیراد محسوب می‌شود.',
  cta_label: 'مشاهده کامل معرفی شرکت',
  cta_url: '/about',
  features: [
    { title: 'تأمین و تدارک تجهیزات', description: 'برای پروژه‌های صنعتی در سراسر کشور' },
    { title: 'استانداردهای بین‌المللی', description: '(ASME, ANSI, API, EN, DIN, BS)' },
    { title: '+10 سال تجربه', description: 'در صنایع مختلف' },
  ],
})

if (!props.modelValue.content) props.modelValue.content = {}
if (!props.modelValue.content.about_section) props.modelValue.content.about_section = defaultAboutSection()
props.modelValue.content.about_section.features ??= defaultAboutSection().features
props.modelValue.content.about_section.features = props.modelValue.content.about_section.features.map((feature: any) => ({
  title: feature.value ? `${feature.value} ${feature.title}` : feature.title,
  description: feature.description,
}))
if (!props.modelValue.content.about_section.description
  || props.modelValue.content.about_section.description.includes('در سال ۱۳۹۴ با هدف')) {
  props.modelValue.content.about_section.description = defaultAboutSection().description
}

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

const addAboutFeature = () => {
  if (props.modelValue.content.about_section.features.length >= 3) return
  props.modelValue.content.about_section.features.push({ title: '', description: '' })
}

const removeAboutFeature = (index: number) => {
  props.modelValue.content.about_section.features.splice(index, 1)
}
</script>
