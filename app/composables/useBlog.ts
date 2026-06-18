import { ref, computed } from 'vue'

export interface BlogPost {
  id: string
  title: string
  slug: string
  summary: string
  cover_image_url: string
  is_published: boolean
  updated_at: string
  meta_title: string | null
  meta_description: string | null
}

interface ApiResponse {
  code: number
  success: boolean
  message: string
  data: BlogPost[]
}

export function useBlog() {
  const config = useRuntimeConfig()
  const posts = ref<BlogPost[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')

async function fetchPosts() {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<ApiResponse>('/pages/category/blog', {
        baseURL: config.public.apiBase,
        query: {
          is_published: true
        }
      })
      
      if (response.success) {
        posts.value = response.data
      } else {
        error.value = response.message || 'خطا در دریافت اطلاعات'
      }
    } catch (err: any) {
      error.value = err.message || 'مشکلی در اتصال به سرور رخ داده است'
    } finally {
      loading.value = false
    }
  }

  const filteredPosts = computed(() => {
    if (!searchQuery.value.trim()) return posts.value
    const query = searchQuery.value.toLowerCase().trim()
    return posts.value.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.summary.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query)
    )
  })

  return {
    posts,
    filteredPosts,
    searchQuery,
    loading,
    error,
    fetchPosts
  }
}