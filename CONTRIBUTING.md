# Contributing to LearnFlow AI

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/learnflow-ai.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -m "Add: your feature description"`
7. Push: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

Quick start:
```bash
npm install
cd functions && npm install && cd ..
cp .env.example .env  # Add your Firebase config
npm run dev
```

## Code Style

### JavaScript/React
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns

### Tailwind CSS
- Use utility classes
- Follow the design system in `tailwind.config.js`
- Keep custom CSS minimal

### File Naming
- Components: PascalCase (e.g., `PlanCard.jsx`)
- Services: camelCase (e.g., `planService.js`)
- Pages: PascalCase with "Page" suffix (e.g., `DashboardPage.jsx`)

## Project Structure

```
src/
├── components/
│   ├── common/      # Reusable UI components
│   ├── auth/        # Authentication components
│   ├── plans/       # Plan-related components
│   └── ai/          # AI assistant components
├── contexts/        # React contexts
├── services/        # Firebase & API services
├── pages/           # Page components
└── utils/           # Helper functions
```

## Feature Requests

We welcome feature requests! Please:
1. Check existing issues first
2. Describe the feature clearly
3. Explain the use case
4. Consider implementation complexity

### Priority Features
- Dark mode
- Calendar integration
- Export to PDF
- Mobile app
- Collaborative plans

## Bug Reports

When reporting bugs, include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information
- Console errors

## Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style
- [ ] All tests pass
- [ ] No console errors
- [ ] Tested in Chrome and Firefox
- [ ] Updated documentation if needed

### PR Description
- Describe what changed
- Link related issues
- Add screenshots for UI changes
- List breaking changes

## Testing

Currently manual testing. Future: Jest + React Testing Library.

Test checklist:
- [ ] Authentication flow
- [ ] Plan creation
- [ ] Task tracking
- [ ] AI assistant
- [ ] Mobile responsive

## Documentation

Update documentation when:
- Adding new features
- Changing APIs
- Modifying setup process
- Adding dependencies

## Community Guidelines

- Be respectful and inclusive
- Help others learn
- Share knowledge
- Give constructive feedback
- Celebrate contributions

## Questions?

- Open a GitHub issue
- Check existing documentation
- Review closed issues

Thank you for contributing! 🎉
