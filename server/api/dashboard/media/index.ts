// server/api/dashboard/media/index.ts
export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      return await authenticatedFetch(event, '/upload/asset');
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'خطا در دریافت لیست رسانه‌ها',
      });
    }
  }

  if (method === 'POST') {
    try {
      const contentType = getHeader(event, 'content-type');
      const rawBody = await readRawBody(event, false);

      return await authenticatedFetch(event, '/upload/asset', {
        method: 'POST',
        headers: {
          ...(contentType ? { 'Content-Type': contentType } : {})
        },
        body: rawBody ? new Uint8Array(rawBody) : null
      });
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'خطا در بارگذاری فایل',
      });
    }
  }
});