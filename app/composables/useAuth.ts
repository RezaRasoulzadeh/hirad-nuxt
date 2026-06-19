// composables/useAuth.ts
interface AuthUser {
  id?: string | number
  name?: string
  email?: string
  role?: string
}

export function useAuth() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const sessionFlag = useCookie<string | null>('hirad_session')
  const isLoggedIn = computed(() => !!sessionFlag.value)

  async function login(identifier: string, password: string) {
    const res = await $fetch<{ success: boolean; user: AuthUser | null }>('/api/auth/login', {
      method: 'POST',
      body: { identifier, password }
    })
    user.value = res.user
    return res
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
}