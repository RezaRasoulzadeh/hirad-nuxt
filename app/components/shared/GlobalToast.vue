// components/shared/GlobalToast.vue
<template>
  <div v-if="active" class="toast toast-start toast-bottom z-50">
    <div
      :key="active.id"
      class="alert relative overflow-hidden pr-4 pl-2 shadow-xl subscription-toast text-white"
      :class="alertClasses[active.type]"
    >
      <span>{{ active.message }}</span>
      <button
        type="button"
        class="btn btn-ghost btn-xs btn-circle text-current hover:bg-black/10"
        aria-label="بستن پیام"
        @click="clear"
      >
        <svg class="size-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <span class="toast-progress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast, type ToastType } from '~/composables/useToast'

const { active, clear } = useToast()

const alertClasses: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info'
}
</script>

<style scoped>
.subscription-toast {
  animation: toast-enter 220ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.toast-progress {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: right center;
  background: currentColor;
  opacity: 0.35;
  animation: toast-progress 5s linear forwards;
}

@keyframes toast-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>