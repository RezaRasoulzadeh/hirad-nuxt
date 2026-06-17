<template>
  <div class="bg-base-200/30 min-h-screen">
    <div v-if="pending" class="min-h-screen flex items-center justify-center bg-base-100">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div
      v-else-if="error || !hero?.titleFa"
      class="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4 bg-base-100"
      dir="rtl"
    >
      <div class="bg-error/10 rounded-full p-5">
        <WifiOff class="size-8 text-error" />
      </div>
      <p class="text-base-content font-bold text-lg">خطا در دریافت اطلاعات</p>
      <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
      <button class="btn btn-sm btn-error btn-soft" @click="handleRefresh">تلاش مجدد</button>
    </div>

    <template v-else>
      <AboutHero
        :titleFa="hero.titleFa"
        :summaryFa="hero.summaryFa"
        :coverImage="hero.coverImage"
      />

      <AboutIntro
        :aboutFa="intro.aboutFa"
        :foundedFa="intro.foundedFa"
        :headquartersFa="intro.headquartersFa"
        :missionFa="intro.missionFa"
        :registrationNumber="intro.registrationNumber"
      />

      <AboutStats :stats="stats" />

      <AboutTimeline :history="history" />

      <AboutMap :points="mapPoints" />
      
      <CertificateCarousel :data="certificatePage"/>
      
      <AboutTeam :team="team" />
      <WhyChooseUs />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { WifiOff } from 'lucide-vue-next'
import CertificateCarousel from '~/components/home/CertificateCarousel.vue'
import WhyChooseUs from '~/components/category/WhyChooseUs.vue'

// 1. Capture Nuxt instance context immediately at top-level
const requestUrl = useRequestURL()
const siteOrigin = requestUrl.origin

const { certificatePage, fetchCertificates } = useCertificates()
const { 
  pending: aboutPending, 
  error: aboutError, 
  refresh: aboutRefresh, 
  hero, 
  intro, 
  stats, 
  history, 
  mapPoints, 
  team 
} = useAboutCompany()

const { pending: certPending, error: certError, refresh: certRefresh } = await useAsyncData(
  'about-certificates',
  () => fetchCertificates()
)

const pending = computed(() => aboutPending.value || certPending.value)
const error = computed(() => aboutError.value || certError.value)

const handleRefresh = () => {
  aboutRefresh()
  certRefresh()
}

// 2. Safe reactive metadata configurations
const seoTitle = computed(() => `درباره ما | ${hero.value?.titleFa || 'تجهیز فرآیند هیراد'}`)
const seoDesc = computed(() => hero.value?.summaryFa || 'تأمین کننده تخصصی شیرآلات صنعتی، اتصالات، فلنج، ابزار دقیق و گسکت برای صنایع نفت، گاز و پتروشیمی.')

useSeoMeta({
  title: seoTitle,
  ogTitle: seoTitle,
  description: seoDesc,
  ogDescription: seoDesc,
  ogType: 'website',
  ogImage: computed(() => hero.value?.coverImage || ''),
  twitterCard: 'summary_large_image',
})

// 3. Structured data schema injection utilizing invariant parent variable state
useHead({
  htmlAttrs: {
    lang: 'fa',
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': hero.value?.titleFa || 'تجهیز فرآیند هیراد',
        'alternateName': 'Hirad Tajhiz Farayand',
        'url': siteOrigin,
        'logo': `${siteOrigin}/logo.png`,
        'foundingDate': intro.value?.foundedFa || '2018',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': intro.value?.headquartersFa || 'Tehran',
          'addressCountry': 'IR'
        },
        'description': seoDesc.value
      }))
    }
  ]
})
</script>