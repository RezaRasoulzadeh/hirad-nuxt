// app/plugins/api.ts
import { defineNuxtPlugin, navigateTo } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const { logout } = useAuth()
  const originalFetch = globalThis.$fetch

  const triggerSmoothExit = async () => {
    await logout()

    if (process.client) {
      const toastContainer = document.createElement('div')
      toastContainer.className = 'toast toast-top toast-center z-[9999] min-w-80 transition-all duration-300'
      toastContainer.innerHTML = `
        <div class="alert alert-error shadow-xl rounded-xl border border-error/20 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex flex-col text-right" dir="rtl">
            <span class="font-bold text-sm">نشست شما به پایان رسیده است</span>
            <span class="text-xs opacity-75 mt-0.5">انتقال به صفحه ورود تا ۲ ثانیه دیگر...</span>
          </div>
        </div>
      `
      document.body.appendChild(toastContainer)

      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      toastContainer.remove()
    }
    await nuxtApp.runWithContext(() => navigateTo('/login', { replace: true }))
  }

  globalThis.$fetch = originalFetch.create({
    async onResponseError({ response, request }) {
      if (!response) return

      if ([401, 403].includes(response.status)) {
        if (request === '/api/auth/refresh') {
          await triggerSmoothExit()
          return
        }

        try {
          await originalFetch('/api/auth/refresh', { method: 'POST' })
        } catch {
          await triggerSmoothExit()
          return
        }
      }
    }
  }) as typeof globalThis.$fetch
})