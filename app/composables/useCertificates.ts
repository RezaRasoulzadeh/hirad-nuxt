import { useState } from '#app'

export interface CertificatePageData {
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
  const certificatePage = useState<CertificatePageData | null>('certificate-page', () => null)
  const error = useState<string | null>('certificate-page-error', () => null)

  const fetchCertificates = async () => {
    try {
      error.value = null
      
      const response = await $fetch<any>('/api/pages/گواهی-ها')
      
      const pageData = response?.data || response

      if (pageData?.content?.Certificates) {
        pageData.content.Certificates.sort((a: Certificate, b: Certificate) => (a.order || 0) - (b.order || 0))
        certificatePage.value = pageData
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'خطا در دریافت گواهی‌ها'
      console.error('Failed to fetch certificates:', err)
    }
  }

  return {
    certificatePage,
    error,
    fetchCertificates
  }
}
