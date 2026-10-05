<template>
  <div>
    <HeroSection :page="page || null" />
    <AboutSection :page="page" />
    <OrderProcess :page="page" />
    <Catalogue />
    <CertificateCarousel :data="certificatePage" border-side="left" />
    <BrandPromisses :page="page" />
    <BrandsSection :brands="page?.content?.brands || []" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import HeroSection from '~/components/home/HeroSection.vue'
import BrandsSection from '~/components/home/BrandsSection.vue'
import AboutSection from '~/components/home/AboutSection.vue'
import OrderProcess from '~/components/home/OrderProcess.vue'
import Catalogue from '~/components/home/Catalogue.vue'
import CertificateCarousel from '~/components/home/CertificateCarousel.vue'
import { useHomePage } from '~/composables/useHomePage'
import { useCertificates } from '~/composables/useCertificates'
import BrandPromisses from '~/components/home/BrandPromisses.vue'
import HeroImage from '~/assets/hero.jpg'
import LogoImage from '~/assets/Logo.png'
import { normalizeLocalAssetUrl } from '~/utils/resolveAssetUrl'

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

const requestUrl = useRequestURL()
const homepageUrl = computed(() => new URL('/', requestUrl.origin).toString())
const seoTitle = computed(() => page.value?.title?.trim() || 'تجهیز فرآیند هیراد | تجهیزات صنعتی')
const seoDesc = computed(() => page.value?.summary?.trim()
  || page.value?.meta_description?.trim()
  || 'تجهیز فرآیند هیراد، تأمین‌کننده شیرآلات صنعتی، اتصالات، فلنج و تجهیزات موردنیاز صنایع نفت، گاز و پتروشیمی.')
const ogTitle = computed(() => page.value?.meta_title?.trim() || seoTitle.value)
const ogDesc = computed(() => page.value?.meta_description?.trim() || seoDesc.value)
const socialImage = computed(() => new URL(normalizeLocalAssetUrl(HeroImage), requestUrl.origin).toString())
const organizationLogo = computed(() => new URL(normalizeLocalAssetUrl(LogoImage), requestUrl.origin).toString())

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle,
  ogDescription: ogDesc,
  ogSiteName: 'تجهیز فرآیند هیراد',
  ogLocale: 'fa_IR',
  ogUrl: homepageUrl,
  ogImage: socialImage,
  ogImageAlt: 'تجهیز فرآیند هیراد؛ تأمین تجهیزات صنعتی',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDesc,
  twitterImage: socialImage,
  twitterImageAlt: 'تجهیز فرآیند هیراد؛ تأمین تجهیزات صنعتی',
  ogType: 'website'
})

useHead({
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl'
  },
  link: [{ rel: 'canonical', href: homepageUrl.value }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${homepageUrl.value}#website`,
          url: homepageUrl.value,
          name: 'تجهیز فرآیند هیراد',
          alternateName: 'Hirad',
          inLanguage: 'fa-IR',
          publisher: { '@id': `${homepageUrl.value}#organization` }
        },
        {
          '@type': 'Organization',
          '@id': `${homepageUrl.value}#organization`,
          url: homepageUrl.value,
          name: 'شرکت تجهیز فرآیند هیراد',
          alternateName: 'HIRAD Process Equipment Co.',
          logo: organizationLogo.value
        }
      ]
    }).replace(/</g, '\\u003c')
  }]
})
</script>
