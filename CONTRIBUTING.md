# Contributing to HomeForge

Thank you for considering contributing to HomeForge! 🎉

This document provides guidelines and instructions for contributing to the project.

---

## 🌟 Ways to Contribute

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

## 🚀 Getting Started

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

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ryanmaynard/HomeForge.git
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for object shapes
- Export types from `src/types/index.ts`

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use descriptive component names

```typescript
// ✅ Good
interface WeatherWidgetProps {
  widgetId: string;
  config: WeatherConfig;
}

const WeatherWidget = ({ widgetId, config }: WeatherWidgetProps) => {
  // Component logic
};

// ❌ Bad
const WeatherWidget = (props: any) => {
  // Component logic
};
```

### Styling
- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Ensure dark mode compatibility
- Keep responsive design in mind

```tsx
// ✅ Good
<div className="p-6 bg-white dark:bg-slate-800 rounded-lg">
  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
    Title
  </h2>
</div>

// ❌ Bad
<div style={{ padding: '24px', backgroundColor: 'white' }}>
  <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Title</h2>
</div>
```

### File Organization
- Keep related code together
- Use index files for cleaner imports
- Follow the existing folder structure

```
src/
├── components/
│   └── widgets/
│       ├── YourWidget.tsx      # Widget component
│       └── WidgetWrapper.tsx   # Widget wrapper (update)
├── services/
│   └── yourAPI.ts              # API service if needed
└── types/
    └── index.ts                # Type definitions (update)
```

---

## 🧪 Testing

Before submitting a PR:

1. **Test locally**
   ```bash
   npm run dev
   ```

2. **Check types**
   ```bash
   npm run type-check
   ```

3. **Lint code**
   ```bash
   npm run lint
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

5. **Test in different browsers**
   - Chrome/Edge
   - Firefox
   - Safari (if possible)

6. **Test dark mode**
   - Toggle theme and verify all components look good

7. **Test responsive design**
   - Desktop (1920px, 1440px, 1024px)
   - Tablet (768px)
   - Mobile (375px, 320px)

---

## 📋 Pull Request Process

### 1. Prepare Your PR

- **Keep it focused:** One PR = One feature/fix
- **Update documentation:** If you changed functionality
- **Add yourself to contributors:** Update README if needed

### 2. Commit Guidelines

Use conventional commits for clear history:

```bash
# Features
git commit -m "feat: add calendar widget"
git commit -m "feat(crypto): add more cryptocurrencies"

# Bug fixes
git commit -m "fix: resolve dark mode color issue"
git commit -m "fix(weather): handle API timeout errors"

# Documentation
git commit -m "docs: update widget creation guide"

# Style/formatting
git commit -m "style: format code with prettier"

# Refactoring
git commit -m "refactor: extract common widget logic"

# Performance
git commit -m "perf: optimize RSS feed parsing"
```

### 3. Create the Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open a PR on GitHub**
   - Use a descriptive title
   - Fill out the PR template
   - Link related issues
   - Add screenshots/videos if UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Tested locally
   - [ ] Types check pass
   - [ ] Build succeeds
   - [ ] Works in dark mode
   - [ ] Responsive design verified

   ## Screenshots
   (If applicable)

   ## Related Issues
   Closes #123
   ```

### 4. Code Review

- Be responsive to feedback
- Make requested changes promptly
- Ask questions if unclear
- Be patient and respectful

---

## 🎨 Adding a New Widget

See the detailed guide in the [README.md](README.md#-adding-a-new-widget).

Quick checklist:
- [ ] Add widget type to `src/types/index.ts`
- [ ] Create widget component in `src/components/widgets/`
- [ ] Register in `WidgetWrapper.tsx`
- [ ] Add to `WidgetLibrary.tsx`
- [ ] Update default config in `dashboardStore.ts`
- [ ] Test thoroughly
- [ ] Update documentation

---

## 🐛 Debugging Tips

### Common Issues

1. **Type errors**
   - Run `npm run type-check` to see all type errors
   - Make sure all types are properly imported

2. **Build fails**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for missing dependencies

3. **Widget not showing**
   - Verify it's registered in `WidgetWrapper.tsx`
   - Check console for errors
   - Ensure config type matches

4. **Layout issues**
   - Check react-grid-layout props
   - Verify widget has proper min/max sizes
   - Test with different screen sizes

### Development Tools

- **React DevTools** — Inspect component tree
- **Redux DevTools** — Debug Zustand store
- **Network Tab** — Monitor API calls
- **Lighthouse** — Performance audit

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)

---

## ❓ Questions?

- Check [GitHub Discussions](https://github.com/ryanmaynard/HomeForge/discussions)
- Read the [README](README.md)
- Open an issue with the `question` label

---

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Part of the HomeForge community

Thank you for helping make HomeForge better! 🙏

---

<div align="center">

**Happy coding!** 🚀

</div>
