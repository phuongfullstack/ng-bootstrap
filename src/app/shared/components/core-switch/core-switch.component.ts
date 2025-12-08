import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Optional,
    Output,
    Self
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { BaseFormControlComponent } from '@shared/components/base/base-form-control.component';
import { BootstrapVariant } from '@shared/types/bootstrap-variant.types';

let uniqueId = 0;

@Component({
    selector: 'core-switch',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './core-switch.component.html',
    styleUrls: ['./core-switch.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreSwitchComponent extends BaseFormControlComponent {
    @Input() size: 'sm' | 'md' | 'lg' = 'md';
    @Input() variant: BootstrapVariant = 'primary';
    @Input() labelPosition: 'left' | 'right' = 'right';
    @Input() standaloneDisabled = false;
    @Input() standaloneValue?: boolean;
    @Input() indeterminate = false;

    @Output() valueChange = new EventEmitter<boolean>();
    @Output() checkedChange = new EventEmitter<boolean>();
    @Output() focused = new EventEmitter<FocusEvent>();
    @Output() blurred = new EventEmitter<FocusEvent>();
    @Output() clicked = new EventEmitter<MouseEvent>();
    @Output() indeterminateChange = new EventEmitter<boolean>();

    protected override generatedId = `core-switch-${uniqueId++}`;

    constructor(
        @Optional() @Self() ngControl: NgControl | null = null,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {
        super(ngControl);
    }

    protected get switchId(): string {
        return this.controlId;
    }

    protected get switchValue(): boolean {
        const currentValue = this.effectiveValue;
        if (this.indeterminate) {
            return false;
        }
        if (typeof currentValue === 'boolean') {
            return currentValue;
        }
        if (typeof currentValue === 'string') {
            return currentValue === 'true';
        }
        if (typeof currentValue === 'number') {
            return currentValue === 1;
        }
        return false;
    }

    protected get isDisabled(): boolean {
        return this.standaloneDisabled || this.disabled;
    }

    protected get sizeClass(): string {
        return `form-switch-${this.size}`;
    }

    protected get switchClasses(): string {
        const classes: string[] = ['form-check', 'form-switch'];
        if (this.size !== 'md') {
            classes.push(this.sizeClass);
        }
        if (this.inline) {
            classes.push('form-check-inline');
        }
        if (this.isInvalid) {
            classes.push('is-invalid');
        }
        if (this.isValid) {
            classes.push('is-valid');
        }
        return classes.join(' ');
    }

    protected get effectiveValue(): boolean | string | number {
        if (this.ngControl?.control) {
            return this.value ?? false;
        }
        return this.standaloneValue ?? false;
    }

    protected get inline(): boolean {
        return this.labelPosition === 'left';
    }

    protected onSwitchChange(event: Event): void {
        if (this.isDisabled) {
            event.preventDefault();
            return;
        }

        const target = event.target as HTMLInputElement;
        const newValue = target.checked;

        if (this.indeterminate) {
            this.indeterminate = false;
            this.indeterminateChange.emit(false);
        }

        if (this.ngControl?.control) {
            this.value = newValue;
            this.onChange(newValue);
        } else {
            this.standaloneValue = newValue;
        }

        this.valueChange.emit(newValue);
        this.checkedChange.emit(newValue);
        this.changeDetectorRef.markForCheck();
    }

    protected onSwitchClick(event: MouseEvent): void {
        if (!this.isDisabled) {
            this.clicked.emit(event);
        }
    }

    protected onSwitchFocus(event: FocusEvent): void {
        if (!this.isDisabled) {
            this.focused.emit(event);
        }
    }

    protected onSwitchBlur(event: FocusEvent): void {
        this.handleBlur();
        if (!this.isDisabled) {
            this.blurred.emit(event);
        }
    }

    protected override getDefaultValue(): boolean {
        return false;
    }

    protected override getDefaultErrorMessage(): string {
        return 'This field is required.';
    }
}

