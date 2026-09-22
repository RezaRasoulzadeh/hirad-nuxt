import assert from 'node:assert/strict'
import test from 'node:test'
import type { StandardEntry } from '../app/types/standard.ts'
import {
  buildStandardPagePayload,
  compareStandards,
  emptyStandardDraft,
  filterStandards,
  normalizeStandardDraft,
  normalizeStandardPage,
  pageSlugFromPublicSlug,
  publicSlugFromPageSlug,
  validateStandardDraft,
} from '../app/utils/standards.ts'

function validDraft() {
  return {
    ...emptyStandardDraft(),
    slug: 'asme-b16-5',
    organization: 'ASME',
    designation: 'ASME B16.5',
    title_fa: 'عنوان مرجع',
    title_en: 'Reference title',
    short_description_fa: 'توضیح کوتاه مرجع',
    category_fa: 'فلنج‌ها',
    publication_year: 2025,
    official_url: 'https://example.com/standards/asme-b16-5',
    resources: [{ id: 'one', label_fa: 'فایل مجاز', label_en: 'Licensed file', url: '/uploads/licensed.pdf', kind: 'document' as const }],
  }
}

test('standard page payload uses native page fields and versioned content JSON', () => {
  const payload = buildStandardPagePayload(validDraft())
  assert.equal(payload.category_id, null)
  assert.equal(payload.slug, 'standard-asme-b16-5')
  assert.equal(payload.title, 'عنوان مرجع')
  assert.equal(payload.summary, 'توضیح کوتاه مرجع')
  assert.equal(payload.content.resource_type, 'engineering_standard')
  assert.equal(payload.content.schema_version, 1)
  assert.equal(payload.content.designation, 'ASME B16.5')
})

test('page records round-trip into a standards entry', () => {
  const draft = validDraft()
  const payload = buildStandardPagePayload(draft)
  const entry = normalizeStandardPage({
    id: 'page-id',
    ...payload,
    created_at: '2026-09-22T00:00:00Z',
    updated_at: '2026-09-22T01:00:00Z',
  })
  assert.ok(entry)
  assert.equal(entry.slug, draft.slug)
  assert.equal(entry.backend_slug, 'standard-asme-b16-5')
  assert.equal(entry.organization, draft.organization)
  assert.deepEqual(entry.resources, draft.resources)
})

test('draft validation covers identifiers, ranges, required fields and URLs', () => {
  assert.deepEqual(validateStandardDraft(validDraft()), [])

  const invalid = normalizeStandardDraft({
    ...validDraft(),
    slug: 'ASME B16.5',
    organization: '',
    publication_year: 1700,
    official_url: 'javascript:alert(1)',
    resources: [{ id: 'bad', label_fa: '', label_en: '', url: 'file:///secret.pdf', kind: 'document' }],
  })
  const errors = validateStandardDraft(invalid)
  assert.ok(errors.some(error => error.includes('نامک')))
  assert.ok(errors.some(error => error.includes('سازمان')))
  assert.ok(errors.some(error => error.includes('سال انتشار')))
  assert.ok(errors.some(error => error.includes('منبع رسمی')))
  assert.ok(errors.some(error => error.includes('منبع 1')))
})

test('a missing slug is generated from the standard designation', () => {
  const draft = normalizeStandardDraft({
    organization: 'ASME',
    designation: 'ASME B16.5',
  })

  assert.equal(draft.slug, 'asme-b16-5')
})

test('unsafe stored links are removed from public normalization', () => {
  const payload = buildStandardPagePayload(validDraft())
  const content = { ...payload.content, official_url: 'javascript:alert(1)', resources: [{ id: 'x', label_fa: 'x', url: 'file:///x', kind: 'document' }] }
  const entry = normalizeStandardPage({ ...payload, content })
  assert.ok(entry)
  assert.equal(entry.official_url, '')
  assert.deepEqual(entry.resources, [])
})

test('slug conversion is stable and filtering searches technical and localized fields', () => {
  assert.equal(pageSlugFromPublicSlug('asme-b16-5'), 'standard-asme-b16-5')
  assert.equal(publicSlugFromPageSlug('standard-asme-b16-5'), 'asme-b16-5')

  const first = normalizeStandardPage(buildStandardPagePayload(validDraft())) as StandardEntry
  const secondDraft = { ...validDraft(), slug: 'api-6d', organization: 'API', designation: 'API 6D', title_fa: 'شیرآلات خط لوله', category_fa: 'شیرآلات', is_featured: true }
  const second = normalizeStandardPage(buildStandardPagePayload(secondDraft)) as StandardEntry
  const records = [first, second].sort(compareStandards)
  assert.equal(records[0]?.designation, 'API 6D')
  assert.deepEqual(filterStandards(records, 'فلنج', '', '').map(item => item.slug), ['asme-b16-5'])
  assert.deepEqual(filterStandards(records, '', 'API', 'شیرآلات').map(item => item.slug), ['api-6d'])
})
