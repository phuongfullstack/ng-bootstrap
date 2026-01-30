# Contributing to ng-bootstrap

Thank you for considering contributing to ng-bootstrap! This document provides guidelines for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 11+
- Angular CLI 21+
- Git

### Setup Development Environment

1. Fork and clone the repository:
```bash
git clone https://github.com/your-username/ng-bootstrap.git
cd ng-bootstrap
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser at `http://localhost:4200/`

## 📝 Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Making Changes

1. **Write Code**: Make your changes following the project's coding standards
2. **Write Tests**: Add unit tests for new functionality
3. **Run Tests**: Ensure all tests pass
```bash
npm test
```

4. **Lint Your Code**: Check for linting errors
```bash
npm run lint
```

5. **Format Code**: Format your code with Prettier
```bash
npm run format
```

### Commit Guidelines

We follow conventional commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(button): add loading state support"
git commit -m "fix(modal): prevent backdrop click when static"
git commit -m "docs(readme): update installation instructions"
```

## 🧪 Testing

### Unit Tests

- Write tests for all new components and features
- Use Vitest and Jasmine syntax
- Aim for high test coverage
- Test both happy paths and edge cases

Example test structure:
```typescript
describe('CoreButtonComponent', () => {
  it('should create', () => {
    // Test implementation
  });

  it('should emit clicked event when button is clicked', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- button.component.spec.ts
```

## 🎨 Code Style

### TypeScript

- Use TypeScript strict mode
- Provide explicit types for public APIs
- Use interfaces for object shapes
- Use enums for fixed sets of values

### Angular Best Practices

- Use standalone components
- Implement OnDestroy for cleanup
- Use OnPush change detection where possible
- Follow reactive programming patterns with RxJS
- Use signals for simple state management

### Component Guidelines

1. **Accessibility**: Always include proper ARIA attributes
2. **Keyboard Navigation**: Support keyboard interactions
3. **Focus Management**: Handle focus properly in modals and dropdowns
4. **Form Integration**: Implement ControlValueAccessor for form controls
5. **Documentation**: Add JSDoc comments for public APIs

### HTML Templates

- Use semantic HTML elements
- Include proper ARIA labels
- Keep templates simple and readable
- Use Angular built-in directives

### Styling

- Use SCSS for styling
- Follow BEM naming convention for CSS classes
- Keep styles scoped to components
- Use CSS custom properties for theming

## 📚 Component Development

### Creating a New Component

1. Generate the component:
```bash
ng generate component shared/components/core-your-component --standalone
```

2. Implement the component following existing patterns:
   - Extend BaseFormControlComponent if it's a form control
   - Add proper TypeScript types
   - Implement accessibility features
   - Add ARIA attributes

3. Create a demo component:
```bash
ng generate component features/core-demo/components/your-component-demo --standalone
```

4. Add to demo items:
   - Update `demo-items.ts`
   - Create demo page showcasing features

5. Write tests:
   - Create `.spec.ts` file
   - Test all public APIs
   - Test accessibility features

### Component Checklist

- [ ] TypeScript interfaces/types defined
- [ ] Component implements proper lifecycle hooks
- [ ] Accessibility attributes (ARIA, roles)
- [ ] Keyboard navigation support
- [ ] Unit tests written and passing
- [ ] Demo page created
- [ ] Documentation added (JSDoc)
- [ ] Responsive design tested
- [ ] Form integration (if applicable)

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

1. Check if the bug has already been reported
2. Ensure you're using the latest version
3. Verify the bug is reproducible

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Angular version: [e.g., 21.0.0]
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 📋 Pull Request Process

### Before Submitting

1. Ensure all tests pass
2. Update documentation if needed
3. Follow the code style guidelines
4. Add/update tests for your changes
5. Ensure no ESLint warnings/errors
6. Format code with Prettier

### Pull Request Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] All tests passing
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### Review Process

1. Submit your PR
2. Wait for automated checks to complete
3. Address review feedback
4. Get approval from maintainers
5. PR will be merged by maintainers

## 🔒 Security

If you discover a security vulnerability, please email the maintainers directly instead of opening a public issue.

## 📞 Getting Help

- Create an issue for bugs or feature requests
- Check existing documentation
- Review closed issues for similar problems

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to ng-bootstrap! 🎉
