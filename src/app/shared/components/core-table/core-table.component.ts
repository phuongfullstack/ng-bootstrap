import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  CoreTableAlign,
  CoreTableColumn,
  CoreTableFilterEvent,
  CoreTablePageEvent,
  CoreTableRowToggleEvent,
  CoreTableSelectionToggleEvent,
  CoreTableSize,
  CoreTableSortDirection,
  CoreTableSortEvent
} from './core-table.types';

@Component({
  selector: 'core-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './core-table.component.html',
  styleUrls: ['./core-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreTableComponent<T = unknown> {
  @Input() data: T[] = [];
  @Input() columns: CoreTableColumn[] = [];

  // Appearance
  @Input() striped = true;
  @Input() hover = true;
  @Input() bordered = false;
  @Input() size: CoreTableSize = 'md';
  @Input() showHeader = true;
  @Input() showFooter = false;

  // Loading & empty state
  @Input() loading = false;
  @Input() emptyMessage = 'No data available.';

  // Paging
  @Input() pageable = false;
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [10, 25, 50];
  @Input() totalItems?: number;

  // Sorting
  @Input() sortable = false;
  @Input() sortField?: string;
  @Input() sortDirection: CoreTableSortDirection = null;
  @Input() serverSort = false;

  // Filtering
  @Input() filterable = false;
  @Input() globalFilter = false;
  @Input() filterPlaceholder = 'Search...';

  // Selection
  @Input() selectable = false;
  @Input() selectionMode: 'single' | 'multiple' = 'single';
  @Input() selectedKeys: Array<string | number> = [];
  @Input() rowKey = 'id';

  // Expandable rows
  @Input() expandable = false;
  @Input() expandOnRowClick = false;

  // Events
  @Output() sortChange = new EventEmitter<CoreTableSortEvent>();
  @Output() pageChange = new EventEmitter<CoreTablePageEvent>();
  @Output() filterChange = new EventEmitter<CoreTableFilterEvent>();
  @Output() globalFilterChange = new EventEmitter<string>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() rowDblClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() rowSelectionToggle = new EventEmitter<CoreTableSelectionToggleEvent<T>>();
  @Output() rowExpand = new EventEmitter<CoreTableRowToggleEvent<T>>();
  @Output() rowCollapse = new EventEmitter<CoreTableRowToggleEvent<T>>();

  protected get lastPage(): number {
    if (this.totalItems === undefined || this.totalItems === null) {
      return this.pageIndex;
    }
    if (!this.pageSize || this.pageSize <= 0) {
      return this.pageIndex;
    }
    return Math.ceil(this.totalItems / this.pageSize);
  }

  protected get tableClasses(): Record<string, boolean> {
    return {
      table: true,
      'table-striped': this.striped,
      'table-hover': this.hover,
      'table-bordered': this.bordered,
      'table-sm': this.size === 'sm',
      'table-lg': this.size === 'lg'
    };
  }

  protected trackByRow = (_: number, row: T): string | number | T => {
    const anyRow = row as any;
    return anyRow && this.rowKey in anyRow ? anyRow[this.rowKey] : row;
  };

  protected isColumnSortable(column: CoreTableColumn): boolean {
    return this.sortable && column.sortable !== false && !!column.field;
  }

  protected getColumnAlignClass(column: CoreTableColumn): string {
    const align: CoreTableAlign = column.align ?? 'left';
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-end';
      default:
        return 'text-start';
    }
  }

  protected isSortedColumn(column: CoreTableColumn): boolean {
    return !!this.sortField && this.sortField === column.field && !!this.sortDirection;
  }

  protected getSortIcon(column: CoreTableColumn): string {
    if (!this.isSortedColumn(column)) {
      return 'bi bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up-short' : 'bi bi-arrow-down-short';
  }

  protected onSort(column: CoreTableColumn): void {
    if (!this.isColumnSortable(column)) {
      return;
    }

    const isSameField = this.sortField === column.field;
    let nextDirection: CoreTableSortDirection;

    if (!isSameField) {
      nextDirection = 'asc';
    } else {
      switch (this.sortDirection) {
        case 'asc':
          nextDirection = 'desc';
          break;
        case 'desc':
          nextDirection = null;
          break;
        default:
          nextDirection = 'asc';
      }
    }

    this.sortField = column.field;
    this.sortDirection = nextDirection;

    this.sortChange.emit({
      field: column.field,
      direction: nextDirection
    });
  }

  protected onPageChange(pageIndex: number): void {
    if (!this.pageable || pageIndex === this.pageIndex || pageIndex <= 0) {
      return;
    }

    this.pageIndex = pageIndex;

    this.pageChange.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  protected onPageSizeChange(pageSize: string | number): void {
    const parsed = Number(pageSize);
    if (Number.isNaN(parsed) || parsed <= 0 || parsed === this.pageSize) {
      return;
    }

    this.pageSize = parsed;
    this.pageIndex = 1;

    this.pageChange.emit({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  protected onGlobalFilterChange(value: string): void {
    if (!this.globalFilter) {
      return;
    }
    this.globalFilterChange.emit(value);
  }

  protected onRowClick(row: T): void {
    this.rowClick.emit(row);

    if (this.expandable && this.expandOnRowClick) {
      this.toggleRowExpand(row);
    }

    if (this.selectable && this.selectionMode === 'single') {
      this.toggleRowSelection(row);
    }
  }

  protected onRowDblClick(row: T): void {
    this.rowDblClick.emit(row);
  }

  protected isRowSelected(row: T): boolean {
    const anyRow = row as any;
    const key = anyRow && this.rowKey in anyRow ? anyRow[this.rowKey] : undefined;
    return key !== undefined && this.selectedKeys.includes(key);
  }

  protected toggleRowSelection(row: T): void {
    if (!this.selectable) {
      return;
    }

    const anyRow = row as any;
    const key = anyRow && this.rowKey in anyRow ? anyRow[this.rowKey] : undefined;
    if (key === undefined) {
      return;
    }

    const isSelected = this.selectedKeys.includes(key);
    let nextKeys: Array<string | number>;

    if (this.selectionMode === 'single') {
      nextKeys = isSelected ? [] : [key];
    } else {
      nextKeys = isSelected
        ? this.selectedKeys.filter(k => k !== key)
        : [...this.selectedKeys, key];
    }

    this.selectedKeys = nextKeys;

    this.rowSelectionToggle.emit({
      row,
      selected: !isSelected
    });

    const selectedRows = this.data.filter(r => {
      const anySelectedRow = r as any;
      const rowKey = anySelectedRow && this.rowKey in anySelectedRow ? anySelectedRow[this.rowKey] : undefined;
      return rowKey !== undefined && nextKeys.includes(rowKey);
    });
    this.selectionChange.emit(selectedRows);
  }

  protected isRowExpanded(row: T): boolean {
    return (row as any).__expanded === true;
  }

  protected toggleRowExpand(row: T): void {
    if (!this.expandable) {
      return;
    }

    const current = this.isRowExpanded(row);
    (row as any).__expanded = !current;

    const payload: CoreTableRowToggleEvent<T> = {
      row,
      expanded: !current
    };

    if (payload.expanded) {
      this.rowExpand.emit(payload);
    } else {
      this.rowCollapse.emit(payload);
    }
  }
}


