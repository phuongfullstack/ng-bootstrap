import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'form-modal-content',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label class="form-label">Name</label>
        <input class="form-control" formControlName="name" />
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input class="form-control" formControlName="email" />
      </div>
    </form>
  `
})
export class FormModalContentComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getValue() {
    return this.form.value;
  }

  onSubmit() {
    // no-op; parent modal handles submit via button handler
  }
}
