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
- **[Architecture](Architecture.md)** - Understand the project structure
- **[Button Component](Button-Component.md)** - Start with a simple component example
- **[Contributing](Contributing.md)** - Learn how to contribute

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

## Support

If you encounter any issues:
1. Check the [FAQ](FAQ.md)
2. Review [GitHub Issues](https://github.com/phuongfullstack/ng-bootstrap/issues)
3. Create a new issue with detailed information about your problem

---

[← Back to Home](Home.md) | [Next: Components Overview →](Components-Overview.md)
