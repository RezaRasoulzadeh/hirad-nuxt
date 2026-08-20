type ApiLikeError = {
  data?: any
  response?: { _data?: any }
  statusCode?: number
  status?: number
  statusMessage?: string
  message?: string
}

export function getApiErrorMessage(error: unknown, fallback = 'عملیات با خطا مواجه شد.'): string {
  const value = (error || {}) as ApiLikeError
  const data = value.data ?? value.response?._data
  const candidates = [
    data?.message,
    data?.statusMessage,
    data?.error?.message,
    Array.isArray(data?.errors) ? data.errors.map((item: any) => item?.message || item).filter(Boolean).join('، ') : null,
    value.statusMessage,
    value.message,
  ]
  const message = candidates.find(item => typeof item === 'string' && item.trim())
  if (!message || /fetch failed|network error/i.test(message)) return 'ارتباط با سرور برقرار نشد. دوباره تلاش کنید.'
  return message
}

export function getApiSuccessMessage(response: any, fallback: string): string {
  return typeof response?.message === 'string' && response.message.trim() ? response.message : fallback
}
