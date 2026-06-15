export interface BannerItem {
  sub_title?: string
  sub_title_fa?: string
  description?: string
  description_fa?: string
}

export interface ApplicationItem {
  id: number
  title: string
  title_fa: string
  icon?: string
  description: string
  description_fa: string
}

export interface FaqItem {
  id: number
  title: { fa: string; en: string }
  description: { fa: string; en: string }
}

export interface PageContent {
  hero: {
    title: string
    title_fa: string
    sub_title: string
    sub_title_fa: string
    description: string
    description_fa: string
  }
  banner?: {
    image: string
    title: string
    title_fa: string
    link?: string
    items?: BannerItem[]
  }
  applications?: ApplicationItem[]
  faq?: FaqItem[]
}

export interface CategoryPageData {
  id: string
  category_id: string
  title: string
  slug: string
  summary?: string
  content: PageContent
  is_published: boolean
  cover_image_url: string
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

interface ApiPageResponse {
  code: number
  success: boolean
  message: string
  data: CategoryPageData
}

export const useCategoryPage = (slug: Ref<string>) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const {
    data: pageData,
    error: pageError,
    pending,
    refresh,
  } = useAsyncData<CategoryPageData>(
    `category-page-${slug.value}`,
    async () => {
      const res = await $fetch<ApiPageResponse>(`${apiBase}/pages/${slug.value}`)
      if (!res?.success || !res.data) throw new Error('Page not found')
      return res.data
    },
    { watch: [slug] }
  )

  useHead({
    title: () => pageData.value ? `${pageData.value.title} | هیراد` : 'هیراد',
    meta: [
      {
        name: 'description',
        content: () =>
          pageData.value?.meta_description || pageData.value?.summary || '',
      },
    ],
  })

  function resolveUrl(path?: string | null): string {
    if (!path) return ''
    if (path.startsWith('http')) return path
    return `${apiBase}${path}`
  }

  return { pageData, pageError, pending, refresh, resolveUrl }
}