<template>
  <dialog 
    ref="modalRef" 
    class="modal modal-bottom sm:modal-middle"
    :class="{ 'modal-open': isOpen }"
    @click.self="$emit('close')"
  >
    <div v-if="message" class="modal-box max-w-2xl bg-base-100 p-6 shadow-xl border border-base-200">
      
      <!-- Modal Header with Title and Actions -->
      <div class="flex items-center justify-between mb-6 pb-3 border-b border-base-200">
        <h2 class="text-xl font-bold text-base-content">
          پیام از : {{ message.data.name }}
        </h2>
        
        <div class="flex items-center gap-1.5">
          <button
            @click="$emit('toggle-read', message)"
            class="btn btn-ghost btn-sm"
            :class="message.is_processed ? 'text-base-content/50' : 'text-primary'"
            :title="message.is_processed ? 'علامت‌گذاری به عنوان خوانده‌نشده' : 'علامت‌گذاری به عنوان خوانده‌شده'"
          >
            <MailOpenIcon v-if="message.is_processed" class="h-5 w-5" />
            <MailIcon v-else class="h-5 w-5" />
          </button>
          
          <button
            @click="$emit('remove', message.id)"
            class="btn btn-ghost btn-sm text-error"
            :title="'حذف'"
          >
            <Trash2Icon class="h-5 w-5" />
          </button>

          <button
            @click="$emit('close')"
            class="btn btn-ghost btn-sm text-base-content/50"
            aria-label="Close modal"
          >
            <XIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <!-- Modal Body -->
      <div class="space-y-4 overflow-y-auto max-h-[60vh] text-base-content">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-3 bg-base-200/50 rounded-lg">
            <p class="font-semibold text-xs text-base-content/60 mb-1">
              نام:
            </p>
            <p class="text-sm font-medium wrap-break-word">{{ message.data.name }}</p>
          </div>
          
          <div class="p-3 bg-base-200/50 rounded-lg">
            <p class="font-semibold text-xs text-base-content/60 mb-1">
              ایمیل:
            </p>
            <p class="text-sm font-medium wrap-break-word direction-ltr text-right">{{ message.data.email }}</p>
          </div>
          
          <div v-if="message.data.department" class="p-3 bg-base-200/50 rounded-lg">
            <p class="font-semibold text-xs text-base-content/60 mb-1">
              دپارتمان:
            </p>
            <p class="text-sm font-medium wrap-break-word">{{ message.data.department }}</p>
          </div>
          
          <div class="p-3 bg-base-200/50 rounded-lg">
            <p class="font-semibold text-xs text-base-content/60 mb-1">
              تاریخ ارسال:
            </p>
            <p class="text-sm font-medium wrap-break-word direction-ltr text-right">
              {{ new Date(message.submitted_at).toLocaleString('fa-IR') }}
            </p>
          </div>
        </div>
        
        <div class="p-4 bg-base-200/50 rounded-lg">
          <p class="font-semibold text-xs text-base-content/60 mb-2">
            پیام:
          </p>
          <p class="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-base-content/90">
            {{ message.data.message }}
          </p>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';

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

const props = defineProps<{
  isOpen: boolean;
  message: FormSubmission | null;
}>();

defineEmits<{
  (e: 'close'): void;
  (e: 'toggle-read', message: FormSubmission): void;
  (e: 'remove', id: string): void;
}>();

const modalRef = ref<HTMLDialogElement | null>(null);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    modalRef.value?.showModal();
  } else {
    modalRef.value?.close();
  }
});
</script>