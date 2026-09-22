import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getMediaAssetKind,
  getMediaFileExtension,
  matchesMediaAssetKind,
  normalizeMediaAssetKind,
} from '../app/utils/mediaAssets.ts'

test('groups media into images and documents using MIME type', () => {
  const image = { file_url: '/uploads/photo.bin', file_type: 'image/webp' }
  const document = { file_url: '/uploads/specification.bin', file_type: 'application/pdf' }

  assert.equal(getMediaAssetKind(image), 'image')
  assert.equal(getMediaAssetKind(document), 'document')
  assert.equal(matchesMediaAssetKind(image, 'image'), true)
  assert.equal(matchesMediaAssetKind(image, 'document'), false)
  assert.equal(matchesMediaAssetKind(document, 'all'), true)
})

test('falls back to a clean file extension for older media records', () => {
  assert.equal(getMediaFileExtension('/uploads/example.SVG?version=2'), 'svg')
  assert.equal(getMediaAssetKind({ file_url: '/uploads/example.SVG?version=2' }), 'image')
  assert.equal(getMediaAssetKind({ file_url: '/uploads/specification.pdf' }), 'document')
})

test('normalizes unsupported filter values to all files', () => {
  assert.equal(normalizeMediaAssetKind('image'), 'image')
  assert.equal(normalizeMediaAssetKind('document'), 'document')
  assert.equal(normalizeMediaAssetKind('pdf'), 'all')
})
