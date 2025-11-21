import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreDropdownComponent, type DropdownOption } from '@shared/components';

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreDropdownComponent],
  templateUrl: './dropdown-demo.component.html',
  styleUrl: './dropdown-demo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownDemoComponent {
  readonly demoForm: FormGroup;

  // Options for different dropdowns
  readonly countryOptions: DropdownOption[] = [
    { value: 'vn', label: 'Việt Nam' },
    { value: 'us', label: 'Hoa Kỳ' },
    { value: 'jp', label: 'Nhật Bản' },
    { value: 'kr', label: 'Hàn Quốc' },
    { value: 'cn', label: 'Trung Quốc' },
    { value: 'th', label: 'Thái Lan' }
  ];

  readonly cityOptions: DropdownOption[] = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' }
  ];

  readonly skillOptions: DropdownOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' }
  ];

  readonly statusOptions: DropdownOption[] = [
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'inactive', label: 'Không hoạt động', disabled: true },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'completed', label: 'Hoàn thành' }
  ];

  readonly sizeOptions: DropdownOption[] = [
    { value: 'xs', label: 'Extra Small' },
    { value: 's', label: 'Small' },
    { value: 'm', label: 'Medium' },
    { value: 'l', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  currentSize: 'sm' | 'lg' | undefined = undefined;

  constructor(private readonly fb: FormBuilder) {
    this.demoForm = this.fb.group({
      country: ['', Validators.required],
      city: [''],
      skills: [[]],
      status: ['active'],
      size: ['m'],
      disabledField: [{ value: 'pending', disabled: true }]
    });
  }

  onCountryChange(value: any): void {
    console.log('Country changed:', value);
  }

  onCityChange(value: any): void {
    console.log('City changed:', value);
  }

  onSkillsChange(value: any): void {
    console.log('Skills selected:', value);
  }

  onSizeChange(value: any): void {
    console.log('Size changed:', value);
    if (value === 's' || value === 'xs') {
      this.currentSize = 'sm';
    } else if (value === 'l' || value === 'xl') {
      this.currentSize = 'lg';
    } else {
      this.currentSize = undefined;
    }
  }

  onFocus(event: FocusEvent, fieldName: string): void {
    console.log(`${fieldName} focused`, event);
  }

  onBlur(event: FocusEvent, fieldName: string): void {
    console.log(`${fieldName} blurred`, event);
  }

  resetForm(): void {
    this.demoForm.reset({
      country: '',
      city: '',
      skills: [],
      status: 'active',
      size: 'm',
      disabledField: { value: 'pending', disabled: true }
    });
  }

  get formValue(): string {
    return JSON.stringify(this.demoForm.value, null, 2);
  }
}
