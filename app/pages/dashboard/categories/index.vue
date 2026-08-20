<template>
  <div class="w-full space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-6 rounded-2xl border border-base-200 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold text-base-content">دسته‌بندی محصولات</h1>
        <p class="text-xs sm:text-sm text-base-content/60 mt-1">مدیریت، ساختاردهی درختی و چیدمان صفحات دسته‌بندی محصولات.</p>
      </div>
      <button
        @click="openCreateModal"
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
    
    <TransitionGroup v-else-if="parentCategories.length" name="reorder" tag="div" class="space-y-4">
      <div v-for="(parentCategory, index) in parentCategories" :key="`parent-wrap-${parentCategory.id}`"
        class="group/order rounded-xl transition-all duration-200"
        @dragover.prevent="setParentDropIndex($event, index)" @drop.prevent="dropParent">
      <div v-if="parentDropIndex === index" class="mb-4 h-20 rounded-xl border-2 border-dashed border-primary/55 bg-primary/8 transition-all" />
      <div draggable="true" :class="{ 'opacity-45 scale-[0.99]': draggedParentIndex === index, 'ring-2 ring-primary/35 bg-primary/5': highlightedParentId === parentCategory.id }"
        @dragstart="draggedParentIndex = index" @dragend="clearParentDrag">
      <CategoryParentGroup
        :key="`parent-${parentCategory.id}`" 
        :parent-category="parentCategory"
        :can-move-up="index > 0" :can-move-down="index < parentCategories.length - 1"
        @move-up="moveParent(index, -1)" @move-down="moveParent(index, 1)"
        @update-item="openEditModal"
        @remove-item="removeCategory"
        @edit-page="openPageEditorModal"
      />
      </div>
      <div v-if="index === parentCategories.length - 1 && parentDropIndex === parentCategories.length"
        class="mt-4 h-20 rounded-xl border-2 border-dashed border-primary/55 bg-primary/8 transition-all" />
      </div>
    </TransitionGroup>

    <div v-else class="flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-2xl border border-base-200 shadow-sm">
      <p class="text-sm text-base-content/50">هیچ دسته‌بندی محصولی در سیستم یافت نشد.</p>
    </div>

    <CategoryWorkspaceModal
      :is-open="isWorkspaceModalOpen"
      :category="selectedCategory"
      :all-categories="rawCategories"
      @close="closeWorkspaceModal"
      @saved="handleWorkspaceSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import CategoryParentGroup from '~/components/dashboard/category/CategoryParentGroup.vue';
import CategoryWorkspaceModal from '~/components/dashboard/category/CategoryWorkspaceModal.vue';
import { useToast } from '~/composables/useToast';
import { getApiErrorMessage } from '~/utils/apiFeedback';

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
  sort_order?: number | null;
  children: CategoryNode[];
}

interface ParentCategory extends CategoryNode {
  expanded: boolean;
}

interface ApiResponse {
  data: CategoryNode[];
}

const toast = useToast();
const isWorkspaceModalOpen = ref(false);
const isPageEditorOpen = ref(false);

const selectedCategory = ref<CategoryNode | null>(null);
const pageCategory = ref<CategoryNode | null>(null);
const draggedParentIndex = ref<number | null>(null);
const parentDropIndex = ref<number | null>(null);
const highlightedParentId = ref<number | string | null>(null);

const { data: categoriesResponse, status, error, refresh } = await useFetch<ApiResponse>('/api/categories', {
  lazy: true
});

const rawCategories = computed<CategoryNode[]>(() => {
  if (!categoriesResponse.value?.data) return [];
  
  return [...categoriesResponse.value.data]
    .sort((a, b) => a.name.localeCompare(b.name, 'fa'));
});

const compareOrder = (a: CategoryNode, b: CategoryNode) => {
  if (a.sort_order == null && b.sort_order == null) return a.name.localeCompare(b.name, 'fa')
  if (a.sort_order == null) return 1
  if (b.sort_order == null) return -1
  return a.sort_order - b.sort_order
}

const persistParentOrder = async (ordered: ParentCategory[]) => {
  ordered.forEach((item, index) => { item.sort_order = index })
  const positions = new Map(ordered.map((item, index) => [String(item.id), index]))
  categoriesResponse.value?.data?.forEach((item) => {
    const position = positions.get(String(item.id))
    if (position !== undefined) item.sort_order = position
  })
  try {
    await $fetch('/api/categories/reorder', {
      method: 'PUT',
      body: { parent_id: null, ids: ordered.map(item => item.id) },
    })
    await refresh()
  } catch (error) {
    toast.error(getApiErrorMessage(error, 'ذخیره ترتیب دسته‌بندی‌ها انجام نشد.'))
    await refresh()
  }
}

const moveParent = (index: number, offset: number) => {
  const ordered = [...parentCategories.value]
  const target = index + offset
  if (target < 0 || target >= ordered.length) return
  const [item] = ordered.splice(index, 1)
  if (!item) return
  ordered.splice(target, 0, item)
  highlightParent(item.id)
  persistParentOrder(ordered)
}

const setParentDropIndex = (event: DragEvent, index: number) => {
  if (draggedParentIndex.value == null) return
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect()
  parentDropIndex.value = event.clientY < bounds.top + bounds.height / 2 ? index : index + 1
}

const clearParentDrag = () => {
  draggedParentIndex.value = null
  parentDropIndex.value = null
}

const dropParent = () => {
  const sourceIndex = draggedParentIndex.value
  let targetIndex = parentDropIndex.value
  clearParentDrag()
  if (sourceIndex == null || targetIndex == null) return
  const ordered = [...parentCategories.value]
  const [item] = ordered.splice(sourceIndex, 1)
  if (!item) return
  if (sourceIndex < targetIndex) targetIndex -= 1
  if (sourceIndex === targetIndex) return
  ordered.splice(targetIndex, 0, item)
  highlightParent(item.id)
  persistParentOrder(ordered)
}

const highlightParent = (id: number | string) => {
  highlightedParentId.value = id
  window.setTimeout(() => { if (highlightedParentId.value === id) highlightedParentId.value = null }, 700)
}

const parentCategories = computed<ParentCategory[]>(() => {
  if (!categoriesResponse.value?.data) return [];
  const items = categoriesResponse.value.data;

  return items
    .filter(cat => !cat.parent_id && cat.slug !== 'blog') 
    .map(parent => ({
      ...parent,
      expanded: false,
      children: [...(parent.children || [])]
        .filter(child => child.slug !== 'blog') 
        .sort(compareOrder)
    }))
    .sort(compareOrder);
});

const openCreateModal = () => {
  selectedCategory.value = null;
  isWorkspaceModalOpen.value = true;
};

const openEditModal = (category: CategoryNode) => {
  selectedCategory.value = category;
  isWorkspaceModalOpen.value = true;
};

const closeWorkspaceModal = () => {
  isWorkspaceModalOpen.value = false;
  nextTick(() => {
    selectedCategory.value = null;
  });
};

const handleWorkspaceSaved = async () => {
  isWorkspaceModalOpen.value = false;
  selectedCategory.value = null;
  
  await nextTick();
  await refresh();
  toast.success('تنظیمات و ساختار با موفقیت بروزرسانی شد.');
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
  const flattenDeepestFirst = (node: CategoryNode): CategoryNode[] => {
    const result: CategoryNode[] = [];
    for (const child of node.children || []) {
      result.push(...flattenDeepestFirst(child));
    }
    result.push(node);
    return result;
  };

  const deletionOrder = flattenDeepestFirst(target as CategoryNode);

  try {
    for (const node of deletionOrder) {
      const slug = encodeURIComponent(node.slug);
      try {
        await $fetch(`/api/pages/${slug}`, {
          method: 'DELETE'
        });
      } catch (pageErr: any) {
        if (pageErr?.statusCode !== 404) {
          throw pageErr;
        }
      }

      await $fetch(`/api/categories/${slug}`, {
        method: 'DELETE'
      });
    }

    await refresh();
    toast.success('دسته‌بندی و زیرمجموعه‌های آن به همراه صفحات مرتبط با موفقیت حذف شدند.');
  } catch (err: any) {
    toast.error('خطا در حذف دسته‌بندی.');
    await refresh();
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

<style scoped>
.reorder-move { transition: transform 280ms ease; }
.reorder-enter-active, .reorder-leave-active { transition: opacity 180ms ease, transform 180ms ease; }
.reorder-enter-from, .reorder-leave-to { opacity: 0; transform: scale(.98); }
</style>
