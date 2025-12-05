# Contributing to HomeForge

Thank you for considering contributing to HomeForge!

This document provides guidelines and instructions for contributing to the project.

---

## Ways to Contribute

### 1. Report Bugs
Found a bug? Help us fix it by:
- Checking if the issue already exists
- Creating a detailed bug report with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots/videos if applicable
  - Environment info (browser, OS, etc.)

### 2. Suggest Features
Have an idea? We'd love to hear it!
- Search existing feature requests first
- Describe the feature clearly
- Explain the use case and benefits
- Consider backward compatibility

### 3. Improve Documentation
- Fix typos or unclear explanations
- Add examples or tutorials
- Translate documentation
- Update outdated information

### 4. Contribute Code
- Fix bugs
- Implement features
- Add new widgets
- Optimize performance
- Improve accessibility

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally:
     ```bash
     git clone https://github.com/YOUR_USERNAME/HomeForge.git
     cd HomeForge
     ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Make your changes**
   - Create a new branch for your feature/fix:
     ```bash
     git checkout -b feature/your-feature-name
     ```
   - Write clear, concise commit messages
   - Follow the existing code style
   - Add comments for complex logic

5. **Test your changes**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

6. **Submit a pull request**
   - Push your changes to your fork
   - Create a pull request from your branch to `main`
   - Fill out the pull request template
   - Wait for review and address any feedback

---

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use type inference where appropriate

### React
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop types

### CSS/Tailwind
- Use Tailwind utility classes
- Follow the existing design patterns
- Ensure dark mode compatibility
- Test responsive layouts

### File Organization
- Place components in appropriate directories
- Keep files focused on a single responsibility
- Use clear, descriptive file names
- Export components consistently

---

## Pull Request Process

1. **Before submitting:**
   - Ensure all tests pass
   - Run type checking and linting
   - Update documentation if needed
   - Add comments for complex code

2. **Pull request description:**
   - Clearly describe what changes you made
   - Explain why the changes are needed
   - Reference any related issues
   - Include screenshots for UI changes

3. **Review process:**
   - Maintainers will review your PR
   - Address any requested changes
   - Be patient and respectful
   - Once approved, your PR will be merged

---

## Widget Development Guide

Adding a new widget is one of the most common contributions. Follow these steps:

1. **Define the widget type** in `src/types/index.ts`
2. **Create the widget component** in `src/components/widgets/`
3. **Register the widget** in `src/components/widgets/WidgetWrapper.tsx`
4. **Add to widget library** in `src/components/WidgetLibrary.tsx`
5. **Set default config** in `src/store/dashboardStore.ts`
6. **Test thoroughly** with different configurations

See the README for detailed widget development instructions.

---

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `feat: Add new weather widget`
- `fix: Resolve dark mode toggle issue`
- `docs: Update installation instructions`
- `refactor: Simplify state management logic`
- `style: Fix code formatting`
- `test: Add tests for crypto widget`
- `chore: Update dependencies`

---

## Issue Reporting

When reporting issues, please include:

- **Browser and OS:** Chrome 120 on macOS 14.0
- **Steps to reproduce:** Detailed steps to trigger the issue
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Screenshots:** If applicable
- **Console errors:** Any error messages from the browser console

---

## Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Review the README and documentation
- Open a new discussion on GitHub

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help create a welcoming community

---

Thank you for contributing to HomeForge!
