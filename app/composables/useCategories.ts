import type { CategoryItem } from '~/types/categoryItem'

const CATEGORIES_KEY = 'categories_data'

const staticCategories: CategoryItem[] = [
  {
    id: 'main', slug: '', parent_id: null, name: 'صفحه اصلی',
    description: '', image_url: null, is_visible: true, sort_order: 1,
    meta_title: 'Main Page', meta_description: '', children: [], has_sidebar: false
  },
  {
    id: 'products', slug: 'category', parent_id: null, name: 'محصولات',
    description: '', image_url: null, is_visible: true, sort_order: 1,
    meta_title: 'Products', meta_description: '', children: [], has_sidebar: true
  },
  {
    id: 'about', slug: 'about', parent_id: null, name: 'درباره ما',
    description: '', image_url: null, is_visible: true, sort_order: 1,
    meta_title: 'About Us', meta_description: '', has_sidebar: true,
    children: [
      { id: 'certificates', slug: 'certificates', parent_id: 'about', name: 'گواهینامه‌ها', description: '', image_url: '/uploads/57569f5c-d5a5-4cd4-a394-fb197e5c22d3_Cert.svg', is_visible: true, sort_order: 1, meta_title: 'Certificates', meta_description: '', children: [] },
      { id: 'about-company', slug: 'about', parent_id: 'about', name: 'درباره شرکت', description: '', image_url: '/uploads/11015445-aa3b-4095-a308-61c9b6e6a794_Company.svg', is_visible: true, sort_order: 2, meta_title: 'About Company', meta_description: '', children: [] },
      { id: 'catalogue', slug: 'catalogue', parent_id: 'about', name: 'کاتالوگ', description: '', image_url: '/uploads/7416d1d7-8c63-4053-98aa-9e6750c120e0_Catalog.svg', is_visible: true, sort_order: 3, meta_title: 'Catalogue', meta_description: '', children: [] }
    ]
  },
  { id: 'blog', slug: 'blog', parent_id: null, name: 'اخبار و مقالات', description: '', image_url: null, is_visible: true, sort_order: 2, meta_title: 'News & Articles', meta_description: '', children: [] },
  { id: 'contact', slug: 'contact', parent_id: null, name: 'تماس با ما', description: '', image_url: null, is_visible: true, sort_order: 3, meta_title: 'Contact Us', meta_description: '', children: [] },
]

function findCategoryRecursively(categories: CategoryItem[], predicate: (c: CategoryItem) => boolean): CategoryItem | null {
  for (const cat of categories) {
    if (predicate(cat)) return cat
    if (cat.children?.length) {
      const found = findCategoryRecursively(cat.children, predicate)
      if (found) return found
    }
  }
  return null
}

function flattenCategories(categories: CategoryItem[]): CategoryItem[] {
  return categories.flatMap(item => [item, ...flattenCategories(item.children ?? [])])
}

function sortCategoriesRecursively(items: CategoryItem[]): CategoryItem[] {
  return [...items]
    .sort((a, b) => {
      // Fallback to 0 if sort_order properties are missing or undefined
      const orderA = a.sort_order ?? 0
      const orderB = b.sort_order ?? 0
      return orderA - orderB
    })
    .map(item => ({
      ...item,
      slug: `category/${item.slug}`,
      children: item.children ? sortCategoriesRecursively(item.children) : []
    }))
}

// Top-level named exports for stateless layouts
export const shouldOpenSidebar = (category: CategoryItem): boolean => 
  !!(category.has_sidebar || category.children?.length)

export const isProductCategory = (category: CategoryItem): boolean => 
  !category.children?.length

export function useCategories() {
  const config = useRuntimeConfig()
  
  const categories = useState<CategoryItem[]>('ssr_categories', () => [])
  const product_categories = useState<CategoryItem[]>('ssr_product_categories', () => [])

  async function loadCategories(): Promise<void> {
    const baseURL = config.public.baseURL as string

    try {
      const json = await $fetch<{ success: boolean; data: CategoryItem[] }>(`${baseURL}/categories`, {
        signal: AbortSignal.timeout(10000)
      })

      if (!json.success || !Array.isArray(json.data)) {
        throw new Error('Invalid response structure')
      }

      const sortedCategories = sortCategoriesRecursively(json.data)
      const filteredProductCategories = sortedCategories.filter(cat => cat.category_type === 'product')

      const mergedCategories = staticCategories.map(staticCat => 
        staticCat.id === 'products' 
          ? { ...staticCat, children: filteredProductCategories } 
          : { ...staticCat }
      )

      if (import.meta.client) {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(mergedCategories))
      }

      categories.value = mergedCategories
      product_categories.value = sortedCategories

    } catch (e) {
      console.error('Categories fetch failed, falling back to cache/static storage:', e)

      if (import.meta.client) {
        const cached = localStorage.getItem(CATEGORIES_KEY)
        if (cached) {
          try {
            const parsedCache = JSON.parse(cached)
            if (Array.isArray(parsedCache)) {
              categories.value = parsedCache
              product_categories.value = parsedCache.find(cat => cat.id === 'products')?.children || []
              return
            }
          } catch {}
        }
      }

      categories.value = staticCategories
      product_categories.value = []
    }
  }

  function getCategoryBySlug(slug: string | undefined): CategoryItem | null {
    if (!slug) return null
    return findCategoryRecursively(categories.value, c => c.slug === slug)
  }

  function getCategoryById(id: string | number | undefined): CategoryItem | undefined {
    if (!id) return undefined
    return findCategoryRecursively(categories.value, c => String(c.id) === String(id)) ?? undefined
  }

  function getCategoriesByParentId(parentId: string | number | null): CategoryItem[] {
    const allCategories = flattenCategories(categories.value)
    return allCategories.filter(cat => 
      parentId === null ? cat.parent_id === null : String(cat.parent_id) === String(parentId)
    )
  }

  function refreshCategories(): Promise<void> {
    categories.value = []
    product_categories.value = []
    if (import.meta.client) {
      localStorage.removeItem(CATEGORIES_KEY)
    }
    return loadCategories()
  }

  return {
    categories: computed(() => categories.value),
    product_categories: computed(() => product_categories.value),
    loadCategories,
    getCategoryBySlug,
    getCategoryById,
    getCategoriesByParentId,
    refreshCategories,
    getTopLevelCategories: () => getCategoriesByParentId(null),
    isCategoriesLoaded: () => categories.value.length > 0,
    getAllProductCategories: () => flattenCategories(categories.value).filter(c => !c.children?.length),
    getCategoryBreadcrumb: (categorySlug: string): CategoryItem[] => {
      const category = getCategoryBySlug(categorySlug)
      if (!category) return []
      const breadcrumb: CategoryItem[] = [category]
      let current = category
      while (current.parent_id) {
        const parent = getCategoryById(current.parent_id)
        if (!parent) break
        breadcrumb.unshift(parent)
        current = parent
      }
      return breadcrumb
    }
  }
}