import { CommonModule, NgComponentOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
  styleUrl: './core-demo.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreDemoPage implements OnInit {
  ngOnInit(): void {
    // Demo components initialized
  }
  protected readonly demos = CORE_DEMO_COMPONENTS;
  protected activeComponentId = this.demos[0]?.id ?? '';
  protected readonly placeholderComponent = DemoPlaceholderComponent;
  protected readonly defaultPlaceholderMessage =
    'Component is under development. Please check back later.';

  protected get activeDemo(): DemoComponentMeta | null {
    return (
      this.demos.find((demo) => demo.id === this.activeComponentId) ?? null
    );
  }

  protected handleSidebarSelect(id: string): void {
    this.activeComponentId = id;
  }

}


