<!-- components/dashboard/category/CategoryParentGroup.vue -->
<template>
  <div class="group collapse collapse-arrow border border-base-300 bg-base-100 rounded-xl overflow-hidden shadow-sm">
    <input type="checkbox" :checked="parentCategory.expanded" @change="toggleParent" class="peer" />

    <div class="collapse-title flex items-center justify-between pl-12 pr-4 py-4 bg-base-100 peer-checked:border-b peer-checked:border-base-200 transition-none min-h-0">
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
        <span class="cursor-grab px-1 text-base-content/35 active:cursor-grabbing" title="برای جابه‌جایی بکشید">
          <GripVertical class="size-4.5" />
        </span>
        <button class="btn btn-square btn-sm btn-ghost" :disabled="!canMoveUp" title="انتقال به بالا" @click="$emit('move-up')">
          <ArrowUp class="size-4" />
        </button>
        <button class="btn btn-square btn-sm btn-ghost" :disabled="!canMoveDown" title="انتقال به پایین" @click="$emit('move-down')">
          <ArrowDown class="size-4" />
        </button>
        <button @click="$emit('update-item', parentCategory)" class="btn btn-square btn-sm btn-ghost text-secondary">
          <PenSquare class="size-4.5" />
        </button>
        <button @click="$emit('remove-item', parentCategory.id)" class="btn btn-square btn-sm btn-ghost text-error">
          <Trash class="size-4.5" />
        </button>
      </div>
    </div>

    <div class="collapse-content p-0 bg-base-100">
      <TransitionGroup v-if="parentCategory.children.length > 0" name="reorder" tag="div" class="divide-y divide-base-200">
        <div v-for="(childCategory, index) in localChildren" :key="childCategory.id"
          class="transition-all duration-200" @dragover.prevent="setDropIndex($event, index)" @drop.stop.prevent="dropChild">
          <div v-if="dropIndex === index" class="m-2 h-14 rounded-lg border-2 border-dashed border-primary/55 bg-primary/8" />
          <div draggable="true"
            :class="{ 'opacity-45': draggedIndex === index, 'bg-primary/8 ring-1 ring-inset ring-primary/25': highlightedId === childCategory.id }"
            @dragstart.stop="draggedIndex = index" @dragend="clearDrag">
          <CategoryItem :category="childCategory" :can-move-up="index > 0"
            :can-move-down="index < localChildren.length - 1" @move-up="moveChild(index, -1)"
            @move-down="moveChild(index, 1)" @update-item="(item) => $emit('update-item', item)"
            @remove-item="(id) => $emit('remove-item', id)" />
          </div>
          <div v-if="index === localChildren.length - 1 && dropIndex === localChildren.length"
            class="m-2 h-14 rounded-lg border-2 border-dashed border-primary/55 bg-primary/8" />
        </div>
      </TransitionGroup>
      <div v-else class="text-center text-base-content/50 py-8 text-sm">
        هیچ زیرمجموعه‌ای برای این دسته‌بندی ثبت نشده است.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ArrowDown, ArrowUp, GripVertical, PenSquare, Trash } from 'lucide-vue-next';
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

interface ParentCategory extends CategoryNode {
  expanded: boolean;
}

const props = defineProps<{
  parentCategory: ParentCategory;
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
const localChildren = ref<CategoryNode[]>([]);
const draggedIndex = ref<number | null>(null);
const dropIndex = ref<number | null>(null);
const highlightedId = ref<number | string | null>(null);

watch(() => props.parentCategory.children, (children) => {
  localChildren.value = [...(children || [])].sort((a, b) => {
    if (a.sort_order == null && b.sort_order == null) return a.name.localeCompare(b.name, 'fa')
    if (a.sort_order == null) return 1
    if (b.sort_order == null) return -1
    return a.sort_order - b.sort_order
  })
}, { immediate: true, deep: true });

const persistOrder = async () => {
  localChildren.value.forEach((item, index) => { item.sort_order = index });
  await $fetch('/api/categories/reorder', {
    method: 'PUT',
    body: { parent_id: props.parentCategory.id, ids: localChildren.value.map(item => item.id) },
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

const toggleParent = () => {
  props.parentCategory.expanded = !props.parentCategory.expanded;
};
</script>

<style scoped>
.reorder-move { transition: transform 280ms ease; }
</style>
