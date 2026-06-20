// server/utils/backendAuth.ts
export async function loginUpstream(identifier: string, password: string): Promise<LoginResult> {
  const config = useRuntimeConfig()

  const res = await fetch(`${config.public.apiBase}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
    credentials: 'include'
  })

  const body = await res.json().catch(() => ({}))
  
  console.log('[LoginUpstream] Full backend response:', JSON.stringify(body, null, 2))

  if (!res.ok) {
    throw createError({
      statusCode: res.status,
      message: 'Login failed'
    })
  }

  return {
    accessToken: body?.data?.access_token ?? null,
    refreshToken: body?.data?.refresh_token ?? null,
    user: body?.data?.user ?? null
  }
}
interface LoginResult {
  accessToken: string | null
  refreshToken?: string | null
  user: Record<string, any> | null
}