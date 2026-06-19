// server/utils/backendAuth.ts
import { extractSetCookieValue } from './cookies'
import { mapLoginErrorMessage } from './authErrors'

interface LoginResult {
  accessToken: string | null
  refreshToken: string | null
  user: Record<string, any> | null
}

export async function loginUpstream(identifier: string, password: string): Promise<LoginResult> {
  const config = useRuntimeConfig()

  let res: Response
  try {
    res = await fetch(`${config.public.apiBase}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    })
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable',
      message: 'ارتباط با سرور برقرار نشد. لطفا اتصال اینترنت خود را بررسی کنید.'
    })
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => null)
    throw createError({
      statusCode: res.status,
      statusMessage: 'Login Failed',
      message: mapLoginErrorMessage(res.status, errBody?.message)
    })
  }

  const body = await res.json()
  const setCookie = res.headers.getSetCookie?.() ?? res.headers.get('set-cookie')
  const refreshToken = extractSetCookieValue(setCookie, 'refresh_token')

  return {
    accessToken: body?.data?.access_token ?? null,
    refreshToken,
    user: body?.data?.user ?? null
  }
}


export async function refreshUpstream(refreshToken: string): Promise<string | null> {
  const config = useRuntimeConfig()

  const res = await fetch(`${config.public.apiBase}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `refresh_token=${refreshToken}`
    }
  })

  if (!res.ok) return null

  const body = await res.json()
  return body?.data?.access_token ?? null
}