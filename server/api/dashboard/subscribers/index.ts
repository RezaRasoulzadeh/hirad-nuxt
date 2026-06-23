export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      return await authenticatedFetch(event, '/subscribers');
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'خطا در دریافت لیست مشترکین',
      });
    }
  }
});