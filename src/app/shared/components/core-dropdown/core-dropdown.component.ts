import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlComponent } from '@shared/components/base/base-form-control.component';
import { Subscription } from 'rxjs';

let uniqueId = 0;

export interface DropdownOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'core-dropdown',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './core-dropdown.component.html',
  styleUrls: ['./core-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreDropdownComponent
  extends BaseFormControlComponent
  implements OnInit, OnDestroy {

  @Input() placeholder = 'Chọn một tùy chọn';
  @Input() override disabled = false;
  @Input() options: DropdownOption[] = [];
  @Input() multiple = false;
  @Input() size?: 'sm' | 'lg';

  @Output() valueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

  protected isDisabled = false;
  protected override generatedId = `core-dropdown-${uniqueId++}`;

  private subscriptions: Subscription[] = [];

  constructor(
    @Optional() @Self() ngControl: NgControl | null,
    private readonly cdr: ChangeDetectorRef
  ) {
    super(ngControl);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.control) {
      this.subscriptions.push(
        this.control.statusChanges.subscribe(() => this.cdr.markForCheck()),
        this.control.valueChanges.subscribe(() => this.cdr.markForCheck())
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  get selectId(): string {
    return this.controlId;
  }

  get sizeClass(): Record<string, boolean> {
    return {
      'form-select-sm': this.size === 'sm',
      'form-select-lg': this.size === 'lg'
    };
  }

  get selectValue(): string {
    return this.multiple || this.value == null ? '' : String(this.value);
  }

  protected isOptionSelected(optionValue: any): boolean {
    if (!this.multiple || !Array.isArray(this.value)) return false;
    return this.value.some(v => String(v) === String(optionValue));
  }

  protected onChangeEvent(event: Event): void {
    const select = event.target as HTMLSelectElement;

    let result: any;

    if (this.multiple) {
      const options = Array.from(select.selectedOptions);
      result = options.map(opt => {
        const o = this.options.find(x => String(x.value) === opt.value);
        return o ? o.value : opt.value;
      });
    } else {
      const rawValue = select.value;
      if (rawValue === '') {
        result = null;
      } else {
        const opt = this.options.find(x => String(x.value) === rawValue);
        result = opt ? opt.value : rawValue;
      }
    }

    this.value = result;
    this.onChange(result);
    this.valueChange.emit(result);
    this.selectionChange.emit(result);
    this.cdr.markForCheck();
  }

  protected onFocus(event: FocusEvent): void {
    this.focused.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.handleBlur();
    this.blurred.emit(event);
    this.cdr.markForCheck();
  }

  override getDefaultValue(): any {
    return this.multiple ? [] : null;
  }

  override getDefaultErrorMessage(): string {
    return 'Giá trị không hợp lệ.';
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  override writeValue(value: any): void {
    super.writeValue(value);
    this.cdr.markForCheck();
  }
}
