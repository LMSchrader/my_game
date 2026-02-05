# Product Requirements Document: AI for Team B

## Overview
Add AI-controlled gameplay for Team B characters to move and take turns automatically, enabling a playable single-player experience against computer opponents.

## Background
The game currently features two teams:
- **Team A**: Player-controlled (currently only TeamA)
- **Team B**: AI-controlled characters

When a Team B character's turn begins, the AI should automatically control that character: move to a position and end the turn.

## Requirements

### 1. AI Turn Management
**Priority: High**

When it's Team B's turn:
- AI should automatically take control when `turnStart` event fires for a Team B character
- No player interaction should be allowed for Team B characters during AI turn
- AI should complete its action and call `turnManager.endTurn()` when done

### 2. AI Movement Logic (Phase 1 - Basic)
**Priority: High**

In the initial phase, the AI should:
- Select all valid movement tiles for the active character using `getValidMovementTiles()`
- Randomly select one valid tile to move to
- Execute the movement by calling `character.setPosition()` and `character.useMovementPoints()`
- End the turn after the move is complete

### 3. Architecture

#### New Files to Create:
```
src/ai/
  ├── AIController.ts          # Main AI controller class
  └── types/
      └── ai.ts               # AI-related types
```

#### AIController Responsibilities:
- Register as a listener for `turnStart` events from TurnManager
- Check if the active character belongs to Team B
- If Team B's turn:
  1. Get valid movement tiles using MovementSystem utilities
  2. Select a target position (random selection in Phase 1)
  3. Execute movement
  4. Call `turnManager.endTurn()`
- **Not** register any listeners for other turn events (keep it simple)

#### Integration Points:
- **GameScene.ts**: Initialize AIController after TurnManager initialization
- **TurnManager.ts**: No changes required (already emits turnStart events)
- **MovementSystem.ts**: Use existing `getValidMovementTiles()` function
- **InteractionHandler.ts**: No changes required (Team B characters already non-selectable)

### 4. Technical Specifications

#### AI Controller Interface
```typescript
interface AIController {
  initialize(turnManager: TurnManager): void
  shutdown(): void
}
```

#### AI Types
```typescript
// src/ai/types/ai.ts
export interface AIMoveDecision {
  character: Character
  targetHex: HexCoordinates
}
```

#### Basic AI Movement Algorithm (Phase 1)
```typescript
private executeAITurn(character: Character): void {
  // 1. Get all valid movement tiles
  const allCharacters = this.gameState.getAllCharacters()
  const validTiles = getValidMovementTiles(
    character.hexPosition,
    character.movementPoints,
    allCharacters,
    this.gridBoundsChecker
  )

  // 2. Randomly select one tile
  const randomTile = validTiles[Math.floor(Math.random() * validTiles.length)]

  // 3. Execute movement
  if (randomTile) {
    const distance = getHexDistance(character.hexPosition, randomTile)
    character.setPosition(randomTile)
    character.useMovementPoints(distance)
  }

  // 4. End turn
  this.turnManager.endTurn()
}
```

### 5. Implementation Details

#### Dependencies:
- Type: `Character` from `character/types/character.ts`
- Type: `HexCoordinates` from `grid/types/grid.ts`
- Function: `getValidMovementTiles` from `movement/MovementSystem.ts`
- Function: `getHexDistance` from `utils/hexGridUtils.ts`
- Class: `TurnManager` from `turn/TurnManager.ts`
- Interface: `GameState` from `state/GameState.ts`

#### GameScene Integration:
```typescript
// After turnManager initialization
this.aiController = new AIController(
  this.gameState!,
  (hex) => this.hexGrid!.isHexInGrid(hex)
)
this.aiController.initialize(this.turnManager)
```

### 6. Success Criteria
- [ ] AI Controller identifies when Team B's turn starts
- [ ] AI Controller moves Team B character to a valid tile
- [ ] AI Controller ends turn after movement
- [ ] No errors in console during AI turns
- [ ] Turn order continues to cycle between all characters
- [ ] Player (Team A) can still control their characters normally

### 7. Future Enhancements (Out of Scope)
- Strategic movement (move towards enemies, avoid danger zones)
- Attack actions
- Multiple moves per turn
- Skill/ability usage
- AI difficulty settings

## Constraints
- Phase 1 should be simple and straightforward
- Keep AI logic minimal - random movement is acceptable
- No changes required to existing TurnManager or InteractionHandler
- Follow existing code patterns: use TypeScript with explicit types, use existing utilities

## Timeline
- **Phase 1**: Basic random movement AI (this PRD)
- **Estimated effort**: 2-3 hours