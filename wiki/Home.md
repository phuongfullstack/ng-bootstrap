# Welcome to ng-bootstrap Wiki

Welcome to the **ng-bootstrap** project wiki! This is a comprehensive Angular component library built with Bootstrap 5.3, providing reusable, well-tested, and accessible components for modern Angular applications.

## 📚 Documentation Overview

### Getting Started
- **[Getting Started](Getting-Started.md)** - Setup, installation, and basic usage
- **[Architecture](Architecture.md)** - Project structure and design patterns
- **[Contributing](Contributing.md)** - How to contribute to the project
- **[FAQ](FAQ.md)** - Frequently asked questions

### Component Documentation
- **[Components Overview](Components-Overview.md)** - Complete list of available components

#### Form Components
- **[Button Component](Button-Component.md)** - Customizable buttons with various styles
- **[Input Component](Input-Component.md)** - Text input with validation support
- **[Checkbox Component](Checkbox-Component.md)** - Single and group checkboxes
- **[Radio Component](Radio-Component.md)** - Radio button groups
- **[Switch Component](Switch-Component.md)** - Toggle switches
- **[Dropdown Component](Dropdown-Component.md)** - Select dropdowns with single/multiple selection
- **[Autocomplete Component](Autocomplete-Component.md)** - Searchable autocomplete input
- **[DateTimePicker Component](DateTimePicker-Component.md)** - Date and time selection

#### UI Components
- **[Modal Component](Modal-Component.md)** - Customizable modal dialogs
- **[Table Component](Table-Component.md)** - Feature-rich data tables
- **[Progress Component](Progress-Component.md)** - Progress bars and indicators
- **[Toastr Component](Toastr-Component.md)** - Toast notifications

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/phuongfullstack/ng-bootstrap.git

# Install dependencies
cd ng-bootstrap
npm install

# Start the development server
npm start
```

Visit `http://localhost:4200/` to see the demo application with all components.

## 🎯 Key Features

- **🎨 Bootstrap 5.3 Integration** - Built on top of Bootstrap 5.3 for modern styling
- **⚡ Standalone Components** - All components are standalone for tree-shaking and modularity
- **📝 Reactive Forms Support** - Full support for Angular Reactive Forms
- **♿ Accessibility** - WCAG compliant components with keyboard navigation
- **🔄 Change Detection** - OnPush strategy for optimal performance
- **📱 Responsive Design** - Mobile-first responsive components
- **🎭 Customizable** - Extensive configuration options and custom styling support
- **🧪 Well-tested** - Comprehensive unit tests with Vitest

## 💡 Common Use Cases

### Building Forms Quickly
Our form components integrate seamlessly with Angular Reactive Forms:
```typescript
myForm = this.fb.group({
  username: ['', [Validators.required, Validators.minLength(3)]],
  email: ['', [Validators.required, Validators.email]],
  role: ['user'],
  notifications: [true]
});
```

### Creating Data Tables
Display and manage data with our feature-rich table component:
- Sortable columns
- Pagination support
- Row selection
- Custom cell templates
- Responsive layout

### User Notifications
Show toast messages for user feedback:
```typescript
this.toastrService.success('Profile updated successfully!');
this.toastrService.error('Failed to save changes. Please try again.');
```

### Modal Dialogs
Create confirmation dialogs, forms, or custom content modals:
```typescript
this.modalService.open(MyModalComponent, {
  size: 'lg',
  centered: true
});
```

## 🏗️ Project Structure

```
ng-bootstrap/
├── src/
│   ├── app/
│   │   ├── core/          # Core services (Modal service, etc.)
│   │   ├── features/      # Feature modules (demos)
│   │   └── shared/        # Shared components, utilities, types
│   │       ├── components/  # Reusable UI components
│   │       ├── services/    # Shared services
│   │       ├── types/       # Type definitions
│   │       ├── utils/       # Utility functions
│   │       └── validation/  # Form validators
│   └── styles.scss        # Global styles
├── public/                # Static assets
└── wiki/                  # Documentation (this wiki)
```

## 🎓 Learning Path

### For Beginners
1. Start with [Getting Started](Getting-Started.md) guide
2. Explore [Button Component](Button-Component.md) - simplest component
3. Try [Input Component](Input-Component.md) - learn form integration
4. Build a simple form combining multiple components

### For Intermediate Users
1. Review [Components Overview](Components-Overview.md)
2. Learn [Table Component](Table-Component.md) - most feature-rich
3. Master [Modal Component](Modal-Component.md) - advanced patterns
4. Study the demo code in `src/app/features/core-demo/`

### For Advanced Users
1. Read [Architecture](Architecture.md) - understand design patterns
2. Review source code of components
3. Contribute via [Contributing Guide](Contributing.md)
4. Create custom components based on existing patterns

## 🔧 Development Tools

### Code Quality
- **ESLint**: Enforces Angular-specific coding standards
- **Prettier**: Maintains consistent code formatting
- **Lefthook**: Pre-commit hooks for quality checks
- **TypeScript Strict Mode**: Catches errors at compile time

### Testing
- **Vitest**: Fast unit test execution
- **Coverage Reports**: Track test coverage
- **Component Testing**: Isolated component tests

## 🌟 Best Practices

### Component Usage
1. Always import components as standalone
2. Use proper TypeScript types
3. Handle errors and loading states
4. Implement accessibility features
5. Follow Angular style guide

### Form Development
1. Use Reactive Forms for complex forms
2. Implement proper validation
3. Show clear error messages
4. Handle form submission states
5. Provide user feedback

### Performance
1. Use OnPush change detection
2. Lazy load components when possible
3. Minimize template expressions
4. Use trackBy in *ngFor loops
5. Unsubscribe from observables

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](Contributing.md) for details on:
- Code style and conventions
- Development workflow
- Testing requirements
- Pull request process

## ❓ Getting Help

### Common Issues
- **Build Errors**: Check Node.js version (v18+)
- **Port Conflicts**: Use `ng serve --port 4300`
- **Import Errors**: Verify path aliases in tsconfig.json
- **Styling Issues**: Ensure Bootstrap is properly imported

### Support Channels
1. Check the [FAQ](FAQ.md)
2. Search existing [GitHub Issues](https://github.com/phuongfullstack/ng-bootstrap/issues)
3. Review component documentation
4. Create a new issue with detailed information

## 📝 License

This project is open source and available under the MIT License.

## 🔗 Resources

- [Angular Documentation](https://angular.dev/)
- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [GitHub Repository](https://github.com/phuongfullstack/ng-bootstrap)

## 📊 Project Statistics

- **Components**: 13 production-ready components
- **Bootstrap Version**: 5.3.8
- **Angular Version**: 21.1.2
- **TypeScript**: Strict mode enabled
- **Test Coverage**: Comprehensive unit tests
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

**Happy coding! 🎉**
