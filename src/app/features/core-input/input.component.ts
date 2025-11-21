import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Optional,
  Output,
  Self
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule
} from '@angular/forms';
import {
  ValidationMessageResolver,
  defaultValidationMessages
} from '@shared/validation';

let uniqueId = 0;

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() type: string = 'text';
  @Input() id?: string;
  @Input() autocomplete?: string;
  @Input() required = false;
  @Input() readonly = false;
  @Input() showValidationState = true;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() min?: number;
  @Input() max?: number;
  @Input() step?: number;
  @Input() pattern?: string;
  @Input() errorMessages: Record<string, ValidationMessageResolver> = {};

  @Output() valueChange = new EventEmitter<string>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  protected value: string | number | null = '';
  protected disabled = false;
  protected generatedId = `app-input-${uniqueId++}`;

  private onChange = (value: string | number | null): void => { };
  private onTouched = (): void => { };

  constructor(@Optional() @Self() private ngControl: NgControl | null = null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    // Sync disabled state from NgControl if available
    if (this.ngControl?.control) {
      this.setDisabledState = (isDisabled: boolean): void => {
        this.disabled = isDisabled;
      };
    }
  }

  protected get control(): FormControl | null {
    return (this.ngControl?.control as FormControl) ?? null;
  }

  protected get inputId(): string {
    return this.id ?? this.generatedId;
  }

  protected get shouldShowErrors(): boolean {
    const control = this.control;
    if (!control) {
      return false;
    }
    return control.invalid && (control.dirty || control.touched);
  }

  protected get isInvalid(): boolean {
    return this.shouldShowErrors && this.showValidationState;
  }

  protected get isValid(): boolean {
    const control = this.control;
    if (!control) {
      return false;
    }
    return (
      this.showValidationState &&
      control.valid &&
      (control.dirty || control.touched)
    );
  }

  protected get errorList(): string[] {
    const control = this.control;
    if (!control || !control.errors) {
      return [];
    }

    return Object.entries(control.errors).map(([errorKey, errorValue]) => {
      const customMessage = this.resolveMessage(
        this.errorMessages[errorKey],
        errorValue
      );
      if (customMessage) {
        return customMessage;
      }
      return this.buildDefaultErrorMessage(errorKey, errorValue);
    });
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
    this.onTouched();
    if (this.control) {
      this.control.markAsTouched();
    }
    this.blurred.emit(event);
  }

  // ControlValueAccessor implementation
  writeValue(value: string | number | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string | number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private buildDefaultErrorMessage(
    errorKey: string,
    errorValue: unknown
  ): string {
    const defaultMessage = this.resolveMessage(
      defaultValidationMessages[errorKey],
      errorValue
    );

    if (defaultMessage) {
      return defaultMessage;
    }

    return 'Invalid value.';
  }

  private resolveMessage(
    resolver: ValidationMessageResolver | undefined,
    errorValue: unknown
  ): string | null {
    if (!resolver) {
      return null;
    }

    if (typeof resolver === 'function') {
      const control = this.control;
      if (!control) {
        return null;
      }
      return resolver(errorValue, control);
    }

    return resolver;
  }
}

