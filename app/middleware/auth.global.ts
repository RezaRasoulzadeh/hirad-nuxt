// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard')) return

  const sessionFlag = useCookie('hirad_session')
  if (!sessionFlag.value) {
    return navigateTo('/login')
  }
})