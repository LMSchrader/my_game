# Character Movement System Implementation

## Overview
Implemented a character movement system with units, movement range calculation, and interactive tile selection for the Viking tactical combat game.

## New Files Created

### `src/services/unitFactory.ts`
Creates and manages game units with different classes:

**Unit Classes:**
- **Warrior:** High strength (10), medium armor (3), movement range 3
- **Archer:** Medium strength (7), low armor (1), movement range 2, higher willpower

**Functions:**
- `createUnit()` - Creates individual units with stats
- `createWarriors()` - Creates warrior units for a team
- `createArchers()` - Creates archer units for a team
- `createStartingUnits()` - Initializes 3 player units (2 warriors, 1 archer) and 3 enemy units

### `src/services/movement.ts`
Movement calculation and pathfinding:

**Functions:**
- `getMoveRangeTiles()` - BFS-based movement range calculation
  - Takes unit's base movement + willpower bonus
  - Avoids occupied tiles
  - Returns array of tile keys that can be moved to
  
- `canMoveToTile()` - Validates if a tile is a valid move target

- `moveUnit()` - Updates unit state after movement
  - Marks unit as moved
  - Optionally deducts willpower for extended movement

## Modified Files

### `src/types/grid.ts`
Updated `Unit` interface with complete stats:
- `id`, `name`, `team`
- `strength`, `armor`, `willpower`, `maxWillpower`, `breakPower`
- `baseMove`, `hasMoved`, `hasActed`, `isDead`

### `src/components/Grid/contexts/GridContext.tsx`
Extended context with unit management:
- Added `units: Map<string, Unit>` state
- Added `selectedUnit: Unit | null` state
- Added `setSelectedUnit()` function
- Added `addUnit()`, `moveUnit()`, `selectUnit()`, `showMovementRange()` functions

### `src/components/Grid/GridProvider.tsx`
Enhanced with unit initialization and management:

**State:**
- `units` - Map of all game units
- `selectedUnit` - Currently selected player unit

**Features:**
- `getUnitStartCoords()` - Routes units to starting positions:
  - Player units: (-2,2), (-1,3), (0,2)
  - Enemy units: (7,7), (6,6), (5,7)
- useEffect to place units on mount
- `addUnit()` - Adds unit to a specific tile
- `moveUnit()` - Moves unit between tiles and updates hasMoved status
- `selectUnit()` - Selects player unit and shows movement range
- `showMovementRange()` - Highlights valid movement tiles in green

### `src/components/Grid/Grid.tsx`
Updated to handle unit interaction:

**Features:**
- Click on player unit → Select and show movement range
- Click on move-target (green tile) → Move unit to that tile
- Click elsewhere → Deselect and reset
- Fades moved units (hasMoved = true)

## Unit Stats

### Player Units
- **Viking 1:** STR 10, ARM 3, WP 2, Movement 3
- **Viking 2:** STR 10, ARM 3, WP 2, Movement 3
- **Archer 1:** STR 7, ARM 1, WP 3, Movement 2

### Enemy Units (Orcs/Hunters)
- **Orc 1:** STR 10, ARM 3, WP 2, Movement 3
- **Orc 2:** STR 10, ARM 3, WP 2, Movement 3
- **Hunter 1:** STR 7, ARM 1, WP 3, Movement 2

## Visual Feedback

**Tile States:**
- `normal` - Default gray tile
- `move-target` - Green pulsing tile (valid movement location)
- `occupied` - Blue-gray tile with unit

**Unit Colors:**
- Player units: Green gradient with light border
- Enemy units: Red gradient with light border
- Unit stats displayed (STR, ARM)

## Movement Rules
1. Only player units can be selected and moved
2. Cannot select already moved units
3. Movement range = baseMove + floor(willpower / 2)
4. Cannot occupy tiles with other units
5. After moving, unit is marked hasMoved = true
6. Click on valid movement target (green tiles) to move

## How to Use
1. Run `npm run dev`
2. Click on a green player unit to select it
3. Green tiles will show valid movement range
4. Click on a green tile to move the unit there
5. Unit cannot move again after hasMoved = true

## Status
✅ Build passes (199.27 KB)
✅ Lint passes
✅ All features implemented and tested