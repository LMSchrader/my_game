# AGENTS.md

This file contains guidelines for agentic coding assistants working on this repository.

## Project Overview

Turn-based tactical game with hex grid and cards, built with TypeScript, Vite, and Pixi.js.

## Build / Lint / Test Commands

```bash
npm run dev       # Start development server (Vite)
npm run build     # Build for production: tsc -b && vite build
npm run lint      # Run ESLint on the repository
npm run format    # Format code with Prettier
npm run preview   # Preview production build
```

Note: This project does not have automated tests configured. Manual testing required via `npm run dev`.

## Tech Stack

- TypeScript 5.9 with strict mode enabled
- Vite 7 for bundling
- Pixi.js 8 for 2D graphics rendering
- Pixi UI for UI components
- Pino for logging
- ESLint with TypeScript rules
- Prettier for code formatting

## Code Style Guidelines

### Type System

- **Strict mode**: All TypeScript strict checks enabled including `noUnusedLocals` and `noUnusedParameters`
- **Type imports**: Use `import type { X }` for type-only imports (verbatimModuleSyntax required)
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/primitives
- **Const assertions**: Use `as const` for constant objects that should be immutable at compile time
- **Explicit types**: Always include return types on public methods

### Imports

- Include `.ts` extension in all imports: `import { Foo } from "./bar.ts"`
- Third-party imports first, then internal imports
- Group related imports together

```typescript
import { ExternalLib } from "external-lib";
import { InternalClass } from "../internal/Class.ts";
import type { InternalType } from "../internal/types.ts";
```

### Naming Conventions

- **Classes**: PascalCase (`GameScene`, `CharacterEntity`)
- **Interfaces**: PascalCase, descriptive (`Character`, `HexGridConfig`)
- **Functions/Methods**: camelCase (`getCenteredHexPosition`, `handleClick`)
- **Private methods**: camelCase with private access modifier
- **Constants**: UPPER_SNAKE_CASE (`HEX_SIZE`, `DEFAULT_MOVEMENT_POINTS`)
- **Type types**: PascalCase (`HexCoordinates`, `PixelCoordinates`)

### Class Design

- Use `public readonly` for properties that should be set once
- Use `private` for internal implementation details
- Constructors accept a single config object for complex initialization
- Prefer dependency injection via constructor parameters
- Organize classes by feature module (character/, game/, ui/, utils/)

### Type Pattern

Store type definitions alongside implementation files in `types/` directories:

```
src/
  character/
    types/
      character.ts
    Character.ts
```

Use const assertion pattern for enums:

```typescript
export const TeamValues = {
  TeamA: "TeamA",
  TeamB: "TeamB",
} as const;

export type Team = (typeof TeamValues)[keyof typeof TeamValues];
export const Team = TeamValues;
```

### Error Handling

- Log errors with context using the logger service
- Use try/catch around async operations
- Return early when optional values are undefined

```typescript
if (this.selectedCharacterId === undefined) {
  return undefined;
}
```

### Logging

Use the `pino` logger from `src/utils/logger.ts`:

```typescript
import { logger } from "../utils/logger.ts";
logger.debug({ data }, "Context message");
logger.warn("Warning message");
logger.error(error, "Error message");
```

### Variable Declaration

- Use `const` by default, `let` only when reassignment needed
- Destructure objects for properties used multiple times
- Type annotations on declarations

```typescript
const character: Character | undefined = this.characters.get(id);
const { x, y } = pixelPosition;
```

### Pixi.js Specific Notes

- Documentation can be found at [documentation/llms.txt](documentation/llms.txt)
- Graphics items need event mode set: `graphics.eventMode = "static"`
- Use pixi-pipes for asset processing
- Assets loaded via bundles managed in `src/utils/assets.ts`

### CSS

- Import CSS files in TypeScript: `import "./index.css"`

