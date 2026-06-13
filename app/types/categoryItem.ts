// types/category.ts

export interface CategoryItem {
  id: string | number                 // APIs might use integers for autoincrement IDs
  slug: string
  parent_id: string | number | null
  name: string
  
  // Null-guarded fields to prevent upstream API exceptions
  description?: string | null
  image_url?: string | null
  is_visible?: boolean                // Made optional to safely assume fallback default true/false
  sort_order?: number                 // Made optional to allow fallback default indexing systems
  
  meta_title?: string | null
  meta_description?: string | null
  category_type?: string | null
  has_sidebar?: boolean
  
  // Strongly type the structural nesting array to guarantee an asset array pattern
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