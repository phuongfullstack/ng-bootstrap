import { Directive, Input, OnInit, Optional, Self } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NgControl
} from '@angular/forms';
import {
  ValidationMessageResolver,
  defaultValidationMessages
} from '@shared/validation';

/**
 * Base class for form control components
 * Provides common functionality for reactive forms integration and validation
 */
@Directive()
export abstract class BaseFormControlComponent implements OnInit, ControlValueAccessor {
  @Input() label?: string;
  @Input() hint?: string;
  @Input() id?: string;
  @Input() required = false;
  @Input() showValidationState = true;
  @Input() errorMessages: Record<string, ValidationMessageResolver> = {};

  protected value: any = null;
  protected disabled = false;
  protected abstract generatedId: string;

  protected onChange = (value: any): void => { };
  protected onTouched = (): void => { };

  constructor(@Optional() @Self() protected ngControl: NgControl | null = null) {
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

  protected get controlId(): string {
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

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.value = value ?? this.getDefaultValue();
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected handleBlur(): void {
    this.onTouched();
    if (this.control) {
      this.control.markAsTouched();
    }
  }

  protected abstract getDefaultValue(): any;

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

    return this.getDefaultErrorMessage();
  }

  protected abstract getDefaultErrorMessage(): string;

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
