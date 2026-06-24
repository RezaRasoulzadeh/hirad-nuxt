
export default defineEventHandler(async (event) => {
  try {
    const response = await authenticatedFetch(event, '/forms', {
      method: 'GET',
    });
    
    return await response.json();
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'خطا در دریافت لیست پیام‌ها از سرور مرکزی',
    });
  }
});