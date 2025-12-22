import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-demo-placeholder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './demo-placeholder.component.html',
  styleUrl: './demo-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoPlaceholderComponent {
  @Input({ required: true }) title!: string;
  @Input() message =
    'Component đang được phát triển. Vui lòng quay lại sau để xem bản demo đầy đủ.';
}

