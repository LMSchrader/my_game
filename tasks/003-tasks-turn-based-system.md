# Task List: Turn-Based System

## Relevant Files

- `src/character/types/character.ts` - Extended character interface with team, speed, and movement point properties
- `src/turn/types/turn.ts` - Types for turn management (TurnState, TurnOrder, TurnActions)
- `src/turn/TurnManager.ts` - Core turn management class that tracks turn order and state
- `src/turn/TurnOrderDisplay.ts` - UI component for displaying turn order
- `src/turn/EndTurnButton.ts` - UI button component for ending turns
- `src/character/Character.ts` - Extended character class with turn-related properties
- `src/utils/turnHelpers.ts` - Helper functions for turn order calculations
- `src/main.ts` - Integration of turn system with main game loop
- `src/grid/HexGrid.ts` - Integration with existing grid system for movement restrictions

### Notes

- This project uses Pixi.js for rendering
- Follow TypeScript strict mode guidelines (explicit types, no implicit any)
- Use the existing logger utility from `src/utils/logger.ts`
- No test framework is currently configured
- Run `npm run lint` after completing tasks to ensure code quality
- Run `npx tsc -b` to verify TypeScript type checking

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 1.0 Extend Character Types with Team and Speed Stats
  - [x] 1.1 Read existing character types in `src/character/types/` directory to understand current structure
  - [x] 1.2 Extend `src/character/types/character.ts` with `team`, `speed`, `maxMovementPoints`, and `movementPoints` properties
  - [x] 1.3 Define Team enum type (TeamA, TeamB) for team assignments in the character types file
  - [x] 1.4 Update existing Character class to implement the new interface with default values for team and speed
  - [x] 1.5 Initialize test characters with different team assignments and speed values in main game initialization

- [x] 2.0 Implement Turn Order Initialization and Display
  - [x] 2.1 Create `src/turn/types/turn.ts` with TurnQueue, TurnState, and related types
  - [x] 2.2 Create `src/utils/turnHelpers.ts` with `calculateTurnOrder()` function that sorts characters by speed stat in descending order
  - [x] 2.3 Create `src/turn/TurnOrderDisplay.ts` class extending PIXI.Container for rendering turn order UI
  - [x] 2.4 Implement visual rendering of character cards in the turn order display showing team color, character ID, and speed value
  - [x] 2.5 Integrate turn order display into main game scene and position it on screen (e.g., right sidebar)
  - [x] 2.6 Initialize and display turn order when game starts using the helper function

- [x] 3.0 Create Turn Manager Core Logic
  - [x] 3.1 Create `src/turn/TurnManager.ts` class with properties for `turnQueue`, `currentTurnIndex`, and `activeCharacter`
  - [x] 3.2 Implement `initializeTurnOrder(characters)` method to set up the initial turn queue
  - [x] 3.3 Implement `getActiveCharacter()` method to return the character whose turn it is
  - [x] 3.4 Implement `endTurn()` method to advance to the next character in the queue with loop back to first character
  - [x] 3.5 Implement helper methods for checking if it's the player's team's turn (`isPlayerTurn()`)
  - [x] 3.6 Integrate TurnManager into main game state and create a singleton instance
  - [x] 3.7 Add event emitters or callbacks for turn start and end events to enable UI updates

- [x] 4.0 Add Team Control and Character Selection Restrictions
  - [x] 4.1 Modify existing character selection logic to check if character is active via TurnManager
  - [x] 4.2 Add visual feedback when attempting to select a non-active character (e.g., console log, visual shake)
  - [x] 4.3 Update movement logic to allow movement only for the active character
  - [x] 4.4 Prevent interaction with characters on the opponent's team (TeamB)
  - [x] 4.5 Add team color coding to character representations (blue for player team, red for enemy)
  - [x] 4.6 Test that player cannot select or move non-active characters

- [x] 5.0 Create Active Character Visual Indicators
  - [x] 5.1 Add `isActive: boolean` status property to turn order display items
  - [x] 5.2 Implement visual highlight/glow effect for the active character in the turn order display
  - [x] 5.3 Update the turn order display to refresh when turn changes through event listeners
  - [x] 5.4 Add visual indicator on the character sprite itself when it's their turn (e.g., border, glow, or brightness)
  - [x] 5.5 Ensure active character indicator is clearly visible and stands out from inactive characters

- [x] 6.0 Implement End Turn Button and Turn Advancement
  - [x] 6.1 Create `src/turn/EndTurnButton.ts` class extending PIXI.Graphics or PIXI.Container
  - [x] 6.2 Design button with prominent size, contrasting color (e.g., green), and "End Turn" text label
  - [x] 6.3 Implement click handler that calls TurnManager.endTurn() when clicked
  - [x] 6.4 Add logic to disable/hide button when it's not the player's team's turn
  - [x] 6.5 Position EndTurnButton in a prominent location on screen (e.g., bottom center or bottom right)
  - [x] 6.6 Add hover visual effects to indicate interactivity
  - [x] 6.7 Test that clicking button advances turn and updates all UI elements correctly

- [x] 7.0 Implement Movement Point Reset on Turn End
  - [x] 7.1 Add `resetMovementPoints()` method to Character class that sets movementPoints to maxMovementPoints
  - [x] 7.2 Modify TurnManager.endTurn() to call resetMovementPoints() on the current character before advancing turn
  - [x] 7.3 Ensure movement point display updates visually after reset
  - [x] 7.4 Test that movement points reset correctly after each character's turn ends
  - [x] 7.5 Verify that a character who did not move during their turn still has full movement points when their turn comes again

- [x] 8.0 Integrate and Test Full Turn System
  - [x] 8.1 Wire up all components: TurnManager, TurnOrderDisplay, EndTurnButton, character selection, and movement restrictions
  - [x] 8.2 Add logging for key turn events (turn start, turn end, movement reset) using logger utility
  - [x] 8.3 Manual test: Start game and verify turn order displays correctly based on speed stat
  - [x] 8.4 Manual test: Verify only active character can be selected and moved
  - [x] 8.5 Manual test: Verify clicking End Turn advances to next character and movement points reset
  - [x] 8.6 Manual test: Verify turn order loops back to first character after reaching the end
  - [x] 8.7 Manual test: Verify End Turn button is disabled during opponent's turns
  - [x] 8.8 Manual test: Verify player cannot interact with opponent's team characters
  - [x] 8.9 Run `npm run lint` and fix any linting errors
  - [x] 8.10 Run `npx tsc -b` to verify TypeScript type checking passes