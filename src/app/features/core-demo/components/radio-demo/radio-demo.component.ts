import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CoreRadioComponent, RadioOption } from '@shared/components/core-radio/core-radio.component';

type DemoEventType = 'valueChange' | 'focus' | 'blur';

interface DemoEventLogEntry {
  control: string;
  type: DemoEventType;
  value?: string | number;
  timestamp: Date;
}

@Component({
  selector: 'app-radio-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreRadioComponent],
  templateUrl: './radio-demo.component.html',
  styleUrl: './radio-demo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioDemoComponent {
  readonly demoForm: FormGroup;
  readonly groupForm: FormGroup;

  protected readonly eventTypeLabel: Record<DemoEventType, string> = {
    valueChange: 'Value change',
    focus: 'Focus',
    blur: 'Blur'
  };

  protected eventLog: DemoEventLogEntry[] = [];

  protected readonly genderOptions: RadioOption[] = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' }
  ];

  protected readonly paymentOptions: RadioOption[] = [
    { value: 'credit', label: 'Thẻ tín dụng', hint: 'Visa, Mastercard' },
    { value: 'debit', label: 'Thẻ ghi nợ', hint: 'ATM card' },
    { value: 'paypal', label: 'PayPal', hint: 'Online payment' },
    { value: 'bank', label: 'Chuyển khoản', hint: 'Bank transfer', disabled: true }
  ];

  protected readonly sizeOptions: RadioOption[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  protected readonly priorityOptions: RadioOption[] = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
    { value: 4, label: 'Critical' }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.demoForm = this.fb.group({
      gender: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      size: ['md'],
      priority: [2, Validators.required]
    });

    this.groupForm = this.fb.group({
      notification: ['email', Validators.required],
      theme: ['light']
    });
  }

  protected onValueChange(control: string, value: string | number): void {
    this.pushEvent({
      control,
      type: 'valueChange',
      value,
      timestamp: new Date()
    });
  }

  protected onFocus(control: string): void {
    this.pushEvent({
      control,
      type: 'focus',
      timestamp: new Date()
    });
  }

  protected onBlur(control: string): void {
    this.pushEvent({
      control,
      type: 'blur',
      timestamp: new Date()
    });
  }

  protected submit(): void {
    if (this.demoForm.invalid) {
      this.demoForm.markAllAsTouched();
      return;
    }
    console.table(this.demoForm.value);
  }

  protected submitGroup(): void {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    console.table(this.groupForm.value);
  }

  protected resetForm(): void {
    this.demoForm.reset({
      gender: '',
      paymentMethod: '',
      size: 'md',
      priority: 2
    });
  }

  protected resetGroupForm(): void {
    this.groupForm.reset({
      notification: 'email',
      theme: 'light'
    });
  }

  protected get formValue(): string {
    return JSON.stringify(this.demoForm.value, null, 2);
  }

  protected get groupFormValue(): string {
    return JSON.stringify(this.groupForm.value, null, 2);
  }

  private pushEvent(entry: DemoEventLogEntry): void {
    this.eventLog = [entry, ...this.eventLog].slice(0, 15);
  }
}

