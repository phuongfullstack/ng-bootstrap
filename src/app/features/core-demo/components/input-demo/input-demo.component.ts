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

  protected lastValueChange?: string;
  protected lastBlur?: Date;
  protected lastFocus?: Date;

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

  protected onValueChange(value: string): void {
    this.lastValueChange = value;
  }

  protected onFocus(): void {
    this.lastFocus = new Date();
  }

  protected onBlur(): void {
    this.lastBlur = new Date();
  }

  protected submit(): void {
    if (this.demoForm.invalid) {
      this.demoForm.markAllAsTouched();
      return;
    }

    console.table(this.demoForm.value);
  }
}

