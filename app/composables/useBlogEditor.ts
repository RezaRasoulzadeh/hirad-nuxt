import { ref, computed, watch } from 'vue'

export type BlockType = 'code' | 'link' | 'video' | 'image' | 'paragraph' | 'heading' | 'quote' | 'list'

export interface ListItem {
  text: string
  text_fa: string
}

export interface Block {
  type: BlockType
  level: number
  text: string
  text_fa: string
  src: string
  alt: string
  caption: string
  author: string
  style: string
  items: ListItem[]
  language: string
  content: string
  url: string
}

export interface BlogContent {
  body: Block[]
  title: string
  title_fa: string
  summary: string
  summary_fa: string
}

export interface BlogFormData {
  category_id: string
  title: string
  slug: string
  summary: string
  content: BlogContent
  is_published: boolean
  cover_image_url: string
  meta_title: string
  meta_description: string
}

export async function useBlogEditor() {
  const route = useRoute()
  const router = useRouter()
  const config = useRuntimeConfig()
  const { success: toastSuccess, error: toastError } = useToast()

  const previewMode = ref(false)
  const saving = ref(false)

  const isEditMode = computed(() => !!route.params.slug && route.params.slug !== 'new')

  const initialFormData: BlogFormData = {
    category_id: "b2139ae7-e352-441e-99b6-910114d2f9a7",
    title: '',
    slug: '',
    summary: '',
    content: { body: [], title: '', title_fa: '', summary: '', summary_fa: '' },
    is_published: false,
    cover_image_url: '',
    meta_title: '',
    meta_description: '',
  }

  const formData = ref<BlogFormData>({ ...initialFormData })

  const { data: apiResponse, status, error, refresh } = await useFetch<any>(
    () => `/api/dashboard/pages/${encodeURIComponent(route.params.slug as string)}`,
    {
      lazy: true,
      immediate: isEditMode.value,
      transform: (response) => {
        if (response?.success && response.data) {
          const item = response.data
          const rawContent = item.content ? (typeof item.content === 'string' ? JSON.parse(item.content) : item.content) : null
          
          const normalizedBody = Array.isArray(rawContent?.body) 
            ? rawContent.body.map((b: any) => ({
                type: b.type || 'paragraph',
                level: b.level ?? 2,
                text: b.text || '',
                text_fa: b.text_fa || '',
                src: b.src || '',
                alt: b.alt || '',
                caption: b.caption || '',
                author: b.author || '',
                style: b.style || 'unordered',
                items: Array.isArray(b.items) ? b.items.map((i: any) => ({ text: i.text || '', text_fa: i.text_fa || '' })) : [],
                language: b.language || '',
                content: b.content || '',
                url: b.url || ''
              }))
            : []

          return {
            category_id: "b2139ae7-e352-441e-99b6-910114d2f9a7",
            title: item.title || '',
            slug: item.slug || '',
            summary: item.summary || '',
            content: {
              body: normalizedBody,
              title: rawContent?.title || '',
              title_fa: rawContent?.title_fa || '',
              summary: rawContent?.summary || '',
              summary_fa: rawContent?.summary_fa || ''
            },
            is_published: !!item.is_published,
            cover_image_url: item.cover_image_url || '',
            meta_title: item.meta_title || '',
            meta_description: item.meta_description || ''
          }
        }
        return null
      }
    }
  )

  watch(apiResponse, (newVal) => {
    if (newVal && isEditMode.value) {
      formData.value = { ...newVal }
    }
  }, { immediate: true })

  async function saveData(): Promise<void> {
    if (!formData.value.title || !formData.value.slug) {
      toastError('لطفاً فیلدهای اجباری عنوان و نامک پیوند را تکمیل کنید.')
      return
    }

    saving.value = true
    try {
      const url = isEditMode.value 
        ? `/api/dashboard/pages/${encodeURIComponent(route.params.slug as string)}` 
        : '/api/dashboard/pages'
      
      const method = isEditMode.value ? 'PUT' : 'POST'

      const processedPayload = {
        ...formData.value,
        category_id: "b2139ae7-e352-441e-99b6-910114d2f9a7",
        content: {
          ...formData.value.content,
          body: formData.value.content.body.filter(block => block.type)
        }
      }

      const response = await $fetch<any>(url, {
        method,
        body: processedPayload
      })

      if (response?.success) {
        toastSuccess('اطلاعات مطلب بلاگ با موفقیت ذخیره شد.')
        router.push('/dashboard/blog')
      } else {
        throw new Error()
      }
    } catch (e) {
      toastError('خطا در ثبت اطلاعات در شبکه سرور رخ داده است.')
    } finally {
      saving.value = false
    }
  }

  function addBlock(type: BlockType): void {
    const newBlock: Block = {
      type,
      level: 2,
      text: '',
      text_fa: '',
      src: '',
      alt: '',
      caption: '',
      author: '',
      style: type === 'list' ? 'unordered' : '',
      items: type === 'list' ? [{ text: '', text_fa: '' }] : [],
      language: '',
      content: '',
      url: ''
    }
    formData.value.content.body = [...formData.value.content.body, newBlock]
  }

  function removeBlock(index: number): void {
    if (!window.confirm('آیا از حذف این بلوک اطمینان دارید؟')) return
    const blocks = [...formData.value.content.body]
    blocks.splice(index, 1)
    formData.value.content.body = blocks
  }

  function moveBlockUp(index: number): void {
    if (index > 0) {
      const blocks = [...formData.value.content.body]
      const target = blocks[index]
      const prev = blocks[index - 1]
      if (target && prev) {
        blocks[index] = prev
        blocks[index - 1] = target
        formData.value.content.body = blocks
      }
    }
  }

  function moveBlockDown(index: number): void {
    const blocks = [...formData.value.content.body]
    if (index < blocks.length - 1) {
      const target = blocks[index]
      const next = blocks[index + 1]
      if (target && next) {
        blocks[index] = next
        blocks[index + 1] = target
        formData.value.content.body = blocks
      }
    }
  }

  function addListItem(block: Block): void {
    block.items = [...block.items, { text: '', text_fa: '' }]
  }

  function removeListItem(block: Block, itemIndex: number): void {
    if (block.items.length > 1) {
      block.items = block.items.filter((_, index) => index !== itemIndex)
    }
  }

  function resolveAssetUrl(src: string): string {
    if (!src) return ''
    if (src.startsWith('http://') || src.startsWith('https://')) return src
    const base = config.public.apiBase.replace(/\/api$/, '')
    return `${base}/${src.replace(/^\//, '')}`
  }

  return {
    formData,
    previewMode,
    saving,
    status,
    error,
    isEditMode,
    refresh,
    saveData,
    addBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    addListItem,
    removeListItem,
    resolveAssetUrl
  }
}