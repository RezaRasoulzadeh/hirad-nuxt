export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const body = await readBody(event);

  try {
    return await authenticatedFetch(event, `/pages/${encodeURIComponent(slug || '')}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در بروزرسانی صفحه اطلاعاتی',
    });
  }
});