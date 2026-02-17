# PRD: Card System for Turn-Based Tactical Game

## Introduction/Overview

This PRD outlines the addition of a card system to the turn-based tactical game. Characters will have their own configurable set of cards, and a configurable number of cards will be drawn each turn. Players can play one card per turn, and the card's action is executed (for now, cards have no actual action logic).

## Goals

- Establish a foundational card system that can be extended with actions in future iterations
- Enable each individual character instance to have their own configurable deck of cards
- Support configurable number of cards drawn per turn
- Allow players to view and select one card to play per turn
- Create a mechanism that returns all drawn cards (played and unplayed) back after each turn

## User Stories

As a player, I want to see my character's available cards displayed each turn so that I can make a decision about which to play.

As a player, I want to be able to click on a card to select and play it so that I can progress the game.

As a developer, I want to be able to configure different decks for different character instances so that characters can have unique playstyles.

As a developer, I want to be able to configure the number of cards drawn per turn through a central config file.

## Functional Requirements

1. The system must allow each CharacterEntity instance to have its own configurable set of cards (a deck).
2. The system must draw a configurable number of cards from the character's deck at the start of each turn.
3. The system must display the drawn cards in the UI for the current player to see.
4. The system must allow the player to select exactly one card from the drawn cards during their turn.
5. The system must execute a placeholder/no-op action when a card is played.
6. The system must return all drawn cards (both played and unplayed) back to the deck after each turn.
7. The number of cards drawn per turn must be configurable through `src/config/config.ts`.

## Non-Goals (Out of Scope)

- Implementing actual card actions/effects (e.g., dealing damage, healing, movement)
- Card costs or resource consumption
- Card types or categories
- Card rarity or visual distinctions
- Card animations or special effects
- Deck building or card management UI
- Saving/loading card configurations

## Design Considerations

Cards should be displayed in a card hand area at the bottom of the screen. Each card should show:
- Card name
- Card description

The selected card should be visually highlighted when the player hovers or clicks it.

## Technical Considerations

- Card system should integrate with the existing TurnManager and CharacterEntity system
- Consider using Pixi's FancyButton or similar interactive component for card selection
- Card shuffle logic may be needed before drawing to ensure randomness
- The card hand should be added/removed from the scene as turns change
- The current turn's active character's cards should be displayed

## Success Metrics

- Cards are successfully drawn and displayed for each character's turn
- Player can click a card and a placeholder action executes
- All cards return to the deck after the turn ends
- System is extensible to support future card actions

## Open Questions

- Should cards be drawn randomly from the deck or in a fixed order?
- Should there be a limit on the number of times a single card type can appear in a deck?
- What happens if a character's deck is empty when it's their turn?
- Should cards be re-shuffled each turn, or just kept in the order they were returned?