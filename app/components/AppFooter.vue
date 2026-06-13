<script setup lang="ts">
interface FooterSettings {
  site_name?: string
  description?: string
  address?: string
  phones?: string[]
  emails?: string[]
  links?: { text: string; url: string }[]
}

const config = useRuntimeConfig()
const baseURL = config.public.baseURL as string

const { data } = await useAsyncData<FooterSettings>('footer', () =>
  $fetch<FooterSettings>(`${baseURL}/settings`)
)

const siteName = computed(() => data.value?.site_name ?? 'شرکت هیراد')
const description = computed(() => data.value?.description ?? '')
const address = computed(() => data.value?.address ?? '')
const phones = computed<string[]>(() => data.value?.phones ?? [])
const emails = computed<string[]>(() => data.value?.emails ?? [])
const links = computed<{ text: string; url: string }[]>(() => data.value?.links ?? [])
</script>

<template>
  <footer class="bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-neutral-800">
    <div class="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

      <div class="flex flex-col gap-4">
        <img src="~/assets/Logo-wide.png" alt="لوگو" class="h-20 object-contain object-right" />
        <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">لینک‌های مفید</h3>
        <ul class="flex flex-col gap-3">
          <li v-for="(link, i) in links" :key="i" class="flex items-center gap-2">
            <UIcon name="i-lucide-link" class="w-4 h-4 text-brand flex-shrink-0" />
            <ULink
              :to="link.url"
              target="_blank"
              rel="noopener"
              class="text-sm text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors"
            >
              {{ link.text }}
            </ULink>
          </li>
        </ul>
      </div>

      <div class="flex flex-col gap-4">
        <h3 class="text-base font-bold text-gray-800 dark:text-gray-100">اطلاعات تماس</h3>
        
        <div v-if="address" class="flex items-start gap-2">
          <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <p class="text-sm leading-relaxed">{{ address }}</p>
        </div>

        <ul class="flex flex-col gap-2">
          <li v-for="(phone, i) in phones" :key="i" class="flex items-center gap-2">
            <UIcon name="i-lucide-phone" class="w-4 h-4 text-brand flex-shrink-0" />
            <ULink
              :to="`tel:${phone}`"
              class="text-sm text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors"
            >
              {{ phone }}
            </ULink>
          </li>
        </ul>

        <ul class="flex flex-col gap-2">
          <li v-for="(email, i) in emails" :key="i" class="flex items-center gap-2">
            <UIcon name="i-lucide-mail" class="w-4 h-4 text-brand flex-shrink-0" />
            <ULink
              :to="`mailto:${email}`"
              class="text-sm text-gray-700 dark:text-gray-300 hover:text-brand dark:hover:text-brand transition-colors"
            >
              {{ email }}
            </ULink>
          </li>
        </ul>
      </div>

    </div>

    <div class="bg-brand py-3 text-center text-white text-sm">
      تمامی حقوق برای {{ siteName }} محفوظ است.
    </div>
  </footer>
</template>