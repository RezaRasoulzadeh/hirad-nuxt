// composables/useCategoryWorkspace.ts
import { ref, computed, watch } from 'vue';
import { useToast } from '~/composables/useToast';

export interface CategoryNode {
  id: string | number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | number | null;
  is_visible: boolean;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  children: CategoryNode[];
}

export interface PageData {
  id?: string;
  category_id: string | null;
  title: string;
  summary: string | null;
  cover_image_url?: string | null;
  content: {
    hero: {
      title?: string; title_fa?: string;
      sub_title?: string; sub_title_fa?: string;
      description?: string; description_fa?: string;
    };
    banner: {
      title?: string; title_fa?: string; image?: string; link?: string;
      items: Array<{ sub_title?: string; sub_title_fa?: string; description?: string; description_fa?: string; }>;
    };
    applications: Array<{ id?: number | string; title?: string; title_fa?: string; icon?: string; description?: string; description_fa?: string; }>;
    faq: Array<{ id?: number | string; title: { en?: string; fa?: string }; description: { en?: string; fa?: string }; }>;
  };
}

export function useCategoryWorkspace(props: { category: any; allCategories: any[] }, emit: any) {
  const toast = useToast();
  const activeTab = ref<'basic' | 'page'>('basic');
  const submitting = ref(false);
  const loadingPage = ref(false);

  const sortOrderAutoManaged = ref(true);

  const formCategory = ref<Partial<CategoryNode>>({});
  const pageData = ref<PageData>(createEmptyPageData(null, ''));

  const availableParents = computed<CategoryNode[]>(() => {
    if (!props.category) return props.allCategories;
    return props.allCategories.filter((cat: any) => String(cat.id) !== String(props.category?.id));
  });

  function createEmptyPageData(catId: string | null, name: string): PageData {
    return {
      category_id: catId,
      title: name,
      summary: null,
      content: {
        hero: { title: '', title_fa: '', sub_title: '', sub_title_fa: '', description: '', description_fa: '' },
        banner: { title: '', title_fa: '', image: '', link: '', items: [] },
        applications: [],
        faq: []
      }
    };
  }

  function computeDefaultSortOrder(parentId: string | number | null | undefined): number {
    const siblings = !parentId
      ? props.allCategories
      : (props.allCategories.find((c: any) => String(c.id) === String(parentId))?.children ?? []);

    if (!siblings || !siblings.length) return 0;
    const maxOrder = Math.max(...siblings.map((s: any) => Number(s.sort_order ?? 0)));
    return maxOrder + 1;
  }

  watch(() => props.category, (newVal) => {
    if (newVal) {
      formCategory.value = { ...newVal };
      pageData.value = createEmptyPageData(String(newVal.id), newVal.name);
      loadAdvancedPageContent(newVal.slug);
    } else {
      sortOrderAutoManaged.value = true;
      formCategory.value = {
        name: '', description: null, parent_id: null,
        sort_order: computeDefaultSortOrder(null), is_visible: true,
        meta_title: null, meta_description: null, image_url: null
      };
      pageData.value = createEmptyPageData(null, '');
    }
  }, { immediate: true });

  watch(() => formCategory.value.parent_id, (newParentId) => {
    if (!props.category && sortOrderAutoManaged.value) {
      formCategory.value.sort_order = computeDefaultSortOrder(newParentId);
    }
  });

  async function loadAdvancedPageContent(slug: string) {
    if (!slug) return;
    loadingPage.value = true;
    try {
      const res: any = await $fetch(`/api/dashboard/pages/${encodeURIComponent(slug)}`, { method: 'GET' });
      if (res?.success && res?.data) {
        const d = res.data;
        pageData.value = {
          ...d,
          content: d.content || {
            hero: { title: '', title_fa: '', sub_title: '', sub_title_fa: '', description: '', description_fa: '' },
            banner: { title: '', title_fa: '', image: '', link: '', items: [] },
            applications: [],
            faq: []
          }
        };
        if (!pageData.value.content.banner) {
          pageData.value.content.banner = { title: '', title_fa: '', image: '', link: '', items: [] };
        }
        if (!pageData.value.content.banner.items) pageData.value.content.banner.items = [];
      }
    } catch (err) {
    } finally {
      loadingPage.value = false;
    }
  }

  async function submitWorkspace() {
    submitting.value = true;
    try {
      const isNew = !props.category;

      if (isNew && !formCategory.value.slug) {
        formCategory.value.slug = formCategory.value.name?.toLowerCase().trim().replace(/\s+/g, '-') || '';
      }

      const categoryEndpoint = isNew
        ? '/api/dashboard/categories'
        : `/api/dashboard/categories/${encodeURIComponent(props.category?.slug || '')}`;
      const categoryMethod = isNew ? 'POST' : 'PUT';

      const cleanCategoryPayload = {
        parent_id: formCategory.value.parent_id ? String(formCategory.value.parent_id) : null,
        name: formCategory.value.name || '',
        description: formCategory.value.description?.trim() || null,
        image_url: formCategory.value.image_url || null,
        is_visible: formCategory.value.is_visible !== false,
        sort_order: formCategory.value.sort_order !== undefined ? Number(formCategory.value.sort_order) : 0,
        meta_title: formCategory.value.meta_title?.trim() || null,
        meta_description: formCategory.value.meta_description?.trim() || null
      };

      const catRes: any = await $fetch(categoryEndpoint, {
        method: categoryMethod,
        body: cleanCategoryPayload
      });

      let resolvedCategoryId = formCategory.value.id ? String(formCategory.value.id) : null;
      let resolvedSlug = props.category?.slug || formCategory.value.slug;

      if (isNew && catRes?.data) {
        resolvedCategoryId = String(catRes.data.id);
        resolvedSlug = catRes.data.slug;
      }

      const pageMethod = (isNew || !pageData.value.id) ? 'POST' : 'PUT';
      const pageEndpoint = (isNew || !pageData.value.id)
        ? '/api/dashboard/pages'
        : `/api/dashboard/pages/${encodeURIComponent(resolvedSlug || '')}`;

      const targetPagePayload: Record<string, any> = {
        category_id: resolvedCategoryId,
        summary: pageData.value.summary?.trim() || null,
        content: pageData.value.content || null,
        published_at: null,
        cover_image_url: pageData.value.cover_image_url || null,
        meta_title: formCategory.value.meta_title?.trim() || null,
        meta_description: formCategory.value.meta_description?.trim() || null
      };

      if (pageMethod === 'POST') {
        targetPagePayload.title = formCategory.value.name || '';
        targetPagePayload.slug = resolvedSlug || null;
        targetPagePayload.is_published = true;
      } else {
        targetPagePayload.title = formCategory.value.name ? String(formCategory.value.name) : null;
        targetPagePayload.slug = resolvedSlug || null;
        targetPagePayload.is_published = true;
      }

      await $fetch(pageEndpoint, {
        method: pageMethod,
        body: targetPagePayload
      });

      toast.success('مجموعه تغییرات دسته‌بندی و صفحه با موفقیت ثبت گردید.');
      emit('saved');
      emit('close');
    } catch (err: any) {
      toast.error('خطا در ثبت تغییرات تنظیمات.');
    } finally {
      submitting.value = false;
    }
  }

  return {
    activeTab, submitting, loadingPage, formCategory, pageData,
    availableParents, submitWorkspace, sortOrderAutoManaged
  };
}