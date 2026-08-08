<template>
  <div class="drawer lg:drawer-open min-h-screen bg-base-200" dir="rtl">
    <input id="dashboard-drawer" type="checkbox" class="drawer-toggle" v-model="isDrawerOpen" />
    
    <div class="drawer-content flex flex-col min-h-screen pb-20 lg:pb-0">
      <header class="navbar bg-base-100 border-b border-base-300 px-4 lg:px-8 sticky top-0 z-30 flex justify-between items-center w-full">
        <div class="flex items-center justify-start lg:hidden">
          <label for="dashboard-drawer" class="btn btn-square btn-ghost drawer-button">
            <Menu class="size-5" />
          </label>
        </div>

        <div class="flex items-center justify-center flex-1">
          <DashboardBreadCrumbs :menu-items="navigationItems" />
        </div>

        <div class="flex items-center gap-2 sm:gap-4 justify-end">
          <button v-if="canUseDarkMode" @click="toggleTheme" class="btn btn-ghost btn-circle btn-sm sm:btn-md">
            <Sun v-if="currentTheme === 'dark'" class="size-5" />
            <Moon v-else class="size-5" />
          </button>
          
          <div class="h-6 w-px bg-base-300"></div>
          
          <button @click="handleLogout" class="btn btn-ghost btn-sm text-error font-medium gap-2">
            <LogOut class="size-4" />
            <span class="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      <main class="flex-1 p-4 lg:p-8 mx-auto w-full container">
        <slot />
      </main>
      <GlobalToast />

      <div class="dock dock-md lg:hidden border-t border-base-300 bg-base-100 z-30">
        <NuxtLink 
          v-for="dockItem in dockNavigationItems" 
          :key="dockItem.path"
          :to="dockItem.path"
          active-class="dock-active text-primary"
          class="text-base-content/70"
        >
          <component :is="dockItem.icon" class="size-5" />
          <span class="dock-label text-xs font-medium">{{ dockItem.name }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="drawer-side z-40">
      <label for="dashboard-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <aside class="w-80 min-h-screen bg-base-100 border-l border-base-300 flex flex-col justify-between">
        <div class="w-full">
          <div class="p-6 border-b border-base-200 flex items-center justify-center w-full bg-base-100 sticky top-0 z-10">
            <NuxtLink to="/" class="flex justify-start w-full">
              <img src="/assets/Logo-wide.png" alt="Logo" class="w-46 max-w-full h-auto block dark:hidden" />
              <img src="/assets/Logo-wide-dark.png" alt="Logo" class="w-46 max-w-full h-auto hidden dark:block" />
            </NuxtLink>
          </div>

          <ul class="menu p-4 gap-1 text-base-content/80 text-base w-full">
            <li v-for="item in navigationItems" :key="item.path" class="w-full">
              <NuxtLink 
                :to="item.path" 
                class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 w-full"
                active-class="bg-primary text-primary-content font-medium shadow-sm"
                @click="closeDrawer"
              >
                <component :is="item.icon" class="size-5 shrink-0" />
                <span>{{ item.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="p-4 border-t border-base-200 bg-base-200/30 text-xs text-base-content/50 text-center w-full">
           سیستم مدیریت نسخه ۱.۰
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  Menu, LogOut, Sun, Moon, LayoutDashboard, 
  FolderTree, Package, Image, FileText, 
  Mail, Bell, Settings 
} from 'lucide-vue-next';
import GlobalToast from '~/components/shared/GlobalToast.vue';

const auth = useAuth();
const toast = useToast();
const isDrawerOpen = ref(false);
const currentTheme = ref('light');
const canUseDarkMode = import.meta.dev;

const navigationItems = [
  { name: 'داشبورد', path: '/dashboard', icon: LayoutDashboard },
  { name: 'دسته‌بندی محصولات', path: '/dashboard/categories', icon: FolderTree },
  { name: 'محصولات', path: '/dashboard/products', icon: Package },
  { name: 'مدیریت رسانه', path: '/dashboard/media', icon: Image },
  { name: 'بلاگ', path: '/dashboard/blog', icon: FileText },
  { name: 'پیام‌ها', path: '/dashboard/forms', icon: Mail },
  { name: 'خبرنامه', path: '/dashboard/subscribers', icon: Bell },
  { name: 'تنظیمات', path: '/dashboard/settings', icon: Settings },
];

const dockNavigationItems = [
  { name: 'داشبورد', path: '/dashboard', icon: LayoutDashboard },
  { name: 'دسته‌بندی', path: '/dashboard/categories', icon: FolderTree },
  { name: 'محصولات', path: '/dashboard/products', icon: Package },
  { name: 'پیام‌ها', path: '/dashboard/forms', icon: Mail },
];

onMounted(() => {
  if (!canUseDarkMode) {
    currentTheme.value = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
    return;
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  currentTheme.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
});

const toggleTheme = () => {
  if (!canUseDarkMode) return;

  const targetTheme = currentTheme.value === 'light' ? 'dark' : 'light';
  currentTheme.value = targetTheme;
  localStorage.setItem('theme', targetTheme);
  document.documentElement.setAttribute('data-theme', targetTheme);
};

const closeDrawer = () => {
  isDrawerOpen.value = false;
};

const handleLogout = async () => {
  try {
    await auth.logout();
    toast.success('خروج با موفقیت انجام شد');
    navigateTo('/login');
  } catch (err) {
    toast.error('خطایی در سیستم رخ داد');
  }
};
</script>
