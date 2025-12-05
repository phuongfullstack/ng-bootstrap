export type CoreTableSize = 'sm' | 'md' | 'lg';
export type CoreTableAlign = 'left' | 'center' | 'right';
export type CoreTableSortDirection = 'asc' | 'desc' | null;

export interface CoreTableColumn {
  field: string;
  header: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  align?: CoreTableAlign;
  type?: 'text' | 'number' | 'date' | 'badge' | 'actions' | 'custom';
  sticky?: 'left' | 'right';
}

export interface CoreTableSortEvent {
  field: string;
  direction: CoreTableSortDirection;
}

export interface CoreTablePageEvent {
  pageIndex: number;
  pageSize: number;
}

export interface CoreTableFilterEvent {
  field?: string;
  value: unknown;
}

export interface CoreTableRowToggleEvent<T = unknown> {
  row: T;
  expanded: boolean;
}

export interface CoreTableSelectionToggleEvent<T = unknown> {
  row: T;
  selected: boolean;
}


