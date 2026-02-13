## Relevant Files

- `src/game/character/CharacterModel.ts` - New file for character state and logic
- `src/game/character/CharacterView.ts` - New file for Pixi.js rendering
- `src/game/types/character.ts` - Existing character types and Character interface
- `src/game/types/grid.ts` - Existing HexCoordinates type reference
- `src/utils/characterLoader.ts` - New file for JSON datasource loading
- `characters.json` - New JSON file with character definitions
- `src/game/character/Character.ts` - Existing file to be removed after refactoring
- `src/scenes/GameScene.ts` - Updates needed to instantiate model/view separately
- `src/game/TurnManager.ts` - Updates needed to work with CharacterModel
- `src/ai/AIController.ts` - Updates needed to work with CharacterModel
- `src/ai/types/ai.ts` - May need updates for Character references

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `CharacterModel.ts` and `CharacterModel.test.ts` in the same directory).
- Use `npm run dev` for manual testing after completing tasks.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/[feature-name]`)
- [x] 1.0 Create CharacterModel class
  - [x] 1.1 Create `src/game/character/CharacterModel.ts` file with class definition
  - [x] 1.2 Add core state properties: id, name, team, speed, maxMovementPoints, movementPoints, hexPosition
  - [x] 1.3 Implement constructor that accepts config object with optional defaults (use DEFAULT_SPEED and DEFAULT_MOVEMENT_POINTS)
  - [x] 1.4 Implement setPosition() method to update hexPosition
  - [x] 1.5 Implement move() method that updates hexPosition and sets movementPoints to 0
  - [x] 1.6 Implement resetMovementPoints() method that sets movementPoints to maxMovementPoints
  - [x] 1.7 Implement hasEnoughMovementPoints() method to check if movementPoints >= points
  - [x] 1.8 Implement setSelected() and isSelected() methods for selection tracking
  - [x] 1.9 Implement setActiveTurn() and isActiveTurn() methods for turn tracking
  - [x] 1.10 Make CharacterModel implement the existing Character interface
- [x] 2.0 Create CharacterView class
  - [x] 2.1 Create `src/game/character/CharacterView.ts` file extending `Container`
  - [x] 2.2 Add constructor accepting CharacterModel instance and PositionProvider interface
  - [x] 2.3 Create and configure the Sprite with proper anchoring and scaling
  - [x] 2.4 Create createSelectionHighlight() method using createOutline utilities
  - [x] 2.5 Create createTeamBorder() method with team-specific colors
  - [x] 2.6 Create createActiveGlow() method for active turn indication
  - [x] 2.7 Implement updateSpritePosition() method to sync with model's hexPosition
  - [x] 2.8 Bind view state to model properties (selection highlight visibility, active glow visibility)
  - [x] 2.9 Add method to update view when model position changes
- [x] 3.0 Create JSON datasource loader
  - [x] 3.1 Create `src/utils/characterLoader.ts` file
  - [x] 3.2 Define TypeScript interface for JSON character data structure (id, name, team, speed, maxMovementPoints)
  - [x] 3.3 Create `characters.json` file in project root with sample character definitions
  - [x] 3.4 Implement loadCharacters() function that reads JSON file and returns CharacterModel instances
  - [x] 3.5 Apply default values for missing properties in JSON data
- [x] 4.0 Update existing code to use model/view pattern
  - [x] 4.1 Update `src/scenes/GameScene.ts` imports to use CharacterModel and CharacterView instead of CharacterEntity
  - [x] 4.2 Update `src/scenes/GameScene.ts` initializeCharacters() to create CharacterModel instances with config
  - [x] 4.3 Update `src/scenes/GameScene.ts` initializeCharacters() to create CharacterView instances attached to models
  - [x] 4.4 Update `src/scenes/GameScene.ts` addCharacter() to add view to grid and model to game separately
  - [x] 4.5 Add event listeners to CharacterModel for state changes (position, selection, turn state)
  - [x] 4.6 Update CharacterView to subscribe to model events and update visual state
  - [x] 4.7 Update initializeCharacters() to use loadCharacters() from characterLoader.ts
  - [x] 4.8 Move character initialization from constructor to onEnter() for async loading
  - [x] 4.9 Verify Game.ts still works with CharacterModel (uses Character interface, should work automatically)
  - [x] 4.10 Verify TurnManager.ts still works with CharacterModel (uses Character interface, should work automatically)
  - [x] 4.11 Verify all other imports and usages are updated correctly
- [ ] 5.0 Remove old CharacterEntity and clean up
  - [x] 5.1 Delete `src/game/character/Character.ts` file
  - [x] 5.2 Run `npm run lint` to check for any remaining errors
  - [x] 5.3 Run `npm run build` to verify TypeScript compilation succeeds
  - [ ] 5.4 Run `npm run dev` and manually test character movement, selection, and turn functionality
  - [x] 5.5 Ensure no TypeScript errors remain in the project
