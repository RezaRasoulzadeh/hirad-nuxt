<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">مدیریت مقالات وبلاگ</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">ایجاد، ویرایش و حذف مقالات منتشر شده در وبلاگ.</p>
      </div>
      <NuxtLink to="/dashboard/blog/new" class="btn btn-primary font-bold px-6 h-12 rounded-xl text-sm">
        افزودن مقاله جدید
      </NuxtLink>
    </div>

    <div v-if="status === 'pending'" class="space-y-3">
      <div v-for="n in 4" :key="n" class="h-24 rounded-xl bg-base-100 border border-base-200 animate-pulse"></div>
    </div>

    <div
      v-else-if="error"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm"
    >
      <div class="flex items-center justify-center size-14 rounded-full bg-error/10">
        <WifiOff class="size-6 text-error" />
      </div>
      <div>
        <p class="font-bold text-base-content">خطا در دریافت اطلاعات</p>
        <p class="text-sm text-base-content/50 mt-1">مقالات وبلاگ بارگذاری نشدند. لطفاً دوباره تلاش کنید.</p>
      </div>
      <button class="btn btn-sm btn-error btn-soft font-bold" @click="() => refresh()">تلاش مجدد</button>
    </div>

    <div
      v-else-if="!blogPosts.length"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm"
    >
      <div class="flex items-center justify-center size-14 rounded-full bg-base-200">
        <SearchX class="size-6 text-base-content/40" />
      </div>
      <div>
        <p class="font-bold text-base-content">مقاله‌ای یافت نشد</p>
        <p class="text-sm text-base-content/50 mt-1">هنوز هیچ مقاله‌ای در وبلاگ ثبت نشده است.</p>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="post in blogPosts"
        :key="post.id"
        class="flex items-center justify-between gap-4 p-4 bg-base-100 rounded-xl border border-base-200"
      >
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <img
            v-if="post.cover_image_url"
            :src="resolveImage(post.cover_image_url)"
            :alt="post.meta_title ?? post.title"
            class="size-16 object-cover rounded-lg shrink-0"
          />
          <div class="min-w-0">
            <h2 class="font-semibold text-base-content truncate">{{ post.title }}</h2>
            <p class="text-xs text-base-content/50 truncate">{{ post.meta_title }}</p>
            <p class="text-xs text-base-content/40 mt-0.5 truncate text-left font-mono" dir="ltr">{{ post.slug }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span
                class="badge badge-sm font-medium"
                :class="post.is_published ? 'badge-success badge-soft' : 'badge-error badge-soft'"
              >
                {{ post.is_published ? 'منتشر شده' : 'منتشر نشده' }}
              </span>
              <span class="text-xs text-base-content/40">
                آخرین بروزرسانی: {{ formatDate(post.updated_at) }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            class="btn btn-sm btn-square btn-ghost text-info"
            :disabled="duplicatingSlug === post.slug"
            @click="duplicateBlogPost(post.slug)"
          >
            <span v-if="duplicatingSlug === post.slug" class="loading loading-spinner loading-xs"></span>
            <Copy v-else class="size-4" />
          </button>
          <NuxtLink :to="`/dashboard/blog/${post.slug}`" class="btn btn-sm btn-square btn-ghost text-base-content/60">
            <PenBox class="size-4" />
          </NuxtLink>
          <button
            class="btn btn-sm btn-square btn-ghost text-error"
            :disabled="deletingSlug === post.slug"
            @click="removeBlogPost(post.slug)"
          >
            <span v-if="deletingSlug === post.slug" class="loading loading-spinner loading-xs"></span>
            <Trash v-else class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Copy, PenBox, Trash, WifiOff, SearchX } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

interface BlogItem {
  id: string
  title: string
  slug: string
  summary: string | null
  cover_image_url: string | null
  is_published: boolean
  updated_at: string
  meta_title: string | null
  meta_description: string | null
}

interface BlogListResponse {
  data: BlogItem[]
  success: boolean
  message?: string
}

const config = useRuntimeConfig()
const { success: toastSuccess, error: toastError } = useToast()

const { data: blogResponse, status, error, refresh } = await useFetch<BlogListResponse>('/api/dashboard/blog', {
  lazy: true
})

const blogPosts = computed<BlogItem[]>(() => blogResponse.value?.data ?? [])

const deletingSlug = ref<string | null>(null)
const duplicatingSlug = ref<string | null>(null)

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' })
}

function resolveImage(url: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = config.public.apiBase
  return `${base}/${url.replace(/^\//, '')}`
}

async function removeBlogPost(slug: string): Promise<void> {
  if (!window.confirm(`آیا از حذف مقاله «${slug}» اطمینان دارید؟`)) return

  deletingSlug.value = slug
  try {
    await $fetch(`/api/dashboard/pages/${encodeURIComponent(slug)}`, {
      method: 'DELETE'
    })
    toastSuccess('مقاله با موفقیت حذف شد.')
    await refresh()
  } catch (err) {
    toastError('خطا در حذف مقاله.')
  } finally {
    deletingSlug.value = null
  }
}

async function duplicateBlogPost(slug: string): Promise<void> {
  duplicatingSlug.value = slug
  try {
    const response = await $fetch<any>(`/api/dashboard/pages/${encodeURIComponent(slug)}`)
    if (!response?.success || !response.data) throw new Error()

    const item = response.data
    const originalContent = item.content ? (typeof item.content === 'string' ? JSON.parse(item.content) : item.content) : { body: [], title: '', title_fa: '', summary: '', summary_fa: '' }
    
    const newPayload = {
      category_id: "b2139ae7-e352-441e-99b6-910114d2f9a7",
      title: `${item.title || ''} (کپی)`,
      slug: `${item.slug || 'post'}-copy-${Date.now()}`,
      summary: item.summary || '',
      content: originalContent,
      is_published: false,
      cover_image_url: item.cover_image_url || '',
      meta_title: item.meta_title ? `${item.meta_title} (Copy)` : '',
      meta_description: item.meta_description || ''
    }

    await $fetch('/api/dashboard/pages', {
      method: 'POST',
      body: newPayload
    })

    toastSuccess('مقاله با موفقیت کپی شد.')
    await refresh()
  } catch (err) {
    toastError('خطا در کپی کردن مقاله.')
  } finally {
    duplicatingSlug.value = null
  }
}
</script>