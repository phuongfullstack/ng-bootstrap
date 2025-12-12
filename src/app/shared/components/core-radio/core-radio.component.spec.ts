import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoreRadioComponent, RadioOption } from './core-radio.component';
import { ChangeDetectorRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('CoreRadioComponent', () => {
  let component: CoreRadioComponent;
  let fixture: ComponentFixture<CoreRadioComponent>;
  let changeDetectorRef: ChangeDetectorRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreRadioComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CoreRadioComponent);
    component = fixture.componentInstance;
    changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    // Don't call detectChanges here - let individual tests set up inputs first
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should generate unique id for each instance', () => {
      const fixture2 = TestBed.createComponent(CoreRadioComponent);
      const component2 = fixture2.componentInstance;
      expect(component['generatedId']).not.toEqual(component2['generatedId']);
    });

    it('should initialize with default values', () => {
      expect(component.inline).toBe(false);
      expect(component.size).toBeUndefined();
      expect(component.options).toBeUndefined();
      expect(component.standaloneDisabled).toBe(false);
      expect(component.standaloneValue).toBeUndefined();
      expect(component.name).toBeUndefined();
    });

    it('should have default required as false', () => {
      expect(component.required).toBe(false);
    });
  });

  describe('Standalone Mode (Single Radio)', () => {
    beforeEach(() => {
      component.label = 'Accept Terms';
      component.standaloneValue = 'yes';
      fixture.detectChanges();
    });

    it('should render single radio button', () => {
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput).toBeTruthy();
    });

    it('should display label correctly', () => {
      const label = fixture.debugElement.query(By.css('.form-check-label'));
      expect(label.nativeElement.textContent.trim()).toContain('Accept Terms');
    });

    it('should display ng-content when no label provided', () => {
      component.label = undefined;
      fixture.detectChanges();
      const label = fixture.debugElement.query(By.css('.form-check-label'));
      expect(label).toBeTruthy();
    });

    it('should show required asterisk when required is true', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      componentTemp.label = 'Test';
      componentTemp.standaloneValue = 'val';
      componentTemp.required = true;
      fixtureTemp.detectChanges();

      const asterisk = fixtureTemp.debugElement.query(By.css('.text-danger'));
      expect(asterisk).toBeTruthy();
      expect(asterisk.nativeElement.textContent).toBe('*');
    });

    it('should display hint text', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      componentTemp.label = 'Test';
      componentTemp.standaloneValue = 'val';
      componentTemp.hint = 'Please accept our terms';
      fixtureTemp.detectChanges();

      const hintElement = fixtureTemp.debugElement.query(By.css('.form-text'));
      expect(hintElement).toBeTruthy();
      expect(hintElement.nativeElement.textContent.trim()).toBe('Please accept our terms');
    });

    it('should set aria-describedby when hint is present', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      componentTemp.standaloneValue = 'val';
      componentTemp.hint = 'Test hint';
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      const ariaDescribedby = radioInput.nativeElement.getAttribute('aria-describedby');
      expect(ariaDescribedby).toBeTruthy();
      expect(ariaDescribedby).toContain('-hint');
    });

    it('should emit valueChange on radio change', () => {
      vi.spyOn(component.valueChange, 'emit');
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      radioInput.triggerEventHandler('change', { target: radioInput.nativeElement });
      expect(component.valueChange.emit).toHaveBeenCalledWith('yes');
    });

    it('should emit focused event on focus', () => {
      vi.spyOn(component.focused, 'emit');
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      const focusEvent = new FocusEvent('focus');
      radioInput.triggerEventHandler('focus', focusEvent);
      expect(component.focused.emit).toHaveBeenCalledWith(focusEvent);
    });

    it('should emit blurred event on blur', () => {
      vi.spyOn(component.blurred, 'emit');
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      const blurEvent = new FocusEvent('blur');
      radioInput.triggerEventHandler('blur', blurEvent);
      expect(component.blurred.emit).toHaveBeenCalledWith(blurEvent);
    });

    it('should disable radio when standaloneDisabled is true', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      componentTemp.standaloneValue = 'val';
      componentTemp.standaloneDisabled = true;
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.disabled).toBe(true);
    });

    it('should update standaloneValue and detect changes on radio change', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const markForCheckSpy = vi.spyOn(componentTemp['changeDetectorRef'], 'markForCheck');

      componentTemp.standaloneValue = 'no';
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      // Simulate selecting the new value
      radioInput.nativeElement.value = 'yes';
      radioInput.triggerEventHandler('change', { target: { value: 'yes' } });

      expect(componentTemp.standaloneValue).toBe('yes');
      expect(markForCheckSpy).toHaveBeenCalled();
    });
  });

  describe('Group Mode (Multiple Radio Options)', () => {
    const mockOptions: RadioOption[] = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2', hint: 'This is option 2' },
      { value: 'option3', label: 'Option 3', disabled: true }
    ];

    beforeEach(() => {
      component.label = 'Choose an option';
      component.options = mockOptions;
      fixture.detectChanges();
    });

    it('should render all radio options', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs.length).toBe(3);
    });

    it('should display all option labels', () => {
      const labels = fixture.debugElement.queryAll(By.css('.form-check-label'));
      expect(labels[0].nativeElement.textContent.trim()).toContain('Option 1');
      expect(labels[1].nativeElement.textContent.trim()).toContain('Option 2');
      expect(labels[2].nativeElement.textContent.trim()).toContain('Option 3');
    });

    it('should display group label with required asterisk', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      componentTemp.options = mockOptions;
      componentTemp.label = 'Choose an option';
      componentTemp.required = true;
      fixtureTemp.detectChanges();

      const groupLabel = fixtureTemp.debugElement.query(By.css('.form-label'));
      expect(groupLabel.nativeElement.textContent).toContain('Choose an option');
      expect(groupLabel.nativeElement.textContent).toContain('*');
    });

    it('should display option hint', () => {
      const hints = fixture.debugElement.queryAll(By.css('.form-text.small'));
      expect(hints.length).toBe(1);
      expect(hints[0].nativeElement.textContent.trim()).toBe('This is option 2');
    });

    it('should disable specific option when option.disabled is true', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs[2].nativeElement.disabled).toBe(true);
    });

    it('should check the selected option', () => {
      component.writeValue('option2');
      fixture.detectChanges();
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      expect(radioInputs[1].nativeElement.checked).toBe(true);
    });

    it('should emit valueChange when option is selected', () => {
      vi.spyOn(component.valueChange, 'emit');
      const radioInput = fixture.debugElement.queryAll(By.css('input[type="radio"]'))[0];
      radioInput.nativeElement.click();
      expect(component.valueChange.emit).toHaveBeenCalledWith('option1');
    });

    it('should generate unique id for each option', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      const ids = radioInputs.map(input => input.nativeElement.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should use trackByOption correctly', () => {
      const option = mockOptions[0];
      const trackByResult = component['trackByOption'](0, option);
      expect(trackByResult).toBe('option1-0');
    });

    it('should set aria-describedby for option with hint', () => {
      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      const ariaDescribedby = radioInputs[1].nativeElement.getAttribute('aria-describedby');
      expect(ariaDescribedby).toBeTruthy();
      expect(ariaDescribedby).toContain('-hint');
    });

    it('should display group hint text', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      componentTemp.options = mockOptions;
      componentTemp.hint = 'Group level hint';
      fixtureTemp.detectChanges();

      const hintElements = fixtureTemp.debugElement.queryAll(By.css('.form-text'));
      const groupHint = hintElements.find(el => el.nativeElement.textContent.trim() === 'Group level hint');
      expect(groupHint).toBeTruthy();
    });

    it('should handle numeric option values', () => {
      const numericOptions: RadioOption[] = [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two' }
      ];
      component.options = numericOptions;
      fixture.detectChanges();

      component.writeValue(2);
      fixture.detectChanges();

      expect(component['isOptionSelected'](2)).toBe(true);
      expect(component['isOptionSelected'](1)).toBe(false);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply inline class when inline is true', () => {
      component.inline = true;
      component.standaloneValue = 'test';
      fixture.detectChanges();
      const formCheck = fixture.debugElement.query(By.css('.form-check-inline'));
      expect(formCheck).toBeTruthy();
    });

    it('should apply form-check class when inline is false', () => {
      component.inline = false;
      component.standaloneValue = 'test';
      fixture.detectChanges();
      const formCheck = fixture.debugElement.query(By.css('.form-check'));
      expect(formCheck).toBeTruthy();
    });

    it('should apply small size class', () => {
      component.size = 'sm';
      component.standaloneValue = 'test';
      fixture.detectChanges();
      const formCheck = fixture.debugElement.query(By.css('.form-check-sm'));
      expect(formCheck).toBeTruthy();
    });

    it('should apply medium size class', () => {
      component.size = 'md';
      component.standaloneValue = 'test';
      fixture.detectChanges();
      const formCheck = fixture.debugElement.query(By.css('.form-check-md'));
      expect(formCheck).toBeTruthy();
    });

    it('should apply large size class', () => {
      component.size = 'lg';
      component.standaloneValue = 'test';
      fixture.detectChanges();
      const formCheck = fixture.debugElement.query(By.css('.form-check-lg'));
      expect(formCheck).toBeTruthy();
    });

    it('should return correct containerClasses', () => {
      component.inline = true;
      component.size = 'lg';
      const classes = component['containerClasses'];
      expect(classes['form-check-inline']).toBe(true);
      expect(classes['form-check']).toBe(false);
      expect(classes['form-check-lg']).toBe(true);
    });
  });

  describe('Validation States', () => {
    it('should apply is-invalid class when control is invalid and touched', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const formControl = new FormControl('', Validators.required);

      componentTemp['ngControl'] = {
        control: formControl,
        valueAccessor: componentTemp
      } as any;
      componentTemp.options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
      componentTemp.ngOnInit();

      formControl.markAsTouched();
      formControl.setValue('');
      formControl.updateValueAndValidity();
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.classList.contains('is-invalid')).toBe(true);
    });

    it('should apply is-valid class when control is valid and touched', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const formControl = new FormControl('', Validators.required);

      componentTemp['ngControl'] = {
        control: formControl,
        valueAccessor: componentTemp
      } as any;
      componentTemp.options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
      componentTemp.ngOnInit();

      formControl.setValue('opt1');
      formControl.markAsTouched();
      formControl.updateValueAndValidity();
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.classList.contains('is-valid')).toBe(true);
    });

    it('should display error messages', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const formControl = new FormControl('', Validators.required);

      componentTemp['ngControl'] = {
        control: formControl,
        valueAccessor: componentTemp
      } as any;
      componentTemp.options = [
        { value: 'opt1', label: 'Option 1' }
      ];
      componentTemp.ngOnInit();

      formControl.markAsTouched();
      formControl.setValue('');
      formControl.updateValueAndValidity();
      fixtureTemp.detectChanges();

      const errorDiv = fixtureTemp.debugElement.query(By.css('.invalid-feedback'));
      expect(errorDiv).toBeTruthy();
      // Accept localized or default required message
      expect(errorDiv.nativeElement.textContent.trim().length).toBeGreaterThan(0);
    });

    it('should set aria-invalid attribute when invalid', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const formControl = new FormControl('', Validators.required);

      componentTemp['ngControl'] = {
        control: formControl,
        valueAccessor: componentTemp
      } as any;
      componentTemp.options = [
        { value: 'opt1', label: 'Option 1' }
      ];
      componentTemp.ngOnInit();

      formControl.markAsTouched();
      formControl.setValue('');
      formControl.updateValueAndValidity();
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('ControlValueAccessor Implementation', () => {
    let formControl: FormControl;

    beforeEach(() => {
      formControl = new FormControl('initial');
      component['ngControl'] = {
        control: formControl,
        valueAccessor: component
      } as any;
    });

    it('should write value correctly', () => {
      component.writeValue('test-value');
      expect(component['value']).toBe('test-value');
    });

    it('should write null value correctly', () => {
      component.writeValue(null);
      expect(component['value']).toBe(null);
    });

    it('should write undefined value as null', () => {
      component.writeValue(undefined);
      expect(component['value']).toBe(null);
    });

    it('should register onChange callback', () => {
      const onChangeFn = vi.fn();
      component.registerOnChange(onChangeFn);
      component['onChange']('test');
      expect(onChangeFn).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      const onTouchedFn = vi.fn();
      component.registerOnTouched(onTouchedFn);
      component['onTouched']();
      expect(onTouchedFn).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component['disabled']).toBe(true);

      component.setDisabledState(false);
      expect(component['disabled']).toBe(false);
    });

    it('should call onChange when radio value changes in form mode', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);
      component.options = [
        { value: 'opt1', label: 'Option 1' }
      ];
      fixture.detectChanges();

      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      radioInput.nativeElement.click();

      expect(onChangeSpy).toHaveBeenCalledWith('opt1');
    });

    it('should mark control as touched on blur', () => {
      const markAsTouchedSpy = vi.spyOn(formControl, 'markAsTouched');
      const blurEvent = new FocusEvent('blur');
      component['onBlur'](blurEvent);
      expect(markAsTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Value Normalization', () => {
    it('should preserve numeric values', () => {
      const numericOptions: RadioOption[] = [
        { value: 123, label: 'Numeric Option' }
      ];
      component.options = numericOptions;
      component['ngControl'] = {
        control: new FormControl(),
        valueAccessor: component
      } as any;
      component.registerOnChange(vi.fn());
      fixture.detectChanges();

      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      radioInput.nativeElement.click();

      expect(component['value']).toBe(123);
      expect(typeof component['value']).toBe('number');
    });

    it('should preserve string values', () => {
      const normalizedValue = component['normalizeValue']('test-string');
      expect(normalizedValue).toBe('test-string');
      expect(typeof normalizedValue).toBe('string');
    });

    it('should convert other types to string', () => {
      const normalizedValue = component['normalizeValue'](true);
      expect(normalizedValue).toBe('true');
      expect(typeof normalizedValue).toBe('string');
    });
  });

  describe('Group Name and Radio ID', () => {
    it('should use custom name when provided', () => {
      component.name = 'custom-radio-name';
      expect(component['groupName']).toBe('custom-radio-name');
    });

    it('should generate group name when not provided', () => {
      component.name = undefined;
      const groupName = component['groupName'];
      expect(groupName).toContain('radio-group-');
    });

    it('should use custom id when provided', () => {
      component.id = 'custom-id';
      expect(component['radioId']).toBe('custom-id');
    });

    it('should use generated id when not provided', () => {
      component.id = undefined;
      const radioId = component['radioId'];
      expect(radioId).toContain('core-radio-');
    });
  });

  describe('Effective Value', () => {
    it('should return standaloneValue when in standalone mode', () => {
      component.standaloneValue = 'standalone';
      component['value'] = 'form-value';
      expect(component['effectiveValue']).toBe('standalone');
    });

    it('should return form value when ngControl exists', () => {
      component['ngControl'] = {
        control: new FormControl('form-value')
      } as any;
      component['value'] = 'form-value';
      component.standaloneValue = 'standalone';
      expect(component['effectiveValue']).toBe('form-value');
    });

    it('should return null when no value is set', () => {
      component.standaloneValue = undefined;
      component['value'] = null;
      expect(component['effectiveValue']).toBe(null);
    });
  });

  describe('isGroupMode', () => {
    it('should return true when options are provided', () => {
      component.options = [{ value: '1', label: 'Test' }];
      expect(component['isGroupMode']).toBe(true);
    });

    it('should return false when options are undefined', () => {
      component.options = undefined;
      expect(component['isGroupMode']).toBe(false);
    });

    it('should return false when options array is empty', () => {
      component.options = [];
      expect(component['isGroupMode']).toBe(false);
    });
  });

  describe('isOptionSelected', () => {
    beforeEach(() => {
      component.options = [
        { value: 'opt1', label: 'Option 1' },
        { value: 'opt2', label: 'Option 2' }
      ];
    });

    it('should return true when option value matches current value', () => {
      component.writeValue('opt1');
      expect(component['isOptionSelected']('opt1')).toBe(true);
    });

    it('should return false when option value does not match', () => {
      component.writeValue('opt1');
      expect(component['isOptionSelected']('opt2')).toBe(false);
    });

    it('should return false when not in group mode', () => {
      component.options = undefined;
      expect(component['isOptionSelected']('opt1')).toBe(false);
    });

    it('should return false when value is null', () => {
      component.writeValue(null);
      expect(component['isOptionSelected']('opt1')).toBe(false);
    });

    it('should return false when value is undefined', () => {
      component.writeValue(undefined);
      expect(component['isOptionSelected']('opt1')).toBe(false);
    });
  });

  describe('getOptionId', () => {
    it('should generate option id based on index', () => {
      component.id = 'test-radio';
      const optionId = component['getOptionId'](0);
      expect(optionId).toBe('test-radio-0');
    });

    it('should generate unique ids for different indices', () => {
      component.id = 'test-radio';
      const id1 = component['getOptionId'](0);
      const id2 = component['getOptionId'](1);
      expect(id1).not.toBe(id2);
    });
  });

  describe('getDefaultValue', () => {
    it('should return null as default value', () => {
      expect(component['getDefaultValue']()).toBe(null);
    });
  });

  describe('getDefaultErrorMessage', () => {
    it('should return default error message', () => {
      expect(component['getDefaultErrorMessage']()).toBe('This field is required.');
    });
  });

  describe('Disabled State Combination', () => {
    it('should be disabled when standaloneDisabled is true', () => {
      component.standaloneDisabled = true;
      component['disabled'] = false;
      expect(component['isDisabled']).toBe(true);
    });

    it('should be disabled when form control is disabled', () => {
      component.standaloneDisabled = false;
      component['disabled'] = true;
      expect(component['isDisabled']).toBe(true);
    });

    it('should be disabled when both are true', () => {
      component.standaloneDisabled = true;
      component['disabled'] = true;
      expect(component['isDisabled']).toBe(true);
    });

    it('should not be disabled when both are false', () => {
      component.standaloneDisabled = false;
      component['disabled'] = false;
      expect(component['isDisabled']).toBe(false);
    });
  });

  describe('Accessibility Attributes', () => {
    beforeEach(() => {
      component.standaloneValue = 'test';
      fixture.detectChanges();
    });

    it('should set role="radio" attribute', () => {
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.getAttribute('role')).toBe('radio');
    });

    it('should set aria-checked when radio is checked', () => {
      component.writeValue('test');
      fixture.detectChanges();
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.getAttribute('aria-checked')).toBe('true');
    });

    it('should not set aria-describedby when no hint', () => {
      component.hint = undefined;
      fixture.detectChanges();
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.getAttribute('aria-describedby')).toBeNull();
    });

    it('should not set aria-invalid when valid', () => {
      component.showValidationState = false;
      fixture.detectChanges();
      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));
      expect(radioInput.nativeElement.getAttribute('aria-invalid')).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      component.options = [];
      fixture.detectChanges();
      expect(component['isGroupMode']).toBe(false);
    });

    it('should handle radio change without event target value', () => {
      component.options = [{ value: 'direct', label: 'Direct' }];
      component['ngControl'] = {
        control: new FormControl(),
        valueAccessor: component
      } as any;
      component.registerOnChange(vi.fn());
      fixture.detectChanges();

      vi.spyOn(component.valueChange, 'emit');
      component['onRadioChange'](new Event('change'), 'direct');
      expect(component.valueChange.emit).toHaveBeenCalledWith('direct');
    });

    it('should handle writeValue with numeric 0', () => {
      component.writeValue(0);
      expect(component['value']).toBe(0);
    });

    it('should handle writeValue with empty string', () => {
      component.writeValue('');
      expect(component['value']).toBe('');
    });

    it('should handle option with numeric 0 value', () => {
      component.options = [
        { value: 0, label: 'Zero' },
        { value: 1, label: 'One' }
      ];
      component.writeValue(0);
      fixture.detectChanges();

      expect(component['isOptionSelected'](0)).toBe(true);
      expect(component['isOptionSelected'](1)).toBe(false);
    });
  });

  describe('OnRadioChange Integration', () => {
    it('should update value through event target when no option value provided', () => {
      component.standaloneValue = 'initial';
      fixture.detectChanges();

      const radioInput = fixture.debugElement.query(By.css('input[type="radio"]'));

      vi.spyOn(component.valueChange, 'emit');

      // Simulate the change event with a proper target
      const changeEvent = {
        target: { value: 'initial' }
      } as any;
      component['onRadioChange'](changeEvent);

      expect(component.valueChange.emit).toHaveBeenCalledWith('initial');
    });

    it('should prefer provided optionValue over event target', () => {
      const event = {
        target: { value: 'event-value' }
      } as any;

      vi.spyOn(component.valueChange, 'emit');
      component['onRadioChange'](event, 'provided-value');

      expect(component.valueChange.emit).toHaveBeenCalledWith('provided-value');
    });
  });

  describe('Change Detection', () => {
    it('should mark for check on writeValue', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const markForCheckSpy = vi.spyOn(componentTemp['changeDetectorRef'], 'markForCheck');
      fixtureTemp.detectChanges();
      componentTemp.writeValue('new-value');
      expect(markForCheckSpy).toHaveBeenCalled();
    });

    it('should mark for check on standalone value change', () => {
      const fixtureTemp = TestBed.createComponent(CoreRadioComponent);
      const componentTemp = fixtureTemp.componentInstance;
      const markForCheckSpy = vi.spyOn(componentTemp['changeDetectorRef'], 'markForCheck');
      componentTemp.standaloneValue = 'initial';
      fixtureTemp.detectChanges();

      const radioInput = fixtureTemp.debugElement.query(By.css('input[type="radio"]'));
      componentTemp.standaloneValue = 'changed';
      radioInput.triggerEventHandler('change', { target: radioInput.nativeElement });

      expect(markForCheckSpy).toHaveBeenCalled();
    });
  });

  describe('Multiple Options with All Features', () => {
    it('should handle all option features together', () => {
      component.options = [
        { value: 'opt1', label: 'Option 1', disabled: false },
        { value: 'opt2', label: 'Option 2', hint: 'Hint text', disabled: false },
        { value: 'opt3', label: 'Option 3', disabled: true }
      ];
      component.label = 'Group Label';
      component.hint = 'Group hint';
      component.required = true;
      component.inline = true;
      component.size = 'lg';
      fixture.detectChanges();

      const radioInputs = fixture.debugElement.queryAll(By.css('input[type="radio"]'));
      const labels = fixture.debugElement.queryAll(By.css('.form-check-label'));

      expect(radioInputs.length).toBe(3);
      expect(labels.length).toBe(3);
      expect(radioInputs[2].nativeElement.disabled).toBe(true);
    });
  });
});
