<template>
  <form v-if="modelValue" @submit.prevent="$emit('save')">
    <div class="space-y-6">
      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title flex items-center gap-3 font-bold text-base-content/80">
          <span>متن‌های هیرو</span><code class="text-xs font-normal text-base-content/40" dir="ltr">image_gallery</code>
        </div>
        <div class="collapse-content space-y-3 bg-base-100 pt-4">
      <div v-for="(image, idx) in modelValue.content?.image_gallery || []" :key="'hero-' + idx" class="collapse collapse-arrow border border-base-300 bg-base-200/50 rounded-xl">
        <input type="checkbox" />
        <div class="collapse-title flex items-center justify-between font-medium text-sm">
          <span>{{ image.title || image.title_fa || 'تصویر بدون نام' }}</span>
          <button type="button" @click.stop="modelValue.content.image_gallery.splice(idx, 1)" class="btn btn-ghost btn-xs text-error">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
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
        <PlusCircle class="w-4 h-4 ml-2" /> افزودن متن هیرو
      </button>
        </div>
      </div>

      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title flex items-center gap-3 font-bold text-base-content/80">
          <span>درباره هیراد</span><code class="text-xs font-normal text-base-content/40" dir="ltr">about_section</code>
        </div>
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

        <div class="space-y-3">
          <div v-for="(feature, idx) in modelValue.content.about_section.features" :key="`about-feature-${idx}`"
            class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/40">
            <input type="checkbox" />
            <div class="collapse-title flex min-h-11 items-center justify-between py-2 pe-12">
              <strong class="text-sm">{{ idx + 1 }}. {{ feature.title || 'ویژگی بدون عنوان' }}</strong>
              <button type="button" class="btn btn-ghost btn-xs text-error"
                aria-label="حذف ویژگی" @click.stop="removeAboutFeature(idx)">
                <Trash2 class="size-4" />
              </button>
            </div>
            <div class="collapse-content grid grid-cols-1 gap-3 bg-base-100 pt-3 md:grid-cols-2">
              <input v-model="feature.title" type="text" placeholder="عنوان ویژگی" class="input input-bordered w-full" />
              <input v-model="feature.description" type="text" placeholder="توضیح ویژگی" class="input input-bordered w-full" />
            </div>
          </div>
        </div>
          <button v-if="modelValue.content.about_section.features.length < 3" type="button"
            class="btn btn-outline btn-dashed btn-primary btn-block" @click="addAboutFeature">
            <PlusCircle class="size-4 ml-2" /> افزودن ویژگی
          </button>
        </div>
      </div>

      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title flex items-center gap-3 font-bold text-base-content/80">
          <span>روند سفارش</span><code class="text-xs font-normal text-base-content/40" dir="ltr">order_process</code>
        </div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input v-model="modelValue.content.order_process.eyebrow" dir="ltr" placeholder="عنوان انگلیسی"
              class="input input-bordered w-full" />
            <input v-model="modelValue.content.order_process.title" placeholder="عنوان فارسی"
              class="input input-bordered w-full" />
          </div>
          <div v-for="(step, idx) in modelValue.content.order_process.steps" :key="`order-step-${idx}`"
            class="collapse collapse-arrow border border-base-300 bg-base-200/40">
            <input type="checkbox" />
            <div class="collapse-title flex min-h-11 items-center justify-between py-2 pe-12 text-sm font-medium">
              <span>{{ idx + 1 }}. {{ step.title || 'مرحله بدون عنوان' }}</span>
              <button type="button" class="btn btn-ghost btn-xs text-error" @click.stop="removeOrderStep(idx)"><Trash2 class="size-4" /></button>
            </div>
            <div class="collapse-content flex flex-col gap-4 bg-base-100 pt-3 lg:flex-row lg:items-start">
              <AssetPickerField v-model="step.icon" label="آیکن مرحله"
                description="آیکن نمایش‌داده‌شده بالای این مرحله را انتخاب کنید."
                class="w-full lg:w-56 lg:shrink-0"
                @select="$emit('select-media', idx, 'order-icon')" />
              <div class="grid min-w-0 grow grid-cols-1 gap-3 md:grid-cols-2">
                <input v-model="step.title" placeholder="عنوان فارسی" class="input input-bordered w-full" />
                <input v-model="step.subtitle" dir="ltr" placeholder="English subtitle" class="input input-bordered w-full" />
                <textarea v-model="step.description" placeholder="توضیحات"
                  class="textarea textarea-bordered min-h-24 w-full resize-y md:col-span-2" />
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-dashed btn-primary btn-block" @click="addOrderStep">
            <PlusCircle class="size-4" /> افزودن مرحله
          </button>
        </div>
      </div>

      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title flex items-center gap-3 font-bold text-base-content/80">
          <span>تعهد برند</span><code class="text-xs font-normal text-base-content/40" dir="ltr">brand_promise</code>
        </div>
        <div class="collapse-content space-y-4 bg-base-100 pt-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input v-model="modelValue.content.brand_promise.eyebrow" dir="ltr" placeholder="عنوان انگلیسی"
              class="input input-bordered w-full" />
            <input v-model="modelValue.content.brand_promise.title" placeholder="عنوان فارسی"
              class="input input-bordered w-full" />
          </div>
          <textarea v-model="modelValue.content.brand_promise.description" placeholder="توضیح بخش"
            class="textarea textarea-bordered w-full" />
          <div v-for="(item, idx) in modelValue.content.brand_promise.items" :key="`promise-${idx}`"
            class="collapse collapse-arrow border border-base-300 bg-base-200/40">
            <input type="checkbox" />
            <div class="collapse-title flex min-h-11 items-center justify-between py-2 pe-12 text-sm font-medium">
              <span>{{ item.title || 'آیتم بدون عنوان' }}</span>
              <button type="button" class="btn btn-ghost btn-xs text-error" @click.stop="removePromiseItem(idx)"><Trash2 class="size-4" /></button>
            </div>
            <div class="collapse-content flex flex-col gap-4 bg-base-100 pt-3 lg:flex-row lg:items-start">
              <AssetPickerField v-model="item.icon" label="آیکن ویژگی"
                description="تصویری که برای این ویژگی برند نمایش داده می‌شود."
                class="w-full lg:w-56 lg:shrink-0"
                @select="$emit('select-media', idx, 'promise-icon')" />
              <div class="grid min-w-0 grow grid-cols-1 gap-3">
                <input v-model="item.title" placeholder="عنوان" class="input input-bordered w-full" />
                <textarea v-model="item.description" placeholder="توضیحات"
                  class="textarea textarea-bordered min-h-24 w-full resize-y" />
              </div>
            </div>
          </div>
          <button type="button" class="btn btn-outline btn-dashed btn-primary btn-block" @click="addPromiseItem">
            <PlusCircle class="size-4" /> افزودن آیتم
          </button>
        </div>
      </div>

      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title flex items-center gap-3 font-bold text-base-content/80">
          <span>برندها</span><code class="text-xs font-normal text-base-content/40" dir="ltr">brands</code>
          <span class="badge badge-sm ms-auto me-6">{{ modelValue.content?.brands?.length || 0 }}</span>
        </div>
        <div class="collapse-content space-y-3 bg-base-100 pt-4">
      <div class="space-y-3">
        <div v-for="(brand, idx) in modelValue.content?.brands || []" :key="'brand-' + idx"
          class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
          <input type="checkbox" />
          <div class="collapse-title flex min-h-11 items-center justify-between py-2 pe-12 text-sm font-medium">
            <span>{{ brand.name_fa || brand.name || `برند ${idx + 1}` }}</span>
            <button type="button" @click.stop="modelValue.content.brands.splice(idx, 1)"
              class="btn btn-ghost btn-xs text-error" aria-label="حذف برند"><Trash2 class="size-4" /></button>
          </div>
          <div class="collapse-content flex flex-col gap-4 bg-base-100 pt-4 lg:flex-row lg:items-start">
          <AssetPickerField v-model="brand.logo_url" label="لوگوی برند"
            description="لوگوی برند را با پس‌زمینه شفاف انتخاب کنید."
            class="w-full lg:w-64 lg:shrink-0"
            @select="$emit('select-media', idx, 'brand')" />

          <div class="min-w-0 grow space-y-3">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input v-model="brand.name_fa" type="text" placeholder="نام فارسی" class="input input-bordered w-full" />
              <input v-model="brand.name" type="text" placeholder="Name (EN)" class="input input-bordered w-full" dir="ltr" />
            </div>
            <input v-model="brand.website_url" type="url" placeholder="https://brand.com"
              class="input input-bordered w-full" dir="ltr" />
          </div>
          </div>
        </div>
      </div>
      <button type="button" @click="addBrand" class="btn btn-outline btn-dashed btn-primary btn-block">
        <PlusCircle class="w-4 h-4 ml-2" /> افزودن برند
      </button>
        </div>
      </div>

      <div class="collapse collapse-arrow rounded-xl border border-base-300 bg-base-200/50">
        <input type="checkbox" />
        <div class="collapse-title flex items-center gap-3 font-bold text-base-content/80">
          <span>تنظیمات سئو</span><code class="text-xs font-normal text-base-content/40" dir="ltr">SEO</code>
        </div>
        <div class="collapse-content grid grid-cols-1 gap-4 bg-base-100 pt-4 md:grid-cols-2">
          <input v-model="modelValue.title" placeholder="عنوان صفحه" class="input input-bordered w-full" />
          <input v-model="modelValue.meta_title" dir="ltr" placeholder="Meta title" class="input input-bordered w-full" />
          <textarea v-model="modelValue.summary" placeholder="خلاصه فارسی" class="textarea textarea-bordered min-h-24" />
          <textarea v-model="modelValue.meta_description" dir="ltr" placeholder="Meta description"
            class="textarea textarea-bordered min-h-24" />
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-block mt-6">ذخیره تغییرات صفحه اصلی</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { Trash2, PlusCircle } from 'lucide-vue-next'
import AssetPickerField from './AssetPickerField.vue'

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

const defaultOrderProcess = () => ({
  eyebrow: 'Order Process',
  title: 'روند ثبت و تکمیل سفارش',
  steps: [
    { title: 'تماس اولیه', subtitle: 'Contact', description: 'ارتباط اولیه و طرح موضوع با کارشناسان هیراد', icon: '' },
    { title: 'مشاوره فنی', subtitle: 'Consultation', description: 'بررسی دقیق قطعات، فیتینگ‌ها و فیلترهای درخواستی', icon: '' },
    { title: 'صدور پیش‌فاکتور', subtitle: 'Proforma Invoice', description: 'شفاف‌سازی قیمت‌ها و مشخص کردن دقیق زمان تحویل', icon: '' },
    { title: 'ثبت نهایی درخواست', subtitle: 'Order Registration', description: 'نهایی کردن سفارش صنعتی و آغاز فرآیند تامین یا تولید', icon: '' },
    { title: 'بسته‌بندی و ارسال', subtitle: 'Delivery', description: 'بسته‌بندی استاندارد ایمن و ارسال به موقع تجهیزات مکانیکی', icon: '' },
    { title: 'تضمین کیفیت', subtitle: 'Warranty', description: 'پشتیبانی فنی مهندسی و ارائه تاییدیه کنترل کیفیت نهایی', icon: '' },
  ],
})

const defaultBrandPromise = () => ({
  eyebrow: 'Brand Promise',
  title: 'تعهد هیراد',
  description: 'چشم‌انداز این شرکت تبدیل شدن به همکاری مورد اعتماد برای تولید کنندگان و تامین کننده‌ای مطمئن برای مشتریان می باشد.',
  items: [
    { title: 'متعهد', description: 'تعهد برای ما اعتماد می‌آفریند. ما همواره به قول خود پایبندیم و باور داریم که تمامی مشتریان و همکاران می‌توانند روی ما حساب کنند.', icon: 'commitment.png' },
    { title: 'انگیزه‌مند', description: 'ما همیشه در تلاشیم تا بهترین راه‌حل‌ها را برای مشتریان خود بیابیم.', icon: 'motivation.png' },
    { title: 'با صلاحیت', description: 'دانش تخصصی در حوزه‌های فنی و بازرگانی، پایه‌ای استوار برای ارائه راه‌حل‌های دقیق است.', icon: 'skill.png' },
    { title: 'منعطف', description: 'تمرکز اصلی ما بر خواسته‌های فردی مشتریان است.', icon: 'flexibility.png' },
  ],
})

if (!props.modelValue.content) props.modelValue.content = {}
if (!props.modelValue.content.about_section) props.modelValue.content.about_section = defaultAboutSection()
if (!props.modelValue.content.order_process) props.modelValue.content.order_process = defaultOrderProcess()
if (!props.modelValue.content.brand_promise) props.modelValue.content.brand_promise = defaultBrandPromise()
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

const addOrderStep = () => props.modelValue.content.order_process.steps.push({ title: '', subtitle: '', description: '', icon: '' })
const removeOrderStep = (index: number) => props.modelValue.content.order_process.steps.splice(index, 1)
const addPromiseItem = () => props.modelValue.content.brand_promise.items.push({ title: '', description: '', icon: '' })
const removePromiseItem = (index: number) => props.modelValue.content.brand_promise.items.splice(index, 1)
</script>
