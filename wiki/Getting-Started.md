# Getting Started

This guide will help you set up and start using the ng-bootstrap component library in your Angular project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v11.4.0 or higher)
- **Angular CLI** (v21.0.0 or higher)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/phuongfullstack/ng-bootstrap.git
cd ng-bootstrap
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Angular 21.0.0
- Bootstrap 5.3.8
- Bootstrap Icons 1.13.1
- RxJS 7.8.0

### 3. Start the Development Server

```bash
npm start
# or
ng serve
```

Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

## Project Commands

### Development

```bash
# Start development server
npm start

# Build with watch mode
npm run watch
```

### Building

```bash
# Build for production
npm run build

# Output will be in the dist/ directory
```

### Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint the codebase
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

## Using Components in Your Project

### Importing Components

All components in this library are **standalone components**, making them easy to import and use:

```typescript
import { Component } from '@angular/core';
import { CoreButtonComponent } from '@shared/components';

@Component({
  selector: 'app-my-component',
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
export class MyComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

### Using with Reactive Forms

Most form components support Angular Reactive Forms:

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoreInputComponent } from '@shared/components';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [ReactiveFormsModule, CoreInputComponent],
  template: `
    <form [formGroup]="myForm">
      <core-input
        formControlName="email"
        placeholder="Enter your email"
        label="Email"
        type="email">
      </core-input>
    </form>
  `
})
export class MyFormComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
}
```

## Bootstrap Integration

### CSS

Bootstrap styles are already configured in the project. The main stylesheet includes:

```scss
// src/styles.scss
@import 'bootstrap/scss/bootstrap';
@import 'bootstrap-icons/font/bootstrap-icons.css';
```

### Bootstrap Icons

Bootstrap Icons are available throughout the application. Use them in components:

```html
<core-button icon="bi-check-circle" variant="success">
  Success
</core-button>
```

### Available Icon Classes
Browse the full icon library at [Bootstrap Icons](https://icons.getbootstrap.com/).

Common examples:
- `bi-check-circle`, `bi-x-circle`
- `bi-arrow-left`, `bi-arrow-right`
- `bi-pencil`, `bi-trash`
- `bi-plus`, `bi-dash`
- `bi-search`, `bi-filter`

## Path Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { CoreButtonComponent } from '../../shared/components/core-button/core-button.component';
// Use:
import { CoreButtonComponent } from '@shared/components';

// Other aliases:
import { ModalService } from '@core/services';
import { BootstrapVariant } from '@shared/types';
import { IdGenerator } from '@shared/utils';
```

Path aliases are configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["src/app/shared/*"],
      "@core/*": ["src/app/core/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

## Quick Start Examples

### Example 1: Simple Form

```typescript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoreInputComponent, CoreButtonComponent } from '@shared/components';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CoreInputComponent, CoreButtonComponent],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <core-input
        formControlName="username"
        label="Username"
        placeholder="Enter username"
        [required]="true">
      </core-input>
      
      <core-input
        formControlName="password"
        label="Password"
        type="password"
        placeholder="Enter password"
        [required]="true">
      </core-input>
      
      <core-button 
        type="submit"
        variant="primary"
        [disabled]="!loginForm.valid">
        Login
      </core-button>
    </form>
  `
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
    }
  }
}
```

### Example 2: Data Table with Actions

```typescript
import { Component } from '@angular/core';
import { CoreTableComponent, CoreButtonComponent } from '@shared/components';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [CoreTableComponent, CoreButtonComponent],
  template: `
    <core-table
      [data]="users"
      [columns]="columns"
      [pageable]="true"
      [pageSize]="10">
    </core-table>
  `
})
export class UsersTableComponent {
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
  ];

  columns = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'name', header: 'Name', sortable: true },
    { field: 'email', header: 'Email' },
    { field: 'role', header: 'Role' }
  ];
}
```

### Example 3: Toast Notifications

```typescript
import { Component } from '@angular/core';
import { CoreToastrService, CoreButtonComponent } from '@shared/components';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CoreButtonComponent],
  template: `
    <core-button variant="success" (clicked)="showSuccess()">
      Show Success
    </core-button>
    <core-button variant="danger" (clicked)="showError()">
      Show Error
    </core-button>
  `
})
export class NotificationsComponent {
  constructor(private toastr: CoreToastrService) {}

  showSuccess() {
    this.toastr.success('Operation completed successfully!');
  }

  showError() {
    this.toastr.error('An error occurred. Please try again.');
  }
}
```

## Demo Application

The project includes a comprehensive demo application showcasing all components. To explore the demos:

1. Start the development server: `npm start`
2. Navigate to `http://localhost:4200/`
3. Browse through different component demos in the sidebar

The demo code can be found in:
```
src/app/features/core-demo/components/
```

Each demo includes:
- Live component examples
- Code samples
- Configuration options
- Best practices

## Next Steps

Now that you have the project running, explore:

- **[Components Overview](Components-Overview.md)** - Browse all available components
- **[Button Component](Button-Component.md)** - Start with a simple component example
- **[Table Component](Table-Component.md)** - Explore advanced features
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Learn how to contribute (in root directory)

## Troubleshooting

### Port Already in Use

If port 4200 is already in use:
```bash
ng serve --port 4300
```

### Node Version Issues

Ensure you're using Node.js v18 or higher:
```bash
node --version
```

If you need to upgrade Node.js:
- Use [nvm](https://github.com/nvm-sh/nvm): `nvm install 18 && nvm use 18`
- Or download from [nodejs.org](https://nodejs.org/)

### Package Installation Issues

Clear npm cache and reinstall:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

If you encounter build errors, try:
```bash
# Clean build
rm -rf dist/
npm run build
```

### TypeScript Errors

If you encounter TypeScript compilation errors:
```bash
# Check TypeScript version
npx tsc --version

# Clean TypeScript cache
rm -rf node_modules/.cache
```

### Import Path Issues

If imports are not resolving:
1. Check `tsconfig.json` for correct path mappings
2. Restart your IDE/editor
3. Run `ng serve` again

### Test Failures

If tests are failing:
```bash
# Run tests with verbose output
npm test -- --reporter=verbose

# Run specific test file
npm test -- button.component.spec.ts
```

## Common Questions

**Q: Can I use these components in an existing Angular project?**  
A: Yes! Since all components are standalone, you can copy them to your project and import them directly.

**Q: Do I need Bootstrap installed?**  
A: Yes, Bootstrap 5.3+ is required. The styles are imported in the main stylesheet.

**Q: Are the components mobile-friendly?**  
A: Yes, all components are responsive and follow mobile-first design principles.

**Q: Can I customize the component styles?**  
A: Yes, you can override Bootstrap variables or add custom CSS classes.

**Q: Is TypeScript required?**  
A: Yes, this project uses TypeScript with strict mode enabled.

## Support

If you encounter any issues:
1. Review the component documentation in this wiki
2. Search [GitHub Issues](https://github.com/phuongfullstack/ng-bootstrap/issues)
3. Create a new issue with detailed information about your problem

---

[← Back to Home](Home.md) | [Next: Components Overview →](Components-Overview.md)
