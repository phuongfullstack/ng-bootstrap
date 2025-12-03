import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { CoreToastrService } from '@shared/services/core-toastr.service';
import {
  CoreToastAction,
  CoreToastInstance,
  CoreToastPosition,
  CoreToastVariant
} from './core-toastr.types';

@Component({
  selector: 'core-toastr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-toastr.component.html',
  styleUrl: './core-toastr.component.css'
})
export class CoreToastrComponent {
  private readonly positionSignal = signal<CoreToastPosition>('top-right');
  private readonly maxVisibleSignal = signal(3);
  private readonly stackGapSignal = signal(16);

  @Input()
  set position(value: CoreToastPosition) {
    if (value) {
      this.positionSignal.set(value);
    }
  }

  @Input()
  set maxVisible(value: number) {
    const safeValue = Number.isFinite(value) ? Math.max(1, Math.floor(value)) : 3;
    this.maxVisibleSignal.set(safeValue);
  }

  @Input()
  set stackGap(value: number) {
    const safeValue = Number.isFinite(value) ? Math.max(4, Math.floor(value)) : 16;
    this.stackGapSignal.set(safeValue);
  }

  @Input()
  set maxQueue(value: number) {
    if (!Number.isFinite(value)) {
      return;
    }
    const safeValue = Math.max(1, Math.floor(value));
    this.toastrService.setMaxQueue(safeValue);
  }

  protected readonly toasts = computed<CoreToastInstance[]>(() => {
    return this.toastrService.toasts().slice(0, this.maxVisibleSignal());
  });

  protected readonly stackGapPx = computed(() => `${this.stackGapSignal()}px`);
  protected readonly positionClass = computed(() => `core-toastr--${this.positionSignal()}`);

  private readonly iconMap: Record<CoreToastVariant, string> = {
    default: 'ℹ️',
    success: '✔️',
    info: 'ⓘ',
    warning: '⚠️',
    error: '⨯'
  };

  constructor(private readonly toastrService: CoreToastrService) {}

  protected trackToast(_: number, toast: CoreToastInstance): string {
    return toast.id;
  }

  protected dismissToast(id: string): void {
    this.toastrService.dismiss(id);
  }

  protected handleAction(toast: CoreToastInstance, action: CoreToastAction): void {
    action.handler?.();
    if (action.dismissOnClick !== false) {
      this.toastrService.dismiss(toast.id, 'action');
    }
  }

  protected iconFor(toast: CoreToastInstance): string {
    return this.iconMap[toast.variant] ?? this.iconMap.default;
  }
}

