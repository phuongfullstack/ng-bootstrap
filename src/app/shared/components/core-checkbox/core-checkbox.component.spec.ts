import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CoreCheckboxComponent, CheckboxOption } from "./core-checkbox.component";

describe("CoreCheckboxComponent", () => {
  let fixture: ComponentFixture<CoreCheckboxComponent>;
  let component: CoreCheckboxComponent;
  let formBuilder: FormBuilder;

  const createComponent = (inputs: Partial<CoreCheckboxComponent> = {}): void => {
    fixture = TestBed.createComponent(CoreCheckboxComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreCheckboxComponent, ReactiveFormsModule]
    }).compileComponents();
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe("Initialization", () => {
    it("should create component", () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it("should generate unique id per instance with correct prefix", () => {
      createComponent();
      const firstId = (component as any).generatedId as string;

      const second = TestBed.createComponent(CoreCheckboxComponent).componentInstance;
      (second as any).ngOnInit?.();
      const secondId = (second as any).generatedId as string;

      expect(firstId).toContain("core-checkbox-");
      expect(firstId).not.toBe(secondId);
    });
  });

  describe("Standalone checkbox", () => {
    it("should render label, hint and required asterisk", () => {
      createComponent({ label: "Accept", hint: "Must accept", required: true });
      const label = fixture.nativeElement.querySelector("label");
      const hint = fixture.nativeElement.querySelector(".form-text");
      const asterisk = label.querySelector(".text-danger");

      expect(label.textContent).toContain("Accept");
      expect(hint.textContent).toContain("Must accept");
      expect(asterisk).toBeTruthy();
    });

    it("should reflect value from writeValue", () => {
      createComponent();
      component.writeValue(true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.checked).toBe(true);
    });

    it("should emit valueChange and checkedChange on change", () => {
      createComponent();
      const valueSpy = vi.fn();
      const checkedSpy = vi.fn();
      component.valueChange.subscribe(valueSpy);
      component.checkedChange.subscribe(checkedSpy);

      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(valueSpy).toHaveBeenCalledWith(true);
      expect(checkedSpy).toHaveBeenCalledWith(true);
    });

    it("should call ControlValueAccessor onChange when bound to control", () => {
      const control = new FormControl(false);
      createComponent();
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);
      component.registerOnTouched(() => { /* noop */ });
      (component as any).ngControl = { control, valueAccessor: component } as any;

      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it("should emit focus and blur events", () => {
      createComponent();
      const focusSpy = vi.fn();
      const blurSpy = vi.fn();
      component.focused.subscribe(focusSpy);
      component.blurred.subscribe(blurSpy);

      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.dispatchEvent(new FocusEvent("focus"));
      input.dispatchEvent(new FocusEvent("blur"));
      fixture.detectChanges();

      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    it("should respect disabled state (standaloneDisabled)", () => {
      createComponent({ standaloneDisabled: true });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("should respect setDisabledState from ControlValueAccessor", () => {
      createComponent();
      component.setDisabledState(true);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it("should support indeterminate input", () => {
      createComponent({ indeterminate: true });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.indeterminate).toBe(true);
    });
  });

  describe("Checkbox group", () => {
    const options: CheckboxOption[] = [
      { value: "reading", label: "Reading" },
      { value: "gaming", label: "Gaming", disabled: true },
      { value: "music", label: "Music" }
    ];

    const setupGroup = (value: any = []): void => {
      createComponent({ options, standaloneValue: value });
      fixture.detectChanges();
    };

    it("should render all options", () => {
      setupGroup();
      const inputs = fixture.nativeElement.querySelectorAll("input[type='checkbox']");
      expect(inputs.length).toBe(options.length);
    });

    it("should mark options as checked based on value array", () => {
      setupGroup(["reading", "music"]);
      const inputs = fixture.nativeElement.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
      expect(inputs[0].checked).toBe(true);
      expect(inputs[1].checked).toBe(false);
      expect(inputs[2].checked).toBe(true);
    });

    it("should update selection and emit valueChange", () => {
      setupGroup([]);
      const valueSpy = vi.fn();
      component.valueChange.subscribe(valueSpy);

      const inputs = fixture.nativeElement.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
      inputs[0].checked = true;
      inputs[0].dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect((component as any).value).toEqual(["reading"]);
      expect(valueSpy).toHaveBeenCalledWith(["reading"]);
    });

    it("should not toggle disabled option", () => {
      setupGroup([]);
      const inputs = fixture.nativeElement.querySelectorAll("input[type='checkbox']") as NodeListOf<HTMLInputElement>;
      expect(inputs[1].disabled).toBe(true);
    });
  });

  describe("Reactive forms integration", () => {
    let formGroup: FormGroup;

    const setupWithControl = (initial: any = false, validators: any[] = []): void => {
      formGroup = formBuilder.group({
        terms: [initial, validators]
      });

      fixture = TestBed.createComponent(CoreCheckboxComponent);
      component = fixture.componentInstance;

      const control = formGroup.get("terms")!;
      (component as any).ngControl = { control, valueAccessor: component } as any;
      component.ngOnInit();

      component.registerOnChange((value: any) => {
        control.setValue(value, { emitEvent: false });
      });

      component.registerOnTouched(() => control.markAsTouched());

      component.writeValue(initial);
      fixture.detectChanges();
    };

    it("should update FormControl value on change", () => {
      setupWithControl(false);
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.checked = true;
      input.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(formGroup.get("terms")?.value).toBe(true);
    });

    it("should show invalid state when touched and invalid", () => {
      setupWithControl(false, [Validators.requiredTrue]);
      const control = formGroup.get("terms")!;
      control.markAsTouched();
      (component as any).cdr.markForCheck();
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.classList.contains("is-invalid")).toBe(true);
    });
  });
});
