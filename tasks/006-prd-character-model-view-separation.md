# PRD: Character Model-View Separation

## Introduction/Overview

Currently, `CharacterEntity` in `src/game/character/Character.ts` combines both the character's logical model (_state_) and its Pixi.js view (rendering). This coupling prevents characters from existing outside of the turn-based fight context and makes it impossible to load/save character state from a datasource. This PRD describes the refactoring to separate the model and view layers, enabling character persistence and future flexibility.

## Goals

- Separate character model (state/logic) from Pixi.js view (rendering/presentation)
- Enable loading character state from a local JSON datasource
- Maintain existing gameplay functionality during the refactor
- Establish a clear architecture for future character persistence and reuse across game modes

## User Stories

1. **As a game developer**, I want the character's core statistics and state to be stored separately from rendering logic, so that I can reuse character data across different game contexts (e.g., outside turn-based battles).

2. **As a game developer**, I want to load character definitions from a JSON file, so that I can configure characters without modifying code.

3. **As a game developer**, I want the separation to be clear and explicit, so that future developers can easily understand and extend the character system.

## Functional Requirements

### Model Layer

1. The system **must** create a new class `CharacterModel` that contains only state and game logic properties
2. `CharacterModel` **must** include the following properties:
   - `id: string`
   - `name: string`
   - `team: Team`
   - `speed: number`
   - `maxMovementPoints: number`
   - `movementPoints: number`
   - `hexPosition: HexCoordinates`
3. `CharacterModel` **must** include the following methods:
   - `setPosition(hexPosition: HexCoordinates): void`
   - `move(hexPosition: HexCoordinates): void`
   - `resetMovementPoints(): void`
   - `hasEnoughMovementPoints(points: number): boolean`
   - `setSelected(isSelected: boolean): void`
   - `isSelected(): boolean`
   - `setActiveTurn(isActive: boolean): void`
   - `isActiveTurn(): boolean`

### View Layer

4. The system **must** create a new class `CharacterView` that extends `Container` and handles all Pixi.js rendering
5. `CharacterView` **must** be initialized with a `CharacterModel` instance
6. `CharacterView` **must** observe changes in the `CharacterModel` and update its visual representation accordingly
7. `CharacterView` **must** be responsible for:
   - Creating and managing the sprite
   - Creating and managing selection highlight (Graphics)
   - Creating and managing team border (Graphics)
   - Creating and managing active turn glow (Graphics)
   - Updating sprite position based on model's hexPosition

### Datasource

8. The system **must** create a data loader utility that reads character definitions from a local JSON file (e.g., `characters.json`)
9. The JSON format **must** support core stats only: `id`, `name`, `team`, `speed`, `maxMovementPoints`
10. The data loader **must** return an array or map of `CharacterModel` instances

### Integration

11. All existing code that uses `CharacterEntity` **must** be updated to use the separated model/view pattern
12. The existing `CharacterEntity` class **must** be removed after refactoring

## Non-Goals (Out of Scope)

- Persisting runtime character state (e.g., after a battle completes)
- Saving character state back to the JSON file (read-only for now)
- Character stats beyond core properties (e.g., HP, attack power, abilities)
- Different cinematic or battle-specific visual states
- Multiple character views for a single model
- Network data loading (REST API, etc.)
- Browser storage (IndexedDB, LocalStorage)

## Design Considerations

- The model should be framework-agnostic and not depend on Pixi.js
- The view should depend on the model and subscribe to state changes
- Use TypeScript interfaces to enforce the contract between model and view
- Maintain the current file naming convention (e.g., `CharacterModel.ts`, `CharacterView.ts`)
- Keep the directory structure: `src/game/character/`

## Technical Considerations

- Breaking change: All imports of `CharacterEntity` must be updated throughout the codebase
- The `PositionProvider` interface needs to remain accessible for view positioning logic
- Default values (from `config.ts`) should still be applied when loading from JSON if values are missing
- The constructor pattern from `CharacterEntity` should be preserved where possible for consistency
- Consider using a simple observer pattern or direct method calls for model-to-view updates
- Ensure type safety with the existing `Character` interface

## Success Metrics

- [x] `CharacterModel` class created with all required properties and methods
- [x] `CharacterView` class created extending `Container` and responding to model changes
- [x] JSON datasource loader implemented and tested with sample data
- [x] All existing usages of `CharacterEntity` updated to use new pattern
- [x] `CharacterEntity` class removed from codebase
- [x] No TypeScript errors after refactoring
- [ ] Game functionality verified with `npm run dev` (manual testing)

## Open Questions

- Should `HexCoordinates` be part of the model or an external state managed elsewhere? (Currently in model based on existing implementation)
- Should the JSON file location be configurable or fixed to a specific path?
- Should there be a factory or builder class for creating model+view pairs together?
