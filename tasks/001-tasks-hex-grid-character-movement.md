## Relevant Files

- `src/main.ts` - Pixi.js application initialization and setup
- `src/index.css` - Global CSS for canvas and viewport styling
- `src/utils/hexGridUtils.ts` - Hex coordinate utilities (axial coordinates, distance calculations, neighbor lookups)
- `src/utils/hexGridUtils.test.ts` - Unit tests for hex grid utilities
- `src/types/character.ts` - Character interface and type definitions
- `src/types/grid.ts` - Hex grid and tile type definitions
- `src/character/Character.ts` - Character class with position tracking, MP management, and rendering logic
- `src/character/Character.test.ts` - Unit tests for character class
- `src/grid/HexGrid.ts` - Hex grid container with tile rendering and click detection
- `src/grid/HexGrid.test.ts` - Unit tests for hex grid component
- `src/state/GameState.ts` - State management for characters and selection
- `src/state/GameState.test.ts` - Unit tests for game state management
- `src/movement/movementSystem.ts` - Movement range calculation and highlighting logic
- `src/movement/MovementSystem.test.ts` - Unit tests for movement system
- `src/interaction/InteractionHandler.ts` - Click handling, character selection, and movement execution
- `src/interaction/InteractionHandler.test.ts` - Unit tests for interaction handler

### Notes  

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 1.0 Set Up Pixi.js Core and Application Structure
  - [x] 1.1 Install and configure Pixi.js as a project dependency
  - [x] 1.2 Create basic Pixi.js application initialization in src/main.ts
  - [x] 1.3 Set up TypeScript types for Pixi.js entities and game state
  - [x] 1.4 Configure CSS to ensure canvas fills the viewport properly
- [x] 2.0 Implement Hex Grid Rendering System
  - [x] 2.1 Define hex tile data structure and coordinate utilities (axial coordinates)
  - [x] 2.2 Implement hex-to-pixel conversion functions for positioning
  - [x] 2.3 Create hex tile container and rendering logic
  - [x] 2.4 Add mouse click detection to identify clicked hex tiles
  - [x] 2.5 Style hex tiles with high-contrast colors
  - [x] 2.6 Display a hex grid in the UI
- [x] 3.0 Implement Character Entity System
  - [x] 3.1 Define Character interface with position, movement points, and visual properties
  - [x] 3.2 Implement character initialization with default MP and starting positions
  - [x] 3.3 Create character rendering logic to display distinct characters on the grid
  - [x] 3.4 Add visual indicators for different characters (colors/icons)
- [x] 4.0 Implement Movement Range Calculation and Highlighting
  - [x] 4.1 Implement hex distance calculation (adjacent tile adjacency)
  - [x] 4.2 Create movement range calculation function based on remaining MP
  - [x] 4.3 Implement tile highlighting system for valid movement destinations
  - [x] 4.4 Add collision detection to prevent movement to occupied tiles
  - [x] 4.5 Style movement highlights with semi-transparent overlay
- [x] 5.0 Implement Interaction Handling and State Management
  - [x] 5.1 Create global game state manager to track characters and selection
  - [x] 5.2 Implement character selection logic on click
  - [x] 5.3 Add character deselection logic when clicking elsewhere
  - [x] 5.4 Implement movement execution when clicking on highlighted tiles
  - [x] 5.5 Update character position and decrease MP after movement
  - [x] 5.6 Add visual indication for selected character (outline/glow)