export type StandardResourceKind = 'official' | 'document' | 'reference'

export interface StandardResourceLink {
  id: string
  label_fa: string
  label_en: string
  url: string
  kind: StandardResourceKind
}

export interface StandardDraft {
  slug: string
  organization: string
  designation: string
  title_fa: string
  title_en: string
  short_description_fa: string
  short_description_en: string
  content_fa: string
  content_en: string
  category_fa: string
  category_en: string
  edition: string
  publication_year: number | null
  official_url: string
  resources: StandardResourceLink[]
  is_published: boolean
  is_featured: boolean
  sort_order: number | null
  meta_title_fa: string
  meta_title_en: string
  meta_description_fa: string
  meta_description_en: string
}

export interface StandardEntry extends StandardDraft {
  id: string
  backend_slug: string
  created_at: string | null
  updated_at: string | null
}

export type PublicStandard = Omit<
  StandardEntry,
  'id' | 'backend_slug' | 'is_published' | 'created_at'
>

export interface StandardApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: { total: number }
}

export interface StandardPageRecord {
  id?: string
  title?: string
  slug?: string
  summary?: string | null
  content?: unknown
  is_published?: boolean
  created_at?: string | null
  updated_at?: string | null
  meta_title?: string | null
  meta_description?: string | null
}
