// utils/resolveAssetUrl.ts
import placeholderImg from '~/assets/placeholder.png'

export function resolveAssetUrl(path?: string | null): string {
  if (!path) return placeholderImg
  if (path.startsWith('http')) return path
  if (path.startsWith('/_nuxt/')) return path
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || ''
  return `${apiBase}${path}`
}
