import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CoreDatetimepickerComponent } from '@shared/components';

@Component({
  selector: 'app-datetime-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreDatetimepickerComponent],
  templateUrl: './datetime-demo.component.html',
  styleUrl: './datetime-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatetimeDemoComponent {
  readonly demoForm: FormGroup;
  readonly disabledDates = [new Date(), new Date(Date.now() + 86400000)];
  readonly minBoundary = new Date(2024, 0, 1);
  readonly maxBoundary = new Date(2025, 11, 31);

  constructor(private readonly fb: FormBuilder) {
    this.demoForm = this.fb.group({
      basicDate: [null],
      datetime: [null],
      range: [{ start: null, end: null }],
      inline: [new Date()]
    });
  }

  get formValue(): string {
    return JSON.stringify(this.demoForm.value, null, 2);
  }
}

