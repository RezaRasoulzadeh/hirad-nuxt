import { ref } from 'vue'

export interface PageData {
  id: string
  title: string
  slug: string
  summary: string
  content: {
    Certificates: Certificate[]
  }
  meta_title: string
  meta_description: string
}
export interface Certificate {
  title: string
  description: string
  title_fa: string
  description_fa: string
  image: string
  showOnHomepage?: boolean
  order: number
}

export const useCertificates = () => {
  const config = useRuntimeConfig()
  const certificatePage = ref<PageData | null>(null)
  const error = ref<any>(null)

  const fetchCertificates = async () => {
    try {
      const encodedSlug = encodeURIComponent('گواهی-ها')
      const response = await $fetch<{ data: PageData }>(`${config.public.apiBase}/pages/${encodedSlug}`)
      
      if (response?.data?.content?.Certificates) {
        response.data.content.Certificates.sort((a, b) => a.order - b.order)
        certificatePage.value = response.data
      }
    } catch (err) {
      error.value = err
    }
  }

  return {
    certificatePage,
    error,
    fetchCertificates
  }
}