// server/api/dashboard/categories/index.get.ts
export default defineEventHandler(async (event) => {
  try {
    return await authenticatedFetch(event, '/categories');
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در دریافت لیست دسته‌بندی‌ها',
    });
  }
});