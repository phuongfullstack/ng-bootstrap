import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreToastrService } from '@shared/services/core-toastr.service';

@Component({
  selector: 'toastr-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid">
      <h2>Toastr Demo</h2>
      <div class="row">
        <div class="col-md-3 mb-2"><button class="btn btn-success w-100" (click)="showSuccess()">Success</button></div>
        <div class="col-md-3 mb-2"><button class="btn btn-info w-100" (click)="showInfo()">Info</button></div>
        <div class="col-md-3 mb-2"><button class="btn btn-warning w-100" (click)="showWarning()">Warning</button></div>
        <div class="col-md-3 mb-2"><button class="btn btn-danger w-100" (click)="showError()">Error</button></div>
      </div>
      <div class="row mt-3">
        <div class="col-md-4"><button class="btn btn-primary w-100" (click)="showCustom()">Custom Toast</button></div>
      </div>
    </div>
  `
})
export class ToastrDemoComponent {
  constructor(private readonly toastr: CoreToastrService) { }

  showSuccess(): void {
    this.toastr.success('Saved successfully', 'Success');
  }

  showInfo(): void {
    this.toastr.info('This is information', 'Notification');
  }

  showWarning(): void {
    this.toastr.warning('There is a warning that needs attention', 'Warning', { duration: 6000 });
  }

  showError(): void {
    this.toastr.error('A critical error has occurred', 'Error');
  }

  showCustom(): void {
    this.toastr.show({
      title: 'Custom Toast',
      message: 'Do you want to undo the recent action?',
      variant: 'default',
      autoClose: false,
      actions: [
        {
          id: 'undo',
          label: 'Undo',
          variant: 'primary',
          handler: () => {
            // Handle undo action
          }
        },
        {
          id: 'view',
          label: 'Details',
          variant: 'link',
          handler: () => {
            // Handle view details action
          },
          dismissOnClick: false
        }
      ]
    });
  }
}
