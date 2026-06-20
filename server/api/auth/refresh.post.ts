// server/api/auth/refresh.post.ts
import { defineEventHandler, getRequestHeader, setCookie, deleteCookie, appendHeader, createError } from 'h3'

interface RefreshResponse {
  success: boolean
  data?: {
    user_id: string
    access_token: string
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const cookieHeader = getRequestHeader(event, 'cookie') || ''

  try {
    const response = await $fetch.raw(`${config.public.apiBase}/refresh`, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
      credentials: 'include',
      ignoreResponseError: true,
    })

    const body = response._data as RefreshResponse

    if (body?.success && body?.data?.access_token) {

      setCookie(event, 'hirad_at', body.data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      })

      setCookie(event, 'hirad_session', '1', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 15,
      })

      const setCookies = response.headers.getSetCookie?.() || []
      for (const c of setCookies) {
        appendHeader(event, 'set-cookie', c)
      }

      return body
    }

    throw createError({ statusCode: 401, message: 'Refresh failed' })
  } catch (error: any) {
    console.error('[Refresh Proxy] ERROR:', error?.message || error)
    deleteCookie(event, 'hirad_session', { path: '/' })
    deleteCookie(event, 'hirad_at', { path: '/' })
    throw createError({ statusCode: 401, message: 'Refresh failed' })
  }
})