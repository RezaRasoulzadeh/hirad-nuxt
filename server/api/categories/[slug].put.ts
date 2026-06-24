// server/api/categories/[slug].put.ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  try {
    const body = await readBody(event);
    return await authenticatedFetch(event, `/categories/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در ویرایش دسته‌بندی',
    });
  }
});