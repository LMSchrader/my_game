## Relevant Files

- `src/game/types/card.ts` - New file for card type definitions (Card interface, card type exports).
- `src/game/types/character.ts` - Update Character interface to include deck and drawn cards properties.
- `src/game/CharacterModel.ts` - Implement deck management methods (shuffle, draw, returnCards).
- `src/config/config.ts` - Add CARDS_DRAWN_PER_TURN configuration value.
- `src/ui/game/CardView.ts` - New Pixi.js component for individual card display.
- `src/ui/game/CardHand.ts` - New Pixi.js component for displaying multiple cards in a hand.
- `src/game/TurnManager.ts` - Integrate card drawing/return into turn lifecycle (turnStart/turnEnd).
- `src/scenes/GameScene.ts` - Add card hand display and interaction for active character.
- `src/utils/cards.ts` - Helper file with DEFAULT_CARDS array for testing.

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:

- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/card-system`)
- [x] 1.0 Define card data structures and configuration
  - [x] 1.1 Create `src/game/types/card.ts` with Card interface containing id, name, and description properties
  - [x] 1.2 Define Card type exports following the const assertion pattern (CardValues, Card type)
  - [x] 1.3 Add `CARDS_DRAWN_PER_TURN` configuration constant to `src/config/config.ts`
  - [x] 1.4 Create a sample/default set of cards for test purposes (e.g., Attack, Defend, Heal)
- [x] 2.0 Implement card deck management for characters
  - [x] 2.1 Add `deck: Card[]` and `drawnCards: Card[]` properties to Character interface in `src/game/types/character.ts`
  - [x] 2.2 Add `getDeck()`, `getDrawnCards()`, `drawCards(count: number)`, and `returnCards()` methods to Character interface
  - [x] 2.3 Implement private deck management methods in `src/game/CharacterModel.ts`
  - [x] 2.4 Implement shuffle logic for the deck using Fisher-Yates algorithm
  - [x] 2.5 Update CharacterModel constructor to accept optional deck configuration
  - [x] 2.6 Update character loader to assign default decks to characters
- [x] 3.0 Create card UI components using Pixi.js
  - [x] 3.1 Create `src/ui/game/Card.ts` component extending Container to display a single card
  - [x] 3.2 Add card styling with background, name text, and description text using PIXI.Text
  - [x] 3.3 Implement hover effect to highlight the selected card (change border/background color)
  - [x] 3.4 Set up event mode and click handler for card selection
  - [x] 3.5 Create `src/ui/game/CardHand.ts` component to display multiple cards in a row
  - [x] 3.6 Implement horizontal layout logic to space cards evenly in the hand
  - [x] 3.7 Add methods to update the displayed cards and clear the hand
  - [x] 3.8 Position the card hand at the bottom center of the screen
- [x] 4.0 Integrate card system with turn management
  - [x] 4.1 Update TurnManager.endTurn() to call returnCards() on current character before turn switches
  - [x] 4.2 Update TurnManager to draw cards for the new active character after turn starts
  - [x] 4.3 Add new events "cardsDrawn" and "cardsReturned" to TurnManager for UI updates
  - [x] 4.4 Handle edge case: what to do if character\'s deck is empty (log warning, no cards drawn)
  - [x] 4.5 Implement card shuffling before each draw for randomness
- [x] 5.0 Add card display and interaction to game scene
  - [x] 5.1 Add CardHand instance to GameScene
  - [x] 5.2 Position card hand at bottom of screen with appropriate padding
  - [x] 5.3 Subscribe to TurnManager "turnStart" event to update card hand with new character\'s cards
  - [x] 5.4 Subscribe to TurnManager "turnEnd" event to clear or update card hand
  - [x] 5.5 Implement test card selection handler that logs card name and executes placeholder action
  - [x] 5.6 Ensure card hand only displays cards during player\'s turn (TeamA)
  - [x] 5.7 Test the complete flow: cards drawn → displayed → clicked → action → end turn → cards returned
