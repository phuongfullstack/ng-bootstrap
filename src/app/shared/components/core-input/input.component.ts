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
 * Core input component with Bootstrap 5.3 styling
 * Supports reactive forms, validation, and various input types
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends BaseFormControlComponent {
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

  protected override generatedId = `app-input-${uniqueId++}`;

  constructor(@Optional() @Self() ngControl: NgControl | null = null) {
    super(ngControl);
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
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleBlur();
    this.blurred.emit(event);
  }

  protected override getDefaultValue(): any {
    return '';
  }

  protected override getDefaultErrorMessage(): string {
    return 'Invalid value.';
  }
}

