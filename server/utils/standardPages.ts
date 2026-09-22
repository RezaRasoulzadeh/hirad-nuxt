import type { H3Event } from 'h3'
import type {
  PublicStandard,
  StandardDraft,
  StandardEntry,
  StandardPageRecord,
} from '../../app/types/standard'
import {
  buildStandardPagePayload,
  compareStandards,
  isStandardPageSlug,
  normalizeStandardDraft,
  normalizeStandardPage,
  pageSlugFromPublicSlug,
  publicSlugFromPageSlug,
  validateStandardDraft,
} from '../../app/utils/standards'

interface PageApiResponse {
  success?: boolean
  message?: string
  data?: StandardPageRecord | StandardPageRecord[]
}

async function readUpstreamJson(response: Response): Promise<PageApiResponse> {
  const payload = await response.json().catch(() => ({})) as PageApiResponse
  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: payload.message || response.statusText || 'Backend request failed',
      data: payload,
    })
  }
  return payload
}

async function fetchPage(event: H3Event, backendSlug: string): Promise<StandardPageRecord | null> {
  const response = await authenticatedFetch(event, `/pages/${encodeURIComponent(backendSlug)}`)
  if (response.status === 404) return null
  const payload = await readUpstreamJson(response)
  return payload.data && !Array.isArray(payload.data) ? payload.data : null
}

export async function listStandardPages(event: H3Event, publishedOnly: boolean): Promise<StandardEntry[]> {
  const suffix = publishedOnly ? '?is_published=true' : ''
  const response = await authenticatedFetch(event, `/pages/category/all${suffix}`)
  const payload = await readUpstreamJson(response)
  const pages = Array.isArray(payload.data) ? payload.data : []
  const candidates = pages.filter(page => isStandardPageSlug(page.slug))

  const detailedPages = await Promise.all(
    candidates.map(page => fetchPage(event, page.slug as string)),
  )

  return detailedPages
    .flatMap((page) => {
      if (!page || (publishedOnly && page.is_published !== true)) return []
      const standard = normalizeStandardPage(page)
      return standard ? [standard] : []
    })
    .sort(compareStandards)
}

export async function getStandardPage(
  event: H3Event,
  publicSlug: string,
  publishedOnly: boolean,
): Promise<StandardEntry | null> {
  const slug = publicSlug.trim().toLowerCase()
  const page = await fetchPage(event, pageSlugFromPublicSlug(slug))
  if (!page || (publishedOnly && page.is_published !== true)) return null
  return normalizeStandardPage(page)
}

export function toPublicStandard(standard: StandardEntry): PublicStandard {
  const { id: _id, backend_slug: _backendSlug, is_published: _published, created_at: _created, ...publicFields } = standard
  return publicFields
}

export function validatedStandardBody(body: unknown): StandardDraft {
  const draft = normalizeStandardDraft(body)
  const errors = validateStandardDraft(draft)
  if (errors.length) {
    throw createError({
      statusCode: 422,
      statusMessage: errors[0],
      data: { success: false, message: errors[0], errors },
    })
  }
  return draft
}

export async function createStandardPage(event: H3Event, draft: StandardDraft) {
  const response = await authenticatedFetch(event, '/pages', {
    method: 'POST',
    body: buildStandardPagePayload(draft),
  })
  return readUpstreamJson(response)
}

export async function updateStandardPage(
  event: H3Event,
  currentPublicSlug: string,
  draft: StandardDraft,
) {
  const response = await authenticatedFetch(
    event,
    `/pages/${encodeURIComponent(pageSlugFromPublicSlug(currentPublicSlug))}`,
    { method: 'PUT', body: buildStandardPagePayload(draft) },
  )
  return readUpstreamJson(response)
}

export async function deleteStandardPage(event: H3Event, publicSlug: string) {
  const response = await authenticatedFetch(
    event,
    `/pages/${encodeURIComponent(pageSlugFromPublicSlug(publicSlug))}`,
    { method: 'DELETE' },
  )
  return readUpstreamJson(response)
}

export function assertPublicStandardSlug(value: string | undefined): string {
  const slug = (value || '').trim().toLowerCase()
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || publicSlugFromPageSlug(pageSlugFromPublicSlug(slug)) !== slug) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid standard identifier' })
  }
  return slug
}
