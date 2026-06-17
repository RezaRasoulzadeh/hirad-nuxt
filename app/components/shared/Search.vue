<template>
  <div ref="containerRef" class="relative flex items-center justify-end h-10 w-10 shrink-0">
    <div
      class="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-xl bg-base-100 overflow-hidden transition-[width,border-color] duration-300 ease-in-out absolute left-0 top-0"
      :class="isOpen ? 'w-44 sm:w-64 border-primary/50' : 'w-10 border-transparent bg-transparent'"
    >
      <button
        type="button"
        class="btn btn-ghost btn-circle btn-sm size-10 shrink-0"
        :aria-label="isOpen ? 'بستن جستجو' : 'باز کردن جستجو'"
        @click="isOpen ? null : openSearch()"
      >
        <Search class="size-5" />
      </button>

      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="جستجو..."
        class="input input-sm border-0 focus:outline-none w-full bg-transparent px-1 text-sm transition-opacity duration-200"
        :class="isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
        dir="rtl"
        @input="debouncedSearch"
        @keydown.esc="closeSearch"
      />

      <button
        v-if="isOpen"
        type="button"
        class="btn btn-ghost btn-sm btn-circle size-8 shrink-0 text-neutral-400 hover:text-base-content mr-1"
        aria-label="بستن جستجو"
        @click="closeSearch"
      >
        <X class="size-4" />
      </button>
    </div>

    <div
      class="absolute left-0 top-full mt-2 transition-all duration-200 ease-out origin-top-left z-50"
      :class="isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'"
      dir="rtl"
    >
      <div class="w-88 max-w-[90vw]">
        <div
          v-if="isOpen && (hasResults || showEmptyState || error)"
          class="mt-1 bg-base-100 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg max-h-112 overflow-y-auto p-3"
        >
          <div v-if="error" class="flex flex-col items-center gap-2 py-8 text-center px-4">
            <div class="bg-error/10 rounded-full p-3">
              <WifiOff class="size-5 text-error" />
            </div>
            <p class="text-sm text-base-content/60">{{ error }}</p>
          </div>

          <template v-else>
            <section v-if="results.products.length" class="mb-3">
              <div class="flex items-center justify-between bg-primary/5 px-3 py-1.5 rounded-btn mb-2">
                <span class="text-xs font-bold text-primary">محصولات</span>
                <span class="text-xs text-primary/70">({{ results.products.length.toLocaleString('fa-IR') }})</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <NuxtLink
                  v-for="item in results.products"
                  :key="item.object_id"
                  :to="item.url"
                  class="flex gap-3 p-2 rounded-btn border border-transparent hover:border-primary/30 hover:bg-base-200/50 transition-colors"
                  @click="closeSearch"
                >
                  <div class="shrink-0">
                    <img
                      v-if="item.primaryImage"
                      :src="resolveAssetUrl(item.primaryImage)"
                      :alt="getLocalizedField(item.parsed, 'name', true)"
                      class="w-12 h-12 object-cover rounded-md border border-base-300"
                    />
                    <div v-else class="w-12 h-12 bg-base-200 rounded-md flex items-center justify-center">
                      <Search class="size-4 text-base-content/30" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-sm text-base-content truncate">
                      {{ getLocalizedField(item.parsed, 'name', true) }}
                    </h3>
                    <p v-if="item.category" class="text-xs text-base-content/50 mt-0.5">
                      دسته‌بندی: {{ item.category }}
                    </p>
                    <p
                      v-if="getLocalizedField(item.parsed, 'description', true)"
                      class="text-xs text-base-content/50 mt-0.5 line-clamp-2"
                    >
                      {{ getLocalizedField(item.parsed, 'description', true) }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </section>

            <section v-if="results.categories.length" class="mb-3">
              <div class="flex items-center justify-between bg-success/5 px-3 py-1.5 rounded-btn mb-2">
                <span class="text-xs font-bold text-success">دسته‌بندی‌ها</span>
                <span class="text-xs text-success/70">({{ results.categories.length.toLocaleString('fa-IR') }})</span>
              </div>
              <ul class="flex flex-col gap-1">
                <li v-for="item in results.categories" :key="item.object_id">
                  <NuxtLink
                    :to="item.url"
                    class="block py-2 px-3 rounded-btn text-sm text-base-content hover:bg-base-200/50 transition-colors"
                    @click="closeSearch"
                  >
                    {{ getLocalizedField(item.parsed, 'name', true) || item.title }}
                  </NuxtLink>
                </li>
              </ul>
            </section>

            <section v-if="results.pages.length">
              <div class="flex items-center justify-between bg-secondary/5 px-3 py-1.5 rounded-btn mb-2">
                <span class="text-xs font-bold text-secondary">مقالات</span>
                <span class="text-xs text-secondary/70">({{ results.pages.length.toLocaleString('fa-IR') }})</span>
              </div>
              <ul class="flex flex-col gap-1">
                <li v-for="item in results.pages" :key="item.object_id">
                  <NuxtLink
                    :to="item.url"
                    class="block py-2 px-3 rounded-btn text-sm text-base-content hover:bg-base-200/50 transition-colors"
                    @click="closeSearch"
                  >
                    {{ item.title }}
                  </NuxtLink>
                </li>
              </ul>
            </section>

            <div v-if="showEmptyState" class="flex flex-col items-center gap-2 py-8 text-center px-4">
              <div class="bg-base-200 rounded-full p-3">
                <SearchX class="size-5 text-base-content/40" />
              </div>
              <p class="text-sm text-base-content/50">نتیجه‌ای یافت نشد</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Search, SearchX, WifiOff, X } from 'lucide-vue-next'
import { useGlobalSearch, getLocalizedField } from '~/composables/useSearch'
import { resolveAssetUrl } from '~/utils/resolveAssetUrl'

const { query, results, pending, error, hasResults, isQueryTooShort, debouncedSearch, reset } = useGlobalSearch()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const showEmptyState = computed(() =>
  !pending.value && !error.value && !isQueryTooShort.value && !hasResults.value && query.value.trim().length > 0
)

function openSearch() {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

function closeSearch() {
  isOpen.value = false
  reset()
}

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>