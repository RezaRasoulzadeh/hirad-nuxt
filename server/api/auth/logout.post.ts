// server/api/auth/logout.post.ts
import { AUTH_COOKIE, REFRESH_COOKIE, SESSION_FLAG_COOKIE } from '../../utils/cookies'

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, REFRESH_COOKIE)
  const config = useRuntimeConfig()

  if (refreshToken) {
    try {
      await fetch(`${config.internalApiBase}/logout`, {
        method: 'POST',
        headers: { Cookie: `refresh_token=${refreshToken}` }
      })
    } catch {
      // best-effort — local cookies still get cleared below
    }
  }

  deleteCookie(event, AUTH_COOKIE, { path: '/' })
  deleteCookie(event, REFRESH_COOKIE, { path: '/' })
  deleteCookie(event, SESSION_FLAG_COOKIE, { path: '/' })

  return { success: true }
})