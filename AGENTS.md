# Agent Guide for my_game

## Build Commands

### Development
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all files

## Code Style Guidelines

### TypeScript Configuration
- Strict mode is enabled (`strict: true`)
- Target: ES2022, Module: ESNext
- All linting rules active: noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch
- verbatimModuleSyntax: Use explicit file extensions in imports (`.ts`, `.tsx`)
- JSX: `react-jsx` automatic runtime (no React imports needed for JSX)

### Import Style
- Use named imports for React hooks and utilities: `import { useState, useEffect } from 'react'`
- Asset imports use double quotes for relative paths: `import logo from './assets/logo.svg'`
- Node modules imports use single quotes for external dependencies
- Group imports: React imports → third-party → local modules → CSS files
- Always use explicit file extensions: `.ts` or `.tsx` (enforced by verbatimModuleSyntax)

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile`, `Button`)
- Component files: PascalCase for main component exports (e.g., `App.tsx`, `Header.tsx`)
- Utilities/hooks: camelCase (e.g., `useAuth`, `formatDate`)
- Variables/functions: camelCase (e.g., `userCount`, `handleSubmit`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `MAX_RETRIES`)
- Events: `on{Action}` (e.g., `onClick`, `onSubmit`, `handleChange`)
- Type definitions: PascalCase (e.g., `UserProps`, `ApiResponse`)

### React Patterns
- Functional components only (no class components)
- Use hooks for state and side effects
- Destructure props in component signature
- Use `const` for component declarations
- Export default from main component file

### Error Handling
- Always handle promise rejections with `.catch()` or try/catch
- Use TypeScript's error types for typed error handling
- Provide meaningful error messages for user-facing errors
- Log errors appropriately for debugging (consider adding logging library)

### Formatting & Linting
- Always run `npm run lint` before committing
- ESLint config includes: TypeScript ESLint, React Hooks, React Refresh
- Adhere to ESLint warnings/errors
- No semicolons in Component auto-generated templates (check existing codebase)
- 2-space indentation for JSX/TSX files
- Trailing commas in multi-line arrays/objects

### File Organization
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point
- `src/assets/` - Images, SVG files
- `src/*.css` - Global and component styles
- Place component files near their usage (co-location preferred)

### Code Quality
- Type all function parameters and return types explicitly
- Avoid `any` types - use `unknown` or proper type definitions
- Use interfaces for object shapes, type aliases for unions/primitives
- Prefer `const` over `let` when possible
- Use template literals for string interpolation
- Keep functions small and focused (single responsibility)

### Dependencies
- React 19.2.0, React DOM 19.2.0
- TypeScript 5.9.3
- Vite 7.2.4
- When adding new dependencies, use exact versions ( caret ^ is fine in deps.lock)