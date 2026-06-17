import { ref, computed, type Ref } from 'vue'
import { useRuntimeConfig } from '#app'


export interface ParsedProductTitle {
  name?: string
  name_fa?: string
  description?: string
  description_fa?: string
  features?: ProductFeature[]
  features_fa?: ProductFeature[]
  images?: ProductImage[]
}

export interface SearchResultRaw {
  title: string
  url: string
  score: number
  object_type: 'product' | 'category' | 'blog' | string
  object_id: string
  category: string | null
}

export interface SearchResultItem extends SearchResultRaw {
  parsed: ParsedProductTitle | null
  primaryImage: string | null
}

export interface CategorizedResults {
  products: SearchResultItem[]
  categories: SearchResultItem[]
  pages: SearchResultItem[]
}

interface ApiSearchResponse {
  code: number
  success: boolean
  message: string
  data: SearchResultRaw[]
}

const MIN_QUERY_LENGTH = 3
const DEBOUNCE_MS = 300
const RESULT_LIMIT = 20

function emptyResults(): CategorizedResults {
  return { products: [], categories: [], pages: [] }
}

function parseProductTitle(title: string): ParsedProductTitle | null {
  try {
    return JSON.parse(title) as ParsedProductTitle
  } catch {
    return null
  }
}

function resolvePrimaryImage(parsed: ParsedProductTitle | null): string | null {
  const images = parsed?.images
  if (!images || !Array.isArray(images) || images.length === 0) return null

  const primary = images.find(img => img.is_primary)
  if (primary) return primary.image_url

  const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  return sorted[0]?.image_url ?? null
}

export function getLocalizedField(
  parsed: ParsedProductTitle | null,
  field: 'name' | 'description',
  isRTL: boolean
): string {
  if (!parsed) return ''
  const faKey = `${field}_fa` as keyof ParsedProductTitle
  const faValue = parsed[faKey] as string | undefined
  const enValue = parsed[field] as string | undefined
  return isRTL ? (faValue || enValue || '') : (enValue || faValue || '')
}

export const useGlobalSearch = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const query = ref('')
  const results = ref<CategorizedResults>(emptyResults())
  const pending = ref(false)
  const error = ref<string | null>(null)

  let debounceTimer: ReturnType<typeof setTimeout> | undefined
  let abortController: AbortController | undefined

  const hasResults = computed(() =>
    results.value.products.length > 0 ||
    results.value.categories.length > 0 ||
    results.value.pages.length > 0
  )

  const isQueryTooShort = computed(() => query.value.trim().length < MIN_QUERY_LENGTH)

  async function runSearch() {
    const trimmed = query.value.trim()

    if (trimmed.length < MIN_QUERY_LENGTH) {
      results.value = emptyResults()
      pending.value = false
      error.value = null
      return
    }

    abortController?.abort()
    abortController = new AbortController()

    pending.value = true
    error.value = null

    try {
      const res = await $fetch<ApiSearchResponse>(`${apiBase}/search`, {
        params: { q: trimmed, limit: RESULT_LIMIT },
        signal: abortController.signal,
      })

      if (!res?.success) throw new Error(res?.message || 'جستجو ناموفق بود')

      const grouped = emptyResults()

      for (const item of res.data ?? []) {
        const isJsonTitle = typeof item.title === 'string' && item.title.trim().startsWith('{')
        const parsed = isJsonTitle ? parseProductTitle(item.title) : null

        const processed: SearchResultItem = {
          ...item,
          parsed,
          primaryImage: resolvePrimaryImage(parsed),
        }

        switch (item.object_type) {
          case 'product':
            grouped.products.push(processed)
            break
          case 'category':
            grouped.categories.push(processed)
            break
          case 'blog':
            grouped.pages.push(processed)
            break
          default:
            grouped.pages.push(processed)
        }
      }

      grouped.products.sort((a, b) => b.score - a.score)

      results.value = grouped
    } catch (err: any) {
      if (err?.name === 'AbortError') return
      error.value = err?.message || 'خطا در جستجو'
      results.value = emptyResults()
    } finally {
      pending.value = false
    }
  }

  function debouncedSearch() {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(runSearch, DEBOUNCE_MS)
  }

  function reset() {
    if (debounceTimer) clearTimeout(debounceTimer)
    abortController?.abort()
    query.value = ''
    results.value = emptyResults()
    pending.value = false
    error.value = null
  }

  return {
    query,
    results,
    pending,
    error,
    hasResults,
    isQueryTooShort,
    debouncedSearch,
    runSearch,
    reset,
  }
}