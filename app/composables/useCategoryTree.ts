import type { Category } from '~/composables/useCategories'

const findInTree = (list: Category[], predicate: (c: Category) => boolean): Category | undefined => {
  for (const cat of list) {
    if (predicate(cat)) return cat
    if (cat.children?.length) {
      const found = findInTree(cat.children, predicate)
      if (found) return found
    }
  }
}

export const useCategoryTree = (slug: Ref<string>) => {
  const { categories, fetchCategories } = useCategories()

  const currentCategory = computed<Category | undefined>(() =>
    findInTree(categories.value, (c) => c.slug === slug.value)
  )

  const parentCategory = computed<Category | undefined>(() => {
    const parentId = currentCategory.value?.parent_id
    if (!parentId) return undefined
    return findInTree(categories.value, (c) => c.id === parentId)
  })

  const hasChildren = computed(() =>
    (currentCategory.value?.children?.length ?? 0) > 0
  )

  const sortedChildren = computed(() =>
    [...(currentCategory.value?.children ?? [])].sort((a, b) => {
      if (a.sort_order == null && b.sort_order == null) return a.name.localeCompare(b.name, 'fa')
      if (a.sort_order == null) return 1
      if (b.sort_order == null) return -1
      return a.sort_order - b.sort_order
    })
  )

  return {
    fetchCategories,
    currentCategory,
    parentCategory,
    hasChildren,
    sortedChildren,
  }
}
