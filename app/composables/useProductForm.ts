// composables/useProductForm.ts
import { ref, reactive, computed, nextTick } from '#imports'

export interface Feature {
  [key: string]: string;
}

export interface ProductFormData {
  id?: string | null;
  category_id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  discount_price: number;
  stock_quantity: number;
  sort_order: number | null;
  is_active: boolean;
  short_description: {
    name: string;
    name_fa: string;
    description: string;
    description_fa: string;
    images: ProductImage[];
    features: Feature[];
    features_fa: Feature[];
  };
  long_description: {
    applications: any[];
    specifications: any[];
    explanation: any[];
    faq: any[];
  };
}

const createEmptyProduct = (): ProductFormData => ({
  category_id: '',
  sku: '',
  name: '',
  slug: '',
  price: 0,
  discount_price: 0,
  stock_quantity: 0,
  sort_order: null,
  is_active: false,
  short_description: {
    name: '',
    name_fa: '',
    description: '',
    description_fa: '',
    images: [],
    features: [],
    features_fa: []
  },
  long_description: {
    applications: [],
    specifications: [],
    explanation: [],
    faq: []
  }
})

export const useProductForm = () => {
  const product = ref<ProductFormData>(createEmptyProduct())
  const saving = ref(false)
  const loading = ref(false)
  const hasUnsavedChanges = ref(false)
  
  const isMediaManagerOpen = ref(false)
  const currentMediaTarget = ref<string | null>(null)

  const expandedItems = reactive({
    features: new Set<number>(),
    applications: new Set<number>(),
    specifications: new Set<number>(),
    explanation: new Set<number>(),
    faq: new Set<number>()
  })

  const isEditMode = computed(() => !!product.value.id)

  const DEFAULT_ITEMS = {
    applications: () => ({ title: '', title_fa: '', icon: '', description: '', description_fa: '' }),
    specifications: () => ({ name: '', name_fa: '', description: '', description_fa: '' }),
    explanation: () => ({ title: '', title_fa: '', image: '', description: '', description_fa: '' }),
    faq: () => ({ title: { en: '', fa: '' }, description: { en: '', fa: '' } })
  }

  const normalizeProductData = (data: any): ProductFormData => {
    const base = createEmptyProduct()
    return {
      id: data.id || null,
      category_id: data.category_id || '',
      sku: data.sku || '',
      name: data.name || '',
      slug: data.slug || '',
      price: Number(data.price) || 0,
      discount_price: Number(data.discount_price) || 0,
      stock_quantity: Number(data.stock_quantity) || 0,
      sort_order: Number.isFinite(data.sort_order) ? Number(data.sort_order) : null,
      is_active: Boolean(data.is_active),
      short_description: {
        name: data.short_description?.name || '',
        name_fa: data.short_description?.name_fa || '',
        description: data.short_description?.description || '',
        description_fa: data.short_description?.description_fa || '',
        images: data.short_description?.images || [],
        features: data.short_description?.features || [],
        features_fa: data.short_description?.features_fa || []
      },
      long_description: {
        applications: data.long_description?.applications || [],
        specifications: data.long_description?.specifications || [],
        explanation: data.long_description?.explanation || [],
        faq: (data.long_description?.faq || []).map((item: any) => ({
          title: { en: item.title?.en || '', fa: item.title?.fa || '' },
          description: { en: item.description?.en || '', fa: item.description?.fa || '' }
        }))
      }
    }
  }

  const addFeature = () => {
    product.value.short_description.features.push({})
    product.value.short_description.features_fa.push({})
    hasUnsavedChanges.value = true
  }

  const removeFeature = (index: number) => {
    product.value.short_description.features.splice(index, 1)
    product.value.short_description.features_fa.splice(index, 1)
    hasUnsavedChanges.value = true
  }

  const updateFeatureKey = (index: number, lang: 'en' | 'fa', newKey: string) => {
    const list = lang === 'en' ? product.value.short_description.features : product.value.short_description.features_fa
    if (!list[index]) return
    const oldKey = Object.keys(list[index])[0]
    const val = oldKey ? (list[index][oldKey] ?? '') : ''
    list[index] = { [newKey]: val }
    hasUnsavedChanges.value = true
  }

  const updateFeatureValue = (index: number, lang: 'en' | 'fa', newValue: string) => {
    const list = lang === 'en' ? product.value.short_description.features : product.value.short_description.features_fa
    if (!list[index]) return
    const key = Object.keys(list[index])[0]
    if (key) {
      list[index][key] = newValue
      hasUnsavedChanges.value = true
    }
  }

  const addLongDescItem = (section: keyof typeof DEFAULT_ITEMS) => {
    product.value.long_description[section].push(DEFAULT_ITEMS[section]())
    hasUnsavedChanges.value = true
  }

  const removeLongDescItem = (section: 'applications' | 'specifications' | 'explanation' | 'faq', index: number) => {
    product.value.long_description[section].splice(index, 1)
    expandedItems[section].delete(index)
    hasUnsavedChanges.value = true
  }

  const toggleExpand = (section: keyof typeof expandedItems, index: number) => {
    if (expandedItems[section].has(index)) {
      expandedItems[section].delete(index)
    } else {
      expandedItems[section].add(index)
    }
  }

  const handleFileSelected = (fileUrl: string, assetId: string) => {
    if (!currentMediaTarget.value) return
    const target = currentMediaTarget.value

    if (target.startsWith('app_icon_')) {
      const idx = parseInt(target.replace('app_icon_', ''), 10)
      if (product.value.long_description.applications[idx]) {
        product.value.long_description.applications[idx].icon = fileUrl
      }
    } else if (target.startsWith('exp_image_')) {
      const idx = parseInt(target.replace('exp_image_', ''), 10)
      if (product.value.long_description.explanation[idx]) {
        product.value.long_description.explanation[idx].image = fileUrl
      }
    } else if (target === 'gallery') {
      product.value.short_description.images.push({
        media_asset_id: assetId,
        is_primary: product.value.short_description.images.length === 0,
        image_url: fileUrl,
        sort_order: product.value.short_description.images.length
      })
    }
    closeMediaManager()
    hasUnsavedChanges.value = true
  }

  const openMediaManager = (target: string) => {
    currentMediaTarget.value = target
    nextTick(() => { isMediaManagerOpen.value = true })
  }

  const closeMediaManager = () => {
    isMediaManagerOpen.value = false
    currentMediaTarget.value = null
  }

  return {
    product, saving, loading, hasUnsavedChanges, isMediaManagerOpen, expandedItems, isEditMode,
    normalizeProductData, addFeature, removeFeature, updateFeatureKey, updateFeatureValue,
    addLongDescItem, removeLongDescItem, toggleExpand, handleFileSelected, openMediaManager, closeMediaManager, createEmptyProduct
  }
}
