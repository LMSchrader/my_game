# PRD: Hex Grid Character Movement System

## Introduction/Overview

This PRD describes the first iteration of a turn-based strategy game built with Pixi.js. The core feature is a hexagonal tile-based map where multiple characters can be moved by the player through a point-based movement system. Players will interact with characters by clicking on them to see available movement options, then selecting a destination tile to complete the movement action.

The goal of this iteration is to establish the foundation for a turn-based strategy game with basic character mobility, movement mechanics, and a simple functional UI that demonstrates the core gameplay loop.

## Goals

1. Create a responsive hexagonal grid map that renders clearly in the browser
2. Implement a character movement system with point-based movement range mechanics
3. Provide intuitive interaction flow: select character → see valid moves → confirm movement
4. Support multiple characters on the map with individual movement tracking
5. Maintain simple, functional visuals that don't require complex artwork or animations

## User Stories

1. As a player, I want to see a hex grid with multiple characters so I can prepare for strategic gameplay.
2. As a player, I want to click on a character to see its available movement range so I can make informed decisions.
3. As a player, I want to see visual highlighting of tiles I can move to so I understand my options quickly.
4. As a player, I want to click on a highlighted tile to move my character there so I can reposition my units.
5. As a player, I want to see movement points decrease after each move so I can track my character's remaining mobility.
6. As a player, I want to know when my character cannot move anymore so I can switch to another unit.

## Functional Requirements

### Grid System
1. The system must render a hexagonal grid with configurable dimensions (rows/columns)
2. The system must properly calculate hex coordinates and positions for pixel-perfect rendering
3. The system must handle mouse detection on hex tiles to identify clicked tiles accurately

### Character Management
4. The system must support multiple characters placed on the grid
5. Each character must track its current position (hex coordinates)
6. Each character must track its remaining movement points
7. Characters must be visually distinct from one another (e.g., different colors or simple icons)

### Movement System (Point-Based)
8. Each character must have a defined movement points (MP) value per turn
9. When a character is selected, the system must calculate and display valid movement tiles within MP range
10. The distance calculation must consider hex grid topology (6 directions of adjacent movement)
11. Each movement to an adjacent tile must consume 1 movement point
12. Characters cannot move to tiles occupied by other characters
13. When a character reaches 0 movement points, no further movement is allowed for that character

### Interaction Flow
14. Clicking on a character must select that character and highlight valid movement tiles
15. Valid movement tiles must be visually distinct (e.g., color overlay or border)
16. Clicking on a highlighted destination tile must move the selected character to that tile
17. Moving a character must update its position and decrease its movement points
18. Re-clicking on a character after movement must re-calculate and display remaining valid moves
19. Deselecting a character (e.g., clicking elsewhere) must remove movement highlights

### State Management
20. The system must maintain the state of all characters (positions, movement points)
21. The system must track the currently selected character
22. The system must update state immediately upon user interactions

## Non-Goals (Out of Scope)

- Turn management system (players take turns, end turn button, etc.)
- Terrain types or terrain modifiers
- Combat mechanics (attacking, damage, health systems)
- Character stats beyond movement points
- Pathfinding obstacles or blockers beyond character collisions
- Visual polish (animations, sprites, particle effects)
- Audio or sound effects
- Save/load functionality
- Multiplayer or AI opponents
- Victory/defeat conditions
- UI indicators beyond basic movement highlighting

## Design Considerations

- Use simple, high-contrast colors for hex tiles and characters to ensure visibility
- Selected character should be visually distinguished (e.g., brighter outline or glow effect)
- Movement tiles should use a semi-transparent color overlay to indicate movability
- Character selection and movement should be instant (no animations in this iteration)
- Grid size should fit within a standard browser window without scrolling (aim for 800x600+)

## Technical Considerations

- Use Pixi.js for rendering the hex grid and characters
- Implement hex grid coordinate system using axial or cube coordinates (recommended: axial)
- Use Pixi's interaction system for click detection on hex tiles and characters
- Store character data in a well-structured state object or class
- Re-render or update visual state efficiently after each interaction
- Keep the code modular: separate grid logic, character logic, and interaction handling
- Consider making grid dimensions configurable for future iterations

## Success Metrics

1. **Functional completeness**: Users can successfully move characters around the grid using the point-based movement system without errors
2. **Interaction clarity**: Users understand how to select characters and identify valid movement tiles without instruction
3. **Performance**: The grid renders smoothly and interactions respond instantly (<100ms latency)
4. **Bug-free operation**: No console errors occur during normal gameplay flow
5. **Code quality**: Code follows the project's TypeScript and ESLint guidelines and passes lint checks

## Open Questions

1. What is the recommended grid size (rows/columns) for the first iteration?
2. How many characters should be present on the map initially?
3. What should be the default movement point value for each character?
4. Should movement points reset or persist across interactions (e.g., for multiple moves before a "turn" system is added)?
5. Is there a preference for hex grid orientation (flat-topped vs pointy-topped)?