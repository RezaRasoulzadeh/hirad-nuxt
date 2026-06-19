<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4" dir="rtl">
    <div class="card w-full max-w-sm bg-base-100 shadow-xl">
      <div class="card-body">
        
        <NuxtLink to="/" class="flex justify-center mb-4">
          <img src="/assets/Logo-Light.png" alt="Logo" class="w-24 block dark:hidden" />
          <img src="/assets/Logo-Dark.png" alt="Logo" class="w-24 hidden dark:block" />
        </NuxtLink>

        <h1 class="text-xl font-bold text-center mb-6">ورود به پنل مدیریت</h1>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label for="identifier" class="label">
              <span class="label-text">ایمیل</span>
            </label>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              dir="ltr"
              required
              placeholder="Email@Example.com"
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control">
            <label for="password" class="label">
              <span class="label-text">رمز عبور</span>
            </label>
            <div class="relative w-full">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                dir="ltr"
                required
                class="input input-bordered w-full pl-10"
              />
              <button
                type="button"
                class="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/60 hover:text-base-content"
                @click="showPassword = !showPassword"
              >
                <EyeClosedIcon v-if="showPassword" class="size-5"/>
                <EyeIcon v-else class="size-5"/>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary w-full mt-2">
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            ورود
          </button>
        </form>
      </div>
    </div>
    <SharedGlobalToast />
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeClosedIcon, EyeIcon } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: false })

const identifier = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const { login } = useAuth()
const router = useRouter()
const toast = useToast()

async function handleSubmit() {
  loading.value = true
  try {
    await login(identifier.value, password.value)
    toast.success('ورود با موفقیت انجام شد')
    router.push('/dashboard')
  } catch (err: any) {
    const msg = err?.data?.message || err?.data?.statusMessage || err?.message || 'ورود ناموفق بود'
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>