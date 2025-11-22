import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreAutocompleteComponent, type AutoCompleteOption } from '@shared/components';

@Component({
  selector: 'app-autocomplete-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CoreAutocompleteComponent],
  templateUrl: './autocomplete-demo.component.html',
  styleUrl: './autocomplete-demo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutocompleteDemoComponent {
  readonly demoForm: FormGroup;

  // Sample data
  readonly countryOptions: AutoCompleteOption[] = [
    { value: 'vn', label: 'Việt Nam', group: 'Châu Á' },
    { value: 'us', label: 'Hoa Kỳ', group: 'Bắc Mỹ' },
    { value: 'jp', label: 'Nhật Bản', group: 'Châu Á' },
    { value: 'kr', label: 'Hàn Quốc', group: 'Châu Á' },
    { value: 'cn', label: 'Trung Quốc', group: 'Châu Á' },
    { value: 'th', label: 'Thái Lan', group: 'Châu Á' },
    { value: 'sg', label: 'Singapore', group: 'Châu Á' },
    { value: 'uk', label: 'Vương quốc Anh', group: 'Châu Âu' },
    { value: 'de', label: 'Đức', group: 'Châu Âu' },
    { value: 'fr', label: 'Pháp', group: 'Châu Âu' },
    { value: 'it', label: 'Ý', group: 'Châu Âu' },
    { value: 'es', label: 'Tây Ban Nha', group: 'Châu Âu' },
    { value: 'ca', label: 'Canada', group: 'Bắc Mỹ' },
    { value: 'au', label: 'Úc', group: 'Châu Đại Dương' },
    { value: 'nz', label: 'New Zealand', group: 'Châu Đại Dương' }
  ];

  readonly cityOptions: AutoCompleteOption[] = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hcm', label: 'Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'nhatrang', label: 'Nha Trang' },
    { value: 'dalat', label: 'Đà Lạt' },
    { value: 'vungtau', label: 'Vũng Tàu' },
    { value: 'hue', label: 'Huế' },
    { value: 'hoian', label: 'Hội An' }
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
    console.log('Searching for country:', query);
  }

  onCountrySelected(option: AutoCompleteOption): void {
    console.log('Country selected:', option);
  }

  onCitySearch(query: string): void {
    console.log('Searching for city:', query);
  }

  onLanguageSelected(option: AutoCompleteOption): void {
    console.log('Language selected:', option);
  }

  onEmailCleared(): void {
    console.log('Email field cleared');
  }

  resetForm(): void {
    this.demoForm.reset();
  }

  get formValue(): string {
    return JSON.stringify(this.demoForm.value, null, 2);
  }
}
