# ng-bootstrap

A modern Angular 21 component library built on Bootstrap 5.3, providing accessible, reusable UI components with TypeScript support and reactive forms integration.

## 🚀 Features

- ✨ **13 Production-Ready Components**: Button, Input, Checkbox, Radio, Dropdown, Autocomplete, DatetimePicker, Modal, Table, Progress, Switch, Toast, and more
- 🎨 **Bootstrap 5.3 Integration**: Leverages Bootstrap's design system with Bootstrap Icons
- ♿ **Accessibility First**: ARIA attributes, keyboard navigation, and focus management
- 📝 **TypeScript Support**: Fully typed with strict mode enabled
- 🔄 **Reactive Forms**: Seamless integration with Angular reactive forms via ControlValueAccessor
- 🎯 **Standalone Components**: Modern Angular standalone components architecture
- 🧪 **Well Tested**: Comprehensive test coverage with Vitest

## 📦 Installation

```bash
npm install
```

## 🛠️ Development

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

### Development server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

To build the project:

```bash
npm run build
# or
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Testing

To execute unit tests with [Vitest](https://vitest.dev/):

```bash
npm test
# or
ng test
```

### Linting

To lint the codebase with ESLint:

```bash
npm run lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
```

### Code Formatting

To format code with Prettier:

```bash
npm run format
```

To check code formatting:

```bash
npm run format:check
```

## 📚 Components

### Core Components

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Button** | Customizable buttons | Variants, sizes, icons, loading states, drag-drop |
| **Input** | Text input fields | Validation, hints, error messages |
| **Checkbox** | Checkbox controls | Single & group modes |
| **Radio** | Radio button controls | Single & group modes |
| **Dropdown** | Select dropdowns | Single & multiple selection |
| **Autocomplete** | Searchable autocomplete | Async search, custom templates |
| **DatetimePicker** | Date/time selection | Date & time picking |
| **Modal** | Modal dialogs | Dynamic content, customizable buttons |
| **Table** | Data tables | Sortable, filterable, selectable rows |
| **Progress** | Progress bars | Multiple variants |
| **Switch** | Toggle switches | On/off state |
| **Toast** | Toast notifications | Auto-dismiss, actions, queue management |

### Usage Example

```typescript
import { Component } from '@angular/core';
import { CoreButtonComponent } from '@shared/components';

@Component({
  selector: 'app-example',
  imports: [CoreButtonComponent],
  template: `
    <core-button 
      variant="primary" 
      size="md"
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

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/           # Core services and utilities
│   ├── features/       # Feature modules and pages
│   │   └── core-demo/  # Component demonstration pages
│   └── shared/         # Shared components and utilities
│       ├── components/ # Reusable UI components
│       ├── services/   # Shared services
│       ├── types/      # TypeScript type definitions
│       └── utils/      # Utility functions
├── index.html
└── main.ts
```

## 🔧 Configuration

### TypeScript

The project uses strict TypeScript configuration:
- Strict mode enabled
- Strict templates
- Strict injection parameters

### Code Quality

- **ESLint**: Angular-specific linting rules
- **Prettier**: Code formatting with 100 character line width
- **Lefthook**: Git hooks for pre-commit checks

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow Angular style guide
- Write unit tests for new components
- Ensure accessibility compliance
- Update documentation

## 📄 License

This project is private and proprietary.

## 🔗 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3/)
- [Angular Documentation](https://angular.dev/)

