## Relevant Files

- `src/scenes/SceneManager.ts` - New file to handle scene switching and state management
- `src/scenes/types/scene.ts` - New file for scene-related types and interfaces
- `src/scenes/StartScreen.ts` - New start screen component with title, background, and play button
- `src/main.ts` - Existing entry point to be modified to use scene manager
- `src/game/GameScene.ts` - New file to encapsulate the main game initialization logic (refactored from main.ts)
- `src/utils/scenes.ts` - Utility functions for scene operations (if needed)

### Notes

- The project uses Pixi.js for all rendering
- Follow existing TypeScript conventions with explicit types
- Unit tests are not currently configured for this project
- Use `npm run lint` for code quality checks
- Use `npx tsc -b` for TypeScript type checking
- The game currently uses a hex grid system with characters at `src/grid/HexGrid.ts` and `src/character/Character.ts`

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 1.0 Create scene/state management system for switching between start screen and game
  - [x] 1.1 Create SceneType enum to define available scenes (START, GAME)
  - [x] 1.2 Create Scene interface/contract for scene implementations
  - [x] 1.3 Create SceneManager class with methods to switch between scenes
  - [x] 1.4 Implement scene registration and activation logic in SceneManager

- [x] 2.0 Create StartScreen component with title, background image, and play button
    - [x] 2.1 Create StartScreen class extending Pixi.js Container
    - [x] 2.2 Load and display background image for start screen
    - [x] 2.3 Create game title text with proper styling and positioning
    - [x] 2.4 Create play button with clickable interaction handler
    - [x] 2.5 Implement window resize handling for responsive design

- [x] 3.0 Modify main.ts to initialize with start screen using scene manager
    - [x] 3.1 Create GameScene class to encapsulate existing game initialization logic
    - [x] 3.2 Extract hex grid and character creation logic into GameScene
    - [x] 3.3 Create factory function to initialize game components properly
    - [x] 3.4 Update main.ts to initialize SceneManager with start screen as default
    - [x] 3.5 Ensure existing InteractionHandler and other logic are preserved

- [x] 4.0 Implement transition from start screen to game view
    - [x] 4.1 Connect play button click handler to SceneManager transition
    - [x] 4.2 Ensure GameScene properly initializes on first transition
    - [x] 4.3 Implement cleanup logic for start screen when transitioning away
    - [x] 4.4 Test that all game components (HexGrid, Characters, InteractionHandler) work after transition

- [x] 5.0 Test and verify responsive design and smooth transition
    - [x] 5.1 Test start screen displays correctly on different screen sizes and aspect ratios
    - [x] 5.2 Verify play button click successfully transitions to game view
    - [x] 5.3 Confirm all game functionality (character selection, movement) works after transition
    - [x] 5.4 Run `npm run lint` to ensure code quality
    - [x] 5.5 Run `npx tsc -b` to ensure TypeScript compilation succeeds