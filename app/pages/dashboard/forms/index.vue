<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-base-content">
          صندوق پیام‌ها
        </h1>
        <span class="badge badge-neutral text-xs px-3 py-1.5 font-medium">
          {{ unreadCount.toLocaleString('fa-IR') }} پیام جدید
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="جست و جو ..."
          class="input input-bordered w-full md:w-64 bg-base-100"
        />
        
        <div class="flex items-center gap-2 w-full md:w-auto">
          <label for="department-filter" class="text-sm text-base-content/70 whitespace-nowrap">
            فیلتر بر اساس دپارتمان:
          </label>
          <select
            id="department-filter"
            v-model="selectedDepartment"
            class="select select-bordered w-full md:w-auto bg-base-100"
          >
            <option value="">همه</option>
            <option v-for="dept in uniqueDepartments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <div class="p-4 bg-error/10 rounded-full text-error">
        <WifiOffIcon class="h-8 w-8" />
      </div>
      <h3 class="text-lg font-semibold text-base-content">خطا در بارگذاری اطلاعات</h3>
      <p class="text-sm text-base-content/50">لطفاً اتصال خود را بررسی کرده و مجدد تلاش کنید.</p>
      <button @click="() => refresh()" class="btn btn-sm btn-error btn-soft mt-2">
        تلاش مجدد
      </button>
    </div>

    <div v-else-if="!sortedForms.length" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <div class="p-4 bg-base-200 rounded-full text-base-content/70">
        <SearchXIcon class="h-8 w-8" />
      </div>
      <h3 class="text-lg font-semibold text-base-content">موردی یافت نشد</h3>
      <p class="text-sm text-base-content/50">هیچ پیام یا فرم ارسالی با مشخصات مدنظر پیدا نشد.</p>
    </div>

    <div v-else class="overflow-x-auto border border-base-200 rounded-lg shadow-sm">
      <table class="table w-full text-center">
        <thead class="bg-base-200/50">
          <tr>
            <th @click="toggleSortDirection('data.name')" class="cursor-pointer select-none hover:bg-base-200">
              <div class="flex items-center justify-center gap-1">
                نام
                <ArrowUpIcon v-if="sortBy === 'data.name' && sortDirection === 'asc'" class="h-4 w-4" />
                <ArrowDownIcon v-if="sortBy === 'data.name' && sortDirection === 'desc'" class="h-4 w-4" />
              </div>
            </th>
            <th @click="toggleSortDirection('data.department')" class="cursor-pointer select-none hover:bg-base-200">
              <div class="flex items-center justify-center gap-1">
                دپارتمان
                <ArrowUpIcon v-if="sortBy === 'data.department' && sortDirection === 'asc'" class="h-4 w-4" />
                <ArrowDownIcon v-if="sortBy === 'data.department' && sortDirection === 'desc'" class="h-4 w-4" />
              </div>
            </th>
            <th @click="toggleSortDirection('submitted_at')" class="cursor-pointer select-none hover:bg-base-200">
              <div class="flex items-center justify-center gap-1">
                تاریخ ارسال
                <ArrowUpIcon v-if="sortBy === 'submitted_at' && sortDirection === 'asc'" class="h-4 w-4" />
                <ArrowDownIcon v-if="sortBy === 'submitted_at' && sortDirection === 'desc'" class="h-4 w-4" />
              </div>
            </th>
            <th>پیام</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="item in sortedForms" 
            :key="item.id" 
            :class="[
              item.is_processed ? 'bg-base-200/40 opacity-75' : 'hover:bg-base-200/20',
              'transition-colors duration-150'
            ]"
          >
            <td class="max-w-xs truncate cursor-pointer font-medium" @click="openModal(item)">
              {{ item.data.name }}
            </td>
            <td class="max-w-xs truncate cursor-pointer" @click="openModal(item)">
              {{ item.data.department || '—' }}
            </td>
            <td class="max-w-xs truncate cursor-pointer direction-ltr text-center" @click="openModal(item)">
              {{ new Date(item.submitted_at).toLocaleString('fa-IR') }}
            </td>
            <td class="max-w-md truncate cursor-pointer" @click="openModal(item)">
              {{ item.data.message }}
            </td>
            <td class="flex items-center justify-center gap-1">
              <button
                @click="toggleReadStatus(item.id)"
                class="btn btn-ghost btn-sm text-primary"
                :title="item.is_processed ? 'علامت‌گذاری به عنوان خوانده‌نشده' : 'علامت‌گذاری به عنوان خوانده‌شده'"
              >
                <MailOpenIcon v-if="item.is_processed" class="h-4 w-4" />
                <MailIcon v-else class="h-4 w-4" />
              </button>
              <button
                @click="removeSubmission(item.id)"
                class="btn btn-ghost btn-sm text-error"
                title="حذف"
              >
                <Trash2Icon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <MessageModal
      :is-open="isModalOpen"
      :message="selectedMessage"
      @close="closeModal"
      @toggle-read="(item) => toggleReadStatus(item.id)"
      @remove="handleRemove"
    />
  </div>
</template>

<script setup lang="ts">
import { MailIcon, MailOpenIcon, Trash2Icon } from 'lucide-vue-next';
import MessageModal from '~/components/form/MessageModal.vue';

definePageMeta({
  layout: 'dashboard'
});

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

const { forms, status, error, refresh, toggleReadStatus, removeSubmission } = useForms();

const selectedDepartment = ref<string>('');
const searchTerm = ref<string>('');
const sortBy = ref<string>('submitted_at');
const sortDirection = ref<'asc' | 'desc'>('desc');
const isModalOpen = ref(false);
const selectedMessage = ref<FormSubmission | null>(null);

const unreadCount = computed(() => forms.value.filter((s) => !s.is_processed).length);

const filteredForms = computed(() => {
  const normalizedSearch = searchTerm.value.toLowerCase().trim();
  return forms.value.filter((s) => {
    if (s.form_name !== 'contact_us') return false;
    if (!normalizedSearch) return true;

    return (
      s.data.name?.toLowerCase().includes(normalizedSearch) ||
      s.data.department?.toLowerCase().includes(normalizedSearch) ||
      s.data.message?.toLowerCase().includes(normalizedSearch)
    );
  });
});

const sortedForms = computed(() => {
  const departmentFiltered = selectedDepartment.value
    ? filteredForms.value.filter((s) => s.data.department === selectedDepartment.value)
    : filteredForms.value;

  return [...departmentFiltered].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    if (sortBy.value.startsWith('data.')) {
      const field = sortBy.value.split('.')[1] as keyof typeof a.data;
      aValue = a.data[field] ?? '';
      bValue = b.data[field] ?? '';
    } else {
      const field = sortBy.value as keyof FormSubmission;
      aValue = a[field] ?? '';
      bValue = b[field] ?? '';
    }

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
});

const uniqueDepartments = computed(() => {
  const departments = new Set<string>();
  filteredForms.value.forEach((s) => {
    if (s.data.department) {
      departments.add(s.data.department);
    }
  });
  return [...departments];
});

function handleRemove(id: string) {
  removeSubmission(id);
  closeModal();
}

watch(
  forms,
  (newForms) => {
    if (selectedMessage.value) {
      const updated = newForms.find((s) => s.id === selectedMessage.value?.id);
      selectedMessage.value = updated || null;
    }
  },
  { deep: true }
);

function toggleSortDirection(field: string) {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
}

function openModal(submission: FormSubmission) {
  selectedMessage.value = submission;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedMessage.value = null;
}
</script>