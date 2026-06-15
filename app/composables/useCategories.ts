import { computed } from 'vue'

export interface Category {
  id: string
  parent_id: string | null
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_visible: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  category_type: 'product' | 'about' | 'blog'
  children?: Category[]
}

interface ApiResponse {
  code: number
  success: boolean
  message: string
  data: Category[]
}

export const useCategories = () => {
  const categories = useState<Category[]>('categories', () => [])
  const loading = useState<boolean>('categories-loading', () => false)
  const error = useState<Error | null>('categories-error', () => null)

  const fetchCategories = async () => {
    if (categories.value && categories.value.length > 0) return

    loading.value = true
    error.value = null

    try {
      const config = useRuntimeConfig()
      const baseUrl = config?.public?.apiBase || 'http://localhost:3000/api'

      const response = await $fetch<ApiResponse>(`${baseUrl}/categories`)
      if (response?.success && Array.isArray(response.data)) {
        categories.value = response.data
      } else {
        categories.value = []
      }
    } catch (err) {
      error.value = err as Error
      categories.value = []
      console.error('Failed to fetch categories:', err)
    } finally {
      loading.value = false
    }
  }

  const getCategoriesByType = (type: 'product' | 'about' | 'blog') => {
    return computed(() => {
      if (!categories.value || !Array.isArray(categories.value)) return []
      return categories.value.filter(
        cat => cat && cat.category_type === type && cat.parent_id === null
      )
    })
  }

  // Recursive flat search to find a category by ID inside a nested tree structure
  const findCategoryById = (nodes: Category[], id: string): Category | null => {
    if (!nodes || !Array.isArray(nodes)) return null
    for (const node of nodes) {
      if (!node) continue
      if (node.id === id) return node
      if (node.children && node.children.length > 0) {
        const found = findCategoryById(node.children, id)
        if (found) return found
      }
    }
    return null
  };

  const getCategoryLineage = (categoryId?: string | null) => {
    return computed(() => {
      if (!categoryId || !categories.value || categories.value.length === 0) {
        return { currentCategory: null, parentCategory: null }
      }

      const current = findCategoryById(categories.value, categoryId)
      if (!current) return { currentCategory: null, parentCategory: null }

      let parent: Category | null = null
      if (current.parent_id) {
        parent = findCategoryById(categories.value, current.parent_id)
      }

      return {
        currentCategory: current,
        parentCategory: parent
      }
    })
  }

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryLineage,
    productCategories: getCategoriesByType('product'),
    aboutCategories: getCategoriesByType('about'),
    blogCategories: getCategoriesByType('blog')
  }
}