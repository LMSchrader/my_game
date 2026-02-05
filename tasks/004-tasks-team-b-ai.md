## Relevant Files

- `src/ai/types/ai.ts` - New file: AI-related type definitions
- `src/ai/AIController.ts` - New file: Main AI controller class that listens for turn events
- `src/scenes/GameScene.ts` - Initialize AIController and pass dependencies
- `src/turn/TurnManager.ts` - Not modified; AIController listens to its turnStart events
- `src/movement/MovementSystem.ts` - Used for getting valid movement tiles
- `src/utils/hexGridUtils.ts` - Used for calculating hex distances
- `src/state/GameState.ts` - AIController needs this to get all characters
- `src/character/types/character.ts` - Character and Team types

### Notes

- The existing TurnManager already emits turnStart events which AIController will listen to
- No changes needed to TurnManager or InteractionHandler
- AI only controls Team B characters (checks team membership)
- Phase 1 uses simple random movement from valid tiles

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks


- [x] 0.0 Create feature branch
    - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/team-b-ai`)
- [x] 1.0 Create AI types and interfaces
  - [x] 1.1 Create directory `src/ai/types/` if it doesn't exist
  - [x] 1.2 Create `src/ai/types/ai.ts` with AIMoveDecision interface
  - [x] 1.3 Define GridBoundsChecker type for AIController dependency
  - [x] 1.4 Export types for use in AIController
- [x] 2.0 Implement AIController class
  - [x] 2.1 Create `src/ai/AIController.ts` file
  - [x] 2.2 Define private fields: gameState, gridBoundsChecker, turnManager, event callback reference
  - [x] 2.3 Implement constructor accepting GameState and grid bounds checker function
  - [x] 2.4 Implement initialize() method to register listener with TurnManager
  - [x] 2.5 Implement handleTurnStart() method that checks if character is Team B
  - [x] 2.6 Implement executeAITurn() method with random movement logic
  - [x] 2.7 Implement shutdown() method to remove event listener
  - [x] 2.8 Add logging using logger utility for debugging
- [x] 3.0 Integrate AIController into GameScene
  - [x] 3.1 Add aiController property to GameScene class
  - [x] 3.2 Import AIController in GameScene
  - [x] 3.3 Initialize AIController after TurnManager initialization in initializeGame()
  - [x] 3.4 Pass gameState and hex grid bounds checker to AIController constructor
  - [x] 3.5 Call aiController.initialize(turnManager) with turnManager instance
  - [x] 3.6 Clean up AIController in onExit() method by calling shutdown()
- [x] 4.0 Test AI movement and turn behavior
  - [x] 4.1 Run TypeScript compiler check: `npx tsc -b`
  - [x] 4.2 Run linter: `npm run lint`
  - [x] 4.3 Start dev server: `npm run dev`