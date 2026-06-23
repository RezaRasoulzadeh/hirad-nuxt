<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-base-content">صندوق مشترکین</h1>
        <span class="badge badge-neutral text-xs px-3 py-1.5 font-medium">
          {{ confirmedCount.toLocaleString('fa-IR') }} تایید شده
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
          <label for="status-filter" class="text-sm text-base-content/70 whitespace-nowrap">
            فیلتر بر اساس وضعیت:
          </label>
          <select
            id="status-filter"
            v-model="selectedStatus"
            class="select select-bordered w-full md:w-auto bg-base-100"
          >
            <option value="">همه</option>
            <option value="confirmed">تایید شده</option>
            <option value="unconfirmed">تایید نشده</option>
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

    <div v-else-if="!sortedSubscribers.length" class="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <div class="p-4 bg-base-200 rounded-full text-base-content/70">
        <SearchXIcon class="h-8 w-8" />
      </div>
      <h3 class="text-lg font-semibold text-base-content">موردی یافت نشد</h3>
      <p class="text-sm text-base-content/50">هیچ مشترکی با مشخصات مدنظر پیدا نشد.</p>
    </div>

    <div v-else class="overflow-x-auto border border-base-200 rounded-lg shadow-sm">
      <table class="table w-full text-center">
        <thead class="bg-base-200/50">
          <tr>
            <th @click="toggleSortDirection('email')" class="cursor-pointer select-none hover:bg-base-200">
              <div class="flex items-center justify-center gap-1">
                ایمیل
                <ArrowUpIcon v-if="sortBy === 'email' && sortDirection === 'asc'" class="h-4 w-4" />
                <ArrowDownIcon v-if="sortBy === 'email' && sortDirection === 'desc'" class="h-4 w-4" />
              </div>
            </th>
            <th @click="toggleSortDirection('confirmed')" class="cursor-pointer select-none hover:bg-base-200">
              <div class="flex items-center justify-center gap-1">
                وضعیت
                <ArrowUpIcon v-if="sortBy === 'confirmed' && sortDirection === 'asc'" class="h-4 w-4" />
                <ArrowDownIcon v-if="sortBy === 'confirmed' && sortDirection === 'desc'" class="h-4 w-4" />
              </div>
            </th>
            <th @click="toggleSortDirection('created_at')" class="cursor-pointer select-none hover:bg-base-200">
              <div class="flex items-center justify-center gap-1">
                تاریخ عضویت
                <ArrowUpIcon v-if="sortBy === 'created_at' && sortDirection === 'asc'" class="h-4 w-4" />
                <ArrowDownIcon v-if="sortBy === 'created_at' && sortDirection === 'desc'" class="h-4 w-4" />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="subscriber in sortedSubscribers"
            :key="subscriber.id"
            :class="[
              !subscriber.confirmed ? 'bg-base-200/40 opacity-75' : 'hover:bg-base-200/20',
              'transition-colors duration-150'
            ]"
          >
            <td class="max-w-xs truncate">{{ subscriber.email }}</td>
            <td>
              <span :class="subscriber.confirmed ? 'badge badge-success badge-soft' : 'badge badge-warning badge-soft'">
                {{ subscriber.confirmed ? 'تایید شده' : 'تایید نشده' }}
              </span>
            </td>
            <td class="max-w-xs truncate direction-ltr text-center">
              {{ new Date(subscriber.created_at).toLocaleString('fa-IR') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

interface Subscriber {
  id: string;
  email: string;
  confirmed: boolean;
  created_at: string;
}

const { subscribers, status, error, refresh } = useSubscribers();

const selectedStatus = ref<string>('');
const searchTerm = ref<string>('');
const sortBy = ref<string>('created_at');
const sortDirection = ref<'asc' | 'desc'>('desc');

const confirmedCount = computed(() => subscribers.value.filter((s) => s.confirmed).length);

const filteredSubscribers = computed(() => {
  const normalizedSearch = searchTerm.value.toLowerCase().trim();
  return subscribers.value.filter((s) => {
    if (!normalizedSearch) return true;
    return s.email?.toLowerCase().includes(normalizedSearch);
  });
});

const sortedSubscribers = computed(() => {
  const statusFiltered = selectedStatus.value
    ? filteredSubscribers.value.filter((s) => {
        if (selectedStatus.value === 'confirmed') return s.confirmed;
        if (selectedStatus.value === 'unconfirmed') return !s.confirmed;
        return true;
      })
    : filteredSubscribers.value;

  return [...statusFiltered].sort((a, b) => {
    const field = sortBy.value as keyof Subscriber;
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return sortDirection.value === 'asc'
        ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
        : (bValue ? 1 : 0) - (aValue ? 1 : 0);
    }

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
});

function toggleSortDirection(field: string) {
  if (sortBy.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortDirection.value = 'asc';
  }
}
</script>