import { computed } from 'vue'
import { useFetch, useRuntimeConfig } from '#app'

export interface StatEntry {
  [key: string]: string
}

export interface HistoryEntry {
  year: number
  year_fa: string
  description: string
  description_fa: string
}

export interface MapPoint {
  name: string
  name_fa: string
  location: string
  description: string
  description_fa: string
  x: number
  y: number
}

export interface TeamMember {
  name: string
  name_fa: string
  role: string
  role_fa: string
  photo_url: string
}

interface AboutContent {
  title: string
  title_fa: string
  summary: string
  summary_fa: string
  about: string
  about_fa: string
  intro: {
    founded: number
    founded_fa: string
    registration_number: string
    headquarters: string
    headquarters_fa: string
    mission: string
    mission_fa: string
  }
  stats: {
    fa: StatEntry[]
    en: StatEntry[]
  }
  history: HistoryEntry[]
  map: MapPoint[]
  team: TeamMember[]
}

interface AboutPageData {
  id: string
  title: string
  slug: string
  summary: string
  content: AboutContent
  cover_image_url: string
  meta_title: string
  meta_description: string
}

interface ApiResponse {
  code: number
  success: boolean
  message: string
  data: AboutPageData
}

export const useAboutCompany = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const { data: response, pending, error, refresh } = useFetch<ApiResponse>(
    `${apiBase}/pages/about-company`,
    { key: 'about-company' }
  )

  const page = computed(() => response.value?.data ?? null)
  const content = computed(() => page.value?.content ?? null)

  const hero = computed(() => ({
    titleFa: content.value?.title_fa || page.value?.title || '',
    summaryFa: content.value?.summary_fa || page.value?.summary || '',
    coverImage: page.value?.cover_image_url || null,
  }))

  const intro = computed(() => ({
    aboutFa: content.value?.about_fa || '',
    foundedFa: content.value?.intro?.founded_fa || '',
    headquartersFa: content.value?.intro?.headquarters_fa || '',
    missionFa: content.value?.intro?.mission_fa || '',
    registrationNumber: content.value?.intro?.registration_number || '',
  }))

  const stats = computed(() => {
    const entries = content.value?.stats?.fa || []
    return entries.map(entry => {
      const [label, value] = Object.entries(entry)[0] || ['', '']
      return { label, value }
    })
  })

  const history = computed(() =>
    [...(content.value?.history || [])].sort((a, b) => a.year - b.year)
  )

  const mapPoints = computed(() => content.value?.map || [])

  const team = computed(() => content.value?.team || [])

  return {
    pending,
    error,
    refresh,
    hero,
    intro,
    stats,
    history,
    mapPoints,
    team,
  }
}