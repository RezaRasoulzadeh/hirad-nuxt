// server/utils/authenticatedFetch.ts
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie } from 'h3'
import { useRuntimeConfig } from '#imports'

const AUTH_COOKIE = 'hirad_at'
const REFRESH_COOKIE = 'hirad_rt'       
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
          const refreshResponse = await $fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          }) as any

          if (refreshResponse?.success && refreshResponse.data?.access_token) {
            const newToken = refreshResponse.data.access_token

            setCookie(event, AUTH_COOKIE, newToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 15,
            })

            setCookie(event, SESSION_COOKIE, '1', {
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 15,
            })

            res = await doFetch(newToken)
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