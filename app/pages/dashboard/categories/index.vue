<template>
  <div class="w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">دسته‌ب بندی محصولات</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">مدیریت، ساختاردهی درختی و چیدمان صفحات دسته‌بندی محصولات.</p>
      </div>
      <button
        @click="isCreateModalOpen = true"
        class="btn btn-primary font-bold px-6 h-12 rounded-xl text-sm"
      >
        افزودن دسته‌بندی جدید
      </button>
    </div>

    <div v-if="status === 'pending'" class="space-y-4">
      <div v-for="n in 3" :key="n" class="h-16 rounded-xl bg-base-100 border border-base-200 animate-pulse"></div>
    </div>

    <div 
      v-else-if="error" 
      class="alert alert-error rounded-xl text-sm font-medium shadow-sm flex items-center justify-between"
    >
      <span>{{ error.message || 'خطا در دریافت اطلاعات دسته‌بندی‌ها.' }}</span>
      <button class="btn btn-sm btn-ghost text-error-content" @click="() => refresh()">تلاش مجدد</button>
    </div>
    
    <div v-else-if="parentCategories.length" class="space-y-4">
      <CategoryParentGroup 
        v-for="parentCategory in parentCategories" 
        :key="parentCategory.id"
        :parent-category="parentCategory"
        @update-item="openEditModal"
        @remove-item="removeCategory"
        @edit-page="openPageEditorModal"
      />
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      <p class="text-sm text-base-content/50">هیچ دسته‌بندی محصولی در سیستم یافت نشد.</p>
    </div>

    <CategoryModal 
      :is-open="isCreateModalOpen"
      :categories="rawCategories"
      @close="isCreateModalOpen = false"
      @save="handleSaveNewCategory"
    />

    <EditCategoryModal
      v-if="isEditModalOpen"
      :is-open="isEditModalOpen"
      :category="selectedCategory"
      :all-categories="rawCategories"
      @close="isEditModalOpen = false"
      @update="handleUpdateCategory"
    />

    <PageEditorModal
      v-if="isPageEditorOpen"
      :category="pageCategory"
      :is-open="isPageEditorOpen"
      @close="isPageEditorOpen = false"
      @save="handlePageSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CategoryParentGroup from '~/components/dashboard/category/CategoryParentGroup.vue';
import { useToast } from '~/composables/useToast';

definePageMeta({
  layout: 'dashboard'
});

interface CategoryNode {
  id: number | string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string | null;
  parent_id?: number | string | null;
  is_visible: boolean;
  sort_order?: number;
  children: CategoryNode[];
}

interface ParentCategory extends CategoryNode {
  expanded: boolean;
}

interface ApiResponse {
  data: CategoryNode[];
}

const toast = useToast();
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isPageEditorOpen = ref(false);

const selectedCategory = ref<CategoryNode | null>(null);
const pageCategory = ref<CategoryNode | null>(null);

const { data: categoriesResponse, status, error, refresh } = await useFetch<ApiResponse>('/api/dashboard/categories', {
  lazy: true
});

const rawCategories = computed<CategoryNode[]>(() => {
  if (!categoriesResponse.value?.data) return [];
  return categoriesResponse.value.data
    .filter(c => c.is_visible)
    .sort((a, b) => a.name.localeCompare(b.name, 'fa'));
});

const parentCategories = computed<ParentCategory[]>(() => {
  if (!categoriesResponse.value?.data) return [];
  const items = categoriesResponse.value.data;

  return items
    .filter(cat => !cat.parent_id && cat.is_visible)
    .map(parent => ({
      ...parent,
      expanded: false,
      children: (parent.children || [])
        .filter(child => child.is_visible)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
});

const handleSaveNewCategory = async (newCategory: any) => {
  try {
    await $fetch('/api/dashboard/categories', {
      method: 'POST',
      body: newCategory
    });
    isCreateModalOpen.value = false;
    await refresh();
    toast.success('دسته‌بندی جدید با موفقیت ایجاد شد.');
  } catch (err: any) {
    toast.error('خطا در ایجاد دسته‌بندی جدید.');
  }
};

const openEditModal = (category: CategoryNode) => {
  selectedCategory.value = category;
  isEditModalOpen.value = true;
};

const handleUpdateCategory = async (updatedCategory: CategoryNode) => {
  if (!updatedCategory.slug) return;
  try {
    await $fetch(`/api/dashboard/categories/${updatedCategory.slug}`, {
      method: 'PUT',
      body: updatedCategory
    });
    isEditModalOpen.value = false;
    await refresh();
    toast.success('دسته‌بندی با موفقیت بروزرسانی شد.');
  } catch (err: any) {
    toast.error('خطا در بروزرسانی دسته‌بندی.');
  }
};

const removeCategory = async (categoryId: number | string) => {
  let target: CategoryNode | null = null;
  const items = rawCategories.value;

  const findNode = (nodes: CategoryNode[]): boolean => {
    for (const n of nodes) {
      if (n.id === categoryId) { 
        target = n; 
        return true; 
      }
      if (n.children && n.children.length && findNode(n.children)) {
        return true;
      }
    }
    return false;
  };
  
  findNode(items);

  if (!target) {
    toast.error('دسته‌بندی مورد نظر یافت نشد.');
    return;
  }

  const confirmed = window.confirm('آیا از حذف این دسته‌بندی و تمام زیرمجموعه‌های آن اطمینان دارید؟');
  if (!confirmed) return;

  try {
    await $fetch(`/api/dashboard/categories/${(target as CategoryNode).slug}`, {
      method: 'DELETE'
    });
    await refresh();
    toast.success('دسته‌بندی با موفقیت حذف شد.');
  } catch (err: any) {
    toast.error('خطا در حذف دسته‌بندی.');
  }
};

const openPageEditorModal = (category: CategoryNode) => {
  pageCategory.value = category;
  isPageEditorOpen.value = true;
};

const handlePageSave = async () => {
  isPageEditorOpen.value = false;
  await refresh();
  toast.success('تنظیمات صفحه دسته‌بندی ذخیره شد.');
};
</script>