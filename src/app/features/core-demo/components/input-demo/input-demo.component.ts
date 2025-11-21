import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { InputComponent } from '@features/core-input/input.component';
import {
  ageRangeValidator,
  emailDomainValidator,
  textLengthValidator
} from '@shared/validation';

type DemoEventType = 'valueChange' | 'focus' | 'blur';

interface DemoEventLogEntry {
  control: string;
  type: DemoEventType;
  value?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './input-demo.component.html',
  styleUrl: './input-demo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputDemoComponent {
  readonly demoForm: FormGroup;

  protected readonly eventTypeLabel: Record<DemoEventType, string> = {
    valueChange: 'Value change',
    focus: 'Focus',
    blur: 'Blur'
  };

  protected eventLog: DemoEventLogEntry[] = [];

  constructor(private readonly fb: FormBuilder) {
    this.demoForm = this.fb.group({
      fullName: ['', [Validators.required, textLengthValidator(3)]],
      email: [
        '',
        [
          Validators.required,
          emailDomainValidator(['example.com', 'acme.com', 'gmail.com'])
        ]
      ],
      age: [null, [ageRangeValidator(12, 65)]]
    });
  }

  protected onValueChange(control: string, value: string): void {
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

  private pushEvent(entry: DemoEventLogEntry): void {
    this.eventLog = [entry, ...this.eventLog].slice(0, 10);
  }
}

