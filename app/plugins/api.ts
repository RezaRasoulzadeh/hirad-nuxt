// app/plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
  const { logout } = useAuth()
  const originalFetch = globalThis.$fetch

  globalThis.$fetch = originalFetch.create({
    async onResponseError({ response, request }) {
      if (!response) return

      if ([401, 403].includes(response.status)) {
        if (request === '/api/auth/refresh') {
          await logout()
          await nuxtApp.runWithContext(() => navigateTo('/login'))
          return
        }

        try {
          await originalFetch('/api/auth/refresh', { method: 'POST' })
        } catch {
          await logout()
          await nuxtApp.runWithContext(() => navigateTo('/login'))
          return
        }
      }
    }
  }) as typeof globalThis.$fetch
})