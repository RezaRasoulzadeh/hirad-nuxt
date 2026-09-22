import type {
  StandardDraft,
  StandardEntry,
  StandardPageRecord,
  StandardResourceKind,
  StandardResourceLink,
} from '../types/standard'

export const STANDARD_PAGE_PREFIX = 'standard-'
export const STANDARD_RESOURCE_TYPE = 'engineering_standard'
export const STANDARD_SCHEMA_VERSION = 1

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const allowedResourceKinds = new Set<StandardResourceKind>(['official', 'document', 'reference'])

export function emptyStandardDraft(): StandardDraft {
  return {
    slug: '',
    organization: '',
    designation: '',
    title_fa: '',
    title_en: '',
    short_description_fa: '',
    short_description_en: '',
    content_fa: '',
    content_en: '',
    category_fa: '',
    category_en: '',
    edition: '',
    publication_year: null,
    official_url: '',
    resources: [],
    is_published: false,
    is_featured: false,
    sort_order: null,
    meta_title_fa: '',
    meta_title_en: '',
    meta_description_fa: '',
    meta_description_en: '',
  }
}

export function standardSlugFromDesignation(value: unknown): string {
  return text(value, 160)
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function text(value: unknown, maxLength = 30_000): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function nullableNumber(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isInteger(parsed) ? parsed : null
}

function isSafeUrl(value: string, allowMediaPath = false): boolean {
  if (!value) return true
  if (allowMediaPath && value.startsWith('/uploads/')) return true
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function normalizeResources(value: unknown, discardUnsafe = true): StandardResourceLink[] {
  if (!Array.isArray(value)) return []
  return value.slice(0, 20).flatMap((item, index) => {
    if (!item || typeof item !== 'object') return []
    const candidate = item as Record<string, unknown>
    const url = text(candidate.url, 2_000)
    const kind = text(candidate.kind, 20) as StandardResourceKind
    if (discardUnsafe && (!url || !isSafeUrl(url, true))) return []
    return [{
      id: text(candidate.id, 100) || `resource-${index}`,
      label_fa: text(candidate.label_fa, 160),
      label_en: text(candidate.label_en, 160),
      url,
      kind: allowedResourceKinds.has(kind) ? kind : 'reference',
    }]
  })
}

function parseContent(value: unknown): Record<string, unknown> | null {
  if (!value) return null
  if (typeof value === 'object') return value as Record<string, unknown>
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed as Record<string, unknown> : null
  } catch {
    return null
  }
}

export function publicSlugFromPageSlug(slug: string): string {
  return slug.startsWith(STANDARD_PAGE_PREFIX) ? slug.slice(STANDARD_PAGE_PREFIX.length) : ''
}

export function pageSlugFromPublicSlug(slug: string): string {
  return `${STANDARD_PAGE_PREFIX}${slug.trim().toLowerCase()}`
}

export function isStandardPageSlug(slug: unknown): slug is string {
  return typeof slug === 'string' && slug.startsWith(STANDARD_PAGE_PREFIX)
}

export function normalizeStandardPage(page: StandardPageRecord): StandardEntry | null {
  if (!isStandardPageSlug(page.slug)) return null
  const content = parseContent(page.content)
  if (!content || content.resource_type !== STANDARD_RESOURCE_TYPE) return null

  const slug = publicSlugFromPageSlug(page.slug)
  const entry: StandardEntry = {
    ...emptyStandardDraft(),
    id: text(page.id, 100) || page.slug,
    backend_slug: page.slug,
    slug,
    organization: text(content.organization, 80),
    designation: text(content.designation, 160),
    title_fa: text(content.title_fa, 300) || text(page.title, 300),
    title_en: text(content.title_en, 300),
    short_description_fa: text(content.short_description_fa, 600) || text(page.summary, 600),
    short_description_en: text(content.short_description_en, 600),
    content_fa: text(content.content_fa),
    content_en: text(content.content_en),
    category_fa: text(content.category_fa, 120),
    category_en: text(content.category_en, 120),
    edition: text(content.edition, 120),
    publication_year: nullableNumber(content.publication_year),
    official_url: isSafeUrl(text(content.official_url, 2_000)) ? text(content.official_url, 2_000) : '',
    resources: normalizeResources(content.resources),
    is_published: page.is_published === true,
    is_featured: content.is_featured === true,
    sort_order: nullableNumber(content.sort_order),
    meta_title_fa: text(page.meta_title, 300),
    meta_title_en: text(content.meta_title_en, 300),
    meta_description_fa: text(page.meta_description, 600),
    meta_description_en: text(content.meta_description_en, 600),
    created_at: typeof page.created_at === 'string' ? page.created_at : null,
    updated_at: typeof page.updated_at === 'string' ? page.updated_at : null,
  }

  if (!entry.slug || !entry.organization || !entry.designation || !entry.title_fa || !entry.category_fa) {
    return null
  }
  return entry
}

export function normalizeStandardDraft(value: unknown): StandardDraft {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const designation = text(input.designation, 160)
  return {
    ...emptyStandardDraft(),
    slug: text(input.slug, 160).toLowerCase() || standardSlugFromDesignation(designation),
    organization: text(input.organization, 80),
    designation,
    title_fa: text(input.title_fa, 300),
    title_en: text(input.title_en, 300),
    short_description_fa: text(input.short_description_fa, 600),
    short_description_en: text(input.short_description_en, 600),
    content_fa: text(input.content_fa),
    content_en: text(input.content_en),
    category_fa: text(input.category_fa, 120),
    category_en: text(input.category_en, 120),
    edition: text(input.edition, 120),
    publication_year: nullableNumber(input.publication_year),
    official_url: text(input.official_url, 2_000),
    resources: normalizeResources(input.resources, false),
    is_published: input.is_published === true,
    is_featured: input.is_featured === true,
    sort_order: nullableNumber(input.sort_order),
    meta_title_fa: text(input.meta_title_fa, 300),
    meta_title_en: text(input.meta_title_en, 300),
    meta_description_fa: text(input.meta_description_fa, 600),
    meta_description_en: text(input.meta_description_en, 600),
  }
}

export function validateStandardDraft(draft: StandardDraft): string[] {
  const errors: string[] = []
  if (!draft.slug) errors.push('نامک پیوند الزامی است.')
  else if (!slugPattern.test(draft.slug)) errors.push('نامک فقط می‌تواند شامل حروف کوچک انگلیسی، عدد و خط تیره باشد.')
  if (!draft.organization) errors.push('سازمان استاندارد الزامی است.')
  if (!draft.designation) errors.push('کد یا شناسه استاندارد الزامی است.')
  if (!draft.title_fa) errors.push('عنوان فارسی الزامی است.')
  if (!draft.short_description_fa) errors.push('توضیح کوتاه فارسی الزامی است.')
  if (!draft.category_fa) errors.push('موضوع فارسی الزامی است.')
  if (draft.publication_year !== null && (draft.publication_year < 1800 || draft.publication_year > 2200)) {
    errors.push('سال انتشار باید بین ۱۸۰۰ و ۲۲۰۰ باشد.')
  }
  if (draft.sort_order !== null && draft.sort_order < 0) errors.push('ترتیب نمایش نمی‌تواند منفی باشد.')
  if (!isSafeUrl(draft.official_url)) errors.push('نشانی منبع رسمی باید با http یا https آغاز شود.')
  draft.resources.forEach((resource, index) => {
    if (!resource.label_fa) errors.push(`عنوان فارسی منبع ${index + 1} الزامی است.`)
    if (!resource.url || !isSafeUrl(resource.url, true)) errors.push(`نشانی منبع ${index + 1} معتبر نیست.`)
  })
  return errors
}

export function buildStandardPagePayload(draft: StandardDraft) {
  return {
    category_id: null,
    title: draft.title_fa,
    slug: pageSlugFromPublicSlug(draft.slug),
    summary: draft.short_description_fa,
    content: {
      resource_type: STANDARD_RESOURCE_TYPE,
      schema_version: STANDARD_SCHEMA_VERSION,
      organization: draft.organization,
      designation: draft.designation,
      title_fa: draft.title_fa,
      title_en: draft.title_en || null,
      short_description_fa: draft.short_description_fa,
      short_description_en: draft.short_description_en || null,
      content_fa: draft.content_fa || null,
      content_en: draft.content_en || null,
      category_fa: draft.category_fa,
      category_en: draft.category_en || null,
      edition: draft.edition || null,
      publication_year: draft.publication_year,
      official_url: draft.official_url || null,
      resources: draft.resources,
      is_featured: draft.is_featured,
      sort_order: draft.sort_order,
      meta_title_en: draft.meta_title_en || null,
      meta_description_en: draft.meta_description_en || null,
    },
    is_published: draft.is_published,
    published_at: null,
    cover_image_url: null,
    meta_title: draft.meta_title_fa || null,
    meta_description: draft.meta_description_fa || null,
  }
}

export function compareStandards(left: StandardEntry, right: StandardEntry): number {
  if (left.is_featured !== right.is_featured) return left.is_featured ? -1 : 1
  if (left.sort_order !== null || right.sort_order !== null) {
    if (left.sort_order === null) return 1
    if (right.sort_order === null) return -1
    if (left.sort_order !== right.sort_order) return left.sort_order - right.sort_order
  }
  return left.organization.localeCompare(right.organization, 'en')
    || left.designation.localeCompare(right.designation, 'en', { numeric: true })
}

export function filterStandards(
  standards: StandardEntry[],
  query: string,
  organization: string,
  category: string,
): StandardEntry[] {
  const needle = query.trim().toLocaleLowerCase('fa')
  return standards.filter((standard) => {
    if (organization && standard.organization !== organization) return false
    if (category && standard.category_fa !== category) return false
    if (!needle) return true
    return [
      standard.organization,
      standard.designation,
      standard.title_fa,
      standard.title_en,
      standard.category_fa,
      standard.category_en,
    ].some(value => value.toLocaleLowerCase('fa').includes(needle))
  })
}
