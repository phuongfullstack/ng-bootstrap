import { Type } from '@angular/core';
import { DemoSidebarItem } from '@shared/components/sidebar/sidebar.component';
import { InputDemoComponent } from './components/input-demo/input-demo.component';
import { DropdownDemoComponent } from './components/dropdown-demo/dropdown-demo.component';
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { DemoPlaceholderComponent } from './components/demo-placeholder/demo-placeholder.component';

export interface DemoComponentMeta extends DemoSidebarItem {
  component: Type<unknown>;
  placeholderMessage?: string;
}

export const CORE_DEMO_COMPONENTS: DemoComponentMeta[] = [
  {
    id: 'input',
    title: 'Input',
    component: InputDemoComponent
  },
  {
    id: 'datetime',
    title: 'DateTime Picker',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'Các dạng date/time picker sẽ được bổ sung trong giai đoạn tiếp theo.'
  },
  {
    id: 'dropdown',
    title: 'Dropdown List',
    component: DropdownDemoComponent
  },
  {
    id: 'checkbox',
    title: 'Checkbox',
    component: CheckboxDemoComponent
  },
  {
    id: 'autocomplete',
    title: 'AutoComplete Box',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'AutoComplete với debounce & custom template đang phát triển.'
  },
  {
    id: 'modal',
    title: 'Modal',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'Modal chuẩn Bootstrap với API service sẽ được bổ sung sớm.'
  },
  {
    id: 'dialog',
    title: 'Dialog',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'Dialog confirm/alert/prompt đang trong kế hoạch.'
  },
  {
    id: 'toastr',
    title: 'Toastr',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'Toastr queue & progression sẽ được hoàn thiện tiếp.'
  },
  {
    id: 'custom-dialog',
    title: 'Custom Dialog',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'Custom dialog hỗ trợ dynamic component sẽ xuất hiện sớm.'
  },
  {
    id: 'error-message',
    title: 'Error Message',
    component: DemoPlaceholderComponent,
    placeholderMessage: 'Thư viện error message linh hoạt đang phát triển.'
  }
];

