import { ref, computed, watch } from 'vue'
import { useRoute, useRuntimeConfig, useFetch } from '#app'

export interface FeatureItem {
  [key: string]: string
}

export interface FAQItem {
  id: number
  title: { en: string; fa: string }
  description: { en: string; fa: string }
}

export interface SpecificationItem {
  name: string
  name_fa: string
  description: string
  description_fa: string
}

export interface ProductData {
  id: string
  category_id: string
  sku: string
  name: string
  slug: string
  short_description?: {
    name: string
    name_fa: string
    images?: ProductImage[]
    features?: FeatureItem[]
    features_fa?: FeatureItem[]
    description: string
    description_fa: string
  }
  long_description?: {
    faq?: FAQItem[]
    explanation?: any[]
    applications?: ApplicationItem[]
    specifications?: SpecificationItem[]
  }
  price: number
  discount_price: number
  stock_quantity: number
  is_active: boolean
}

export interface ApiResponse {
  code: number
  success: boolean
  message: string
  data?: ProductData
}

export const useProduct = () => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const slug = (route?.params?.slug as string) || ''
  
  const activeImage = ref<string | null>(null)
  const copiedSku = ref(false)
  const activeTab = ref<'specifications' | 'explanation'>('specifications')

  const { data: productResponse, pending, error, refresh } = useFetch<ApiResponse>(
    `/products/${slug}`,
    {
      baseURL: config?.public?.apiBase || '',
      key: `product-${slug}`,
      immediate: !!slug
    }
  )

  const product = computed(() => productResponse.value?.data || null)

  const sortedImages = computed(() => {
    const targetImages = product.value?.short_description?.images
    if (!targetImages || !Array.isArray(targetImages)) return []
    
    return [...targetImages].sort((a, b) => {
      if (!a || !b) return 0
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return (a.sort_order || 0) - (b.sort_order || 0)
    })
  })

  watch(sortedImages, (newImages) => {
    if (newImages && newImages.length > 0 && !activeImage.value) {
      activeImage.value = newImages[0]?.image_url || null
    }
  }, { immediate: true })

  function copyToClipboard(text: string) {
    if (!text || typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(text)
      .then(() => {
        copiedSku.value = true
        setTimeout(() => {
          copiedSku.value = false
        }, 1500)
      })
      .catch(() => {})
  }

  function formatPrice(price?: number): string {
    if (!price || price === 0) return 'تماس بگیرید'
    try {
      const formatter = new Intl.NumberFormat('fa-IR')
      return `${formatter.format(price)} ریال`
    } catch {
      return `${price} ریال`
    }
  }

  return {
    product,
    pending,
    error,
    refresh,
    activeImage,
    copiedSku,
    activeTab,
    sortedImages,
    copyToClipboard,
    formatPrice
  }
}