import { randomUUID } from 'node:crypto'
import { getHeader, getCookie, readBody, setCookie } from 'h3'
import { recordDuration, recordPageView } from '../../utils/analyticsStore'

const idPattern = /^[a-zA-Z0-9_-]{8,100}$/

function safeId(value: unknown, fallback: string) {
  return typeof value === 'string' && idPattern.test(value) ? value : fallback
}

function safePath(value: unknown) {
  if (typeof value !== 'string') return '/'
  const path = value.split('?')[0].split('#')[0]
  return path.startsWith('/') && path.length <= 240 ? path : '/'
}

function deviceFromUserAgent(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet'
  if (/mobile|android|iphone|ipod/i.test(userAgent)) return 'mobile'
  return 'desktop'
}

function referrerFromHeader(value: string) {
  if (!value) return ''
  try {
    const url = new URL(value)
    return url.hostname.replace(/^www\./, '').slice(0, 120)
  } catch {
    return ''
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Record<string, unknown>>(event).catch(() => ({}))
  const visitorId = safeId(body.visitor_id ?? getCookie(event, 'hirad_visitor_id'), randomUUID())
  const sessionId = safeId(body.session_id, randomUUID())
  const viewId = safeId(body.view_id, randomUUID())
  const eventName = body.event === 'duration' || body.event === 'session_end' ? body.event : 'pageview'

  setCookie(event, 'hirad_visitor_id', visitorId, {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })

  if (eventName === 'pageview') {
    await recordPageView({
      viewId,
      date: new Date().toISOString().slice(0, 10),
      path: safePath(body.path),
      visitorId,
      sessionId,
      device: deviceFromUserAgent(getHeader(event, 'user-agent') || ''),
      referrer: referrerFromHeader(getHeader(event, 'referer') || ''),
    })
  } else {
    await recordDuration(viewId, Number(body.duration_seconds) || 0, eventName === 'session_end')
  }

  return { success: true }
})
