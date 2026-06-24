import type { H3Event } from 'h3'
import { getRequestHeader } from 'h3'

export function shouldUseSecureCookies(event: H3Event): boolean {
  if (process.env.COOKIE_SECURE === 'true') return true
  if (process.env.COOKIE_SECURE === 'false') return false

  const forwardedProto = getRequestHeader(event, 'x-forwarded-proto')
  return forwardedProto === 'https'
}
