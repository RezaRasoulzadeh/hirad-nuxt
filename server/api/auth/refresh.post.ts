// server/api/auth/refresh.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const cookies = parseCookies(event);

  try {
    // Proxy request downstream to backend engine running on port :3000
    const response = await $fetch.raw(`${config.public.apiBase}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Pass the cookie header exactly as received from the browser
        Cookie: event.node.req.headers.cookie || '',
      }
    });

    // Capture any updated tokens/set-cookie instructions issued by your real backend
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      appendHeader(event, 'set-cookie', setCookieHeader);
    }

    return { success: true };
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: 'جلسه کاری شما منقضی شده است. لطفا مجددا وارد شوید.',
    });
  }
});