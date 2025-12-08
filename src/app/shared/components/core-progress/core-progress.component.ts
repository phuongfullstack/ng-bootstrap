import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreProgressVariant, CoreProgressItem } from './core-progress.types';


@Component({
  selector: 'core-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-progress.component.html',
  styleUrls: ['./core-progress.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreProgressComponent implements OnChanges {
  constructor(private readonly cdr: ChangeDetectorRef) { }

  @Input() value = 0;
  @Input() max = 100;
  @Input() variant: CoreProgressVariant = 'primary';
  @Input() striped = false;
  @Input() animated = false;
  @Input() showLabel = false;
  @Input() label?: string;
  @Input() height?: string;
  @Input() rounded = false;
  @Input() indeterminate = false;
  @Input() buffer = false;
  @Input() bufferValue = 0;
  @Input() multi?: CoreProgressItem[];
  @Input() stacked = false;
  @Input() customClass?: string;
  @Input() ariaLabel?: string;

  @Output() valueChange = new EventEmitter<number>();
  @Output() completed = new EventEmitter<void>();
  @Output() started = new EventEmitter<void>();
  @Output() mouseEnter = new EventEmitter<MouseEvent>();
  @Output() mouseLeave = new EventEmitter<MouseEvent>();
  @Output() clicked = new EventEmitter<MouseEvent>();

  protected get percentage(): number {
    if (this.indeterminate) {
      return 0;
    }
    const clampedValue = Math.max(0, Math.min(this.value, this.max));
    return Math.round((clampedValue / this.max) * 100);
  }

  protected get bufferPercentage(): number {
    if (!this.buffer) {
      return 0;
    }
    const clampedBuffer = Math.max(0, Math.min(this.bufferValue, this.max));
    return Math.round((clampedBuffer / this.max) * 100);
  }

  protected get isComplete(): boolean {
    return !this.indeterminate && this.value >= this.max;
  }

  protected get displayLabel(): string {
    if (this.label) {
      return this.label;
    }
    if (this.showLabel && !this.indeterminate) {
      return `${this.percentage}%`;
    }
    return '';
  }

  protected get progressBarClasses(): string {
    const classes: string[] = ['progress-bar'];
    classes.push(`bg-${this.variant}`);

    if (this.striped || this.animated) {
      classes.push('progress-bar-striped');
    }

    if (this.animated && this.striped) {
      classes.push('progress-bar-animated');
    }

    if (this.indeterminate) {
      classes.push('progress-bar-indeterminate');
    }

    if (this.rounded) {
      classes.push('rounded');
    }

    if (this.customClass) {
      classes.push(this.customClass);
    }

    return classes.join(' ');
  }

  protected get progressContainerClasses(): string {
    const classes: string[] = ['progress'];
    if (this.stacked) {
      classes.push('progress-stacked');
    }
    if (this.rounded) {
      classes.push('rounded');
    }
    return classes.join(' ');
  }

  protected get containerStyles(): Record<string, string> {
    const styles: Record<string, string> = {};
    if (this.height) {
      styles['height'] = this.height;
    }
    return styles;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.cdr.markForCheck();

      if (!changes['value'].firstChange) {
        this.valueChange.emit(this.value);
      }

      if (!changes['value'].firstChange && changes['value'].previousValue === 0 && this.value > 0) {
        this.started.emit();
      }

      if (!this.indeterminate && this.value >= this.max && (changes['value'].previousValue ?? 0) < this.max) {
        this.completed.emit();
      }
    }

    if (changes['bufferValue'] || changes['buffer'] || changes['multi'] || changes['stacked']) {
      this.cdr.markForCheck();
    }
  }

  protected onMouseEnter(event: MouseEvent): void {
    this.mouseEnter.emit(event);
  }

  protected onMouseLeave(event: MouseEvent): void {
    this.mouseLeave.emit(event);
  }

  protected onClick(event: MouseEvent): void {
    this.clicked.emit(event);
  }

  protected getItemPercentage(item: CoreProgressItem, itemMax: number): number {
    const clampedValue = Math.max(0, Math.min(item.value, itemMax));
    return Math.round((clampedValue / itemMax) * 100);
  }

  protected getItemClasses(item: CoreProgressItem): string {
    const classes: string[] = ['progress-bar'];
    const variant = item.variant ?? this.variant;
    classes.push(`bg-${variant}`);

    if (item.striped ?? this.striped) {
      classes.push('progress-bar-striped');
    }

    if ((item.animated ?? this.animated) && (item.striped ?? this.striped)) {
      classes.push('progress-bar-animated');
    }

    if (this.rounded) {
      classes.push('rounded');
    }

    return classes.join(' ');
  }

  protected get isMultiMode(): boolean {
    return !!this.multi && this.multi.length > 0;
  }
}

