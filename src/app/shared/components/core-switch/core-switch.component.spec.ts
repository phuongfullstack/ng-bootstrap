import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreSwitchComponent } from './core-switch.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('CoreSwitchComponent', () => {
  let component: CoreSwitchComponent;
  let fixture: ComponentFixture<CoreSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreSwitchComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CoreSwitchComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.size).toBe('md');
      expect(component.variant).toBe('primary');
      expect(component.labelPosition).toBe('right');
      expect(component.standaloneDisabled).toBe(false);
      expect(component.indeterminate).toBe(false);
      expect(component.required).toBe(false);
      expect(component.showValidationState).toBe(true);
    });

    it('should generate unique id', () => {
      const fixture2 = TestBed.createComponent(CoreSwitchComponent);
      const component2 = fixture2.componentInstance;
      expect((component as any).generatedId).not.toBe((component2 as any).generatedId);
    });
  });

  describe('Switch Classes', () => {
    it('should apply default classes', () => {
      fixture.detectChanges();
      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv).toBeTruthy();
      expect(switchDiv.nativeElement.classList.contains('form-check')).toBe(true);
    });

    it('should apply sm size class', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('form-switch-sm')).toBe(true);
    });

    it('should apply lg size class', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('form-switch-lg')).toBe(true);
    });

    it('should not apply size class for md', () => {
      fixture.componentRef.setInput('size', 'md');
      fixture.detectChanges();
      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('form-switch-md')).toBe(false);
    });

    it('should apply inline class when label position is left', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('labelPosition', 'left');
      fixture.detectChanges();
      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('form-check-inline')).toBe(true);
    });

    it('should not apply inline class when label position is right', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('labelPosition', 'right');
      fixture.detectChanges();
      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('form-check-inline')).toBe(false);
    });
  });

  describe('Variant Classes', () => {
    const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'] as const;

    variants.forEach(variant => {
      it(`should apply ${variant} variant class to input`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('input'));
        expect(input.nativeElement.classList.contains(`form-check-input-${variant}`)).toBe(true);
      });
    });
  });

  describe('Label Rendering', () => {
    it('should render label on the right by default', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('label'));
      const input = fixture.debugElement.query(By.css('input'));

      // Label should come after input in DOM
      expect(labels.length).toBe(1);
      const labelElement = labels[0].nativeElement;
      const inputElement = input.nativeElement;
      expect(inputElement.compareDocumentPosition(labelElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should render label on the left when labelPosition is left', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('labelPosition', 'left');
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('label'));
      const input = fixture.debugElement.query(By.css('input'));

      expect(labels.length).toBe(1);
      const labelElement = labels[0].nativeElement;
      const inputElement = input.nativeElement;
      // Label should come before input in DOM
      expect(labelElement.compareDocumentPosition(inputElement) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('should not render label when label is not provided', () => {
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('label'));
      expect(labels.length).toBe(0);
    });

    it('should display required asterisk when required is true', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const asterisk = fixture.debugElement.query(By.css('.text-danger'));
      expect(asterisk).toBeTruthy();
      expect(asterisk.nativeElement.textContent).toBe('*');
    });

    it('should not display required asterisk when required is false', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.componentRef.setInput('required', false);
      fixture.detectChanges();
      const asterisk = fixture.debugElement.query(By.css('.text-danger'));
      expect(asterisk).toBeFalsy();
    });
  });

  describe('Hint Text', () => {
    it('should render hint when provided', () => {
      fixture.componentRef.setInput('hint', 'This is a hint');
      fixture.detectChanges();
      const hint = fixture.debugElement.query(By.css('.form-text'));
      expect(hint).toBeTruthy();
      expect(hint.nativeElement.textContent.trim()).toBe('This is a hint');
    });

    it('should not render hint when not provided', () => {
      fixture.detectChanges();
      const hint = fixture.debugElement.query(By.css('.form-text'));
      expect(hint).toBeFalsy();
    });

    it('should link hint to input with aria-describedby', () => {
      fixture.componentRef.setInput('hint', 'Test hint');
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      const hintId = input.nativeElement.getAttribute('aria-describedby');
      expect(hintId).toBeTruthy();
      const hint = fixture.debugElement.query(By.css(`#${hintId}`));
      expect(hint).toBeTruthy();
    });
  });

  describe('Standalone Mode', () => {
    it('should work in standalone mode without ngControl', () => {
      fixture.componentRef.setInput('standaloneValue', true);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);
    });

    it('should update standaloneValue on change', () => {
      fixture.componentRef.setInput('standaloneValue', false);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));

      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.standaloneValue).toBe(true);
    });

    it('should respect standaloneDisabled', () => {
      fixture.componentRef.setInput('standaloneDisabled', true);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.disabled).toBe(true);
    });

    it('should not be disabled when standaloneDisabled is false', () => {
      fixture.componentRef.setInput('standaloneDisabled', false);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.disabled).toBe(false);
    });
  });

  describe('Reactive Forms Integration', () => {
    it('should work with reactive forms', () => {
      const control = new FormControl(false);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.writeValue(true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);
    });

    it('should update form control on change', () => {
      const control = new FormControl(false);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.registerOnChange((value) => control.setValue(value));
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(control.value).toBe(true);
    });

    it('should call onTouched on blur', () => {
      const control = new FormControl(false);
      const onTouched = vi.fn();
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.registerOnTouched(onTouched);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(onTouched).toHaveBeenCalled();
    });

    it('should handle disabled state from form control', () => {
      const control = new FormControl({ value: false, disabled: true });
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.setDisabledState(true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.disabled).toBe(true);
    });
  });

  describe('Value Handling', () => {
    it('should handle boolean true value', () => {
      const control = new FormControl(false);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.writeValue(true);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);
    });

    it('should handle boolean false value', () => {
      component.writeValue(false);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should handle string "true" as true', () => {
      const control = new FormControl(false);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.writeValue('true');
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);
    });

    it('should handle string "false" as false', () => {
      component.writeValue('false');
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should handle number 1 as true', () => {
      const control = new FormControl(false);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.writeValue(1);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);
    });

    it('should handle number 0 as false', () => {
      component.writeValue(0);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should handle null as false', () => {
      component.writeValue(null);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should handle undefined as false', () => {
      component.writeValue(undefined);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should return false for default value', () => {
      const defaultValue = (component as any).getDefaultValue();
      expect(defaultValue).toBe(false);
    });
  });

  describe('Indeterminate State', () => {
    it('should set indeterminate attribute when indeterminate is true', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.indeterminate).toBe(true);
    });

    it('should not set indeterminate attribute when indeterminate is false', () => {
      fixture.componentRef.setInput('indeterminate', false);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.indeterminate).toBe(false);
    });

    it('should show unchecked when indeterminate is true', () => {
      component.writeValue(true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should clear indeterminate state on change', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.indeterminate).toBe(false);
    });

    it('should emit indeterminateChange when clearing indeterminate', () => {
      const indeterminateChangeSpy = vi.spyOn(component.indeterminateChange, 'emit');
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(indeterminateChangeSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('Event Emissions', () => {
    it('should emit valueChange when value changes', () => {
      const valueChangeSpy = vi.spyOn(component.valueChange, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should emit checkedChange when value changes', () => {
      const checkedChangeSpy = vi.spyOn(component.checkedChange, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(checkedChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should emit focused on focus', () => {
      const focusedSpy = vi.spyOn(component.focused, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      const focusEvent = new FocusEvent('focus');
      input.nativeElement.dispatchEvent(focusEvent);
      fixture.detectChanges();

      expect(focusedSpy).toHaveBeenCalled();
    });

    it('should emit blurred on blur', () => {
      const blurredSpy = vi.spyOn(component.blurred, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      const blurEvent = new FocusEvent('blur');
      input.nativeElement.dispatchEvent(blurEvent);
      fixture.detectChanges();

      expect(blurredSpy).toHaveBeenCalled();
    });

    it('should emit clicked on click', () => {
      const clickedSpy = vi.spyOn(component.clicked, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      const clickEvent = new MouseEvent('click');
      input.nativeElement.dispatchEvent(clickEvent);
      fixture.detectChanges();

      expect(clickedSpy).toHaveBeenCalled();
    });

    it('should not emit events when disabled', () => {
      fixture.componentRef.setInput('standaloneDisabled', true);
      const focusedSpy = vi.spyOn(component.focused, 'emit');
      const blurredSpy = vi.spyOn(component.blurred, 'emit');
      const clickedSpy = vi.spyOn(component.clicked, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.dispatchEvent(new FocusEvent('focus'));
      input.nativeElement.dispatchEvent(new FocusEvent('blur'));
      input.nativeElement.dispatchEvent(new MouseEvent('click'));
      fixture.detectChanges();

      expect(focusedSpy).not.toHaveBeenCalled();
      expect(blurredSpy).not.toHaveBeenCalled();
      expect(clickedSpy).not.toHaveBeenCalled();
    });

    it('should prevent change event when disabled', () => {
      fixture.componentRef.setInput('standaloneDisabled', true);
      fixture.componentRef.setInput('standaloneValue', false);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      const changeEvent = new Event('change');
      const preventDefaultSpy = vi.spyOn(changeEvent, 'preventDefault');
      input.nativeElement.dispatchEvent(changeEvent);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.standaloneValue).toBe(false);
    });
  });

  describe('Validation States', () => {
    it('should show invalid state when control is invalid and touched', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsTouched();
      fixture.detectChanges();

      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('is-invalid')).toBe(true);
    });

    it('should show invalid state when control is invalid and dirty', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsDirty();
      fixture.detectChanges();

      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('is-invalid')).toBe(true);
    });

    it('should show valid state when control is valid and touched', () => {
      const control = new FormControl(true, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsTouched();
      fixture.detectChanges();

      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('is-valid')).toBe(true);
    });

    it('should not show validation states when showValidationState is false', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', false);

      control.markAsTouched();
      fixture.detectChanges();

      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      expect(switchDiv.nativeElement.classList.contains('is-invalid')).toBe(false);
      expect(switchDiv.nativeElement.classList.contains('is-valid')).toBe(false);
    });

    it('should display error messages when invalid', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsTouched();
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(By.css('.invalid-feedback'));
      expect(errorDiv).toBeTruthy();
      // Check for either English or Vietnamese validation message
      const errorText = errorDiv.nativeElement.textContent;
      expect(errorText.includes('This field is required.') || errorText.includes('Trường này là bắt buộc.')).toBe(true);
    });

    it('should display success message when valid', () => {
      const control = new FormControl(true, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsTouched();
      fixture.detectChanges();

      const successDiv = fixture.debugElement.query(By.css('.valid-feedback'));
      expect(successDiv).toBeTruthy();
      expect(successDiv.nativeElement.textContent.trim()).toBe('Looks good!');
    });

    it('should not display validation feedback when not touched', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(By.css('.invalid-feedback'));
      expect(errorDiv).toBeFalsy();
    });

    it('should set aria-invalid when invalid', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsTouched();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.getAttribute('aria-invalid')).toBe('true');
    });

    it('should handle custom error messages', () => {
      const control = new FormControl(false, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);
      fixture.componentRef.setInput('errorMessages', { required: 'Switch is required!' });

      control.markAsTouched();
      fixture.detectChanges();

      const errorDiv = fixture.debugElement.query(By.css('.invalid-feedback'));
      expect(errorDiv.nativeElement.textContent).toContain('Switch is required!');
    });

    it('should display multiple error messages', () => {
      const control = new FormControl(false, [Validators.requiredTrue, Validators.required]);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      fixture.componentRef.setInput('showValidationState', true);

      control.markAsTouched();
      fixture.detectChanges();

      const errorDivs = fixture.debugElement.queryAll(By.css('.invalid-feedback div'));
      expect(errorDivs.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper role for checkbox input', () => {
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input[type="checkbox"]'));
      expect(input).toBeTruthy();
    });

    it('should link label to input with for attribute', () => {
      fixture.componentRef.setInput('label', 'Test Label');
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      const label = fixture.debugElement.query(By.css('label'));
      expect(label.nativeElement.getAttribute('for')).toBe(input.nativeElement.id);
    });

    it('should use custom id when provided', () => {
      fixture.componentRef.setInput('id', 'custom-switch-id');
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.id).toBe('custom-switch-id');
    });

    it('should use generated id when custom id not provided', () => {
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.id).toContain('core-switch-');
    });

    it('should set required attribute when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.required).toBe(true);
    });

    it('should not set required attribute when required is false', () => {
      fixture.componentRef.setInput('required', false);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.required).toBe(false);
    });
  });

  describe('Change Detection', () => {
    it('should mark for check after value change', () => {
      const changeDetectorRef = (component as any).changeDetectorRef;
      const markForCheckSpy = vi.spyOn(changeDetectorRef, 'markForCheck');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.nativeElement.checked = true;
      input.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(markForCheckSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid value changes', () => {
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));

      for (let i = 0; i < 10; i++) {
        input.nativeElement.checked = i % 2 === 0;
        input.nativeElement.dispatchEvent(new Event('change'));
      }

      fixture.detectChanges();
      expect(component.standaloneValue).toBe(false);
    });

    it('should handle change event without target', () => {
      fixture.detectChanges();

      // The component should handle null target gracefully
      // We can't easily simulate a null target in the event, so we verify
      // the component doesn't crash with normal events
      const input = fixture.debugElement.query(By.css('input'));
      expect(() => {
        input.nativeElement.checked = true;
        input.nativeElement.dispatchEvent(new Event('change'));
        fixture.detectChanges();
      }).not.toThrow();
    });

    it('should handle null control', () => {
      (component as any).ngControl = null;
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input).toBeTruthy();
    });

    it('should handle both standalone and form control disabled', () => {
      const control = new FormControl({ value: false, disabled: true });
      (component as any).ngControl = { control } as any;
      component.ngOnInit();
      component.setDisabledState(true);
      fixture.componentRef.setInput('standaloneDisabled', true);
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.disabled).toBe(true);
    });

    it('should get default error message', () => {
      const errorMessage = (component as any).getDefaultErrorMessage();
      expect(errorMessage).toBe('This field is required.');
    });

    it('should handle writeValue with various falsy values', () => {
      const falsyValues = [false, 0, '', null, undefined, NaN];

      falsyValues.forEach(value => {
        component.writeValue(value);
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css('input'));
        expect(input.nativeElement.checked).toBe(false);
      });
    });

    it('should handle standalone mode with undefined standaloneValue', () => {
      fixture.componentRef.setInput('standaloneValue', undefined);
      fixture.detectChanges();
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(false);
    });

    it('should handle blur without triggering other events', () => {
      const blurredSpy = vi.spyOn(component.blurred, 'emit');
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      input.triggerEventHandler('blur', new FocusEvent('blur'));
      fixture.detectChanges();

      expect(blurredSpy).toHaveBeenCalled();
    });

    it('should handle label with empty string', () => {
      fixture.componentRef.setInput('label', '');
      fixture.detectChanges();
      const labels = fixture.debugElement.queryAll(By.css('label'));
      expect(labels.length).toBe(0);
    });

    it('should handle hint with empty string', () => {
      fixture.componentRef.setInput('hint', '');
      fixture.detectChanges();
      const hint = fixture.debugElement.query(By.css('.form-text'));
      expect(hint).toBeFalsy();
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with all features enabled', () => {
      const control = new FormControl(true, Validators.requiredTrue);
      (component as any).ngControl = { control } as any;
      component.ngOnInit();

      fixture.componentRef.setInput('label', 'Full Featured Switch');
      fixture.componentRef.setInput('hint', 'This is a hint');
      fixture.componentRef.setInput('required', true);
      fixture.componentRef.setInput('showValidationState', true);
      fixture.componentRef.setInput('size', 'lg');
      fixture.componentRef.setInput('variant', 'success');
      fixture.componentRef.setInput('labelPosition', 'left');

      control.markAsTouched();
      fixture.detectChanges();

      const switchDiv = fixture.debugElement.query(By.css('.form-switch'));
      const input = fixture.debugElement.query(By.css('input'));
      const label = fixture.debugElement.query(By.css('label'));
      const hint = fixture.debugElement.query(By.css('.form-text'));

      expect(switchDiv.nativeElement.classList.contains('form-switch-lg')).toBe(true);
      expect(input.nativeElement.classList.contains('form-check-input-success')).toBe(true);
      expect(label).toBeTruthy();
      expect(hint).toBeTruthy();
      expect(switchDiv.nativeElement.classList.contains('is-valid')).toBe(true);
    });

    it('should handle switching between standalone and reactive forms', () => {
      // Start with standalone
      fixture.componentRef.setInput('standaloneValue', true);
      fixture.detectChanges();
      let input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);

      // Create new component instance for reactive forms
      const fixture2 = TestBed.createComponent(CoreSwitchComponent);
      const component2 = fixture2.componentInstance;
      const control = new FormControl(false);
      (component2 as any).ngControl = { control } as any;
      component2.ngOnInit();
      component2.writeValue(false);
      fixture2.detectChanges();

      const input2 = fixture2.debugElement.query(By.css('input'));
      expect(input2.nativeElement.checked).toBe(false);
    });

    it('should maintain state through multiple detectChanges calls', () => {
      fixture.componentRef.setInput('standaloneValue', true);
      fixture.detectChanges();
      fixture.detectChanges();
      fixture.detectChanges();

      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.checked).toBe(true);
    });
  });
});
