// server/utils/refreshAuth.ts
import type { H3Event } from 'h3'
import { getCookie, setCookie } from 'h3'
import { useRuntimeConfig } from '#imports'

interface RefreshResponse {
  success: boolean
  data?: {
    access_token: string
    refresh_token?: string
  }
}

export async function performRefresh(event: H3Event): Promise<string | null> {
  const config = useRuntimeConfig()
  const refreshToken = getCookie(event, 'refresh_token')
  if (!refreshToken) return null

  const response = await $fetch.raw(`${config.public.apiBase}/refresh`, {
    method: 'POST',
    headers: { Cookie: `refresh_token=${refreshToken}` },
    ignoreResponseError: true,
  })

  const body = response._data as RefreshResponse
  if (!body?.success || !body?.data?.access_token) return null

  const isProd = process.env.NODE_ENV === 'production'
  const secureBase = { secure: isProd, sameSite: 'lax' as const, path: '/' }

  setCookie(event, 'hirad_at', body.data.access_token, {
    ...secureBase, httpOnly: true, maxAge: 60 * 15,
  })

  if (body.data.refresh_token) {
    setCookie(event, 'refresh_token', body.data.refresh_token, {
      ...secureBase, httpOnly: true, maxAge: 60 * 60 * 24 * 30,
    })
  }

  setCookie(event, 'hirad_session', '1', {
    ...secureBase, httpOnly: false, maxAge: 60 * 15,
  })

  return body.data.access_token
}