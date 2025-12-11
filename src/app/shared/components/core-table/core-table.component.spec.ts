import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTableComponent } from './core-table.component';
import { CoreTableColumn } from './core-table.types';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

interface TestRow {
  id: number;
  name: string;
  age: number;
  email: string;
  status: string;
  createdAt: Date;
  amount: number;
}

describe('CoreTableComponent', () => {
  let component: CoreTableComponent<TestRow>;
  let fixture: ComponentFixture<CoreTableComponent<TestRow>>;

  const mockColumns: CoreTableColumn[] = [
    { field: 'id', header: 'ID', type: 'number' },
    { field: 'name', header: 'Name', type: 'text' },
    { field: 'age', header: 'Age', type: 'number' },
    { field: 'email', header: 'Email', type: 'text' },
    { field: 'status', header: 'Status', type: 'badge' },
    { field: 'createdAt', header: 'Created', type: 'date' },
    { field: 'amount', header: 'Amount', type: 'number' }
  ];

  const mockData: TestRow[] = [
    { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', status: 'Active', createdAt: new Date('2024-01-01'), amount: 1000 },
    { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'Inactive', createdAt: new Date('2024-01-02'), amount: 2000 },
    { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', status: 'Active', createdAt: new Date('2024-01-03'), amount: 1500 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreTableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent<CoreTableComponent<TestRow>>(CoreTableComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      component.columns = mockColumns;
      component.data = mockData;
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.data).toEqual([]);
      expect(component.columns).toEqual([]);
      expect(component.striped).toBe(true);
      expect(component.hover).toBe(true);
      expect(component.bordered).toBe(false);
      expect(component.size).toBe('md');
      expect(component.showHeader).toBe(true);
      expect(component.showFooter).toBe(false);
      expect(component.loading).toBe(false);
      expect(component.emptyMessage).toBe('No data available.');
      expect(component.pageable).toBe(false);
      expect(component.pageIndex).toBe(1);
      expect(component.pageSize).toBe(10);
      expect(component.pageSizeOptions).toEqual([10, 25, 50]);
      expect(component.sortable).toBe(false);
      expect(component.sortDirection).toBe(null);
      expect(component.serverSort).toBe(false);
      expect(component.filterable).toBe(false);
      expect(component.globalFilter).toBe(false);
      expect(component.filterPlaceholder).toBe('Search...');
      expect(component.selectable).toBe(false);
      expect(component.selectionMode).toBe('single');
      expect(component.selectedKeys).toEqual([]);
      expect(component.rowKey).toBe('id');
      expect(component.expandable).toBe(false);
      expect(component.expandOnRowClick).toBe(false);
    });
  });

  describe('Table Classes', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      component.loading = false;
    });

    it('should apply default table classes', () => {
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table')).toBe(true);
      expect(table.nativeElement.classList.contains('table-striped')).toBe(true);
      expect(table.nativeElement.classList.contains('table-hover')).toBe(true);
      expect(table.nativeElement.classList.contains('table-bordered')).toBe(false);
    });

    it('should apply striped class when striped is true', () => {
      component.striped = true;
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-striped')).toBe(true);
    });

    it('should not apply striped class when striped is false', () => {
      component.striped = false;
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-striped')).toBe(false);
    });

    it('should apply hover class when hover is true', () => {
      component.hover = true;
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-hover')).toBe(true);
    });

    it('should not apply hover class when hover is false', () => {
      component.hover = false;
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-hover')).toBe(false);
    });

    it('should apply bordered class when bordered is true', () => {
      component.bordered = true;
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-bordered')).toBe(true);
    });

    it('should apply sm size class when size is sm', () => {
      component.size = 'sm';
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-sm')).toBe(true);
    });

    it('should apply lg size class when size is lg', () => {
      component.size = 'lg';
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-lg')).toBe(true);
    });

    it('should not apply size classes when size is md', () => {
      component.size = 'md';
      fixture.detectChanges();
      const table = fixture.debugElement.query(By.css('table'));
      expect(table.nativeElement.classList.contains('table-sm')).toBe(false);
      expect(table.nativeElement.classList.contains('table-lg')).toBe(false);
    });
  });

  describe('Header Rendering', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
    });

    it('should render header when showHeader is true', () => {
      component.showHeader = true;
      fixture.detectChanges();
      const thead = fixture.debugElement.query(By.css('thead'));
      expect(thead).toBeTruthy();
    });

    it('should not render header when showHeader is false', () => {
      component.showHeader = false;
      fixture.detectChanges();
      const thead = fixture.debugElement.query(By.css('thead'));
      expect(thead).toBeFalsy();
    });

    it('should render all column headers', () => {
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers.length).toBe(mockColumns.length);
      headers.forEach((header, index) => {
        expect(header.nativeElement.textContent.trim()).toContain(mockColumns[index].header);
      });
    });

    it('should render select column header when selectable and multiple mode', () => {
      component.selectable = true;
      component.selectionMode = 'multiple';
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers.length).toBe(mockColumns.length + 1);
      expect(headers[0].nativeElement.classList.contains('core-table-select-col')).toBe(true);
    });

    it('should not render select column header when selectable is false', () => {
      component.selectable = false;
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers.length).toBe(mockColumns.length);
    });

    it('should not render select column header when selectionMode is single', () => {
      component.selectable = true;
      component.selectionMode = 'single';
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers.length).toBe(mockColumns.length);
    });
  });

  describe('Column Alignment', () => {
    beforeEach(() => {
      component.columns = [
        { field: 'id', header: 'ID', align: 'left' },
        { field: 'name', header: 'Name', align: 'center' },
        { field: 'age', header: 'Age', align: 'right' }
      ];
      component.data = mockData;
      fixture.detectChanges();
    });

    it('should apply left alignment class by default', () => {
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers[0].nativeElement.classList.contains('text-start')).toBe(true);
    });

    it('should apply center alignment class', () => {
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers[1].nativeElement.classList.contains('text-center')).toBe(true);
    });

    it('should apply right alignment class', () => {
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      expect(headers[2].nativeElement.classList.contains('text-end')).toBe(true);
    });

    it('should apply alignment to body cells', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const firstRowCells = rows[0].queryAll(By.css('td'));
      expect(firstRowCells[0].nativeElement.classList.contains('text-start')).toBe(true);
      expect(firstRowCells[1].nativeElement.classList.contains('text-center')).toBe(true);
      expect(firstRowCells[2].nativeElement.classList.contains('text-end')).toBe(true);
    });
  });

  describe('Data Rendering', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      fixture.detectChanges();
    });

    it('should render all data rows', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      expect(rows.length).toBe(mockData.length);
    });

    it('should render cell data correctly', () => {
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const firstRowCells = rows[0].queryAll(By.css('td'));
      expect(firstRowCells[0].nativeElement.textContent.trim()).toContain('1');
      expect(firstRowCells[1].nativeElement.textContent.trim()).toContain('John Doe');
    });

    it('should render empty state when data is empty', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('selectable', false);
      fixture.componentRef.setInput('selectionMode', 'single');
      fixture.componentRef.setInput('columns', [...mockColumns]);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      const tbody = fixture.debugElement.query(By.css('tbody'));
      const emptyRow = tbody.query(By.css('tr td.text-center'));
      expect(emptyRow).toBeTruthy();
      expect(emptyRow.nativeElement.textContent.trim()).toBe('No data available.');
    });

    it('should render custom empty message', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.componentRef.setInput('selectable', false);
      fixture.componentRef.setInput('selectionMode', 'single');
      fixture.componentRef.setInput('emptyMessage', 'No records found');
      fixture.componentRef.setInput('columns', [...mockColumns]);
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();
      const tbody = fixture.debugElement.query(By.css('tbody'));
      const emptyRow = tbody.query(By.css('tr td.text-center'));
      expect(emptyRow).toBeTruthy();
      expect(emptyRow.nativeElement.textContent.trim()).toBe('No records found');
    });

    it('should not show empty state when loading', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const emptyRow = fixture.debugElement.query(By.css('tbody tr td.text-center'));
      expect(emptyRow).toBeFalsy();
    });
  });

  describe('Column Types', () => {
    beforeEach(() => {
      component.data = mockData;
    });

    it('should render number type with number pipe', () => {
      component.columns = [{ field: 'amount', header: 'Amount', type: 'number' }];
      fixture.detectChanges();
      const cell = fixture.debugElement.query(By.css('tbody td'));
      expect(cell.nativeElement.textContent.trim()).toContain('1,000');
    });

    it('should render date type with date pipe', () => {
      component.columns = [{ field: 'createdAt', header: 'Created', type: 'date' }];
      fixture.detectChanges();
      const cell = fixture.debugElement.query(By.css('tbody td'));
      expect(cell.nativeElement.textContent.trim()).toBeTruthy();
    });

    it('should render badge type with badge class', () => {
      component.columns = [{ field: 'status', header: 'Status', type: 'badge' }];
      fixture.detectChanges();
      const badge = fixture.debugElement.query(By.css('tbody .badge'));
      expect(badge).toBeTruthy();
      expect(badge.nativeElement.textContent.trim()).toBe('Active');
    });

    it('should render text type as default', () => {
      component.columns = [{ field: 'name', header: 'Name', type: 'text' }];
      fixture.detectChanges();
      const cell = fixture.debugElement.query(By.css('tbody td'));
      expect(cell.nativeElement.textContent.trim()).toBe('John Doe');
    });

    it('should render default type when type is not specified', () => {
      component.columns = [{ field: 'name', header: 'Name' }];
      fixture.detectChanges();
      const cell = fixture.debugElement.query(By.css('tbody td'));
      expect(cell.nativeElement.textContent.trim()).toBe('John Doe');
    });
  });

  describe('Loading State', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
    });

    it('should show loading overlay when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      const overlay = fixture.debugElement.query(By.css('.core-table-loading-overlay'));
      expect(overlay).toBeTruthy();
    });

    it('should not show loading overlay when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();
      const overlay = fixture.debugElement.query(By.css('.core-table-loading-overlay'));
      expect(overlay).toBeFalsy();
    });

    it('should show spinner in loading overlay', () => {
      component.loading = true;
      fixture.detectChanges();
      const spinner = fixture.debugElement.query(By.css('.spinner-border'));
      expect(spinner).toBeTruthy();
    });
  });

  describe('Sorting', () => {
    beforeEach(() => {
      component.columns = [
        { field: 'id', header: 'ID', sortable: true },
        { field: 'name', header: 'Name', sortable: false },
        { field: 'age', header: 'Age', sortable: true }
      ];
      component.data = mockData;
      component.sortable = true;
      fixture.detectChanges();
    });

    it('should show sort button for sortable columns', () => {
      const sortButtons = fixture.debugElement.queryAll(By.css('.core-table-sort-btn'));
      expect(sortButtons.length).toBe(2);
    });

    it('should not show sort button when sortable is false', () => {
      const testColumns = [
        { field: 'id', header: 'ID', sortable: true },
        { field: 'name', header: 'Name', sortable: false },
        { field: 'age', header: 'Age', sortable: true }
      ];
      fixture.componentRef.setInput('sortable', false);
      fixture.componentRef.setInput('columns', [...testColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      fixture.detectChanges();
      const sortButtons = fixture.debugElement.queryAll(By.css('.core-table-sort-btn'));
      expect(sortButtons.length).toBe(0);
    });

    it('should not show sort button when column sortable is false', () => {
      const sortButtons = fixture.debugElement.queryAll(By.css('.core-table-sort-btn'));
      const nameHeader = fixture.debugElement.queryAll(By.css('thead th'))[1];
      const sortBtnInName = nameHeader.query(By.css('.core-table-sort-btn'));
      expect(sortBtnInName).toBeFalsy();
    });

    it('should show default sort icon when column is not sorted', () => {
      component.sortField = undefined;
      fixture.detectChanges();
      const sortIcon = fixture.debugElement.query(By.css('.core-table-sort-btn i'));
      expect(sortIcon).toBeTruthy();
      expect(sortIcon.nativeElement.className).toContain('bi-arrow-down-up');
    });

    it('should show asc sort icon when column is sorted ascending', () => {
      const testColumns = [
        { field: 'id', header: 'ID', sortable: true },
        { field: 'name', header: 'Name', sortable: false },
        { field: 'age', header: 'Age', sortable: true }
      ];
      fixture.componentRef.setInput('sortable', true);
      fixture.componentRef.setInput('sortField', 'id');
      fixture.componentRef.setInput('sortDirection', 'asc');
      fixture.componentRef.setInput('columns', [...testColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      const idHeader = headers.find(th => th.nativeElement.textContent.trim().includes('ID'));
      expect(idHeader).toBeTruthy();
      const sortIcon = idHeader?.query(By.css('.core-table-sort-btn i'));
      expect(sortIcon).toBeTruthy();
      expect(sortIcon?.nativeElement.className).toBe('bi bi-arrow-up-short');
    });

    it('should show desc sort icon when column is sorted descending', () => {
      const testColumns = [
        { field: 'id', header: 'ID', sortable: true },
        { field: 'name', header: 'Name', sortable: false },
        { field: 'age', header: 'Age', sortable: true }
      ];
      fixture.componentRef.setInput('sortable', true);
      fixture.componentRef.setInput('sortField', 'id');
      fixture.componentRef.setInput('sortDirection', 'desc');
      fixture.componentRef.setInput('columns', [...testColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      fixture.detectChanges();
      const headers = fixture.debugElement.queryAll(By.css('thead th'));
      const idHeader = headers.find(th => th.nativeElement.textContent.trim().includes('ID'));
      expect(idHeader).toBeTruthy();
      const sortIcon = idHeader?.query(By.css('.core-table-sort-btn i'));
      expect(sortIcon).toBeTruthy();
      expect(sortIcon?.nativeElement.className).toBe('bi bi-arrow-down-short');
    });

    it('should emit sortChange event when sort button is clicked', () => {
      const sortChangeSpy = vi.spyOn(component.sortChange, 'emit');
      const sortButton = fixture.debugElement.query(By.css('.core-table-sort-btn'));
      sortButton.nativeElement.click();
      fixture.detectChanges();
      expect(sortChangeSpy).toHaveBeenCalledWith({ field: 'id', direction: 'asc' });
    });

    it('should toggle sort direction from null to asc', () => {
      component.sortField = undefined;
      component.sortDirection = null;
      const sortChangeSpy = vi.spyOn(component.sortChange, 'emit');
      fixture.detectChanges();
      const sortButton = fixture.debugElement.query(By.css('.core-table-sort-btn'));
      sortButton.nativeElement.click();
      fixture.detectChanges();
      expect(sortChangeSpy).toHaveBeenCalledWith({ field: 'id', direction: 'asc' });
    });

    it('should toggle sort direction from asc to desc', () => {
      fixture.componentRef.setInput('sortField', 'id');
      fixture.componentRef.setInput('sortDirection', 'asc');
      const sortChangeSpy = vi.spyOn(component.sortChange, 'emit');
      fixture.detectChanges();
      const sortButton = fixture.debugElement.query(By.css('.core-table-sort-btn'));
      sortButton.nativeElement.click();
      fixture.detectChanges();
      expect(sortChangeSpy).toHaveBeenCalledWith({ field: 'id', direction: 'desc' });
    });

    it('should toggle sort direction from desc to null', () => {
      fixture.componentRef.setInput('sortField', 'id');
      fixture.componentRef.setInput('sortDirection', 'desc');
      const sortChangeSpy = vi.spyOn(component.sortChange, 'emit');
      fixture.detectChanges();
      const sortButton = fixture.debugElement.query(By.css('.core-table-sort-btn'));
      sortButton.nativeElement.click();
      fixture.detectChanges();
      expect(sortChangeSpy).toHaveBeenCalledWith({ field: 'id', direction: null });
    });

    it('should not emit sortChange when column is not sortable', () => {
      const testColumns = [{ field: 'name', header: 'Name', sortable: false }];
      fixture.componentRef.setInput('sortable', false);
      fixture.componentRef.setInput('columns', [...testColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      const sortChangeSpy = vi.spyOn(component.sortChange, 'emit');
      fixture.detectChanges();
      const sortButtons = fixture.debugElement.queryAll(By.css('.core-table-sort-btn'));
      expect(sortButtons.length).toBe(0);
    });

    it('should not emit sortChange when column has no field', () => {
      const testColumns = [{ field: '', header: 'Name', sortable: true }];
      fixture.componentRef.setInput('sortable', true);
      fixture.componentRef.setInput('columns', [...testColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      const sortChangeSpy = vi.spyOn(component.sortChange, 'emit');
      fixture.detectChanges();
      const sortButtons = fixture.debugElement.queryAll(By.css('.core-table-sort-btn'));
      expect(sortButtons.length).toBe(0);
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      component.pageable = true;
      component.totalItems = 30;
      fixture.detectChanges();
    });

    it('should render pagination when pageable is true', () => {
      const pagination = fixture.debugElement.query(By.css('.core-table-pagination'));
      expect(pagination).toBeTruthy();
    });

    it('should not render pagination when pageable is false', () => {
      component.pageable = false;
      fixture.detectChanges();
      const pagination = fixture.debugElement.query(By.css('.core-table-pagination'));
      expect(pagination).toBeFalsy();
    });

    it('should render page size selector', () => {
      const select = fixture.debugElement.query(By.css('select'));
      expect(select).toBeTruthy();
    });

    it('should render all page size options', () => {
      const options = fixture.debugElement.queryAll(By.css('select option'));
      expect(options.length).toBe(component.pageSizeOptions.length);
      options.forEach((option, index) => {
        expect(option.nativeElement.value).toBe(component.pageSizeOptions[index].toString());
      });
    });

    it('should display current page index', () => {
      component.pageIndex = 2;
      fixture.detectChanges();
      const pageTexts = fixture.debugElement.queryAll(By.css('.core-table-pagination span.small'));
      const pageSpan = pageTexts.find(span => span.nativeElement.textContent.trim().includes('Page'));
      expect(pageSpan).toBeTruthy();
      expect(pageSpan?.nativeElement.textContent.trim()).toContain('Page 2');
    });

    it('should disable prev button when on first page', () => {
      component.pageIndex = 1;
      fixture.detectChanges();
      const prevButton = fixture.debugElement.query(By.css('button[type="button"]'));
      expect(prevButton.nativeElement.disabled).toBe(true);
    });

    it('should enable prev button when not on first page', () => {
      component.pageIndex = 2;
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      expect(buttons[0].nativeElement.disabled).toBe(false);
    });

    it('should disable next button when on last page', () => {
      component.pageIndex = 3;
      component.totalItems = 30;
      component.pageSize = 10;
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      expect(buttons[1].nativeElement.disabled).toBe(true);
    });

    it('should enable next button when not on last page', () => {
      component.pageIndex = 1;
      component.totalItems = 30;
      component.pageSize = 10;
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      expect(buttons[1].nativeElement.disabled).toBe(false);
    });

    it('should not disable next button when totalItems is undefined', () => {
      component.pageIndex = 1;
      component.totalItems = undefined;
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      expect(buttons[1].nativeElement.disabled).toBe(false);
    });

    it('should emit pageChange when prev button is clicked', () => {
      component.pageIndex = 2;
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      buttons[0].nativeElement.click();
      fixture.detectChanges();
      expect(pageChangeSpy).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
    });

    it('should emit pageChange when next button is clicked', () => {
      component.pageIndex = 1;
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      buttons[1].nativeElement.click();
      fixture.detectChanges();
      expect(pageChangeSpy).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 10 });
    });

    it('should not emit pageChange when prev button is disabled', () => {
      component.pageIndex = 1;
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      buttons[0].nativeElement.click();
      fixture.detectChanges();
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });

    it('should not emit pageChange when next button is disabled', () => {
      component.pageIndex = 3;
      component.totalItems = 30;
      component.pageSize = 10;
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button[type="button"]'));
      buttons[1].nativeElement.click();
      fixture.detectChanges();
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });

    it('should emit pageChange when page size changes', () => {
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('select'));
      select.nativeElement.value = '25';
      select.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(pageChangeSpy).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 25 });
    });

    it('should reset pageIndex to 1 when page size changes', () => {
      component.pageIndex = 3;
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('select'));
      select.nativeElement.value = '25';
      select.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(component.pageIndex).toBe(1);
    });

    it('should not emit pageChange when page size is invalid', () => {
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('select'));
      select.nativeElement.value = 'invalid';
      select.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });

    it('should not emit pageChange when page size is same', () => {
      component.pageSize = 25;
      const pageChangeSpy = vi.spyOn(component.pageChange, 'emit');
      fixture.detectChanges();
      const select = fixture.debugElement.query(By.css('select'));
      select.nativeElement.value = '25';
      select.nativeElement.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });

    it('should calculate lastPage correctly', () => {
      component.totalItems = 30;
      component.pageSize = 10;
      expect((component as any).lastPage).toBe(3);
    });

    it('should return current pageIndex when totalItems is undefined', () => {
      component.totalItems = undefined;
      component.pageIndex = 2;
      expect((component as any).lastPage).toBe(2);
    });

    it('should return current pageIndex when pageSize is 0', () => {
      component.totalItems = 30;
      component.pageSize = 0;
      expect((component as any).lastPage).toBe(component.pageIndex);
    });
  });

  describe('Global Filter', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
    });

    it('should render global filter when globalFilter is true', () => {
      component.globalFilter = true;
      fixture.detectChanges();
      const filterInput = fixture.debugElement.query(By.css('.core-table-toolbar input'));
      expect(filterInput).toBeTruthy();
    });

    it('should not render global filter when globalFilter is false', () => {
      component.globalFilter = false;
      fixture.detectChanges();
      const filterInput = fixture.debugElement.query(By.css('.core-table-toolbar input'));
      expect(filterInput).toBeFalsy();
    });

    it('should display custom filter placeholder', () => {
      component.globalFilter = true;
      component.filterPlaceholder = 'Search records...';
      fixture.detectChanges();
      const filterInput = fixture.debugElement.query(By.css('.core-table-toolbar input'));
      expect(filterInput.nativeElement.placeholder).toBe('Search records...');
    });

    it('should emit globalFilterChange when filter value changes', () => {
      component.globalFilter = true;
      const globalFilterChangeSpy = vi.spyOn(component.globalFilterChange, 'emit');
      fixture.detectChanges();
      const filterInput = fixture.debugElement.query(By.css('.core-table-toolbar input'));
      filterInput.nativeElement.value = 'test';
      filterInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(globalFilterChangeSpy).toHaveBeenCalledWith('test');
    });

    it('should not emit globalFilterChange when globalFilter is false', () => {
      component.globalFilter = false;
      const globalFilterChangeSpy = vi.spyOn(component.globalFilterChange, 'emit');
      fixture.detectChanges();
      expect(globalFilterChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Row Selection - Single Mode', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      component.selectable = true;
      component.selectionMode = 'single';
      component.rowKey = 'id';
      fixture.detectChanges();
    });

    it('should not render checkbox column in single mode', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      expect(checkboxes.length).toBe(0);
    });

    it('should apply table-active class to selected row', () => {
      fixture.componentRef.setInput('selectable', true);
      fixture.componentRef.setInput('selectionMode', 'single');
      fixture.componentRef.setInput('rowKey', 'id');
      fixture.componentRef.setInput('selectedKeys', [1]);
      fixture.componentRef.setInput('columns', [...mockColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      fixture.detectChanges();
      const allRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const dataRows = allRows.filter(row => !row.nativeElement.classList.contains('core-table-expanded-row'));
      expect(dataRows.length).toBeGreaterThan(0);
      const firstRow = dataRows[0];
      expect(firstRow.nativeElement.classList.contains('table-active')).toBe(true);
    });

    it('should not apply table-active class to unselected row', () => {
      fixture.componentRef.setInput('columns', [...mockColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      fixture.componentRef.setInput('selectable', true);
      fixture.componentRef.setInput('selectionMode', 'single');
      fixture.componentRef.setInput('rowKey', 'id');
      fixture.componentRef.setInput('selectedKeys', [2]);
      fixture.detectChanges();
      const allRows = fixture.debugElement.queryAll(By.css('tbody tr'));
      const dataRows = allRows.filter(row => !row.nativeElement.classList.contains('core-table-expanded-row'));
      expect(dataRows.length).toBeGreaterThan(0);
      expect(dataRows[0].nativeElement.classList.contains('table-active')).toBe(false);
    });

    it('should emit rowClick when row is clicked', () => {
      const rowClickSpy = vi.spyOn(component.rowClick, 'emit');
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(rowClickSpy).toHaveBeenCalledWith(mockData[0]);
    });

    it('should toggle selection when row is clicked in single mode', () => {
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      const rowSelectionToggleSpy = vi.spyOn(component.rowSelectionToggle, 'emit');
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).toHaveBeenCalled();
      expect(rowSelectionToggleSpy).toHaveBeenCalledWith({ row: mockData[0], selected: true });
    });

    it('should deselect when clicking selected row in single mode', () => {
      fixture.componentRef.setInput('selectedKeys', [1]);
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('Row Selection - Multiple Mode', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      component.selectable = true;
      component.selectionMode = 'multiple';
      component.rowKey = 'id';
      fixture.detectChanges();
    });

    it('should render checkbox column in multiple mode', () => {
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      expect(checkboxes.length).toBe(mockData.length);
    });

    it('should check checkbox when row is selected', () => {
      fixture.componentRef.setInput('selectable', true);
      fixture.componentRef.setInput('selectionMode', 'multiple');
      fixture.componentRef.setInput('rowKey', 'id');
      fixture.componentRef.setInput('selectedKeys', [1, 2]);
      fixture.componentRef.setInput('columns', [...mockColumns]);
      fixture.componentRef.setInput('data', [...mockData]);
      fixture.detectChanges();
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      expect(checkboxes.length).toBeGreaterThanOrEqual(3);
      expect(checkboxes[0].nativeElement.checked).toBe(true);
      expect(checkboxes[1].nativeElement.checked).toBe(true);
      expect(checkboxes[2].nativeElement.checked).toBe(false);
    });

    it('should toggle selection when checkbox is clicked', () => {
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      const rowSelectionToggleSpy = vi.spyOn(component.rowSelectionToggle, 'emit');
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      checkboxes[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).toHaveBeenCalled();
      expect(rowSelectionToggleSpy).toHaveBeenCalledWith({ row: mockData[0], selected: true });
    });

    it('should not trigger row click when checkbox is clicked', () => {
      const rowClickSpy = vi.spyOn(component.rowClick, 'emit');
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      checkboxes[0].nativeElement.click();
      fixture.detectChanges();
      expect(rowClickSpy).not.toHaveBeenCalled();
    });

    it('should add to selection when checkbox is checked', () => {
      fixture.componentRef.setInput('selectedKeys', [1]);
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      fixture.detectChanges();
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      checkboxes[1].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).toHaveBeenCalledWith([mockData[0], mockData[1]]);
    });

    it('should remove from selection when checkbox is unchecked', () => {
      fixture.componentRef.setInput('selectedKeys', [1, 2]);
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      fixture.detectChanges();
      const checkboxes = fixture.debugElement.queryAll(By.css('input[type="checkbox"]'));
      checkboxes[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).toHaveBeenCalledWith([mockData[1]]);
    });
  });

  describe('Row Selection - Edge Cases', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      component.selectable = true;
      component.rowKey = 'id';
    });

    it('should not toggle selection when selectable is false', () => {
      component.selectable = false;
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it('should handle rows without rowKey property', () => {
      const dataWithoutId = [{ name: 'Test' }] as any;
      component.data = dataWithoutId;
      component.selectedKeys = [];
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).not.toHaveBeenCalled();
    });

    it('should handle rows with different rowKey', () => {
      component.rowKey = 'email';
      component.selectedKeys = [];
      const selectionChangeSpy = vi.spyOn(component.selectionChange, 'emit');
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(selectionChangeSpy).toHaveBeenCalled();
    });
  });

  describe('Row Click Events', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      fixture.detectChanges();
    });

    it('should emit rowClick when row is clicked', () => {
      const rowClickSpy = vi.spyOn(component.rowClick, 'emit');
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(rowClickSpy).toHaveBeenCalledWith(mockData[0]);
    });

    it('should emit rowDblClick when row is double-clicked', () => {
      const rowDblClickSpy = vi.spyOn(component.rowDblClick, 'emit');
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.dispatchEvent(new Event('dblclick'));
      fixture.detectChanges();
      expect(rowDblClickSpy).toHaveBeenCalledWith(mockData[0]);
    });
  });

  describe('Expandable Rows', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      // use fresh copies to avoid leaking __expanded across tests
      component.data = mockData.map(item => ({ ...item }));
      component.expandable = true;
      fixture.detectChanges();
    });

    it('should not render expanded row when row is not expanded', () => {
      const expandedRows = fixture.debugElement.queryAll(By.css('.core-table-expanded-row'));
      expect(expandedRows.length).toBe(0);
    });

    it('should render expanded row when row is expanded', () => {
      const dataCopy = mockData.map(item => ({ ...item }));
      (dataCopy[0] as any).__expanded = true;
      fixture.componentRef.setInput('data', dataCopy);
      fixture.detectChanges();
      const expandedRows = fixture.debugElement.queryAll(By.css('.core-table-expanded-row'));
      expect(expandedRows.length).toBe(1);
    });

    it('should render expanded content when provided', () => {
      const dataCopy = mockData.map(item => ({ ...item }));
      (dataCopy[0] as any).__expanded = true;
      (dataCopy[0] as any).__expandedContent = 'Expanded content';
      fixture.componentRef.setInput('data', dataCopy);
      fixture.detectChanges();
      const expandedRow = fixture.debugElement.query(By.css('.core-table-expanded-row'));
      expect(expandedRow).toBeTruthy();
      expect(expandedRow.nativeElement.textContent.trim()).toContain('Expanded content');
    });

    it('should emit rowExpand when row is expanded', () => {
      component.columns = [...mockColumns];
      const dataCopy = mockData.map(item => ({ ...item }));
      component.data = dataCopy;
      component.expandable = true;
      fixture.detectChanges();
      const rowExpandSpy = vi.spyOn(component.rowExpand, 'emit');
      expect((dataCopy[0] as any).__expanded).toBeUndefined();
      (component as any).toggleRowExpand(dataCopy[0]);
      fixture.detectChanges();
      expect(rowExpandSpy).toHaveBeenCalledWith({ row: dataCopy[0], expanded: true });
    });

    it('should emit rowCollapse when row is collapsed', () => {
      const dataCopy = mockData.map(item => ({ ...item }));
      component.data = dataCopy;
      (dataCopy[0] as any).__expanded = true;
      const rowCollapseSpy = vi.spyOn(component.rowCollapse, 'emit');
      (component as any).toggleRowExpand(dataCopy[0]);
      fixture.detectChanges();
      expect(rowCollapseSpy).toHaveBeenCalledWith({ row: dataCopy[0], expanded: false });
    });

    it('should expand row when expandOnRowClick is true and row is clicked', () => {
      component.expandOnRowClick = true;
      const rowExpandSpy = vi.spyOn(component.rowExpand, 'emit');
      fixture.detectChanges();
      const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
      rows[0].nativeElement.click();
      fixture.detectChanges();
      expect(rowExpandSpy).toHaveBeenCalled();
    });

    it('should not expand row when expandable is false', () => {
      component.expandable = false;
      const rowExpandSpy = vi.spyOn(component.rowExpand, 'emit');
      fixture.detectChanges();
      expect(rowExpandSpy).not.toHaveBeenCalled();
    });

    it('should calculate colspan correctly for expanded row', () => {
      const dataCopy = mockData.map(item => ({ ...item }));
      (dataCopy[0] as any).__expanded = true;
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('selectable', true);
      fixture.componentRef.setInput('selectionMode', 'multiple');
      fixture.componentRef.setInput('expandable', true);
      fixture.componentRef.setInput('data', dataCopy);
      fixture.detectChanges();
      const expandedRow = fixture.debugElement.query(By.css('.core-table-expanded-row td'));
      expect(expandedRow).toBeTruthy();
      expect(component.columns.length).toBe(7);
      expect(component.selectable).toBe(true);
      expect(component.selectionMode).toBe('multiple');
      const colspanValue = expandedRow.nativeElement.getAttribute('colspan');
      expect(colspanValue).toBe('8');
    });

    it('should calculate colspan correctly for expanded row without selection', () => {
      const dataCopy = mockData.map(item => ({ ...item }));
      (dataCopy[0] as any).__expanded = true;
      fixture.componentRef.setInput('columns', mockColumns);
      fixture.componentRef.setInput('selectable', false);
      fixture.componentRef.setInput('expandable', true);
      fixture.componentRef.setInput('data', dataCopy);
      fixture.detectChanges();
      const expandedRow = fixture.debugElement.query(By.css('.core-table-expanded-row td'));
      expect(expandedRow).toBeTruthy();
      expect(expandedRow.nativeElement.getAttribute('colspan')).toBe('7');
    });
  });

  describe('Footer', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
    });

    it('should render footer when showFooter is true', () => {
      component.showFooter = true;
      fixture.detectChanges();
      const tfoot = fixture.debugElement.query(By.css('tfoot'));
      expect(tfoot).toBeTruthy();
    });

    it('should not render footer when showFooter is false', () => {
      component.showFooter = false;
      fixture.detectChanges();
      const tfoot = fixture.debugElement.query(By.css('tfoot'));
      expect(tfoot).toBeFalsy();
    });

    it('should display row count in footer', () => {
      component.showFooter = true;
      fixture.detectChanges();
      const footerText = fixture.debugElement.query(By.css('tfoot td'));
      expect(footerText.nativeElement.textContent.trim()).toContain('3');
    });

    it('should calculate colspan correctly for footer', () => {
      component.showFooter = true;
      component.selectable = true;
      component.selectionMode = 'multiple';
      fixture.detectChanges();
      const footerCell = fixture.debugElement.query(By.css('tfoot td'));
      expect(footerCell.nativeElement.getAttribute('colspan')).toBe((mockColumns.length + 1).toString());
    });
  });

  describe('TrackBy Function', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
      component.rowKey = 'id';
      fixture.detectChanges();
    });

    it('should use rowKey value for trackBy', () => {
      const trackByResult = (component as any).trackByRow(0, mockData[0]);
      expect(trackByResult).toBe(1);
    });

    it('should return row itself when rowKey is not found', () => {
      const rowWithoutKey = { name: 'Test' };
      const trackByResult = (component as any).trackByRow(0, rowWithoutKey);
      expect(trackByResult).toBe(rowWithoutKey);
    });

    it('should return row itself when row is null', () => {
      const trackByResult = (component as any).trackByRow(0, null as any);
      expect(trackByResult).toBe(null);
    });
  });

  describe('Column Helper Methods', () => {
    beforeEach(() => {
      component.columns = mockColumns;
      component.data = mockData;
    });

    it('should identify sortable column correctly', () => {
      component.sortable = true;
      const column: CoreTableColumn = { field: 'id', header: 'ID', sortable: true };
      expect((component as any).isColumnSortable(column)).toBe(true);
    });

    it('should identify non-sortable column when sortable is false', () => {
      component.sortable = false;
      const column: CoreTableColumn = { field: 'id', header: 'ID', sortable: true };
      expect((component as any).isColumnSortable(column)).toBe(false);
    });

    it('should identify non-sortable column when column sortable is false', () => {
      component.sortable = true;
      const column: CoreTableColumn = { field: 'id', header: 'ID', sortable: false };
      expect((component as any).isColumnSortable(column)).toBe(false);
    });

    it('should identify non-sortable column when field is missing', () => {
      component.sortable = true;
      const column: CoreTableColumn = { field: '', header: 'ID', sortable: true };
      expect((component as any).isColumnSortable(column)).toBe(false);
    });

    it('should identify sorted column correctly', () => {
      component.sortField = 'id';
      component.sortDirection = 'asc';
      const column: CoreTableColumn = { field: 'id', header: 'ID' };
      expect((component as any).isSortedColumn(column)).toBe(true);
    });

    it('should identify non-sorted column correctly', () => {
      component.sortField = 'name';
      component.sortDirection = 'asc';
      const column: CoreTableColumn = { field: 'id', header: 'ID' };
      expect((component as any).isSortedColumn(column)).toBe(false);
    });

    it('should identify non-sorted column when sortDirection is null', () => {
      component.sortField = 'id';
      component.sortDirection = null;
      const column: CoreTableColumn = { field: 'id', header: 'ID' };
      expect((component as any).isSortedColumn(column)).toBe(false);
    });
  });
});
