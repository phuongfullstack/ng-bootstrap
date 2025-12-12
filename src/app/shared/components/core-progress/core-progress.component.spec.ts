import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreProgressComponent } from './core-progress.component';
import { CoreProgressItem } from './core-progress.types';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { SimpleChange } from '@angular/core';

describe('CoreProgressComponent', () => {
    let component: CoreProgressComponent;
    let fixture: ComponentFixture<CoreProgressComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoreProgressComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(CoreProgressComponent);
        component = fixture.componentInstance;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            fixture.detectChanges();
            expect(component).toBeTruthy();
        });

        it('should initialize with default values', () => {
            expect(component.value).toBe(0);
            expect(component.max).toBe(100);
            expect(component.variant).toBe('primary');
            expect(component.striped).toBe(false);
            expect(component.animated).toBe(false);
            expect(component.showLabel).toBe(false);
            expect(component.label).toBeUndefined();
            expect(component.height).toBeUndefined();
            expect(component.rounded).toBe(false);
            expect(component.indeterminate).toBe(false);
            expect(component.buffer).toBe(false);
            expect(component.bufferValue).toBe(0);
            expect(component.multi).toBeUndefined();
            expect(component.stacked).toBe(false);
            expect(component.customClass).toBeUndefined();
            expect(component.ariaLabel).toBeUndefined();
        });
    });

    describe('Single Progress Bar Mode', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('value', 50);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
        });

        it('should render single progress bar container', () => {
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container).toBeTruthy();
        });

        it('should render progress bar with correct width', () => {
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar).toBeTruthy();
            expect(progressBar.nativeElement.style.width).toBe('50%');
        });

        it('should calculate percentage correctly', () => {
            expect((component as any).percentage).toBe(50);
        });

        it('should apply correct variant class', () => {
            fixture.componentRef.setInput('variant', 'success');
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('bg-success')).toBe(true);
        });

        it('should handle value exceeding max', () => {
            fixture.componentRef.setInput('value', 150);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
            expect((component as any).percentage).toBe(100);
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.style.width).toBe('100%');
        });

        it('should handle negative value', () => {
            fixture.componentRef.setInput('value', -10);
            fixture.detectChanges();
            expect((component as any).percentage).toBe(0);
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.style.width).toBe('0%');
        });

        it('should show label when showLabel is true', () => {
            fixture.componentRef.setInput('showLabel', true);
            fixture.componentRef.setInput('value', 75);
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css('.progress-label'));
            expect(label).toBeTruthy();
            expect(label.nativeElement.textContent.trim()).toBe('75%');
        });

        it('should show custom label when provided', () => {
            fixture.componentRef.setInput('label', 'Custom Label');
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css('.progress-label'));
            expect(label).toBeTruthy();
            expect(label.nativeElement.textContent.trim()).toBe('Custom Label');
        });

        it('should not show label when showLabel is false and no label provided', () => {
            fixture.componentRef.setInput('showLabel', false);
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css('.progress-label'));
            expect(label).toBeFalsy();
        });

        it('should apply striped class when striped is true', () => {
            fixture.componentRef.setInput('striped', true);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-striped')).toBe(true);
        });

        it('should apply animated class when animated and striped are true', () => {
            fixture.componentRef.setInput('striped', true);
            fixture.componentRef.setInput('animated', true);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-striped')).toBe(true);
            expect(progressBar.nativeElement.classList.contains('progress-bar-animated')).toBe(true);
        });

        it('should not apply animated class when striped is false', () => {
            fixture.componentRef.setInput('striped', false);
            fixture.componentRef.setInput('animated', true);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-animated')).toBe(false);
        });

        it('should apply rounded class when rounded is true', () => {
            fixture.componentRef.setInput('rounded', true);
            fixture.detectChanges();
            const container = fixture.debugElement.query(By.css('.progress'));
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(container.nativeElement.classList.contains('rounded')).toBe(true);
            expect(progressBar.nativeElement.classList.contains('rounded')).toBe(true);
        });

        it('should apply custom height', () => {
            fixture.componentRef.setInput('height', '30px');
            fixture.detectChanges();
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container.nativeElement.style.height).toBe('30px');
        });

        it('should apply custom class', () => {
            fixture.componentRef.setInput('customClass', 'my-custom-class');
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('my-custom-class')).toBe(true);
        });

        it('should set aria-label on container', () => {
            fixture.componentRef.setInput('ariaLabel', 'Loading progress');
            fixture.detectChanges();
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container.nativeElement.getAttribute('aria-label')).toBe('Loading progress');
        });

        it('should set aria attributes on progress bar', () => {
            fixture.componentRef.setInput('value', 60);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('role')).toBe('progressbar');
            expect(progressBar.nativeElement.getAttribute('aria-valuenow')).toBe('60');
            expect(progressBar.nativeElement.getAttribute('aria-valuemin')).toBe('0');
            expect(progressBar.nativeElement.getAttribute('aria-valuemax')).toBe('100');
        });
    });

    describe('Indeterminate Mode', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('indeterminate', true);
            fixture.detectChanges();
        });

        it('should apply indeterminate class', () => {
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-indeterminate')).toBe(true);
        });

        it('should set width to 100% in indeterminate mode', () => {
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.style.width).toBe('100%');
        });

        it('should return 0 percentage in indeterminate mode', () => {
            fixture.componentRef.setInput('value', 50);
            fixture.detectChanges();
            expect((component as any).percentage).toBe(0);
        });

        it('should not set aria-valuenow in indeterminate mode', () => {
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('aria-valuenow')).toBeNull();
        });

        it('should not show percentage label in indeterminate mode', () => {
            fixture.componentRef.setInput('showLabel', true);
            fixture.detectChanges();
            expect((component as any).displayLabel).toBe('');
        });

        it('should show custom label in indeterminate mode', () => {
            fixture.componentRef.setInput('label', 'Loading...');
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css('.progress-label'));
            expect(label).toBeTruthy();
            expect(label.nativeElement.textContent.trim()).toBe('Loading...');
        });
    });

    describe('Buffer Mode', () => {
        beforeEach(() => {
            fixture.componentRef.setInput('buffer', true);
            fixture.componentRef.setInput('value', 40);
            fixture.componentRef.setInput('bufferValue', 70);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
        });

        it('should render buffer bar', () => {
            const bufferBar = fixture.debugElement.query(By.css('.progress-bar.bg-secondary'));
            expect(bufferBar).toBeTruthy();
        });

        it('should render both buffer and progress bars', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(progressBars.length).toBe(2);
        });

        it('should calculate buffer percentage correctly', () => {
            expect((component as any).bufferPercentage).toBe(70);
        });

        it('should render buffer bar with correct width', () => {
            const bufferBar = fixture.debugElement.query(By.css('.progress-bar.bg-secondary'));
            expect(bufferBar.nativeElement.style.width).toBe('70%');
        });

        it('should render progress bar with correct width over buffer', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            const mainProgressBar = progressBars.find(bar => !bar.nativeElement.classList.contains('bg-secondary'));
            expect(mainProgressBar?.nativeElement.style.width).toBe('40%');
        });

        it('should handle buffer value exceeding max', () => {
            fixture.componentRef.setInput('bufferValue', 150);
            fixture.detectChanges();
            expect((component as any).bufferPercentage).toBe(100);
        });

        it('should handle negative buffer value', () => {
            fixture.componentRef.setInput('bufferValue', -10);
            fixture.detectChanges();
            expect((component as any).bufferPercentage).toBe(0);
        });

        it('should return 0 buffer percentage when buffer is false', () => {
            fixture.componentRef.setInput('buffer', false);
            fixture.detectChanges();
            expect((component as any).bufferPercentage).toBe(0);
        });

        it('should set aria attributes for buffer bar', () => {
            const bufferBar = fixture.debugElement.query(By.css('.progress-bar.bg-secondary'));
            expect(bufferBar.nativeElement.getAttribute('aria-valuenow')).toBe('70');
            expect(bufferBar.nativeElement.getAttribute('aria-valuemin')).toBe('0');
            expect(bufferBar.nativeElement.getAttribute('aria-valuemax')).toBe('100');
        });
    });

    describe('Multi Progress Mode', () => {
        const multiItems: CoreProgressItem[] = [
            { value: 30, variant: 'success', label: 'Complete' },
            { value: 20, variant: 'warning', label: 'In Progress' },
            { value: 10, variant: 'danger', label: 'Failed' }
        ];

        beforeEach(() => {
            fixture.componentRef.setInput('multi', multiItems);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
        });

        it('should detect multi mode', () => {
            expect((component as any).isMultiMode).toBe(true);
        });

        it('should render multiple progress containers when not stacked', () => {
            const containers = fixture.debugElement.queryAll(By.css('.progress'));
            expect(containers.length).toBe(multiItems.length + 1);
        });

        it('should render progress bar for each item', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(progressBars.length).toBe(multiItems.length);
        });

        it('should apply correct variant for each item', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(progressBars[0].nativeElement.classList.contains('bg-success')).toBe(true);
            expect(progressBars[1].nativeElement.classList.contains('bg-warning')).toBe(true);
            expect(progressBars[2].nativeElement.classList.contains('bg-danger')).toBe(true);
        });

        it('should render labels for each item', () => {
            const labels = fixture.debugElement.queryAll(By.css('.progress-label'));
            expect(labels.length).toBe(3);
            expect(labels[0].nativeElement.textContent.trim()).toBe('Complete');
            expect(labels[1].nativeElement.textContent.trim()).toBe('In Progress');
            expect(labels[2].nativeElement.textContent.trim()).toBe('Failed');
        });

        it('should calculate percentage for each item', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(progressBars[0].nativeElement.style.width).toBe('30%');
            expect(progressBars[1].nativeElement.style.width).toBe('20%');
            expect(progressBars[2].nativeElement.style.width).toBe('10%');
        });

        it('should show percentage as label when showLabel is true and no label provided', () => {
            const itemsNoLabel: CoreProgressItem[] = [
                { value: 45, variant: 'primary' }
            ];
            fixture.componentRef.setInput('multi', itemsNoLabel);
            fixture.componentRef.setInput('showLabel', true);
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css('.progress-label'));
            expect(label.nativeElement.textContent.trim()).toBe('45%');
        });

        it('should use item striped over component striped', () => {
            const itemsWithStriped: CoreProgressItem[] = [
                { value: 50, variant: 'primary', striped: true }
            ];
            fixture.componentRef.setInput('multi', itemsWithStriped);
            fixture.componentRef.setInput('striped', false);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-striped')).toBe(true);
        });

        it('should use item animated over component animated', () => {
            const itemsWithAnimated: CoreProgressItem[] = [
                { value: 50, variant: 'primary', striped: true, animated: true }
            ];
            fixture.componentRef.setInput('multi', itemsWithAnimated);
            fixture.componentRef.setInput('animated', false);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-animated')).toBe(true);
        });

        it('should use component variant when item variant not provided', () => {
            const itemsNoVariant: CoreProgressItem[] = [
                { value: 50 }
            ];
            fixture.componentRef.setInput('multi', itemsNoVariant);
            fixture.componentRef.setInput('variant', 'info');
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('bg-info')).toBe(true);
        });

        it('should set aria attributes for each item', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(progressBars[0].nativeElement.getAttribute('aria-valuenow')).toBe('30');
            expect(progressBars[0].nativeElement.getAttribute('aria-valuemin')).toBe('0');
            expect(progressBars[0].nativeElement.getAttribute('aria-valuemax')).toBe('100');
        });
    });

    describe('Stacked Progress Mode', () => {
        const stackedItems: CoreProgressItem[] = [
            { value: 25, variant: 'success' },
            { value: 35, variant: 'warning' },
            { value: 15, variant: 'danger' }
        ];

        beforeEach(() => {
            fixture.componentRef.setInput('multi', stackedItems);
            fixture.componentRef.setInput('stacked', true);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
        });

        it('should render single progress container for stacked mode', () => {
            const containers = fixture.debugElement.queryAll(By.css('.progress'));
            expect(containers.length).toBe(1);
        });

        it('should apply stacked class', () => {
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container.nativeElement.classList.contains('progress-stacked')).toBe(true);
        });

        it('should render all bars inside single container', () => {
            const container = fixture.debugElement.query(By.css('.progress'));
            const progressBars = container.queryAll(By.css('.progress-bar'));
            expect(progressBars.length).toBe(stackedItems.length);
        });

        it('should apply correct widths for stacked bars', () => {
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(progressBars[0].nativeElement.style.width).toBe('25%');
            expect(progressBars[1].nativeElement.style.width).toBe('35%');
            expect(progressBars[2].nativeElement.style.width).toBe('15%');
        });

        it('should apply rounded to container and bars in stacked mode', () => {
            fixture.componentRef.setInput('rounded', true);
            fixture.detectChanges();
            const container = fixture.debugElement.query(By.css('.progress'));
            const progressBars = fixture.debugElement.queryAll(By.css('.progress-bar'));
            expect(container.nativeElement.classList.contains('rounded')).toBe(true);
            progressBars.forEach(bar => {
                expect(bar.nativeElement.classList.contains('rounded')).toBe(true);
            });
        });
    });

    describe('Event Emissions', () => {
        it('should emit valueChange when value changes', () => {
            const valueChangeSpy = vi.spyOn(component.valueChange, 'emit');
            fixture.componentRef.setInput('value', 10);
            fixture.detectChanges();

            component.ngOnChanges({
                value: new SimpleChange(null, 10, false)
            });

            expect(valueChangeSpy).toHaveBeenCalledWith(10);
        });

        it('should not emit valueChange on first change', () => {
            const valueChangeSpy = vi.spyOn(component.valueChange, 'emit');

            component.ngOnChanges({
                value: new SimpleChange(undefined, 10, true)
            });

            expect(valueChangeSpy).not.toHaveBeenCalled();
        });

        it('should emit started when value changes from 0 to positive', () => {
            fixture.componentRef.setInput('value', 0);
            fixture.detectChanges();

            const startedSpy = vi.spyOn(component.started, 'emit');

            fixture.componentRef.setInput('value', 10);
            fixture.detectChanges();

            expect(startedSpy).toHaveBeenCalled();
        });

        it('should not emit started on first change', () => {
            const startedSpy = vi.spyOn(component.started, 'emit');

            component.ngOnChanges({
                value: new SimpleChange(undefined, 10, true)
            });

            expect(startedSpy).not.toHaveBeenCalled();
        });

        it('should emit completed when value reaches max', () => {
            fixture.componentRef.setInput('value', 50);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();

            const completedSpy = vi.spyOn(component.completed, 'emit');

            fixture.componentRef.setInput('value', 100);
            fixture.detectChanges();

            expect(completedSpy).toHaveBeenCalled();
        });

        it('should emit completed when value exceeds max', () => {
            fixture.componentRef.setInput('value', 50);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();

            const completedSpy = vi.spyOn(component.completed, 'emit');

            fixture.componentRef.setInput('value', 150);
            fixture.detectChanges();

            expect(completedSpy).toHaveBeenCalled();
        });

        it('should not emit completed in indeterminate mode', () => {
            fixture.componentRef.setInput('indeterminate', true);
            fixture.componentRef.setInput('value', 50);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();

            const completedSpy = vi.spyOn(component.completed, 'emit');

            component.ngOnChanges({
                value: new SimpleChange(50, 100, false)
            });

            expect(completedSpy).not.toHaveBeenCalled();
        });

        it('should not emit completed when already at max', () => {
            fixture.componentRef.setInput('value', 100);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();

            const completedSpy = vi.spyOn(component.completed, 'emit');

            component.ngOnChanges({
                value: new SimpleChange(100, 100, false)
            });

            expect(completedSpy).not.toHaveBeenCalled();
        });

        it('should emit mouseEnter event', () => {
            const mouseEnterSpy = vi.spyOn(component.mouseEnter, 'emit');
            fixture.detectChanges();

            const container = fixture.debugElement.query(By.css('.progress'));
            const event = new MouseEvent('mouseenter');
            container.nativeElement.dispatchEvent(event);

            expect(mouseEnterSpy).toHaveBeenCalled();
        });

        it('should emit mouseLeave event', () => {
            const mouseLeaveSpy = vi.spyOn(component.mouseLeave, 'emit');
            fixture.detectChanges();

            const container = fixture.debugElement.query(By.css('.progress'));
            const event = new MouseEvent('mouseleave');
            container.nativeElement.dispatchEvent(event);

            expect(mouseLeaveSpy).toHaveBeenCalled();
        });

        it('should emit clicked event', () => {
            const clickedSpy = vi.spyOn(component.clicked, 'emit');
            fixture.detectChanges();

            const container = fixture.debugElement.query(By.css('.progress'));
            container.nativeElement.click();

            expect(clickedSpy).toHaveBeenCalled();
        });

        it('should call markForCheck on value change', () => {
            const cdr = (component as any).cdr;
            const markForCheckSpy = vi.spyOn(cdr, 'markForCheck');

            component.ngOnChanges({
                value: new SimpleChange(0, 10, false)
            });

            expect(markForCheckSpy).toHaveBeenCalled();
        });

        it('should call markForCheck on bufferValue change', () => {
            const cdr = (component as any).cdr;
            const markForCheckSpy = vi.spyOn(cdr, 'markForCheck');

            component.ngOnChanges({
                bufferValue: new SimpleChange(0, 50, false)
            });

            expect(markForCheckSpy).toHaveBeenCalled();
        });

        it('should call markForCheck on buffer change', () => {
            const cdr = (component as any).cdr;
            const markForCheckSpy = vi.spyOn(cdr, 'markForCheck');

            component.ngOnChanges({
                buffer: new SimpleChange(false, true, false)
            });

            expect(markForCheckSpy).toHaveBeenCalled();
        });

        it('should call markForCheck on multi change', () => {
            const cdr = (component as any).cdr;
            const markForCheckSpy = vi.spyOn(cdr, 'markForCheck');

            component.ngOnChanges({
                multi: new SimpleChange(undefined, [{ value: 50 }], false)
            });

            expect(markForCheckSpy).toHaveBeenCalled();
        });

        it('should call markForCheck on stacked change', () => {
            const cdr = (component as any).cdr;
            const markForCheckSpy = vi.spyOn(cdr, 'markForCheck');

            component.ngOnChanges({
                stacked: new SimpleChange(false, true, false)
            });

            expect(markForCheckSpy).toHaveBeenCalled();
        });
    });

    describe('Helper Methods', () => {
        it('should identify complete state correctly', () => {
            fixture.componentRef.setInput('value', 100);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
            expect((component as any).isComplete).toBe(true);
        });

        it('should not identify as complete when value less than max', () => {
            fixture.componentRef.setInput('value', 50);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
            expect((component as any).isComplete).toBe(false);
        });

        it('should not identify as complete in indeterminate mode', () => {
            fixture.componentRef.setInput('indeterminate', true);
            fixture.componentRef.setInput('value', 100);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
            expect((component as any).isComplete).toBe(false);
        });

        it('should return empty string for displayLabel when no label and showLabel false', () => {
            fixture.componentRef.setInput('showLabel', false);
            fixture.detectChanges();
            expect((component as any).displayLabel).toBe('');
        });

        it('should return percentage string when showLabel true', () => {
            fixture.componentRef.setInput('showLabel', true);
            fixture.componentRef.setInput('value', 65);
            fixture.detectChanges();
            expect((component as any).displayLabel).toBe('65%');
        });

        it('should prioritize custom label over percentage', () => {
            fixture.componentRef.setInput('label', 'Custom');
            fixture.componentRef.setInput('showLabel', true);
            fixture.componentRef.setInput('value', 65);
            fixture.detectChanges();
            expect((component as any).displayLabel).toBe('Custom');
        });

        it('should return false for isMultiMode when multi is undefined', () => {
            expect((component as any).isMultiMode).toBe(false);
        });

        it('should return false for isMultiMode when multi is empty array', () => {
            fixture.componentRef.setInput('multi', []);
            fixture.detectChanges();
            expect((component as any).isMultiMode).toBe(false);
        });

        it('should return true for isMultiMode when multi has items', () => {
            fixture.componentRef.setInput('multi', [{ value: 50 }]);
            fixture.detectChanges();
            expect((component as any).isMultiMode).toBe(true);
        });
    });

    describe('All Variants', () => {
        const variants: Array<'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'> = [
            'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
        ];

        variants.forEach(variant => {
            it(`should apply ${variant} variant correctly`, () => {
                fixture.componentRef.setInput('variant', variant);
                fixture.componentRef.setInput('value', 50);
                fixture.detectChanges();
                const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
                expect(progressBar.nativeElement.classList.contains(`bg-${variant}`)).toBe(true);
            });
        });
    });

    describe('Edge Cases', () => {
        it('should handle max value of 0', () => {
            fixture.componentRef.setInput('value', 10);
            fixture.componentRef.setInput('max', 0);
            fixture.detectChanges();
            // Should handle division by zero gracefully
            expect(() => (component as any).percentage).not.toThrow();
        });

        it('should handle very large values', () => {
            fixture.componentRef.setInput('value', 999999);
            fixture.componentRef.setInput('max', 1000000);
            fixture.detectChanges();
            expect((component as any).percentage).toBe(100);
        });

        it('should handle fractional values', () => {
            fixture.componentRef.setInput('value', 33.33);
            fixture.componentRef.setInput('max', 100);
            fixture.detectChanges();
            expect((component as any).percentage).toBe(33);
        });

        it('should handle multi mode without labels', () => {
            const items: CoreProgressItem[] = [
                { value: 50 }
            ];
            fixture.componentRef.setInput('multi', items);
            fixture.componentRef.setInput('showLabel', false);
            fixture.detectChanges();
            const label = fixture.debugElement.query(By.css('.progress-label'));
            expect(label).toBeFalsy();
        });

        it('should handle empty multi array gracefully', () => {
            fixture.componentRef.setInput('multi', []);
            fixture.detectChanges();
            expect((component as any).isMultiMode).toBe(false);
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container).toBeTruthy();
        });

        it('should handle animated without striped', () => {
            fixture.componentRef.setInput('animated', true);
            fixture.componentRef.setInput('striped', false);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            // When animated=true, striped is automatically added (line 84-86 in component)
            expect(progressBar.nativeElement.classList.contains('progress-bar-striped')).toBe(true);
            // But animated class requires both animated AND striped to be true (line 88-90)
            expect(progressBar.nativeElement.classList.contains('progress-bar-animated')).toBe(false);
        });

        it('should handle item without striped but with animated', () => {
            const items: CoreProgressItem[] = [
                { value: 50, striped: false, animated: true }
            ];
            fixture.componentRef.setInput('multi', items);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-animated')).toBe(false);
        });

        it('should use component striped when item striped is undefined', () => {
            const items: CoreProgressItem[] = [
                { value: 50 }
            ];
            fixture.componentRef.setInput('multi', items);
            fixture.componentRef.setInput('striped', true);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-striped')).toBe(true);
        });

        it('should use component animated when item animated is undefined', () => {
            const items: CoreProgressItem[] = [
                { value: 50, striped: true }
            ];
            fixture.componentRef.setInput('multi', items);
            fixture.componentRef.setInput('striped', true);
            fixture.componentRef.setInput('animated', true);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.classList.contains('progress-bar-animated')).toBe(true);
        });
    });

    describe('Accessibility', () => {
        it('should have role progressbar on progress bar', () => {
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('role')).toBe('progressbar');
        });

        it('should have aria-valuemin of 0', () => {
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('aria-valuemin')).toBe('0');
        });

        it('should have correct aria-valuemax', () => {
            fixture.componentRef.setInput('max', 200);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('aria-valuemax')).toBe('200');
        });

        it('should have correct aria-valuenow', () => {
            fixture.componentRef.setInput('value', 75);
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('aria-valuenow')).toBe('75');
        });

        it('should set aria-label from displayLabel', () => {
            fixture.componentRef.setInput('label', 'Upload progress');
            fixture.detectChanges();
            const progressBar = fixture.debugElement.query(By.css('.progress-bar'));
            expect(progressBar.nativeElement.getAttribute('aria-label')).toBe('Upload progress');
        });

        it('should set container aria-label when provided', () => {
            fixture.componentRef.setInput('ariaLabel', 'File upload');
            fixture.detectChanges();
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container.nativeElement.getAttribute('aria-label')).toBe('File upload');
        });

        it('should use displayLabel as container aria-label when ariaLabel not provided', () => {
            fixture.componentRef.setInput('label', 'Processing');
            fixture.detectChanges();
            const container = fixture.debugElement.query(By.css('.progress'));
            expect(container.nativeElement.getAttribute('aria-label')).toBe('Processing');
        });
    });
});
