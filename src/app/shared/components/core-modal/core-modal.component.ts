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
  styleUrls: ['./core-modal.component.css'],
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
    if (this.document) {
      this.renderer.removeStyle(this.document.body, 'overflow');
    }
    this.destroyDynamicContent();
  }

  open(): void {
    this.isOpen = true;
    if (this.document) {
      this.previousFocus = this.document.activeElement as HTMLElement;
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }

    this.opened.emit();
    this.cdr.detectChanges();

    setTimeout(() => {
      // detect if host has projected [modal-body] content
      this.hasProjectedContent = !!this.elementRef.nativeElement.querySelector('[modal-body]');
      const focusable = this.elementRef.nativeElement.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) {
        (focusable as HTMLElement).focus();
      }
      // if no projected content and a dynamic content component is provided, load it
      if (!this.hasProjectedContent && this.content) {
        this.loadDynamicContent(this.content, this.contentProps);
      }
    });
  }

  close(result?: any): void {
    if (this.backdrop === 'static') return;
    this.isOpen = false;
    this.closed.emit(result);
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
    if (this.document) {
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
    if (this.closable) {
      this.close();
    }
  }

  onButtonClick(button: ModalButton): void {
    if (button.handler) {
      try {
        button.handler(this, this.dynamicComponentRef?.instance);
      } catch (err) {
        console.error(err);
      }
    }
    if (button.closeOnClick !== false) {
      this.close(button);
    }
  }

  private loadDynamicContent(component: Type<any>, props?: Record<string, any>): void {
    if (!this.dynamicHost) return;
    this.dynamicHost.clear();
    const compRef = this.dynamicHost.createComponent(component);
    this.dynamicComponentRef = compRef;
    if (props) {
      Object.assign(compRef.instance, props);
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

  get modalClasses(): string {
    const classes = ['modal', 'fade'];
    if (this.customClass) {
      classes.push(this.customClass);
    }
    if (this.isOpen) {
      classes.push('show');
    }
    return classes.join(' ');
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
