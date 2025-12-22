import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapVariant } from '@shared/types/bootstrap-variant.types';

export type ButtonVariant = BootstrapVariant;
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'core-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-button.component.html',
  styleUrls: ['./core-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreButtonComponent {
  @Input() type: ButtonType = 'button';
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Input() outline = false;
  @Input() rounded = false;
  @Input() roundedCircle = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() customClass?: string;
  @Input() draggable = false;

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();
  @Output() mouseEntered = new EventEmitter<MouseEvent>();
  @Output() mouseLeft = new EventEmitter<MouseEvent>();
  @Output() doubleClicked = new EventEmitter<MouseEvent>();
  @Output() keyPressed = new EventEmitter<KeyboardEvent>();
  @Output() dragStarted = new EventEmitter<DragEvent>();
  @Output() dragged = new EventEmitter<DragEvent>();
  @Output() dragEnded = new EventEmitter<DragEvent>();
  @Output() dragEntered = new EventEmitter<DragEvent>();
  @Output() dragOvered = new EventEmitter<DragEvent>();
  @Output() dragLeft = new EventEmitter<DragEvent>();
  @Output() dropped = new EventEmitter<DragEvent>();

  protected get buttonClasses(): string {
    const classes: string[] = ['btn'];

    if (this.outline) {
      classes.push(`btn-outline-${this.variant}`);
    } else {
      classes.push(`btn-${this.variant}`);
    }

    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }

    if (this.block) {
      classes.push('w-100');
    }

    if (this.roundedCircle) {
      classes.push('rounded-circle');
    } else if (this.rounded) {
      classes.push('rounded-pill');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes.join(' ');
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  protected onButtonClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    if (!this.isDisabled) {
      this.focused.emit(event);
    }
  }

  protected onBlur(event: FocusEvent): void {
    if (!this.isDisabled) {
      this.blurred.emit(event);
    }
  }

  protected onMouseEnter(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.mouseEntered.emit(event);
    }
  }

  protected onMouseLeave(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.mouseLeft.emit(event);
    }
  }

  protected onDoubleClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.doubleClicked.emit(event);
  }

  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();
    }

    this.keyPressed.emit(event);
  }

  protected get hasLeftIcon(): boolean {
    return !!this.icon && this.iconPosition === 'left';
  }

  protected get hasRightIcon(): boolean {
    return !!this.icon && this.iconPosition === 'right';
  }

  protected onDragStart(event: DragEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      return;
    }
    this.dragStarted.emit(event);
  }

  protected onDrag(event: DragEvent): void {
    if (!this.isDisabled) {
      this.dragged.emit(event);
    }
  }

  protected onDragEnd(event: DragEvent): void {
    if (!this.isDisabled) {
      this.dragEnded.emit(event);
    }
  }

  protected onDragEnter(event: DragEvent): void {
    if (!this.isDisabled) {
      this.dragEntered.emit(event);
    }
  }

  protected onDragOver(event: DragEvent): void {
    if (!this.isDisabled) {
      event.preventDefault();
      this.dragOvered.emit(event);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    if (!this.isDisabled) {
      this.dragLeft.emit(event);
    }
  }

  protected onDrop(event: DragEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    this.dropped.emit(event);
  }
}
