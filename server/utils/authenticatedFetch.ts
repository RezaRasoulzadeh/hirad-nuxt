// server/utils/authenticatedFetch.ts
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie, createError } from 'h3' 
import { useRuntimeConfig } from '#imports'
import { performRefresh } from './refreshAuth'

const AUTH_COOKIE = 'hirad_at'
const REFRESH_COOKIE = 'refresh_token'
const SESSION_COOKIE = 'hirad_session'

function clearAuthCookies(event: H3Event) {
  deleteCookie(event, AUTH_COOKIE, { path: '/' })
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

function isJsonSerializableBody(body: unknown): body is Record<string, any> | any[] {
  if (body === null || body === undefined) return false
  if (typeof body !== 'object') return false
  if (ArrayBuffer.isView(body)) return false     
  if (body instanceof ArrayBuffer) return false
  if (body instanceof FormData) return false
  if (body instanceof URLSearchParams) return false
  if (body instanceof ReadableStream) return false
  if (body instanceof Blob) return false
  return true
}

export async function authenticatedFetch(
  event: H3Event,
  path: string,
  options: RequestInit = {}
) {
  const config = useRuntimeConfig()
  let accessToken = getCookie(event, AUTH_COOKIE)

  let body = options.body as any
  const baseHeaders: Record<string, string> = { ...(options.headers as any) || {} }

  if (isJsonSerializableBody(body)) {
    body = JSON.stringify(body)
    const hasContentType = Object.keys(baseHeaders).some(
      (h) => h.toLowerCase() === 'content-type'
    )
    if (!hasContentType) {
      baseHeaders['Content-Type'] = 'application/json'
    }
  }

  const doFetch = async (token?: string) => {
    const headers: Record<string, string> = { ...baseHeaders }
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(`${config.internalApiBase}${path}`, {
      ...options,
      body,
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
            throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
          }
        } catch (e) {
          console.error('[AuthFetch] Refresh failed:', e)
          clearAuthCookies(event)
          throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
        }
      } else {
        clearAuthCookies(event)
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
      }
    }
  }

  return res
}