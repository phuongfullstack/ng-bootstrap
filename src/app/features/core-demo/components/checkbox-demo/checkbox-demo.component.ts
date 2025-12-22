import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CoreCheckboxComponent, CheckboxOption } from '@shared/components/core-checkbox/core-checkbox.component';

type DemoEventType = 'valueChange' | 'checkedChange' | 'focus' | 'blur' | 'indeterminateChange';

interface DemoEventLogEntry {
  control: string;
  type: DemoEventType;
  value?: string | boolean | boolean[];
  timestamp: Date;
}

@Component({
  selector: 'app-checkbox-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreCheckboxComponent],
  templateUrl: './checkbox-demo.component.html',
  styleUrl: './checkbox-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxDemoComponent {
  readonly demoForm: FormGroup;
  readonly groupForm: FormGroup;

  protected readonly eventTypeLabel: Record<DemoEventType, string> = {
    valueChange: 'Value change',
    checkedChange: 'Checked change',
    focus: 'Focus',
    blur: 'Blur',
    indeterminateChange: 'Indeterminate change'
  };

  protected eventLog: DemoEventLogEntry[] = [];

  protected readonly hobbyOptions: CheckboxOption[] = [
    { value: 'reading', label: 'Đọc sách' },
    { value: 'gaming', label: 'Chơi game' },
    { value: 'sports', label: 'Thể thao' },
    { value: 'music', label: 'Âm nhạc' },
    { value: 'travel', label: 'Du lịch' }
  ];

  protected readonly skillOptions: CheckboxOption[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React', disabled: true },
    { value: 'vue', label: 'Vue.js' }
  ];

  protected indeterminateState = false;

  constructor(private readonly fb: FormBuilder) {
    this.demoForm = this.fb.group({
      acceptTerms: [false, Validators.requiredTrue],
      subscribeNewsletter: [false],
      rememberMe: [true]
    });

    this.groupForm = this.fb.group({
      hobbies: [[], [Validators.required, Validators.minLength(2)]],
      skills: [[], Validators.required]
    });
  }

  protected onValueChange(control: string, value: boolean | (string | number)[]): void {
    this.pushEvent({
      control,
      type: 'valueChange',
      value: Array.isArray(value) ? JSON.stringify(value) : String(value),
      timestamp: new Date()
    });
  }

  protected onCheckedChange(control: string, checked: boolean): void {
    this.pushEvent({
      control,
      type: 'checkedChange',
      value: String(checked),
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

  protected onIndeterminateChange(checked: boolean): void {
    this.indeterminateState = checked;
    this.pushEvent({
      control: 'triState',
      type: 'indeterminateChange',
      value: String(checked),
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

  protected toggleIndeterminate(): void {
    this.indeterminateState = !this.indeterminateState;
  }

  private pushEvent(entry: DemoEventLogEntry): void {
    this.eventLog = [entry, ...this.eventLog].slice(0, 15);
  }
}

