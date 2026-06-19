// app/middleware/auth-guard.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  // Skip logic for login page to prevent infinite redirects
  if (to.path === '/login') return;

  const fetchSource = useRequestFetch();

  try {
    await fetchSource('/api/dashboard/stats');
  } catch (error: any) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      try {
        // Attempt token rotation silently via server proxy
        await $fetch('/api/auth/refresh', { method: 'POST' });
        
        // Retry initial validation on successful token rotation
        await fetchSource('/api/dashboard/stats');
        return;
      } catch (refreshError) {
        // Refresh token failed, invalid, or expired -> eject to login
        return navigateTo('/login');
      }
    }
    
    // Fallback block for other catastrophic network drops
    return navigateTo('/login');
  }
});