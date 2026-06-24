export interface BlogBlock {
  type: 'heading' | 'paragraph' | 'quote' | 'list' | 'code' | 'link' | 'video'
  level?: number
  text: string
  text_fa?: string
  author?: string
}

export interface BlogPostSingle {
  id: string
  category_id: string
  title: string
  slug: string
  summary: string
  content: {
    body: BlogBlock[]
  }
  is_published: boolean
  published_at: string | null
  cover_image_url: string
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  code: number
  success: boolean
  message: string
  data: BlogPostSingle
}

export const useBlogSingle = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || '/api'

  const fetchPostByRawSlug = async (rawSlug: string) => {
    return await $fetch<ApiResponse>(`/pages/${rawSlug}`, {
      baseURL: apiBase,
      method: 'GET'
    })
  }

  return {
    fetchPostByRawSlug
  }
}
