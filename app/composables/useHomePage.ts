// app/composables/useHomePage.ts
export interface ItemSection {
  title: string
  sub_title: string
  title_fa: string
  sub_title_fa: string
  icon: string
  url: string
}

export interface ImageGallery {
  url: string
  title: string
  title_fa: string
  description: string
  description_fa: string
}

export interface HomeBrand {
  name: string
  name_fa: string
  logo_url: string
  website_url: string
}

export interface HomeAboutFeature {
  title: string
  description: string
  value?: string
}

export interface HomeAboutSection {
  eyebrow: string
  title: string
  description: string
  cta_label: string
  cta_url: string
  features: HomeAboutFeature[]
}

export interface HomeOrderStep {
  title: string
  subtitle: string
  description: string
  icon: string
}

export interface HomeOrderSection {
  eyebrow: string
  title: string
  steps: HomeOrderStep[]
}

export interface HomePromiseItem {
  title: string
  description: string
  icon: string
}

export interface HomeBrandPromiseSection {
  eyebrow: string
  title: string
  description: string
  items: HomePromiseItem[]
}

export interface HomePageContent {
  ItemSection: ItemSection[]
  image_gallery: ImageGallery[]
  brands: HomeBrand[]
  about_section?: HomeAboutSection
  order_process?: HomeOrderSection
  brand_promise?: HomeBrandPromiseSection
}

export interface HomePage {
  id: string
  title: string
  slug: string
  summary: string
  content: HomePageContent
  meta_title: string
  meta_description: string
}

interface ApiResponse {
  code: number
  success: boolean
  message: string
  data: HomePage
}

const HOME_SLUG = 'صفحه-اصلی'

export const useHomePage = () => {
  const page = useState<HomePage | null>('home-page', () => null)
  const loading = useState<boolean>('home-page-loading', () => false)
  const error = useState<string | null>('home-page-error', () => null)

  const fetchHomePage = async () => {
    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const apiBase = config.public.apiBase || '/api'

      const response = await $fetch<ApiResponse>(
        `${apiBase}/pages/${encodeURIComponent(HOME_SLUG)}`
      )

      if (response?.success && response.data) {
        if (!response.data.content) {
          response.data.content = { ItemSection: [], image_gallery: [], brands: [] }
        }
        response.data.content.ItemSection ??= []
        response.data.content.image_gallery ??= []
        response.data.content.brands ??= []
        page.value = response.data
      } else {
        error.value = response?.message || 'خطا در دریافت اطلاعات'
      }
    } catch (err: any) {
      error.value = err?.message || 'خطای ارتباط با سرور'
      console.error('Failed to fetch home page:', err)
    } finally {
      loading.value = false
    }
  }

  return { page, loading, error, fetchHomePage }
}
