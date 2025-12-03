import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '@core/services/modal.service';
import { FormModalContentComponent } from './form-modal-content.component';
import { CustomModalContentComponent } from '../custom-modal-content.component';

@Component({
  selector: 'modal-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-demo.component.html',
  styleUrls: ['./modal-demo.component.css']
})
export class ModalDemoComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void { }

  // Demo 1: Simple alert modal
  openAlertModal(): void {
    this.modalService.open({
      title: 'Thông báo',
      size: 'sm',
      closable: true,
      buttons: [
        {
          label: 'OK',
          style: 'primary',
          handler: () => console.log('Alert acknowledged')
        }
      ]
      ,
      data: { contentHtml: '<p>Đây là thông báo quan trọng.</p>' }
    }).subscribe(result => {
      console.log('Alert modal closed with result:', result);
    });
  }

  // Demo 2: Confirmation modal
  openConfirmModal(): void {
    this.modalService.open({
      title: 'Xác nhận',
      size: 'md',
      closable: true,
      buttons: [
        {
          label: 'Hủy',
          style: 'secondary',
          closeOnClick: true
        },
        {
          label: 'Xác nhận',
          style: 'primary',
          handler: () => console.log('Confirmed!'),
          closeOnClick: true
        }
      ]
      ,
      data: { contentHtml: '<p>Bạn có chắc chắn muốn thực hiện hành động này?</p>' }
    }).subscribe(result => {
      console.log('Confirm modal closed with result:', result);
    });
  }

  // Demo 3: Form modal (using component instance)
  openFormModal(): void {
    // Open modal hosting a dynamic form component
    this.modalService.open({
      title: 'Nhập thông tin',
      size: 'lg',
      closable: true,
      content: FormModalContentComponent,
      buttons: [
        {
          label: 'Hủy',
          style: 'secondary',
          closeOnClick: true
        },
        {
          label: 'Lưu',
          style: 'success',
          // handler receives modal instance and dynamic component instance
          handler: (modal, dyn) => {
            const value = dyn?.getValue ? dyn.getValue() : dyn?.form?.value;
            modal?.close(value);
          },
          closeOnClick: false
        }
      ]
    }).subscribe(result => {
      console.log('Form modal closed with result:', result);
    });
  }

  // Demo 4: Custom styled modal
  openCustomModal(): void {
    this.modalService.open({
      title: 'Modal Preview',
      size: 'xl',
      closable: true,
      backdrop: true,
      customClass: 'custom-modal',
      content: CustomModalContentComponent,
      contentProps: {
        heading: 'Quick Note',
        description: 'Use this modal to add a short note. The note will be returned when you press Save Note.'
      },
      buttons: [
        { label: 'Cancel', style: 'secondary', closeOnClick: true },
        {
          label: 'Save Note',
          style: 'primary',
          handler: (modal, dyn) => {
            const result = dyn?.getResult ? dyn.getResult() : null;
            modal?.close(result);
          },
          closeOnClick: false
        }
      ]
    }).subscribe(result => {
      console.log('Custom modal closed with result:', result);
    });
  }
}
