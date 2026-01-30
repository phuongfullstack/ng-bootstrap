import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreDropdownComponent, type DropdownOption } from '@shared/components';

@Component({
  selector: 'app-dropdown-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreDropdownComponent],
  templateUrl: './dropdown-demo.component.html',
  styleUrl: './dropdown-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownDemoComponent {
  readonly demoForm: FormGroup;

  // Options for different dropdowns
  readonly countryOptions: DropdownOption[] = [
    { value: 'vn', label: 'Vietnam' },
    { value: 'us', label: 'United States' },
    { value: 'jp', label: 'Japan' },
    { value: 'kr', label: 'South Korea' },
    { value: 'cn', label: 'China' },
    { value: 'th', label: 'Thailand' }
  ];

  readonly cityOptions: DropdownOption[] = [
    { value: 'hanoi', label: 'Hanoi' },
    { value: 'hcm', label: 'Ho Chi Minh City' },
    { value: 'danang', label: 'Da Nang' },
    { value: 'haiphong', label: 'Hai Phong' },
    { value: 'cantho', label: 'Can Tho' }
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
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive', disabled: true },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
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
    // Handle country change
  }

  onCityChange(value: any): void {
    // Handle city change
  }

  onSkillsChange(value: any): void {
    // Handle skills selection
  }

  onSizeChange(value: any): void {
    // Handle size change
    if (value === 's' || value === 'xs') {
      this.currentSize = 'sm';
    } else if (value === 'l' || value === 'xl') {
      this.currentSize = 'lg';
    } else {
      this.currentSize = undefined;
    }
  }

  onFocus(event: FocusEvent, fieldName: string): void {
    // Handle field focus
  }

  onBlur(event: FocusEvent, fieldName: string): void {
    // Handle field blur
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
