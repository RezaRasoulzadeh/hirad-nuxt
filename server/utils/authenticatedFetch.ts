// server/utils/authenticatedFetch.ts
import type { H3Event } from 'h3'
import { refreshUpstream } from './backendAuth'
import { AUTH_COOKIE, REFRESH_COOKIE } from './cookies'

export async function authenticatedFetch(event: H3Event, path: string, options: RequestInit = {}) {
  const config = useRuntimeConfig()
  const accessToken = getCookie(event, AUTH_COOKIE)

  // Clone or safely inspect body to support safe body stream cloning if necessary
  const doFetch = (token: string | undefined) => {
    // If the body is a stream and has already been read, clone would be required here.
    // For stringified payloads, standard spread works perfectly.
    return fetch(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...((options.headers as Record<string, string>) || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.body && typeof options.body === 'string' ? { 'Content-Type': 'application/json' } : {})
      },
      // Ensures cookies are included if backend needs domain verification
      credentials: 'include' 
    })
  }

  let res = await doFetch(accessToken)

  if (res.status === 401) {
    const refreshToken = getCookie(event, REFRESH_COOKIE)
    if (refreshToken) {
      try {
        const newToken = await refreshUpstream(refreshToken)
        if (newToken) {
          setCookie(event, AUTH_COOKIE, newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15 // 15 Minutes
          })
          
          // Execute retry with fresh authorization token
          res = await doFetch(newToken)
        } else {
          // Explicit token rejection from upstream API
          deleteCookie(event, AUTH_COOKIE, { path: '/' })
          deleteCookie(event, REFRESH_COOKIE, { path: '/' })
        }
      } catch (refreshError) {
        // Fail-safe cleanup for catastrophic backend rotation drops
        deleteCookie(event, AUTH_COOKIE, { path: '/' })
        deleteCookie(event, REFRESH_COOKIE, { path: '/' })
      }
    }
  }

  return res
}