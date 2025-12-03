import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Optional,
  Output,
  Self
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlComponent } from '../base/base-form-control.component';

let uniqueId = 0;

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  hint?: string;
}

/**
 * Core Radio Button Component
 * Supports both single radio and radio group modes
 * Extends BaseFormControlComponent for form integration
 */
@Component({
  selector: 'core-radio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './core-radio.component.html',
  styleUrls: ['./core-radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreRadioComponent extends BaseFormControlComponent {
  @Input() inline = false;
  @Input() size?: 'sm' | 'md' | 'lg';
  @Input() options?: RadioOption[]; 
  @Input() standaloneDisabled = false; 
  @Input() standaloneValue?: string | number; 
  @Input() name?: string; 

  @Output() valueChange = new EventEmitter<string | number>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  protected override generatedId = `core-radio-${uniqueId++}`;
  protected readonly groupName: string;

  constructor(
    @Optional() @Self() ngControl: NgControl | null = null,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl);
    this.groupName = this.name || `radio-group-${this.generatedId}`;
  }

  protected get radioId(): string {
    return this.controlId;
  }

  protected get isGroupMode(): boolean {
    return !!this.options && this.options.length > 0;
  }

  protected get radioValue(): string | number | null {
    return this.effectiveValue ?? null;
  }

  protected get isDisabled(): boolean {
    return this.standaloneDisabled || this.disabled;
  }

  protected get sizeClass(): string {
    if (!this.size) return '';
    return `form-check-${this.size}`;
  }

  protected get containerClass(): string {
    return this.inline ? 'form-check-inline' : 'form-check';
  }

  protected isOptionSelected(optionValue: string | number): boolean {
    if (!this.isGroupMode) return false;
    const currentValue = this.effectiveValue;
    return currentValue !== null && currentValue !== undefined && currentValue === optionValue;
  }

  protected getOptionId(index: number): string {
    return `${this.radioId}-${index}`;
  }

  protected trackByOption(_: number, option: RadioOption): string | number {
    return option.value;
  }

  protected onRadioChange(event: Event, optionValue?: string | number): void {
    const selectedValue = optionValue ?? (event.target as HTMLInputElement).value;
    const normalizedValue = this.normalizeValue(selectedValue);

    // Update value based on usage mode
    if (this.ngControl) {
      this.value = normalizedValue;
      this.onChange(normalizedValue);
    } else {
      this.standaloneValue = normalizedValue;
    }

    this.valueChange.emit(normalizedValue);
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleBlur();
    this.blurred.emit(event);
  }

  override writeValue(value: any): void {
    this.value = value !== null && value !== undefined ? this.normalizeValue(value) : null;
    this.changeDetectorRef.markForCheck();
  }

  protected get effectiveValue(): string | number | null {
    if (this.standaloneValue !== undefined && !this.ngControl) {
      return this.standaloneValue;
    }
    return this.value;
  }

  /**
   * Normalize value to string or number based on input type
   * Maintains type consistency for comparison
   */
  private normalizeValue(value: any): string | number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      // Try to convert to number if it's a numeric string
      const numValue = Number(value);
      if (!Number.isNaN(numValue) && value.trim() !== '') {
        return numValue;
      }
      return value;
    }
    return String(value);
  }

  protected override getDefaultValue(): any {
    return this.isGroupMode ? null : null;
  }

  protected override getDefaultErrorMessage(): string {
    return 'This field is required.';
  }
}

