import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CoreSwitchComponent } from '@shared/components/core-switch/core-switch.component';
import { CoreToastrService } from '@shared/services/core-toastr.service';

type SwitchEventType = 'valueChange' | 'checkedChange' | 'focused' | 'blurred' | 'clicked' | 'indeterminateChange';

interface SwitchEventLogEntry {
    type: SwitchEventType;
    switch: string;
    value?: boolean;
    timestamp: Date;
}

@Component({
    selector: 'app-switch-demo',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, CoreSwitchComponent],
    templateUrl: './switch-demo.component.html',
    styleUrl: './switch-demo.component.scss'
})
export class SwitchDemoComponent {
    protected readonly eventTypeLabel: Record<SwitchEventType, string> = {
        valueChange: 'Value Change',
        checkedChange: 'Checked Change',
        focused: 'Focused',
        blurred: 'Blurred',
        clicked: 'Clicked',
        indeterminateChange: 'Indeterminate Change'
    };

    protected eventLog: SwitchEventLogEntry[] = [];

    readonly demoForm: FormGroup;
    standaloneValue = false;
    indeterminateValue = false;

    constructor(
        private readonly fb: FormBuilder,
        private readonly toastr: CoreToastrService
    ) {
        this.demoForm = this.fb.group({
            notifications: [true],
            darkMode: [false],
            autoSave: [true, Validators.requiredTrue],
            publicProfile: [false]
        });
    }

    protected onValueChange(switchName: string, value: boolean): void {
        this.pushEvent({ type: 'valueChange', switch: switchName, value, timestamp: new Date() });
        this.toastr.info(`Switch "${switchName}" changed to <strong>${value ? 'ON' : 'OFF'}</strong>`, 'Value Changed', {
            autoClose: true,
            duration: 2000
        });
    }

    protected onCheckedChange(switchName: string, checked: boolean): void {
        this.pushEvent({ type: 'checkedChange', switch: switchName, value: checked, timestamp: new Date() });
    }

    protected onFocus(switchName: string, event: FocusEvent): void {
        this.pushEvent({ type: 'focused', switch: switchName, timestamp: new Date() });
    }

    protected onBlur(switchName: string, event: FocusEvent): void {
        this.pushEvent({ type: 'blurred', switch: switchName, timestamp: new Date() });
    }

    protected onClick(switchName: string, event: MouseEvent): void {
        this.pushEvent({ type: 'clicked', switch: switchName, timestamp: new Date() });
    }

    protected onIndeterminateChange(switchName: string, value: boolean): void {
        this.pushEvent({ type: 'indeterminateChange', switch: switchName, value, timestamp: new Date() });
        this.toastr.warning(`Switch "${switchName}" indeterminate state changed`, 'Indeterminate Changed', {
            autoClose: true,
            duration: 2000
        });
    }

    protected onSubmit(): void {
        if (this.demoForm.valid) {
            this.toastr.success('Form submitted successfully!', 'Success', {
                autoClose: true,
                duration: 3000
            });
        } else {
            this.demoForm.markAllAsTouched();
            this.toastr.error('Please fix form errors', 'Validation Error');
        }
    }

    private pushEvent(entry: SwitchEventLogEntry): void {
        this.eventLog = [entry, ...this.eventLog].slice(0, 20);
    }
}

