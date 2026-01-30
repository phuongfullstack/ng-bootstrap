import { CommonModule } from '@angular/common';
import { Component, Input, computed, signal } from '@angular/core';
import { CoreToastrService } from '@shared/services/core-toastr.service';
import {
  CoreToastAction,
  CoreToastInstance,
  CoreToastPosition,
  CoreToastVariant,
  TOAST_DEFAULTS,
  TOAST_ASSERTIVE_VARIANTS
} from './core-toastr.types';

// Constants for toast icons
const TOAST_ICONS: Record<CoreToastVariant, string> = {
  default: 'ℹ️',
  success: '✔️',
  info: 'ⓘ',
  warning: '⚠️',
  error: '⨯',
  danger: '⨯'
} as const;

const MIN_MAX_VISIBLE = 1;
const MIN_STACK_GAP = 4;
const MIN_MAX_QUEUE = 1;

@Component({
  selector: 'core-toastr',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-toastr.component.html',
  styleUrl: './core-toastr.component.scss'
})
export class CoreToastrComponent {
  private readonly positionSignal = signal<CoreToastPosition>(TOAST_DEFAULTS.POSITION);
  private readonly maxVisibleSignal = signal<number>(TOAST_DEFAULTS.MAX_VISIBLE);
  private readonly stackGapSignal = signal<number>(TOAST_DEFAULTS.STACK_GAP);

  @Input()
  set position(value: CoreToastPosition) {
    if (value) {
      this.positionSignal.set(value);
    }
  }

  @Input()
  set maxVisible(value: number) {
    const safeValue = Number.isFinite(value) 
      ? Math.max(MIN_MAX_VISIBLE, Math.floor(value)) 
      : TOAST_DEFAULTS.MAX_VISIBLE;
    this.maxVisibleSignal.set(safeValue);
  }

  @Input()
  set stackGap(value: number) {
    const safeValue = Number.isFinite(value) 
      ? Math.max(MIN_STACK_GAP, Math.floor(value)) 
      : TOAST_DEFAULTS.STACK_GAP;
    this.stackGapSignal.set(safeValue);
  }

  @Input()
  set maxQueue(value: number) {
    if (!Number.isFinite(value)) {
      return;
    }
    const safeValue = Math.max(MIN_MAX_QUEUE, Math.floor(value));
    this.toastrService.setMaxQueue(safeValue);
  }

  protected readonly toasts = computed<CoreToastInstance[]>(() => {
    return this.toastrService.toasts().slice(0, this.maxVisibleSignal());
  });

  protected readonly stackGapPx = computed(() => `${this.stackGapSignal()}px`);
  protected readonly positionClass = computed(() => `core-toastr--${this.positionSignal()}`);
  protected readonly assertiveVariants = TOAST_ASSERTIVE_VARIANTS;

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
    return TOAST_ICONS[toast.variant] ?? TOAST_ICONS.default;
  }

  protected isAssertiveVariant(variant: CoreToastVariant): boolean {
    return this.assertiveVariants.includes(variant);
  }
}

