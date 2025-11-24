import { Injectable, ComponentRef, ApplicationRef, ComponentFactoryResolver, Injector, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CoreModalComponent } from '@shared/components/core-modal/core-modal.component';
import type { ModalConfig } from '@shared/components/core-modal/core-modal.types';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef?: ComponentRef<CoreModalComponent>;

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  /**
   * Opens a modal with the given configuration
   * @param config Modal configuration
   * @returns Observable that emits when modal is closed
   */
  open(config: ModalConfig): Observable<any> {
    const subject = new Subject<any>();

    // Create modal component
    const factory = this.componentFactoryResolver.resolveComponentFactory(CoreModalComponent);
    this.modalRef = factory.create(this.injector);

    // Set inputs
    const instance = this.modalRef.instance;
    Object.assign(instance, config);

    // If config.data contains contentHtml, ensure it's set on instance
    if (config.data && config.data.contentHtml) {
      instance.data = instance.data || {};
      instance.data.contentHtml = config.data.contentHtml;
    }

    // Subscribe to events
    instance.opened.subscribe(() => {
      // Modal opened
    });

    instance.closed.subscribe((result) => {
      subject.next(result);
      subject.complete();
      this.close();
    });

    // Attach to app
    this.appRef.attachView(this.modalRef.hostView);
    const domElem = (this.modalRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // Open modal
    instance.open();

    return subject.asObservable();
  }

  /**
   * Closes the currently open modal
   */
  close(): void {
    if (this.modalRef) {
      this.appRef.detachView(this.modalRef.hostView);
      this.modalRef.destroy();
      this.modalRef = undefined;
    }
  }

  /**
   * Checks if a modal is currently open
   */
  isOpen(): boolean {
    return !!this.modalRef;
  }
}