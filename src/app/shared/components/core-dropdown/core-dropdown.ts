import {
  ChangeDetectionStrategy,
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

/**
 * Represents an option in the dropdown list
 */
export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
}

/**
 * Core dropdown component with Bootstrap 5.3 styling
 * Supports reactive forms, validation, multiple selection, and accessibility
 */
@Component({
  selector: 'app-core-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './core-dropdown.html',
  styleUrl: './core-dropdown.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreDropdownComponent extends BaseFormControlComponent {
  @Input() placeholder: string = 'Chọn một tùy chọn';
  @Input() override disabled = false;
  @Input() options: DropdownOption[] = [];
  @Input() multiple = false;
  @Input() size?: 'sm' | 'lg';

  @Output() valueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  protected isDisabled = false;
  protected override generatedId = `app-dropdown-${uniqueId++}`;

  constructor(@Optional() @Self() ngControl: NgControl | null = null) {
    super(ngControl);
  }

  protected get selectId(): string {
    return this.controlId;
  }

  protected get sizeClass(): string {
    if (this.size === 'sm') return 'form-select-sm';
    if (this.size === 'lg') return 'form-select-lg';
    return '';
  }

  protected onChangeEvent(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    let selectedValue: any;

    if (this.multiple) {
      const selectedOptions = Array.from(selectElement.selectedOptions);
      selectedValue = selectedOptions.map(option => option.value);
    } else {
      selectedValue = selectElement.value;
      // Convert back to original value type if needed
      const selectedOption = this.options.find(opt => String(opt.value) === selectedValue);
      if (selectedOption) {
        selectedValue = selectedOption.value;
      }
    }

    this.value = selectedValue;
    this.onChange(selectedValue);
    this.valueChange.emit(selectedValue);
    this.selectionChange.emit(selectedValue);
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleBlur();
    this.blurred.emit(event);
  }

  protected override getDefaultValue(): any {
    return this.multiple ? [] : null;
  }

  protected override getDefaultErrorMessage(): string {
    return 'Giá trị không hợp lệ.';
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this.isDisabled = isDisabled;
  }
}
