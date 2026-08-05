<template>
  <div dir="rtl" class="min-h-screen bg-base-200/30">
    <div class="container mx-auto px-4 lg:px-0 py-12 md:py-20">

      <div class="text-center mb-12 field-animate" style="--fi: 0">
        <h1 class="text-3xl md:text-4xl font-black text-base-content mb-3">
          تماس با ما
        </h1>
        <span class="mx-auto mb-5 block h-0.5 w-16 rounded-full bg-primary"></span>
        <p class="text-base-content/60 text-sm md:text-base">
          اینجا هستیم که کمک کنیم! سوالی درباره محصولات، خدمات، یا سفارش‌ها دارید؟ یا دنبال مشاوره تخصصی هستید؟
        </p>
        <p class="text-base-content/60 text-sm md:text-base">
          با بخش
          مشاوره، فروش، یا حتی مدیریت می‌تونید راحت در تماس باشید.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-start">

        <div class="card-lift bg-base-100 border rounded-3xl border-base-300 p-6 md:p-8 field-animate" style="--fi: 1">
          <h2 class="text-lg font-bold text-base-content mb-6">راه‌های ارتباطی</h2>

          <div class="relative flex flex-col gap-7">
            <div class="absolute right-4.75 top-3 bottom-3 w-px bg-base-300" aria-hidden="true"></div>

            <div v-for="(item, idx) in contactInfo" :key="item.label" class="relative flex items-start gap-4">
              <div
                class="relative z-10 flex items-center justify-center w-10 h-10 rounded-full bg-base-300 text-primary shrink-0">
                <component :is="item.icon" class="size-5" />
              </div>
              <div class="flex flex-col gap-0.5 pt-1.5">
                <span class="text-xs text-base-content/50 font-bold">{{ item.label }}</span>
                <component :is="item.href ? 'a' : 'span'" :href="item.href" class="text-base-content font-medium"
                  :class="item.href ? 'hover:text-primary transition-colors' : ''">
                  {{ item.value }}
                </component>
              </div>
            </div>
          </div>

          <div class="divider my-6"></div>

          <div class="flex flex-col items-center gap-4">
            <span class="text-xs text-base-content/50 font-bold">شبکه‌های اجتماعی</span>

            <div class="flex items-center justify-center gap-3">
              <a v-for="icon in socialIcons" :key="icon.label" :href="icon.href" target="_blank"
                rel="noopener noreferrer" :aria-label="icon.label"
                class="flex items-center justify-center w-11 h-11 rounded-full border border-base-300 bg-base-200/60 text-base-content/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary">
                <component :is="icon.svg" class="size-5" />
              </a>
            </div>

            <div class="w-full rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col gap-4">
              <div class="flex flex-col items-center gap-2 text-center">
                <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <WifiOff class="size-5" />
                </div>
                <p class="text-sm text-base-content/70 leading-relaxed">
                  در هنگام قطعی اینترنت در پیام‌رسان‌های بله و روبیکا همراه شما هستیم.
                </p>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch justify-center gap-3">
                <a href="https://ble.ir/09352557163" target="_blank" rel="noopener noreferrer"
                  class="group flex flex-1 items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/5">
                  <span class="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary shrink-0">
                    <MessageCircleCheck class="size-4" />
                  </span>
                  <span class="flex flex-col items-start">
                    <span class="text-sm font-bold text-base-content transition-colors group-hover:text-primary">گفتگو در بله</span>
                    <span class="text-xs text-base-content/50" dir="ltr">۰۹۳۵-۲۵۵۷۱۶۳</span>
                  </span>
                </a>

                <a href="#" target="_blank" rel="noopener noreferrer"
                  class="group flex flex-1 items-center justify-center gap-3 rounded-xl border border-base-300 bg-base-100 px-4 py-3 transition-colors duration-200 hover:border-primary/30 hover:bg-primary/5">
                  <span class="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary shrink-0">
                    <MessageCircleMore class="size-4" />
                  </span>
                  <span class="flex flex-col items-start">
                    <span class="text-sm font-bold text-base-content transition-colors group-hover:text-primary">گفتگو در روبیکا</span>
                    <span class="text-xs text-base-content/50" dir="ltr">۰۹۳۵-۲۵۵۷۱۶۳</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="card-lift bg-base-100 rounded-3xl border border-base-300 p-6 md:p-8 field-animate" style="--fi: 2">
          <form @submit.prevent="handleSubmit" class="flex flex-col gap-5" novalidate>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="form-control w-full">
                <!-- Added pb-2 here -->
                <label for="name" class="label pb-2">
                  <span class="label-text font-medium text-base-content/80">نام و نام خانوادگی</span>
                </label>
                <input id="name" name="name" type="text" v-model="form.name" autocomplete="name"
                  placeholder="نام خود را وارد کنید" required
                  class="input input-bordered w-full rounded-btn focus:input-primary" />
              </div>

              <div class="form-control w-full">
                <!-- Added pb-2 here -->
                <label for="department" class="label pb-2">
                  <span class="label-text font-medium text-base-content/80">بخش مربوطه</span>
                </label>
                <select id="department" name="department" v-model="form.department" required
                  class="select select-bordered w-full rounded-btn focus:select-primary">
                  <option value="" disabled selected>انتخاب دپارتمان</option>
                  <option v-for="dep in departments" :key="dep" :value="dep">{{ dep }}</option>
                </select>
              </div>

              <div class="form-control w-full">
                <!-- Added pb-2 here -->
                <label for="email" class="label pb-2">
                  <span class="label-text font-medium text-base-content/80">آدرس ایمیل</span>
                </label>
                <input id="email" name="email" type="email" v-model="form.email" autocomplete="email"
                  placeholder="Email@Example.com" required
                  class="input input-bordered w-full rounded-btn focus:input-primary text-left" />
              </div>

              <div class="form-control w-full">
                <!-- Added pb-2 here -->
                <label for="phone" class="label pb-2">
                  <span class="label-text font-medium text-base-content/80">شماره تماس</span>
                </label>
                <input id="phone" name="phone" type="tel" v-model="form.phone" autocomplete="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  class="input input-bordered w-full rounded-btn focus:input-primary text-left" />
              </div>
            </div>

            <div class="form-control w-full">
              <!-- Added pb-2 here -->
              <label for="message" class="label pb-2">
                <span class="label-text font-medium text-base-content/80">متن پیام</span>
              </label>
              <textarea id="message" name="message" v-model="form.message"
                placeholder="پیام خود را در این قسمت بنویسید..." required rows="5"
                class="textarea textarea-bordered w-full rounded-btn focus:textarea-primary resize-none"></textarea>
            </div>

            <button id="send-contact-message" type="submit" class="btn btn-primary w-full rounded-btn no-animation mt-2 gap-2"
              :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-sm"></span>
              <Send v-else class="size-4" />
              {{ loading ? 'در حال ارسال...' : 'ارسال پیام' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Phone, Mail, MapPin, Instagram, Send, MessageCircleMore, MessageCircleCheck, WifiOff } from 'lucide-vue-next'

useSeoMeta({
  title: 'تماس با ما | هیراد',
  ogTitle: 'تماس با ما | شرکت فنی مهندسی هیراد',
  
  description: 'با بخش مشاوره تخصصی، فروش، پشتیبانی یا مدیریت هیراد در ارتباط باشید. فرم تماس را پر کنید یا از طریق شماره‌های تماس و شبکه‌های اجتماعی با ما گفتگو کنید.',
  ogDescription: 'با بخش مشاوره تخصصی، فروش، پشتیبانی یا مدیریت هیراد در ارتباط باشید. فرم تماس را پر کنید یا از طریق شماره‌های تماس و شبکه‌های اجتماعی با ما گفتگو کنید.',
  
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
const { form, loading, departments, submitForm } = useContact()
const toast = useToast()

const contactInfo = [
  { label: 'تلفن تماس ۱', value: '۰۲۱-۶۶۴۲۰۸۳۹', href: 'tel:+982166420839', icon: Phone },
  { label: 'تلفن تماس ۲', value: '۰۲۱-۶۶۴۲۹۸۱۶', href: 'tel:+982166429816', icon: Phone },
  { label: 'تلفن همراه', value: '۰۹۳۵-۲۵۵۷۱۶۳', href: 'tel:+989352557163', icon: Phone },
  { label: 'ایمیل ۱', value: 'info@hiradepc.ir', href: 'mailto:info@hiradepc.ir', icon: Mail },
  { label: 'ایمیل ۲', value: 'hiradepc@gmail.com', href: 'mailto:hiradepc@gmail.com', icon: Mail },
  { label: 'آدرس', value: 'تهران، خیابان ستارخان، خیابان نیایش، کوچه موثق نژاد، پلاک ۱، واحد یک', href: undefined, icon: MapPin },
]

const socialIcons = [
  { label: 'WhatsApp', href: '#', svg: MessageCircleMore },
  { label: 'Telegram', href: '#', svg: Send },
  { label: 'Instagram', href: '#', svg: Instagram },
  { label: 'Bale', href: 'https://ble.ir/09352557163', svg: MessageCircleCheck },
  { label: 'Email', href: 'mailto:info@hiradepc.ir', svg: Mail }
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