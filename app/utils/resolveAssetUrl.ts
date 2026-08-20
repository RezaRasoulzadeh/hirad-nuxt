// utils/resolveAssetUrl.ts
import placeholderImg from '~/assets/placeholder.png'

const localAssetModules = import.meta.glob('../assets/**/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const localAssetsByName = Object.fromEntries(
  Object.entries(localAssetModules).map(([path, url]) => [path.split('/').pop(), url]),
)

export function resolveAssetUrl(path?: string | null): string {
  if (!path) return placeholderImg
  if (path.startsWith('http')) return path
  if (path.startsWith('/_nuxt/')) return path
  if (!path.includes('/')) return localAssetsByName[path] || placeholderImg
  const config = useRuntimeConfig()
  const apiBase = (config.public.apiBase as string) || ''
  return `${apiBase.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
