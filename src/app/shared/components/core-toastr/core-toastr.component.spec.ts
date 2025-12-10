import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CoreToastrComponent } from './core-toastr.component';
import { CoreToastrService } from '@shared/services/core-toastr.service';
import {
  CoreToastAction,
  CoreToastInstance,
  CoreToastPosition,
  CoreToastVariant
} from './core-toastr.types';
import { vi } from 'vitest';

class MockCoreToastrService {
  toastsSignal = signal<CoreToastInstance[]>([]);
  dismiss = vi.fn();
  setMaxQueue = vi.fn();
  toasts = () => this.toastsSignal();
}

describe('CoreToastrComponent', () => {
  let fixture: ComponentFixture<CoreToastrComponent>;
  let component: CoreToastrComponent;
  let service: MockCoreToastrService;

  const createToast = (overrides: Partial<CoreToastInstance> = {}): CoreToastInstance => ({
    id: overrides.id ?? 'toast-1',
    title: overrides.title,
    message: overrides.message ?? 'Hello',
    variant: overrides.variant ?? 'default',
    autoClose: overrides.autoClose ?? true,
    duration: overrides.duration ?? 4000,
    dismissible: overrides.dismissible ?? true,
    actions: overrides.actions ?? [],
    data: overrides.data,
    createdAt: overrides.createdAt ?? Date.now()
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreToastrComponent],
      providers: [{ provide: CoreToastrService, useClass: MockCoreToastrService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CoreToastrComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CoreToastrService) as unknown as MockCoreToastrService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs', () => {
    it('should set position and update class', () => {
      component.position = 'bottom-left';
      fixture.detectChanges();
      const positionClass = (component as any).positionClass();
      expect(positionClass).toBe('core-toastr--bottom-left');
    });

    it('should clamp maxVisible to minimum 1 and floor value', () => {
      component.maxVisible = 2.8;
      const toasts = [createToast({ id: '1' }), createToast({ id: '2' }), createToast({ id: '3' })];
      service.toastsSignal.set(toasts);
      fixture.detectChanges();
      const result = (component as any).toasts();
      expect(result.length).toBe(2);
    });

    it('should fall back to default maxVisible when value is not finite', () => {
      component.maxVisible = Number.NaN;
      service.toastsSignal.set([createToast({ id: '1' }), createToast({ id: '2' }), createToast({ id: '3' })]);
      fixture.detectChanges();
      const result = (component as any).toasts();
      expect(result.length).toBe(3);
    });

    it('should clamp stackGap to minimum 4 and floor value', () => {
      component.stackGap = 5.7;
      fixture.detectChanges();
      const gap = (component as any).stackGapPx();
      expect(gap).toBe('5px');
    });

    it('should ignore non-finite stackGap and keep default', () => {
      component.stackGap = Number.POSITIVE_INFINITY;
      fixture.detectChanges();
      const gap = (component as any).stackGapPx();
      expect(gap).toBe('16px');
    });

    it('should call setMaxQueue with safe value', () => {
      component.maxQueue = 4.9;
      expect(service.setMaxQueue).toHaveBeenCalledWith(4);
    });

    it('should ignore non-finite maxQueue value', () => {
      component.maxQueue = Number.NaN;
      expect(service.setMaxQueue).not.toHaveBeenCalled();
    });
  });

  describe('computed values', () => {
    it('should slice toasts based on maxVisible', () => {
      component.maxVisible = 2;
      service.toastsSignal.set([
        createToast({ id: '1' }),
        createToast({ id: '2' }),
        createToast({ id: '3' })
      ]);
      fixture.detectChanges();
      const result = (component as any).toasts();
      expect(result.map((t: CoreToastInstance) => t.id)).toEqual(['1', '2']);
    });

    it('should compute position class from signal', () => {
      const cls = (component as any).positionClass();
      expect(cls).toBe('core-toastr--top-right');
    });

    it('should compute stack gap with px suffix', () => {
      const gap = (component as any).stackGapPx();
      expect(gap).toBe('16px');
    });
  });

  describe('actions and dismissal', () => {
    it('should track toast by id', () => {
      const toast = createToast({ id: 'track-me' });
      const id = (component as any).trackToast(0, toast);
      expect(id).toBe('track-me');
    });

    it('should dismiss toast by id', () => {
      (component as any).dismissToast('toast-x');
      expect(service.dismiss).toHaveBeenCalledWith('toast-x');
    });

    it('should call action handler and dismiss when dismissOnClick not false', () => {
      const toast = createToast({ id: 'toast-action' });
      const action: CoreToastAction = { id: 'act', label: 'Do', handler: vi.fn() };
      (component as any).handleAction(toast, action);
      expect(action.handler).toHaveBeenCalled();
      expect(service.dismiss).toHaveBeenCalledWith('toast-action', 'action');
    });

    it('should not dismiss when dismissOnClick is false', () => {
      const toast = createToast({ id: 'toast-action' });
      const action: CoreToastAction = { id: 'act', label: 'Do', dismissOnClick: false, handler: vi.fn() };
      (component as any).handleAction(toast, action);
      expect(action.handler).toHaveBeenCalled();
      expect(service.dismiss).not.toHaveBeenCalled();
    });
  });

  describe('icons', () => {
    const variants: Array<[CoreToastVariant, string]> = [
      ['default', 'ℹ️'],
      ['success', '✔️'],
      ['info', 'ⓘ'],
      ['warning', '⚠️'],
      ['error', '⨯']
    ];

    variants.forEach(([variant, icon]) => {
      it(`should return icon for variant ${variant}`, () => {
        const toast = createToast({ variant });
        const result = (component as any).iconFor(toast);
        expect(result).toBe(icon);
      });
    });

    it('should fall back to default icon for unknown variant', () => {
      const toast = createToast({ variant: 'unknown' as CoreToastVariant });
      const result = (component as any).iconFor(toast);
      expect(result).toBe('ℹ️');
    });
  });
});
