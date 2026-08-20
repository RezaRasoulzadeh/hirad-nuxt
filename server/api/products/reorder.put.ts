export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const response = await authenticatedFetch(event, '/products/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
    if (response.status === 204) return null
    const payload = await response.json().catch(() => null)
    if (!response.ok) throw createError({ statusCode: response.status, statusMessage: payload?.message || 'Product reorder failed', data: payload })
    return payload
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'خطا در مرتب‌سازی محصولات' })
  }
})
