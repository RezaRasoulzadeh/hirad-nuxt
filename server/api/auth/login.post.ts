// server/api/auth/login.post.ts
import { defineEventHandler, setCookie, appendHeader, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const { identifier, password } = await readBody(event)

  if (!identifier || !password) {
    throw createError({ statusCode: 400, message: 'ایمیل و رمز عبور الزامی است.' })
  }

  const config = useRuntimeConfig()

  const backendRes = await $fetch.raw(`${config.public.apiBase}/login`, {
    method: 'POST',
    body: { identifier, password },
    credentials: 'include',
    ignoreResponseError: true,
  })

  const body = backendRes._data as any


  if (!body?.success || !body?.data?.access_token) {
    throw createError({ statusCode: 401, message: 'ورود ناموفق بود.' })
  }

  const isProd = process.env.NODE_ENV === 'production'
  const secureBase = { secure: isProd, sameSite: 'lax' as const, path: '/' }

  setCookie(event, 'hirad_at', body.data.access_token, {
    ...secureBase,
    httpOnly: true,
    maxAge: 60 * 15,
  })

  const setCookies = backendRes.headers.getSetCookie?.() || []
  for (const cookie of setCookies) {
    appendHeader(event, 'set-cookie', cookie)
  }

  setCookie(event, 'hirad_session', '1', {
    ...secureBase,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  })

  return { success: true, user: body.data.user }
})