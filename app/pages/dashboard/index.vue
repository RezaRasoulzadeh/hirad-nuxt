<!-- app/pages/dashboard/index.vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-base-content">خوش آمدید!</h1>
      <p class="text-sm text-base-content/60 mt-1">خلاصه‌ای از وضعیت و آمار کلیدی سیستم تا این لحظه.</p>
    </div>

    <div v-if="status === 'pending'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="n in 4" :key="n" class="h-28 rounded-box bg-base-100 border border-base-200 animate-pulse"></div>
    </div>

    <section
      v-else-if="error"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4 bg-base-100 rounded-box border border-base-200 shadow-sm"
    >
      <div class="bg-error/10 rounded-full p-5">
        <WifiOff class="size-8 text-error" />
      </div>
      <p class="text-base-content font-bold">خطا در دریافت آمار داشبورد</p>
      <p class="text-base-content/50 text-sm">لطفاً اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
      <button class="btn btn-sm btn-error btn-soft" @click="executeRefresh">تلاش مجدد</button>
    </section>

    <section
      v-else-if="!statsData || Object.keys(statsData).length === 0"
      class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4 bg-base-100 rounded-box border border-base-200 shadow-sm"
    >
      <div class="bg-base-200 rounded-full p-5">
        <SearchX class="size-8 text-base-content" />
      </div>
      <p class="text-base-content font-bold">آماری یافت نشد</p>
      <p class="text-base-content/50 text-sm">هیچ داده آماری در سیستم ثبت نشده است.</p>
    </section>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard 
        title="دسته‌بندی‌ها" 
        :count="statsData?.product_categories ?? 0" 
        icon="Folder" 
      />
      <DashboardCard 
        title="محصولات" 
        :count="statsData?.products ?? 0" 
        icon="Package" 
      />
      <DashboardCard 
        title="بلاگ‌ها" 
        :count="statsData?.blog_pages ?? 0" 
        icon="Newspaper" 
      />
      <DashboardCard 
        title="پیام‌های دریافتی" 
        :count="statsData?.form_submissions ?? 0" 
        icon="Mail" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { WifiOff, SearchX } from 'lucide-vue-next';
import DashboardCard from '~/components/dashboard/DashboardCard.vue';

definePageMeta({
  layout: 'dashboard'
});

interface StatsResponse {
  product_categories: number;
  products: number;
  blog_pages: number;
  form_submissions: number;
  unread_form_submissions: number;
}

const { data: statsData, status, error, refresh } = await useFetch('/api/dashboard/stats', {
  lazy: true,
  transform: (res: any) => res.data as StatsResponse
});

const executeRefresh = () => {
  refresh();
};
</script>