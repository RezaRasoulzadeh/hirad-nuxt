// server/api/dashboard/stats.get.ts
export default defineEventHandler(async (event) => {
  try {
    const response = await authenticatedFetch(event, '/dashboard-stats');
    return response;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'خطا در دریافت اطلاعات آمار داشبورد',
    });
  }
});