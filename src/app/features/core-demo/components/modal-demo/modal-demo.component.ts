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
  styleUrls: ['./modal-demo.component.scss']
})
export class ModalDemoComponent implements OnInit {

  constructor(private modalService: ModalService) { }

  ngOnInit(): void { }

  // Demo 1: Simple alert modal
  openAlertModal(): void {
    this.modalService.open({
      title: 'Notification',
      size: 'sm',
      closable: true,
      buttons: [
        {
          label: 'OK',
          style: 'primary',
          handler: () => {
            // Alert acknowledged
          }
        }
      ]
      ,
      data: { contentHtml: '<p>This is an important notification.</p>' }
    }).subscribe(result => {
      // Handle alert modal result
    });
  }

  // Demo 2: Confirmation modal
  openConfirmModal(): void {
    this.modalService.open({
      title: 'Confirm',
      size: 'md',
      closable: true,
      buttons: [
        {
          label: 'Cancel',
          style: 'secondary',
          closeOnClick: true
        },
        {
          label: 'Confirm',
          style: 'primary',
          handler: () => {
            // Handle confirmation
          },
          closeOnClick: true
        }
      ]
      ,
      data: { contentHtml: '<p>Are you sure you want to perform this action?</p>' }
    }).subscribe(result => {
      // Handle confirm modal result
    });
  }

  // Demo 3: Form modal (using component instance)
  openFormModal(): void {
    // Open modal hosting a dynamic form component
    this.modalService.open({
      title: 'Enter Information',
      size: 'lg',
      closable: true,
      content: FormModalContentComponent,
      buttons: [
        {
          label: 'Cancel',
          style: 'secondary',
          closeOnClick: true
        },
        {
          label: 'Save',
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
      // Handle form modal result with submitted data
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
      // Handle custom modal result
    });
  }
}
