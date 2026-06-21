// server/api/dashboard/media/[id].ts
export default defineEventHandler(async (event) => {
  const method = getMethod(event);
  const id = getRouterParam(event, 'id');

  if (method === 'PUT') {
    try {
      const contentType = getHeader(event, 'content-type');
      const rawBody = await readRawBody(event, false);

      return await authenticatedFetch(event, `/upload/asset/${id}`, {
        method: 'PUT',
        headers: {
          ...(contentType ? { 'Content-Type': contentType } : {})
        },
        body: rawBody ? new Uint8Array(rawBody) : null
      });
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'خطا در بروزرسانی رسانه',
      });
    }
  }

  if (method === 'DELETE') {
    try {
      return await authenticatedFetch(event, `/upload/asset/${id}`, {
        method: 'DELETE',
      });
    } catch (error: any) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message || 'خطا در حذف رسانه',
      });
    }
  }
});