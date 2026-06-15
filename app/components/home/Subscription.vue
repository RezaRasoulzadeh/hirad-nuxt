<template>
  <section class="w-full pt-10 bg-base-100">
    <div>
      <div class="relative overflow-hidden bg-base-200 p-8 md:p-12">

        <div class="relative flex flex-col items-center text-center">
          <span class="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-3">
            Newsletter
          </span>

          <h2 class="text-3xl md:text-3xl font-black text-base-content tracking-tight mb-4">
            هیچ بروزرسانی‌ای را از دست ندهید
          </h2>

          <div class="h-1 w-12 bg-primary rounded-full opacity-80 mb-6" />

          <p class="text-base-content/70 leading-loose mb-10">
            جدیدترین اخبار، محصولات، موجودی تجهیزات صنعتی، مقالات تخصصی و
            اطلاعیه‌های هیراد را مستقیماً در ایمیل خود دریافت کنید.
          </p>

          <form @submit.prevent="subscribe" class="w-full max-w-xl">
            <div class="join w-full h-12">
              <input v-model="email" dir="ltr" type="email"
                placeholder="ایمیل خود را وارد نمایید"
                class="input input-bordered flex-1 h-full join-item rounded-r-2xl rounded-l-none text-right outline-0 focus:border-primary"
                required />

              <button type="submit" :disabled="isLoading"
                class="btn btn-primary h-full px-8 min-w-44 join-item rounded-l-2xl rounded-r-none">
                <span v-if="isLoading" class="loading loading-spinner loading-sm" />
                <template v-else>عضویت در خبرنامه</template>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="toast toast-start toast-bottom z-50">
      <div
        :key="toastKey"
        class="alert relative overflow-hidden pr-4 pl-2 shadow-xl subscription-toast"
        :class="toastType === 'success' ? 'alert-success' : 'alert-error'"
      >
        <span>{{ toastMessage }}</span>
        <button
          type="button"
          class="btn btn-ghost btn-xs btn-circle"
          aria-label="بستن پیام"
          @click="hideToast"
        >
          <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
        <span class="toast-progress" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const toastKey = ref(0)
const isLoading = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const config = useRuntimeConfig()
const baseUrl = config?.public?.apiBase ?? 'http://localhost:3000/api'

async function subscribe() {
  if (!email.value.trim()) return

  isLoading.value = true
  hideToast()

  try {
    await $fetch(`${baseUrl}/subscribe`, {
      method: 'POST',
      body: { email: email.value }
    })

    email.value = ''
    showToast('عضویت شما با موفقیت ثبت شد', 'success')
  } catch (error) {
    showToast('خطا در ثبت اطلاعات', 'error')
  } finally {
    isLoading.value = false
  }
}

function showToast(message: string, type: 'success' | 'error') {
  if (toastTimer) clearTimeout(toastTimer)

  toastMessage.value = message
  toastType.value = type
  toastKey.value += 1
  toastTimer = setTimeout(hideToast, 5000)
}

function hideToast() {
  if (toastTimer) clearTimeout(toastTimer)

  toastMessage.value = ''
  toastTimer = null
}
</script>

<style scoped>
.subscription-toast {
  animation: toast-enter 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-progress {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: right center;
  background: currentColor;
  opacity: 0.45;
  animation: toast-progress 5s linear forwards;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }

  to {
    transform: scaleX(0);
  }
}
</style>
