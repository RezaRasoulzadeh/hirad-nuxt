<template>
  <div>
    <HeroSection :page="page" />
    <!-- rest of page content -->
  </div>
</template>

<script setup lang="ts">
import HeroSection from '~/components/home/HeroSection.vue'
import { useHomePage } from '~/composables/useHomeData'

const { page, fetchHomePage } = useHomePage()

await useAsyncData('home-page', async () => {
  await fetchHomePage()
  return true
})

useSeoMeta({
  title: page.value?.meta_title,
  description: page.value?.meta_description,
})
</script>