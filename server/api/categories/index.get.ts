// server/api/categories/index.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    return await $fetch(`${config.internalApiBase}/categories`);
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'خطا در دریافت لیست دسته‌بندی‌ها',
    });
  }
});