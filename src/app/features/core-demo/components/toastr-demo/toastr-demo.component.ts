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
    this.toastr.success('Đã lưu thành công', 'Thành công');
  }

  showInfo(): void {
    this.toastr.info('Đây là thông tin', 'Thông báo');
  }

  showWarning(): void {
    this.toastr.warning('Có cảnh báo cần chú ý', 'Cảnh báo', { duration: 6000 });
  }

  showError(): void {
    this.toastr.error('Đã xảy ra lỗi nghiêm trọng', 'Lỗi');
  }

  showCustom(): void {
    this.toastr.show({
      title: 'Custom Toast',
      message: 'Bạn có muốn hoàn tác thao tác vừa rồi?',
      variant: 'default',
      autoClose: false,
      actions: [
        {
          id: 'undo',
          label: 'Hoàn tác',
          variant: 'primary',
          handler: () => console.log('Undo action triggered')
        },
        {
          id: 'view',
          label: 'Chi tiết',
          variant: 'link',
          handler: () => console.log('View details clicked'),
          dismissOnClick: false
        }
      ]
    });
  }
}
