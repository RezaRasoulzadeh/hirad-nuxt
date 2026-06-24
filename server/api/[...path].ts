// server/api/[...path].ts
export default defineEventHandler(async (event) => {
  const path = event.context.params?.path
  if (!path) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const requestUrl = getRequestURL(event)

  if (path.startsWith('_nuxt/')) {
    return sendRedirect(event, `/${path}${requestUrl.search}`, 302)
  }

  const method = getMethod(event)
  const search = requestUrl.search
  const body = method !== 'GET' && method !== 'HEAD'
    ? await readBody(event).catch(() => undefined)
    : undefined

  const res = await authenticatedFetch(event, `/${path}${search}`, { method, body })
  const contentType = res.headers.get('content-type') || ''

  if (!res.ok) {
    if (contentType.includes('application/json')) {
      const errBody = await res.json().catch(() => null)
      throw createError({
        statusCode: res.status,
        statusMessage: errBody?.message || errBody?.error || res.statusText || 'Proxy request failed',
        data: errBody,
      })
    }
    throw createError({ statusCode: res.status, statusMessage: res.statusText || 'Proxy request failed' })
  }

  if (!contentType.includes('application/json')) {
    setResponseHeader(event, 'Content-Type', contentType || 'application/octet-stream')
    for (const h of ['content-disposition', 'cache-control', 'etag', 'last-modified']) {
      const v = res.headers.get(h)
      if (v) setResponseHeader(event, h, v)
    }
    return Buffer.from(await res.arrayBuffer())
  }

  return res.json()
})
