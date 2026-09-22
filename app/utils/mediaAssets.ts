export type MediaAssetKind = 'all' | 'image' | 'document'
export type ConcreteMediaAssetKind = Exclude<MediaAssetKind, 'all'>

export interface DashboardMediaAsset {
  id: string
  file_url: string
  file_name?: string | null
  file_type?: string | null
  file_size?: number | null
  description?: string | null
  uploaded_at?: string | null
  updated_at?: string | null
}

const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'avif'])

export function getMediaFileExtension(url: string): string {
  const cleanUrl = url.split(/[?#]/, 1)[0] || ''
  return cleanUrl.includes('.') ? cleanUrl.split('.').pop()?.toLowerCase() || '' : ''
}

export function getMediaAssetKind(asset: Pick<DashboardMediaAsset, 'file_url' | 'file_type'>): ConcreteMediaAssetKind {
  const mimeType = asset.file_type?.trim().toLowerCase() || ''
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType) return 'document'
  return imageExtensions.has(getMediaFileExtension(asset.file_url)) ? 'image' : 'document'
}

export function isImageMediaAsset(asset: Pick<DashboardMediaAsset, 'file_url' | 'file_type'>): boolean {
  return getMediaAssetKind(asset) === 'image'
}

export function matchesMediaAssetKind(
  asset: Pick<DashboardMediaAsset, 'file_url' | 'file_type'>,
  kind: MediaAssetKind,
): boolean {
  return kind === 'all' || getMediaAssetKind(asset) === kind
}

export function normalizeMediaAssetKind(value: unknown): MediaAssetKind {
  return value === 'image' || value === 'document' ? value : 'all'
}
