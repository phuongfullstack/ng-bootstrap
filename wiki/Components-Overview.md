# Components Overview

This page provides an overview of all available components in the ng-bootstrap library. All components are standalone, support Angular Reactive Forms (where applicable), and follow Bootstrap 5.3 design patterns.

## 📋 Component Categories

### Form Controls
- [Button](#button-component)
- [Input](#input-component)
- [Checkbox](#checkbox-component)
- [Radio](#radio-component)
- [Switch](#switch-component)
- [Dropdown](#dropdown-component)
- [Autocomplete](#autocomplete-component)
- [DateTimePicker](#datetimepicker-component)

### UI Components
- [Modal](#modal-component)
- [Table](#table-component)
- [Progress](#progress-component)
- [Toastr](#toastr-component)

---

## Button Component

**Selector:** `<core-button>`

Customizable button component with various styles, sizes, and states.

### Key Features
- Multiple variants (primary, secondary, success, danger, etc.)
- Three sizes (sm, md, lg)
- Loading state with spinner
- Icon support (left or right position)
- Outline and rounded styles
- Full event support (click, hover, focus, drag, etc.)

### Basic Example
```html
<core-button variant="primary" (clicked)="handleClick()">
  Click Me
</core-button>
```

**[→ Full Documentation](Button-Component.md)**

---

## Input Component

**Selector:** `<core-input>`

Text input component with validation support and Bootstrap styling.

### Key Features
- Multiple input types (text, email, password, number, etc.)
- Reactive Forms support with validation
- Label and hint text
- Error message display
- Required field indicator
- Min/max length validation
- Pattern validation

### Basic Example
```html
<core-input
  formControlName="email"
  label="Email"
  type="email"
  placeholder="Enter your email">
</core-input>
```

**[→ Full Documentation](Input-Component.md)**

---

## Checkbox Component

**Selector:** `<core-checkbox>`

Checkbox component for single or grouped selections.

### Key Features
- Reactive Forms support
- Single checkbox or checkbox groups
- Indeterminate state
- Custom labels
- Inline or stacked layout
- Validation support

### Basic Example
```html
<core-checkbox
  formControlName="agree"
  label="I agree to the terms">
</core-checkbox>
```

**[→ Full Documentation](Checkbox-Component.md)**

---

## Radio Component

**Selector:** `<core-radio>`

Radio button component for mutually exclusive selections.

### Key Features
- Reactive Forms support
- Radio button groups
- Custom labels
- Inline or stacked layout
- Disabled state

### Basic Example
```html
<core-radio
  formControlName="gender"
  [options]="genderOptions">
</core-radio>
```

**[→ Full Documentation](Radio-Component.md)**

---

## Switch Component

**Selector:** `<core-switch>`

Toggle switch component for boolean values.

### Key Features
- Reactive Forms support
- On/Off toggle
- Custom labels
- Disabled state
- Size variants

### Basic Example
```html
<core-switch
  formControlName="notifications"
  label="Enable notifications">
</core-switch>
```

**[→ Full Documentation](Switch-Component.md)**

---

## Dropdown Component

**Selector:** `<core-dropdown>`

Select dropdown component with single or multiple selection support.

### Key Features
- Reactive Forms support
- Single or multiple selection
- Searchable options
- Disabled options
- Size variants (sm, lg)
- Placeholder support
- Validation support

### Basic Example
```html
<core-dropdown
  formControlName="country"
  [options]="countryOptions"
  placeholder="Select a country">
</core-dropdown>
```

**[→ Full Documentation](Dropdown-Component.md)**

---

## Autocomplete Component

**Selector:** `<core-autocomplete>`

Searchable autocomplete input with dropdown suggestions.

### Key Features
- Reactive Forms support
- Dynamic filtering
- Debounced search
- Custom templates
- Minimum character threshold
- Loading state
- Clear button
- Free text input option

### Basic Example
```html
<core-autocomplete
  formControlName="city"
  [options]="cityOptions"
  placeholder="Type to search cities"
  (search)="onSearch($event)">
</core-autocomplete>
```

**[→ Full Documentation](Autocomplete-Component.md)**

---

## DateTimePicker Component

**Selector:** `<core-datetimepicker>`

Date and time picker component with calendar interface.

### Key Features
- Reactive Forms support
- Date selection
- Time selection
- Min/max date constraints
- Disabled dates
- Custom date formats
- Validation support

### Basic Example
```html
<core-datetimepicker
  formControlName="birthdate"
  label="Birth Date"
  placeholder="Select date">
</core-datetimepicker>
```

**[→ Full Documentation](DateTimePicker-Component.md)**

---

## Modal Component

**Selector:** `<core-modal>`

Customizable modal dialog component with backdrop and animations.

### Key Features
- Multiple sizes (sm, md, lg, xl, fullscreen)
- Dynamic content loading
- Custom buttons
- Close on backdrop click
- Keyboard navigation (ESC to close)
- Focus management
- Programmatic control via ModalService
- Custom content components

### Basic Example
```html
<core-modal
  title="Confirm Action"
  size="md"
  [buttons]="modalButtons"
  (confirmed)="onConfirm()">
  <p>Are you sure you want to proceed?</p>
</core-modal>
```

**[→ Full Documentation](Modal-Component.md)**

---

## Table Component

**Selector:** `<core-table>`

Feature-rich data table component with sorting, filtering, and pagination.

### Key Features
- Column configuration
- Sorting (single/multiple columns)
- Pagination
- Row selection
- Expandable rows
- Custom cell templates
- Striped/bordered/hover styles
- Size variants
- Loading state
- Empty state message
- Responsive design

### Basic Example
```html
<core-table
  [data]="users"
  [columns]="userColumns"
  [pageable]="true"
  [pageSize]="10"
  (sorted)="onSort($event)">
</core-table>
```

**[→ Full Documentation](Table-Component.md)**

---

## Progress Component

**Selector:** `<core-progress>`

Progress bar component for showing task completion.

### Key Features
- Horizontal progress bars
- Multiple variants (colors)
- Striped and animated styles
- Stacked progress bars
- Custom labels
- Height customization

### Basic Example
```html
<core-progress
  [value]="75"
  variant="success"
  [striped]="true"
  [animated]="true">
</core-progress>
```

**[→ Full Documentation](Progress-Component.md)**

---

## Toastr Component

**Selector:** `<core-toastr>`

Toast notification component for displaying messages.

### Key Features
- Multiple variants (success, error, warning, info)
- Auto-dismiss with configurable timeout
- Manual dismiss
- Position configuration
- Stack multiple toasts
- Custom templates
- Progress bar
- Icons

### Basic Example
```typescript
// In your component
constructor(private toastrService: CoreToastrService) {}

showSuccess() {
  this.toastrService.success('Operation completed successfully!');
}
```

**[→ Full Documentation](Toastr-Component.md)**

---

## Common Features

All components share these common features:

### 🎨 Theming
Components follow Bootstrap 5.3 theming and can be customized via CSS variables.

### ♿ Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management

### 📱 Responsive
All components are mobile-first and responsive by default.

### ⚡ Performance
- OnPush change detection strategy
- Standalone components for tree-shaking
- Minimal re-renders

### 📝 Form Integration
Form components implement Angular's `ControlValueAccessor` interface for seamless Reactive Forms integration.

---

## Component Comparison

| Component | Form Support | Validation | Multi-select | Custom Template |
|-----------|--------------|------------|--------------|-----------------|
| Button | ❌ | ❌ | ❌ | ✅ |
| Input | ✅ | ✅ | ❌ | ❌ |
| Checkbox | ✅ | ✅ | ✅ | ❌ |
| Radio | ✅ | ✅ | ❌ | ❌ |
| Switch | ✅ | ✅ | ❌ | ❌ |
| Dropdown | ✅ | ✅ | ✅ | ❌ |
| Autocomplete | ✅ | ✅ | ❌ | ✅ |
| DateTimePicker | ✅ | ✅ | ❌ | ❌ |
| Modal | ❌ | ❌ | ❌ | ✅ |
| Table | ❌ | ❌ | ✅ | ✅ |
| Progress | ❌ | ❌ | ❌ | ❌ |
| Toastr | ❌ | ❌ | ❌ | ✅ |

---

## Next Steps

- Explore individual component documentation for detailed API references
- Check out the [demo application](http://localhost:4200/) for live examples
- Read the [Architecture guide](Architecture.md) to understand the project structure
- Learn about [Contributing](Contributing.md) to add new components

---

[← Back to Home](Home.md) | [Getting Started](Getting-Started.md)
