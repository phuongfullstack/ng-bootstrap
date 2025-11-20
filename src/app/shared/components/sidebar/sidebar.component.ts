import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface DemoSidebarItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-demo-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class DemoSidebarComponent {
  @Input({ required: true }) items: DemoSidebarItem[] = [];
  @Input({ required: true }) activeId!: string;

  @Output() itemSelected = new EventEmitter<string>();

  protected trackById(_: number, item: DemoSidebarItem): string {
    return item.id;
  }

  protected selectItem(id: string): void {
    if (id !== this.activeId) {
      this.itemSelected.emit(id);
    }
  }
}

