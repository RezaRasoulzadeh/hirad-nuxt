<template>
  <div dir="rtl" class="min-h-screen bg-base-100 pb-20">
    <BlogHero v-model="searchQuery" />

    <main class="container mx-auto px-6 pb-12 pt-24 lg:px-0">
      
      <div v-if="error" class="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div class="bg-error/10 rounded-full p-4">
          <WifiOff class="size-10 text-error" />
        </div>
        <h2 class="font-bold text-xl text-base-content">خطا در بارگذاری اطلاعات وبلاگ</h2>
        <p class="text-sm text-base-content/60 max-w-xs leading-relaxed">{{ error }}</p>
        <button class="btn btn-primary btn-sm px-6" @click="fetchPosts">تلاش مجدد</button>
      </div>

      <template v-else>
        <div v-if="filteredPosts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
          <BlogPostCard 
            v-for="post in filteredPosts" 
            :key="post.id" 
            :post="post" 
          />
        </div>

        <div v-else class="flex flex-col items-center justify-center py-24 text-center">
          <div class="bg-base-200 p-4 rounded-full mb-3 text-base-content/40">
            <SearchX class="size-8" />
          </div>
          <h3 class="text-lg font-bold text-base-content">مقاله‌ای یافت نشد</h3>
          <p class="text-sm text-base-content/50 mt-1">عبارت دیگری را برای جستجو امتحان کنید</p>
        </div>
      </template>

    </main>
  </div>
</template>

<script setup lang="ts">
import { WifiOff, SearchX } from 'lucide-vue-next'
import { useBlog } from '~/composables/useBlog'

const { filteredPosts, searchQuery, error, fetchPosts } = useBlog()

await fetchPosts()

useHead({
  title: 'وبلاگ و مقالات تخصصی | هیراد',
  meta: [
    { 
      name: 'description', 
      content: 'مقالات آموزشی، بررسی فناوری‌های نوین و تحلیل‌های عمیق حوزه محصولات صنعتی نفت، گاز و پتروشیمی در وبلاگ شرکت تجهیز فرآیند هیراد.' 
    }
  ]
})
</script>