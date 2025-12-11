import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreButtonComponent } from './core-button.component';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('CoreButtonComponent', () => {
  let fixture: ComponentFixture<CoreButtonComponent>;
  let component: CoreButtonComponent;

  const getButton = () => fixture.debugElement.query(By.css('button'));
  const flushInputs = (inputs: Partial<CoreButtonComponent>) => {
    Object.entries(inputs).forEach(([key, value]) => {
      fixture.componentRef.setInput(key as keyof CoreButtonComponent, value as any);
    });
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CoreButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('classes & states', () => {
    it('should render default primary button', () => {
      const btn = getButton().nativeElement as HTMLButtonElement;
      expect(btn.className).toContain('btn');
      expect(btn.className).toContain('btn-primary');
      expect(btn.disabled).toBe(false);
    });

    it('should apply outline variant', () => {
      flushInputs({ outline: true, variant: 'success' });
      const btn = getButton().nativeElement as HTMLButtonElement;
      expect(btn.className).toContain('btn-outline-success');
    });

    it('should apply size, block, rounded and circle styles', () => {
      flushInputs({ size: 'lg', block: true, rounded: true });
      const btn = getButton().nativeElement as HTMLButtonElement;
      expect(btn.className).toContain('btn-lg');
      expect(btn.className).toContain('w-100');
      expect(btn.className).toContain('rounded-pill');

      flushInputs({ rounded: false, roundedCircle: true });
      expect(btn.className).toContain('rounded-circle');
    });

    it('should append custom class', () => {
      flushInputs({ customClass: 'my-custom' });
      const btn = getButton().nativeElement as HTMLButtonElement;
      expect(btn.className).toContain('my-custom');
    });

    it('should disable when disabled or loading', () => {
      flushInputs({ disabled: true });
      expect(getButton().nativeElement.disabled).toBe(true);

      flushInputs({ disabled: false, loading: true });
      expect(getButton().nativeElement.disabled).toBe(true);
    });
  });

  describe('icon and spinner rendering', () => {
    it('should render left icon when provided', () => {
      flushInputs({ icon: 'bi bi-star', iconPosition: 'left' });
      const icons = fixture.debugElement.queryAll(By.css('i'));
      expect(icons.length).toBe(1);
      expect(icons[0].nativeElement.className).toContain('bi-star');
    });

    it('should render right icon when provided', () => {
      flushInputs({ icon: 'bi bi-arrow', iconPosition: 'right' });
      const icons = fixture.debugElement.queryAll(By.css('i'));
      expect(icons.length).toBe(1);
      expect(icons[0].nativeElement.className).toContain('bi-arrow');
    });

    it('should hide icons while loading and show spinner', () => {
      flushInputs({ icon: 'bi bi-arrow', loading: true });
      const spinner = fixture.debugElement.query(By.css('.spinner-border'));
      expect(spinner).toBeTruthy();
      const icons = fixture.debugElement.queryAll(By.css('i'));
      expect(icons.length).toBe(0);
    });
  });

  describe('click & mouse interactions', () => {
    it('should emit click when enabled', () => {
      const spy = vi.spyOn(component.clicked, 'emit');
      getButton().triggerEventHandler('click', new MouseEvent('click'));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should prevent click when disabled or loading', () => {
      const spy = vi.spyOn(component.clicked, 'emit');
      const event = new MouseEvent('click');
      const stop = vi.spyOn(event, 'stopPropagation');
      const prevent = vi.spyOn(event, 'preventDefault');

      component.disabled = true;
      fixture.detectChanges();
      getButton().triggerEventHandler('click', event);
      expect(prevent).toHaveBeenCalled();
      expect(stop).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();

      spy.mockClear();
      const event2 = new MouseEvent('click');
      component.disabled = false;
      component.loading = true;
      fixture.detectChanges();
      getButton().triggerEventHandler('click', event2);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should emit mouse enter/leave when enabled', () => {
      const enterSpy = vi.spyOn(component.mouseEntered, 'emit');
      const leaveSpy = vi.spyOn(component.mouseLeft, 'emit');
      getButton().triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));
      getButton().triggerEventHandler('mouseleave', new MouseEvent('mouseleave'));
      expect(enterSpy).toHaveBeenCalledTimes(1);
      expect(leaveSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit mouse enter/leave when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const enterSpy = vi.spyOn(component.mouseEntered, 'emit');
      getButton().triggerEventHandler('mouseenter', new MouseEvent('mouseenter'));
      expect(enterSpy).not.toHaveBeenCalled();
    });

    it('should emit double click when enabled and block when disabled', () => {
      const dblSpy = vi.spyOn(component.doubleClicked, 'emit');
      const evt = new MouseEvent('dblclick');
      getButton().triggerEventHandler('dblclick', evt);
      expect(dblSpy).toHaveBeenCalledTimes(1);

      dblSpy.mockClear();
      const evt2 = new MouseEvent('dblclick');
      component.disabled = true;
      fixture.detectChanges();
      const prevent = vi.spyOn(evt2, 'preventDefault');
      const stop = vi.spyOn(evt2, 'stopPropagation');
      getButton().triggerEventHandler('dblclick', evt2);
      expect(prevent).toHaveBeenCalled();
      expect(stop).toHaveBeenCalled();
      expect(dblSpy).not.toHaveBeenCalled();
    });
  });

  describe('focus & blur', () => {
    it('should emit focus/blur when enabled', () => {
      const focusSpy = vi.spyOn(component.focused, 'emit');
      const blurSpy = vi.spyOn(component.blurred, 'emit');
      getButton().triggerEventHandler('focus', new FocusEvent('focus'));
      getButton().triggerEventHandler('blur', new FocusEvent('blur'));
      expect(focusSpy).toHaveBeenCalledTimes(1);
      expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit focus/blur when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const focusSpy = vi.spyOn(component.focused, 'emit');
      getButton().triggerEventHandler('focus', new FocusEvent('focus'));
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe('keyboard', () => {
    it('should emit keydown and prevent default on space', () => {
      const keySpy = vi.spyOn(component.keyPressed, 'emit');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const prevent = vi.spyOn(event, 'preventDefault');
      getButton().triggerEventHandler('keydown', event);
      expect(prevent).toHaveBeenCalled();
      expect(keySpy).toHaveBeenCalledTimes(1);
    });

    it('should emit keydown without preventing for other keys', () => {
      const keySpy = vi.spyOn(component.keyPressed, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const prevent = vi.spyOn(event, 'preventDefault');
      getButton().triggerEventHandler('keydown', event);
      expect(prevent).not.toHaveBeenCalled();
      expect(keySpy).toHaveBeenCalledTimes(1);
    });

    it('should block keydown when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();
      const keySpy = vi.spyOn(component.keyPressed, 'emit');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const prevent = vi.spyOn(event, 'preventDefault');
      const stop = vi.spyOn(event, 'stopPropagation');
      getButton().triggerEventHandler('keydown', event);
      expect(prevent).toHaveBeenCalled();
      expect(stop).toHaveBeenCalled();
      expect(keySpy).not.toHaveBeenCalled();
    });
  });

  describe('drag & drop', () => {
    const createDragEvent = () => {
      return {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as unknown as DragEvent;
    };

    it('should emit drag lifecycle when enabled', () => {
      const startSpy = vi.spyOn(component.dragStarted, 'emit');
      const dragSpy = vi.spyOn(component.dragged, 'emit');
      const endSpy = vi.spyOn(component.dragEnded, 'emit');
      const enterSpy = vi.spyOn(component.dragEntered, 'emit');
      const overSpy = vi.spyOn(component.dragOvered, 'emit');
      const leaveSpy = vi.spyOn(component.dragLeft, 'emit');
      const dropSpy = vi.spyOn(component.dropped, 'emit');

      getButton().triggerEventHandler('dragstart', createDragEvent());
      getButton().triggerEventHandler('drag', createDragEvent());
      getButton().triggerEventHandler('dragend', createDragEvent());
      getButton().triggerEventHandler('dragenter', createDragEvent());
      getButton().triggerEventHandler('dragover', createDragEvent());
      getButton().triggerEventHandler('dragleave', createDragEvent());
      getButton().triggerEventHandler('drop', createDragEvent());

      expect(startSpy).toHaveBeenCalled();
      expect(dragSpy).toHaveBeenCalled();
      expect(endSpy).toHaveBeenCalled();
      expect(enterSpy).toHaveBeenCalled();
      expect(overSpy).toHaveBeenCalled();
      expect(leaveSpy).toHaveBeenCalled();
      expect(dropSpy).toHaveBeenCalled();
    });

    it('should block dragstart, dragover and drop when disabled', () => {
      component.disabled = true;
      fixture.detectChanges();

      const startEvt = createDragEvent();
      const startPrevent = vi.spyOn(startEvt, 'preventDefault');
      const startSpy = vi.spyOn(component.dragStarted, 'emit');
      getButton().triggerEventHandler('dragstart', startEvt);
      expect(startPrevent).toHaveBeenCalled();
      expect(startSpy).not.toHaveBeenCalled();

      const overEvt = createDragEvent();
      const overSpy = vi.spyOn(component.dragOvered, 'emit');
      getButton().triggerEventHandler('dragover', overEvt);
      expect(overSpy).not.toHaveBeenCalled();

      const dropEvt = createDragEvent();
      const dropPrevent = vi.spyOn(dropEvt, 'preventDefault');
      const dropSpy = vi.spyOn(component.dropped, 'emit');
      getButton().triggerEventHandler('drop', dropEvt);
      expect(dropPrevent).toHaveBeenCalled();
      expect(dropSpy).not.toHaveBeenCalled();
    });
  });
});
