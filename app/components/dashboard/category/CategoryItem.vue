<template>
  <div class="border-b border-base-200 last:border-b-0 bg-base-100/40">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-colors hover:bg-base-200/50">
      <div 
        class="flex items-center gap-3"
        :class="{ 'cursor-pointer select-none': hasChildren }"
        @click="hasChildren && toggleChildren()"
      >
        <div v-if="hasChildren" class="text-base-content/50">
          <ChevronDown v-if="showChildren" class="size-4" />
          <ChevronRight v-else class="size-4" />
        </div>
        <div v-else class="w-4"></div>

        <img 
          v-if="category.image_url" 
          :src="config.public.apiBase + category.image_url" 
          :alt="category.name"
          class="size-6 object-contain transition-all 
    [:is([data-theme=dark],.dark)_&]:not-data-error:filter-[brightness(0)_invert(80%)]" loading="lazy"
        />

        <div class="flex flex-col">
          <span class="font-medium text-base-content text-sm sm:text-base">{{ category.name }}</span>
          <span v-if="category.description" class="text-xs text-base-content/60 max-w-xl">
            {{ category.description }}
          </span>
        </div>

        <span v-if="hasChildren" class="badge badge-sm badge-neutral gap-1 font-medium">
          {{ category.children.length.toLocaleString('fa-IR') }} زیرمجموعه
        </span>
      </div>

      <div class="flex items-center gap-1.5 justify-end bg-base-200/40 sm:bg-transparent p-2 sm:p-0 rounded-xl">
        <button @click="$emit('edit-page', category)" class="btn btn-square btn-sm btn-ghost text-info">
          <FileText class="size-4.5" />
        </button>
        <button @click="$emit('update-item', category)" class="btn btn-square btn-sm btn-ghost text-base-content/70">
          <PenSquare class="size-4.5" />
        </button>
        <button @click="$emit('remove-item', category.id)" class="btn btn-square btn-sm btn-ghost text-error">
          <Trash class="size-4.5" />
        </button>
      </div>
    </div>

    <div v-if="hasChildren && showChildren" class="bg-base-200/20 pr-4 sm:pr-8 border-r border-base-300 mx-2 mb-2 rounded-l-xl">
      <div class="space-y-1 py-1">
        <CategoryItem
          v-for="child in category.children"
          :key="child.id"
          :category="child"
          @update-item="(item) => $emit('update-item', item)"
          @remove-item="(id) => $emit('remove-item', id)"
          @edit-page="(item) => $emit('edit-page', item)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronRight, ChevronDown, PenSquare, Trash, FileText } from 'lucide-vue-next';
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

const props = defineProps<{
  category: CategoryNode;
}>();

defineEmits<{
  (e: 'update-item', item: CategoryNode): void;
  (e: 'remove-item', id: number | string): void;
  (e: 'edit-page', item: CategoryNode): void;
}>();

const config = useRuntimeConfig();
const showChildren = ref(false);
const hasChildren = computed(() => !!props.category.children?.length);

const toggleChildren = () => {
  showChildren.value = !showChildren.value;
};
</script>