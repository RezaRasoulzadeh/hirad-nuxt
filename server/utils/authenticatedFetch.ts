// server/utils/authenticatedFetch.ts
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { useRuntimeConfig } from '#imports'
import { performRefresh } from './refreshAuth'


const AUTH_COOKIE = 'hirad_at'
const REFRESH_COOKIE = 'refresh_token'
const SESSION_COOKIE = 'hirad_session'

function clearAuthCookies(event: H3Event) {
  deleteCookie(event, AUTH_COOKIE, { path: '/' })
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export async function authenticatedFetch(
  event: H3Event,
  path: string,
  options: RequestInit = {}
) {
  const config = useRuntimeConfig()
  let accessToken = getCookie(event, AUTH_COOKIE)

  const doFetch = async (token?: string) => {
    const headers: Record<string, string> = { ...(options.headers as any) || {} }
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(`${config.public.apiBase}${path}`, {
      ...options,
      headers,
      credentials: 'include',
    })
  }

  let res = await doFetch(accessToken)

  if (res.status === 401 || res.status === 500) {
    const text = await res.clone().text()

    if (res.status === 401 || text.includes('Authorization header missing')) {
      const refreshToken = getCookie(event, REFRESH_COOKIE)

      if (refreshToken) {
  try {
    const newToken = await performRefresh(event)
    if (newToken) {
      res = await doFetch(newToken)
    } else {
      clearAuthCookies(event)
    }
  } catch (e) {
    console.error('[AuthFetch] Refresh failed:', e)
    clearAuthCookies(event)
  }
}
    }
  }

  return res
}