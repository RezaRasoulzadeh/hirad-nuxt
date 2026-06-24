
export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  try {
    if (method === 'PUT') {
      const body = await readBody(event);
      const response = await authenticatedFetch(event, '/submit-form', {
        method: 'PUT',
        body,
      });
      return await response.json();
    }

    if (method === 'DELETE') {
      const query = getQuery(event);
      const response = await authenticatedFetch(event, `/submit-form?id=${query.id}`, {
        method: 'DELETE',
      });
      return await response.json();
    }

    throw createError({
      statusCode: 405,
      statusMessage: 'متد ارسال شده معتبر نیست',
    });
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: 'عملیات روی پیام با خطا مواجه شد',
    });
  }
});