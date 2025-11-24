import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseFormControlComponent } from '../base/base-form-control.component';
import { NgControl } from '@angular/forms';

type PickerMode = 'date' | 'time' | 'datetime';
type SelectionMode = 'single' | 'range';

interface DateRangeValue {
  start: Date | null;
  end: Date | null;
}

interface CalendarCell {
  date: Date;
  label: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isSelected: boolean;
  isRangeEdge: boolean;
  isInRange: boolean;
}

let uniqueId = 0;

@Component({
  selector: 'core-datetimepicker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-datetimepicker.component.html',
  styleUrl: './core-datetimepicker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreDatetimepickerComponent
  extends BaseFormControlComponent
  implements OnDestroy, OnChanges {
  @Input() mode: PickerMode = 'date';
  @Input() selectionMode: SelectionMode = 'single';
  @Input() placeholder = 'Chọn thời gian';
  @Input() minDate?: Date | string;
  @Input() maxDate?: Date | string;
  @Input() disabledDates: (Date | string)[] = [];
  @Input() disableWeekends = false;
  @Input() autoClose = true;
  @Input() weekStartsOn: 0 | 1 = 1; // 0 = Sunday, 1 = Monday
  @Input() inline = false;
  @Input() showFooter = true;
  @Input() timeStepMinutes = 15;
  @Input() showTodayShortcut = true;
  @Input() displayFormat = 'yyyy-MM-dd HH:mm';

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() valueCommitted = new EventEmitter<Date | DateRangeValue | null>();

  @ViewChild('toggleButton') toggleButton?: ElementRef<HTMLButtonElement>;

  protected override generatedId = `core-datetimepicker-${++uniqueId}`;
  protected isPanelOpen = false;
  protected calendarWeeks: CalendarCell[][] = [];
  protected viewDate = new Date();
  protected hoursList = Array.from({ length: 24 }, (_, idx) => idx);

  private readonly disabledDateSet = new Set<string>();
  private pendingRange: DateRangeValue = { start: null, end: null };
  protected tempTime = { hour: 0, minute: 0 };

  constructor(
    @Optional() @Self() ngControl: NgControl | null,
    private readonly cdr: ChangeDetectorRef,
    private readonly hostRef: ElementRef<HTMLElement>
  ) {
    super(ngControl);
    this.syncDisabledDates();
    this.initializeTime();
    this.buildCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabledDates']) {
      this.syncDisabledDates();
    }
    if (changes['minDate'] || changes['maxDate'] || changes['weekStartsOn']) {
      this.buildCalendar();
    }
    if (changes['inline'] && this.inline) {
      this.isPanelOpen = true;
    }
    if (changes['timeStepMinutes']) {
      this.cdr.markForCheck();
    }
  }

  override writeValue(value: any): void {
    if (this.selectionMode === 'range') {
      const incoming: DateRangeValue | null = value ?? { start: null, end: null };
      this.value = {
        start: incoming?.start ? new Date(incoming.start) : null,
        end: incoming?.end ? new Date(incoming.end) : null
      };
      this.pendingRange = { ...this.value } as DateRangeValue;
    } else {
      this.value = value ? new Date(value) : null;
      if (this.value instanceof Date && !Number.isNaN(this.value.getTime())) {
        this.viewDate = new Date(this.value);
        this.tempTime = {
          hour: this.value.getHours(),
          minute: this.value.getMinutes()
        };
      }
    }
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  protected get displayValue(): string {
    if (this.selectionMode === 'range') {
      const range = this.value as DateRangeValue | null;
      if (!range || (!range.start && !range.end)) {
        return '';
      }
      const startText = range.start ? this.formatDisplay(range.start) : '...';
      const endText = range.end ? this.formatDisplay(range.end) : '...';
      return `${startText} → ${endText}`;
    }
    const dateValue = this.value as Date | null;
    if (!dateValue) {
      return '';
    }
    return this.formatDisplay(dateValue);
  }

  protected togglePanel(): void {
    if (this.disabled || this.inline) {
      return;
    }
    this.isPanelOpen = !this.isPanelOpen;
    if (this.isPanelOpen) {
      this.opened.emit();
    } else {
      this.closed.emit();
    }
    this.cdr.markForCheck();
  }

  protected selectDay(cell: CalendarCell): void {
    if (cell.isDisabled) {
      return;
    }
    const clickedDate = new Date(
      cell.date.getFullYear(),
      cell.date.getMonth(),
      cell.date.getDate(),
      this.tempTime.hour,
      this.tempTime.minute
    );

    if (this.selectionMode === 'range') {
      this.handleRangeSelection(clickedDate);
    } else {
      this.commitValue(clickedDate);
    }
  }

  protected goToPrevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    this.buildCalendar();
  }

  protected goToNextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
    this.buildCalendar();
  }

  protected goToToday(): void {
    const now = new Date();
    this.viewDate = now;
    this.buildCalendar();
    if (this.selectionMode === 'single') {
      this.commitValue(now);
    }
  }

  protected changeHour(hour: number): void {
    this.tempTime.hour = hour;
    this.applyTimeChange();
  }

  protected changeMinute(minute: number): void {
    this.tempTime.minute = minute;
    this.applyTimeChange();
  }

  protected isRangeSelection(): boolean {
    return this.selectionMode === 'range';
  }

  protected get minuteOptions(): number[] {
    const step = Math.max(1, this.timeStepMinutes);
    return Array.from({ length: Math.floor(60 / step) }, (_, idx) => idx * step);
  }

  protected get shouldRenderPanel(): boolean {
    return this.inline || this.isPanelOpen;
  }

  protected get weekdayHeaders(): string[] {
    const base = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    if (this.weekStartsOn === 0) {
      return base;
    }
    return [...base.slice(1), base[0]];
  }

  protected clearSelection(): void {
    if (this.selectionMode === 'range') {
      this.value = { start: null, end: null };
      this.pendingRange = { start: null, end: null };
    } else {
      this.value = null;
    }
    this.onChange(this.value);
    this.valueCommitted.emit(this.value);
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  protected get monthLabel(): string {
    return new Intl.DateTimeFormat('vi-VN', {
      month: 'long',
      year: 'numeric'
    }).format(this.viewDate);
  }

  protected get hasTimePicker(): boolean {
    return this.mode !== 'date';
  }

  protected trackByWeek(_: number, week: CalendarCell[]): string {
    return week.map(day => day.date.toISOString()).join('-');
  }

  protected trackByDay(_: number, day: CalendarCell): string {
    return day.date.toISOString();
  }

  ngOnDestroy(): void {}
  @HostListener('document:click', ['$event'])
  protected handleDocumentClick(event: Event): void {
    if (
      this.inline ||
      !this.isPanelOpen ||
      this.hostRef.nativeElement.contains(event.target as Node)
    ) {
      return;
    }
    this.isPanelOpen = false;
    this.closed.emit();
    this.cdr.markForCheck();
  }

  @HostListener('keydown.escape')
  protected onEscape(): void {
    if (!this.inline && this.isPanelOpen) {
      this.isPanelOpen = false;
      this.closed.emit();
      this.cdr.markForCheck();
    }
  }

  private syncDisabledDates(): void {
    this.disabledDateSet.clear();
    this.disabledDates.forEach(value => {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        this.disabledDateSet.add(this.dateKey(date));
      }
    });
  }

  private handleRangeSelection(clicked: Date): void {
    if (!this.pendingRange.start || this.pendingRange.end) {
      this.pendingRange = { start: clicked, end: null };
      this.buildCalendar();
      this.cdr.markForCheck();
      return;
    }

    if (this.dateKey(clicked) === this.dateKey(this.pendingRange.start)) {
      this.pendingRange = { start: clicked, end: null };
      this.buildCalendar();
      this.cdr.markForCheck();
      return;
    }

    const start = this.pendingRange.start;
    const end = clicked < start ? start : clicked;
    const adjustedStart = clicked < start ? clicked : start;

    this.pendingRange = { start: adjustedStart, end };
    this.value = { ...this.pendingRange };
    this.onChange(this.value);
    this.valueCommitted.emit(this.value);

    if (this.autoClose && !this.inline) {
      this.isPanelOpen = false;
      this.closed.emit();
    }

    this.pendingRange = { start: null, end: null };
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  private commitValue(next: Date): void {
    const finalDate = new Date(next);
    this.value = finalDate;
    this.onChange(finalDate);
    this.valueCommitted.emit(finalDate);
    if (this.autoClose && !this.inline) {
      this.isPanelOpen = false;
      this.closed.emit();
    }
    this.buildCalendar();
    this.cdr.markForCheck();
  }

  private applyTimeChange(): void {
    if (this.selectionMode === 'single' && this.value instanceof Date) {
      const updated = new Date(this.value);
      updated.setHours(this.tempTime.hour, this.tempTime.minute, 0, 0);
      this.value = updated;
      this.onChange(updated);
      this.valueCommitted.emit(updated);
      this.cdr.markForCheck();
    }
  }

  private formatDisplay(date: Date): string {
    if (this.mode === 'time') {
      return new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    }
    if (this.mode === 'date') {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    }
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  private buildCalendar(): void {
    const firstDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    const startDay = this.calculateCalendarStart(firstDayOfMonth);
    const weeks: CalendarCell[][] = [];
    const todayKey = this.dateKey(new Date());

    for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
      const week: CalendarCell[] = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDate = new Date(
          startDay.getFullYear(),
          startDay.getMonth(),
          startDay.getDate() + weekIndex * 7 + dayIndex
        );
        const cell: CalendarCell = {
          date: currentDate,
          label: currentDate.getDate(),
          isCurrentMonth: currentDate.getMonth() === this.viewDate.getMonth(),
          isToday: this.dateKey(currentDate) === todayKey,
          isDisabled: this.isDateDisabled(currentDate),
          isSelected: this.isDateSelected(currentDate),
          isRangeEdge: this.isRangeEdge(currentDate),
          isInRange: this.isInsideRange(currentDate)
        };
        week.push(cell);
      }
      weeks.push(week);
    }

    this.calendarWeeks = weeks;
  }

  private calculateCalendarStart(firstDay: Date): Date {
    const dayOfWeek = firstDay.getDay();
    const diff = (dayOfWeek - this.weekStartsOn + 7) % 7;
    return new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate() - diff);
  }

  private isDateDisabled(date: Date): boolean {
    if (this.mode === 'time') {
      return false;
    }
    if (this.disableWeekends) {
      const day = date.getDay();
      if (day === 0 || day === 6) {
        return true;
      }
    }
    if (this.minDate) {
      const min = new Date(this.minDate);
      if (date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) {
        return true;
      }
    }
    if (this.maxDate) {
      const max = new Date(this.maxDate);
      if (date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) {
        return true;
      }
    }
    if (this.disabledDateSet.has(this.dateKey(date))) {
      return true;
    }
    return false;
  }

  private isDateSelected(date: Date): boolean {
    if (this.selectionMode === 'range') {
      const range = this.getActiveRange();
      if (!range || !range.start) {
        return false;
      }
      const key = this.dateKey(date);
      if (key === this.dateKey(range.start)) {
        return true;
      }
      if (range.end) {
        return key === this.dateKey(range.end);
      }
      return false;
    }
    return this.value instanceof Date && this.dateKey(this.value) === this.dateKey(date);
  }

  private isInsideRange(date: Date): boolean {
    const range = this.getActiveRange();
    if (!range || !range.start || !range.end) {
      return false;
    }
    const time = date.getTime();
    return time > range.start.getTime() && time < range.end.getTime();
  }

  private isRangeEdge(date: Date): boolean {
    const range = this.getActiveRange();
    if (!range || !range.start) {
      return false;
    }
    const key = this.dateKey(date);
    if (key === this.dateKey(range.start)) {
      return true;
    }
    if (range.end) {
      return key === this.dateKey(range.end);
    }
    return false;
  }

  private getActiveRange(): DateRangeValue | null {
    if (this.selectionMode !== 'range') {
      return null;
    }
    if (this.pendingRange.start) {
      return this.pendingRange;
    }
    const valueRange = this.value as DateRangeValue | null;
    if (valueRange && (valueRange.start || valueRange.end)) {
      return valueRange;
    }
    return null;
  }

  private dateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  }

  private initializeTime(): void {
    const now = new Date();
    this.tempTime = { hour: now.getHours(), minute: now.getMinutes() };
  }

  protected override getDefaultValue(): any {
    return this.selectionMode === 'range'
      ? { start: null, end: null }
      : this.mode === 'time'
        ? new Date()
        : null;
  }

  protected override getDefaultErrorMessage(): string {
    return 'Giá trị không hợp lệ.';
  }
}

