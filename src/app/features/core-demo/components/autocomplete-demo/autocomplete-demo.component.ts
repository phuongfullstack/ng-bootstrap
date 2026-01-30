import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreAutocompleteComponent, type AutoCompleteOption } from '@shared/components';

@Component({
  selector: 'app-autocomplete-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreAutocompleteComponent],
  templateUrl: './autocomplete-demo.component.html',
  styleUrl: './autocomplete-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteDemoComponent {
  readonly demoForm: FormGroup;

  // Sample data
  readonly countryOptions: AutoCompleteOption[] = [
    { value: 'vn', label: 'Vietnam', group: 'Asia' },
    { value: 'us', label: 'United States', group: 'North America' },
    { value: 'jp', label: 'Japan', group: 'Asia' },
    { value: 'kr', label: 'South Korea', group: 'Asia' },
    { value: 'cn', label: 'China', group: 'Asia' },
    { value: 'th', label: 'Thailand', group: 'Asia' },
    { value: 'sg', label: 'Singapore', group: 'Asia' },
    { value: 'uk', label: 'United Kingdom', group: 'Europe' },
    { value: 'de', label: 'Germany', group: 'Europe' },
    { value: 'fr', label: 'France', group: 'Europe' },
    { value: 'it', label: 'Italy', group: 'Europe' },
    { value: 'es', label: 'Spain', group: 'Europe' },
    { value: 'ca', label: 'Canada', group: 'North America' },
    { value: 'au', label: 'Australia', group: 'Oceania' },
    { value: 'nz', label: 'New Zealand', group: 'Oceania' }
  ];

  readonly cityOptions: AutoCompleteOption[] = [
    { value: 'hanoi', label: 'Hanoi' },
    { value: 'hcm', label: 'Ho Chi Minh' },
    { value: 'danang', label: 'Da Nang' },
    { value: 'haiphong', label: 'Hai Phong' },
    { value: 'cantho', label: 'Can Tho' },
    { value: 'nhatrang', label: 'Nha Trang' },
    { value: 'dalat', label: 'Da Lat' },
    { value: 'vungtau', label: 'Vung Tau' },
    { value: 'hue', label: 'Hue' },
    { value: 'hoian', label: 'Hoi An' }
  ];

  readonly programmingLanguages: AutoCompleteOption[] = [
    { value: 'js', label: 'JavaScript', group: 'Web' },
    { value: 'ts', label: 'TypeScript', group: 'Web' },
    { value: 'py', label: 'Python', group: 'Backend' },
    { value: 'java', label: 'Java', group: 'Backend' },
    { value: 'cs', label: 'C#', group: 'Backend' },
    { value: 'go', label: 'Go', group: 'Backend' },
    { value: 'rust', label: 'Rust', group: 'Systems' },
    { value: 'cpp', label: 'C++', group: 'Systems' },
    { value: 'swift', label: 'Swift', group: 'Mobile' },
    { value: 'kotlin', label: 'Kotlin', group: 'Mobile' },
    { value: 'dart', label: 'Dart', group: 'Mobile' },
    { value: 'php', label: 'PHP', group: 'Web' },
    { value: 'ruby', label: 'Ruby', group: 'Web' },
    { value: 'scala', label: 'Scala', group: 'Backend' },
    { value: 'r', label: 'R', group: 'Data Science' }
  ];

  readonly emailOptions: AutoCompleteOption[] = [
    { value: 'user1@gmail.com', label: 'user1@gmail.com' },
    { value: 'admin@company.com', label: 'admin@company.com' },
    { value: 'support@example.com', label: 'support@example.com' },
    { value: 'info@test.com', label: 'info@test.com' }
  ];

  constructor(private readonly fb: FormBuilder) {
    this.demoForm = this.fb.group({
      country: ['', Validators.required],
      city: [''],
      language: [''],
      email: ['', [Validators.required, Validators.email]],
      freeText: ['']
    });
  }

  onCountrySearch(query: string): void {
    // Handle country search
  }

  onCountrySelected(option: AutoCompleteOption): void {
    // Handle country selection
  }

  onCitySearch(query: string): void {
    // Handle city search
  }

  onLanguageSelected(option: AutoCompleteOption): void {
    // Handle language selection
  }

  onEmailCleared(): void {
    // Handle email field cleared
  }

  resetForm(): void {
    this.demoForm.reset();
  }

  get formValue(): string {
    return JSON.stringify(this.demoForm.value, null, 2);
  }
}
