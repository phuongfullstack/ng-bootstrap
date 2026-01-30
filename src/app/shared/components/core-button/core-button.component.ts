import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapVariant } from '@shared/types/bootstrap-variant.types';
import { BUTTON_DEFAULTS } from '@shared/constants';

export type ButtonVariant = BootstrapVariant;
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * A highly customizable button component built on Bootstrap 5.3.
 * 
 * @example
 * ```typescript
 * <core-button 
 *   variant="primary" 
 *   size="md"
 *   (clicked)="handleClick()">
 *   Click Me
 * </core-button>
 * ```
 * 
 * @example With icon
 * ```typescript
 * <core-button 
 *   variant="success" 
 *   icon="bi-check-circle"
 *   iconPosition="left">
 *   Save
 * </core-button>
 * ```
 */
@Component({
  selector: 'core-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-button.component.html',
  styleUrls: ['./core-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreButtonComponent {
  /** Button HTML type attribute. Default: 'button' */
  @Input() type: ButtonType = BUTTON_DEFAULTS.TYPE;
  
  /** Bootstrap color variant. Default: 'primary' */
  @Input() variant: ButtonVariant = BUTTON_DEFAULTS.VARIANT;
  
  /** Button size. Default: 'md' */
  @Input() size: ButtonSize = BUTTON_DEFAULTS.SIZE;
  
  /** Whether button is disabled. Default: false */
  @Input() disabled: boolean = BUTTON_DEFAULTS.DISABLED;
  
  /** Whether button is in loading state with spinner. Default: false */
  @Input() loading: boolean = BUTTON_DEFAULTS.LOADING;
  
  /** Whether button should take full width. Default: false */
  @Input() block: boolean = BUTTON_DEFAULTS.BLOCK;
  
  /** Whether to use outline style. Default: false */
  @Input() outline: boolean = BUTTON_DEFAULTS.OUTLINE;
  
  /** Whether button should be rounded (pill shape). Default: false */
  @Input() rounded: boolean = BUTTON_DEFAULTS.ROUNDED;
  
  /** Whether button should be circular. Default: false */
  @Input() roundedCircle: boolean = BUTTON_DEFAULTS.ROUNDED_CIRCLE;
  
  /** Bootstrap icon class (e.g., 'bi-check-circle') */
  @Input() icon?: string;
  
  /** Position of icon relative to text. Default: 'left' */
  @Input() iconPosition: 'left' | 'right' = BUTTON_DEFAULTS.ICON_POSITION;
  
  /** Additional CSS classes to apply */
  @Input() customClass?: string;
  
  /** Whether button is draggable. Default: false */
  @Input() draggable: boolean = BUTTON_DEFAULTS.DRAGGABLE;

  /** Emitted when button is clicked */
  @Output() clicked = new EventEmitter<MouseEvent>();
  
  /** Emitted when button receives focus */
  @Output() focused = new EventEmitter<FocusEvent>();
  
  /** Emitted when button loses focus */
  @Output() blurred = new EventEmitter<FocusEvent>();
  
  /** Emitted when mouse enters button area */
  @Output() mouseEntered = new EventEmitter<MouseEvent>();
  
  /** Emitted when mouse leaves button area */
  @Output() mouseLeft = new EventEmitter<MouseEvent>();
  
  /** Emitted when button is double-clicked */
  @Output() doubleClicked = new EventEmitter<MouseEvent>();
  
  /** Emitted when a key is pressed while button has focus */
  @Output() keyPressed = new EventEmitter<KeyboardEvent>();
  
  /** Emitted when drag operation starts */
  @Output() dragStarted = new EventEmitter<DragEvent>();
  
  /** Emitted during drag operation */
  @Output() dragged = new EventEmitter<DragEvent>();
  
  /** Emitted when drag operation ends */
  @Output() dragEnded = new EventEmitter<DragEvent>();
  
  /** Emitted when dragged element enters this button */
  @Output() dragEntered = new EventEmitter<DragEvent>();
  
  /** Emitted when dragged element is over this button */
  @Output() dragOvered = new EventEmitter<DragEvent>();
  
  /** Emitted when dragged element leaves this button */
  @Output() dragLeft = new EventEmitter<DragEvent>();
  
  /** Emitted when element is dropped on this button */
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
