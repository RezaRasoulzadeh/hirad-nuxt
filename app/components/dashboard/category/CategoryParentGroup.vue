<template>
  <div class="group collapse collapse-arrow border border-base-300 bg-base-100 rounded-xl overflow-hidden shadow-sm">
    <input type="checkbox" :checked="parentCategory.expanded" @change="toggleParent" class="peer" />

    <div
      class="collapse-title flex items-center justify-between pl-12 pr-4 py-4 bg-base-100 peer-checked:border-b peer-checked:border-base-200 transition-none min-h-0">
      <div class="flex items-center gap-3">
        <img v-if="parentCategory.image_url" :src="config.public.apiBase + parentCategory.image_url"
          :alt="parentCategory.name" class="size-8 object-contain transition-all 
          [:is([data-theme=dark],.dark)_&]:not-data-error:filter-[brightness(0)_invert(80%)]" loading="lazy" />

        <div class="flex flex-col gap-0.5">
          <h3 class="text-base sm:text-lg font-bold text-base-content">{{ parentCategory.name }}</h3>
          <span class="text-xs text-base-content/50 font-medium">
            {{ parentCategory.children.length.toLocaleString('fa-IR') }} زیرمجموعه مستقیم
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1 relative z-10" @click.stop>
        <button @click="$emit('edit-page', parentCategory)" class="btn btn-square btn-sm btn-ghost text-info">
          <FileText class="size-4.5" />
        </button>
        <button @click="$emit('update-item', parentCategory)"
          class="btn btn-square btn-sm btn-ghost text-base-content/70">
          <PenSquare class="size-4.5" />
        </button>
        <button @click="$emit('remove-item', parentCategory.id)"
          class="btn btn-square btn-sm btn-ghost text-error">
          <Trash class="size-4.5" />
        </button>
      </div>
    </div>

    <div class="collapse-content p-0! bg-base-100">
      <div v-if="parentCategory.children.length > 0" class="divide-y divide-base-200">
        <CategoryItem v-for="childCategory in parentCategory.children" :key="childCategory.id"
          :category="childCategory" @update-item="(item) => $emit('update-item', item)"
          @remove-item="(id) => $emit('remove-item', id)" @edit-page="(item) => $emit('edit-page', item)" />
      </div>
      <div v-else class="text-center text-base-content/50 py-8 text-sm">
        هیچ زیرمجموعه‌ای برای این دسته‌بندی ثبت نشده است.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PenSquare, Trash, FileText } from 'lucide-vue-next';
import CategoryItem from '~/components/dashboard/category/CategoryItem.vue';

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

const props = defineProps<{
    parentCategory: ParentCategory;
}>();

defineEmits<{
    (e: 'update-item', item: CategoryNode): void;
    (e: 'remove-item', id: number | string): void;
    (e: 'edit-page', item: CategoryNode): void;
}>();

const config = useRuntimeConfig();

const toggleParent = () => {
    props.parentCategory.expanded = !props.parentCategory.expanded;
};
</script>