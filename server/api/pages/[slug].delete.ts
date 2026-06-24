// server/api/pages/[slug].delete.ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  try {
    return await authenticatedFetch(event, `/pages/${encodeURIComponent(slug || '')}`, {
      method: 'DELETE',
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در حذف صفحه',
    });
  }
});