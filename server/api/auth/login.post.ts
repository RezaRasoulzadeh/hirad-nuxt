// server/api/auth/login.post.ts
import { loginUpstream } from '../../utils/backendAuth'
import { AUTH_COOKIE, REFRESH_COOKIE, SESSION_FLAG_COOKIE } from '../../utils/cookies'

export default defineEventHandler(async (event) => {
  const { identifier, password } = await readBody(event)

  if (!identifier || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'ایمیل و رمز عبور الزامی است.'
    })
  }

  const { accessToken, refreshToken, user } = await loginUpstream(identifier, password)

  if (!accessToken) {
    throw createError({
     statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'ورود ناموفق بود.'
    })
  }

  const isProd = process.env.NODE_ENV === 'production'
  const secureBase = { secure: isProd, sameSite: 'lax' as const, path: '/' }

  setCookie(event, AUTH_COOKIE, accessToken, { ...secureBase, httpOnly: true, maxAge: 60 * 15 })

  if (refreshToken) {
    setCookie(event, REFRESH_COOKIE, refreshToken, { ...secureBase, httpOnly: true, maxAge: 60 * 60 * 24 * 30 })
  }

  // Non-sensitive UI flag only — never used for real authorization
  setCookie(event, SESSION_FLAG_COOKIE, '1', { ...secureBase, httpOnly: false, maxAge: 60 * 60 * 24 * 30 })

  return { success: true, user }
})