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

export interface HomePageContent {
  ItemSection: ItemSection[]
  image_gallery: ImageGallery[]
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

export const useHomePage = () => {
  const page = useState<HomePage | null>('home-page', () => null)
  const loading = useState<boolean>('home-page-loading', () => false)
  const error = useState<string | null>('home-page-error', () => null)  

  const fetchHomePage = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<ApiResponse>('/api/pages/صفحه-اصلی')

      if (response?.success && response.data) {
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