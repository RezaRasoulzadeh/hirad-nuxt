<template>
  <div
    v-if="request"
    class="modal modal-open z-[100] bg-black/50"
    role="presentation"
    @click.self="emit('cancel')"
    @keydown.esc.stop.prevent="emit('cancel')"
    @keydown="trapFocus"
  >
    <section
      class="modal-box max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="dashboard-confirm-title"
      aria-describedby="dashboard-confirm-message"
      dir="rtl"
    >
      <div class="flex items-start gap-4">
        <div
          class="mt-0.5 flex size-11 shrink-0 items-center justify-center rounded-full"
          :class="request.variant === 'danger' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'"
          aria-hidden="true"
        >
          <TriangleAlert v-if="request.variant === 'danger'" class="size-5" />
          <CircleHelp v-else class="size-5" />
        </div>
        <div class="min-w-0 flex-1">
          <h2 id="dashboard-confirm-title" class="text-lg font-bold text-base-content">
            {{ request.title || 'تأیید عملیات' }}
          </h2>
          <p id="dashboard-confirm-message" class="mt-2 text-sm leading-7 text-base-content/70">
            {{ request.message }}
          </p>
        </div>
      </div>

      <div class="modal-action mt-7 gap-2">
        <button ref="confirmButton" type="button" class="btn rounded-xl font-bold" :class="confirmButtonClass" @click="emit('confirm')">
          {{ request.confirmLabel || 'تأیید' }}
        </button>
        <button ref="cancelButton" type="button" class="btn btn-ghost rounded-xl font-bold" @click="emit('cancel')">
          {{ request.cancelLabel || 'انصراف' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { CircleHelp, TriangleAlert } from 'lucide-vue-next'
import type { DashboardConfirmOptions } from '~/composables/useDashboardConfirm'

const props = defineProps<{
  request: DashboardConfirmOptions | null
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const confirmButton = ref<HTMLButtonElement | null>(null)
const cancelButton = ref<HTMLButtonElement | null>(null)

const confirmButtonClass = computed(() => props.request?.variant === 'danger' ? 'btn-error' : 'btn-primary')

watch(() => props.request, async (request) => {
  if (!request) return
  await nextTick()
  if (request.variant === 'danger') {
    cancelButton.value?.focus()
  } else {
    confirmButton.value?.focus()
  }
}, { flush: 'post' })

function trapFocus(event: KeyboardEvent) {
  if (event.key !== 'Tab') return

  const first = confirmButton.value
  const last = cancelButton.value
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
</script>
