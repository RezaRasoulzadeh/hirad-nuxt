// types/category.ts

export interface CategoryItem {
  id: string | number                 
  slug: string
  parent_id: string | number | null
  name: string
  
  description?: string | null
  image_url?: string | null
  is_visible?: boolean                
  sort_order?: number | null
  
  meta_title?: string | null
  meta_description?: string | null
  category_type?: string | null
  has_sidebar?: boolean
  
  children?: CategoryItem[]
  
  // Optional metadata layers
  created_at?: string | null
  updated_at?: string | null
  product_count?: number
  level?: number
}

export interface CategoryResponse {
  success: boolean
  data: CategoryItem[]
  message?: string | null
}

export interface ProductCategoryFilter {
  category_id?: string | number
  category_slug?: string
  include_children?: boolean
  only_visible?: boolean
  sort?: 'name' | 'sort_order' | 'created_at'
  sort_direction?: 'asc' | 'desc'
}
