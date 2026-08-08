<template>
  <div>
    <HeroSection :page="page || null" />
    <AboutSection />
    <OrderProcess />
    <Catalogue />
    <CertificateCarousel :data="certificatePage" />
    <BrandsSection :brands="page?.content?.brands || []" />
    <Subscription />
    <BrandPromisses />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeroSection from '~/components/home/HeroSection.vue'
import BrandsSection from '~/components/home/BrandsSection.vue'
import AboutSection from '~/components/home/AboutSection.vue'
import OrderProcess from '~/components/home/OrderProcess.vue'
import Subscription from '~/components/home/Subscription.vue'
import Catalogue from '~/components/home/Catalogue.vue'
import CertificateCarousel from '~/components/home/CertificateCarousel.vue'
import { useHomePage } from '~/composables/useHomePage'
import { useCertificates } from '~/composables/useCertificates'
import BrandPromisses from '~/components/home/BrandPromisses.vue'

const { page, fetchHomePage } = useHomePage()
const { certificatePage, fetchCertificates } = useCertificates()

const { data } = await useAsyncData('home-and-certificates', async () => {
  await Promise.all([
    fetchHomePage(),
    fetchCertificates()
  ])
  return {
    homePage: page.value,
    certificates: certificatePage.value
  }
})

if (data.value) {
  page.value = data.value.homePage
  certificatePage.value = data.value.certificates
}

const seoTitle = computed(() => page.value?.title || 'تجهیزات صنعتی هیراد')
const seoDesc = computed(() => page.value?.summary || '')
const ogTitleEn = computed(() => page.value?.meta_title || '')
const ogDescEn = computed(() => page.value?.meta_description || '')

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: ogTitleEn,
  ogDescription: ogDescEn,
  twitterTitle: seoTitle,
  twitterDescription: seoDesc,
  ogType: 'website',
})

useHead({
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl'
  }
})
</script>
