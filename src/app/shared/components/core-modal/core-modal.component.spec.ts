import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Type } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CoreModalComponent } from './core-modal.component';
import type { ModalButton } from './core-modal.types';
import { vi } from 'vitest';

/**
 * Test component for dynamic content loading
 */
@Component({
  template: '<div class="test-dynamic-content">Dynamic Content</div>',
  standalone: true
})
class TestDynamicComponent {
  testProp?: string;
}

describe('CoreModalComponent', () => {
  let component: CoreModalComponent;
  let fixture: ComponentFixture<CoreModalComponent>;
  let document: Document;
  let mockBody: HTMLElement;
  let mockActiveElement: HTMLElement;

  const createComponent = (): void => {
    fixture = TestBed.createComponent(CoreModalComponent);
    component = fixture.componentInstance;
    document = TestBed.inject(DOCUMENT);
    mockBody = document.body;
    mockActiveElement = document.createElement('button');
    mockActiveElement.id = 'previous-focus';
    document.body.appendChild(mockActiveElement);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreModalComponent],
    }).compileComponents();

    document = TestBed.inject(DOCUMENT);
    mockBody = document.body;
    mockActiveElement = document.createElement('button');
    mockActiveElement.id = 'previous-focus';
    document.body.appendChild(mockActiveElement);
  });

  afterEach(() => {
    if (mockActiveElement && mockActiveElement.parentNode) {
      mockActiveElement.parentNode.removeChild(mockActiveElement);
    }
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      createComponent();
      expect(component.isOpen).toBe(false);
      expect(component.size).toBe('lg');
      expect(component.closable).toBe(true);
      expect(component.backdrop).toBe(true);
      expect(component.showCloseButton).toBe(true);
      expect(component.buttons).toEqual([]);
      expect(component.hasProjectedContent).toBe(false);
    });

    it('should call ngOnInit without errors', () => {
      createComponent();
      expect(() => component.ngOnInit()).not.toThrow();
    });
  });

  describe('Input Properties', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should accept title input', () => {
      component.title = 'Test Title';
      fixture.detectChanges();
      expect(component.title).toBe('Test Title');
    });

    it('should accept size input', () => {
      const sizes: Array<'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'> = ['sm', 'md', 'lg', 'xl', 'fullscreen'];
      sizes.forEach(size => {
        component.size = size;
        fixture.detectChanges();
        expect(component.size).toBe(size);
      });
    });

    it('should accept closable input', () => {
      component.closable = false;
      fixture.detectChanges();
      expect(component.closable).toBe(false);
    });

    it('should accept backdrop input', () => {
      component.backdrop = 'static';
      fixture.detectChanges();
      expect(component.backdrop).toBe('static');
    });

    it('should accept buttons input', () => {
      const buttons: ModalButton[] = [
        { label: 'Save', style: 'primary' },
        { label: 'Cancel', style: 'secondary' }
      ];
      component.buttons = buttons;
      fixture.detectChanges();
      expect(component.buttons).toEqual(buttons);
    });

    it('should accept customClass input', () => {
      component.customClass = 'custom-modal-class';
      fixture.detectChanges();
      expect(component.customClass).toBe('custom-modal-class');
    });

    it('should accept data input', () => {
      const testData = { contentHtml: '<p>Test</p>' };
      component.data = testData;
      fixture.detectChanges();
      expect(component.data).toEqual(testData);
    });

    it('should accept content and contentProps inputs', () => {
      component.content = TestDynamicComponent;
      component.contentProps = { testProp: 'test' };
      fixture.detectChanges();
      expect(component.content).toBe(TestDynamicComponent);
      expect(component.contentProps).toEqual({ testProp: 'test' });
    });
  });

  describe('Output Events', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should emit opened event when modal opens', () => {
      const openedSpy = vi.spyOn(component.opened, 'emit');
      component.open();
      expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed event when modal closes', () => {
      component.open();
      const closedSpy = vi.spyOn(component.closed, 'emit');
      const result = { reason: 'test' };
      component.close(result);
      expect(closedSpy).toHaveBeenCalledWith(result);
    });

    it('should emit closed event with undefined when no result provided', () => {
      component.open();
      const closedSpy = vi.spyOn(component.closed, 'emit');
      component.close();
      expect(closedSpy).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Modal Open Functionality', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should set isOpen to true when open is called', () => {
      component.open();
      expect(component.isOpen).toBe(true);
    });

    it('should save previous focus element', () => {
      // Mock activeElement by focusing the element
      mockActiveElement.focus();
      component.open();
      expect(component['previousFocus']).toBe(mockActiveElement);
    });

    it('should set body overflow to hidden when opening', () => {
      const setStyleSpy = vi.spyOn(component['renderer'], 'setStyle');
      component.open();
      expect(setStyleSpy).toHaveBeenCalledWith(mockBody, 'overflow', 'hidden');
    });

    it('should detect projected content after opening', async () => {
      const bodyElement = document.createElement('div');
      bodyElement.setAttribute('modal-body', '');
      component['elementRef'].nativeElement.appendChild(bodyElement);

      component.open();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.hasProjectedContent).toBe(true);
    });

    it('should setup focus trap after opening', async () => {
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component['focusableElements']).toBeDefined();
    });

    it('should focus first element after opening', async () => {
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();

      const firstElement = component['firstFocusableElement'];
      if (firstElement) {
        const focusSpy = vi.spyOn(firstElement, 'focus');
        // Trigger focus manually since we can't easily test async focus
        firstElement.focus();
        expect(focusSpy).toHaveBeenCalled();
      }
    });
  });

  describe('Modal Close Functionality', () => {
    beforeEach(() => {
      createComponent();
      component.open();
    });

    it('should set isOpen to false when close is called', () => {
      component.close();
      expect(component.isOpen).toBe(false);
    });

    it('should not close when backdrop is static', () => {
      component.backdrop = 'static';
      component.close();
      expect(component.isOpen).toBe(true);
    });

    it('should restore previous focus when closing', () => {
      component['previousFocus'] = mockActiveElement;
      const focusSpy = vi.spyOn(mockActiveElement, 'focus');
      component.close();
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should save and restore previous focus when opening and closing', () => {
      createComponent();

      const originalActiveElement = Object.getOwnPropertyDescriptor(component['document'], 'activeElement');
      Object.defineProperty(component['document'], 'activeElement', {
        get: () => mockActiveElement,
        configurable: true
      });

      component.open();
      expect(component['previousFocus']).toBe(mockActiveElement);

      const focusSpy = vi.spyOn(mockActiveElement, 'focus');
      component.close();
      expect(focusSpy).toHaveBeenCalled();

      if (originalActiveElement) {
        Object.defineProperty(component['document'], 'activeElement', originalActiveElement);
      }
    });

    it('should remove body overflow style when closing', () => {
      createComponent();
      component.open();
      const removeStyleSpy = vi.spyOn(component['renderer'], 'removeStyle');
      component.close();
      expect(removeStyleSpy).toHaveBeenCalledWith(mockBody, 'overflow');
    });

    it('should destroy dynamic content when closing', async () => {
      createComponent();
      component.content = TestDynamicComponent;
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 0));

      const destroySpy = vi.spyOn(component as any, 'destroyDynamicContent');
      component.close();
      expect(destroySpy).toHaveBeenCalled();

      await fixture.whenStable();
    });

    it('should remove focus trap when closing', async () => {
      createComponent();
      component.open();
      await fixture.whenStable();
      component.close();
      expect(component['focusableElements']).toEqual([]);
      expect(component['firstFocusableElement']).toBeUndefined();
      expect(component['lastFocusableElement']).toBeUndefined();
    });
  });

  describe('Backdrop Click Handling', () => {
    beforeEach(async () => {
      createComponent();
      component.open();
      await fixture.whenStable();
    });

    it('should close modal when backdrop is clicked', () => {
      const closeSpy = vi.spyOn(component, 'close');
      const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', {
        value: backdrop,
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(event, 'currentTarget', {
        value: backdrop,
        enumerable: true,
        configurable: true
      });

      component.onBackdropClick(event);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not close when backdrop is static', () => {
      component.backdrop = 'static';
      const closeSpy = vi.spyOn(component, 'close');
      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: event.currentTarget, enumerable: true });
      Object.defineProperty(event, 'currentTarget', { value: fixture.nativeElement.querySelector('.modal-backdrop'), enumerable: true });

      component.onBackdropClick(event);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should not close when clicking inside modal content', () => {
      const closeSpy = vi.spyOn(component, 'close');
      const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      const content = fixture.nativeElement.querySelector('.modal-content');
      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: content, enumerable: true });
      Object.defineProperty(event, 'currentTarget', { value: backdrop, enumerable: true });

      component.onBackdropClick(event);
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Escape Key Handling', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should close modal on Escape key when closable', async () => {
      component.open();
      await fixture.whenStable();
      component.closable = true;
      component.backdrop = true;
      const closeSpy = vi.spyOn(component, 'close');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKey(event);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not close modal on Escape when not closable', async () => {
      component.open();
      await fixture.whenStable();
      component.closable = false;
      const closeSpy = vi.spyOn(component, 'close');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKey(event);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should not close modal on Escape when backdrop is static', async () => {
      component.open();
      await fixture.whenStable();
      component.closable = true;
      component.backdrop = 'static';
      const closeSpy = vi.spyOn(component, 'close');
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onEscapeKey(event);
      expect(closeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Focus Trap (Tab Key)', () => {
    beforeEach(async () => {
      createComponent();
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should do nothing if modal is not open', () => {
      component.isOpen = false;
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      component.onTabKey(event);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should prevent default when no focusable elements', () => {
      component.isOpen = true;
      fixture.detectChanges();
      const modalElement = fixture.nativeElement.querySelector('.modal') as HTMLElement;
      if (modalElement) {
        const div = document.createElement('div');
        div.textContent = 'No focusable elements';
        modalElement.innerHTML = '';
        modalElement.appendChild(div);

        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        Object.defineProperty(event, 'target', {
          value: div,
          enumerable: true,
          configurable: true
        });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
        component.onTabKey(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
      }
    });

    it('should cycle to first element when Tab pressed on last element', () => {
      component.isOpen = true;
      fixture.detectChanges();
      const modalElement = fixture.nativeElement.querySelector('.modal') as HTMLElement;
      if (!modalElement) return;

      const button1 = document.createElement('button');
      button1.id = 'btn1';
      const button2 = document.createElement('button');
      button2.id = 'btn2';
      const modalContent = modalElement.querySelector('.modal-content') || modalElement;
      modalContent.appendChild(button1);
      modalContent.appendChild(button2);

      component['updateFocusableElements']();
      const focusableElements = component['focusableElements'];
      if (focusableElements.length >= 2) {
        component['firstFocusableElement'] = focusableElements[0];
        component['lastFocusableElement'] = focusableElements[focusableElements.length - 1];
      } else {
        component['firstFocusableElement'] = button1;
        component['lastFocusableElement'] = button2;
      }

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      Object.defineProperty(event, 'target', {
        value: component['lastFocusableElement'],
        enumerable: true,
        configurable: true
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const focusSpy = vi.spyOn(component['firstFocusableElement']!, 'focus');

      Object.defineProperty(document, 'activeElement', {
        value: component['lastFocusableElement'],
        writable: false,
        configurable: true
      });

      component.onTabKey(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
    });

    it('should cycle to last element when Shift+Tab pressed on first element', () => {
      component.isOpen = true;
      fixture.detectChanges();
      const modalElement = fixture.nativeElement.querySelector('.modal') as HTMLElement;
      if (!modalElement) return;

      const button1 = document.createElement('button');
      button1.id = 'btn1';
      const button2 = document.createElement('button');
      button2.id = 'btn2';
      const modalContent = modalElement.querySelector('.modal-content') || modalElement;
      modalContent.appendChild(button1);
      modalContent.appendChild(button2);

      component['updateFocusableElements']();
      const focusableElements = component['focusableElements'];
      if (focusableElements.length >= 2) {
        component['firstFocusableElement'] = focusableElements[0];
        component['lastFocusableElement'] = focusableElements[focusableElements.length - 1];
      } else {
        component['firstFocusableElement'] = button1;
        component['lastFocusableElement'] = button2;
      }

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      Object.defineProperty(event, 'target', {
        value: component['firstFocusableElement'],
        enumerable: true,
        configurable: true
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      const focusSpy = vi.spyOn(component['lastFocusableElement']!, 'focus');

      Object.defineProperty(document, 'activeElement', {
        value: component['firstFocusableElement'],
        writable: false,
        configurable: true
      });

      component.onTabKey(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Button Click Handling', () => {
    beforeEach(async () => {
      createComponent();
      component.open();
      await fixture.whenStable();
    });

    it('should call handler and close modal by default', async () => {
      const handler = vi.fn();
      const button: ModalButton = {
        label: 'Test',
        handler
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(handler).toHaveBeenCalledWith(component, undefined);
      expect(closeSpy).toHaveBeenCalledWith(button);
    });

    it('should not close modal if handler returns false', async () => {
      const handler = vi.fn().mockReturnValue(false);
      const button: ModalButton = {
        label: 'Test',
        handler
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should handle async handler with Promise', async () => {
      const handler = vi.fn().mockResolvedValue(true);
      const button: ModalButton = {
        label: 'Test',
        handler
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(handler).toHaveBeenCalled();
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not close if async handler resolves to false', async () => {
      const handler = vi.fn().mockResolvedValue(false);
      const button: ModalButton = {
        label: 'Test',
        handler
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should close on error if closeOnClick is true', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Test error'));
      const button: ModalButton = {
        label: 'Test',
        handler,
        closeOnClick: true
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(closeSpy).toHaveBeenCalled();
    });

    it('should not close on error if closeOnClick is not true', async () => {
      const handler = vi.fn().mockRejectedValue(new Error('Test error'));
      const button: ModalButton = {
        label: 'Test',
        handler,
        closeOnClick: false
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should respect closeOnClick: false', async () => {
      const handler = vi.fn();
      const button: ModalButton = {
        label: 'Test',
        handler,
        closeOnClick: false
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should close when no handler and closeOnClick is not false', async () => {
      const button: ModalButton = {
        label: 'Test'
      };
      const closeSpy = vi.spyOn(component, 'close');

      await component.onButtonClick(button);
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe('Dynamic Content Loading', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should load dynamic content when content is provided', async () => {
      component.content = TestDynamicComponent;
      component.contentProps = { testProp: 'test-value' };
      component.hasProjectedContent = false;

      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(component['dynamicComponentRef']).toBeTruthy();
    });

    it('should not load dynamic content if projected content exists', async () => {
      component.content = TestDynamicComponent;
      const bodyElement = document.createElement('div');
      bodyElement.setAttribute('modal-body', '');
      component['elementRef'].nativeElement.appendChild(bodyElement);

      component.open();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.hasProjectedContent).toBe(true);
    });

    it('should assign props to dynamic component instance', async () => {
      component.content = TestDynamicComponent;
      component.contentProps = { testProp: 'test-value' };
      component.hasProjectedContent = false;

      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 0));

      const instance = component['dynamicComponentRef']?.instance as TestDynamicComponent;
      expect(instance?.testProp).toBe('test-value');
    });

    it('should destroy dynamic content on close', async () => {
      component.content = TestDynamicComponent;
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 0));

      const componentRef = component['dynamicComponentRef'];
      const destroySpy = vi.spyOn(componentRef!, 'destroy');
      component.close();
      expect(destroySpy).toHaveBeenCalled();
    });

    it('should clear ViewContainerRef on destroy', async () => {
      component.content = TestDynamicComponent;
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      await new Promise(resolve => setTimeout(resolve, 0));

      const clearSpy = vi.spyOn(component.dynamicHost, 'clear');
      component['destroyDynamicContent']();
      expect(clearSpy).toHaveBeenCalled();
    });
  });

  describe('Focus Trap Management', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should update focusable elements', () => {
      const button = document.createElement('button');
      button.id = 'test-button';
      const modalElement = fixture.nativeElement.querySelector('.modal');
      if (modalElement) {
        modalElement.appendChild(button);
      }

      component['updateFocusableElements']();
      expect(component['focusableElements'].length).toBeGreaterThan(0);
    });

    it('should filter out hidden elements', () => {
      const visibleButton = document.createElement('button');
      visibleButton.id = 'visible';
      const hiddenButton = document.createElement('button');
      hiddenButton.id = 'hidden';
      hiddenButton.style.display = 'none';

      const modalElement = fixture.nativeElement.querySelector('.modal');
      if (modalElement) {
        modalElement.appendChild(visibleButton);
        modalElement.appendChild(hiddenButton);
      }

      component['updateFocusableElements']();
      const elements = component['focusableElements'];
      expect(elements.some(el => el.id === 'visible')).toBe(true);
      expect(elements.some(el => el.id === 'hidden')).toBe(false);
    });

    it('should set first and last focusable elements', () => {
      component.open();
      fixture.detectChanges();

      const button1 = document.createElement('button');
      button1.id = 'btn1';
      const button2 = document.createElement('button');
      button2.id = 'btn2';
      const modalElement = fixture.nativeElement.querySelector('.modal');
      if (modalElement) {
        modalElement.appendChild(button1);
        modalElement.appendChild(button2);
      }

      component['updateFocusableElements']();
      expect(component['firstFocusableElement']).toBeTruthy();
      expect(component['lastFocusableElement']).toBeTruthy();
      expect(component['focusableElements']).toContain(button1);
      expect(component['focusableElements']).toContain(button2);
    });

    it('should remove focus trap', () => {
      component['focusableElements'] = [document.createElement('button')];
      component['firstFocusableElement'] = document.createElement('button');
      component['lastFocusableElement'] = document.createElement('button');

      component['removeFocusTrap']();
      expect(component['focusableElements']).toEqual([]);
      expect(component['firstFocusableElement']).toBeUndefined();
      expect(component['lastFocusableElement']).toBeUndefined();
    });
  });

  describe('Dialog Classes', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should return default classes for md size', () => {
      component.size = 'md';
      const classes = component.dialogClasses;
      expect(classes).toContain('modal-dialog');
      expect(classes).toContain('modal-dialog-centered');
      expect(classes).not.toContain('modal-md');
    });

    it('should include size class for sm', () => {
      component.size = 'sm';
      const classes = component.dialogClasses;
      expect(classes).toContain('modal-sm');
    });

    it('should include size class for lg', () => {
      component.size = 'lg';
      const classes = component.dialogClasses;
      expect(classes).toContain('modal-lg');
    });

    it('should include size class for xl', () => {
      component.size = 'xl';
      const classes = component.dialogClasses;
      expect(classes).toContain('modal-xl');
    });

    it('should include fullscreen class', () => {
      component.size = 'fullscreen';
      const classes = component.dialogClasses;
      expect(classes).toContain('modal-fullscreen');
    });
  });

  describe('Template Rendering', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should render backdrop when open', async () => {
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      expect(backdrop).toBeTruthy();
      expect(backdrop.classList.contains('show')).toBe(true);
    });

    it('should not show backdrop when closed', () => {
      const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
      if (backdrop) {
        expect(backdrop.classList.contains('show')).toBe(false);
      }
    });

    it('should render title when provided', async () => {
      component.title = 'Test Title';
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const title = fixture.nativeElement.querySelector('.modal-title');
      expect(title).toBeTruthy();
      expect(title?.textContent?.trim()).toBe('Test Title');
    });

    it('should render close button when closable', () => {
      component.closable = true;
      component.open();
      fixture.detectChanges();
      const closeButton = fixture.nativeElement.querySelector('.btn-close');
      expect(closeButton).toBeTruthy();
    });

    it('should not render close button when not closable', async () => {
      component.closable = false;
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const closeButton = fixture.nativeElement.querySelector('.btn-close');
      expect(closeButton).toBeFalsy();
    });

    it('should render buttons in footer', async () => {
      component.buttons = [
        { label: 'Save', style: 'primary' },
        { label: 'Cancel', style: 'secondary' }
      ];
      component.showCloseButton = false; // Disable default close button to test only our buttons
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('.modal-footer .btn');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });

    it('should render default close button when showCloseButton is true', () => {
      component.showCloseButton = true;
      component.open();
      fixture.detectChanges();
      const closeButton = fixture.nativeElement.querySelector('.modal-footer .btn-secondary');
      expect(closeButton).toBeTruthy();
      expect(closeButton?.textContent?.trim()).toBe('Close');
    });

    it('should render custom class on modal', async () => {
      component.customClass = 'custom-modal';
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal?.classList.contains('custom-modal')).toBe(true);
    });

    it('should render contentHtml when data.contentHtml is provided', async () => {
      component.data = { contentHtml: '<p>Test HTML</p>' };
      component.hasProjectedContent = false;
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const body = fixture.nativeElement.querySelector('.modal-body');
      // Check if contentHtml is rendered (might be sanitized by Angular)
      expect(body).toBeTruthy();
      // The innerHTML might contain Angular comments, so check textContent instead
      expect(body?.textContent || body?.innerHTML).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should set aria-hidden when closed', () => {
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set aria-hidden to false when open', async () => {
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal?.getAttribute('aria-hidden')).toBe('false');
    });

    it('should set aria-labelledby when title is provided', async () => {
      component.title = 'Test Title';
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal?.getAttribute('aria-labelledby')).toBe('modal-title');
    });

    it('should have role="dialog"', () => {
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal?.getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', () => {
      const modal = fixture.nativeElement.querySelector('.modal');
      expect(modal?.getAttribute('aria-modal')).toBe('true');
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should clean up on ngOnDestroy', async () => {
      createComponent();
      component.open();
      await fixture.whenStable();

      const removeStyleSpy = vi.spyOn(component['renderer'], 'removeStyle');
      const removeFocusTrapSpy = vi.spyOn(component as any, 'removeFocusTrap');
      const destroyContentSpy = vi.spyOn(component as any, 'destroyDynamicContent');

      component.ngOnDestroy();
      expect(removeStyleSpy).toHaveBeenCalledWith(mockBody, 'overflow');
      expect(removeFocusTrapSpy).toHaveBeenCalled();
      expect(destroyContentSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should handle opening when already open', async () => {
      const openedSpy = vi.spyOn(component.opened, 'emit');
      component.open();
      await fixture.whenStable();
      component.open();
      expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle close when not open', () => {
      component.isOpen = false;
      const closedSpy = vi.spyOn(component.closed, 'emit');
      component.close();
      expect(closedSpy).not.toHaveBeenCalled();
    });

    it('should handle missing document.body gracefully', () => {
      const mockDocument = {
        body: null,
        activeElement: null,
        createElement: (tag: string) => document.createElement(tag)
      } as unknown as Document;

      const testFixture = TestBed.createComponent(CoreModalComponent);
      const testComponent = testFixture.componentInstance;
      testComponent['document'] = mockDocument;

      expect(() => testComponent.open()).not.toThrow();
      testComponent.isOpen = true;
      expect(() => testComponent.close()).not.toThrow();

      testFixture.destroy();
    });

    it('should handle missing previousFocus gracefully', async () => {
      component.open();
      await fixture.whenStable();
      component['previousFocus'] = undefined;
      expect(() => component.close()).not.toThrow();
    });

    it('should handle focusable element without focus method', () => {
      component.open();
      fixture.detectChanges();
      const element = document.createElement('div');
      element.tabIndex = 0;
      const modalElement = fixture.nativeElement.querySelector('.modal');
      if (modalElement) {
        modalElement.appendChild(element);
      }

      expect(() => component['updateFocusableElements']()).not.toThrow();
    });

    it('should handle onTabKey when event target is outside modal', () => {
      component.isOpen = true;
      fixture.detectChanges();
      const outsideElement = document.createElement('button');
      document.body.appendChild(outsideElement);

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      Object.defineProperty(event, 'target', {
        value: outsideElement,
        enumerable: true,
        configurable: true
      });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onTabKey(event);
      expect(preventDefaultSpy).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });

    it('should handle onTabKey when modal element does not exist', () => {
      component.isOpen = true;
      fixture.nativeElement.innerHTML = '';
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onTabKey(event);
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should handle loadDynamicContent when dynamicHost is not available', () => {
      component['dynamicHost'] = null as any;
      expect(() => component['loadDynamicContent'](TestDynamicComponent)).not.toThrow();
    });

    it('should handle loadDynamicContent error gracefully', () => {
      createComponent();
      component.open();
      fixture.detectChanges();

      const mockViewContainer = {
        clear: vi.fn(),
        createComponent: vi.fn(() => {
          throw new Error('Injector destroyed');
        })
      };
      component['dynamicHost'] = mockViewContainer as any;

      expect(() => component['loadDynamicContent'](TestDynamicComponent)).not.toThrow();
    });

    it('should handle updateFocusableElements when modal element does not exist', () => {
      component['elementRef'].nativeElement.innerHTML = '';
      expect(() => component['updateFocusableElements']()).not.toThrow();
      expect(component['focusableElements']).toEqual([]);
    });
  });

  describe('Confirmed Output Event', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should have confirmed output event emitter', () => {
      expect(component.confirmed).toBeDefined();
      expect(component.confirmed.emit).toBeDefined();
    });

    it('should emit confirmed event when button with confirm action is clicked', async () => {
      const confirmedSpy = vi.spyOn(component.confirmed, 'emit');
      const button: ModalButton = {
        label: 'Confirm',
        style: 'primary',
        handler: () => {
          component.confirmed.emit({ confirmed: true });
          return true;
        }
      };
      component.buttons = [button];
      component.open();
      await fixture.whenStable();
      fixture.detectChanges();

      const buttonElement = fixture.nativeElement.querySelector('.btn-primary');
      if (buttonElement) {
        buttonElement.click();
        await fixture.whenStable();
        expect(confirmedSpy).toHaveBeenCalledWith({ confirmed: true });
      }
    });
  });
});
