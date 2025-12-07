# Contributing to CodeShare

Thank you for your interest in contributing to CodeShare! This document provides guidelines and instructions for contributing to the project.

## 🎯 Code of Conduct

- Be respectful and inclusive
- Welcome diverse perspectives
- Focus on constructive feedback
- Report issues professionally

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Click "Fork" button on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/codeshare.git
cd codeshare
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-description
```

### 3. Set Up Development Environment

#### Backend
```bash
cd Backend
npm install
cp .env.example .env
# Fill in your .env values
npm start
```

#### Frontend
```bash
cd Frontend
npm install
cp .env.example .env.local
# Update VITE_API_URL if needed
npm run dev
```

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Build process, dependencies

### Examples
```bash
git commit -m "feat(auth): add Google OAuth login"
git commit -m "fix(snippets): resolve like persistence issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(api): simplify error handling"
```

## 🔍 Code Style

### Frontend (React/TypeScript)
- Use functional components with hooks
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Component naming: PascalCase
- File naming: PascalCase for components, camelCase for utilities

```typescript
// ✅ Good
export function SnippetCard({ snippet }: Props) {
  const [liked, setLiked] = useState(false);
  
  return <div>...</div>;
}

// ❌ Bad
export const snippetCard = (props) => {
  let liked = false;
  return <div>...</div>;
};
```

### Backend (Node.js/Express)
- Use async/await
- Follow Express conventions
- Use meaningful variable names
- Add error handling
- File naming: camelCase

```javascript
// ✅ Good
export const createSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.create(req.body);
    res.json(snippet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Bad
export const createSnippet = (req, res) => {
  Snippet.create(req.body).then(s => res.json(s));
};
```

## 🧪 Testing

### Before Submitting PR
- [ ] Test locally in development
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Check console for errors
- [ ] Verify no console warnings

### Manual Testing Checklist
- [ ] Feature works as expected
- [ ] No breaking changes
- [ ] Error handling works
- [ ] UI is responsive
- [ ] Performance is acceptable

## 📋 Pull Request Process

### 1. Push Your Changes
```bash
git push origin feature/your-feature-name
```

### 2. Create Pull Request
- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Fill in PR template

### 3. PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Cross-browser tested

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

### 4. Code Review
- Maintainers will review your PR
- Address feedback and suggestions
- Update PR with changes
- Rebase if needed

### 5. Merge
- PR will be merged after approval
- Your contribution is now part of CodeShare! 🎉

## 🐛 Reporting Bugs

### Bug Report Template
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.0.0]

## Screenshots
[Add screenshots if applicable]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives
Other possible solutions

## Additional Context
Any other relevant information
```

## 📚 Documentation

### When to Update Docs
- New features
- API changes
- Configuration changes
- Bug fixes affecting users

### Documentation Files
- `README.md` - Main documentation
- `Backend/README.md` - Backend setup
- `Frontend/README.md` - Frontend setup
- `CONTRIBUTING.md` - This file
- Code comments - Complex logic

## 🔄 Workflow Example

### Feature: Add Dark Mode Toggle

```bash
# 1. Create branch
git checkout -b feature/dark-mode-toggle

# 2. Make changes
# - Update Header component
# - Add theme context
# - Update styles

# 3. Test locally
npm run dev
# Test in browser

# 4. Commit changes
git add .
git commit -m "feat(ui): add dark mode toggle to header"

# 5. Push to fork
git push origin feature/dark-mode-toggle

# 6. Create PR on GitHub
# - Fill in description
# - Link related issues
# - Add screenshots

# 7. Address feedback
git add .
git commit -m "fix: address dark mode toggle feedback"
git push origin feature/dark-mode-toggle

# 8. Merge (maintainer)
# PR merged to main
```

## 🎓 Learning Resources

### Frontend
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/)

### Backend
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Introduction](https://jwt.io/introduction)

## 🤝 Community

- **GitHub Issues** - Report bugs and request features
- **Discussions** - Ask questions and share ideas
- **Pull Requests** - Contribute code

## 📞 Getting Help

- Check existing issues and discussions
- Read documentation
- Ask in GitHub discussions
- Create a new issue with details

## ✅ Contribution Checklist

Before submitting your PR:
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
- [ ] Responsive design verified
- [ ] Cross-browser tested
- [ ] Commit messages are clear
- [ ] PR description is complete

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CodeShare! Your efforts help make this project better for everyone. 🚀
