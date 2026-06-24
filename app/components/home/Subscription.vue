<template>
  <section class="w-full pt-10 bg-base-100">
    <div class="relative overflow-hidden bg-base-200 p-8 md:p-12">
      <div class="relative flex flex-col items-center text-center">
        <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">Newsletter</span>
        <h2 class="text-3xl md:text-3xl font-black text-base-content tracking-tight mb-4">هیچ بروزرسانی‌ای را از دست ندهید</h2>
        <div class="h-1 w-12 bg-primary rounded-full opacity-80 mb-6" />
        <p class="text-base-content/70 leading-loose mb-10">
          جدیدترین اخبار، محصولات، موجودی تجهیزات صنعتی، مقالات تخصصی و اطلاعیه‌های هیراد را مستقیماً در ایمیل خود دریافت کنید.
        </p>

        <form @submit.prevent="subscribe" class="w-full max-w-xl">
          <div class="join w-full h-12">
            <input v-model="email" dir="ltr" type="email" placeholder="ایمیل خود را وارد نمایید" class="input input-bordered flex-1 h-full join-item rounded-r-2xl rounded-l-none text-right outline-0 focus:border-primary" required />
            <button type="submit" :disabled="isLoading" class="btn btn-primary h-full px-8 min-w-44 join-item rounded-l-2xl rounded-r-none">
              <span v-if="isLoading" class="loading loading-spinner loading-sm" />
              <template v-else>عضویت در خبرنامه</template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { useToast } from '~/composables/useToast'

const email = ref('')
const isLoading = ref(false)
const config = useRuntimeConfig()
const toast = useToast()

const baseUrl = config?.public?.apiBase ?? '/api'

async function subscribe() {
  if (!email.value.trim()) return
  isLoading.value = true

  try {
    await $fetch(`${baseUrl}/subscribe`, {
      method: 'POST',
      body: { email: email.value }
    })
    email.value = ''
    toast.success('عضویت شما با موفقیت ثبت شد')
  } catch {
    toast.error('خطا در ثبت اطلاعات')
  } finally {
    isLoading.value = false
  }
}
</script>
