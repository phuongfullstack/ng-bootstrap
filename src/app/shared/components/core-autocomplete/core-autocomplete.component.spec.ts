import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { CoreAutocompleteComponent, AutoCompleteOption } from "./core-autocomplete.component";

describe("CoreAutocompleteComponent", () => {
  let fixture: ComponentFixture<CoreAutocompleteComponent>;
  let component: CoreAutocompleteComponent;
  let formBuilder: FormBuilder;

  const sampleOptions: AutoCompleteOption[] = [
    { value: 1, label: "Apple" },
    { value: 2, label: "Banana" },
    { value: 3, label: "Cherry" },
    { value: 4, label: "Apricot", disabled: true },
    { value: 5, label: "Blueberry" }
  ];

  const createComponent = (inputs: Partial<CoreAutocompleteComponent> = {}): void => {
    fixture = TestBed.createComponent(CoreAutocompleteComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreAutocompleteComponent, ReactiveFormsModule]
    }).compileComponents();
    formBuilder = TestBed.inject(FormBuilder);
  });

  describe("Initialization", () => {
    it("should create component and generate id with prefix", () => {
      createComponent();
      expect(component).toBeTruthy();
      expect((component as any).generatedId).toContain("core-autocomplete-");
    });
  });

  describe("Display and selection", () => {
    it("should render label/hint/required", () => {
      createComponent({ label: "Search", hint: "Type to search", required: true });
      const label = fixture.nativeElement.querySelector("label");
      const hint = fixture.nativeElement.querySelector(".form-text");
      expect(label.textContent).toContain("Search");
      expect(hint.textContent).toContain("Type to search");
      expect(label.querySelector(".text-danger")).toBeTruthy();
    });

    it("should reflect value in input when writeValue matches option", () => {
      createComponent({ options: sampleOptions });
      component.writeValue(2);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.value).toBe("Banana");
    });

    it("should allow free text writeValue when option not found", () => {
      createComponent({ allowFreeText: true, options: sampleOptions });
      component.writeValue("Custom");
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      expect(input.value).toBe("Custom");
    });
  });

  describe("Search and filtering", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should filter options (case-insensitive, skip disabled, respect maxResults)", () => {
      createComponent({ options: sampleOptions, maxResults: 2, debounceTime: 0 });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.value = "a";
      input.dispatchEvent(new Event("input"));
      vi.runAllTimers();
      fixture.detectChanges();

      expect(component["filteredOptions"].map(o => o.label)).toEqual(["Apple", "Banana"]);
      expect(component["isDropdownOpen"]).toBe(true);
    });

    it("should respect caseSensitive search", () => {
      createComponent({ options: sampleOptions, caseSensitive: true, debounceTime: 0 });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.value = "a";
      input.dispatchEvent(new Event("input"));
      vi.runAllTimers();
      fixture.detectChanges();

      // lower "a" matches only labels containing lower "a"
      expect(component["filteredOptions"].map(o => o.label)).toEqual(["Banana"]);
    });

    it("should not search when below minChars", () => {
      createComponent({ options: sampleOptions, minChars: 2, debounceTime: 0 });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.value = "a";
      input.dispatchEvent(new Event("input"));
      vi.runAllTimers();
      fixture.detectChanges();

      expect(component["isDropdownOpen"]).toBe(false);
      expect(component["filteredOptions"].length).toBe(0);
    });
  });

  describe("Selecting, clearing, free text", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should select option and emit events", () => {
      createComponent({ options: sampleOptions, debounceTime: 0 });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      const selectedSpy = vi.fn();
      const valueSpy = vi.fn();
      component.selected.subscribe(selectedSpy);
      component.valueChange.subscribe(valueSpy);

      input.value = "Ban";
      input.dispatchEvent(new Event("input"));
      vi.runAllTimers();
      fixture.detectChanges();

      const option = component["filteredOptions"][0];
      component["selectOption"](option);
      fixture.detectChanges();

      expect(selectedSpy).toHaveBeenCalledWith(option);
      expect(valueSpy).toHaveBeenCalledWith(option.value);
      expect(component["displayValue"]).toBe(option.label);
    });

    it("should clear input and emit cleared", () => {
      createComponent({ options: sampleOptions });
      const clearedSpy = vi.fn();
      component.cleared.subscribe(clearedSpy);
      component["displayValue"] = "Test";
      component["value"] = "Test";

      component["clearInput"]();
      fixture.detectChanges();

      expect(component["displayValue"]).toBe("");
      expect(component["value"]).toBeNull();
      expect(clearedSpy).toHaveBeenCalled();
    });

    it("should allow free text input and emit valueChange", () => {
      createComponent({ allowFreeText: true, debounceTime: 0 });
      const valueSpy = vi.fn();
      component.valueChange.subscribe(valueSpy);
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.value = "custom text";
      input.dispatchEvent(new Event("input"));
      vi.runAllTimers();
      fixture.detectChanges();

      expect(component["value"]).toBe("custom text");
      expect(valueSpy).toHaveBeenCalledWith("custom text");
    });
  });

  describe("Keyboard navigation", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("should open dropdown on ArrowDown when closed", () => {
      createComponent({ options: sampleOptions, debounceTime: 0, minChars: 0 });
      const input = fixture.nativeElement.querySelector("input") as HTMLInputElement;
      input.value = "a";
      input.dispatchEvent(new Event("input"));
      vi.runAllTimers();
      fixture.detectChanges();

      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
      input.dispatchEvent(event);
      vi.runAllTimers();
      fixture.detectChanges();

      expect(component["isDropdownOpen"]).toBe(true);
    });
  });

  describe("Outside click & blur", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("should close dropdown on outside click", () => {
      createComponent({ options: sampleOptions, debounceTime: 0, minChars: 0 });
      component["isDropdownOpen"] = true;
      document.dispatchEvent(new Event("click"));
      vi.runAllTimers();
      fixture.detectChanges();
      expect(component["isDropdownOpen"]).toBe(false);
    });

    it("should clear value on blur when not allowFreeText and no selection", () => {
      createComponent({ allowFreeText: false });
      component["displayValue"] = "temp";
      component["value"] = "temp";
      component["onBlur"](new FocusEvent("blur"));
      vi.advanceTimersByTime(250);
      fixture.detectChanges();
      expect(component["value"]).toBeNull();
      expect(component["displayValue"]).toBe("");
    });
  });

  describe("Reactive forms integration", () => {
    let formGroup: FormGroup;
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const setupWithControl = (value: any = null): void => {
      formGroup = formBuilder.group({
        search: [value]
      });

      fixture = TestBed.createComponent(CoreAutocompleteComponent);
      component = fixture.componentInstance;
      (component as any).ngControl = { control: formGroup.get("search"), valueAccessor: component } as any;
      component.ngOnInit();
      component.registerOnChange((val: any) => formGroup.get("search")?.setValue(val, { emitEvent: false }));
      component.registerOnTouched(() => formGroup.get("search")?.markAsTouched());
      component.writeValue(value);
      fixture.detectChanges();
    };

    it("should update FormControl when option selected", () => {
      setupWithControl();
      component.options = sampleOptions;
      component["selectOption"](sampleOptions[1]);
      fixture.detectChanges();
      expect(formGroup.get("search")?.value).toBe(2);
    });

    it("should mark control touched on blur", () => {
      setupWithControl();
      component["onBlur"](new FocusEvent("blur"));
      vi.advanceTimersByTime(250);
      fixture.detectChanges();
      expect(formGroup.get("search")?.touched).toBe(true);
    });
  });

  describe("Public APIs", () => {
    it("should update options dynamically and re-run search", () => {
      createComponent({ options: [], debounceTime: 0 });
      component["displayValue"] = "Ap";
      component["isDropdownOpen"] = true;
      component.updateOptions(sampleOptions);
      fixture.detectChanges();
      expect(component["filteredOptions"].length).toBeGreaterThan(0);
    });

    it("should set loading state", () => {
      createComponent();
      component.setLoading(true);
      expect(component["isLoading"]).toBe(true);
    });
  });
});
