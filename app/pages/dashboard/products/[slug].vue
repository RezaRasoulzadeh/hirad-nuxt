<template>
  <div class="w-full bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden flex flex-col">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-base-200 p-6 gap-4">
      <div>
        <h2 class="text-xl font-bold text-base-content">
          {{ isEditMode ? 'ویرایش محصول' : 'ایجاد محصول جدید' }}
        </h2>
        <p class="text-xs text-base-content/50 mt-0.5 font-mono" v-if="product.slug">{{ product.slug }}</p>
      </div>
      <div 
        class="badge font-bold px-4 py-3 border-none text-xs rounded-lg"
        :class="product.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'"
      >
        {{ product.is_active ? "منتشر شده" : "پیش‌نویس" }}
      </div>
    </div>

    <div class="p-6">
      <form ref="formEl" @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">نام محصول (EN) *</span></label>
            <input v-model="product.name" type="text" required class="input input-bordered w-full rounded-xl focus:input-primary" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">شناسه کالا (SKU) *</span></label>
            <input v-model="product.sku" type="text" required class="input input-bordered w-full rounded-xl focus:input-primary font-mono" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">دسته‌بندی والد *</span></label>
            <select v-model="product.category_id" required class="select select-bordered w-full rounded-xl focus:select-primary">
              <option disabled value="">انتخاب دسته‌بندی</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">قیمت پایه *</span></label>
            <input v-model.number="product.price" type="number" min="0" required class="input input-bordered w-full rounded-xl focus:input-primary" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">قیمت با تخفیف</span></label>
            <input v-model.number="product.discount_price" type="number" min="0" class="input input-bordered w-full rounded-xl focus:input-primary" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold text-base-content/80">موجودی انبار *</span></label>
            <input v-model.number="product.stock_quantity" type="number" min="0" required class="input input-bordered w-full rounded-xl focus:input-primary" />
          </div>
        </div>

        <div class="border border-base-200 bg-base-50/40 p-5 rounded-2xl space-y-2">
          <label class="text-sm font-bold text-base-content/80 block">گالری تصاویر محصول</label>
          <ProductImageGalleryEditor
            :images="product.short_description.images"
            @open-modal="() => openMediaManager('gallery')"
            @set-primary="handleSetPrimary"
            @remove-image="handleRemoveImage"
          />
        </div>

        <div class="border border-base-200 p-5 rounded-2xl space-y-4 bg-base-50/20">
          <h3 class="font-bold text-sm text-base-content border-b border-base-100 pb-2">توضیحات کوتاه و عناوین بومی‌سازی شده</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input v-model="product.short_description.name" placeholder="Name (EN) *" required class="input input-bordered rounded-xl w-full text-sm" />
            <input v-model="product.short_description.name_fa" placeholder="نام محصول (FA) *" dir="rtl" required class="input input-bordered rounded-xl w-full text-sm font-semibold" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea v-model="product.short_description.description" placeholder="Short Description (EN)" class="textarea textarea-bordered rounded-xl w-full text-sm min-h-20"></textarea>
            <textarea v-model="product.short_description.description_fa" placeholder="توضیحات کوتاه (FA)" dir="rtl" class="textarea textarea-bordered rounded-xl w-full text-sm min-h-20"></textarea>
          </div>
        </div>

        <FeaturesSection
          :features="product.short_description.features"
          :features-fa="product.short_description.features_fa"
          :expanded-items="expandedItems.features"
          @add-feature="addFeature"
          @remove-feature="removeFeature"
          @toggle-expand="(idx) => toggleExpand('features', idx)"
          @update-feature-key="updateFeatureKey"
          @update-feature-value="updateFeatureValue"
        />

        <LongDescriptionSection
          title="کاربردها (Applications)"
          :items="product.long_description.applications"
          :expanded-items="expandedItems.applications"
          @add-item="() => addLongDescItem('applications')"
          @remove-item="(idx) => removeLongDescItem('applications', idx)"
          @toggle-expand="(idx) => toggleExpand('applications', idx)"
          @open-media="(idx) => openMediaManager(`app_icon_${idx}`)"
        />

        <LongDescriptionSection
          title="مشخصات فنی (Specifications)"
          :items="product.long_description.specifications"
          :expanded-items="expandedItems.specifications"
          section-type="specifications"
          @add-item="() => addLongDescItem('specifications')"
          @remove-item="(idx) => removeLongDescItem('specifications', idx)"
          @toggle-expand="(idx) => toggleExpand('specifications', idx)"
        />

        <LongDescriptionSection
          title="توضیحات تکمیلی (Explanation)"
          :items="product.long_description.explanation"
          :expanded-items="expandedItems.explanation"
          section-type="explanation"
          @add-item="() => addLongDescItem('explanation')"
          @remove-item="(idx) => removeLongDescItem('explanation', idx)"
          @toggle-expand="(idx) => toggleExpand('explanation', idx)"
          @open-media="(idx) => openMediaManager(`exp_image_${idx}`)"
        />

        <LongDescriptionSection
          title="سوالات متداول (FAQ)"
          :items="product.long_description.faq"
          :expanded-items="expandedItems.faq"
          section-type="faq"
          @add-item="() => addLongDescItem('faq')"
          @remove-item="(idx) => removeLongDescItem('faq', idx)"
          @toggle-expand="(idx) => toggleExpand('faq', idx)"
        />

        <div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-base-200 gap-4">
          <div class="form-control">
            <label class="label cursor-pointer gap-3 select-none">
              <input id="isActive" type="checkbox" v-model="product.is_active" class="checkbox checkbox-primary checkbox-sm rounded-md" />
              <span class="label-text font-bold text-sm text-base-content/80">ذخیره و انتشار آنی محصول در سایت</span>
            </label>
          </div>
          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button type="button" @click="goBack" class="btn border-base-200 bg-base-100 rounded-xl px-5 h-11 min-h-0 text-sm">انصراف</button>
            <button type="submit" :disabled="saving" class="btn btn-primary rounded-xl px-7 h-11 min-h-0 font-bold text-sm">
              <span v-if="saving" class="loading loading-spinner loading-xs"></span>
              {{ saving ? 'در حال ذخیره...' : 'ذخیره محصول' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <MediaManagerModal 
      v-if="isMediaManagerOpen" 
      modal-title="انتخاب فایل رسانه" 
      @close="closeMediaManager"
      @file-selected="handleFileSelected" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter, useFetch } from '#imports'
import { useProductForm } from '~/composables/useProductForm'
import MediaManagerModal from '~/components/dashboard/media/MediaSelector.vue'
import ProductImageGalleryEditor from '~/components/dashboard/product/ProductImageGalleryEditor.vue'
import LongDescriptionSection from '~/components/dashboard/product/ProductLongDes.vue'
import FeaturesSection from '~/components/dashboard/product/FeaturesSection.vue'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const router = useRouter()
const formEl = ref<HTMLFormElement | null>(null)
const categories = ref<Array<{ id: string; name: string }>>([])

const {
  product, saving, loading, hasUnsavedChanges, isMediaManagerOpen, expandedItems, isEditMode,
  normalizeProductData, addFeature, removeFeature, updateFeatureKey, updateFeatureValue,
  addLongDescItem, removeLongDescItem, toggleExpand, handleFileSelected, openMediaManager, closeMediaManager, createEmptyProduct
} = useProductForm()

const fetchCategories = async () => {
  try {
    const response = await $fetch<any>('/api/dashboard/categories')
    if (response?.data) {
      categories.value = response.data
        .filter((cat: any) => cat.category_type === 'product' && !cat.parent_id && cat.is_visible)
        .flatMap((parent: any) =>
          (parent.children || [])
            .filter((child: any) => child.category_type === 'product' && child.is_visible)
            .map((child: any) => ({
              id: child.id,
              name: `${parent.name} / ${child.name}`
            }))
        )
    }
  } catch (err) {
    console.error('Failed to parse categories hierarchy tree payload:', err)
  }
}

const initializeForm = async () => {
  const slug = route.params.slug as string | undefined
  if (slug && slug !== 'new') {
    loading.value = true
    try {
      const response = await $fetch<any>(`/api/dashboard/products/${encodeURIComponent(slug)}`)
      if (response?.data) {
        product.value = normalizeProductData(response.data)
      }
    } catch (err) {
      console.error('Failed to hydrate single item context mapping configuration:', err)
    } finally {
      loading.value = false
    }
  } else {
    product.value = createEmptyProduct()
    if (categories.value.length > 0 && categories.value[0]?.id) {
      product.value.category_id = categories.value[0].id
    }
  }
  setTimeout(() => { hasUnsavedChanges.value = false }, 50)
}

const handleSetPrimary = (mediaAssetId: string) => {
  const shortDesc = product.value?.short_description
  if (!shortDesc?.images) return

  shortDesc.images.forEach(img => img.is_primary = false)
  const target = shortDesc.images.find(img => img.media_asset_id === mediaAssetId)
  if (target) {
    target.is_primary = true
    shortDesc.images.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
  }
  hasUnsavedChanges.value = true
}

const handleRemoveImage = (mediaAssetId: string) => {
  const images = product.value?.short_description?.images
  if (!images) return

  const idx = images.findIndex(img => img.media_asset_id === mediaAssetId)
  if (idx === -1) return
  
  const wasPrimary = images[idx]?.is_primary ?? false
  images.splice(idx, 1)
  
  if (wasPrimary && images.length > 0 && images[0]) {
    images[0].is_primary = true
  }
  hasUnsavedChanges.value = true
}

const onSubmit = async () => {
  if (formEl.value && !formEl.value.checkValidity()) {
    formEl.value.reportValidity()
    return
  }

  saving.value = true
  try {
    const url = isEditMode.value ? `/api/dashboard/products/${product.value.slug}` : '/api/dashboard/products'
    const method = isEditMode.value ? 'PUT' : 'POST'
    
    await $fetch(url, {
      method,
      body: product.value
    })

    hasUnsavedChanges.value = false
    router.push('/dashboard/products')
  } catch (err) {
    console.error('Persistence layer failure writing target JSON schema values:', err)
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  if (hasUnsavedChanges.value && !window.confirm('تغییرات ذخیره نشده رها شوند؟')) return
  router.push('/dashboard/products')
}

onMounted(async () => {
  await fetchCategories()
  await initializeForm()
})

watch(() => route.params.slug, initializeForm)
watch(product, () => { hasUnsavedChanges.value = true }, { deep: true })
</script>