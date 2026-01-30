# Modal Component

The `core-modal` component provides a flexible, accessible modal dialog with Bootstrap 5.3 styling, multiple sizes, custom content support, and comprehensive event handling with focus trap functionality.

## Table of Contents
- [Basic Usage](#basic-usage)
- [Properties](#properties)
- [Events](#events)
- [ModalService](#modalservice)
- [Examples](#examples)
- [Accessibility](#accessibility)
- [Tips & Best Practices](#tips--best-practices)

---

## Basic Usage

### Template-based Modal

```typescript
import { Component, ViewChild } from '@angular/core';
import { CoreModalComponent } from '@shared/components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CoreModalComponent],
  template: `
    <button (click)="modal.open()">Open Modal</button>
    
    <core-modal 
      #modal
      title="Example Modal"
      [closable]="true"
      (closed)="handleClose()">
      <div modal-body>
        <p>This is the modal content.</p>
      </div>
    </core-modal>
  `
})
export class ExampleComponent {
  @ViewChild('modal') modal!: CoreModalComponent;

  handleClose() {
    console.log('Modal closed!');
  }
}
```

### Service-based Modal

```typescript
import { Component } from '@angular/core';
import { ModalService } from '@core/services';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `<button (click)="openModal()">Open Modal</button>`
})
export class ExampleComponent {
  constructor(private modalService: ModalService) {}

  openModal() {
    this.modalService.open({
      title: 'Confirm Action',
      size: 'md',
      buttons: [
        {
          label: 'Cancel',
          style: 'secondary'
        },
        {
          label: 'Confirm',
          style: 'primary',
          handler: () => {
            console.log('Confirmed!');
            return true; // Close modal
          }
        }
      ]
    }).subscribe(result => {
      console.log('Modal result:', result);
    });
  }
}
```

---

## Properties

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | `undefined` | Modal title displayed in header |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'fullscreen'` | `'lg'` | Modal size |
| `closable` | `boolean` | `true` | Whether modal can be closed with Escape key |
| `backdrop` | `'static' \| true \| false` | `true` | Backdrop behavior: `true` = closable backdrop, `false` = no backdrop, `'static'` = non-closable backdrop |
| `showCloseButton` | `boolean` | `true` | Whether to show the close button in header |
| `buttons` | `ModalButton[]` | `[]` | Array of action buttons in footer |
| `customClass` | `string` | `undefined` | Additional CSS classes for modal container |
| `data` | `any` | `undefined` | Custom data passed to modal (supports `contentHtml` for HTML content) |
| `content` | `Type<any>` | `undefined` | Dynamic component to load in modal body |
| `contentProps` | `Record<string, any>` | `undefined` | Properties to pass to dynamic content component |

### ModalButton Interface

```typescript
interface ModalButton {
  label: string;                    // Button text
  style?: BootstrapVariant;         // Button variant (primary, secondary, etc.)
  icon?: string;                    // Icon class (e.g., 'bi-check')
  disabled?: boolean;               // Whether button is disabled
  handler?: (modal?: any, dynamicInstance?: any) => void | boolean | Promise<boolean>;
  closeOnClick?: boolean;           // Whether to close modal on click (default: true)
}
```

### ModalConfig Interface

Used with `ModalService.open()`:

```typescript
interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';
  closable?: boolean;
  backdrop?: 'static' | true | false;
  showCloseButton?: boolean;
  buttons?: ModalButton[];
  customClass?: string;
  data?: any;
  content?: Type<any>;              // Component to dynamically load
  contentProps?: Record<string, any>; // Props for dynamic component
}
```

### Available Sizes

- `sm` - Small modal (300px)
- `md` - Medium modal (500px) 
- `lg` - Large modal (800px) - Default
- `xl` - Extra large modal (1140px)
- `fullscreen` - Full screen modal

---

## Events

| Event | Type | Description |
|-------|------|-------------|
| `opened` | `EventEmitter<void>` | Emitted when modal is opened |
| `closed` | `EventEmitter<any>` | Emitted when modal is closed (passes close result) |
| `confirmed` | `EventEmitter<any>` | Reserved for future use |

---

## ModalService

The `ModalService` provides programmatic modal control with a simpler API.

### Methods

#### `open(config: ModalConfig): Observable<any>`

Opens a modal with the given configuration. Returns an Observable that emits when the modal is closed.

```typescript
modalService.open({
  title: 'My Modal',
  size: 'md',
  buttons: [...]
}).subscribe(result => {
  console.log('Modal closed with:', result);
});
```

#### `close(): void`

Closes the currently open modal.

```typescript
modalService.close();
```

#### `isOpen(): boolean`

Checks if a modal is currently open.

```typescript
if (modalService.isOpen()) {
  console.log('A modal is open');
}
```

---

## Examples

### Basic Modal with Content

```typescript
@Component({
  standalone: true,
  imports: [CoreModalComponent],
  template: `
    <button (click)="modal.open()">Open Modal</button>
    
    <core-modal 
      #modal
      title="Welcome"
      size="md">
      <div modal-body>
        <h4>Hello!</h4>
        <p>This is a simple modal with custom content.</p>
      </div>
    </core-modal>
  `
})
export class BasicModalExample {
  @ViewChild('modal') modal!: CoreModalComponent;
}
```

### Modal with Action Buttons

```typescript
@Component({
  standalone: true,
  imports: [CoreModalComponent],
  template: `
    <button (click)="modal.open()">Delete Item</button>
    
    <core-modal 
      #modal
      title="Confirm Deletion"
      size="sm"
      [buttons]="buttons"
      (closed)="onModalClosed($event)">
      <div modal-body>
        <p>Are you sure you want to delete this item?</p>
      </div>
    </core-modal>
  `
})
export class ConfirmModalExample {
  @ViewChild('modal') modal!: CoreModalComponent;

  buttons: ModalButton[] = [
    {
      label: 'Cancel',
      style: 'secondary',
      handler: () => {
        console.log('Cancelled');
        return true; // Close modal
      }
    },
    {
      label: 'Delete',
      style: 'danger',
      icon: 'bi-trash',
      handler: async () => {
        await this.deleteItem();
        return true; // Close modal after deletion
      }
    }
  ];

  async deleteItem() {
    // Perform deletion
    console.log('Item deleted');
  }

  onModalClosed(result: any) {
    console.log('Modal closed with:', result);
  }
}
```

### Modal with Dynamic Content

```typescript
// Content component
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <label>Name: <input [(ngModel)]="name" /></label>
      <label>Email: <input [(ngModel)]="email" /></label>
    </div>
  `
})
export class UserFormComponent {
  name = '';
  email = '';
}

// Main component
@Component({
  standalone: true,
  imports: [CoreModalComponent],
  template: `
    <button (click)="modal.open()">Add User</button>
    
    <core-modal 
      #modal
      title="Add New User"
      [content]="userFormComponent"
      [contentProps]="formProps"
      [buttons]="buttons">
    </core-modal>
  `
})
export class DynamicContentExample {
  @ViewChild('modal') modal!: CoreModalComponent;
  userFormComponent = UserFormComponent;
  
  formProps = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  buttons: ModalButton[] = [
    {
      label: 'Cancel',
      style: 'secondary'
    },
    {
      label: 'Save',
      style: 'primary',
      handler: (modal, dynamicInstance) => {
        console.log('Saved user:', dynamicInstance.name, dynamicInstance.email);
        return true;
      }
    }
  ];
}
```

### Using ModalService with HTML Content

```typescript
export class ServiceModalExample {
  constructor(private modalService: ModalService) {}

  showAlert() {
    this.modalService.open({
      title: 'Alert',
      size: 'sm',
      data: {
        contentHtml: '<p><strong>Warning:</strong> This action cannot be undone.</p>'
      },
      buttons: [
        {
          label: 'OK',
          style: 'primary'
        }
      ]
    }).subscribe(result => {
      console.log('Alert dismissed');
    });
  }
}
```

### Modal Sizes

```typescript
@Component({
  standalone: true,
  template: `
    <button (click)="openSmall()">Small Modal</button>
    <button (click)="openMedium()">Medium Modal</button>
    <button (click)="openLarge()">Large Modal</button>
    <button (click)="openExtraLarge()">XL Modal</button>
    <button (click)="openFullscreen()">Fullscreen Modal</button>
  `
})
export class SizesExample {
  constructor(private modalService: ModalService) {}

  openSmall() {
    this.modalService.open({
      title: 'Small Modal',
      size: 'sm',
      data: { contentHtml: '<p>This is a small modal.</p>' }
    });
  }

  openMedium() {
    this.modalService.open({
      title: 'Medium Modal',
      size: 'md',
      data: { contentHtml: '<p>This is a medium modal.</p>' }
    });
  }

  openLarge() {
    this.modalService.open({
      title: 'Large Modal',
      size: 'lg',
      data: { contentHtml: '<p>This is a large modal.</p>' }
    });
  }

  openExtraLarge() {
    this.modalService.open({
      title: 'Extra Large Modal',
      size: 'xl',
      data: { contentHtml: '<p>This is an extra large modal.</p>' }
    });
  }

  openFullscreen() {
    this.modalService.open({
      title: 'Fullscreen Modal',
      size: 'fullscreen',
      data: { contentHtml: '<p>This is a fullscreen modal.</p>' }
    });
  }
}
```

### Non-Closable Modal (Static Backdrop)

```typescript
export class StaticModalExample {
  constructor(private modalService: ModalService) {}

  showFormModal() {
    this.modalService.open({
      title: 'Complete Form',
      backdrop: 'static',  // Cannot close by clicking backdrop
      closable: false,     // Cannot close with Escape key
      showCloseButton: false, // No X button
      data: {
        contentHtml: `
          <p>Please complete the form before closing.</p>
          <p>You must click one of the buttons below.</p>
        `
      },
      buttons: [
        {
          label: 'Cancel',
          style: 'secondary'
        },
        {
          label: 'Submit',
          style: 'primary',
          handler: () => {
            // Form submission logic
            return true; // Close modal
          }
        }
      ]
    });
  }
}
```

### Modal with Async Button Handler

```typescript
export class AsyncModalExample {
  constructor(private modalService: ModalService) {}

  showSaveModal() {
    this.modalService.open({
      title: 'Save Changes',
      buttons: [
        {
          label: 'Cancel',
          style: 'secondary'
        },
        {
          label: 'Save',
          style: 'primary',
          handler: async () => {
            // Perform async operation
            try {
              await this.saveChanges();
              console.log('Saved successfully');
              return true; // Close modal on success
            } catch (error) {
              console.error('Save failed:', error);
              return false; // Keep modal open on error
            }
          }
        }
      ]
    });
  }

  async saveChanges(): Promise<void> {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  }
}
```

### Modal with Custom Footer

```typescript
@Component({
  standalone: true,
  imports: [CoreModalComponent],
  template: `
    <button (click)="modal.open()">Open Custom Footer Modal</button>
    
    <core-modal 
      #modal
      title="Custom Footer"
      [showCloseButton]="false">
      <div modal-body>
        <p>Modal with custom footer buttons.</p>
      </div>
      <div modal-footer>
        <button class="btn btn-outline-secondary" (click)="modal.close()">
          Maybe Later
        </button>
        <button class="btn btn-success" (click)="handleSave()">
          <i class="bi-check-circle"></i> Save & Close
        </button>
      </div>
    </core-modal>
  `
})
export class CustomFooterExample {
  @ViewChild('modal') modal!: CoreModalComponent;

  handleSave() {
    console.log('Saving...');
    this.modal.close({ saved: true });
  }
}
```

### Preventing Modal Close

```typescript
export class PreventCloseExample {
  constructor(private modalService: ModalService) {}

  showModal() {
    this.modalService.open({
      title: 'Unsaved Changes',
      buttons: [
        {
          label: 'Keep Editing',
          style: 'secondary',
          handler: () => {
            console.log('Continue editing');
            return false; // Don't close modal
          }
        },
        {
          label: 'Discard Changes',
          style: 'danger',
          handler: () => {
            console.log('Changes discarded');
            return true; // Close modal
          }
        }
      ]
    });
  }
}
```

### Form Validation in Modal

```typescript
// Form component
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input type="text" class="form-control" formControlName="username">
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" class="form-control" formControlName="password">
      </div>
    </form>
  `
})
export class LoginFormComponent {
  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
}

// Main component
export class FormModalExample {
  constructor(private modalService: ModalService) {}

  showLoginModal() {
    this.modalService.open({
      title: 'Login',
      content: LoginFormComponent,
      buttons: [
        {
          label: 'Cancel',
          style: 'secondary'
        },
        {
          label: 'Login',
          style: 'primary',
          handler: (modal, formInstance) => {
            if (formInstance.form.valid) {
              console.log('Login with:', formInstance.form.value);
              return true; // Close modal
            } else {
              alert('Please fill in all fields');
              return false; // Keep modal open
            }
          }
        }
      ]
    });
  }
}
```

---

## Accessibility

The modal component follows WCAG 2.1 accessibility guidelines:

### Focus Management

- **Auto-focus**: Modal automatically focuses the first focusable element when opened
- **Focus trap**: Tab key navigation is trapped within the modal
- **Focus restoration**: Focus returns to the trigger element when modal closes

### Keyboard Navigation

- **Escape** - Close modal (if `closable` is true and backdrop is not `'static'`)
- **Tab** - Navigate forward through focusable elements
- **Shift + Tab** - Navigate backward through focusable elements
- Focus wraps from last to first element and vice versa

### ARIA Support

- `role="dialog"` - Identifies the modal as a dialog
- `aria-modal="true"` - Indicates modal dialog behavior
- `aria-labelledby` - Associates modal with its title
- `aria-hidden` - Properly communicates visibility state

### Screen Reader Compatibility

The modal is fully compatible with:
- JAWS
- NVDA
- VoiceOver
- TalkBack

### Best Practices

1. **Always provide a title**: Helps screen reader users understand the modal purpose
   ```typescript
   modalService.open({
     title: 'Confirm Action',  // Always include
     // ...
   });
   ```

2. **Use semantic buttons**: Provide clear, action-oriented button labels
   ```typescript
   // Good
   buttons: [
     { label: 'Delete Item', style: 'danger' },
     { label: 'Cancel', style: 'secondary' }
   ]
   
   // Avoid
   buttons: [
     { label: 'Yes', style: 'primary' },
     { label: 'No', style: 'secondary' }
   ]
   ```

3. **Don't nest modals**: Opening a modal from within another modal creates confusion
   ```typescript
   // Avoid
   handler: () => {
     this.modalService.open({ /* another modal */ });
   }
   ```

4. **Use appropriate backdrop settings**: 
   - Use `backdrop: 'static'` for critical forms that shouldn't be accidentally dismissed
   - Use `backdrop: true` (default) for most scenarios
   - Use `backdrop: false` only when you need the user to interact with background content

5. **Provide escape options**: Unless absolutely necessary, always provide a way to close the modal
   ```typescript
   // Only for critical actions
   {
     backdrop: 'static',
     closable: false,
     buttons: [{ label: 'I Understand', style: 'primary' }]
   }
   ```

---

## Tips & Best Practices

### 1. Choose the Right Approach

**Use Template-based Modal when:**
- Modal content is static or simple
- You need direct access to parent component data
- You prefer declarative templates

**Use Service-based Modal when:**
- You need programmatic control
- Opening modals from services or guards
- Creating reusable alert/confirm dialogs
- Modal doesn't need complex parent interaction

### 2. Button Handler Return Values

```typescript
handler: () => {
  // Return nothing or void: Close modal if closeOnClick !== false
  doSomething();
}

handler: () => {
  // Return false: Prevent modal from closing
  if (!isValid) return false;
  return true;
}

handler: async () => {
  // Return Promise<boolean>: Async validation
  const success = await saveData();
  return success; // Close only if true
}
```

### 3. Memory Management

Always clean up subscriptions when using ModalService:

```typescript
export class MyComponent implements OnDestroy {
  private subscription?: Subscription;

  openModal() {
    this.subscription = this.modalService.open({...}).subscribe();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
```

### 4. Dynamic Component Communication

Pass data to dynamic components and retrieve results:

```typescript
modalService.open({
  content: MyFormComponent,
  contentProps: {
    initialData: { name: 'John', age: 30 }
  },
  buttons: [
    {
      label: 'Save',
      handler: (modal, componentInstance) => {
        // Access component instance
        console.log(componentInstance.formData);
        return true;
      }
    }
  ]
});
```

### 5. Size Guidelines

- **sm**: Confirmations, alerts, simple choices
- **md**: Short forms, simple data entry
- **lg**: Default, good for most use cases
- **xl**: Complex forms, detailed content
- **fullscreen**: Image galleries, detailed tables, multi-step wizards

### 6. Error Handling

Handle errors in button handlers gracefully:

```typescript
buttons: [
  {
    label: 'Submit',
    style: 'primary',
    handler: async () => {
      try {
        await submitForm();
        return true; // Success: close modal
      } catch (error) {
        console.error('Submission failed:', error);
        alert('Failed to submit. Please try again.');
        return false; // Error: keep modal open
      }
    }
  }
]
```

### 7. Custom Styling

Add custom classes for specific styling needs:

```typescript
modalService.open({
  customClass: 'my-custom-modal',
  // ...
});
```

```scss
.my-custom-modal {
  .modal-content {
    border-radius: 1rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }
  
  .modal-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
}
```

### 8. Loading States

Show loading indicators in buttons during async operations:

```typescript
// Create a loading state in your dynamic component
@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <p *ngIf="!loading">Ready to submit?</p>
      <p *ngIf="loading">Processing...</p>
    </div>
  `
})
export class FormComponent {
  loading = false;
}

// Update in button handler
buttons: [
  {
    label: 'Submit',
    handler: async (modal, instance) => {
      instance.loading = true;
      await performAsyncAction();
      instance.loading = false;
      return true;
    }
  }
]
```

---

## Related Components

- [Button Component](Button-Component.md) - Modal buttons use button styling

---

[← Back to Components Overview](Components-Overview.md) | [Home](Home.md)
