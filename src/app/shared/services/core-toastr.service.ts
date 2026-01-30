import { Injectable, signal } from '@angular/core';
import {
  CoreToastCreate,
  CoreToastInstance,
  CoreToastRemovalReason,
  TOAST_DEFAULTS
} from '@shared/components/core-toastr/core-toastr.types';

const MIN_MAX_QUEUE = 1;
type CoreToastExtras = Omit<CoreToastCreate, 'message'>;

/**
 * Service for displaying toast notifications.
 * 
 * @example Basic usage
 * ```typescript
 * constructor(private toastService: CoreToastrService) {}
 * 
 * showSuccess() {
 *   this.toastService.success('Operation completed successfully!');
 * }
 * 
 * showError() {
 *   this.toastService.error('An error occurred', 'Error');
 * }
 * ```
 * 
 * @example With custom options
 * ```typescript
 * this.toastService.show({
 *   message: 'Custom toast',
 *   variant: 'info',
 *   duration: 5000,
 *   dismissible: true,
 *   actions: [
 *     { label: 'Undo', handler: () => this.undo() }
 *   ]
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CoreToastrService {
  private idCounter = 0;
  private readonly maxQueue = signal<number>(TOAST_DEFAULTS.MAX_QUEUE);
  private readonly toastsSignal = signal<CoreToastInstance[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  /** Read-only signal of currently displayed toasts */
  readonly toasts = this.toastsSignal.asReadonly();

  /**
   * Shows a toast notification.
   * @param payload - Toast configuration
   * @returns The ID of the created toast
   */
  show(payload: CoreToastCreate): string {
    const id = payload.id ?? `toast-${++this.idCounter}`;
    const toast: CoreToastInstance = {
      id,
      title: payload.title,
      message: payload.message,
      variant: payload.variant ?? TOAST_DEFAULTS.VARIANT,
      autoClose: payload.autoClose ?? TOAST_DEFAULTS.AUTO_CLOSE,
      duration: payload.duration ?? TOAST_DEFAULTS.DURATION,
      dismissible: payload.dismissible ?? TOAST_DEFAULTS.DISMISSIBLE,
      actions: payload.actions ?? [],
      data: payload.data,
      createdAt: Date.now()
    };

    this.toastsSignal.update(current => {
      const next = [toast, ...current];
      return next.slice(0, this.maxQueue());
    });

    this.registerTimer(toast);
    return toast.id;
  }

  /**
   * Shows a success toast notification.
   * @param message - Toast message
   * @param title - Optional toast title
   * @param extra - Additional configuration options
   * @returns The ID of the created toast
   */
  success(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'success'
    });
  }

  /**
   * Shows an info toast notification.
   * @param message - Toast message
   * @param title - Optional toast title
   * @param extra - Additional configuration options
   * @returns The ID of the created toast
   */
  info(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'info'
    });
  }

  /**
   * Shows a warning toast notification.
   * @param message - Toast message
   * @param title - Optional toast title
   * @param extra - Additional configuration options
   * @returns The ID of the created toast
   */
  warning(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'warning'
    });
  }

  /**
   * Shows an error toast notification.
   * @param message - Toast message
   * @param title - Optional toast title
   * @param extra - Additional configuration options
   * @returns The ID of the created toast
   */
  error(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'error'
    });
  }

  /**
   * Dismisses a specific toast by ID.
   * @param id - The ID of the toast to dismiss
   * @param _reason - The reason for dismissal (for analytics)
   */
  dismiss(id: string, _reason: CoreToastRemovalReason = 'manual'): void {
    this.toastsSignal.update(current => current.filter(toast => toast.id !== id));
    this.clearTimer(id);
    // Placeholder for analytics hook based on reason if needed later.
  }

  /**
   * Clears all toast notifications.
   */
  clear(): void {
    this.toastsSignal.set([]);
    [...this.timers.keys()].forEach(id => this.clearTimer(id));
  }

  setMaxQueue(limit: number): void {
    const safeLimit = Math.max(MIN_MAX_QUEUE, limit);
    this.maxQueue.set(safeLimit);
    this.toastsSignal.update(current => current.slice(0, safeLimit));
  }

  private registerTimer(toast: CoreToastInstance): void {
    if (!toast.autoClose || toast.duration <= 0) {
      return;
    }
    const timer = setTimeout(() => {
      this.dismiss(toast.id, 'timeout');
      this.timers.delete(toast.id);
    }, toast.duration);
    this.timers.set(toast.id, timer);
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }
}

