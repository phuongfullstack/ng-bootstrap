import { Type } from '@angular/core';
import { DemoSidebarItem } from '@shared/components/sidebar/sidebar.component';
import { InputDemoComponent } from './components/input-demo/input-demo.component';
import { DropdownDemoComponent } from './components/dropdown-demo/dropdown-demo.component';
import { CheckboxDemoComponent } from './components/checkbox-demo/checkbox-demo.component';
import { RadioDemoComponent } from './components/radio-demo/radio-demo.component';
import { AutocompleteDemoComponent } from './components/autocomplete-demo/autocomplete-demo.component';
import { ModalDemoComponent } from './components/modal-demo/modal-demo.component';
import { DemoPlaceholderComponent } from './components/demo-placeholder/demo-placeholder.component';
import { ToastrDemoComponent } from './components/toastr-demo/toastr-demo.component';
import { DatetimeDemoComponent } from './components/datetime-demo/datetime-demo.component';
import { TableDemoComponent } from './components/table-demo/table-demo.component';
import { ProgressDemoComponent } from './components/progress-demo/progress-demo.component';

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
    component: DatetimeDemoComponent
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
    id: 'radio',
    title: 'Radio Button',
    component: RadioDemoComponent
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
    id: 'table',
    title: 'Table',
    component: TableDemoComponent
  },
  {
    id: 'progress',
    title: 'Progress',
    component: ProgressDemoComponent
  },
];

