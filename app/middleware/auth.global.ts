// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const sessionFlag = useCookie('hirad_session')
  if (!sessionFlag.value) {
    return navigateTo('/login')
  }

  const requestFetch = useRequestFetch()

  try {
    await requestFetch('/api/dashboard/stats')
  } catch (error: any) {
    if ([401, 403].includes(error.statusCode)) {
      try {
        await requestFetch('/api/auth/refresh', { method: 'POST' })
        await requestFetch('/api/dashboard/stats')
      } catch {
        return navigateTo('/login')
      }
    } else {
      return navigateTo('/login')
    }
  }
})