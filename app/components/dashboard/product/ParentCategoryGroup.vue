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
      <div class="badge badge-soft badge-secondary font-medium text-xs">
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
import type { ProductCategoryAction, ProductItem } from '~/types/productItem'
import type { CategoryItem } from '~/types/categoryItem'

const emit = defineEmits<{
  edit: [slug: string]
  duplicate: [action: ProductCategoryAction]
  remove: [action: ProductCategoryAction]
}>()

interface ChildCategory extends CategoryItem {
  products?: ProductItem[] | null
  productsLoaded?: boolean
  productsLoading?: boolean
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
    localChildren.value = [...(newChildren || [])].sort((a, b) => {
      if (a.sort_order == null && b.sort_order == null) return a.name.localeCompare(b.name, 'fa')
      if (a.sort_order == null) return 1
      if (b.sort_order == null) return -1
      return a.sort_order - b.sort_order
    })
  },
  { immediate: true }
)

watch(
  () => [
    props.parentCategory.expanded,
    ...localChildren.value.map(child => `${child.slug}:${!!child.expanded}`)
  ],
  () => {
    if (!props.parentCategory.expanded) return

    localChildren.value
      .filter(child => child.expanded && !child.productsLoaded)
      .forEach(child => { void fetchProducts(child.slug) })
  },
  { immediate: true }
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

async function fetchProducts(categorySlug: string) {
  const childCategory = localChildren.value.find(c => c.slug === categorySlug)
  if (!childCategory || childCategory.productsLoaded || childCategory.productsLoading) return

  childCategory.productsLoading = true
  try {
    const response = await $fetch<any>('/api/products', {
      query: { category: categorySlug }
    })
    
    childCategory.products = [...(response.data || [])].sort((a, b) => {
      if (a.sort_order == null && b.sort_order == null) return (a.name || '').localeCompare(b.name || '', 'fa')
      if (a.sort_order == null) return 1
      if (b.sort_order == null) return -1
      return a.sort_order - b.sort_order
    })
    childCategory.productsLoaded = true
  } catch (err) {
    console.error(`Error loading products for ${categorySlug}:`, err)
    childCategory.products = []
    childCategory.productsLoaded = true
  } finally {
    childCategory.productsLoading = false
  }
}

const handleProductRemoval = (action: ProductCategoryAction) => {
  emit('remove', action)
}
</script>
