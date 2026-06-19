// server/api/dashboard/categories/index.post.ts
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await authenticatedFetch(event, '/categories', {
      method: 'POST',
      body,
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در ایجاد دسته‌بندی جدید',
    });
  }
});