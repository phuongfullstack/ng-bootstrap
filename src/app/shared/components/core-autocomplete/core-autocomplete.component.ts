import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Optional,
  Output,
  Self,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlComponent } from '../base/base-form-control.component';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

let uniqueId = 0;

export interface AutoCompleteOption {
  value: any;
  label: string;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'core-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './core-autocomplete.component.html',
  styleUrls: ['./core-autocomplete.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreAutocompleteComponent extends BaseFormControlComponent implements OnDestroy {
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef<HTMLInputElement>;

  @Input() placeholder: string = 'Nhập để tìm kiếm...';
  @Input() options: AutoCompleteOption[] = [];
  @Input() minChars: number = 1;
  @Input() debounceTime: number = 300;
  @Input() maxResults: number = 10;
  @Input() allowFreeText: boolean = false;
  @Input() showClearButton: boolean = true;
  @Input() loadingText: string = 'Đang tải...';
  @Input() noResultsText: string = 'Không tìm thấy kết quả';
  @Input() caseSensitive: boolean = false;

  @Output() search = new EventEmitter<string>();
  @Output() selected = new EventEmitter<any>();
  @Output() cleared = new EventEmitter<void>();
  @Output() valueChange = new EventEmitter<any>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  protected override generatedId = `app-autocomplete-${uniqueId++}`;
  protected displayValue: string = '';
  protected isDropdownOpen: boolean = false;
  protected filteredOptions: AutoCompleteOption[] = [];
  protected highlightedIndex: number = -1;
  protected isLoading: boolean = false;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private selectedOption: AutoCompleteOption | null = null;

  constructor(
    @Optional() @Self() ngControl: NgControl | null,
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef
  ) {
    super(ngControl);
    this.setupSearchSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected get inputId(): string {
    return this.controlId;
  }

  protected get showDropdown(): boolean {
    return this.isDropdownOpen && (this.filteredOptions.length > 0 || this.isLoading);
  }

  protected get showNoResults(): boolean {
    return (
      this.isDropdownOpen &&
      !this.isLoading &&
      this.filteredOptions.length === 0 &&
      this.displayValue.length >= this.minChars
    );
  }

  private setupSearchSubscription(): void {
    this.searchSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.performSearch(query);
      });
  }

  protected onInputChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.displayValue = inputValue;
    this.selectedOption = null;

    if (this.allowFreeText) {
      this.value = inputValue;
      this.onChange(inputValue);
      this.valueChange.emit(inputValue);
    }

    if (inputValue.length >= this.minChars) {
      this.isDropdownOpen = true;
      this.searchSubject.next(inputValue);
    } else {
      this.isDropdownOpen = false;
      this.filteredOptions = [];
    }

    this.cdr.markForCheck();
  }

  private performSearch(query: string): void {
    this.isLoading = true;
    this.search.emit(query);

    // Filter local options
    const searchTerm = this.caseSensitive ? query : query.toLowerCase();
    this.filteredOptions = this.options
      .filter((option) => {
        const label = this.caseSensitive ? option.label : option.label.toLowerCase();
        return label.includes(searchTerm) && !option.disabled;
      })
      .slice(0, this.maxResults);

    this.isLoading = false;
    this.highlightedIndex = this.filteredOptions.length > 0 ? 0 : -1;
    this.cdr.markForCheck();
  }

  protected selectOption(option: AutoCompleteOption, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (option.disabled) return;

    this.selectedOption = option;
    this.displayValue = option.label;
    this.value = option.value;
    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.selected.emit(option);
    this.closeDropdown();
    this.cdr.markForCheck();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (!this.isDropdownOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter') {
        this.isDropdownOpen = true;
        if (this.displayValue.length >= this.minChars) {
          this.performSearch(this.displayValue);
        }
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        this.highlightNext();
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.highlightPrevious();
        event.preventDefault();
        break;
      case 'Enter':
        if (this.highlightedIndex >= 0 && this.highlightedIndex < this.filteredOptions.length) {
          this.selectOption(this.filteredOptions[this.highlightedIndex], event);
        }
        event.preventDefault();
        break;
      case 'Escape':
        this.closeDropdown();
        event.preventDefault();
        break;
    }
  }

  private highlightNext(): void {
    if (this.highlightedIndex < this.filteredOptions.length - 1) {
      this.highlightedIndex++;
      this.scrollToHighlighted();
      this.cdr.markForCheck();
    }
  }

  private highlightPrevious(): void {
    if (this.highlightedIndex > 0) {
      this.highlightedIndex--;
      this.scrollToHighlighted();
      this.cdr.markForCheck();
    }
  }

  private scrollToHighlighted(): void {
    setTimeout(() => {
      const dropdown = this.elementRef.nativeElement.querySelector('.autocomplete-dropdown');
      const highlighted = dropdown?.querySelector('.autocomplete-item.highlighted');
      if (dropdown && highlighted) {
        const dropdownRect = dropdown.getBoundingClientRect();
        const highlightedRect = highlighted.getBoundingClientRect();

        if (highlightedRect.bottom > dropdownRect.bottom) {
          highlighted.scrollIntoView({ block: 'end', behavior: 'smooth' });
        } else if (highlightedRect.top < dropdownRect.top) {
          highlighted.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }
    });
  }

  protected clearInput(): void {
    this.displayValue = '';
    this.value = null;
    this.selectedOption = null;
    this.filteredOptions = [];
    this.isDropdownOpen = false;
    this.onChange(null);
    this.valueChange.emit(null);
    this.cleared.emit();
    this.inputElement?.nativeElement.focus();
    this.cdr.markForCheck();
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    // Delay to allow click on dropdown items
    setTimeout(() => {
      if (!this.allowFreeText && !this.selectedOption && this.displayValue) {
        this.displayValue = '';
        this.value = null;
        this.onChange(null);
      }
      this.closeDropdown();
      this.handleBlur();
      this.blurred.emit(event);
      this.cdr.markForCheck();
    }, 200);
  }

  private closeDropdown(): void {
    this.isDropdownOpen = false;
    this.highlightedIndex = -1;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
      this.cdr.markForCheck();
    }
  }

  protected highlightMatch(text: string, query: string): string {
    if (!query || query.length < this.minChars) return text;

    const searchTerm = this.caseSensitive ? query : query.toLowerCase();
    const textToSearch = this.caseSensitive ? text : text.toLowerCase();
    const index = textToSearch.indexOf(searchTerm);

    if (index === -1) return text;

    return (
      text.substring(0, index) +
      '<strong>' +
      text.substring(index, index + query.length) +
      '</strong>' +
      text.substring(index + query.length)
    );
  }

  override writeValue(value: any): void {
    super.writeValue(value);

    if (value) {
      const option = this.options.find(opt => opt.value === value);
      if (option) {
        this.selectedOption = option;
        this.displayValue = option.label;
      } else if (this.allowFreeText) {
        this.displayValue = String(value);
      }
    } else {
      this.displayValue = '';
      this.selectedOption = null;
    }

    this.cdr.markForCheck();
  }

  protected override getDefaultValue(): any {
    return null;
  }

  protected override getDefaultErrorMessage(): string {
    return 'Giá trị không hợp lệ.';
  }

  /**
   * Public API to update options dynamically (for async loading)
   */
  updateOptions(options: AutoCompleteOption[]): void {
    this.options = options;
    if (this.isDropdownOpen && this.displayValue.length >= this.minChars) {
      this.performSearch(this.displayValue);
    }
  }

  /**
   * Public API to set loading state
   */
  setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.cdr.markForCheck();
  }
}
