## Relevant Files

- `src/utils/hexGridUtils.ts` - Contains existing hex grid utilities; will need new A* pathfinding function added here
- `src/movement/MovementSystem.ts` - Contains current movement range calculation functions; needs to be updated to use pathfinding
- `src/character/Character.ts` - Contains character information used to identify blocked tiles
- `src/grid/HexGrid.ts` - Provides hex grid functionality and tile validation methods

### Notes

- No test framework is currently configured.
- The pathfinding algorithm should be implemented as a utility function since the project uses a utility-focused organization

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
    - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/movement-range-update`)
- [x] 1.0 Implement A* pathfinding algorithm for hex grids
  - [x] 1.1 Add new utility function `findPath()` to `src/utils/hexGridUtils.ts` that accepts start position, target position, and a Set<string> of blocked tile keys
  - [x] 1.2 Implement A* algorithm using existing `getNeighbors()` function from hexGridUtils.ts
  - [x] 1.3 Use `hexToKey()` to convert HexCoordinates to strings for the blocked tiles Set comparison
  - [x] 1.4 Calculate movement cost (each step costs 1 movement point) and return only paths that fit within the movement point budget
  - [x] 1.5 Add early termination if no path exists or if max iterations exceeded (e.g., 1000 iterations)
  - [x] 1.6 Return the path as an array of HexCoordinates or null if no valid path exists
- [x] 2.0 Update movement range calculation to use pathfinding
  - [x] 2.1 Create new function `getMovementRangeWithObstacles()` in `src/movement/MovementSystem.ts` that accepts origin, movement points, and blocked tiles
  - [x] 2.2 Implement BFS/flood-fill algorithm starting from origin, tracking movement points used
  - [x] 2.3 For each tile, use the blocked tiles Set to check if it's reachable without passing through obstacles
  - [x] 2.4 Only include tiles in the result if they can be reached within the movement point budget
  - [x] 2.5 Keep existing `getMovementRange()` function for backward compatibility in case it's used elsewhere
- [x] 3.0 Update valid movement tiles filtering
  - [x] 3.1 Modify `getValidMovementTiles()` to create a Set<string> of occupied tile positions using `hexToKey()`
  - [x] 3.2 Call new `getMovementRangeWithObstacles()` instead of `getMovementRange()` + `filterOccupiedTiles()` sequence
  - [x] 3.3 Ensure `filterOccupiedTiles()` and `filterGridBounds()` remain available as separate utilities
  - [x] 3.4 Verify that the origin character's current position is NOT included in the blocked tiles when calculating their movement range
- [ ] 4.0 Test the implementation
  - [ ] 4.1 Run the game and verify movement range displays correctly when no characters are blocking (should match current behavior)
  - [ ] 4.2 Place characters adjacent to each other and verify that the path behind the blocking character is not shown in movement range
  - [ ] 4.3 Create a scenario where a character is completely surrounded and verify no movement range is displayed
  - [ ] 4.4 Verify that characters can select and move to tiles that are reachable without passing through obstacles
  - [x] 4.5 Run `npm run lint` and fix any linting errors before proceeding
  - [x] 4.6 Run `npm run build` to ensure TypeScript compilation succeeds