export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    return await authenticatedFetch(event, '/categories/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    })
  } catch (error: any) {
    throw createError({ statusCode: error.statusCode || 500, message: error.message || 'خطا در مرتب‌سازی دسته‌بندی‌ها' })
  }
})
