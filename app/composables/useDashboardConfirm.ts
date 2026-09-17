import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export interface DashboardConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

export type DashboardConfirm = (options: DashboardConfirmOptions) => Promise<boolean>

export const dashboardConfirmKey: InjectionKey<DashboardConfirm> = Symbol('dashboard-confirm')

export function useDashboardConfirm(): DashboardConfirm {
  const confirm = inject(dashboardConfirmKey)
  if (!confirm) {
    throw new Error('Dashboard confirmation dialog is not available outside the dashboard layout.')
  }
  return confirm
}
