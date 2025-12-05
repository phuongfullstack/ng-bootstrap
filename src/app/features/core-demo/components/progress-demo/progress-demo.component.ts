import { Component, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreProgressComponent } from '@shared/components/core-progress/core-progress.component';
import { CoreProgressItem, CoreProgressVariant } from '@shared/components/core-progress/core-progress.types';
import { CoreToastrService } from '@shared/services/core-toastr.service';
import { CoreButtonComponent } from '@shared/components/core-button/core-button.component';

type ProgressEventType = 'valueChange' | 'completed' | 'started' | 'mouseEnter' | 'mouseLeave' | 'clicked';

interface ProgressEventLogEntry {
  type: ProgressEventType;
  value?: number;
  message?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-progress-demo',
  standalone: true,
  imports: [CommonModule, CoreProgressComponent, CoreButtonComponent],
  templateUrl: './progress-demo.component.html',
  styleUrl: './progress-demo.component.css'
})
export class ProgressDemoComponent implements OnDestroy {
  basicProgress = signal(0);
  basicMax = 100;

  variantProgress = signal(45);
  currentVariant: CoreProgressVariant = 'primary';

  stripedProgress = signal(0);
  animatedProgress = signal(0);
  animatedInterval?: number;

  labeledProgress = signal(0);
  customLabel = '';

  indeterminateActive = signal(false);

  bufferProgress = signal(0);
  bufferValue = signal(0);

  multiProgress: CoreProgressItem[] = [
    { value: 25, variant: 'primary', label: 'Primary' },
    { value: 50, variant: 'success', label: 'Success' },
    { value: 75, variant: 'warning', label: 'Warning' }
  ];

  stackedProgress: CoreProgressItem[] = [
    { value: 30, variant: 'primary' },
    { value: 20, variant: 'success' },
    { value: 15, variant: 'warning' }
  ];

  dynamicProgress = signal(0);
  dynamicInterval?: number;
  isRunning = signal(false);

  protected readonly eventTypeLabel: Record<ProgressEventType, string> = {
    valueChange: 'Value Change',
    completed: 'Completed',
    started: 'Started',
    mouseEnter: 'Mouse Enter',
    mouseLeave: 'Mouse Leave',
    clicked: 'Clicked'
  };

  protected eventLog: ProgressEventLogEntry[] = [];

  constructor(private readonly toastr: CoreToastrService) {
    // Initialize some values
    this.basicProgress.set(25);
    this.variantProgress.set(45);
    this.labeledProgress.set(60);
    this.bufferProgress.set(40);
    this.bufferValue.set(70);
  }

  increaseBasicProgress(): void {
    this.basicProgress.set(Math.min(this.basicProgress() + 10, this.basicMax));
  }

  decreaseBasicProgress(): void {
    this.basicProgress.set(Math.max(this.basicProgress() - 10, 0));
  }

  resetBasicProgress(): void {
    this.basicProgress.set(0);
  }

  changeVariant(variant: CoreProgressVariant): void {
    this.currentVariant = variant;
    this.toastr.info(`Changed variant to <strong>${variant}</strong>`, 'Variant changed');
  }

  updateVariantProgress(value: number): void {
    this.variantProgress.set(value);
  }

  updateStripedProgress(value: number): void {
    this.stripedProgress.set(value);
  }

  startAnimatedProgress(): void {
    if (this.animatedInterval) {
      return;
    }

    this.animatedProgress.set(0);
    this.animatedInterval = window.setInterval(() => {
      const current = this.animatedProgress();
      if (current >= 100) {
        this.stopAnimatedProgress();
        return;
      }
      this.animatedProgress.set(current + 2);
    }, 100);
  }

  stopAnimatedProgress(): void {
    if (this.animatedInterval) {
      clearInterval(this.animatedInterval);
      this.animatedInterval = undefined;
    }
  }

  updateLabeledProgress(value: number): void {
    this.labeledProgress.set(value);
  }

  setCustomLabel(label: string): void {
    this.customLabel = label;
  }

  updateBufferProgress(value: number): void {
    this.bufferProgress.set(value);
  }

  updateBufferValue(value: number): void {
    this.bufferValue.set(value);
  }

  startDynamicProgress(): void {
    if (this.isRunning()) {
      return;
    }

    this.isRunning.set(true);
    this.dynamicProgress.set(0);
    this.dynamicInterval = window.setInterval(() => {
      const current = this.dynamicProgress();
      if (current >= 100) {
        this.stopDynamicProgress();
        return;
      }
      this.dynamicProgress.set(current + 1);
    }, 50);
  }

  stopDynamicProgress(): void {
    if (this.dynamicInterval) {
      clearInterval(this.dynamicInterval);
      this.dynamicInterval = undefined;
    }
    this.isRunning.set(false);
  }

  resetDynamicProgress(): void {
    this.stopDynamicProgress();
    this.dynamicProgress.set(0);
  }

  onValueChange(value: number): void {
    this.pushEvent({
      type: 'valueChange',
      value,
      message: `Progress value changed to ${value}%`,
      timestamp: new Date()
    });
    this.toastr.info(`Progress value changed to <strong>${value}%</strong>`, 'Value changed', {
      autoClose: true,
      duration: 2000
    });
  }

  onCompleted(): void {
    this.pushEvent({
      type: 'completed',
      value: 100,
      message: 'Progress completed!',
      timestamp: new Date()
    });
    this.toastr.success('Progress completed! 🎉', 'Completed', {
      autoClose: true,
      duration: 3000
    });
  }

  onStarted(): void {
    this.pushEvent({
      type: 'started',
      message: 'Progress started',
      timestamp: new Date()
    });
    this.toastr.info('Progress started', 'Started', {
      autoClose: true,
      duration: 2000
    });
  }

  onMouseEnter(_event: MouseEvent): void {
    this.pushEvent({
      type: 'mouseEnter',
      message: 'Mouse entered progress bar',
      timestamp: new Date()
    });
  }

  onMouseLeave(_event: MouseEvent): void {
    this.pushEvent({
      type: 'mouseLeave',
      message: 'Mouse left progress bar',
      timestamp: new Date()
    });
  }

  onProgressClick(_event: MouseEvent): void {
    this.pushEvent({
      type: 'clicked',
      message: 'Progress bar clicked',
      timestamp: new Date()
    });
    this.toastr.info('Progress bar clicked', 'Click event', {
      autoClose: true,
      duration: 1500
    });
  }

  private pushEvent(entry: ProgressEventLogEntry): void {
    this.eventLog = [entry, ...this.eventLog].slice(0, 20);
  }

  updateMultiProgress(index: number, value: number): void {
    if (this.multiProgress[index]) {
      this.multiProgress[index].value = Math.max(0, Math.min(value, 100));
      this.multiProgress = [...this.multiProgress];
    }
  }

  updateStackedProgress(index: number, value: number): void {
    if (this.stackedProgress[index]) {
      this.stackedProgress[index].value = Math.max(0, Math.min(value, 100));
      this.stackedProgress = [...this.stackedProgress];
    }
  }

  ngOnDestroy(): void {
    if (this.animatedInterval) {
      clearInterval(this.animatedInterval);
    }
    if (this.dynamicInterval) {
      clearInterval(this.dynamicInterval);
    }
  }
}

