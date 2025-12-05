import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Button variant types matching Bootstrap button styles
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Button type attributes
 */
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'core-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-button.component.html',
  styleUrls: ['./core-button.component.css'],
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

  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();
  @Output() mouseEntered = new EventEmitter<MouseEvent>();
  @Output() mouseLeft = new EventEmitter<MouseEvent>();
  @Output() doubleClicked = new EventEmitter<MouseEvent>();
  @Output() keyPressed = new EventEmitter<KeyboardEvent>();

  /**
   * Computed button classes based on inputs
   * Single Responsibility: Only responsible for generating CSS classes
   */
  protected get buttonClasses(): string {
    const classes: string[] = ['btn'];

    // Variant class
    if (this.outline) {
      classes.push(`btn-outline-${this.variant}`);
    } else {
      classes.push(`btn-${this.variant}`);
    }

    // Size class (only if not default 'md')
    if (this.size !== 'md') {
      classes.push(`btn-${this.size}`);
    }

    // Block (full width)
    if (this.block) {
      classes.push('w-100');
    }

    // Rounded styles
    if (this.roundedCircle) {
      classes.push('rounded-circle');
    } else if (this.rounded) {
      classes.push('rounded-pill');
    }

    // Custom class
    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes.join(' ');
  }

  /**
   * Check if button should be disabled
   * Combines disabled state with loading state
   */
  protected get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  /**
   * Handle click event
   * Emits clicked event if not disabled/loading
   */
  protected onButtonClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.clicked.emit(event);
  }

  /**
   * Handle focus event
   */
  protected onFocus(event: FocusEvent): void {
    if (!this.isDisabled) {
      this.focused.emit(event);
    }
  }

  /**
   * Handle blur event
   */
  protected onBlur(event: FocusEvent): void {
    if (!this.isDisabled) {
      this.blurred.emit(event);
    }
  }

  /**
   * Handle mouse enter event
   */
  protected onMouseEnter(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.mouseEntered.emit(event);
    }
  }

  /**
   * Handle mouse leave event
   */
  protected onMouseLeave(event: MouseEvent): void {
    if (!this.isDisabled) {
      this.mouseLeft.emit(event);
    }
  }

  /**
   * Handle double click event
   */
  protected onDoubleClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.doubleClicked.emit(event);
  }

  /**
   * Handle keyboard events (Enter, Space)
   * Ensures accessibility and proper keyboard navigation
   * Note: Native button element handles Enter/Space automatically,
   * but we emit keyPressed for custom handling if needed
   */
  protected onKeyDown(event: KeyboardEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Prevent default behavior for Space (scroll prevention)
    if (event.key === ' ') {
      event.preventDefault();
    }

    this.keyPressed.emit(event);
  }

  /**
   * Check if icon should be displayed on the left
   */
  protected get hasLeftIcon(): boolean {
    return !!this.icon && this.iconPosition === 'left';
  }

  /**
   * Check if icon should be displayed on the right
   */
  protected get hasRightIcon(): boolean {
    return !!this.icon && this.iconPosition === 'right';
  }
}
