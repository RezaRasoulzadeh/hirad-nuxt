// server/utils/cookies.ts
export const AUTH_COOKIE = 'hirad_at'
export const REFRESH_COOKIE = 'hirad_rt'
export const SESSION_FLAG_COOKIE = 'hirad_session'

export function extractSetCookieValue(
  setCookieHeader: string[] | string | null | undefined,
  name: string
): string | null {
  if (!setCookieHeader) return null
  const headers = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
  for (const header of headers) {
    const match = header.match(new RegExp(`${name}=([^;]+)`))
    const value = match?.[1]
    if (value) return decodeURIComponent(value)
  }
  return null
}