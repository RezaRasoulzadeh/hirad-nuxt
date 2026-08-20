<!-- components/dashboard/category/CategoryItem.vue -->
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
        <span class="cursor-grab px-1 text-base-content/35 active:cursor-grabbing" title="برای جابه‌جایی بکشید">
          <GripVertical class="size-4.5" />
        </span>
        <button class="btn btn-square btn-sm btn-ghost" :disabled="!canMoveUp" title="انتقال به بالا"
          @click="$emit('move-up')"><ArrowUp class="size-4" /></button>
        <button class="btn btn-square btn-sm btn-ghost" :disabled="!canMoveDown" title="انتقال به پایین"
          @click="$emit('move-down')"><ArrowDown class="size-4" /></button>
        <button @click="$emit('update-item', category)" class="btn btn-square btn-sm btn-ghost text-secondary">
          <PenSquare class="size-4.5" />
        </button>
        <button @click="$emit('remove-item', category.id)" class="btn btn-square btn-sm btn-ghost text-error">
          <Trash class="size-4.5" />
        </button>
      </div>
    </div>

    <div v-if="hasChildren && showChildren" class="bg-base-200/20 pr-4 sm:pr-8 border-r border-base-300 mx-2 mb-2 rounded-l-xl">
      <TransitionGroup name="reorder" tag="div" class="space-y-1 py-1">
        <div v-for="(child, index) in localChildren" :key="child.id" class="rounded-lg transition-all duration-200"
          @dragover.prevent="setDropIndex($event, index)" @drop.stop.prevent="dropChild">
          <div v-if="dropIndex === index" class="my-1 h-12 rounded-lg border-2 border-dashed border-primary/55 bg-primary/8" />
          <div draggable="true"
            :class="{ 'opacity-45': draggedIndex === index, 'bg-primary/8 ring-1 ring-inset ring-primary/25': highlightedId === child.id }"
            @dragstart.stop="draggedIndex = index" @dragend="clearDrag">
          <CategoryItem :category="child" :can-move-up="index > 0" :can-move-down="index < localChildren.length - 1"
            @move-up="moveChild(index, -1)" @move-down="moveChild(index, 1)"
            @update-item="(item) => $emit('update-item', item)" @remove-item="(id) => $emit('remove-item', id)" />
          </div>
          <div v-if="index === localChildren.length - 1 && dropIndex === localChildren.length"
            class="my-1 h-12 rounded-lg border-2 border-dashed border-primary/55 bg-primary/8" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { ArrowDown, ArrowUp, ChevronRight, ChevronDown, GripVertical, PenSquare, Trash } from 'lucide-vue-next';
import CategoryItem from '~/components/dashboard/category/CategoryItem.vue';

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

const props = defineProps<{
  category: CategoryNode;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}>();

defineEmits<{
  (e: 'update-item', item: CategoryNode): void;
  (e: 'remove-item', id: number | string): void;
  (e: 'move-up'): void;
  (e: 'move-down'): void;
}>();

const config = useRuntimeConfig();
const showChildren = ref(false);
const hasChildren = computed(() => !!props.category.children?.length);
const localChildren = ref<CategoryNode[]>([]);
const draggedIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);
const highlightedId = ref<number | string | null>(null);

watch(() => props.category.children, (children) => {
  localChildren.value = [...(children || [])].sort((a, b) => {
    if (a.sort_order == null && b.sort_order == null) return a.name.localeCompare(b.name, 'fa');
    if (a.sort_order == null) return 1;
    if (b.sort_order == null) return -1;
    return a.sort_order - b.sort_order;
  });
}, { immediate: true, deep: true });

const persistOrder = async () => {
  localChildren.value.forEach((item, index) => { item.sort_order = index });
  await $fetch('/api/categories/reorder', {
    method: 'PUT',
    body: { parent_id: props.category.id, ids: localChildren.value.map(item => item.id) },
  });
};

const moveChild = (index: number, offset: number) => {
  const target = index + offset;
  if (target < 0 || target >= localChildren.value.length) return;
  const [item] = localChildren.value.splice(index, 1);
  if (!item) return;
  localChildren.value.splice(target, 0, item);
  highlight(item.id);
  persistOrder();
};

const setDropIndex = (event: DragEvent, index: number) => {
  if (draggedIndex.value == null) return;
  const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
  dropIndex.value = event.clientY < bounds.top + bounds.height / 2 ? index : index + 1;
};

const clearDrag = () => {
  draggedIndex.value = null;
  dropIndex.value = null;
};

const dropChild = () => {
  const sourceIndex = draggedIndex.value;
  let targetIndex = dropIndex.value;
  clearDrag();
  if (sourceIndex == null || targetIndex == null) return;
  const [item] = localChildren.value.splice(sourceIndex, 1);
  if (!item) return;
  if (sourceIndex < targetIndex) targetIndex -= 1;
  if (sourceIndex === targetIndex) return;
  localChildren.value.splice(targetIndex, 0, item);
  highlight(item.id);
  persistOrder();
};

const highlight = (id: number | string) => {
  highlightedId.value = id;
  window.setTimeout(() => { if (highlightedId.value === id) highlightedId.value = null; }, 700);
};

const toggleChildren = () => {
  showChildren.value = !showChildren.value;
};
</script>

<style scoped>
.reorder-move { transition: transform 280ms ease; }
</style>
