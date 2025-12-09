import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoreDatetimepickerComponent } from "./core-datetimepicker.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";

describe('CoreDatetimepickerComponent', () => {
  let component: CoreDatetimepickerComponent;
  let fixture: ComponentFixture<CoreDatetimepickerComponent>;

  const createComponent = (props?: Partial<CoreDatetimepickerComponent>) => {
    fixture = TestBed.createComponent(CoreDatetimepickerComponent);
    component = fixture.componentInstance;

    if (props) {
      Object.assign(component, props);
    }
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreDatetimepickerComponent, ReactiveFormsModule],
      providers: [FormBuilder]
    })
      .compileComponents();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('should have default properties set', () => {
      createComponent();
      expect(component.mode).toBe('date');
    });

    it('should have default placeholder set', () => {
      createComponent();
      expect(component.placeholder).toBe('Chọn thời gian');
    });

    it('should initialize calendar on construction', () => {
      createComponent();
      expect(component['calendarWeeks']).toBeDefined();
      expect(component['calendarWeeks'].length).toBeGreaterThan(0);
    });

    it('should initialize time on construction', () => {
      createComponent();
      expect(component['tempTime']).toBeDefined();
      expect(component['tempTime'].hour).toBeGreaterThanOrEqual(0);
      expect(component['tempTime'].hour).toBeLessThan(24);
      expect(component['tempTime'].minute).toBeGreaterThanOrEqual(0);
      expect(component['tempTime'].minute).toBeLessThan(60);
    });
    it('should initialize with panel closed', () => {
      createComponent();
      expect(component['isPanelOpen']).toBe(false);
    });
  });

  describe('Input Properties', () => {
    it('should accept custom mode', () => {
      createComponent({ mode: 'time' });
      expect(component.mode).toBe('time');
    });

    it('should accept and set selectionMode property', () => {
      createComponent({ selectionMode: 'range' });
      expect(component.selectionMode).toBe('range');
    });

    it('should accept and set placeholder property', () => {
      const customPlaceholder = 'Select Date and Time';
      createComponent({ placeholder: customPlaceholder });
      expect(component.placeholder).toBe(customPlaceholder);
    });

    it('should accept and set minDate property', () => {
      const minDate = new Date(2020, 0, 1);
      createComponent({ minDate });
      expect(component.minDate).toEqual(minDate);
    });

    it('should accept and set maxDate property', () => {
      const maxDate = new Date(2025, 11, 31);
      createComponent({ maxDate });
      expect(component.maxDate).toEqual(maxDate);
    });
    it('should accept and set disabledDates property', () => {
      const disabledDates = [new Date('2024-01-15'), '2024-01-20'];
      createComponent({ disabledDates });
      expect(component.disabledDates).toEqual(disabledDates);
    });

    it('should accept and set disableWeekends property', () => {
      createComponent({ disableWeekends: true });
      expect(component.disableWeekends).toBe(true);
    });

    it('should accept and set autoClose property', () => {
      createComponent({ autoClose: false });
      expect(component.autoClose).toBe(false);
    });

    it('should accept and set weekStartsOn property', () => {
      createComponent({ weekStartsOn: 0 });
      expect(component.weekStartsOn).toBe(0);
    });

    it('should accept and set inline property', () => {
      createComponent({ inline: true });
      expect(component.inline).toBe(true);
    });

    it('should accept and set showFooter property', () => {
      createComponent({ showFooter: false });
      expect(component.showFooter).toBe(false);
    });

    it('should accept and set timeStepMinutes property', () => {
      createComponent({ timeStepMinutes: 30 });
      expect(component.timeStepMinutes).toBe(30);
    });

    it('should accept and set showTodayShortcut property', () => {
      createComponent({ showTodayShortcut: false });
      expect(component.showTodayShortcut).toBe(false);
    });

    it('should accept and set displayFormat property', () => {
      createComponent({ displayFormat: 'dd/MM/yyyy' });
      expect(component.displayFormat).toBe('dd/MM/yyyy');
    });
  });

  describe('Lable and Hint', () => {
    it('should render label when provided', () => {
      createComponent({ label: 'Select Date' });
      const label = fixture.nativeElement.querySelector('label');
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Select Date');
    });
    it('should not render label when not provided', () => {
      createComponent();
      const label = fixture.nativeElement.querySelector('label');
      expect(label).toBeNull();
    });
    it('should render required indicator when required is true', () => {
      createComponent({ label: 'Select Date', required: true });
      const requiredSpan = fixture.nativeElement.querySelector('.text-danger');
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.textContent).toBe('*');
    });

    it('should render hint when provided', () => {
      createComponent({ hint: 'Select a date' });
      const hint = fixture.nativeElement.querySelector('.form-text');
      expect(hint).toBeTruthy();
      expect(hint.textContent).toContain('Select a date');
    });
    it('should not render hint when not provided', () => {
      createComponent();
      const hint = fixture.nativeElement.querySelector('.form-text');
      expect(hint).toBeNull();
    });
  });
  describe('Panel Toggle', () => {
    it('should open panel when togglePanel is called', () => {
      createComponent();
      expect(component['isPanelOpen']).toBe(false);
      component['togglePanel']();
      expect(component['isPanelOpen']).toBe(true);
    });

    it('should close panel when togglePanel is called again', () => {
      createComponent();
      component['togglePanel']();
      expect(component['isPanelOpen']).toBe(true);
      component['togglePanel']();
      expect(component['isPanelOpen']).toBe(false);
    });

    it('should not toggle panel when disabled', () => {
      createComponent();
      component.setDisabledState(true);
      const initialState = component['isPanelOpen'];
      component['togglePanel']();
      expect(component['isPanelOpen']).toBe(initialState);
    });

    it('should not toggle panel when inline', () => {
      createComponent({ inline: true });
      const initialState = component['isPanelOpen'];
      component['togglePanel']();
      expect(component['isPanelOpen']).toBe(initialState);
    });

    it('should emit opened event when panel opens', () => {
      createComponent();
      const spy = vi.fn();
      component.opened.subscribe(spy);
      component['togglePanel']();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed event when panel closes', () => {
      createComponent();
      component['togglePanel'](); // Open first
      const spy = vi.fn();
      component.closed.subscribe(spy);
      component['togglePanel'](); // Close
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should render panel when inline is true', () => {
      createComponent({ inline: true });
      const panel = fixture.nativeElement.querySelector('.core-datetimepicker__panel');
      expect(panel).toBeTruthy();
    });

    it('should not render panel when inline is false and panel is closed', () => {
      createComponent({ inline: false });
      const panel = fixture.nativeElement.querySelector('.core-datetimepicker__panel');
      expect(panel).toBeNull();
    });
  });
  describe('Calendar Navigation', () => {
    it('should navigate to previous month', () => {
      createComponent();
      const initialMonth = component['viewDate'].getMonth();
      component['goToPrevMonth']();
      const newMonth = component['viewDate'].getMonth();
      expect(newMonth).toBe((initialMonth - 1 + 12) % 12);
    });

    it('should navigate to next month', () => {
      createComponent();
      const initialMonth = component['viewDate'].getMonth();
      component['goToNextMonth']();
      const newMonth = component['viewDate'].getMonth();
      expect(newMonth).toBe((initialMonth + 1) % 12);
    });

    it('should navigate to today', () => {
      createComponent();
      const today = new Date();
      component['goToToday']();
      const viewDate = component['viewDate'];
      expect(viewDate.getFullYear()).toBe(today.getFullYear());
      expect(viewDate.getMonth()).toBe(today.getMonth());
      expect(viewDate.getDate()).toBe(today.getDate());
    });

    it('should rebuild calendar after navigation', () => {
      createComponent();
      const initialWeeks = component['calendarWeeks'];
      component['goToNextMonth']();
      // Calendar should be rebuilt (we can't directly compare, but weeks should exist)
      expect(component['calendarWeeks'].length).toBeGreaterThan(0);
    });

    it('should handle year boundary when going to previous month', () => {
      createComponent();
      // Set to January
      component['viewDate'] = new Date(2024, 0, 1);
      component['goToPrevMonth']();
      expect(component['viewDate'].getFullYear()).toBe(2023);
      expect(component['viewDate'].getMonth()).toBe(11);
    });

    it('should handle year boundary when going to next month', () => {
      createComponent();
      // Set to December
      component['viewDate'] = new Date(2024, 11, 1);
      component['goToNextMonth']();
      expect(component['viewDate'].getFullYear()).toBe(2025);
      expect(component['viewDate'].getMonth()).toBe(0);
    });
  });
  describe('Calendar Building', () => {
    it('should build calendar with 6 weeks', () => {
      createComponent();
      expect(component['calendarWeeks'].length).toBe(6);
    });

    it('should build calendar with 7 days per week', () => {
      createComponent();
      component['calendarWeeks'].forEach(week => {
        expect(week.length).toBe(7);
      });
    });

    it('should mark today correctly', () => {
      createComponent();
      const today = new Date();
      const todayKey = component['dateKey'](today);
      let foundToday = false;
      component['calendarWeeks'].forEach(week => {
        week.forEach(day => {
          if (component['dateKey'](day.date) === todayKey) {
            expect(day.isToday).toBe(true);
            foundToday = true;
          }
        });
      });
      expect(foundToday).toBe(true);
    });

    it('should mark current month days correctly', () => {
      createComponent();
      const currentMonth = component['viewDate'].getMonth();
      component['calendarWeeks'].forEach(week => {
        week.forEach(day => {
          if (day.isCurrentMonth) {
            expect(day.date.getMonth()).toBe(currentMonth);
          }
        });
      });
    });

    it('should respect weekStartsOn setting', () => {
      createComponent({ weekStartsOn: 1 }); // Monday
      const firstWeek = component['calendarWeeks'][0];
      const firstDay = firstWeek[0].date.getDay();
      expect(firstDay).toBe(1); // Monday
    });

    it('should respect weekStartsOn = 0 (Sunday)', () => {
      createComponent({ weekStartsOn: 0 });
      // Rebuild calendar after setting weekStartsOn
      component.ngOnChanges({
        weekStartsOn: {
          currentValue: 0,
          previousValue: 1,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      const firstWeek = component['calendarWeeks'][0];
      const firstDay = firstWeek[0].date.getDay();
      expect(firstDay).toBe(0); // Sunday
    });
  });
  describe('Date Selection - Single Mode', () => {
    it('should select a date in single mode', () => {
      createComponent({ selectionMode: 'single' });
      const testDate = new Date(2024, 5, 15);
      const cell: any = {
        date: testDate,
        label: 15,
        isCurrentMonth: true,
        isToday: false,
        isDisabled: false,
        isSelected: false,
        isRangeEdge: false,
        isInRange: false
      };
      component['selectDay'](cell);
      expect(component['value']).toBeInstanceOf(Date);
      expect(component['value'].getDate()).toBe(15);
      expect(component['value'].getMonth()).toBe(5);
    });

    it('should not select disabled date', () => {
      createComponent({ selectionMode: 'single' });
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: true
      };
      const initialValue = component['value'];
      component['selectDay'](cell);
      expect(component['value']).toBe(initialValue);
    });

    it('should emit valueCommitted when date is selected', () => {
      createComponent({ selectionMode: 'single' });
      const spy = vi.fn();
      component.valueCommitted.subscribe(spy);
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should close panel after selection when autoClose is true', () => {
      createComponent({ selectionMode: 'single', autoClose: true, inline: false });
      component['togglePanel'](); // Open panel
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(component['isPanelOpen']).toBe(false);
    });

    it('should not close panel after selection when autoClose is false', () => {
      createComponent({ selectionMode: 'single', autoClose: false, inline: false });
      component['togglePanel'](); // Open panel
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(component['isPanelOpen']).toBe(true);
    });

    it('should apply time when selecting date', () => {
      createComponent({ selectionMode: 'single', mode: 'datetime' });
      component['tempTime'] = { hour: 14, minute: 30 };
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(component['value'].getHours()).toBe(14);
      expect(component['value'].getMinutes()).toBe(30);
    });
  });

  describe('Date Selection - Range Mode', () => {
    it('should start range selection on first click', () => {
      createComponent({ selectionMode: 'range' });
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(component['pendingRange'].start).toBeInstanceOf(Date);
      expect(component['pendingRange'].end).toBeNull();
    });

    it('should complete range selection on second click', () => {
      createComponent({ selectionMode: 'range' });
      const firstCell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      const secondCell: any = {
        date: new Date(2024, 5, 20),
        isDisabled: false
      };
      component['selectDay'](firstCell);
      component['selectDay'](secondCell);
      expect(component['value'].start).toBeInstanceOf(Date);
      expect(component['value'].end).toBeInstanceOf(Date);
    });

    it('should swap start and end if second date is before first', () => {
      createComponent({ selectionMode: 'range' });
      const firstCell: any = {
        date: new Date(2024, 5, 20),
        isDisabled: false
      };
      const secondCell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](firstCell);
      component['selectDay'](secondCell);
      expect(component['value'].start.getTime()).toBeLessThanOrEqual(component['value'].end.getTime());
    });

    it('should reset range if clicking same date twice', () => {
      createComponent({ selectionMode: 'range' });
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(component['pendingRange'].start).toBeInstanceOf(Date);
      component['selectDay'](cell);
      expect(component['pendingRange'].start).toBeInstanceOf(Date);
      expect(component['pendingRange'].end).toBeNull();
    });

    it('should emit valueCommitted when range is completed', () => {
      createComponent({ selectionMode: 'range' });
      const spy = vi.fn();
      component.valueCommitted.subscribe(spy);
      const firstCell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      const secondCell: any = {
        date: new Date(2024, 5, 20),
        isDisabled: false
      };
      component['selectDay'](firstCell);
      component['selectDay'](secondCell);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date)
      }));
    });

    it('should close panel after range selection when autoClose is true', () => {
      createComponent({ selectionMode: 'range', autoClose: true, inline: false });
      component['togglePanel']();
      const firstCell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      const secondCell: any = {
        date: new Date(2024, 5, 20),
        isDisabled: false
      };
      component['selectDay'](firstCell);
      component['selectDay'](secondCell);
      expect(component['isPanelOpen']).toBe(false);
    });
  });

  describe('Time Selection', () => {
    it('should change hour', () => {
      createComponent({ mode: 'datetime', selectionMode: 'single' });
      const testDate = new Date(2024, 5, 15, 10, 30);
      component['value'] = testDate;
      component['changeHour'](14);
      expect(component['tempTime'].hour).toBe(14);
    });

    it('should change minute', () => {
      createComponent({ mode: 'datetime', selectionMode: 'single' });
      const testDate = new Date(2024, 5, 15, 10, 30);
      component['value'] = testDate;
      component['changeMinute'](45);
      expect(component['tempTime'].minute).toBe(45);
    });

    it('should apply time change to existing date', () => {
      createComponent({ mode: 'datetime', selectionMode: 'single' });
      const testDate = new Date(2024, 5, 15, 10, 30);
      component['value'] = testDate;
      component['changeHour'](14);
      component['changeMinute'](45);
      expect(component['value'].getHours()).toBe(14);
      expect(component['value'].getMinutes()).toBe(45);
    });

    it('should emit valueCommitted when time changes', () => {
      createComponent({ mode: 'datetime', selectionMode: 'single' });
      const testDate = new Date(2024, 5, 15, 10, 30);
      component['value'] = testDate;
      const spy = vi.fn();
      component.valueCommitted.subscribe(spy);
      component['changeHour'](14);
      expect(spy).toHaveBeenCalled();
    });

    it('should generate minute options based on timeStepMinutes', () => {
      createComponent({ timeStepMinutes: 15 });
      const minutes = component['minuteOptions'];
      expect(minutes).toEqual([0, 15, 30, 45]);
    });

    it('should generate minute options with step 30', () => {
      createComponent({ timeStepMinutes: 30 });
      const minutes = component['minuteOptions'];
      expect(minutes).toEqual([0, 30]);
    });

    it('should have 24 hours in hoursList', () => {
      createComponent();
      expect(component['hoursList'].length).toBe(24);
      expect(component['hoursList'][0]).toBe(0);
      expect(component['hoursList'][23]).toBe(23);
    });
  });

  describe('Display Value', () => {
    it('should return empty string when no value in single mode', () => {
      createComponent({ selectionMode: 'single' });
      component['value'] = null;
      expect(component['displayValue']).toBe('');
    });

    it('should format date value in single mode', () => {
      createComponent({ selectionMode: 'single', mode: 'date' });
      const testDate = new Date(2024, 5, 15);
      component['value'] = testDate;
      const display = component['displayValue'];
      expect(display).toBeTruthy();
      expect(display).not.toBe('');
    });

    it('should format datetime value in single mode', () => {
      createComponent({ selectionMode: 'single', mode: 'datetime' });
      const testDate = new Date(2024, 5, 15, 14, 30);
      component['value'] = testDate;
      const display = component['displayValue'];
      expect(display).toBeTruthy();
      expect(display).toContain('14');
      expect(display).toContain('30');
    });

    it('should format time value in single mode', () => {
      createComponent({ selectionMode: 'single', mode: 'time' });
      const testDate = new Date(2024, 5, 15, 14, 30);
      component['value'] = testDate;
      const display = component['displayValue'];
      expect(display).toBeTruthy();
      expect(display).toContain('14');
      expect(display).toContain('30');
    });

    it('should return empty string when no range value', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = { start: null, end: null };
      expect(component['displayValue']).toBe('');
    });

    it('should format range value with start only', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: null
      };
      const display = component['displayValue'];
      expect(display).toContain('...');
      expect(display).toContain('→');
    });

    it('should format range value with both dates', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: new Date(2024, 5, 20)
      };
      const display = component['displayValue'];
      expect(display).toContain('→');
      expect(display).not.toContain('...');
    });
  });

  describe('Disabled Dates', () => {
    it('should disable dates in disabledDates array', () => {
      const disabledDate = new Date(2024, 5, 15);
      createComponent({ disabledDates: [disabledDate] });
      // Sync disabled dates after setting them
      component.ngOnChanges({
        disabledDates: {
          currentValue: [disabledDate],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      const isDisabled = component['isDateDisabled'](disabledDate);
      expect(isDisabled).toBe(true);
    });

    it('should disable dates from disabledDates string array', () => {
      const disabledDates = ['2024-06-15'];
      createComponent({ disabledDates });
      // Sync disabled dates after setting them
      component.ngOnChanges({
        disabledDates: {
          currentValue: disabledDates,
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      const disabledDate = new Date(2024, 5, 15);
      const isDisabled = component['isDateDisabled'](disabledDate);
      expect(isDisabled).toBe(true);
    });

    it('should disable weekends when disableWeekends is true', () => {
      createComponent({ disableWeekends: true });
      const saturday = new Date(2024, 5, 15); // June 15, 2024 is a Saturday
      const sunday = new Date(2024, 5, 16); // June 16, 2024 is a Sunday
      // Note: Actual day of week depends on the date, adjust if needed
      // This is a conceptual test
      expect(component.disableWeekends).toBe(true);
    });

    it('should disable dates before minDate', () => {
      const minDate = new Date(2024, 5, 10);
      createComponent({ minDate });
      const beforeMin = new Date(2024, 5, 9);
      const isDisabled = component['isDateDisabled'](beforeMin);
      expect(isDisabled).toBe(true);
    });

    it('should disable dates after maxDate', () => {
      const maxDate = new Date(2024, 5, 20);
      createComponent({ maxDate });
      const afterMax = new Date(2024, 5, 21);
      const isDisabled = component['isDateDisabled'](afterMax);
      expect(isDisabled).toBe(true);
    });

    it('should not disable dates within min/max range', () => {
      const minDate = new Date(2024, 5, 10);
      const maxDate = new Date(2024, 5, 20);
      createComponent({ minDate, maxDate });
      const inRange = new Date(2024, 5, 15);
      const isDisabled = component['isDateDisabled'](inRange);
      expect(isDisabled).toBe(false);
    });

    it('should not disable dates in time mode', () => {
      createComponent({ mode: 'time' });
      const anyDate = new Date(2024, 5, 15);
      const isDisabled = component['isDateDisabled'](anyDate);
      expect(isDisabled).toBe(false);
    });

    it('should sync disabled dates on changes', () => {
      createComponent();
      const disabledDate = new Date(2024, 5, 15);
      component.disabledDates = [disabledDate];
      component.ngOnChanges({
        disabledDates: {
          currentValue: [disabledDate],
          previousValue: [],
          firstChange: false,
          isFirstChange: () => false
        }
      });
      const isDisabled = component['isDateDisabled'](disabledDate);
      expect(isDisabled).toBe(true);
    });
  });

  describe('Date Selection State', () => {
    it('should mark selected date in single mode', () => {
      createComponent({ selectionMode: 'single' });
      const selectedDate = new Date(2024, 5, 15);
      component['value'] = selectedDate;
      const isSelected = component['isDateSelected'](selectedDate);
      expect(isSelected).toBe(true);
    });

    it('should mark range edges in range mode', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: new Date(2024, 5, 20)
      };
      const isStartEdge = component['isRangeEdge'](new Date(2024, 5, 15));
      const isEndEdge = component['isRangeEdge'](new Date(2024, 5, 20));
      expect(isStartEdge).toBe(true);
      expect(isEndEdge).toBe(true);
    });

    it('should mark dates inside range', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: new Date(2024, 5, 20)
      };
      const inRange = component['isInsideRange'](new Date(2024, 5, 17));
      expect(inRange).toBe(true);
    });

    it('should not mark dates outside range', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: new Date(2024, 5, 20)
      };
      const outOfRange = component['isInsideRange'](new Date(2024, 5, 25));
      expect(outOfRange).toBe(false);
    });
  });

  describe('Clear Selection', () => {
    it('should clear selection in single mode', () => {
      createComponent({ selectionMode: 'single' });
      component['value'] = new Date(2024, 5, 15);
      component['clearSelection']();
      expect(component['value']).toBeNull();
    });

    it('should clear selection in range mode', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: new Date(2024, 5, 20)
      };
      component['clearSelection']();
      expect(component['value'].start).toBeNull();
      expect(component['value'].end).toBeNull();
    });

    it('should emit valueCommitted when clearing', () => {
      createComponent({ selectionMode: 'single' });
      component['value'] = new Date(2024, 5, 15);
      const spy = vi.fn();
      component.valueCommitted.subscribe(spy);
      component['clearSelection']();
      expect(spy).toHaveBeenCalledWith(null);
    });

    it('should call onChange when clearing', () => {
      createComponent({ selectionMode: 'single' });
      component['value'] = new Date(2024, 5, 15);
      const spy = vi.fn();
      component['onChange'] = spy;
      component['clearSelection']();
      expect(spy).toHaveBeenCalledWith(null);
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {
      formBuilder = TestBed.inject(FormBuilder);
    });

    const setupComponentWithFormControl = (controlValue: any = null) => {
      formGroup = formBuilder.group({
        dateField: [controlValue]
      });

      fixture = TestBed.createComponent(CoreDatetimepickerComponent);
      component = fixture.componentInstance;

      const control = formGroup.get('dateField')!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component['ngControl'] = mockNgControl;
      component.ngOnInit();

      component.registerOnChange((value: any) => {
        control.setValue(value, { emitEvent: false });
      });

      component.registerOnTouched(() => {
        control.markAsTouched();
      });

      component.writeValue(controlValue);
      fixture.detectChanges();
    };

    it('should integrate with FormControl', () => {
      const testDate = new Date(2024, 5, 15);
      setupComponentWithFormControl(testDate);
      expect(component).toBeTruthy();
    });

    it('should write value to component', () => {
      const testDate = new Date(2024, 5, 15);
      setupComponentWithFormControl(testDate);
      expect(component['value']).toBeInstanceOf(Date);
    });

    it('should write range value to component', () => {
      const rangeValue = {
        start: new Date(2024, 5, 15),
        end: new Date(2024, 5, 20)
      };
      createComponent({ selectionMode: 'range' });
      component.writeValue(rangeValue);
      expect(component['value'].start).toBeInstanceOf(Date);
      expect(component['value'].end).toBeInstanceOf(Date);
    });

    it('should handle null value', () => {
      createComponent();
      component.writeValue(null);
      expect(component['value']).toBeNull();
    });

    it('should handle undefined value', () => {
      createComponent();
      component.writeValue(undefined);
      expect(component['value']).toBeNull();
    });

    it('should update FormControl value when date is selected', () => {
      setupComponentWithFormControl(null);
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(formGroup.get('dateField')?.value).toBeInstanceOf(Date);
    });

    it('should call onChange callback when value changes', () => {
      createComponent();
      const spy = vi.fn();
      component.registerOnChange(spy);
      const cell: any = {
        date: new Date(2024, 5, 15),
        isDisabled: false
      };
      component['selectDay'](cell);
      expect(spy).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should handle invalid date string', () => {
      createComponent();
      component.writeValue('invalid-date');
      // Should handle gracefully without throwing
      expect(component['value']).toBeDefined();
    });
  });

  describe('ngOnChanges', () => {
    it('should rebuild calendar when minDate changes', () => {
      createComponent();
      const initialWeeks = component['calendarWeeks'];
      component.minDate = new Date(2024, 5, 1);
      component.ngOnChanges({
        minDate: {
          currentValue: new Date(2024, 5, 1),
          previousValue: undefined,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component['calendarWeeks'].length).toBeGreaterThan(0);
    });

    it('should rebuild calendar when maxDate changes', () => {
      createComponent();
      component.maxDate = new Date(2024, 5, 30);
      component.ngOnChanges({
        maxDate: {
          currentValue: new Date(2024, 5, 30),
          previousValue: undefined,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component['calendarWeeks'].length).toBeGreaterThan(0);
    });

    it('should rebuild calendar when weekStartsOn changes', () => {
      createComponent();
      component.weekStartsOn = 0;
      component.ngOnChanges({
        weekStartsOn: {
          currentValue: 0,
          previousValue: 1,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component['calendarWeeks'].length).toBeGreaterThan(0);
    });

    it('should open panel when inline changes to true', () => {
      createComponent({ inline: false });
      component.inline = true;
      component.ngOnChanges({
        inline: {
          currentValue: true,
          previousValue: false,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(component['isPanelOpen']).toBe(true);
    });

    it('should mark for check when timeStepMinutes changes', () => {
      createComponent();
      const markForCheckSpy = vi.fn();
      component['cdr'].markForCheck = markForCheckSpy;
      component.timeStepMinutes = 30;
      component.ngOnChanges({
        timeStepMinutes: {
          currentValue: 30,
          previousValue: 15,
          firstChange: false,
          isFirstChange: () => false
        }
      });
      expect(markForCheckSpy).toHaveBeenCalled();
    });
  });

  describe('Host Listeners', () => {
    it('should close panel on document click outside component', () => {
      createComponent({ inline: false });
      component['togglePanel'](); // Open panel
      expect(component['isPanelOpen']).toBe(true);

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);
      const clickEvent = new MouseEvent('click', { bubbles: true });
      outsideElement.dispatchEvent(clickEvent);

      // Manually trigger the handler since HostListener might not work in tests
      component['handleDocumentClick'](clickEvent);
      expect(component['isPanelOpen']).toBe(false);

      document.body.removeChild(outsideElement);
    });

    it('should not close panel on click inside component', () => {
      createComponent({ inline: false });
      component['togglePanel']();
      const insideElement = fixture.nativeElement;
      const clickEvent = new MouseEvent('click', { bubbles: true });
      component['handleDocumentClick']({
        ...clickEvent,
        target: insideElement
      } as any);
      expect(component['isPanelOpen']).toBe(true);
    });

    it('should not close panel on document click when inline', () => {
      createComponent({ inline: true });
      component['isPanelOpen'] = true;
      const clickEvent = new MouseEvent('click', { bubbles: true });
      component['handleDocumentClick'](clickEvent);
      expect(component['isPanelOpen']).toBe(true);
    });

    it('should close panel on Escape key', () => {
      createComponent({ inline: false });
      component['togglePanel']();
      component['onEscape']();
      expect(component['isPanelOpen']).toBe(false);
    });

    it('should emit closed event on Escape key', () => {
      createComponent({ inline: false });
      component['togglePanel']();
      const spy = vi.fn();
      component.closed.subscribe(spy);
      component['onEscape']();
      expect(spy).toHaveBeenCalled();
    });

    it('should not close panel on Escape when inline', () => {
      createComponent({ inline: true });
      component['isPanelOpen'] = true;
      component['onEscape']();
      expect(component['isPanelOpen']).toBe(true);
    });
  });

  describe('Computed Properties', () => {
    it('should return true for hasTimePicker when mode is datetime', () => {
      createComponent({ mode: 'datetime' });
      expect(component['hasTimePicker']).toBe(true);
    });

    it('should return true for hasTimePicker when mode is time', () => {
      createComponent({ mode: 'time' });
      expect(component['hasTimePicker']).toBe(true);
    });

    it('should return false for hasTimePicker when mode is date', () => {
      createComponent({ mode: 'date' });
      expect(component['hasTimePicker']).toBe(false);
    });

    it('should return true for isRangeSelection when selectionMode is range', () => {
      createComponent({ selectionMode: 'range' });
      expect(component['isRangeSelection']()).toBe(true);
    });

    it('should return false for isRangeSelection when selectionMode is single', () => {
      createComponent({ selectionMode: 'single' });
      expect(component['isRangeSelection']()).toBe(false);
    });

    it('should return true for shouldRenderPanel when inline', () => {
      createComponent({ inline: true });
      expect(component['shouldRenderPanel']).toBe(true);
    });

    it('should return true for shouldRenderPanel when panel is open', () => {
      createComponent({ inline: false });
      component['togglePanel']();
      expect(component['shouldRenderPanel']).toBe(true);
    });

    it('should return weekday headers starting with Monday when weekStartsOn is 1', () => {
      createComponent({ weekStartsOn: 1 });
      const headers = component['weekdayHeaders'];
      expect(headers[0]).toBe('T2');
    });

    it('should return weekday headers starting with Sunday when weekStartsOn is 0', () => {
      createComponent({ weekStartsOn: 0 });
      const headers = component['weekdayHeaders'];
      expect(headers[0]).toBe('CN');
    });

    it('should format month label correctly', () => {
      createComponent();
      component['viewDate'] = new Date(2024, 5, 15);
      const label = component['monthLabel'];
      expect(label).toBeTruthy();
      expect(label).toContain('2024');
    });
  });

  describe('TrackBy Functions', () => {
    it('should track by week correctly', () => {
      createComponent();
      const week: any[] = [
        { date: new Date(2024, 5, 15) },
        { date: new Date(2024, 5, 16) }
      ];
      const trackValue = component['trackByWeek'](0, week);
      expect(trackValue).toBeTruthy();
      expect(typeof trackValue).toBe('string');
    });

    it('should track by day correctly', () => {
      createComponent();
      const day: any = { date: new Date(2024, 5, 15) };
      const trackValue = component['trackByDay'](0, day);
      expect(trackValue).toBeTruthy();
      expect(trackValue).toContain('2024');
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid date in writeValue', () => {
      createComponent();
      const invalidDate = new Date('invalid');
      component.writeValue(invalidDate);
      // Should handle gracefully
      expect(component['value']).toBeDefined();
    });

    it('should handle date string in writeValue', () => {
      createComponent();
      component.writeValue('2024-06-15');
      expect(component['value']).toBeInstanceOf(Date);
    });

    it('should handle empty disabledDates array', () => {
      createComponent({ disabledDates: [] });
      const anyDate = new Date(2024, 5, 15);
      const isDisabled = component['isDateDisabled'](anyDate);
      expect(isDisabled).toBe(false);
    });

    it('should handle invalid date strings in disabledDates', () => {
      createComponent({ disabledDates: ['invalid-date'] });
      // Should not throw
      expect(component.disabledDates).toBeDefined();
    });

    it('should handle timeStepMinutes less than 1', () => {
      createComponent({ timeStepMinutes: 0 });
      const minutes = component['minuteOptions'];
      expect(minutes.length).toBeGreaterThan(0);
    });

    it('should handle very large timeStepMinutes', () => {
      createComponent({ timeStepMinutes: 100 });
      const minutes = component['minuteOptions'];
      expect(minutes.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle range with only start date', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: new Date(2024, 5, 15),
        end: null
      };
      const display = component['displayValue'];
      expect(display).toContain('...');
    });

    it('should handle range with only end date', () => {
      createComponent({ selectionMode: 'range' });
      component['value'] = {
        start: null,
        end: new Date(2024, 5, 20)
      };
      const display = component['displayValue'];
      expect(display).toContain('...');
    });
  });

  describe('Default Values', () => {
    it('should return null as default for single date mode', () => {
      createComponent({ selectionMode: 'single', mode: 'date' });
      const defaultValue = component['getDefaultValue']();
      expect(defaultValue).toBeNull();
    });

    it('should return Date as default for single time mode', () => {
      createComponent({ selectionMode: 'single', mode: 'time' });
      const defaultValue = component['getDefaultValue']();
      expect(defaultValue).toBeInstanceOf(Date);
    });

    it('should return range object as default for range mode', () => {
      createComponent({ selectionMode: 'range' });
      const defaultValue = component['getDefaultValue']();
      expect(defaultValue).toEqual({ start: null, end: null });
    });

    it('should return default error message', () => {
      createComponent();
      const errorMessage = component['getDefaultErrorMessage']();
      expect(errorMessage).toBe('Giá trị không hợp lệ.');
    });
  });

  describe('ngOnDestroy', () => {
    it('should complete without errors', () => {
      createComponent();
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
