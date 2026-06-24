// server/api/auth/login.post.ts
import { defineEventHandler, setCookie, createError, readBody } from 'h3'
import { shouldUseSecureCookies } from '../../utils/cookieOptions'

interface LoginResponse {
  success: boolean
  data?: {
    user_id: string
    full_name: string | null
    phone: string | null
    email: string | null
    user_type: string | null
    access_token: string
    refresh_token?: string
  }
}

export default defineEventHandler(async (event) => {
  const { identifier, password } = await readBody(event)

  if (!identifier || !password) {
    throw createError({ statusCode: 400, message: 'ایمیل و رمز عبور الزامی است.' })
  }

  const config = useRuntimeConfig()

  const backendRes = await $fetch.raw(`${config.internalApiBase}/login`, {
    method: 'POST',
    body: { identifier, password },
    ignoreResponseError: true,
  })

  const body = backendRes._data as LoginResponse

  if (!body?.success || !body?.data?.access_token) {
    throw createError({ statusCode: 401, message: 'ورود ناموفق بود.' })
  }

  const secureBase = { secure: shouldUseSecureCookies(event), sameSite: 'lax' as const, path: '/' }

  setCookie(event, 'hirad_at', body.data.access_token, {
    ...secureBase,
    httpOnly: true,
    maxAge: 60 * 15,
  })

  if (body.data.refresh_token) {
    setCookie(event, 'refresh_token', body.data.refresh_token, {
      ...secureBase,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    })
  }

  setCookie(event, 'hirad_session', '1', {
    ...secureBase,
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 30,
  })

  return {
    success: true,
    user: {
      user_id: body.data.user_id,
      full_name: body.data.full_name,
      phone: body.data.phone,
      email: body.data.email,
      user_type: body.data.user_type,
    },
  }
})
