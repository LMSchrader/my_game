# Agent Guide for my_game

This guide provides essential information for agentic coding agents working in this repository.

## Build Commands

### Primary Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compiler and Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build

### TypeScript Check
- `npx tsc -b` - Run TypeScript compiler check only

### Linting
- `npm run lint` - ESLint check (recommended to run after changes)
- Note: Project does not currently have tests configured

## Code Style Guidelines

### Imports
- Always use `.ts` extension for local imports: `import { logger } from './utils/logger.ts'`
- No extension for external library imports: `import { Application } from 'pixi.js'`
- Use `import { type ... }` for type-only imports: `import { type HexCoordinates } from '../types/grid.ts'`
- Group imports: external packages first, then local imports

### Formatting
- No Prettier configured - follow TypeScript/ESLint conventions
- Use double quotes for strings
- Use semicolons at end of statements
- Indent with 2 spaces
- Trailing commas allowed in multi-line arrays/objects

### Types
- Explicit parameter types required: `(hex: HexCoordinates) => void`
- Explicit return types required on all functions: `: void`, `: PixelCoordinates`
- Use interface for object shapes: `export interface HexCoordinates`
- Use type alias for union types or complex types
- `const` variables should include type annotations for clarity

### Naming Conventions
- Classes: PascalCase (HexGrid, Graphics, Container)
- Functions/Methods: camelCase (hexToPixel, handleClick, center)
- Variables/Parameters: camelCase (q, r, hex, pixel)
- Constants: UPPER_SNAKE_CASE (HEX_SIZE, SQRT3, DEFAULT_CONFIG)
- Private class members: use `private` modifier with camelCase
- Type names: PascalCase (HexCoordinates, PixelCoordinates)

### Class Structure
- Use explicit access modifiers: `public`, `private`, `protected`
- Constructor at top after private fields
- Public methods before private methods
- Order: private fields, constructor, public methods, private methods

### Error Handling
- Use try/catch for async operations with proper Error typing
- Use optional chaining (`?.`) for null-safe method calls
- Import logger from `./utils/logger.ts` for logging errors
- Use `logger.error()`, `logger.debug()`, etc. for different log levels

### File Organization
- src/types/ - TypeScript interfaces and types
- src/utils/ - Utility functions and helpers
- src/grid/ - Grid-related classes and components
- src/main.ts - Application entry point

### TypeScript Config (tsconfig.app.json)
- Strict mode enabled - no implicit any
- Unused locals/parameters must be removed
- ES2022 target with ESNext modules
- Bundler module resolution

### ESLint Rules
- Follow @eslint/js and typescript-eslint recommended configs
- Target ES2022, browser globals enabled
- Ignore: dist directory

### Code Patterns
- Use nullish coalescing for fallback values: `import.meta.env.VITE_LOG_LEVEL ?? 'info'`
- Use array methods with callbacks for transformations
- Private helper methods should be grouped logically
- Constants defined at file level or class level before usage