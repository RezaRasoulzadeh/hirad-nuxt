<template>
  <section
    ref="sectionRef"
    class="relative w-full min-h-[89vh] flex items-center overflow-hidden"
    dir="rtl"
  >
    <img
      :src="BlogImg"
      alt="وبلاگ هیراد"
      class="absolute inset-0 w-full h-full object-cover select-none"
      loading="eager"
    />
    
<div class="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/10 via-60% to-transparent pointer-events-none z-0" />
    <div class="relative container mx-auto px-4 lg:px-20 pb-24 pt-[50vh] text-center z-10">
      <h1 class="text-3xl md:text-4xl font-black text-base-content mb-4 field-animate leading-tight" style="--fi: 0">
        مطالب تخصصی، بینش‌های صنعتی، و تازه ترین اخبار هیراد
      </h1>
      <p class="text-base md:text-lg text-base-content/70 field-animate leading-relaxed text-center" style="--fi: 1">
        در وبلاگ هیراد، مقالات آموزشی، بررسی‌ فناوری‌های نوین، و تحلیل‌های عمیق حوزه محصولات صنعتی را بخوانید. همیشه یک گام جلوتر باشید.
      </p>
    </div>

    <div 
      @click="scrollDown"
      class="hidden xl:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-30 cursor-pointer pointer-events-auto select-none group"
    >
      <span class="text-[10px] font-sans font-bold tracking-[0.125em] text-base-content/50 uppercase transition-colors group-hover:text-base-content/70">
        Scroll
      </span>
      <div class="relative w-6 h-10 rounded-3xl border-2 border-base-content/30 flex items-start justify-center pt-2 group-hover:border-base-content/50 transition-colors">
        <div class="w-1 h-2.5 bg-primary rounded-full animate-scroll-wheel"></div>
      </div>
      <ArrowDown class="size-3.5 text-base-content/40 transition-all group-hover:translate-y-0.5 group-hover:text-base-content/60" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDown } from 'lucide-vue-next'
import BlogImg from '~/assets/Blog.jpg'

const sectionRef = ref<HTMLElement | null>(null)

const scrollDown = () => {
  if (sectionRef.value) {
    const nextElement = sectionRef.value.nextElementSibling
    if (nextElement) {
      nextElement.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({
        top: sectionRef.value.offsetHeight,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style scoped>
@keyframes scroll-wheel {
  0% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(12px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
}
.animate-scroll-wheel {
  animation: scroll-wheel 2s infinite ease-in-out;
}
</style>