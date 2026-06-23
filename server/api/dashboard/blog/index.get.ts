// server/api/dashboard/blog/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    const { is_published } = getQuery(event);

    const search = new URLSearchParams();
    if (is_published !== undefined) {
      search.set('is_published', String(is_published));
    }
    const qs = search.toString();
    const path = `/pages/category/blog${qs ? `?${qs}` : ''}`;

    return await authenticatedFetch(event, path);
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در دریافت لیست مقالات وبلاگ',
    });
  }
});