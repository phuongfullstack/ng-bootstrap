import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreTableComponent } from '@shared/components/core-table/core-table.component';
import {
  CoreTableColumn,
  CoreTablePageEvent,
  CoreTableSortEvent
} from '@shared/components/core-table/core-table.types';
import { CoreToastrService } from '@shared/services/core-toastr.service';
import { TABLE_DEMO_USERS, type UserRow } from './table-demo.data';

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, CoreTableComponent],
  templateUrl: './table-demo.component.html',
  styleUrl: './table-demo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableDemoComponent {
  readonly columns: CoreTableColumn[] = [
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email', sortable: true },
    { field: 'role', header: 'Role', sortable: true, align: 'center' },
    { field: 'status', header: 'Status', type: 'badge', align: 'center' },
    { field: 'createdAt', header: 'Created At', type: 'date', sortable: true }
  ];

  private readonly allUsers: UserRow[] = TABLE_DEMO_USERS;

  pageIndex = 1;
  pageSize = 10;
  totalItems = this.allUsers.length;

  viewUsers: UserRow[] = [];
  private currentSort: CoreTableSortEvent | null = null;

  constructor(private readonly toastr: CoreToastrService) {
    this.updateView();
  }

  onSort(event: CoreTableSortEvent): void {
    this.currentSort = event;
    this.pageIndex = 1;
    this.updateView();

    const directionLabel =
      event.direction === 'asc' ? 'Ascending' : event.direction === 'desc' ? 'Descending' : 'None';

    this.toastr.info(
      `Sorted by <strong>${event.field}</strong> (${directionLabel})`,
      'Table sort',
      {
        autoClose: true,
        duration: 2500
      }
    );
  }

  onPage(event: CoreTablePageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateView();

    this.toastr.info(
      `Switched to page <strong>${this.pageIndex}</strong> (page size: ${this.pageSize})`,
      'Table paging',
      {
        autoClose: true,
        duration: 2500
      }
    );
  }

  onRowClick(row: UserRow): void {
    this.toastr.success(
      `Clicked row: <strong>${row.name}</strong> (${row.email})`,
      'Row click',
      {
        autoClose: true,
        duration: 2500
      }
    );
  }

  onRowDblClick(row: UserRow): void {
    this.toastr.warning(
      `Double clicked row: <strong>${row.name}</strong> (${row.role})`,
      'Row double click',
      {
        autoClose: true,
        duration: 2500
      }
    );
  }

  onSelectionChange(_rows: UserRow[]): void {
    // Intentionally left blank: we do not show toast for selection change
  }

  private updateView(): void {
    let data = [...this.allUsers];

    if (this.currentSort && this.currentSort.direction) {
      const { field, direction } = this.currentSort;

      data.sort((a, b) => {
        const aValue = a[field as keyof UserRow];
        const bValue = b[field as keyof UserRow];

        if (aValue == null && bValue == null) {
          return 0;
        }
        if (aValue == null) {
          return 1;
        }
        if (bValue == null) {
          return -1;
        }

        let comparison = 0;

        if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return direction === 'asc' ? comparison : -comparison;
      });
    }

    const start = (this.pageIndex - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.viewUsers = data.slice(start, end);
    this.totalItems = this.allUsers.length;
  }
}


