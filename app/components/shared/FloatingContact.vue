<template>
  <div>
    <!-- FloatingContact: trigger button -->
    <button
      type="button"
      @click="toggle"
      class="fixed bottom-6 inset-s-6 md:bottom-10 md:inset-s-10 z-51 btn btn-circle btn-primary btn-lg shadow-xl hover:scale-115 transition-all duration-300"
      aria-label="فرم تماس با ما"
    >
      <MessageCircleMore v-if="!open" class="size-6" />
      <X v-else class="size-6" />
    </button>

    <!-- FloatingContact: panel -->
    <Transition name="fc-panel">
      <div
        v-if="open"
        class="fixed bottom-24 inset-s-6 md:bottom-28 md:inset-s-10 z-50 w-96 max-w-[calc(100vw-2rem)]"
      >
        <div class="bg-base-100 rounded-box border border-base-300 shadow-2xl overflow-hidden">
          <!-- header -->
          <div class="relative overflow-hidden bg-linear-to-r from-primary to-primary/80 text-primary-content p-5">
            <div class="absolute -top-2 -inset-e-2 size-16 rounded-full bg-primary-content/10"></div>
            <div class="absolute -bottom-1 -inset-s-1 size-12 rounded-full bg-primary-content/5"></div>
            <div class="relative z-10 flex items-center justify-between">
              <h3 class="text-lg font-bold">تماس با ما</h3>
              <button type="button" @click="toggle" class="text-primary-content/80 hover:text-primary-content transition-transform hover:rotate-90 cursor-pointer">
                <X class="size-6" />
              </button>
            </div>
          </div>

          <!-- form -->
          <div class="p-6 max-h-[70vh] overflow-y-auto">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label for="fc-name" class="block text-sm font-semibold mb-2">نام و نام خانوادگی</label>
                <div class="relative">
                  <input
                    id="fc-name"
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="نام خود را وارد کنید"
                    class="input w-full ps-11"
                  />
                  <User class="absolute inset-y-0 inset-s-3 my-auto size-5 text-base-content/40 pointer-events-none" />
                </div>
              </div>

              <div>
                <label for="fc-email" class="block text-sm font-semibold mb-2">ایمیل</label>
                <div class="relative">
                  <input
                    id="fc-email"
                    v-model="form.email"
                    type="email"
                    required
                    dir="ltr"
                    placeholder="Email@Example.com"
                    class="input w-full ps-11"
                  />
                  <Mail class="absolute inset-y-0 inset-s-3 my-auto size-5 text-base-content/40 pointer-events-none" />
                </div>
              </div>

              <div>
                <label for="fc-message" class="block text-sm font-semibold mb-2">پیام شما</label>
                <div class="relative">
                  <textarea
                    id="fc-message"
                    v-model="form.message"
                    required
                    rows="4"
                    placeholder="پیام خود را بنویسید..."
                    class="textarea w-full ps-11 resize-none"
                  ></textarea>
                  <MessageSquare class="absolute top-3 inset-s-3 size-5 text-base-content/40 pointer-events-none" />
                </div>
              </div>

              <button type="submit" :disabled="loading" class="btn btn-primary w-full">
                <span v-if="loading" class="loading loading-spinner loading-sm"></span>
                <Send v-else class="size-5" />
                {{ loading ? 'در حال ارسال...' : 'ارسال پیام' }}
              </button>
            </form>

            <!-- alt contact options -->
            <div class="mt-6 pt-6 border-t border-base-300">
              <p class="text-center text-sm font-medium text-base-content/60 mb-4">یا با ما در ارتباط باشید</p>
              <div class="flex justify-center gap-4">
                <a href="tel:+982166420839" class="group flex flex-col items-center p-3 rounded-box hover:bg-base-200 transition-colors">
                  <div class="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-content transition-colors">
                    <PhoneCall class="size-5" />
                  </div>
                  <span class="mt-2 text-xs text-base-content/60 group-hover:text-primary font-medium">مشاوره تخصصی</span>
                </a>
                <a href="tel:+982166429816" class="group flex flex-col items-center p-3 rounded-box hover:bg-base-200 transition-colors">
                  <div class="p-3 rounded-full bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-content transition-colors">
                    <PhoneCall class="size-5" />
                  </div>
                  <span class="mt-2 text-xs text-base-content/60 group-hover:text-secondary font-medium">قیمت و موجودی</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fc-backdrop">
      <div v-if="open" class="fixed inset-0 bg-black/40 z-40" @click="toggle"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MessageCircleMore, X, User, Mail, MessageSquare, Send, PhoneCall } from 'lucide-vue-next'

const open = ref(false)
const { form, loading, submitForm } = useContact()
const toast = useToast()

function toggle() {
  open.value = !open.value
}

async function handleSubmit() {
  const result = await submitForm()
  if (result.success) {
    toast.success('پیام شما با موفقیت ارسال شد')
    open.value = false
  } else {
    toast.error(result.error || 'خطا در ارسال پیام')
  }
}
</script>

<style scoped>
.fc-panel-enter-active,
.fc-panel-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fc-panel-enter-from,
.fc-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}

.fc-backdrop-enter-active,
.fc-backdrop-leave-active {
  transition: opacity 0.25s ease;
}
.fc-backdrop-enter-from,
.fc-backdrop-leave-to {
  opacity: 0;
}
</style>