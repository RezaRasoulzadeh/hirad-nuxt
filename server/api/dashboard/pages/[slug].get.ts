// server/api/dashboard/pages/[slug].get.ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  
  try {
    return await authenticatedFetch(event, `/pages/${encodeURIComponent(slug || '')}`);
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در دریافت اطلاعات صفحه',
    });
  }
});