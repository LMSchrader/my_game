# Agent Guidelines for my_game

## Project Overview
Turn-based tactical game with hex grid and cards, built with TypeScript, Vite, and Pixi.js.

## Essential Commands

### Development
- `npm run dev` - Start Vite development server
- `npm run build` - Run TypeScript check then build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint on all TypeScript files

### Quality Gates
After making changes, always run:
- `npm run lint` - Fix any linting errors before committing
- `npm run build` - Ensures TypeScript compilation succeeds (`tsc -b` runs before Vite build)

**Note**: No test framework is currently configured.

## Code Style Guidelines

### File Organization
- Place types in `types/` subdirectories within each module (e.g., `character/types/character.ts`)
- Organize by feature: `ai/`, `character/`, `grid/`, `scenes/`, `state/`, `turn/`, `utils/`, `interaction/`, `movement/`

### Imports
- Use type imports with `type` keyword: `import {type HexCoordinates} from '...'`
- Export types from parent index files: `export {Team} from './types/character.ts'`
- Import relative paths with `.ts` extension
- Group imports: third-party → local types → local implementations;

### Naming Conventions
- Classes: PascalCase (`CharacterEntity`, `HexGrid`, `GameState`)
- Interfaces and types: PascalCase (`HexCoordinates`, `PositionProvider`, `Character`)
- Methods and public properties: camelCase (`getCharacter`, `hexPosition`)
- Private properties with getters: underscore prefix (`_isSelected`, `_isActiveTurn`)
- Constants: UPPER_SNAKE_CASE (`HEX_SIZE`, `DEFAULT_MOVEMENT_POINTS`, `Colors`)
- Enums/const enums: Create `Values` const object then export type and alias (see Team pattern)

### Classes and Types
- Always add `readonly` to class properties that shouldn't change: `public readonly id: string`
- Use type annotations on all method parameters and return types
- Mark private methods explicitly with `private`
- Use optional chaining `?.` for callback invocation
- For singletons: private constructor with `instance ??= new()` pattern (see TurnManager)
- Use non-null assertion `!` for properties you know are initialized but TypeScript can't verify (e.g., Graphics objects created in constructor)
- Prefer static async factory methods for classes requiring async initialization (e.g., `CharacterEntity.create`)

### Configuration Patterns
- Use `as const` for configuration objects to enable type inference: `Colors = {...} as const`
- Place constants in `src/config/config.ts`
- Use `??` or fallback values for defaults: `config.hexPosition ?? {q: 0, r: 0}`

### Error Handling
- Log errors with the centralized logger: `logger.error('message:', error)`
- Use other log levels (warn, info, debug) were suitable
- Import logger from `src/utils/logger.ts`
- Use try-catch around async operations (e.g., sprite loading)

### Pixi.js Specific
- Documentation can be found at [documentation/llms.txt](documentation/llms.txt)
- Extend Pixi classes when appropriate (Container, Graphics, Sprite)
- Set `eventMode: 'static'` for interactive containers
- Use `addChild()`/`removeChild()` for adding sprites/graphics
- Clean up with `.destroy()` on graphics objects
- For buttons use [FancyButton](https://pixijs.io/ui/FancyButton.html)
- Use Pixi EventEmitter for custom events, not Node.js EventEmitter

### Type Safety
- Use `Map<string, T>` over objects for keyed collections
- Prefer explicit type imports over importing entire namespaces
- Use labeled tuple types when appropriate: `[number, number]`
- Use object key patterns with helper functions: `hexToKey({q, r}) -> '${q},${r}'`

### Helper Functions
- Create utility functions in `utils/` for repeated logic (e.g., `hexToPixel`, `pixelToHex`, `getHexDistance`)
- Keep utility functions pure where possible
- Export utility functions from module index files

### Formatting
- Indentation: 4 spaces
- Semi-colons: required (no trailing comma in last property)
- Max line length: unspecified but keep reasonable

## Pixi.js and logging are already configured; import from existing modules rather than adding new dependencies.