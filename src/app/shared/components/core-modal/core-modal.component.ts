import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
  Renderer2,
  Inject,
  Optional,
  ChangeDetectionStrategy,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Type,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import type { ModalButton, ModalConfig } from './core-modal.types';

// Modal types are defined in `core-modal.types.ts` to keep the component file focused.

@Component({
  selector: 'core-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './core-modal.component.html',
  styleUrls: ['./core-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreModalComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  @Input() size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen' = 'lg';
  @Input() closable = true;
  @Input() backdrop: 'static' | true | false = true;
  @Input() showCloseButton = true;
  @Input() buttons: ModalButton[] = [];
  @Input() customClass?: string;
  @Input() data?: any;
  @Input() content?: Type<any>;
  @Input() contentProps?: Record<string, any>;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<any>();
  @Output() confirmed = new EventEmitter<any>();

  isOpen = false;
  private previousFocus?: HTMLElement;
  hasProjectedContent = false;
  private focusableElements: HTMLElement[] = [];
  private firstFocusableElement?: HTMLElement;
  private lastFocusableElement?: HTMLElement;

  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  dynamicHost!: ViewContainerRef;
  private dynamicComponentRef?: ComponentRef<any> | null = null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Optional() @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if (this.document.body) {
      this.renderer.removeStyle(this.document.body, 'overflow');
    }
    this.removeFocusTrap();
    this.destroyDynamicContent();
  }

  open(): void {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.previousFocus = this.document.activeElement as HTMLElement;

    if (this.document.body) {
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }

    this.opened.emit();

    Promise.resolve().then(() => {
      this.cdr.detectChanges();

      this.hasProjectedContent = !!this.elementRef.nativeElement.querySelector('[modal-body]');

      this.setupFocusTrap();

      if (this.firstFocusableElement) {
        this.firstFocusableElement.focus();
      }

      // if no projected content and a dynamic content component is provided, load it
      if (!this.hasProjectedContent && this.content) {
        this.loadDynamicContent(this.content, this.contentProps);
        Promise.resolve().then(() => {
          this.setupFocusTrap();
          if (this.firstFocusableElement) {
            this.firstFocusableElement.focus();
          }
        });
      }
    });
  }

  close(result?: any): void {
    if (!this.isOpen || this.backdrop === 'static') {
      return;
    }

    this.isOpen = false;
    this.closed.emit(result);
    this.removeFocusTrap();
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
    if (this.document.body) {
      this.renderer.removeStyle(this.document.body, 'overflow');
    }
    this.cdr.detectChanges();
    this.destroyDynamicContent();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && this.backdrop !== 'static') {
      this.close();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(_event: Event): void {
    if (this.closable && this.backdrop !== 'static') {
      this.close();
    }
  }

  @HostListener('keydown.tab', ['$event'])
  onTabKey(event: Event): void {
    if (!this.isOpen) return;

    const keyboardEvent = event as KeyboardEvent;

    // Only trap focus if modal is open
    const modalElement = this.elementRef.nativeElement.querySelector('.modal');
    if (!modalElement || !modalElement.contains(keyboardEvent.target as Node)) {
      return;
    }

    this.updateFocusableElements();

    if (this.focusableElements.length === 0) {
      keyboardEvent.preventDefault();
      return;
    }

    if (keyboardEvent.shiftKey) {
      // Shift + Tab: move backwards
      if (this.document.activeElement === this.firstFocusableElement) {
        keyboardEvent.preventDefault();
        this.lastFocusableElement?.focus();
      }
    } else {
      // Tab: move forwards
      if (this.document.activeElement === this.lastFocusableElement) {
        keyboardEvent.preventDefault();
        this.firstFocusableElement?.focus();
      }
    }
  }

  async onButtonClick(button: ModalButton): Promise<void> {
    if (button.handler) {
      try {
        const result = button.handler(this, this.dynamicComponentRef?.instance);

        if (result instanceof Promise) {
          const promiseResult = await result;
          if (button.closeOnClick !== false && promiseResult !== false) {
            this.close(button);
          }
        } else {
          if (button.closeOnClick !== false && result !== false) {
            this.close(button);
          }
        }
      } catch (err) {
        if (button.closeOnClick === true) {
          this.close(button);
        }
      }
    } else {
      if (button.closeOnClick !== false) {
        this.close(button);
      }
    }
  }

  private loadDynamicContent(component: Type<any>, props?: Record<string, any>): void {
    if (!this.dynamicHost) return;
    try {
      this.dynamicHost.clear();
      const compRef = this.dynamicHost.createComponent(component);
      this.dynamicComponentRef = compRef;
      if (props) {
        Object.assign(compRef.instance, props);
      }
    } catch (error) {
      // Ignore errors if injector is already destroyed (e.g., in tests)
    }
  }

  private destroyDynamicContent(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
      this.dynamicComponentRef = null;
    }
    if (this.dynamicHost) {
      this.dynamicHost.clear();
    }
  }

  private setupFocusTrap(): void {
    this.updateFocusableElements();
  }

  private updateFocusableElements(): void {
    const modalElement = this.elementRef.nativeElement.querySelector('.modal') as HTMLElement;
    if (!modalElement) return;

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    const nodeList = modalElement.querySelectorAll(focusableSelectors);
    const elements = Array.from(nodeList)
      .filter((el): el is HTMLElement => el instanceof HTMLElement)
      .filter(el => {
        // Filter out elements that are not visible
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      });

    this.focusableElements = elements;
    this.firstFocusableElement = elements[0];
    this.lastFocusableElement = elements[elements.length - 1];
  }

  private removeFocusTrap(): void {
    this.focusableElements = [];
    this.firstFocusableElement = undefined;
    this.lastFocusableElement = undefined;
  }

  get dialogClasses(): string {
    const classes = ['modal-dialog', 'modal-dialog-centered'];
    if (this.size) {
      if (this.size === 'fullscreen') {
        classes.push('modal-fullscreen');
      } else if (this.size === 'md') {
      } else {
        classes.push(`modal-${this.size}`);
      }
    }
    return classes.join(' ');
  }
}
