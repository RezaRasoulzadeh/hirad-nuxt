<template>
  <div class="collapse collapse-arrow bg-base-100 border border-base-200 rounded-xl shadow-sm overflow-hidden">
    <input 
      type="checkbox" 
      :checked="parentCategory.expanded" 
      @change="toggleParentCategory" 
      class="min-h-12"
    />
    
    <div class="collapse-title flex items-center gap-3 px-6 py-4 bg-base-100 font-semibold text-base-content hover:bg-base-200/40 transition-colors">
      <h3 class="text-lg font-bold">{{ parentCategory.name }}</h3>
      <div class="badge badge-soft badge-primary font-medium text-xs">
        {{ localChildren.length }} زیرمجموعه
      </div>
    </div>

    <div class="collapse-content p-0! bg-base-100 border-t border-base-200 max-h-125 overflow-y-auto">
      <div class="divide-y divide-base-200">
        <ChildCategoryItem
          v-for="childCategory in localChildren"
          :key="childCategory.id"
          :child-category="childCategory"
          @toggle="toggleChildCategory"
          @fetch-products="fetchProducts"
          @edit="$emit('edit', $event)"
          @remove-product="handleProductRemoval"
          @duplicate="$emit('duplicate', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'
import ChildCategoryItem from '~/components/dashboard/product/ProductCategoryChild.vue'
import type { ProductItem } from '~/types/productItem'
import type { CategoryItem } from '~/types/categoryItem'

const emit = defineEmits(['edit', 'duplicate', 'remove'])

interface ChildCategory extends CategoryItem {
  products?: ProductItem[] | null
  productsLoaded?: boolean
  expanded?: boolean
}

interface ParentCategory extends CategoryItem {
  children: ChildCategory[]
  expanded?: boolean
}

const props = defineProps<{
  parentCategory: ParentCategory
}>()

const localChildren = ref<ChildCategory[]>([])

watch(
  () => props.parentCategory.children,
  (newChildren) => {
    localChildren.value = [...(newChildren || [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
  },
  { immediate: true, deep: true }
)

const toggleParentCategory = () => {
  props.parentCategory.expanded = !props.parentCategory.expanded
}

const toggleChildCategory = (childSlug: string) => {
  const child = localChildren.value.find(c => c.slug === childSlug)
  if (child) {
    child.expanded = !child.expanded
  }
}

const fetchProducts = async (categorySlug: string) => {
  const childCategory = localChildren.value.find(c => c.slug === categorySlug)
  if (!childCategory || childCategory.productsLoaded) return

  try {
    const response = await $fetch<any>('/api/dashboard/products', {
      query: { category: categorySlug }
    })
    
    childCategory.products = response.data || []
    childCategory.productsLoaded = true
  } catch (err) {
    console.error(`Error loading products for ${categorySlug}:`, err)
    childCategory.products = []
    childCategory.productsLoaded = true
  }
}

const handleProductRemoval = (slug: string) => {
  for (const child of localChildren.value) {
    if (child.products) {
      child.products = child.products.filter(p => p.slug !== slug)
    }
  }
  emit('remove', slug)
}
</script>