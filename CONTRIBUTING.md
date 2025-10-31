# Contributing to SOYL Site

Thank you for your interest in contributing to the SOYL website! This document outlines our development process and standards.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/soyl-site.git`
3. Create a feature branch: `git checkout -b feat/your-feature-name`
4. Make your changes
5. Commit following our guidelines below
6. Push and open a Pull Request

## 📋 Branch Naming

We use the following prefixes for branches:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `style/` - Code style/formatting (no logic changes)
- `refactor/` - Code refactoring
- `test/` - Test additions/modifications
- `chore/` - Build/tooling changes

Examples:
- `feat/add-contact-form`
- `fix/mobile-nav-overlay`
- `docs/update-api-docs`

## 🔀 Pull Request Process

1. **Create a Draft PR** for work-in-progress changes
2. **Update PR description** with:
   - What changed and why
   - Screenshots/videos if UI changes
   - Checklist of completed items
   - Any breaking changes
3. **Request reviews** from:
   - `@ryan-gomez` (team lead)
   - `@frontend-dev` for frontend changes
4. **Mark as Ready** when all reviews are approved and CI passes

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
- [ ] No new warnings or errors
- [ ] Tests pass locally
- [ ] Accessibility checked (keyboard nav, screen readers)
- [ ] Mobile responsiveness verified

## 💻 Code Style

### TypeScript

- Use TypeScript for all new files
- Prefer `interface` for object shapes
- Use explicit return types for functions
- Enable strict mode checks

### React Components

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS utility classes
- Extract reusable patterns to components
- Follow mobile-first approach
- Respect `prefers-reduced-motion`

### File Structure

- One component per file
- Co-locate tests with components (`Component.test.tsx`)
- Use named exports for components

## 📝 Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tooling

Examples:
```
feat(hero): add parallax scroll effect

fix(nav): resolve mobile menu overlay issue

docs(readme): update installation instructions
```

## 🧪 Testing

- Write tests for new components and features
- Aim for >80% code coverage
- Run `npm test` before committing
- Use React Testing Library for component tests

## ♿ Accessibility

- Ensure keyboard navigation works
- Add ARIA labels where needed
- Test with screen readers
- Maintain WCAG AA contrast ratios
- Provide skip links for navigation

## 🎨 Design Guidelines

- Follow the design system tokens in `src/styles/tokens.css`
- Keep animations subtle and optional
- Maintain consistent spacing using Tailwind scale
- Use semantic HTML elements

## 📦 Dependencies

- Avoid adding new dependencies without discussion
- Prefer smaller, well-maintained packages
- Check bundle size impact
- Update dependencies regularly with `npm audit`

## 🤝 Code Review

- Be constructive and respectful
- Focus on code, not the person
- Suggest improvements clearly
- Approve when standards are met

## 📞 Questions?

If you have questions:
- Open a discussion in GitHub
- Email: hello@soyl.ai
- Tag maintainers in your PR

Thank you for contributing! 🎉

