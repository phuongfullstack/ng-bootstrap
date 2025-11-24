import { Type } from '@angular/core';
import { DemoSidebarItem } from '@shared/components/sidebar/sidebar.component';
import { InputDemoComponent } from './components/input-demo/input-demo.component';
import { DropdownDemoComponent } from './components/dropdown-demo/dropdown-demo.component';
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { AutocompleteDemoComponent } from './components/autocomplete-demo/autocomplete-demo.component';
import { ModalDemoComponent } from './components/modal-demo/modal-demo.component';
import { DemoPlaceholderComponent } from './components/demo-placeholder/demo-placeholder.component';
import { ToastrDemoComponent } from './components/toastr-demo/toastr-demo.component';

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
    component: AutocompleteDemoComponent
  },
  {
    id: 'modal',
    title: 'Modal',
    component: ModalDemoComponent
  },
  {
    id: 'toastr',
    title: 'Toastr',
    component: ToastrDemoComponent
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

