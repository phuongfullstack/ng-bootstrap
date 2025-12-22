import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlComponent } from '@shared/components/base/base-form-control.component';
import { Subscription } from 'rxjs';

let uniqueId = 0;

/**
 * Core input component with Bootstrap 5.3 styling
 * Supports reactive forms, validation, and various input types
 */
@Component({
  selector: 'core-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './core-input.component.html',
  styleUrls: ['./core-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreInputComponent extends BaseFormControlComponent implements OnInit, OnDestroy {
  @Input() placeholder?: string;
  @Input() type: string = 'text';
  @Input() autocomplete?: string;
  @Input() readonly = false;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() pattern?: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  protected override generatedId = `core-input-${uniqueId++}`;
  private statusChangesSubscription?: Subscription;
  private valueChangesSubscription?: Subscription;

  constructor(
    @Optional() @Self() ngControl: NgControl | null = null,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Subscribe to control changes to trigger change detection with OnPush
    // This ensures validation states update when control state changes externally
    if (this.control) {
      // Subscribe to status changes (VALID, INVALID, PENDING, DISABLED)
      this.statusChangesSubscription = this.control.statusChanges.subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });

      // Subscribe to value changes to catch state changes (touched/dirty can change with value)
      this.valueChangesSubscription = this.control.valueChanges.subscribe(() => {
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnDestroy(): void {
    this.statusChangesSubscription?.unsubscribe();
    this.valueChangesSubscription?.unsubscribe();
  }

  protected get inputId(): string {
    return this.controlId;
  }

  protected onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    const processedValue =
      this.type === 'number' && inputValue !== ''
        ? Number(inputValue)
        : inputValue;

    this.value = processedValue;
    this.onChange(processedValue);
    this.valueChange.emit(String(inputValue));
    this.changeDetectorRef.markForCheck();
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleBlur();
    this.blurred.emit(event);
    this.changeDetectorRef.markForCheck();
  }

  override writeValue(value: any): void {
    super.writeValue(value);
    this.changeDetectorRef.markForCheck();
  }

  protected override getDefaultValue(): any {
    return '';
  }

  protected override getDefaultErrorMessage(): string {
    return 'Invalid value.';
  }
}

