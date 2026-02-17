# AGENTS.md

You are a senior developer specialized in game development with TypeScript and Pixi.js.

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
- AssetPack for asset processing
- Pino for logging
- ESLint with TypeScript rules
- Prettier for code formatting

## Architecture

Follow the Model–view–controller and Observer pattern. Project structure:

```
src/
  config/config.ts     # Default colors, fontsize, text, sprites
  game/                # Backend logic
    types/
  scenes/              # Scenes tying frontend and backend
    types/
  ui/                  # UI components (game/, utils/)
  utils/               # Utilities
```

Entry point for the backend logic is [Game](/src/game/Game.ts). 
Model classes that notify observer should extend EventEmitter, see [CharacterModel](/src/game/CharacterModel.ts).
Listeners should be implemented in the UI component, see [TurnOrderDisplay](/src/ui/game/TurnOrderDisplay.ts)

## Coding Standards

You always apply KISS, DRY and SOLID in your implementations.

## Code Style Guidelines

### Type System

- **Strict mode**: All TypeScript strict checks enabled including `noUnusedLocals` and `noUnusedParameters`
- **Type imports**: Use `import type { X }` for type-only imports (verbatimModuleSyntax required)
- **Interface vs Type**: Use `interface` for object shapes, `type` for unions/primitives
- **Const assertions**: Use `as const` for constant objects that should be immutable at compile time
- **Explicit types**: Always include return types on public methods
- **Imports**: Include `.ts` extension in all imports. Third-party imports first, then internal. Group related imports together.

```typescript
import { ExternalLib } from "external-lib";
import { InternalClass } from "../internal/Class.ts";
import type { InternalType } from "../internal/types.ts";
```

### Naming Conventions

- **Classes, Interfaces, types**: PascalCase (`GameScene`, `Character`, `HexCoordinates`)
- **Functions/Methods**: camelCase (`getCenteredHexPosition`, `handleClick`)
- **Constants**: UPPER_SNAKE_CASE (`HEX_SIZE`, `DEFAULT_MOVEMENT_POINTS`)
- **Files containing exactly one class**: PascalCase
- **All other files (types files and utils)**: camelCase

### Class Design

- Use `readonly` for properties that should be set once
- Use `private` for internal implementation details
- Constructors accept a single config object for complex initialization
- Prefer dependency injection via constructor parameters

### Type Pattern

Store type definitions alongside implementation files in `types/` directories:

```
src/
  game/
    types/
      character.ts
    CharacterModel.ts
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
- Type annotations on declarations

```typescript
const character: Character | undefined = this.characters.get(id);
const { x, y } = pixelPosition;
```

### Pixi.js Specific Notes

- Graphics items need event mode set: `graphics.eventMode = "static"`
- Use pixi-pipes for asset processing
- Assets loaded via bundles managed in `src/utils/assets.ts`

### CSS

- Import CSS files in TypeScript: `import "./index.css"`

## Documentation

Pixi.js documentation available at [documentation/llms.txt](documentation/llms.txt)

Refer to this file for comprehensive Pixi.js API reference and guides.
