import { useState } from '#app'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  message: string
  type: ToastType
  id: number
}

export function useToast() {
  const activeToast = useState<ToastOptions | null>('global_toast', () => null)
  let toastTimer: ReturnType<typeof setTimeout> | null = null

  const clear = () => {
    if (toastTimer) clearTimeout(toastTimer)
    activeToast.value = null
  }

  const show = (message: string, type: ToastType = 'success', duration = 5000) => {
    if (toastTimer) clearTimeout(toastTimer)
    
    activeToast.value = {
      message,
      type,
      id: Date.now()
    }

    toastTimer = setTimeout(clear, duration)
  }

  return {
    active: activeToast,
    clear,
    success: (msg: string, dur?: number) => show(msg, 'success', dur),
    error: (msg: string, dur?: number) => show(msg, 'error', dur),
    warning: (msg: string, dur?: number) => show(msg, 'warning', dur),
    info: (msg: string, dur?: number) => show(msg, 'info', dur)
  }
}