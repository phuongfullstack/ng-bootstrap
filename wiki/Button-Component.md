# Button Component

The `core-button` component provides a customizable button with Bootstrap 5.3 styling, multiple variants, sizes, and comprehensive event handling.

## Table of Contents
- [Basic Usage](#basic-usage)
- [Properties](#properties)
- [Events](#events)
- [Examples](#examples)
- [Styling](#styling)
- [Accessibility](#accessibility)

---

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { CoreButtonComponent } from '@shared/components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CoreButtonComponent],
  template: `
    <core-button 
      variant="primary" 
      (clicked)="handleClick()">
      Click Me
    </core-button>
  `
})
export class ExampleComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

---

## Properties

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML button type |
| `variant` | `ButtonVariant` | `'primary'` | Button color variant (primary, secondary, success, danger, warning, info, light, dark) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows loading spinner and disables button |
| `block` | `boolean` | `false` | Makes button full width |
| `outline` | `boolean` | `false` | Uses outline style instead of solid |
| `rounded` | `boolean` | `false` | Applies rounded pill style |
| `roundedCircle` | `boolean` | `false` | Makes button circular (for icon-only buttons) |
| `icon` | `string` | `undefined` | Bootstrap icon class (e.g., 'bi-check-circle') |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Position of the icon |
| `customClass` | `string` | `undefined` | Additional CSS classes |
| `draggable` | `boolean` | `false` | Enables drag and drop |

### Available Variants

- `primary` - Primary action (blue)
- `secondary` - Secondary action (gray)
- `success` - Success action (green)
- `danger` - Danger/delete action (red)
- `warning` - Warning action (yellow)
- `info` - Info action (cyan)
- `light` - Light background
- `dark` - Dark background

---

## Events

### Mouse Events

| Event | Type | Description |
|-------|------|-------------|
| `clicked` | `EventEmitter<MouseEvent>` | Emitted when button is clicked |
| `doubleClicked` | `EventEmitter<MouseEvent>` | Emitted on double click |
| `mouseEntered` | `EventEmitter<MouseEvent>` | Emitted when mouse enters button |
| `mouseLeft` | `EventEmitter<MouseEvent>` | Emitted when mouse leaves button |

### Focus Events

| Event | Type | Description |
|-------|------|-------------|
| `focused` | `EventEmitter<FocusEvent>` | Emitted when button receives focus |
| `blurred` | `EventEmitter<FocusEvent>` | Emitted when button loses focus |

### Keyboard Events

| Event | Type | Description |
|-------|------|-------------|
| `keyPressed` | `EventEmitter<KeyboardEvent>` | Emitted on keydown |

### Drag Events

| Event | Type | Description |
|-------|------|-------------|
| `dragStarted` | `EventEmitter<DragEvent>` | Emitted when drag starts |
| `dragged` | `EventEmitter<DragEvent>` | Emitted during drag |
| `dragEnded` | `EventEmitter<DragEvent>` | Emitted when drag ends |
| `dragEntered` | `EventEmitter<DragEvent>` | Emitted when dragged item enters |
| `dragOvered` | `EventEmitter<DragEvent>` | Emitted when dragged item is over |
| `dragLeft` | `EventEmitter<DragEvent>` | Emitted when dragged item leaves |
| `dropped` | `EventEmitter<DragEvent>` | Emitted on drop |

---

## Examples

### Basic Variants

```html
<core-button variant="primary">Primary</core-button>
<core-button variant="secondary">Secondary</core-button>
<core-button variant="success">Success</core-button>
<core-button variant="danger">Danger</core-button>
<core-button variant="warning">Warning</core-button>
<core-button variant="info">Info</core-button>
<core-button variant="light">Light</core-button>
<core-button variant="dark">Dark</core-button>
```

### Outline Buttons

```html
<core-button variant="primary" [outline]="true">Primary Outline</core-button>
<core-button variant="success" [outline]="true">Success Outline</core-button>
<core-button variant="danger" [outline]="true">Danger Outline</core-button>
```

### Sizes

```html
<core-button size="sm">Small</core-button>
<core-button size="md">Medium</core-button>
<core-button size="lg">Large</core-button>
```

### With Icons

```html
<!-- Icon on left -->
<core-button 
  variant="success" 
  icon="bi-check-circle">
  Save
</core-button>

<!-- Icon on right -->
<core-button 
  variant="danger" 
  icon="bi-trash" 
  iconPosition="right">
  Delete
</core-button>

<!-- Icon only (circular) -->
<core-button 
  variant="primary" 
  icon="bi-plus" 
  [roundedCircle]="true">
</core-button>
```

### Loading State

```html
<core-button 
  variant="primary" 
  [loading]="isLoading" 
  (clicked)="handleSubmit()">
  Submit
</core-button>
```

```typescript
export class ExampleComponent {
  isLoading = false;

  handleSubmit() {
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
```

### Disabled State

```html
<core-button variant="primary" [disabled]="true">
  Disabled Button
</core-button>
```

### Block Button (Full Width)

```html
<core-button variant="primary" [block]="true">
  Full Width Button
</core-button>
```

### Rounded Styles

```html
<!-- Rounded pill -->
<core-button variant="primary" [rounded]="true">
  Rounded Button
</core-button>

<!-- Circular (for icon-only buttons) -->
<core-button 
  variant="primary" 
  icon="bi-heart" 
  [roundedCircle]="true">
</core-button>
```

### Submit Button in Forms

```html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <!-- form fields here -->
  
  <core-button 
    type="submit" 
    variant="primary"
    [disabled]="myForm.invalid">
    Submit Form
  </core-button>
</form>
```

### Multiple Event Handlers

```html
<core-button
  variant="primary"
  (clicked)="onClick($event)"
  (mouseEntered)="onHover()"
  (mouseLeft)="onLeave()"
  (focused)="onFocus()"
  (doubleClicked)="onDoubleClick($event)">
  Interactive Button
</core-button>
```

```typescript
export class ExampleComponent {
  onClick(event: MouseEvent) {
    console.log('Clicked:', event);
  }

  onHover() {
    console.log('Mouse entered');
  }

  onLeave() {
    console.log('Mouse left');
  }

  onFocus() {
    console.log('Button focused');
  }

  onDoubleClick(event: MouseEvent) {
    console.log('Double clicked:', event);
  }
}
```

### Draggable Button

```html
<core-button
  variant="info"
  [draggable]="true"
  (dragStarted)="onDragStart($event)"
  (dragEnded)="onDragEnd($event)">
  Drag Me
</core-button>

<div 
  (dragover)="onDragOver($event)"
  (drop)="onDrop($event)">
  Drop Zone
</div>
```

```typescript
export class ExampleComponent {
  onDragStart(event: DragEvent) {
    event.dataTransfer?.setData('text/plain', 'button-data');
  }

  onDragEnd(event: DragEvent) {
    console.log('Drag ended');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer?.getData('text/plain');
    console.log('Dropped data:', data);
  }
}
```

### Button Group

```html
<div class="btn-group" role="group">
  <core-button variant="primary" [outline]="true">Left</core-button>
  <core-button variant="primary" [outline]="true">Middle</core-button>
  <core-button variant="primary" [outline]="true">Right</core-button>
</div>
```

---

## Styling

### Custom Classes

You can add custom CSS classes to further customize the button:

```html
<core-button 
  variant="primary" 
  customClass="my-custom-class">
  Custom Button
</core-button>
```

```scss
.my-custom-class {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
```

### CSS Variables

Override Bootstrap variables to customize globally:

```scss
:root {
  --bs-btn-padding-y: 0.5rem;
  --bs-btn-padding-x: 1rem;
  --bs-btn-font-size: 1rem;
  --bs-btn-border-radius: 0.375rem;
}
```

---

## Accessibility

The button component follows accessibility best practices:

### Keyboard Navigation
- **Space** or **Enter** - Activate button
- **Tab** - Navigate to/from button

### ARIA Support
- Proper button role is automatically applied
- Disabled state is properly communicated to screen readers
- Loading state includes appropriate ARIA attributes

### Best Practices

1. **Use descriptive text**: Make button text clear and action-oriented
   ```html
   <!-- Good -->
   <core-button variant="primary">Save Changes</core-button>
   
   <!-- Avoid -->
   <core-button variant="primary">OK</core-button>
   ```

2. **Provide context for icon-only buttons**: Use `aria-label` for buttons with only icons
   ```html
   <core-button 
     variant="primary" 
     icon="bi-search" 
     [roundedCircle]="true"
     aria-label="Search">
   </core-button>
   ```

3. **Use appropriate button types**: Use `type="submit"` for form submissions
   ```html
   <core-button type="submit" variant="primary">Submit Form</core-button>
   ```

4. **Disable during loading**: Always disable buttons during async operations
   ```html
   <core-button 
     [disabled]="isLoading" 
     [loading]="isLoading">
     Save
   </core-button>
   ```

---

## Tips & Best Practices

1. **Loading State**: Always use the `loading` property instead of manually disabling for async operations
2. **Event Handling**: The button automatically prevents event propagation when disabled
3. **Form Integration**: Use `type="submit"` for form submission buttons
4. **Icon Usage**: Use Bootstrap Icons classes (e.g., `bi-check-circle`)
5. **Accessibility**: Provide meaningful text or aria-labels for all buttons
6. **Variants**: Use semantic variants (success for save, danger for delete, etc.)

---

## Related Components

- [Input Component](Input-Component.md) - For form inputs
- [Modal Component](Modal-Component.md) - Buttons are commonly used in modals
- [Dropdown Component](Dropdown-Component.md) - For dropdown actions

---

[← Back to Components Overview](Components-Overview.md) | [Home](Home.md)
