<script setup lang="ts">
const { locale } = useI18n()
const config = useRuntimeConfig()
const isRTL = computed(() => locale.value === 'fa')
const API_BASE_URL = config.public.baseURL as string

const showSearch = ref(false)
const searchQuery = ref('')
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchContainerRef = ref<HTMLElement | null>(null)

interface ParsedProductData {
  name?: string; name_fa?: string
  description?: string; description_fa?: string
  features?: Record<string, string>[]
  images?: { image_url: string; is_primary: boolean; sort_order: number }[]
  primaryImage?: string
}

interface SearchResult {
  title: string; url: string; score: number
  object_type: string; object_id: string
  category?: string; parsedData?: ParsedProductData | null
}

interface CategorizedResults {
  products: SearchResult[]
  categories: SearchResult[]
  pages: SearchResult[]
}

const searchResults = ref<CategorizedResults>({ products: [], categories: [], pages: [] })
const hasResults = computed(() =>
  searchResults.value.products.length > 0 ||
  searchResults.value.categories.length > 0 ||
  searchResults.value.pages.length > 0
)

function parseProductData(raw: string): ParsedProductData | null {
  try {
    const parsed = JSON.parse(raw)
    const sorted = parsed.images?.sort((a: any, b: any) => a.sort_order - b.sort_order) ?? []
    const primary = sorted.find((i: any) => i.is_primary) ?? sorted[0]
    return { ...parsed, primaryImage: primary?.image_url ?? '' }
  } catch { return null }
}

function getLocalizedText(data: ParsedProductData | null, field: 'name' | 'description'): string {
  if (!data) return ''
  return isRTL.value
    ? ((data[`${field}_fa` as keyof ParsedProductData] ?? data[field]) as string ?? '')
    : ((data[field] ?? data[`${field}_fa` as keyof ParsedProductData]) as string ?? '')
}

function toggleSearchInput() {
  showSearch.value = !showSearch.value
  if (showSearch.value) nextTick(() => searchInputRef.value?.focus())
  else resetSearch()
}

function resetSearch() {
  searchQuery.value = ''
  searchResults.value = { products: [], categories: [], pages: [] }
}

const performSearch = useDebounceFn(async () => {
  if (searchQuery.value.length < 3) {
    searchResults.value = { products: [], categories: [], pages: [] }
    return
  }
  try {
    const data = await $fetch<{ data: any[] }>(
      `${API_BASE_URL}/search?q=${encodeURIComponent(searchQuery.value)}&limit=20`
    )
    const grouped: CategorizedResults = { products: [], categories: [], pages: [] }
    for (const item of data.data) {
      const processed: SearchResult = {
        ...item,
        parsedData: typeof item.title === 'string' && item.title.startsWith('{')
          ? parseProductData(item.title) : null
      }
      if (item.object_type === 'product') grouped.products.push(processed)
      else if (item.object_type === 'category') grouped.categories.push(processed)
      else grouped.pages.push(processed)
    }
    grouped.products.sort((a, b) => b.score - a.score)
    searchResults.value = grouped
  } catch (e) {
    console.error('Search error:', e)
    searchResults.value = { products: [], categories: [], pages: [] }
  }
}, 300)

onClickOutside(searchContainerRef, () => {
  showSearch.value = false
  resetSearch()
})
</script>

<template>
  <div class="relative flex items-center gap-2" ref="searchContainerRef" :class="{ 'flex-row-reverse': isRTL }">
    <UIcon name="i-lucide-search" class="cursor-pointer hover:text-brand w-5 h-5" @click="toggleSearchInput" />

    <div class="transition-all duration-300 ease-in-out overflow-hidden"
      :class="[showSearch ? 'w-56 opacity-100' : 'w-0 opacity-0', isRTL ? 'ml-2' : 'mr-2']">
      <input type="text" ref="searchInputRef" v-model="searchQuery" @input="performSearch"
        :placeholder="$t('search.placeHolder')"
        class="w-full h-10 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:border-brand transition-colors"
        :class="isRTL ? 'text-right' : 'text-left'"
        :dir="isRTL ? 'rtl' : 'ltr'" />

      <div v-if="showSearch && hasResults"
        class="absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 max-h-96 overflow-y-auto"
        :class="isRTL ? 'left-0' : 'right-0'">

        <div v-if="searchResults.products.length" class="mb-4">
          <div class="flex justify-between items-center bg-brand/5 px-4 py-2 rounded-lg mb-3"
            :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
            <p class="text-sm font-semibold text-brand-dark">{{ $t('search.product') }}</p>
            <p class="text-xs text-brand">({{ searchResults.products.length }})</p>
          </div>
          <div class="space-y-2">
            <div v-for="product in searchResults.products" :key="product.object_id"
              class="border border-gray-100 rounded-lg hover:border-brand transition-colors">
              <NuxtLink :to="product.url" class="block p-3 rounded-lg">
                <div class="flex gap-3" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
                  <div class="flex-shrink-0">
                    <img v-if="product.parsedData?.primaryImage"
                      :src="API_BASE_URL + product.parsedData.primaryImage"
                      :alt="getLocalizedText(product.parsedData, 'name')"
                      class="w-12 h-12 object-cover rounded-md border" />
                    <div v-else class="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <UIcon name="i-lucide-search" class="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 truncate text-sm"
                      :class="isRTL ? 'text-right' : 'text-left'">
                      {{ getLocalizedText(product.parsedData, 'name') }}
                    </h3>
                    <p class="text-xs text-gray-600 mt-1" :class="isRTL ? 'text-right' : 'text-left'">
                      {{ $t('search.category') }}: {{ product.category }}
                    </p>
                    <p v-if="getLocalizedText(product.parsedData, 'description')"
                      class="text-xs text-gray-500 mt-1 line-clamp-2"
                      :class="isRTL ? 'text-right' : 'text-left'">
                      {{ getLocalizedText(product.parsedData, 'description') }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-if="searchResults.categories.length" class="mb-4">
          <div class="flex justify-between items-center bg-green-50 px-4 py-2 rounded-lg mb-2"
            :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
            <p class="text-sm font-semibold text-green-800">{{ $t('search.category') }}</p>
            <p class="text-xs text-green-600">({{ searchResults.categories.length }})</p>
          </div>
          <ul class="space-y-1">
            <li v-for="result in searchResults.categories" :key="result.object_id">
              <NuxtLink :to="result.url"
                class="block py-2 px-3 hover:bg-gray-100 rounded-md text-sm"
                :class="isRTL ? 'text-right' : 'text-left'">
                {{ getLocalizedText(result.parsedData, 'name') || result.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="searchResults.pages.length">
          <div class="flex justify-between items-center bg-purple-50 px-4 py-2 rounded-lg mb-2"
            :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
            <p class="text-sm font-semibold text-purple-800">{{ $t('search.page') }}</p>
            <p class="text-xs text-purple-600">({{ searchResults.pages.length }})</p>
          </div>
          <ul class="space-y-1">
            <li v-for="result in searchResults.pages" :key="result.object_id">
              <NuxtLink :to="result.url"
                class="block py-2 px-3 hover:bg-gray-100 rounded-md text-sm"
                :class="isRTL ? 'text-right' : 'text-left'">
                {{ getLocalizedText(result.parsedData, 'name') || result.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="searchQuery.length >= 3 && !hasResults"
          class="text-center py-4 text-gray-500 text-sm"
          :class="isRTL ? 'text-right' : 'text-left'">
          {{ $t('search.noResults') }}
        </div>
      </div>
    </div>
  </div>
</template>