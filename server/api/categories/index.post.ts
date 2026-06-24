// server/api/categories/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    return await authenticatedFetch(event, '/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در ثبت دسته‌بندی جدید',
    });
  }
});