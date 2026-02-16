# PRD: HexGrid UI/Backend Separation

## Introduction/Overview

Currently, the `HexGrid` class combines data management with Pixi.js rendering logic in a single class that extends `Container`. This PR documents a refactoring initiative to split `HexGrid` into separate view (`HexGridView`) and model (`HexGridModel`) components. This separation will establish a data layer that can store tile data independently of rendering, enabling future map creation via JSON/TS data files and the eventual addition of tile attributes.

## Goals

1. Separate the `HexGrid` class into distinct data model (`HexGridModel`) and view (`HexGridView`) components
2. Establish a tile data structure that supports hex coordinates and can accommodate future attributes
3. Maintain all existing functionality with no behavioral changes visible to users
4. Prepare the data layer for future map configuration via data files (JSON/TS)
5. Create a clear separation of concerns between game data and rendering logic

## User Stories

- As a developer, I want to access hex grid data independently of rendering so that I can perform game logic calculations without loading graphical assets
- As a developer, I want to create grids programmatically from data configurations so that I can load different maps from data files
- As a developer, I want to separate UI and backend logic so that I can test game logic withoutPixi.js dependencies
- As a developer, I want to extend tile data with attributes in the future without modifying rendering code

## Functional Requirements

### Data Model (HexGridModel)

1. The system must provide a `HexGridModel` class that stores grid configuration (rows, cols) and tile data
2. The `HexGridModel` must store tile positions using hex coordinates (q, r)
3. The `HexGridModel` must provide a method to check if a hex coordinate is within grid bounds
4. The `HexGridModel` must provide a method to get tile data for a given hex coordinate
5. The `HexGridModel` must support iteration over all tiles in the grid
6. The `HexGridModel` must be independent of Pixi.js and rendering logic

### View Layer (HexGridView)

7. The system must provide a `HexGridView` class that extends Pixi.js `Container` for rendering
8. The `HexGridView` must accept a `HexGridModel` instance in its constructor
9. The `HexGridView` must render tiles based on the data model's tile positions
10. The `HexGridView` must handle pointer events and convert to hex coordinates using the model
11. The `HexGridView` must support highlighting tiles visually based on hex coordinates
12. The `HexGridView` must clear highlights and update rendering independently of data changes

### Integration

13. The `GameScene` must instantiate `HexGridModel` first, then pass it to `HexGridView`
14. The `InteractionHandler` and `MovementSystem` must continue to work with hex coordinates unchanged
15. All existing game features (character movement, AI, highlighting) must continue to function identically

### Data Configuration

16. The `HexGridModel` must support initialization from configuration objects (matching the existing `HexGridConfig` interface)
17. The system must maintain a data structure that can be serialized for future JSON/TS map files

## Non-Goals (Out of Scope)

- Creating a map editor UI
- Loading maps from external JSON/TS files in this iteration
- Implementing tile attributes (terrain type, movement cost, etc.)
- Modifying the hex coordinate system or grid layout
- Changing game mechanics related to movement or combat
- Performance optimization beyond the refactoring

## Design Considerations

### Class Structure

```
src/game/
  HexGridModel.ts (new) - Data/logic layer
  HexGridView.ts (new) - Pixi.js rendering layer
  HexGrid.ts (removed) - Old combined class

src/game/types/
  grid.ts (existing) - HexCoordinates, PixelCoordinates
  tile.ts (new) - Tile data interface (currently just coordinates)
```

### Tile Data Structure

```typescript
interface TileData {
  coordinates: HexCoordinates;
  // Future extensions: terrainType?: string; movementCost?: number; etc.
}
```

### Constructor Pattern

```typescript
// Usage in GameScene
const gridModel = new HexGridModel(DEFAULT_GRID_CONFIG);
const gridView = new HexGridView(gridModel);
this.grid = gridView; // Rename from grid to gridView for clarity
```

### Migration Strategy

- Keep existing imports pointing to `HexGrid.ts` temporarily
- Use `HexGrid.ts` as a facade that creates both model and view internally
- Gradually update callers to use `HexGridView` directly
- Remove facade in final cleanup

### Event Handling

The `HexGridView` will continue to:

- Listen for pointer events on the container
- Convert pixel coordinates to hex coordinates
- Delegate to the same `onClick` callback pattern

## Technical Considerations

### Dependencies

- `HexGridModel` must NOT import anything from Pixi.js
- `HexGridView` will import from Pixi.js (`Container`, `Graphics`, `FederatedPointerEvent`)
- Both classes will use existing utility functions from `hexGridUtils.ts`

### Breaking Changes

None - all public interfaces used by other components will maintain the same signatures. The `HexGridView` class will expose the same methods as the old `HexGrid` class.

### Testing

The separation enables future unit testing of `HexGridModel` without Pixi.js mocks, though test infrastructure setup is not part of this PRD.

### Existing Code Updates

The following files will need minimal updates:

- `src/scenes/GameScene.ts` - Update instantiation pattern
- `src/game/InteractionHandler.ts` - Update type reference from `HexGrid` to `HexGridView`
- Export `HexGridView` from `src/game/index.ts` or similar

## Success Metrics

1. All existing tests (if any) pass without modification
2. Manual testing via `npm run dev` shows identical behavior to current implementation
3. `HexGridModel` can be imported and used in a standalone TypeScript file without Pixi.js
4. Code review confirms no Pixi.js imports in `HexGridModel.ts`
5. `HexGridView` constructor accepts `HexGridModel` as a required parameter
6. All character movement, AI actions, and tile highlighting work as before
7. New structure allows easy addition of tile attributes by modifying `Interface TileData` or similar type

## Open Questions

1. Should `HexGridModel` expose an iterator/generator for efficient tile traversal?
2. Should tile data include a unique ID field for future referencing?
3. Is there a preference for storing tiles as a Map<key, data> vs an array for serialization?
4. Should `HexGridModel` include methods for grid operations (e.g., get neighbors) that are currently in `hexGridUtils.ts`?
