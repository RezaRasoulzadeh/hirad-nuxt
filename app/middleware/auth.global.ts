// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const sessionFlag = useCookie('hirad_session')
  if (!sessionFlag.value) {
    return navigateTo('/login')
  }

  try {
    await $fetch('/api/dashboard/stats', { credentials: 'include' })
  } catch (error: any) {
    if ([401, 403].includes(error.statusCode)) {
      try {
        await $fetch('/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
        })
        // Retry
        await $fetch('/api/dashboard/stats', { credentials: 'include' })
      } catch {
        return navigateTo('/login')
      }
    } else {
      return navigateTo('/login')
    }
  }
})