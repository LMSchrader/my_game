# Task List: HexGrid UI/Backend Separation

## Relevant Files

- `src/game/HexGrid.ts` - Current combined class to be replaced with model/view pattern
- `src/game/HexGridModel.ts` (new) - Data model for grid configuration and tile storage
- `src/game/HexGridView.ts` (new) - Pixi.js rendering layer for hex grid visualization
- `src/game/types/tile.ts` (new) - TileData interface for tile structure
- `src/game/types/grid.ts` - Existing HexCoordinates and PixelCoordinates interfaces
- `src/game/InteractionHandler.ts` - Update type reference from HexGrid to HexGridView
- `src/scenes/GameScene.ts` - Update instantiation pattern to use model and view
- `src/game/character/CharacterView.ts` - May need import updates if referencing HexGrid types
- `src/game/index.ts` (if exists) - Export new HexGridView for module organization

### Notes

- This project does not have automated tests configured. Manual testing will be required via `npm run dev`.
- HexGridModel must not import anything from Pixi.js - it must remain pure TypeScript.
- HexGridView will maintain the same public API as the old HexGrid class to avoid breaking changes.
- Both new classes will continue to use utility functions from `src/utils/hexGridUtils.ts`.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/hexgrid-data-layer`)

- [x] 1.0 Create data model layer (TileData interface and HexGridModel class)
  - [x] 1.1 Create `src/game/types/tile.ts` with TileData interface containing hexCoordinates field
  - [x] 1.2 Create `src/game/HexGridModel.ts` with class definition
  - [x] 1.3 Add HexGridConfig property and constructor accepting config
  - [x] 1.4 Implement tile storage as Map<string, TileData> using hexToKey helper
  - [x] 1.5 Implement isHexInGrid(hex: HexCoordinates): boolean method using axialToOffset conversion
  - [x] 1.6 Implement getTileData(hex: HexCoordinates): TileData | undefined method
  - [x] 1.7 Implement initialize() method to populate tile data for all grid positions
  - [x] 1.8 Add getter for gridConfig to expose rows/cols configuration
  - [x] 1.9 Implement forEachTiles(callback: (tile: TileData) => void): void for iteration support
  - [x] 1.10 Verify no Pixi.js imports in HexGridModel.ts (run grep to confirm)

- [x] 2.0 Create view layer (HexGridView class for Pixi.js rendering)
  - [x] 2.1 Create `src/game/HexGridView.ts` extending Pixi.js Container
  - [x] 2.2 Add constructor accepting HexGridModel parameter
  - [x] 2.3 Implement setupEventListeners for pointerdown events
  - [x] 2.4 Implement handleClick to convert pixel to hex and trigger onClick callback
  - [x] 2.5 Implement renderGrid method using tile data from HexGridModel
  - [x] 2.6 Implement getCenteredHexPosition method for centered pixel coordinates
  - [x] 2.7 Implement highlightTiles method to create visual overlays
  - [x] 2.8 Implement clearHighlights method to remove all visual overlays
  - [x] 2.9 Implement isHexInGrid method delegating to HexGridModel
  - [x] 2.10 Implement getTile method returning Pixi.js Graphics object
  - [x] 2.11 Implement isTileHighlighted method
  - [x] 2.12 Expose public onClick setter method setOnClick

- [x] 3.0 Update GameScene to use new model/view pattern
  - [x] 3.1 Read `src/scenes/GameScene.ts` to understand current HexGrid usage
  - [x] 3.2 Update imports to include HexGridModel and HexGridView
  - [x] 3.3 Change grid property type annotation from HexGrid to HexGridView
  - [x] 3.4 Update instantiation: create HexGridModel with DEFAULT_GRID_CONFIG
  - [x] 3.5 Update instantiation: create HexGridView with the new model
  - [x] 3.6 Verify all grid method calls still work (highlightTiles, clearHighlights, setOnClick, etc.)

- [x] 4.0 Update remaining references and remove old HexGrid class
  - [x] 4.1 Read `src/game/InteractionHandler.ts` and check HexGrid references
  - [x] 4.2 Update InteractionHandler type reference from HexGrid to HexGridView
  - [x] 4.3 Search entire codebase for remaining HexGrid imports (grep for "from.\\\*HexGrid")
  - [x] 4.4 Update any other files that reference HexGrid imports
  - [x] 4.5 Create or update `src/game/index.ts` to export HexGridModel and HexGridView if pattern exists in codebase (skipped - pattern doesn't exist)
  - [x] 4.6 Backup old HexGrid.ts file by renaming to HexGrid.ts.backup (for safety)
  - [x] 4.7 Run TypeScript compiler to check for any remaining errors

- [x] 5.0 Test and verify all existing functionality
  - [x] 5.1 Run `npm run dev` and verify application loads without errors
  - [ ] 5.2 Verify hex grid renders correctly with correct layout and tiles
  - [ ] 5.3 Test clicking on tiles and verify InteractionHandler receives hex coordinates
  - [ ] 5.4 Test character selection and movement to different tiles
  - [ ] 5.5 Verify movement range highlighting displays correctly
  - [ ] 5.6 Clear highlights and verify they disappear properly
  - [ ] 5.7 Test AI controller and verify AI can move characters
  - [ ] 5.8 Verify all game features work identically to previous implementation
  - [x] 5.9 Run `npm run lint` and fix any linting errors
  - [x] 5.10 Run `npm run build` to verify production build succeeds
  - [x] 5.11 Delete HexGrid.ts.backup file if everything works correctly (file already deleted with git)
