import { ref } from 'vue'
import { useRuntimeConfig, useCookie, useRequestFetch } from '#app'

export interface ContactForm {
  name: string
  department: string
  email: string
  phone: string
  message: string
}

export function useContact() {
  const config = useRuntimeConfig()
  const requestFetch = useRequestFetch()
  const userCookie = useCookie<{ user_id: string; access_token: string }>('user')

  const loading = ref(false)

  const form = ref<ContactForm>({
    name: '',
    department: '',
    email: '',
    phone: '',
    message: ''
  })

  const departments = [
    'بخش مشاوره',
    'بخش فروش',
    'بخش پشتیبانی',
    'مدیریت'
  ]

  const submitForm = async () => {
    loading.value = true
    try {
      const userId = userCookie.value?.user_id
      const token = userCookie.value?.access_token

      const payload: Record<string, any> = {
        form_name: 'contact_us',
        data: { ...form.value },
        user_agent: import.meta.client ? navigator.userAgent : 'ssr'
      }

      if (userId) payload.user_id = userId

      await requestFetch(`${config.public.apiBase}/submit-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: payload
      })

      form.value = { name: '', department: '', email: '', phone: '', message: '' }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.data?.message || err?.message || 'خطا در ارسال پیام' }
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    departments,
    submitForm
  }
}