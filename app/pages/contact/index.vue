<template>
  <div dir="rtl" class="min-h-screen bg-base-200/30">
    <div class="container mx-auto px-4 lg:px-0 py-12 md:py-20">

      <div class="text-center mb-12 field-animate" style="--fi: 0">
        <h1 class="text-3xl md:text-4xl font-black text-base-content mb-3">
          تماس با ما
        </h1>
        <p class="text-base-content/60 text-sm md:text-base">
         اینجا هستیم که کمک کنیم! سوالی درباره محصولات، خدمات، یا سفارش‌ها دارید؟ یا دنبال مشاوره تخصصی هستید؟ با بخش مشاوره، فروش، یا حتی مدیریت می‌تونید راحت در تماس باشید. منتظر شنیدن از شما هستیم!
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-start">

        <div class="card-lift bg-base-100 border rounded-3xl border-base-300 p-6 md:p-8 field-animate" style="--fi: 1">
          <h2 class="text-lg font-bold text-base-content mb-6">راه‌های ارتباطی</h2>

          <div class="relative flex flex-col gap-7">
            <div class="absolute right-4.75 top-3 bottom-3 w-px bg-base-300" aria-hidden="true"></div>

            <div
              v-for="(item, idx) in contactInfo"
              :key="item.label"
              class="relative flex items-start gap-4"
            >
              <div class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary shrink-0">
                <component :is="item.icon" class="size-5" />
              </div>
              <div class="flex flex-col gap-0.5 pt-1.5">
                <span class="text-xs text-base-content/50 font-bold">{{ item.label }}</span>
                <component
                  :is="item.href ? 'a' : 'span'"
                  :href="item.href"
                  class="text-sm text-base-content font-medium"
                  :class="item.href ? 'hover:text-primary transition-colors' : ''"
                >
                  {{ item.value }}
                </component>
              </div>
            </div>
          </div>

          <div class="divider my-6"></div>

          <div class="flex flex-col gap-3">
            <span class="text-xs text-base-content/50 font-bold">شبکه‌های اجتماعی</span>
            <div class="flex items-center gap-3">
              <a
                v-for="icon in socialIcons"
                :key="icon.label"
                :href="icon.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="icon.label"
                class="flex items-center justify-center w-10 h-10 rounded-full bg-base-200 text-base-content/60 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <component :is="icon.svg" class="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div class="card-lift bg-base-100 rounded-3xl border border-base-300 p-6 md:p-8 field-animate" style="--fi: 2">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-5" novalidate>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="form-control w-full">
                <label for="name" class="label">
                  <span class="label-text font-medium text-base-content/80">نام و نام خانوادگی</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  v-model="form.name"
                  autocomplete="name"
                  placeholder="نام خود را وارد کنید"
                  required
                  class="input input-bordered w-full rounded-btn focus:input-primary"
                />
              </div>

              <div class="form-control w-full">
                <label for="department" class="label">
                  <span class="label-text font-medium text-base-content/80">بخش مربوطه</span>
                </label>
                <select
                  id="department"
                  name="department"
                  v-model="form.department"
                  required
                  class="select select-bordered w-full rounded-btn focus:select-primary"
                >
                  <option value="" disabled selected>انتخاب دپارتمان</option>
                  <option v-for="dep in departments" :key="dep" :value="dep">{{ dep }}</option>
                </select>
              </div>

              <div class="form-control w-full">
                <label for="email" class="label">
                  <span class="label-text font-medium text-base-content/80">آدرس ایمیل</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  v-model="form.email"
                  autocomplete="email"
                  placeholder="Email@Example.com"
                  required
                  class="input input-bordered w-full rounded-btn focus:input-primary text-left"
                />
              </div>

              <div class="form-control w-full">
                <label for="phone" class="label">
                  <span class="label-text font-medium text-base-content/80">شماره تماس</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  v-model="form.phone"
                  autocomplete="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  class="input input-bordered w-full rounded-btn focus:input-primary text-left"
                />
              </div>
            </div>

            <div class="form-control w-full">
              <label for="message" class="label">
                <span class="label-text font-medium text-base-content/80">متن پیام</span>
              </label>
              <textarea
                id="message"
                name="message"
                v-model="form.message"
                placeholder="پیام خود را در این قسمت بنویسید..."
                required
                rows="5"
                class="textarea textarea-bordered w-full rounded-btn focus:textarea-primary resize-none"
              ></textarea>
            </div>

            <button
              id="send-contact-message"
              type="submit"
              class="btn btn-primary w-full rounded-btn no-animation mt-2"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              {{ loading ? 'در حال ارسال...' : 'ارسال پیام' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, Mail, MapPin, Instagram, Send } from 'lucide-vue-next'

useHead({
  title: 'تماس با ما',
})

const { form, loading, departments, submitForm } = useContact()
const toast = useToast()

const contactInfo = [
  { label: 'تلفن تماس', value: '۰۲۱-۶۶۴۲۰۸۳۹', href: 'tel:+982166420839', icon: Phone },
  { label: 'ایمیل', value: 'info@example.com', href: 'mailto:info@example.com', icon: Mail },
  { label: 'آدرس', value: 'تهران، ایران', href: undefined, icon: MapPin },
]

const socialIcons = [
  { label: 'اینستاگرام', href: '#', svg: Instagram },
  { label: 'تلگرام', href: '#', svg: Send },
]

const handleSubmit = async () => {
  const result = await submitForm()

  if (result?.success) {
    toast.success('پیام شما با موفقیت ارسال شد.')
  } else {
    toast.error(result?.error || 'خطا در ارسال پیام. مجدداً تلاش کنید.')
  }
}
</script>