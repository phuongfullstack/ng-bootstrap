import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
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
export class InputComponent implements OnInit, OnChanges {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() hint?: string;
  @Input() type: string = 'text';
  @Input() id?: string;
  @Input() formControl?: FormControl;
  @Input() formGroup?: FormGroup;
  @Input() controlName?: string;
  @Input() autocomplete?: string;
  @Input() required = false;
  @Input() readonly = false;
  @Input() disabled = false;
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

  protected resolvedControl?: FormControl;
  protected generatedId = `app-input-${uniqueId++}`;

  ngOnInit(): void {
    this.resolveControl();
    this.syncDisabledState();
    console.log(this.min, this.max);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['formControl'] ||
      changes['formGroup'] ||
      changes['controlName']
    ) {
      this.resolveControl();
    }

    if (changes['disabled']) {
      this.syncDisabledState();
    }
  }

  protected get control(): FormControl {
    if (!this.resolvedControl) {
      throw new Error('Form control is not available on InputComponent.');
    }
    return this.resolvedControl;
  }

  protected get inputId(): string {
    return this.id ?? this.generatedId;
  }

  protected get shouldShowErrors(): boolean {
    const ctrl = this.control;
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  protected get errorList(): string[] {
    const ctrl = this.control;
    if (!ctrl.errors) {
      return [];
    }

    return Object.entries(ctrl.errors).map(([errorKey, errorValue]) => {
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
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.control.markAsTouched();
    this.blurred.emit(event);
  }

  private resolveControl(): void {
    if (this.formControl) {
      this.resolvedControl = this.formControl;
      return;
    }

    if (this.formGroup && this.controlName) {
      const control = this.formGroup.get(this.controlName);
      if (!control) {
        throw new Error(
          `Control "${this.controlName}" was not found on provided FormGroup.`
        );
      }
      this.resolvedControl = control as FormControl;
      return;
    }

    if (!this.resolvedControl) {
      throw new Error(
        'InputComponent requires either "formControl" or (formGroup + controlName).'
      );
    }
  }

  private syncDisabledState(): void {
    const ctrl = this.resolvedControl;
    if (!ctrl) {
      return;
    }

    if (this.disabled && !ctrl.disabled) {
      ctrl.disable({ emitEvent: false });
    }

    if (!this.disabled && ctrl.disabled) {
      ctrl.enable({ emitEvent: false });
    }
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
      return resolver(errorValue, this.control);
    }

    return resolver;
  }
}

