import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CoreDropdownComponent, DropdownOption } from "./core-dropdown.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

describe("CoreDropdownComponent", () => {
  let component: CoreDropdownComponent;
  let fixture: ComponentFixture<CoreDropdownComponent>;

  const createComponent = (props?: Partial<CoreDropdownComponent>) => {
    fixture = TestBed.createComponent(CoreDropdownComponent);
    component = fixture.componentInstance;

    if (props) {
      Object.assign(component, props);
    }

    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreDropdownComponent, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();
  });

  describe("Component Initialization", () => {
    it("should create the component", () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it("should have default placeholder", () => {
      createComponent();
      expect(component.placeholder).toBe("Chọn một tùy chọn");
    });

    it("should have default disabled as false", () => {
      createComponent();
      expect(component.disabled).toBe(false);
    });

    it("should have default multiple as false", () => {
      createComponent();
      expect(component.multiple).toBe(false);
    });

    it("should have default options as empty array", () => {
      createComponent();
      expect(component.options).toEqual([]);
    });

    it("should generate unique ID for each instance", () => {
      createComponent();
      const firstId = component["generatedId"];

      const secondFixture = TestBed.createComponent(CoreDropdownComponent);
      const secondComponent = secondFixture.componentInstance;
      secondFixture.detectChanges();

      expect(component["generatedId"]).not.toBe(secondComponent["generatedId"]);
      expect(firstId).toContain("core-dropdown-");
    });

    it("should initialize isDisabled as false", () => {
      createComponent();
      expect(component["isDisabled"]).toBe(false);
    });
  });

  describe("Input Properties", () => {
    it("should accept and set placeholder property", () => {
      createComponent({ placeholder: "Select an option" });
      expect(component.placeholder).toBe("Select an option");
    });

    it("should accept and set disabled property", () => {
      createComponent({ disabled: true });
      expect(component.disabled).toBe(true);
    });

    it("should accept and set options property", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options });
      expect(component.options).toEqual(options);
    });

    it("should accept and set multiple property", () => {
      createComponent({ multiple: true });
      expect(component.multiple).toBe(true);
    });

    it("should accept and set size property as sm", () => {
      createComponent({ size: "sm" });
      expect(component.size).toBe("sm");
    });

    it("should accept and set size property as lg", () => {
      createComponent({ size: "lg" });
      expect(component.size).toBe("lg");
    });

    it("should accept undefined size", () => {
      createComponent({ size: undefined });
      expect(component.size).toBeUndefined();
    });
  });

  describe("Label and Hint", () => {
    it("should render label when provided", () => {
      createComponent({ label: "Select Country" });
      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeTruthy();
      expect(label.textContent).toContain("Select Country");
    });

    it("should not render label when not provided", () => {
      createComponent();
      const label = fixture.nativeElement.querySelector("label");
      expect(label).toBeNull();
    });

    it("should render required indicator when required is true", () => {
      createComponent({ label: "Country", required: true });
      const requiredSpan = fixture.nativeElement.querySelector(".text-danger");
      expect(requiredSpan).toBeTruthy();
      expect(requiredSpan.textContent).toBe("*");
    });

    it("should not render required indicator when required is false", () => {
      createComponent({ label: "Country", required: false });
      const requiredSpan = fixture.nativeElement.querySelector(".text-danger");
      expect(requiredSpan).toBeNull();
    });

    it("should render hint when provided", () => {
      createComponent({ hint: "Please select an option" });
      const hint = fixture.nativeElement.querySelector(".form-text");
      expect(hint).toBeTruthy();
      expect(hint.textContent?.trim()).toBe("Please select an option");
    });

    it("should not render hint when not provided", () => {
      createComponent();
      const hint = fixture.nativeElement.querySelector(".form-text");
      expect(hint).toBeNull();
    });

    it("should associate label with select using selectId", () => {
      createComponent({ label: "Test Label" });
      const label = fixture.nativeElement.querySelector("label");
      const select = fixture.nativeElement.querySelector("select");
      expect(label.getAttribute("for")).toBe(select.id);
    });

    it("should set aria-describedby when hint is provided", () => {
      createComponent({ hint: "Help text" });
      const select = fixture.nativeElement.querySelector("select");
      const hintId = component["selectId"] + "-hint";
      expect(select.getAttribute("aria-describedby")).toBe(hintId);
    });

    it("should not set aria-describedby when hint is not provided", () => {
      createComponent();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.getAttribute("aria-describedby")).toBeNull();
    });
  });

  describe("Select Element", () => {
    it("should render select element", () => {
      createComponent();
      const select = fixture.nativeElement.querySelector("select");
      expect(select).toBeTruthy();
    });

    it("should have form-select class", () => {
      createComponent();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.classList.contains("form-select")).toBe(true);
    });

    it("should have correct id", () => {
      createComponent();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.id).toBe(component["selectId"]);
    });

    it("should not be disabled by default", () => {
      createComponent();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(false);
    });

    it("should be disabled when disabled property is true", () => {
      createComponent({ disabled: true });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(true);
    });

    it("should be disabled when isDisabled is true", () => {
      createComponent();
      component.setDisabledState(true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(true);
    });

    it("should have required attribute when required is true", () => {
      createComponent({ required: true });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.required).toBe(true);
    });

    it("should not have required attribute when required is false", () => {
      createComponent({ required: false });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.required).toBe(false);
    });

    it("should have multiple attribute when multiple is true", () => {
      createComponent({ multiple: true });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.multiple).toBe(true);
    });

    it("should not have multiple attribute when multiple is false", () => {
      createComponent({ multiple: false });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.multiple).toBe(false);
    });
  });

  describe("Size Classes", () => {
    it("should apply form-select-sm class when size is sm", () => {
      createComponent({ size: "sm" });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.classList.contains("form-select-sm")).toBe(true);
    });

    it("should apply form-select-lg class when size is lg", () => {
      createComponent({ size: "lg" });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.classList.contains("form-select-lg")).toBe(true);
    });

    it("should not apply size class when size is undefined", () => {
      createComponent({ size: undefined });
      const select = fixture.nativeElement.querySelector("select");
      expect(select.classList.contains("form-select-sm")).toBe(false);
      expect(select.classList.contains("form-select-lg")).toBe(false);
    });
  });

  describe("Placeholder", () => {
    it("should render placeholder option when not multiple", () => {
      createComponent({ placeholder: "Select option", multiple: false });
      const placeholderOption = fixture.nativeElement.querySelector("option[value='']");
      expect(placeholderOption).toBeTruthy();
      expect(placeholderOption.textContent?.trim()).toBe("Select option");
    });

    it("should not render placeholder option when multiple is true", () => {
      createComponent({ placeholder: "Select option", multiple: true });
      const placeholderOption = fixture.nativeElement.querySelector("option[value='']");
      expect(placeholderOption).toBeNull();
    });

    it("should not render placeholder option when placeholder is empty", () => {
      createComponent({ placeholder: "", multiple: false });
      const placeholderOption = fixture.nativeElement.querySelector("option[value='']");
      expect(placeholderOption).toBeNull();
    });

    it("should allow placeholder option to be selected when value is null", () => {
      createComponent({ placeholder: "Select option", multiple: false });
      component.writeValue(null);
      fixture.detectChanges();
      const placeholderOption = fixture.nativeElement.querySelector("option[value='']") as HTMLOptionElement;
      // Placeholder option is not disabled, but should be selected when value is null
      expect(placeholderOption.selected).toBe(true);
    });

    it("should select placeholder option when value is null", () => {
      createComponent({ placeholder: "Select option", multiple: false, options: [] });
      component.writeValue(null);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      expect(select.value).toBe("");
    });
  });

  describe("Options Rendering", () => {
    it("should render all options", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements.length).toBe(3);
    });

    it("should render option labels correctly", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].textContent?.trim()).toBe("Option 1");
      expect(optionElements[1].textContent?.trim()).toBe("Option 2");
    });

    it("should set option values correctly", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].value).toBe("1");
      expect(optionElements[1].value).toBe("2");
    });

    it("should handle numeric option values", () => {
      const options: DropdownOption[] = [
        { value: 1, label: "One" },
        { value: 2, label: "Two" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].value).toBe("1");
      expect(optionElements[1].value).toBe("2");
    });

    it("should handle boolean option values", () => {
      const options: DropdownOption[] = [
        { value: true, label: "Yes" },
        { value: false, label: "No" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].value).toBe("true");
      expect(optionElements[1].value).toBe("false");
    });

    it("should disable option when option.disabled is true", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2", disabled: true }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].disabled).toBe(false);
      expect(optionElements[1].disabled).toBe(true);
    });

    it("should not disable option when option.disabled is false", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1", disabled: false }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].disabled).toBe(false);
    });

    it("should not disable option when option.disabled is undefined", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].disabled).toBe(false);
    });
  });

  describe("Single Selection", () => {
    it("should select option when value matches", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options, multiple: false });
      component.writeValue("2");
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      expect(select.value).toBe("2");
    });

    it("should select option with numeric value", () => {
      const options: DropdownOption[] = [
        { value: 1, label: "One" },
        { value: 2, label: "Two" }
      ];
      createComponent({ options, multiple: false });
      component.writeValue(2);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      expect(select.value).toBe("2");
    });

    it("should not select any option when value is null", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options, multiple: false, placeholder: "Select" });
      component.writeValue(null);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      // When value is null, placeholder option should be selected
      expect(select.value).toBe("");
    });

    it("should handle onChangeEvent in single mode", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options, multiple: false });
      const select = fixture.nativeElement.querySelector("select");
      select.value = "2";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();
      expect(component["value"]).toBe("2");
    });

    it("should convert string value back to original type", () => {
      const options: DropdownOption[] = [
        { value: 123, label: "Number" },
        { value: true, label: "Boolean" }
      ];
      createComponent({ options, multiple: false });
      const select = fixture.nativeElement.querySelector("select");
      select.value = "123";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();
      expect(component["value"]).toBe(123);
    });
  });

  describe("Multiple Selection", () => {
    it("should select multiple options when value is array", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" }
      ];
      createComponent({ options, multiple: true });
      component.writeValue(["1", "2"]);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions as HTMLCollectionOf<HTMLOptionElement>).map((opt: HTMLOptionElement) => opt.value);
      expect(selectedOptions).toContain("1");
      expect(selectedOptions).toContain("2");
      expect(selectedOptions).not.toContain("3");
    });

    it("should handle onChangeEvent in multiple mode", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" }
      ];
      createComponent({ options, multiple: true });
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;

      // Select multiple options
      const option1 = Array.from(select.options as HTMLCollectionOf<HTMLOptionElement>).find((opt: HTMLOptionElement) => opt.value === "1");
      const option2 = Array.from(select.options as HTMLCollectionOf<HTMLOptionElement>).find((opt: HTMLOptionElement) => opt.value === "2");
      if (option1) option1.selected = true;
      if (option2) option2.selected = true;

      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(component["value"]).toEqual(["1", "2"]);
    });

    it("should handle empty array in multiple mode", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options, multiple: true });
      component["value"] = [];
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions as HTMLCollectionOf<HTMLOptionElement>).map((opt: HTMLOptionElement) => opt.value);
      expect(selectedOptions.length).toBe(0);
    });

    it("should handle null value in multiple mode", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options, multiple: true });
      component["value"] = null;
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions as HTMLCollectionOf<HTMLOptionElement>).map((opt: HTMLOptionElement) => opt.value);
      expect(selectedOptions.length).toBe(0);
    });
  });

  describe("Event Emitters", () => {
    it("should emit valueChange on selection change", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options, multiple: false });
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      const select = fixture.nativeElement.querySelector("select");
      select.value = "2";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("2");
    });

    it("should emit selectionChange on selection change", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options, multiple: false });
      const spy = vi.fn();
      component.selectionChange.subscribe(spy);

      const select = fixture.nativeElement.querySelector("select");
      select.value = "2";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("2");
    });

    it("should emit focused event when select receives focus", () => {
      createComponent();
      const spy = vi.fn();
      component.focused.subscribe(spy);

      const select = fixture.nativeElement.querySelector("select");
      select.dispatchEvent(new FocusEvent("focus"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]?.[0]).toBeInstanceOf(FocusEvent);
    });

    it("should emit blurred event when select loses focus", () => {
      createComponent();
      const spy = vi.fn();
      component.blurred.subscribe(spy);

      const select = fixture.nativeElement.querySelector("select");
      select.dispatchEvent(new FocusEvent("blur"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0]?.[0]).toBeInstanceOf(FocusEvent);
    });

    it("should emit valueChange with array in multiple mode", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options, multiple: true });
      const spy = vi.fn();
      component.valueChange.subscribe(spy);

      const select = fixture.nativeElement.querySelector("select") as HTMLSelectElement;
      const option1 = Array.from(select.options as HTMLCollectionOf<HTMLOptionElement>).find((opt: HTMLOptionElement) => opt.value === "1");
      if (option1) option1.selected = true;
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith(["1"]);
    });
  });

  describe("ControlValueAccessor Implementation", () => {
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {
      formBuilder = TestBed.inject(FormBuilder);
    });

    const setupComponentWithFormControl = (controlValue: any = null, options: DropdownOption[] = []) => {
      formGroup = formBuilder.group({
        dropdownField: [controlValue]
      });

      fixture = TestBed.createComponent(CoreDropdownComponent);
      component = fixture.componentInstance;
      component.options = options;

      const control = formGroup.get("dropdownField")!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component["ngControl"] = mockNgControl;
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

    it("should integrate with FormControl", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      setupComponentWithFormControl("1", options);
      expect(component).toBeTruthy();
    });

    it("should write value to component", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      setupComponentWithFormControl("2", options);
      expect(component["value"]).toBe("2");
    });

    it("should write array value in multiple mode", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options, multiple: true });
      component.writeValue(["1", "2"]);
      expect(component["value"]).toEqual(["1", "2"]);
    });

    it("should handle null value", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options });
      component.writeValue(null);
      expect(component["value"]).toBeNull();
    });

    it("should handle undefined value", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options });
      component.writeValue(undefined);
      expect(component["value"]).toBeNull();
    });

    it("should update FormControl value when selection changes", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      setupComponentWithFormControl("1", options);

      const select = fixture.nativeElement.querySelector("select");
      select.value = "2";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(formGroup.get("dropdownField")?.value).toBe("2");
    });

    it("should call onChange callback when value changes", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options });
      const spy = vi.fn();
      component.registerOnChange(spy);

      const select = fixture.nativeElement.querySelector("select");
      select.value = "2";
      select.dispatchEvent(new Event("change"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith("2");
    });

    it("should call onTouched callback when select blurs", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      setupComponentWithFormControl("1", options);

      const control = formGroup.get("dropdownField")!;
      const spy = vi.fn();
      component.registerOnTouched(spy);

      const select = fixture.nativeElement.querySelector("select");
      select.dispatchEvent(new FocusEvent("blur"));
      fixture.detectChanges();

      expect(spy).toHaveBeenCalled();
      expect(control.touched).toBe(true);
    });

    it("should mark control as touched on blur", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      setupComponentWithFormControl("1", options);

      const control = formGroup.get("dropdownField")!;
      expect(control.touched).toBe(false);

      const select = fixture.nativeElement.querySelector("select");
      select.dispatchEvent(new FocusEvent("blur"));
      fixture.detectChanges();

      expect(control.touched).toBe(true);
    });

    it("should handle disabled state from FormControl", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      formGroup = formBuilder.group({
        dropdownField: [{ value: "1", disabled: true }]
      });

      fixture = TestBed.createComponent(CoreDropdownComponent);
      component = fixture.componentInstance;
      component.options = options;

      const control = formGroup.get("dropdownField")!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component["ngControl"] = mockNgControl;
      component.ngOnInit();
      component.setDisabledState(true);
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(true);
    });
  });

  describe("Validation States", () => {
    let formBuilder: FormBuilder;
    let formGroup: FormGroup;

    beforeEach(() => {
      formBuilder = TestBed.inject(FormBuilder);
    });

    const setupComponentWithValidation = (
      controlValue: any = null,
      validators: any[] = [],
      options: DropdownOption[] = []
    ) => {
      formGroup = formBuilder.group({
        dropdownField: [controlValue, validators]
      });

      fixture = TestBed.createComponent(CoreDropdownComponent);
      component = fixture.componentInstance;
      component.options = options;

      const control = formGroup.get("dropdownField")!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component["ngControl"] = mockNgControl;
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

    it("should apply is-invalid class when control is invalid and touched", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      setupComponentWithValidation(null, [Validators.required], options);

      const control = formGroup.get("dropdownField")!;
      control.markAsTouched();
      component["cdr"].markForCheck();
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector("select");
      expect(select.classList.contains("is-invalid")).toBe(true);
    });

    it("should apply is-valid class when control is valid and touched", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      formGroup = formBuilder.group({
        dropdownField: ["1", [Validators.required]]
      });

      fixture = TestBed.createComponent(CoreDropdownComponent);
      component = fixture.componentInstance;
      component.options = options;

      const control = formGroup.get("dropdownField")!;
      const mockNgControl = {
        control: control,
        valueAccessor: component,
        viewToModelUpdate: () => { }
      } as any;

      component["ngControl"] = mockNgControl;
      component.ngOnInit();

      component.registerOnChange((value: any) => {
        control.setValue(value, { emitEvent: false });
      });

      component.registerOnTouched(() => {
        control.markAsTouched();
      });

      component.writeValue("1");
      control.markAsTouched();
      fixture.detectChanges();

      const select = fixture.nativeElement.querySelector("select");
      expect(select.classList.contains("is-valid")).toBe(true);
    });

    it("should display error messages when control is invalid", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      setupComponentWithValidation(null, [Validators.required], options);

      const control = formGroup.get("dropdownField")!;
      control.markAsTouched();
      component["cdr"].markForCheck();
      fixture.detectChanges();

      const errorDiv = fixture.nativeElement.querySelector(".invalid-feedback");
      expect(errorDiv).toBeTruthy();
    });

    it("should not show errors when control is pristine and untouched", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      setupComponentWithValidation(null, [Validators.required], options);

      const errorDiv = fixture.nativeElement.querySelector(".invalid-feedback");
      expect(errorDiv).toBeNull();
    });
  });

  describe("setDisabledState", () => {
    it("should set isDisabled when setDisabledState is called", () => {
      createComponent();
      component.setDisabledState(true);
      expect(component["isDisabled"]).toBe(true);
    });

    it("should update select disabled state when setDisabledState is called", () => {
      createComponent();
      component.setDisabledState(true);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(true);
    });

    it("should enable select when setDisabledState is called with false", () => {
      createComponent();
      component.setDisabledState(true);
      component.setDisabledState(false);
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select");
      expect(select.disabled).toBe(false);
    });
  });

  describe("Default Values", () => {
    it("should return null as default for single mode", () => {
      createComponent({ multiple: false });
      const defaultValue = component["getDefaultValue"]();
      expect(defaultValue).toBeNull();
    });

    it("should return empty array as default for multiple mode", () => {
      createComponent({ multiple: true });
      const defaultValue = component["getDefaultValue"]();
      expect(defaultValue).toEqual([]);
    });

    it("should return default error message", () => {
      createComponent();
      const errorMessage = component["getDefaultErrorMessage"]();
      expect(errorMessage).toBe("Giá trị không hợp lệ.");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty options array", () => {
      createComponent({ options: [] });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements.length).toBe(0);
    });

    it("should handle options with same values", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" },
        { value: "1", label: "Option 1 Duplicate" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements.length).toBe(2);
    });

    it("should handle options with empty labels", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "" },
        { value: "2", label: "Option 2" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements[0].textContent?.trim()).toBe("");
      expect(optionElements[1].textContent?.trim()).toBe("Option 2");
    });

    it("should handle options with null values", () => {
      const options: DropdownOption[] = [
        { value: null, label: "Null Option" },
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements.length).toBe(2);
    });

    it("should handle options with undefined values", () => {
      const options: DropdownOption[] = [
        { value: undefined, label: "Undefined Option" },
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options });
      const optionElements = fixture.nativeElement.querySelectorAll("option:not([value=''])");
      expect(optionElements.length).toBe(2);
    });

    it("should handle very long option labels", () => {
      const longLabel = "A".repeat(1000);
      const options: DropdownOption[] = [
        { value: "1", label: longLabel }
      ];
      createComponent({ options });
      const optionElement = fixture.nativeElement.querySelector("option:not([value=''])");
      expect(optionElement.textContent?.trim()).toBe(longLabel);
    });

    it("should handle special characters in option labels", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option & < > \" ' with special chars" }
      ];
      createComponent({ options });
      const optionElement = fixture.nativeElement.querySelector("option:not([value=''])");
      expect(optionElement.textContent).toContain("Option");
    });

    it("should handle unicode characters in option labels", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "选项 1 🌍" }
      ];
      createComponent({ options });
      const optionElement = fixture.nativeElement.querySelector("option:not([value=''])");
      expect(optionElement.textContent?.trim()).toBe("选项 1 🌍");
    });

    it("should handle selection change with no options", () => {
      createComponent({ options: [] });
      const select = fixture.nativeElement.querySelector("select");
      expect(() => {
        select.dispatchEvent(new Event("change"));
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("should handle value that does not match any option", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options, multiple: false });
      component["value"] = "999";
      fixture.detectChanges();
      const select = fixture.nativeElement.querySelector("select");
      // Should not throw, but value might not be selected
      expect(select).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should set aria-invalid when control is invalid", () => {
      const options: DropdownOption[] = [
        { value: "1", label: "Option 1" }
      ];
      createComponent({ options, required: true });
      const select = fixture.nativeElement.querySelector("select");
      // Initially should not have aria-invalid
      expect(select.getAttribute("aria-invalid")).toBeNull();
    });

    it("should associate hint with select via aria-describedby", () => {
      createComponent({ hint: "Help text" });
      const select = fixture.nativeElement.querySelector("select");
      const hintId = component["selectId"] + "-hint";
      expect(select.getAttribute("aria-describedby")).toBe(hintId);
    });
  });
});
