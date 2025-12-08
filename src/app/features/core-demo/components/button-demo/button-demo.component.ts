import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreButtonComponent, ButtonVariant, ButtonSize } from '@shared/components/core-button/core-button.component';
import { CoreToastrService } from '@shared/services/core-toastr.service';

type ButtonEventType =
    | 'clicked'
    | 'focused'
    | 'blurred'
    | 'mouseEntered'
    | 'mouseLeft'
    | 'doubleClicked'
    | 'keyPressed'
    | 'dragStarted'
    | 'dragged'
    | 'dragEnded'
    | 'dragEntered'
    | 'dragOvered'
    | 'dragLeft'
    | 'dropped';

interface ButtonEventLogEntry {
    type: ButtonEventType;
    button: string;
    details?: string;
    timestamp: Date;
}

@Component({
    selector: 'app-button-demo',
    standalone: true,
    imports: [CommonModule, CoreButtonComponent],
    templateUrl: './button-demo.component.html',
    styleUrl: './button-demo.component.css'
})
export class ButtonDemoComponent {
    protected readonly eventTypeLabel: Record<ButtonEventType, string> = {
        clicked: 'Clicked',
        focused: 'Focused',
        blurred: 'Blurred',
        mouseEntered: 'Mouse Enter',
        mouseLeft: 'Mouse Leave',
        doubleClicked: 'Double Click',
        keyPressed: 'Key Press',
        dragStarted: 'Drag Start',
        dragged: 'Drag',
        dragEnded: 'Drag End',
        dragEntered: 'Drag Enter',
        dragOvered: 'Drag Over',
        dragLeft: 'Drag Leave',
        dropped: 'Drop'
    };

    protected eventLog: ButtonEventLogEntry[] = [];

    constructor(private readonly toastr: CoreToastrService) { }

    protected onButtonClick(buttonName: string, event: MouseEvent): void {
        this.pushEvent({ type: 'clicked', button: buttonName, timestamp: new Date() });
        this.toastr.success(`Button "${buttonName}" clicked`, 'Button Event');
    }

    protected onFocus(buttonName: string, event: FocusEvent): void {
        this.pushEvent({ type: 'focused', button: buttonName, timestamp: new Date() });
    }

    protected onBlur(buttonName: string, event: FocusEvent): void {
        this.pushEvent({ type: 'blurred', button: buttonName, timestamp: new Date() });
    }

    protected onMouseEnter(buttonName: string, event: MouseEvent): void {
        this.pushEvent({ type: 'mouseEntered', button: buttonName, timestamp: new Date() });
    }

    protected onMouseLeave(buttonName: string, event: MouseEvent): void {
        this.pushEvent({ type: 'mouseLeft', button: buttonName, timestamp: new Date() });
    }

    protected onDoubleClick(buttonName: string, event: MouseEvent): void {
        this.pushEvent({ type: 'doubleClicked', button: buttonName, timestamp: new Date() });
        this.toastr.warning(`Button "${buttonName}" double clicked`, 'Double Click');
    }

    protected onKeyPress(buttonName: string, event: KeyboardEvent): void {
        this.pushEvent({
            type: 'keyPressed',
            button: buttonName,
            details: `Key: ${event.key}`,
            timestamp: new Date()
        });
    }

    protected onDragStart(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dragStarted', button: buttonName, timestamp: new Date() });
        this.toastr.info(`Button "${buttonName}" drag started`, 'Drag Event');
    }

    protected onDrag(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dragged', button: buttonName, timestamp: new Date() });
    }

    protected onDragEnd(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dragEnded', button: buttonName, timestamp: new Date() });
        this.toastr.success(`Button "${buttonName}" drag ended`, 'Drag Event');
    }

    protected onDragEnter(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dragEntered', button: buttonName, timestamp: new Date() });
    }

    protected onDragOver(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dragOvered', button: buttonName, timestamp: new Date() });
    }

    protected onDragLeave(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dragLeft', button: buttonName, timestamp: new Date() });
    }

    protected onDrop(buttonName: string, event: DragEvent): void {
        this.pushEvent({ type: 'dropped', button: buttonName, timestamp: new Date() });
        this.toastr.warning(`Button "${buttonName}" dropped`, 'Drop Event');
    }

    private pushEvent(entry: ButtonEventLogEntry): void {
        this.eventLog = [entry, ...this.eventLog].slice(0, 20);
    }
}

