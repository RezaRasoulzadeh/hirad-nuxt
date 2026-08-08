<template>
  <div class="min-h-screen overflow-hidden bg-base-100" dir="rtl">
    <section class="relative isolate border-b border-base-300 bg-base-200/40">
      <div class="absolute inset-0 -z-10 contact-grid opacity-60" />
      <div class="absolute -left-32 top-10 -z-10 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div class="container mx-auto px-4 py-14 text-center md:py-20">
        <p class="text-sm font-bold text-primary">ارتباط با تجهیز فرآیند هیراد</p>
        <h1 class="mt-3 text-3xl font-black text-base-content md:text-5xl">چطور می‌توانیم کمک کنیم؟</h1>
        <p class="mx-auto mt-5 max-w-2xl text-sm leading-8 text-base-content/60 md:text-base">
          برای دریافت مشاوره فنی، استعلام محصولات، پیگیری سفارش یا همکاری تجاری، از مسیر مناسب با کارشناسان ما در ارتباط
          باشید.
        </p>
        <div class="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-base-content/60">
          <span class="flex items-center gap-2 rounded-full border border-base-300 bg-base-100/80 px-4 py-2">
            <Headset class="size-4 text-primary" /> پاسخ‌گویی تخصصی
          </span>
          <span class="flex items-center gap-2 rounded-full border border-base-300 bg-base-100/80 px-4 py-2">
            <ShieldCheck class="size-4 text-primary" /> حفظ محرمانگی اطلاعات
          </span>
        </div>
      </div>
    </section>

    <main class="container mx-auto px-4 py-14 md:py-20">
      <div class="grid items-start gap-8 lg:grid-cols-[.85fr_1.15fr] xl:gap-12">
        <aside class="space-y-5">
          <div class="rounded-3xl border border-base-300 bg-base-100 p-6 md:p-8">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-bold text-primary">راه‌های ارتباطی</p>
                <h2 class="mt-2 text-xl font-black">تماس مستقیم با هیراد</h2>
              </div>
              <div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ContactRound class="size-6" />
              </div>
            </div>

            <div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <a v-for="item in directContacts" :key="item.value" :href="item.href"
                class="group flex min-h-24 items-center gap-4 rounded-2xl border border-base-300 bg-base-200/35 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5">
                <span
                  class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-base-100 text-primary shadow-sm">
                  <component :is="item.icon" class="size-5" />
                </span>
                <span class="min-w-0"><span class="block text-xs text-base-content/45">{{ item.label }}</span><span
                    class="mt-1 block truncate text-sm font-bold group-hover:text-primary" dir="ltr">{{ item.value
                    }}</span></span>
              </a>
            </div>

            <div class="mt-4 flex items-start gap-4 rounded-2xl border border-primary/15 bg-primary/5 p-5">
              <MapPin class="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h3 class="text-sm font-bold">{{ contactData.address.label }}</h3>
                <p class="mt-2 text-sm leading-7 text-base-content/60">{{ contactData.address.value }}</p>
              </div>
            </div>

            <div class="mt-7 border-t border-base-200 pt-6">
              <p class="text-center text-xs font-bold text-base-content/45">شبکه‌های اجتماعی</p>
              <div class="mt-4 flex items-center justify-center gap-3 sm:gap-4">
                <a v-for="social in regularSocialLinks" :key="social.label" :href="social.href" target="_blank"
                  rel="noopener noreferrer" :aria-label="social.label"
                  class="flex size-11 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/60 transition hover:-translate-y-1 hover:border-primary/30 hover:bg-primary hover:text-primary-content">
                  <component :is="social.icon" class="size-5" />
                </a>
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-base-300 bg-base-200/30 p-6 md:p-7">
            <div class="flex items-center gap-3"><span
                class="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <WifiOff class="size-5" />
              </span>
              <h2 class="font-bold">ارتباط در زمان قطعی اینترنت</h2>
            </div>
            <p class="mt-3 text-sm leading-7 text-base-content/55">در زمان اختلال اینترنت نیز می‌توانید از طریق بله و
              روبیکا با ما در ارتباط باشید.</p>
            <div class="mt-5 grid gap-3 sm:grid-cols-2">
              <a v-for="social in outageSocialLinks" :key="social.label" :href="social.href" target="_blank"
                rel="noopener noreferrer"
                class="group flex items-center justify-center gap-3 rounded-2xl border border-base-300 bg-base-100 px-4 py-3 transition hover:border-primary/30 hover:bg-primary/5">
                <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <component :is="social.icon" class="size-4" />
                </span>
                <span class="flex flex-col items-start"><span class="text-sm font-bold group-hover:text-primary">گفتگو
                    در {{ social.label }}</span><span v-if="mobilePhone" class="text-xs text-base-content/45"
                    dir="ltr">{{ mobilePhone.value }}</span></span>
              </a>
            </div>
          </div>
        </aside>

        <section class="rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl shadow-base-content/5 md:p-9">
          <div class="flex items-start justify-between gap-5 border-b border-base-200 pb-7">
            <div>
              <p class="text-xs font-bold text-primary">ارسال درخواست</p>
              <h2 class="mt-2 text-2xl font-black">پیام خود را برای ما بنویسید</h2>
              <p class="mt-3 text-sm leading-7 text-base-content/55">فیلدهای ستاره‌دار الزامی هستند.</p>
            </div>
            <div
              class="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-content sm:flex">
              <Send class="size-6" />
            </div>
          </div>

          <form class="mt-7 flex flex-col gap-5" novalidate @submit.prevent="handleSubmit">
            <div class="grid gap-5 md:grid-cols-2">
              <FormField label="نام و نام خانوادگی" for-id="name" required>
                <input id="name" v-model.trim="form.name" name="name" type="text" autocomplete="name"
                  placeholder="نام و نام خانوادگی" required class="input input-bordered w-full focus:input-primary" />
              </FormField>
              <FormField label="واحد مورد نظر" for-id="department" required>
                <select id="department" v-model="form.department" name="department" required
                  class="select select-bordered w-full focus:select-primary">
                  <option value="" disabled>انتخاب واحد</option>
                  <option v-for="dep in departments" :key="dep" :value="dep">{{ dep }}</option>
                </select>
              </FormField>
              <FormField label="آدرس ایمیل" for-id="email" required>
                <input id="email" v-model.trim="form.email" name="email" type="email" autocomplete="email"
                  placeholder="name@example.com" required dir="ltr"
                  class="input input-bordered w-full text-left focus:input-primary" />
              </FormField>
              <FormField label="شماره تماس" for-id="phone">
                <input id="phone" v-model.trim="form.phone" name="phone" type="tel" autocomplete="tel" inputmode="tel"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr"
                  class="input input-bordered w-full text-left focus:input-primary" />
              </FormField>
            </div>
            <FormField label="متن پیام" for-id="message" required>
              <textarea id="message" v-model.trim="form.message" name="message" rows="6" required
                placeholder="موضوع درخواست و جزئیات مورد نیاز را بنویسید..."
                class="textarea textarea-bordered w-full resize-y focus:textarea-primary" />
            </FormField>
            <div
              class="flex flex-col-reverse items-stretch gap-4 border-t border-base-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p class="flex items-center gap-2 text-xs leading-6 text-base-content/45">
                <LockKeyhole class="size-4 shrink-0" /> اطلاعات شما فقط برای پاسخ‌گویی به این درخواست استفاده می‌شود.
              </p>
              <button id="send-contact-message" type="submit" class="btn btn-primary min-w-40 gap-2 px-7"
                :disabled="loading">
                <span v-if="loading" class="loading loading-spinner loading-sm" />
                <Send v-else class="size-4" />{{ loading ? 'در حال ارسال...' : 'ارسال پیام' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ContactRound, Headset, Instagram, LockKeyhole, Mail, MapPin, MessageCircleCheck, MessageCircleMore, Phone, Send, ShieldCheck, WifiOff } from 'lucide-vue-next'
import contactData from '~/data/contact.json'

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

const directContacts = [
  ...contactData.phones.map(item => ({ ...item, icon: Phone })),
  ...contactData.emails.map(item => ({ ...item, icon: Mail }))
]

const socialIconMap = { whatsapp: MessageCircleMore, telegram: Send, instagram: Instagram, bale: MessageCircleCheck, rubika: MessageCircleMore }
const socialLinks = contactData.socials.map(item => ({ ...item, icon: socialIconMap[item.platform as keyof typeof socialIconMap] }))
const primaryEmail = contactData.emails.find(item => item.primary) ?? null
const mobilePhone = contactData.phones.find(item => item.label === 'تلفن همراه') ?? null
const regularSocialLinks = [
  ...socialLinks.filter(item => ['whatsapp', 'telegram', 'instagram'].includes(item.platform)),
  ...(primaryEmail ? [{ platform: 'email', label: 'ایمیل', href: primaryEmail.href, icon: Mail }] : [])
]
const outageSocialLinks = socialLinks.filter(item => ['bale', 'rubika'].includes(item.platform))

const handleSubmit = async () => {
  if (!form.value.name || !form.value.department || !form.value.email || !form.value.message) {
    toast.error('لطفاً فیلدهای الزامی را تکمیل کنید.')
    return
  }
  const result = await submitForm()
  result?.success ? toast.success('پیام شما با موفقیت ارسال شد.') : toast.error(result?.error || 'خطا در ارسال پیام. مجدداً تلاش کنید.')
}
</script>

<style scoped>
.contact-grid {
  background-image: linear-gradient(to right, color-mix(in oklab, var(--color-base-content) 5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-base-content) 5%, transparent) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: linear-gradient(to bottom, black, transparent);
}
</style>
