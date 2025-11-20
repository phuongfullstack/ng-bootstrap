import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DemoSidebarComponent, DemoSidebarItem } from '@shared/components';
import { CORE_DEMO_COMPONENTS, DemoComponentMeta } from './demo-items';
import { DemoPlaceholderComponent } from './components/demo-placeholder/demo-placeholder.component';

@Component({
  selector: 'app-core-demo-page',
  standalone: true,
  imports: [
    CommonModule,
    DemoSidebarComponent,
    NgComponentOutlet,
    DemoPlaceholderComponent
  ],
  templateUrl: './core-demo.page.html',
  styleUrl: './core-demo.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreDemoPage {
  protected readonly demos = CORE_DEMO_COMPONENTS;
  protected activeComponentId = this.demos[0]?.id ?? '';
  protected readonly placeholderComponent = DemoPlaceholderComponent;
  protected readonly defaultPlaceholderMessage =
    'Component đang được phát triển. Vui lòng quay lại sau.';

  protected get sidebarItems() {
    return this.demos.map(({ id, title }) => ({
      id,
      title
    }));
  }

  protected get activeDemo(): DemoComponentMeta | null {
    return (
      this.demos.find((demo) => demo.id === this.activeComponentId) ?? null
    );
  }

  protected handleSidebarSelect(id: string): void {
    this.activeComponentId = id;
  }
}


