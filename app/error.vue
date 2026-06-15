<template>
  <NuxtLayout>
    <section class="min-h-[70vh] bg-base-100 px-4 text-base-content flex items-center justify-center">
      <div class="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span class="text-9xl lg:text-[12rem] font-bold uppercase  text-primary">
          {{ statusCode }}
        </span>

        <h1 class="mb-4 text-3xl font-black tracking-tight md:text-4xl">
          {{ title }}
        </h1>

        <p class="mb-8 max-w-xl leading-loose text-base-content/70">
          {{ message }}
        </p>

        <div class="flex flex-wrap justify-center gap-3">
          <button type="button" class="btn btn-primary min-w-36" @click="goHome">
            صفحه اصلی
          </button>

          <button type="button" class="btn btn-outline min-w-36" @click="goBack">
            بازگشت
          </button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const statusCode = computed(() => props.error?.statusCode || 500)
const title = computed(() => statusCode.value === 404 ? 'صفحه پیدا نشد' : 'مشکلی پیش آمده است')
const message = computed(() => (
  statusCode.value === 404
    ? 'آدرسی که وارد کرده‌اید وجود ندارد یا جابه‌جا شده است.'
    : props.error?.statusMessage || props.error?.message || 'لطفاً دوباره تلاش کنید.'
))

const goHome = () => {
  clearError({ redirect: '/' })
}

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    clearError()
    window.history.back()
    return
  }

  clearError({ redirect: '/' })
}
</script>
