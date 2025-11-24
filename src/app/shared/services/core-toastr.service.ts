import { Injectable, signal } from '@angular/core';
import {
  CoreToastCreate,
  CoreToastInstance,
  CoreToastRemovalReason,
  CoreToastVariant
} from '@shared/components/core-toastr/core-toastr.types';

const DEFAULT_DURATION = 4000;
const DEFAULT_VARIANT: CoreToastVariant = 'default';
type CoreToastExtras = Omit<CoreToastCreate, 'message'>;

@Injectable({
  providedIn: 'root'
})
export class CoreToastrService {
  private idCounter = 0;
  private readonly maxQueue = signal(6);
  private readonly toastsSignal = signal<CoreToastInstance[]>([]);
  private readonly timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly toasts = this.toastsSignal.asReadonly();

  show(payload: CoreToastCreate): string {
    const id = payload.id ?? `toast-${++this.idCounter}`;
    const toast: CoreToastInstance = {
      id,
      title: payload.title,
      message: payload.message,
      variant: payload.variant ?? DEFAULT_VARIANT,
      autoClose: payload.autoClose ?? true,
      duration: payload.duration ?? DEFAULT_DURATION,
      dismissible: payload.dismissible ?? true,
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

  success(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'success'
    });
  }

  info(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'info'
    });
  }

  warning(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'warning'
    });
  }

  error(message: string, title?: string, extra?: CoreToastExtras): string {
    return this.show({
      ...extra,
      message,
      title,
      variant: 'error'
    });
  }

  dismiss(id: string, reason: CoreToastRemovalReason = 'manual'): void {
    this.toastsSignal.update(current => current.filter(toast => toast.id !== id));
    this.clearTimer(id);
    // Placeholder for analytics hook based on reason if needed later.
  }

  clear(): void {
    this.toastsSignal.set([]);
    [...this.timers.keys()].forEach(id => this.clearTimer(id));
  }

  setMaxQueue(limit: number): void {
    const safeLimit = Math.max(1, limit);
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

