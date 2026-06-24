// server/api/pages/[slug].get.ts
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const config = useRuntimeConfig();

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'نامک صفحه الزامی است',
    });
  }

  try {
    return await $fetch(`${config.internalApiBase}/pages/${encodeURIComponent(slug)}`);
  } catch (err: any) {
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'خطا در دریافت اطلاعات صفحه',
    });
  }
});
