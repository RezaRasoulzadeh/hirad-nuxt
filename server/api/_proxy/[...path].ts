export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const backendUrl = config.backendUrl || 'http://localhost:3000'

  const path = event.context.params?.path || ''
  const targetUrl = `${backendUrl}/api/${path}`.replace(/\/+/g, '/')

  try {
    const response = await $fetch(targetUrl, {
      method: getMethod(event),
      headers: getHeaders(event) as HeadersInit,
      query: getQuery(event),
      body: await readBody(event).catch(() => undefined),
    })

    return response
  } catch (error: any) {
    console.error(`Proxy Error [${getMethod(event)} ${targetUrl}]:`, error?.message)
    
    throw createError({
      statusCode: error?.response?.status || 500,
      statusMessage: error?.message || 'Proxy failed',
    })
  }
})