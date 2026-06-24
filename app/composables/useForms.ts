interface FormSubmission {
  id: string;
  form_name: string;
  submitted_at: string;
  data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    department?: string;
  };
  is_processed: boolean;
}

interface ApiResponse {
  success: boolean;
  data: FormSubmission[];
}

export function useForms() {
  const toast = useToast();

  const { data: formsData, status, error, refresh } = useFetch<ApiResponse>('/api/forms', {
    lazy: true,
  });

  const forms = computed<FormSubmission[]>(() => formsData.value?.data || []);

  async function toggleReadStatus(id: string) {
    const list = formsData.value?.data;
    if (!list) return;

    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return;

    const item = list[index];
    if (!item) return;

    const newStatus = !item.is_processed;

    try {
      await $fetch('/api/forms/submit-form', {
        method: 'PUT',
        body: { id, is_processed: newStatus },
      });

      const updatedList = list.map((item, i) =>
        i === index ? { ...item, is_processed: newStatus } : item
      );
      formsData.value = formsData.value
        ? { ...formsData.value, data: updatedList }
        : formsData.value;

      toast.success('وضعیت پیام بروزرسانی شد.');
    } catch (err) {
      toast.error('بروزرسانی وضعیت با خطا مواجه شد.');
    }
  }

  async function removeSubmission(id: string) {
    const list = formsData.value?.data;
    if (!list) return;

    try {
      await $fetch('/api/forms/submit-form', {
        method: 'DELETE',
        query: { id },
      });

      formsData.value = formsData.value
        ? { ...formsData.value, data: list.filter((s) => s.id !== id) }
        : formsData.value;

      toast.success('پیام با موفقیت حذف شد.');
    } catch (err) {
      toast.error('حذف پیام با خطا مواجه شد.');
    }
  }

  return {
    forms,
    status,
    error,
    refresh,
    toggleReadStatus,
    removeSubmission,
  };
}