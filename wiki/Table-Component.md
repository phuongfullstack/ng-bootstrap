# Table Component

The `core-table` component provides a powerful, feature-rich data table with Bootstrap 5.3 styling, supporting sorting, pagination, filtering, row selection, expandable rows, and more.

## Table of Contents
- [Basic Usage](#basic-usage)
- [Properties](#properties)
- [Column Configuration](#column-configuration)
- [Events](#events)
- [Examples](#examples)
- [Accessibility](#accessibility)
- [Tips & Best Practices](#tips--best-practices)

---

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { CoreTableComponent } from '@shared/components';
import { CoreTableColumn } from '@shared/components/core-table/core-table.types';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="users" 
      [columns]="columns"
      [striped]="true"
      [hover]="true">
    </core-table>
  `
})
export class ExampleComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 28 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35 }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', width: '80px' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'age', header: 'Age', type: 'number', align: 'right' }
  ];
}
```

---

## Properties

### Input Properties

#### Appearance

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `striped` | `boolean` | `true` | Adds zebra-striping to table rows |
| `hover` | `boolean` | `true` | Enables hover effect on table rows |
| `bordered` | `boolean` | `false` | Adds borders on all sides of table cells |
| `size` | `CoreTableSize` | `'md'` | Table size: `'sm'`, `'md'`, or `'lg'` |
| `showHeader` | `boolean` | `true` | Shows or hides table header |
| `showFooter` | `boolean` | `false` | Shows or hides table footer |

#### Data

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `data` | `T[]` | `[]` | Array of data objects to display |
| `columns` | `CoreTableColumn[]` | `[]` | Column configuration array |
| `rowKey` | `string` | `'id'` | Property name to use as unique row identifier |

#### Loading & Empty State

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `loading` | `boolean` | `false` | Shows loading spinner overlay |
| `emptyMessage` | `string` | `'No data available.'` | Message shown when table is empty |

#### Pagination

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `pageable` | `boolean` | `false` | Enables pagination controls |
| `pageIndex` | `number` | `1` | Current page number (1-based) |
| `pageSize` | `number` | `10` | Number of rows per page |
| `pageSizeOptions` | `number[]` | `[10, 25, 50]` | Available page size options |
| `totalItems` | `number` \| `undefined` | `undefined` | Total number of items (for server-side pagination) |

#### Sorting

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sortable` | `boolean` | `false` | Enables sorting functionality |
| `sortField` | `string` \| `undefined` | `undefined` | Currently sorted field |
| `sortDirection` | `CoreTableSortDirection` | `null` | Sort direction: `'asc'`, `'desc'`, or `null` |
| `serverSort` | `boolean` | `false` | Indicates server-side sorting (disables client sorting) |

#### Filtering

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `filterable` | `boolean` | `false` | Enables column filtering |
| `globalFilter` | `boolean` | `false` | Shows global search input above table |
| `filterPlaceholder` | `string` | `'Search...'` | Placeholder text for filter input |

#### Selection

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Enables row selection |
| `selectionMode` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `selectedKeys` | `Array<string \| number>` | `[]` | Array of selected row keys |

#### Expandable Rows

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `expandable` | `boolean` | `false` | Enables expandable rows |
| `expandOnRowClick` | `boolean` | `false` | Expands/collapses row on click |

---

## Column Configuration

The `CoreTableColumn` interface defines how each column is displayed and behaves.

### CoreTableColumn Interface

```typescript
interface CoreTableColumn {
  field: string;              // Property name from data object
  header: string;             // Column header text
  width?: string;             // Column width (e.g., '100px', '20%')
  sortable?: boolean;         // Override table sortable for this column
  filterable?: boolean;       // Override table filterable for this column
  align?: CoreTableAlign;     // Text alignment: 'left', 'center', 'right'
  type?: CoreTableColumnType; // Column type for formatting
  sticky?: 'left' | 'right';  // Makes column sticky on scroll
}
```

### Column Types

| Type | Description | Example |
|------|-------------|---------|
| `'text'` | Plain text (default) | Any string value |
| `'number'` | Formatted number | `1234.56` → `1,234.56` |
| `'date'` | Formatted date | `Date` → `Jan 1, 2024` |
| `'badge'` | Displays value in a badge | Renders with Bootstrap badge styling |
| `'actions'` | Reserved for action buttons | Custom template slot |
| `'custom'` | Custom rendering | For template content |

### Column Alignment

- `'left'` - Left-aligned text (default)
- `'center'` - Center-aligned text
- `'right'` - Right-aligned text (recommended for numbers)

---

## Events

### Sort Event

```typescript
interface CoreTableSortEvent {
  field: string;                    // Field being sorted
  direction: CoreTableSortDirection; // 'asc', 'desc', or null
}
```

| Event | Type | Description |
|-------|------|-------------|
| `sortChange` | `EventEmitter<CoreTableSortEvent>` | Emitted when sort state changes |

### Page Event

```typescript
interface CoreTablePageEvent {
  pageIndex: number;  // Current page (1-based)
  pageSize: number;   // Rows per page
}
```

| Event | Type | Description |
|-------|------|-------------|
| `pageChange` | `EventEmitter<CoreTablePageEvent>` | Emitted when page or page size changes |

### Filter Events

```typescript
interface CoreTableFilterEvent {
  field?: string;     // Field being filtered (optional)
  value: unknown;     // Filter value
}
```

| Event | Type | Description |
|-------|------|-------------|
| `filterChange` | `EventEmitter<CoreTableFilterEvent>` | Emitted when column filter changes |
| `globalFilterChange` | `EventEmitter<string>` | Emitted when global filter changes |

### Row Events

| Event | Type | Description |
|-------|------|-------------|
| `rowClick` | `EventEmitter<T>` | Emitted when row is clicked |
| `rowDblClick` | `EventEmitter<T>` | Emitted when row is double-clicked |

### Selection Events

```typescript
interface CoreTableSelectionToggleEvent<T> {
  row: T;           // The row being toggled
  selected: boolean; // New selection state
}
```

| Event | Type | Description |
|-------|------|-------------|
| `selectionChange` | `EventEmitter<T[]>` | Emitted when selection changes (returns all selected rows) |
| `rowSelectionToggle` | `EventEmitter<CoreTableSelectionToggleEvent<T>>` | Emitted when individual row selection toggles |

### Expandable Row Events

```typescript
interface CoreTableRowToggleEvent<T> {
  row: T;           // The row being toggled
  expanded: boolean; // New expanded state
}
```

| Event | Type | Description |
|-------|------|-------------|
| `rowExpand` | `EventEmitter<CoreTableRowToggleEvent<T>>` | Emitted when row is expanded |
| `rowCollapse` | `EventEmitter<CoreTableRowToggleEvent<T>>` | Emitted when row is collapsed |

---

## Examples

### Basic Table

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="products" 
      [columns]="columns">
    </core-table>
  `
})
export class BasicTableExample {
  products = [
    { id: 1, name: 'Laptop', price: 999.99, stock: 15 },
    { id: 2, name: 'Mouse', price: 29.99, stock: 50 },
    { id: 3, name: 'Keyboard', price: 79.99, stock: 30 }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', width: '80px' },
    { field: 'name', header: 'Product' },
    { field: 'price', header: 'Price', type: 'number', align: 'right' },
    { field: 'stock', header: 'Stock', type: 'number', align: 'center' }
  ];
}
```

### Table with Sorting

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="users" 
      [columns]="columns"
      [sortable]="true"
      [sortField]="sortField"
      [sortDirection]="sortDirection"
      (sortChange)="onSort($event)">
    </core-table>
  `
})
export class SortableTableExample {
  users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', joined: new Date('2023-01-15') },
    { id: 2, name: 'Bob', email: 'bob@example.com', joined: new Date('2023-03-20') },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', joined: new Date('2023-02-10') }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'joined', header: 'Joined', type: 'date', sortable: true }
  ];

  sortField?: string;
  sortDirection: CoreTableSortDirection = null;

  onSort(event: CoreTableSortEvent) {
    this.sortField = event.field;
    this.sortDirection = event.direction;

    if (event.direction) {
      this.users.sort((a, b) => {
        const aValue = (a as any)[event.field];
        const bValue = (b as any)[event.field];
        
        if (aValue < bValue) return event.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return event.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }
}
```

### Table with Pagination

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="currentPageData" 
      [columns]="columns"
      [pageable]="true"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [totalItems]="totalItems"
      (pageChange)="onPageChange($event)">
    </core-table>
  `
})
export class PaginatedTableExample {
  allData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`
  }));

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' }
  ];

  pageIndex = 1;
  pageSize = 10;
  totalItems = this.allData.length;

  get currentPageData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.allData.slice(start, end);
  }

  onPageChange(event: CoreTablePageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }
}
```

### Table with Row Selection

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent, CommonModule],
  template: `
    <div class="mb-3">
      <strong>Selected:</strong> {{ selectedRows.length }} row(s)
    </div>

    <core-table 
      [data]="items" 
      [columns]="columns"
      [selectable]="true"
      [selectionMode]="'multiple'"
      [selectedKeys]="selectedKeys"
      (selectionChange)="onSelectionChange($event)"
      (rowSelectionToggle)="onRowToggle($event)">
    </core-table>
  `
})
export class SelectableTableExample {
  items = [
    { id: 1, task: 'Review code', status: 'Done' },
    { id: 2, task: 'Write tests', status: 'In Progress' },
    { id: 3, task: 'Update docs', status: 'Todo' }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'task', header: 'Task' },
    { field: 'status', header: 'Status', type: 'badge' }
  ];

  selectedKeys: number[] = [];
  selectedRows: any[] = [];

  onSelectionChange(rows: any[]) {
    this.selectedRows = rows;
    console.log('Selected rows:', rows);
  }

  onRowToggle(event: CoreTableSelectionToggleEvent<any>) {
    console.log(`Row ${event.row.id} ${event.selected ? 'selected' : 'deselected'}`);
  }
}
```

### Single Selection Mode

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="options" 
      [columns]="columns"
      [selectable]="true"
      [selectionMode]="'single'"
      [selectedKeys]="selectedKeys"
      (selectionChange)="onSelect($event)">
    </core-table>
  `
})
export class SingleSelectExample {
  options = [
    { id: 1, name: 'Option A', description: 'First option' },
    { id: 2, name: 'Option B', description: 'Second option' },
    { id: 3, name: 'Option C', description: 'Third option' }
  ];

  columns: CoreTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' }
  ];

  selectedKeys: number[] = [];

  onSelect(rows: any[]) {
    if (rows.length > 0) {
      console.log('Selected option:', rows[0]);
    }
  }
}
```

### Table with Global Filter

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="filteredData" 
      [columns]="columns"
      [globalFilter]="true"
      [filterPlaceholder]="'Search users...'"
      (globalFilterChange)="onFilter($event)">
    </core-table>
  `
})
export class FilterableTableExample {
  allUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'User' }
  ];

  filteredData = [...this.allUsers];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' }
  ];

  onFilter(searchTerm: string) {
    const term = searchTerm.toLowerCase();
    this.filteredData = this.allUsers.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term)
    );
  }
}
```

### Expandable Rows

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="orders" 
      [columns]="columns"
      [expandable]="true"
      [expandOnRowClick]="true"
      (rowExpand)="onRowExpand($event)"
      (rowCollapse)="onRowCollapse($event)">
    </core-table>
  `
})
export class ExpandableTableExample {
  orders = [
    { 
      id: 1, 
      customer: 'John Doe', 
      total: 299.99,
      __expandedContent: 'Order details: 3 items, shipped on 2024-01-15'
    },
    { 
      id: 2, 
      customer: 'Jane Smith', 
      total: 149.99,
      __expandedContent: 'Order details: 1 item, delivered on 2024-01-10'
    }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'Order #' },
    { field: 'customer', header: 'Customer' },
    { field: 'total', header: 'Total', type: 'number', align: 'right' }
  ];

  onRowExpand(event: CoreTableRowToggleEvent<any>) {
    console.log('Expanded order:', event.row.id);
  }

  onRowCollapse(event: CoreTableRowToggleEvent<any>) {
    console.log('Collapsed order:', event.row.id);
  }
}
```

### Loading State

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <button (click)="loadData()" class="btn btn-primary mb-3">
      Load Data
    </button>

    <core-table 
      [data]="users" 
      [columns]="columns"
      [loading]="isLoading"
      [emptyMessage]="'No users found.'">
    </core-table>
  `
})
export class LoadingTableExample {
  users: any[] = [];
  columns: CoreTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' }
  ];
  
  isLoading = false;

  loadData() {
    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
      this.isLoading = false;
    }, 2000);
  }
}
```

### Server-Side Sorting and Pagination

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="data" 
      [columns]="columns"
      [sortable]="true"
      [serverSort]="true"
      [sortField]="sortField"
      [sortDirection]="sortDirection"
      [pageable]="true"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [totalItems]="totalItems"
      [loading]="loading"
      (sortChange)="onSort($event)"
      (pageChange)="onPageChange($event)">
    </core-table>
  `
})
export class ServerSideTableExample implements OnInit {
  data: any[] = [];
  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true }
  ];

  sortField?: string;
  sortDirection: CoreTableSortDirection = null;
  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;
  loading = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    
    this.apiService.getUsers({
      page: this.pageIndex,
      pageSize: this.pageSize,
      sortField: this.sortField,
      sortDirection: this.sortDirection
    }).subscribe(response => {
      this.data = response.items;
      this.totalItems = response.total;
      this.loading = false;
    });
  }

  onSort(event: CoreTableSortEvent) {
    this.sortField = event.field;
    this.sortDirection = event.direction;
    this.pageIndex = 1; // Reset to first page
    this.loadData();
  }

  onPageChange(event: CoreTablePageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}
```

### Table Sizes

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <h5>Small Table</h5>
    <core-table [data]="data" [columns]="columns" size="sm"></core-table>

    <h5 class="mt-4">Medium Table (Default)</h5>
    <core-table [data]="data" [columns]="columns" size="md"></core-table>

    <h5 class="mt-4">Large Table</h5>
    <core-table [data]="data" [columns]="columns" size="lg"></core-table>
  `
})
export class TableSizesExample {
  data = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID' },
    { field: 'name', header: 'Name' },
    { field: 'value', header: 'Value', type: 'number' }
  ];
}
```

### Column Alignment

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table [data]="products" [columns]="columns"></core-table>
  `
})
export class AlignmentExample {
  products = [
    { id: 1, name: 'Product A', price: 29.99, stock: 150 },
    { id: 2, name: 'Product B', price: 49.99, stock: 75 }
  ];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', align: 'center', width: '80px' },
    { field: 'name', header: 'Product', align: 'left' },
    { field: 'price', header: 'Price', type: 'number', align: 'right' },
    { field: 'stock', header: 'Stock', type: 'number', align: 'center' }
  ];
}
```

### Row Click Events

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <div *ngIf="selectedUser" class="alert alert-info mb-3">
      Last clicked: {{ selectedUser.name }}
    </div>

    <core-table 
      [data]="users" 
      [columns]="columns"
      (rowClick)="onRowClick($event)"
      (rowDblClick)="onRowDblClick($event)">
    </core-table>
  `
})
export class RowClickExample {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  columns: CoreTableColumn[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' }
  ];

  selectedUser: any = null;

  onRowClick(user: any) {
    this.selectedUser = user;
    console.log('Row clicked:', user);
  }

  onRowDblClick(user: any) {
    console.log('Row double-clicked:', user);
    // Navigate to detail view, open modal, etc.
  }
}
```

### Custom Row Key

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent],
  template: `
    <core-table 
      [data]="products" 
      [columns]="columns"
      [selectable]="true"
      rowKey="sku"
      [selectedKeys]="selectedSkus"
      (selectionChange)="onSelectionChange($event)">
    </core-table>
  `
})
export class CustomRowKeyExample {
  products = [
    { sku: 'PROD-001', name: 'Laptop', price: 999.99 },
    { sku: 'PROD-002', name: 'Mouse', price: 29.99 },
    { sku: 'PROD-003', name: 'Keyboard', price: 79.99 }
  ];

  columns: CoreTableColumn[] = [
    { field: 'sku', header: 'SKU' },
    { field: 'name', header: 'Product' },
    { field: 'price', header: 'Price', type: 'number', align: 'right' }
  ];

  selectedSkus: string[] = ['PROD-001'];

  onSelectionChange(products: any[]) {
    this.selectedSkus = products.map(p => p.sku);
    console.log('Selected SKUs:', this.selectedSkus);
  }
}
```

### Complete Example with All Features

```typescript
@Component({
  standalone: true,
  imports: [CoreTableComponent, CommonModule],
  template: `
    <div class="mb-3">
      <button class="btn btn-primary me-2" (click)="loadData()">
        Refresh Data
      </button>
      <span *ngIf="selectedRows.length > 0" class="badge bg-info">
        {{ selectedRows.length }} selected
      </span>
    </div>

    <core-table 
      [data]="currentPageData"
      [columns]="columns"
      [striped]="true"
      [hover]="true"
      [bordered]="false"
      size="md"
      [loading]="loading"
      [emptyMessage]="'No employees found.'"
      [sortable]="true"
      [sortField]="sortField"
      [sortDirection]="sortDirection"
      [pageable]="true"
      [pageIndex]="pageIndex"
      [pageSize]="pageSize"
      [pageSizeOptions]="[5, 10, 25, 50]"
      [totalItems]="totalItems"
      [globalFilter]="true"
      [filterPlaceholder]="'Search employees...'"
      [selectable]="true"
      [selectionMode]="'multiple'"
      [selectedKeys]="selectedKeys"
      [expandable]="true"
      (sortChange)="onSort($event)"
      (pageChange)="onPageChange($event)"
      (globalFilterChange)="onFilter($event)"
      (selectionChange)="onSelectionChange($event)"
      (rowClick)="onRowClick($event)"
      (rowExpand)="onRowExpand($event)">
    </core-table>
  `
})
export class CompleteTableExample implements OnInit {
  allData: any[] = [];
  filteredData: any[] = [];
  currentPageData: any[] = [];

  columns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', width: '80px', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'department', header: 'Department', sortable: true },
    { field: 'salary', header: 'Salary', type: 'number', align: 'right', sortable: true },
    { field: 'hireDate', header: 'Hire Date', type: 'date', sortable: true },
    { field: 'status', header: 'Status', type: 'badge' }
  ];

  loading = false;
  sortField?: string;
  sortDirection: CoreTableSortDirection = null;
  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;
  selectedKeys: number[] = [];
  selectedRows: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      this.allData = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        department: ['Engineering', 'Sales', 'HR', 'Marketing'][i % 4],
        salary: 50000 + (i * 1000),
        hireDate: new Date(2020, i % 12, (i % 28) + 1),
        status: ['Active', 'On Leave'][i % 2],
        __expandedContent: `Additional details for Employee ${i + 1}`
      }));

      this.filteredData = [...this.allData];
      this.updatePage();
      this.loading = false;
    }, 1000);
  }

  onSort(event: CoreTableSortEvent) {
    this.sortField = event.field;
    this.sortDirection = event.direction;
    
    if (event.direction) {
      this.filteredData.sort((a, b) => {
        const aValue = (a as any)[event.field];
        const bValue = (b as any)[event.field];
        
        if (aValue < bValue) return event.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return event.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    this.updatePage();
  }

  onPageChange(event: CoreTablePageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePage();
  }

  onFilter(searchTerm: string) {
    const term = searchTerm.toLowerCase();
    this.filteredData = this.allData.filter(emp =>
      emp.name.toLowerCase().includes(term) ||
      emp.department.toLowerCase().includes(term) ||
      emp.status.toLowerCase().includes(term)
    );
    this.pageIndex = 1;
    this.updatePage();
  }

  onSelectionChange(rows: any[]) {
    this.selectedRows = rows;
    console.log('Selected employees:', rows);
  }

  onRowClick(row: any) {
    console.log('Clicked employee:', row);
  }

  onRowExpand(event: CoreTableRowToggleEvent<any>) {
    console.log('Expanded employee:', event.row.id);
  }

  updatePage() {
    this.totalItems = this.filteredData.length;
    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.currentPageData = this.filteredData.slice(start, end);
  }
}
```

---

## Accessibility

The table component follows WCAG 2.1 accessibility guidelines:

### Semantic HTML

- Uses semantic `<table>`, `<thead>`, `<tbody>`, `<tfoot>`, `<th>`, and `<td>` elements
- Proper `scope` attributes on header cells
- Table headers always associated with data cells

### Keyboard Navigation

- **Tab** - Navigate through interactive elements (sort buttons, checkboxes, pagination controls)
- **Space/Enter** - Activate sort buttons and checkboxes
- **Arrow Keys** - Navigate pagination controls

### Screen Reader Support

- Loading state announced via `visually-hidden` spinner text
- Empty state messages properly announced
- Sort direction changes communicated
- Selection state changes announced through checkbox labels

### Focus Management

- Clear focus indicators on all interactive elements
- Logical tab order through table controls
- Focus visible on sort buttons and checkboxes

### ARIA Support

- `role="status"` on loading overlay
- Proper labeling of interactive controls
- Column headers announce sortability when applicable

### Best Practices

1. **Always provide meaningful column headers**
   ```typescript
   // Good
   columns: [
     { field: 'firstName', header: 'First Name' },
     { field: 'email', header: 'Email Address' }
   ]
   
   // Avoid
   columns: [
     { field: 'fn', header: 'FN' },
     { field: 'email', header: 'Email' }
   ]
   ```

2. **Use appropriate column types for better formatting**
   ```typescript
   columns: [
     { field: 'amount', header: 'Amount', type: 'number', align: 'right' },
     { field: 'date', header: 'Date', type: 'date' }
   ]
   ```

3. **Provide helpful empty messages**
   ```html
   <core-table 
     [data]="users"
     [columns]="columns"
     [emptyMessage]="'No users found. Try adjusting your filters.'">
   </core-table>
   ```

4. **Use loading state during data fetch**
   ```html
   <core-table 
     [data]="data"
     [columns]="columns"
     [loading]="isLoading">
   </core-table>
   ```

5. **Enable pagination for large datasets**
   ```html
   <!-- For datasets > 50 items -->
   <core-table 
     [data]="data"
     [columns]="columns"
     [pageable]="true"
     [pageSize]="25">
   </core-table>
   ```

---

## Tips & Best Practices

### 1. Performance Optimization

**Use trackBy for better performance with large datasets:**

The component uses `rowKey` internally for tracking. Ensure each row has a unique identifier:

```typescript
data = [
  { id: 1, name: 'Item 1' },  // 'id' is default rowKey
  { id: 2, name: 'Item 2' }
];
```

**For custom identifiers:**

```typescript
<core-table 
  [data]="products"
  [columns]="columns"
  rowKey="productCode">
</core-table>
```

### 2. Column Configuration

**Set column widths for better layout control:**

```typescript
columns: CoreTableColumn[] = [
  { field: 'id', header: 'ID', width: '80px' },        // Fixed width
  { field: 'name', header: 'Name' },                    // Auto width
  { field: 'actions', header: 'Actions', width: '120px' } // Fixed width
];
```

**Use appropriate alignments:**

```typescript
// Numbers: right-aligned
{ field: 'price', header: 'Price', type: 'number', align: 'right' }

// IDs: center-aligned
{ field: 'id', header: 'ID', align: 'center' }

// Text: left-aligned (default)
{ field: 'name', header: 'Name', align: 'left' }
```

### 3. Sorting

**Disable sort for specific columns:**

```typescript
columns: [
  { field: 'id', header: 'ID', sortable: true },
  { field: 'name', header: 'Name', sortable: true },
  { field: 'actions', header: 'Actions', sortable: false } // No sorting
]
```

**Implement custom sort logic:**

```typescript
onSort(event: CoreTableSortEvent) {
  if (event.direction) {
    this.data.sort((a, b) => {
      let comparison = 0;
      
      // Custom sorting logic
      if (event.field === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (event.field === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      }
      
      return event.direction === 'asc' ? comparison : -comparison;
    });
  }
}
```

### 4. Pagination

**Client-side pagination:**

```typescript
get currentPageData() {
  const start = (this.pageIndex - 1) * this.pageSize;
  return this.allData.slice(start, start + this.pageSize);
}
```

**Server-side pagination:**

```typescript
onPageChange(event: CoreTablePageEvent) {
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  
  // Fetch from server
  this.apiService.getData({
    page: this.pageIndex,
    size: this.pageSize
  }).subscribe(response => {
    this.data = response.items;
    this.totalItems = response.total;
  });
}
```

### 5. Selection

**Pre-select rows:**

```typescript
selectedKeys = [1, 3, 5]; // Pre-select rows with these IDs
```

**Access selected data:**

```typescript
onSelectionChange(selectedRows: any[]) {
  console.log('Selected IDs:', selectedRows.map(r => r.id));
  console.log('Selected count:', selectedRows.length);
  
  // Perform bulk operations
  if (selectedRows.length > 0) {
    this.bulkDelete(selectedRows);
  }
}
```

### 6. Filtering

**Implement debounced filtering:**

```typescript
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

filterSubject = new Subject<string>();

ngOnInit() {
  this.filterSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  ).subscribe(term => {
    this.applyFilter(term);
  });
}

onFilter(searchTerm: string) {
  this.filterSubject.next(searchTerm);
}

applyFilter(term: string) {
  // Perform filtering
  this.filteredData = this.allData.filter(/* ... */);
}
```

### 7. Loading State

**Show loading during async operations:**

```typescript
loadData() {
  this.loading = true;
  
  this.apiService.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.loading = false;
    },
    error: (error) => {
      console.error(error);
      this.loading = false;
    }
  });
}
```

### 8. Empty States

**Provide contextual empty messages:**

```typescript
// After filtering
get emptyMessage() {
  return this.hasActiveFilters 
    ? 'No results match your search. Try different keywords.'
    : 'No data available.';
}
```

### 9. Expandable Rows

**Add expanded content to row data:**

```typescript
data = [
  {
    id: 1,
    name: 'Order #1001',
    __expandedContent: 'Detailed order information goes here'
  }
];
```

**Load content on demand:**

```typescript
onRowExpand(event: CoreTableRowToggleEvent<any>) {
  const row = event.row;
  
  if (!row.__expandedContent) {
    // Load details on first expand
    this.apiService.getDetails(row.id).subscribe(details => {
      row.__expandedContent = details;
    });
  }
}
```

### 10. Responsive Tables

**Wrap table in responsive container:**

```html
<div class="table-responsive">
  <core-table [data]="data" [columns]="columns"></core-table>
</div>
```

**Consider showing fewer columns on mobile:**

```typescript
get responsiveColumns(): CoreTableColumn[] {
  if (this.isMobile) {
    return this.columns.filter(col => 
      ['id', 'name', 'status'].includes(col.field)
    );
  }
  return this.columns;
}
```

### 11. Error Handling

**Handle API errors gracefully:**

```typescript
loadData() {
  this.loading = true;
  
  this.apiService.getData().subscribe({
    next: (data) => {
      this.data = data;
      this.loading = false;
    },
    error: (error) => {
      console.error('Failed to load data:', error);
      this.loading = false;
      this.emptyMessage = 'Failed to load data. Please try again.';
    }
  });
}
```

### 12. Memory Management

**Clean up subscriptions:**

```typescript
export class TableComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 13. Testing

**Mock table data for testing:**

```typescript
const mockData = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Test Item ${i + 1}`,
  value: Math.random() * 100
}));

const mockColumns: CoreTableColumn[] = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'value', header: 'Value', type: 'number' }
];
```

### 14. Common Patterns

**Master-Detail Pattern:**

```typescript
// Show details when row is clicked
onRowClick(item: any) {
  this.selectedItem = item;
  this.showDetailPanel = true;
}
```

**Inline Editing:**

```typescript
// Use expandable rows for edit forms
onRowExpand(event: CoreTableRowToggleEvent<any>) {
  // Show edit form in expanded row
  event.row.__expandedContent = `<form>...</form>`;
}
```

**Bulk Actions:**

```typescript
// Perform actions on selected rows
deleteSelected() {
  if (this.selectedRows.length > 0) {
    const ids = this.selectedRows.map(r => r.id);
    this.apiService.bulkDelete(ids).subscribe(() => {
      this.loadData();
      this.selectedKeys = [];
    });
  }
}
```

---

## Related Components

- [Button Component](Button-Component.md) - Used for table actions and pagination
- [Modal Component](Modal-Component.md) - Use modals for row actions and confirmations

---

[← Back to Components Overview](Components-Overview.md) | [Home](Home.md)
