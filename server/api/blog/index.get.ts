// server/api/dashboard/blog/index.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { is_published } = getQuery(event);

  const search = new URLSearchParams();
  if (is_published !== undefined) {
    search.set('is_published', String(is_published));
  }
  const qs = search.toString();
  const path = `/pages/category/blog${qs ? `?${qs}` : ''}`;

  try {
    return await $fetch(`${config.internalApiBase}${path}`);
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'خطا در دریافت لیست مقالات وبلاگ',
    });
  }
});