import { useState } from '#app'

export interface CompanyPage {
  id: string
  title: string
  slug: string
  summary: string
  content: {
    title?: string
    title_fa?: string
    about?: string
    about_fa?: string
    intro?: {
      founded: number
      founded_fa: string
      registration_number: string
      headquarters: string
      headquarters_fa: string
      mission: string
      mission_fa: string
    }
    stats?: {
      fa: Record<string, string | number>[]
      en: Record<string, string | number>[]
    }
    history?: {
      year: number
      year_fa: string
      description: string
      description_fa: string
    }[]
    map?: {
      name: string
      name_fa: string
      description: string
      description_fa: string
      x: number
      y: number
    }[]
    team?: {
      name: string;
      name_fa: string;
      role: string;
      role_fa: string;
      photo_url: string;
    }[]
  }
}

export const useCompanyPage = () => {
  const companyPage = useState<CompanyPage | null>('company-page', () => null)
  const loading = useState<boolean>('company-page-loading', () => false)
  const error = useState<string | null>('company-page-error', () => null)

  const fetchCompanyPage = async () => {
    const config = useRuntimeConfig()
    loading.value = true
    error.value = null
    try {
      const response = await $fetch<{ success: boolean; data: CompanyPage }>(`${config.public.apiBase}/pages/about-company`)
      if (response?.success && response.data) {
        const d = response.data
        if (!d.content) d.content = {}
        if (!d.content.intro) d.content.intro = { founded: 0, founded_fa: '', registration_number: '', headquarters: '', headquarters_fa: '', mission: '', mission_fa: '' }
        if (!d.content.stats) d.content.stats = { fa: [], en: [] }
        if (!d.content.history) d.content.history = []
        if (!d.content.map) d.content.map = []
        if (!d.content.team) d.content.team = []
        companyPage.value = d
      }
    } catch (err: any) {
      error.value = err?.data?.message || err?.message || 'خطا در دریافت اطلاعات شرکت'
    } finally {
      loading.value = false
    }
  }

  return { companyPage, loading, error, fetchCompanyPage }
}
