// utils/resolveAssetUrl.ts
import placeholderImg from '~/assets/placeholder.png'

// Keep this map limited to assets that are actually used as synchronous local
// fallbacks. CMS media paths contain a slash and are resolved through the API.
// Importing the whole assets directory here makes Vite prefetch every image on
// every route, including images that are never rendered on the current page.
const localAssetsByName: Record<string, string> = {
  'placeholder.png': placeholderImg,
}

/** Return a stable relative URL for a bundled asset in SSR and the browser. */
export function normalizeLocalAssetUrl(url: string): string {
  if (url.startsWith('/')) return url

  try {
    const parsed = new URL(url)
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return url
  }
}

export function resolveAssetUrl(path?: string | null): string {
  if (!path) return normalizeLocalAssetUrl(placeholderImg)
  if (path.startsWith('http')) return path
  if (path.startsWith('/_nuxt/')) return path
  if (!path.includes('/')) return normalizeLocalAssetUrl(localAssetsByName[path] || placeholderImg)
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || ''
  return `${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
