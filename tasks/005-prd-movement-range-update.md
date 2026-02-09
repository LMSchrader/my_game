# Movement Range Calculation Update

## Introduction/Overview

The current movement system allows characters to move to any tile within their movement range, without considering whether other characters block the path. This results in unrealistic behavior where characters can effectively "pass through" each other. This feature updates the movement range calculation to ensure characters can only move to tiles that are reachable without passing through other characters.

## Goals

- Calculate movement range using pathfinding algorithms (e.g., A*) that account for obstacles
- Ensure movement range only includes tiles that can be reached without passing through other characters
- Maintain all existing movement functionality except for range calculation
- Provide clear visual indication when a character has no valid moves

## User Stories

- As a player, when I select a character, I want to see only tiles that are actually reachable without passing through other characters
- As a player, when a character is completely surrounded by other characters, I want no movement range to be displayed

## Functional Requirements

1. The system must calculate movement range using pathfinding (e.g., A* algorithm) instead of simple distance-based calculations
2. The system must consider other characters as obstacles when calculating reachable tiles
3. The system must only include tiles in the movement range if a valid path exists that does not pass through another character
4. The movement range calculation must respect the character's available movement points
5. When a character has no valid reachable tiles, the system must not display any movement range/highlighting
6. The system must only consider other characters as blocking objects (not terrain or environmental features)
7. Pathfinding must respect hex grid adjacency rules (6 neighbors per tile)
8. The pathfinding algorithm must terminate within reasonable time limits for performance

## Non-Goals (Out of Scope)

- Path visualization (showing the route to destination)
- Movement animation (character moving step-by-step)
- Terrain-based movement blocking (impassable tiles)
- Changes to how the character actually moves/executes the movement
- Movement cost variation based on terrain type
- Visual indicators for why a tile is not reachable
- Undoing or previewing movement
- Movement history logging

## Design Considerations

- Movement range visualization should continue to use existing highlight/mechanic patterns
- The movement range display should be distinct from other range indicators (e.g., attack range)

## Technical Considerations

- Should integrate with existing hex grid system in `src/grid/`
- Should utilize existing movement points system from character module
- Pathfinding algorithm should be optimized for hex grid performance
- Consider implementing as a utility function in `src/utils/` or as part of the grid system
- Ensure pathfinding does not block the UI/main thread
- May need to cache pathfinding results if performance is an issue with larger grids

## Success Metrics

- Characters can no longer select tiles that require passing through other characters to reach
- Movement range is correctly calculated when characters are adjacent or nearby
- Characters completely surrounded show no movement range
- No performance regressions when calculating movement range
- Movement system continues to work with all existing game mechanics

## Open Questions

- Should movement range recalculate when characters move during the same turn?
- Is there a maximum map size where pathfinding becomes a performance concern?
- Should the pathfinding algorithm be configurable (e.g., different pathfinding strategies)?