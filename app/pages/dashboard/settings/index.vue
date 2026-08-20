<template>
  <div class="p-6 bg-base-100 rounded-3xl shadow border border-base-200" dir="rtl">
    <div class="tabs tabs-boxed mb-6 p-1 bg-base-200/60 gap-1">
      <button
        :class="['tab grow transition-all duration-200 font-medium rounded-xl', activeTab === 'main' ? 'bg-primary! text-primary-content!' : '']"
        @click="activeTab = 'main'">صفحه اصلی</button>
      <button
        :class="['tab grow transition-all duration-200 font-medium rounded-xl', activeTab === 'cert' ? 'bg-primary! text-primary-content!' : '']"
        @click="activeTab = 'cert'">گواهی‌ها</button>
      <button
        :class="['tab grow transition-all duration-200 font-medium rounded-xl', activeTab === 'company' ? 'bg-primary! text-primary-content!' : '']"
        @click="activeTab = 'company'">اطلاعات شرکت</button>
    </div>
    <MainPageTab v-if="activeTab === 'main'" v-model="mainPage" @select-media="openMedia"
      @save="savePage('صفحه-اصلی', mainPage)" />
    <CertificatesTab v-if="activeTab === 'cert'" v-model="certPage" @select-media="openMedia"
      @save="savePage('گواهی-ها', certPage)" />
    <CompanyTab v-if="activeTab === 'company'" v-model="companyPage" @select-media="openMedia"
      @save="savePage('about-company', companyPage)" />

    <MediaManagerModal v-if="isMediaOpen" modalTitle="Select Asset" @close="isMediaOpen = false"
      @file-selected="handleFile" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAsyncData } from '#app'
import { useHomePage } from '~/composables/useHomePage'
import { useCertificates } from '~/composables/useCertificates'
import { useCompanyPage } from '~/composables/useDashboardSettings'
import { useToast } from '~/composables/useToast'
import { getApiErrorMessage, getApiSuccessMessage } from '~/utils/apiFeedback'

import MainPageTab from '~/components/dashboard/settings/MainPageTab.vue'
import CertificatesTab from '~/components/dashboard/settings/CertificatesTab.vue'
import CompanyTab from '~/components/dashboard/settings/CompanyTab.vue'
import MediaManagerModal from '~/components/dashboard/media/MediaSelector.vue'

definePageMeta({
  layout: 'dashboard'
})

const activeTab = ref<'main' | 'cert' | 'company'>('main')
const isMediaOpen = ref(false)
const mediaIndex = ref<number | null>(null)
const mediaType = ref<string | null>(null)

const { page: mainPage, fetchHomePage } = useHomePage()
const { certificatePage: certPage, fetchCertificates } = useCertificates()
const { companyPage, fetchCompanyPage } = useCompanyPage()
const toast = useToast()

await useAsyncData('settings-init', async () => {
  await Promise.all([fetchHomePage(), fetchCertificates(), fetchCompanyPage()])
  return true
})

const openMedia = (idx: number, type: string) => {
  mediaIndex.value = idx
  mediaType.value = type
  isMediaOpen.value = true
}

const handleFile = (url: string) => {
  if (mediaIndex.value === null) return

  if (mediaType.value === 'hero') {
    const item = mainPage.value?.content?.image_gallery?.[mediaIndex.value]
    if (item) item.url = url
  } else if (mediaType.value === 'brand') {
    const item = mainPage.value?.content?.brands?.[mediaIndex.value]
    if (item) item.logo_url = url
  } else if (mediaType.value === 'promise-icon') {
    const item = mainPage.value?.content?.brand_promise?.items?.[mediaIndex.value]
    if (item) item.icon = url
  } else if (mediaType.value === 'order-icon') {
    const item = mainPage.value?.content?.order_process?.steps?.[mediaIndex.value]
    if (item) item.icon = url
  } else if (mediaType.value === 'cert') {
    const item = certPage.value?.content?.Certificates?.[mediaIndex.value]
    if (item) item.image = url
  } else if (mediaType.value === 'team') {
    const item = companyPage.value?.content?.team?.[mediaIndex.value]
    if (item) item.photo_url = url
  }

  isMediaOpen.value = false
}

const savePage = async (slug: string, payload: any) => {
  try {
    const res = await $fetch<any>(`/api/pages/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      body: payload
    })
    const data = res?.data || res
    if (data) {
      toast.success(getApiSuccessMessage(res, 'تغییرات با موفقیت ذخیره شد!'))
    } else {
      toast.error('خطا در ثبت اطلاعات')
    }
  } catch (err: any) {
    toast.error(getApiErrorMessage(err, 'ذخیره تنظیمات انجام نشد.'))
  }
}
</script>
