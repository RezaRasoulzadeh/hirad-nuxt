// server/api/dashboard/media/index.ts
export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const offset = Math.max(0, Number(query.offset) || 0)
      const limit = Math.min(100, Math.max(1, Number(query.limit) || 40))
      const response = await authenticatedFetch(event, '/upload/asset')
      const payload = await response.json()
      const allAssets = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : []
      const data = allAssets.slice(offset, offset + limit)

      return {
        ...(Array.isArray(payload) ? {} : payload),
        success: payload?.success ?? true,
        data,
        pagination: {
          offset,
          limit,
          total: allAssets.length,
          has_more: offset + data.length < allAssets.length,
        },
      }
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
