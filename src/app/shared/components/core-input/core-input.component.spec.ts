import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoreInputComponent } from "./core-input.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

describe('CoreInputComponent', () => {
  let component: CoreInputComponent;
  let fixture: ComponentFixture<CoreInputComponent>;

  const createComponent = (props?: Partial<CoreInputComponent>) => {
    fixture = TestBed.createComponent(CoreInputComponent);
    component = fixture.componentInstance;

    if (props) {
      Object.assign(component, props);
    }

    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreInputComponent, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();
  });

  describe('Component Inititialization', () => {
    it('should create the component', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('sholud have default type as text', () => {
      createComponent();
      expect(component.type).toBe('text');
    });
    it('should generate unique ID for each instance', () => {
      createComponent();
      const firstId = component['inputId'];

      const secondFixture = TestBed.createComponent(CoreInputComponent);
      const secondComponent = secondFixture.componentInstance;
      secondFixture.detectChanges();

      expect(component['inputId']).not.toBe(secondComponent['inputId']);
      expect(firstId).toContain('core-input-');
    });
  });

  describe('Input Properties', () => {
    it('should accept and set input properties correctly', () => {
      createComponent({ placeholder: 'Enter your name' });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('placeholder')).toBe('Enter your name');
    });

    it('should accept and apply type attribue correctly', () => {
      createComponent({ type: 'email' });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('type')).toBe('email');
    });

    it('should accept and set readonly attribute correctly', () => {
      createComponent({ readonly: true });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.readOnly).toBe(true);
    });

    it('should accept and apply minlength attribute correctly', () => {
      createComponent({ minlength: 5 });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('minlength')).toBe('5');
    });

    it('should accept and apply maxlength attribute correctly', () => {
      createComponent({ maxlength: 10 });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('maxlength')).toBe('10');
    });

    it('should accept and apply min attribute for number type', () => {
      createComponent({ type: 'number', min: 0 });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('min')).toBe('0');
    });

    it('should accept and apply max attribute for number type', () => {
      createComponent({ type: 'number', max: 100 });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('max')).toBe('100');
    });

    it('should accept and apply step attribute for number type', () => {
      createComponent({ type: 'number', step: 0.1 });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('step')).toBe('0.1');
    });

    it('should accept and apply pattern attribute', () => {
      createComponent({ pattern: '[0-9]*' });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('pattern')).toBe('[0-9]*');
    });

    it('should not render null attributes', () => {
      createComponent({ minlength: undefined });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.getAttribute('minlength')).toBeNull();
    });
  });
  describe('Label and Hint', () => {
    it('should render label when provided', () => {
      createComponent({ label: 'Username' });
      const label = fixture.nativeElement.querySelector('label');
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Username');
    });

    it('should not render label when not provided', () => {
      createComponent();
      const label = fixture.nativeElement.querySelector('label');
      expect(label).toBeNull();
    });

    it('should render required indicator when required is true', () => {
      createComponent({ label: 'Email', required: true });
      const requiredSpan = fixture.nativeElement.querySelector('.text-danger');
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.textContent).toBe('*');
    });

    it('should render hint when provided', () => {
      createComponent({ hint: 'Enter your email address' });
      const hint = fixture.nativeElement.querySelector('.form-text');
      expect(hint).toBeTruthy();
      expect(hint.textContent).toBe('Enter your email address');
    });

    it('should not render hint when not provided', () => {
      createComponent();
      const hint = fixture.nativeElement.querySelector('.form-text');
      expect(hint).toBeNull();
    });

    it('should associate label with input using inputId', () => {
      createComponent({ label: 'Test Label' });
      const label = fixture.nativeElement.querySelector('label');
      const input = fixture.nativeElement.querySelector('input');
      expect(label.getAttribute('for')).toBe(input.id);
    });
  });

  describe('Event Emitters', () => {
    it('should emit valueChange on input event', () => {
      createComponent();
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = 'Test Value';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('Test Value');
    });

    it('should emit focused event when input receives focus', () => {
      createComponent();
      const spy = vi.fn();
      component.focused.subscribe(spy);

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]?.[0]).toBeInstanceOf(FocusEvent);
    });

    it('should emit blurred event when input loses focus', () => {
      createComponent();
      const spy = vi.fn();
      component.blurred.subscribe(spy);

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]?.[0]).toBeInstanceOf(FocusEvent);
    });

    it('should emit valueChange with empty string for empty input', () => {
      createComponent();
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = '';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('');
    });
  });
  describe('Value Processing', () => {
    it('should process text input as string', () => {
      createComponent({ type: 'text' });
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith('hello');
      expect(component['value']).toBe('hello');
    });

    it('should convert number input to number type', () => {
      createComponent({ type: 'number' });
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = '123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(123);
      expect(component['value']).toBe(123);
    });

    it('should handle empty number input as empty string', () => {
      createComponent({ type: 'number' });
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = '';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith('');
      expect(component['value']).toBe('');
    });

    it('should handle decimal number input', () => {
      createComponent({ type: 'number' });
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = '123.45';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(123.45);
      expect(component['value']).toBe(123.45);
    });

    it('should always emit valueChange as string regardless of type', () => {
      createComponent({ type: 'number' });
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = '123';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith('123');
    });
  });

  describe('Reactive Forms Integration', () => {
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {
      formBuilder = TestBed.inject(FormBuilder);
    });

    const setupComponentWithFormControl = (controlValue: any = '') => {
      formGroup = formBuilder.group({
        username: [controlValue]
      });

      fixture = TestBed.createComponent(CoreInputComponent);
      component = fixture.componentInstance;

      const control = formGroup.get('username')!;

      // Create mock NgControl with proper structure
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component['ngControl'] = mockNgControl;

      // Initialize component lifecycle
      component.ngOnInit();

      // Register FormControl's onChange callback to update control value
      component.registerOnChange((value: any) => {
        control.setValue(value, { emitEvent: false });
      });

      // Register FormControl's onTouched callback
      component.registerOnTouched(() => {
        control.markAsTouched();
      });

      // Write initial value
      component.writeValue(controlValue);

      fixture.detectChanges();
    };

    it('should integrate with FormControl via FormGroup', () => {
      setupComponentWithFormControl('initial value');

      expect(component).toBeTruthy();
      expect(component['value']).toBe('initial value');
    });

    it('should update FormControl value when input changes', () => {
      setupComponentWithFormControl('');

      const input = fixture.nativeElement.querySelector('input');
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(formGroup.get('username')?.value).toBe('new value');
    });

    it('should update input value when FormControl value changes', () => {
      setupComponentWithFormControl('initial');

      formGroup.patchValue({ username: 'updated value' });
      // Trigger writeValue manually since Angular doesn't do it automatically in tests
      component.writeValue('updated value');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.value).toBe('updated value');
    });

    it('should call onChange callback when value changes', () => {
      setupComponentWithFormControl('');

      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith('test');
    });

    it('should call onTouched callback when input blurs', () => {
      setupComponentWithFormControl('');

      const control = formGroup.get('username')!;
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();

      expect(onTouchedSpy).toHaveBeenCalled();
      expect(control.touched).toBe(true);
    });

    it('should mark control as touched on blur', () => {
      setupComponentWithFormControl('');

      const control = formGroup.get('username')!;
      expect(control.touched).toBe(false);

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();

      expect(control.touched).toBe(true);
    });

    it('should handle disabled state from FormControl', () => {
      formGroup = formBuilder.group({
        username: [{ value: '', disabled: true }]
      });

      fixture = TestBed.createComponent(CoreInputComponent);
      component = fixture.componentInstance;

      const control = formGroup.get('username')!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component['ngControl'] = mockNgControl;

      component.ngOnInit();
      component.setDisabledState(true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBe(true);
    });
  });

  describe('Validation States', () => {
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {
      formBuilder = TestBed.inject(FormBuilder);
    });

    const setupComponentWithValidation = (controlValue: any = '', validators: any[] = []) => {
      formGroup = formBuilder.group({
        username: [controlValue, validators]
      });

      fixture = TestBed.createComponent(CoreInputComponent);
      component = fixture.componentInstance;

      const control = formGroup.get('username')!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component['ngControl'] = mockNgControl;

      component.ngOnInit();

      // Register FormControl's onChange callback to update control value
      component.registerOnChange((value: any) => {
        control.setValue(value, { emitEvent: false });
      });

      // Register FormControl's onTouched callback
      component.registerOnTouched(() => {
        control.markAsTouched();
      });

      component.writeValue(controlValue);
      fixture.detectChanges();
    };

    it('should apply is-invalid class when control is invalid and touched', () => {
      setupComponentWithValidation('', [Validators.required]);

      const control = formGroup.get('username')!;
      control.markAsTouched();
      // Manually trigger change detection for OnPush strategy
      component['changeDetectorRef'].markForCheck();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.classList.contains('is-invalid')).toBe(true);
    });

    it('should apply is-valid class when control is valid and touched', () => {
      formGroup = formBuilder.group({
        username: ['valid value', [Validators.required]]
      });

      fixture = TestBed.createComponent(CoreInputComponent);
      component = fixture.componentInstance;

      const control = formGroup.get('username')!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component['ngControl'] = mockNgControl;
      component.ngOnInit();

      // Register FormControl's onChange callback
      component.registerOnChange((value: any) => {
        control.setValue(value, { emitEvent: false });
      });

      // Register FormControl's onTouched callback
      component.registerOnTouched(() => {
        control.markAsTouched();
      });

      component.writeValue('valid value');
      control.markAsTouched();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.classList.contains('is-valid')).toBe(true);
    });

    it('should not show validation state when showValidationState is false', () => {
      setupComponentWithValidation('', [Validators.required]);

      const control = formGroup.get('username')!;
      component.showValidationState = false;

      control.markAsTouched();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.classList.contains('is-invalid')).toBe(false);
    });

    it('should display error messages when control is invalid', () => {
      setupComponentWithValidation('', [Validators.required]);

      const control = formGroup.get('username')!;
      control.markAsTouched();
      component['changeDetectorRef'].markForCheck();
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(errorDiv).toBeTruthy();
      expect(errorDiv.textContent).toContain('Trường này là bắt buộc');
    });

    it('should display custom error messages when provided', () => {
      setupComponentWithValidation('', [Validators.required]);

      const control = formGroup.get('username')!;
      component.errorMessages = {
        required: 'Custom required message'
      };

      control.markAsTouched();
      component['changeDetectorRef'].markForCheck();
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(errorDiv).toBeTruthy();
      expect(errorDiv.textContent).toContain('Custom required message');
    });

    it('should not show errors when control is pristine and untouched', () => {
      setupComponentWithValidation('', [Validators.required]);

      const errorDiv = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(errorDiv).toBeNull();
    });

    it('should show errors when control is dirty', () => {
      setupComponentWithValidation('', [Validators.required]);

      const control = formGroup.get('username')!;
      control.markAsDirty();
      component['changeDetectorRef'].markForCheck();
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector('.invalid-feedback');
      expect(errorDiv).toBeTruthy();
    });
  });
  describe('ControlValueAccessor Implementation', () => {
    it('should implement writeValue correctly', () => {
      createComponent();
      component.writeValue('test value');
      fixture.detectChanges();

      expect(component['value']).toBe('test value');
      const input = fixture.nativeElement.querySelector('input');
      expect(input.value).toBe('test value');
    });

    it('should use default value when writeValue receives null', () => {
      createComponent();
      component.writeValue(null);
      fixture.detectChanges();

      expect(component['value']).toBe('');
    });

    it('should use default value when writeValue receives undefined', () => {
      createComponent();
      component.writeValue(undefined);
      fixture.detectChanges();

      expect(component['value']).toBe('');
    });

    it('should register onChange callback', () => {
      createComponent();
      const callback = vi.fn();
      component.registerOnChange(callback);

      component['onChange']('test');
      expect(callback).toHaveBeenCalledWith('test');
    });

    it('should register onTouched callback', () => {
      createComponent();
      const callback = vi.fn();
      component.registerOnTouched(callback);

      component['onTouched']();
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long input values', () => {
      createComponent();
      const longValue = 'a'.repeat(10000);
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = longValue;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(longValue);
    });

    it('should handle special characters in input', () => {
      createComponent();
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = specialChars;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(specialChars);
    });

    it('should handle unicode characters', () => {
      createComponent();
      const unicodeValue = '你好世界 🌍';
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = unicodeValue;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(unicodeValue);
    });

    it('should handle whitespace-only input', () => {
      createComponent();
      const whitespace = '   ';
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = whitespace;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(whitespace);
    });

    it('should handle number type with invalid number string', () => {
      createComponent({ type: 'number' });
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      const input = fixture.nativeElement.querySelector('input');
      input.value = 'abc';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      // Empty string for invalid number input
      expect(onChangeSpy).toHaveBeenCalledWith('');
    });
  });

  describe('Custom ID', () => {
    it('should use custom id when provided', () => {
      createComponent({ id: 'custom-input-id' });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.id).toBe('custom-input-id');
    });

    it('should use generated id when custom id is not provided', () => {
      createComponent();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.id).toContain('core-input-');
    });
  });

  describe('Required Attribute', () => {
    it('should set required attribute when required is true', () => {
      createComponent({ required: true });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.required).toBe(true);
    });

    it('should not set required attribute when required is false', () => {
      createComponent({ required: false });
      const input = fixture.nativeElement.querySelector('input');
      expect(input.required).toBe(false);
    });
  });
});
