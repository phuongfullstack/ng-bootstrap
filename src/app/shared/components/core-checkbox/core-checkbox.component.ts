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
import { BaseFormControlComponent } from '@shared/components/base/base-form-control.component';

let uniqueId = 0;

export interface CheckboxOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'core-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './core-checkbox.component.html',
  styleUrls: ['./core-checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreCheckboxComponent extends BaseFormControlComponent {
  @Input() inline = false;
  @Input() size?: 'sm' | 'md' | 'lg';
  @Input() indeterminate?: boolean;
  @Input() options?: CheckboxOption[]; // For checkbox group
  @Input() standaloneDisabled = false; // For standalone usage (without formControl)
  @Input() standaloneValue?: boolean | (string | number)[]; // For standalone usage (without formControl)

  @Output() valueChange = new EventEmitter<boolean | (string | number)[]>();
  @Output() checkedChange = new EventEmitter<boolean>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();
  @Output() indeterminateChange = new EventEmitter<boolean>();

  protected override generatedId = `core-checkbox-${uniqueId++}`;

  constructor(
    @Optional() @Self() ngControl: NgControl | null = null,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(ngControl);
  }

  protected get checkboxId(): string {
    return this.controlId;
  }

  protected get isGroupMode(): boolean {
    return !!this.options && this.options.length > 0;
  }

  protected get checkboxValue(): boolean {
    const currentValue = this.effectiveValue;
    return currentValue === true || currentValue === 'true' || currentValue === 1;
  }

  protected get checkboxGroupValue(): any[] {
    const currentValue = this.effectiveValue;
    return Array.isArray(currentValue) ? currentValue : [];
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

  protected isOptionChecked(optionValue: string | number): boolean {
    if (!this.isGroupMode) return false;
    const currentValue = this.effectiveValue;

    // Checkbox group returns array of selected values (e.g., ['reading', 'gaming'])
    if (Array.isArray(currentValue)) {
      return currentValue.includes(optionValue);
    }

    return false;
  }

  protected onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    // Update value based on usage mode
    if (this.ngControl) {
      this.value = isChecked;
      this.onChange(isChecked);
    } else {
      this.standaloneValue = isChecked;
    }

    this.valueChange.emit(isChecked);
    this.checkedChange.emit(isChecked);
  }

  protected onGroupCheckboxChange(
    event: Event,
    optionValue: string | number
  ): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentSelectedValues = Array.isArray(this.effectiveValue) ? [...this.effectiveValue] : [];

    // Checkbox group returns array of selected values (e.g., ['reading', 'gaming'])
    let updatedSelectedValues: (string | number)[];

    if (isChecked) {
      // Add value if not already in array
      if (!currentSelectedValues.includes(optionValue)) {
        updatedSelectedValues = [...currentSelectedValues, optionValue];
      } else {
        updatedSelectedValues = currentSelectedValues;
      }
    } else {
      // Remove value from array
      updatedSelectedValues = currentSelectedValues.filter(
        selectedValue => selectedValue !== optionValue
      );
    }

    // Update value based on usage mode
    if (this.ngControl) {
      this.value = updatedSelectedValues;
      this.onChange(updatedSelectedValues);
    } else {
      this.standaloneValue = updatedSelectedValues;
    }

    this.valueChange.emit(updatedSelectedValues);
  }

  protected onIndeterminateChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (this.indeterminate !== undefined) {
      this.indeterminateChange.emit(isChecked);
    }
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleBlur();
    this.blurred.emit(event);
  }

  override writeValue(value: any): void {
    if (this.isGroupMode) {
      this.value = Array.isArray(value) ? value : [];
    } else {
      this.value = value === true || value === 'true' || value === 1;
    }
    this.changeDetectorRef.markForCheck();
  }

  protected get effectiveValue(): any {
    if (this.standaloneValue !== undefined && !this.ngControl) {
      return this.standaloneValue;
    }
    return this.value;
  }

  protected override getDefaultValue(): any {
    return this.isGroupMode ? [] : false;
  }

  protected override getDefaultErrorMessage(): string {
    return 'This field is required.';
  }
}

