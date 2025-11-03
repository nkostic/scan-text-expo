# Contributing to OCR Text Scanner

First off, thank you for considering contributing to OCR Text Scanner! 🎉 It's people like you that make this project such a great tool for the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Template for Bug Reports:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Tap on '...'
3. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- Device: [e.g. iPhone 15 Pro, Pixel 8]
- OS: [e.g. iOS 17.2, Android 14]
- App Version: [e.g. 1.0.0]
- Expo Go Version: [e.g. 2.30.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Features

Feature suggestions are welcome! Before creating a feature request:

1. Check if the feature has already been suggested
2. Provide a clear use case for the feature
3. Explain how it benefits the majority of users

**Template for Feature Requests:**

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples from other apps.
```

### Your First Code Contribution

Unsure where to start? Look for issues labeled:

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements or additions to documentation

**Steps to contribute:**

1. **Fork the repository**
2. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly** on iOS, Android, and Web
5. **Commit your changes** (see commit guidelines below)
6. **Push to your fork**
7. **Open a Pull Request**

### Pull Requests

**Before submitting a PR:**

- [ ] Code follows the project's coding guidelines
- [ ] All tests pass (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Screenshots/videos included (for UI changes)
- [ ] PR description clearly describes the changes
- [ ] Linked to related issue (if applicable)

**PR Title Format:**
```
feat: add offline OCR support
fix: resolve camera permission crash on Android
docs: update installation instructions
refactor: simplify image processing logic
```

**PR Description Template:**

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issue
Closes #123

## Testing
How has this been tested?
- [ ] iOS
- [ ] Android
- [ ] Web
- [ ] Expo Go
- [ ] Standalone build

## Screenshots (if applicable)
Add screenshots or videos demonstrating the change.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested on multiple platforms
```

## Development Setup

### Prerequisites

- **Node.js**: 18.x or higher
- **pnpm**: Latest version
- **Expo CLI**: Installed globally (`npm install -g expo-cli`)
- **iOS**: Xcode (macOS only) + iOS Simulator
- **Android**: Android Studio + Android Emulator

### Setup Steps

1. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/scan-check-expo.git
   cd scan-check-expo
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm start
   ```

4. **Run on platforms**
   ```bash
   # iOS Simulator
   pnpm ios

   # Android Emulator
   pnpm android

   # Web Browser
   pnpm web
   ```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Optional: Your own OCR API key
OCR_API_KEY=your_ocr_space_api_key_here

# Optional: Enable debug logging
DEBUG=true
```

### Project Structure

```
scan-check-expo/
├── app/                   # Main app screens (Expo Router)
│   ├── index.tsx         # Home/Scanner screen
│   ├── camera.tsx        # Camera with guide overlay
│   └── _layout.tsx       # Navigation layout
├── components/           # Reusable React components
├── constants/            # Constants (colors, config, etc.)
├── hooks/                # Custom React hooks
├── assets/               # Images, fonts, icons
├── .gitignore           # Git ignore rules
├── app.json             # Expo configuration
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Documentation
```

### Testing Your Changes

**Manual Testing Checklist:**

- [ ] App builds without errors
- [ ] Camera opens correctly on iOS/Android
- [ ] Photo capture works
- [ ] OCR extraction succeeds with clear text
- [ ] Extracted text displays correctly
- [ ] Copy to clipboard works
- [ ] Photo is deleted after processing
- [ ] App handles permissions properly
- [ ] Error states display correctly
- [ ] UI looks good on different screen sizes

**Platforms to Test:**

1. **iOS** (if on macOS)
   - iPhone SE (small screen)
   - iPhone 14 Pro (standard)
   - iPad (tablet)

2. **Android**
   - Small phone (Pixel 5)
   - Large phone (Pixel 8 Pro)
   - Tablet

3. **Web** (browser testing)
   - Chrome
   - Safari
   - Firefox

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable/function names

**Example:**

```typescript
// Good
interface OcrResult {
  text: string;
  confidence: number;
  processingTime: number;
}

const processImage = async (uri: string): Promise<OcrResult> => {
  // implementation
};

// Bad
const processImage = async (uri: any): Promise<any> => {
  // implementation
};
```

### React Native

- Use functional components with hooks
- Avoid inline styles (use StyleSheet)
- Use memo/useCallback for performance optimization
- Handle platform differences with Platform.OS

**Example:**

```typescript
// Good
import { StyleSheet, Platform } from 'react-native';

const MyComponent = React.memo(() => {
  const handlePress = useCallback(() => {
    // handler
  }, []);

  return <TouchableOpacity style={styles.button} onPress={handlePress} />;
});

const styles = StyleSheet.create({
  button: {
    padding: Platform.OS === 'ios' ? 12 : 10,
  },
});

// Bad
const MyComponent = () => (
  <TouchableOpacity
    style={{ padding: 12 }}
    onPress={() => console.log('pressed')}
  />
);
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line length**: Max 100 characters (soft limit)
- **Naming**:
  - Components: PascalCase (`CameraScreen`)
  - Functions/variables: camelCase (`handleScan`)
  - Constants: UPPER_SNAKE_CASE (`API_KEY`)
  - Files: kebab-case (`camera-screen.tsx`) or camelCase (`cameraScreen.tsx`)

### File Organization

```typescript
// 1. React/React Native imports
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 2. Third-party libraries
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

// 3. Local imports (absolute paths via tsconfig)
import { Button } from '@/components/Button';
import { useCamera } from '@/hooks/useCamera';

// 4. Types/interfaces
interface Props {
  onComplete: (text: string) => void;
}

// 5. Component
export default function Scanner({ onComplete }: Props) {
  // hooks
  // handlers
  // render
}

// 6. Styles
const styles = StyleSheet.create({
  // styles
});
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, config)
- `ci`: CI/CD changes

### Examples

```bash
feat(camera): add square guide overlay
fix(ocr): resolve timeout error on large images
docs(readme): update installation instructions
refactor(scanner): simplify image processing logic
perf(ocr): reduce API call latency by 30%
```

### Scope (optional but recommended)

Common scopes:
- `camera`
- `ocr`
- `ui`
- `scanner`
- `clipboard`
- `permissions`

## Release Process

Maintainers will handle releases. Contributors don't need to worry about versioning.

**For maintainers:**

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create git tag: `git tag v1.2.0`
4. Push tag: `git push origin v1.2.0`
5. GitHub Actions will create release

## Community

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Use GitHub Issues for bugs and feature requests
- **Pull Requests**: Use PRs for code contributions

### Getting Help

If you need help:

1. Check existing [Issues](https://github.com/yourusername/scan-check-expo/issues)
2. Read the [README](README.md)
3. Ask in [Discussions](https://github.com/yourusername/scan-check-expo/discussions)
4. Reach out to maintainers

### Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- README acknowledgments section (optional)

---

## Thank You! 🙏

Your contributions, no matter how small, make a difference. Whether it's:
- Fixing a typo
- Reporting a bug
- Suggesting a feature
- Submitting code

We appreciate your time and effort! ❤️

---

**Questions?** Feel free to reach out by opening an issue or discussion.

**Happy coding!** 🚀
