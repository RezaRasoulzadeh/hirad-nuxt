export interface ProductImage {
  image_url: string
  is_primary?: boolean
  sort_order?: number
  media_asset_id?: string
}

export interface ProductFeature {
  [key: string]: string
}

export interface ProductShortDescription {
  name?: string
  name_fa?: string
  description?: string
  description_fa?: string
  features?: ProductFeature[]
  features_fa?: ProductFeature[]
  images?: ProductImage[]
}

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  discount_price?: number
  stock_quantity?: number
  is_active?: boolean
  short_description: ProductShortDescription
}

interface ApiProductResponse {
  code: number
  success: boolean
  message: string
  data: Product[]
}

const PAGE_SIZE = 12

export const useProductList = (categorySlug: Ref<string>) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const visibleCount = ref(PAGE_SIZE)

  const {
    data: allProducts,
    error,
    pending,
    refresh,
  } = useAsyncData<Product[]>(
    () => `products-${categorySlug.value}`,
    async () => {
      const res = await $fetch<ApiProductResponse>(`${apiBase}/products`, {
        params: {
          category: categorySlug.value,
          sort: 'newest',
          only_active: true,
        },
      })
      if (!res?.success) throw new Error(res?.message || 'خطا در دریافت محصولات')
      return res.data ?? []
    },
    { watch: [categorySlug] }
  )

  // Reset visible slice when slug changes
  watch(categorySlug, () => { visibleCount.value = PAGE_SIZE })

  const total = computed(() => allProducts.value?.length ?? 0)
  const products = computed(() => allProducts.value?.slice(0, visibleCount.value) ?? [])
  const hasMore = computed(() => visibleCount.value < total.value)

  function loadMore() {
    visibleCount.value += PAGE_SIZE
  }

  return {
    products,
    total,
    pending,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}