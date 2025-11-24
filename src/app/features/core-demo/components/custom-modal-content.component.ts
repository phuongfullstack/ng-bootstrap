import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'custom-modal-content',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-2">
      <h5 *ngIf="heading">{{ heading }}</h5>
      <p *ngIf="description">{{ description }}</p>

      <div *ngIf="imageUrl" class="text-center mb-3">
        <img [src]="imageUrl" alt="preview" class="img-fluid" style="max-height:200px;" />
      </div>

      <div class="mb-3">
        <label class="form-label">Note</label>
        <textarea class="form-control" [(ngModel)]="note" rows="3"></textarea>
      </div>
    </div>
  `
})
export class CustomModalContentComponent {
  @Input() heading?: string;
  @Input() description?: string;
  @Input() imageUrl?: string;

  note = '';

  getResult() {
    return {
      note: this.note
    };
  }
}
