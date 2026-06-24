// server/api/dashboard/products/index.get.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { category } = getQuery(event);

  if (!category) {
    return { success: true, data: [] };
  }

  const targetPath = `/products?category=${encodeURIComponent(String(category))}&sort=newest&only_active=false`;

  try {
    return await $fetch(`${config.internalApiBase}${targetPath}`);
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'خطا در دریافت لیست محصولات',
    });
  }
});