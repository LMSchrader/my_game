# PRD: Turn-Based System

## Introduction/Overview

This PRD describes the implementation of a turn-based system for the game. The turn-based system provides structured gameplay where characters take action in a predictable order determined by their speed stat. Characters belong to one of two teams, with only one team controlled by the player. The system ensures that only the character whose turn it is can be moved, and after a character's turn is manually ended, their movement points and other temporary states are reset.

The goal of this feature is to create a fair and strategic turn-based gameplay experience that gives players clear expectations about when they can act and forces strategic decision-making through manual turn-ending mechanics.

## Goals

1. Implement a turn order system that prioritizes characters based on speed stat
2.Restrict movement and actions to only the character whose turn it is
3. Provide a manual "End Turn" button for the player to control when to relinquish control
4. Reset movement points when a character's turn ends
5. Support two teams with predefined character assignments
6. Enable player control over only one team
7. Visual clarity for identifying the active character and available actions

## User Stories

1. As a player, I want to see the turn order displayed at the start of the game so I can plan my strategy.
2. As a player, I want only my team's characters to be controllable so I don't accidentally move enemy units.
3. As a player, I want to clearly identify which character's turn it is so I know who I can act with.
4. As a player, I want a prominent "End Turn" button so I can decide when to pass control.
5. As a player, I want my character's movement points to reset after their turn so they're ready for future rounds.
6. As a player, I want to understand that faster characters will act before slower ones based on the speed stat.
7. As a player, I want to be prevented from moving characters who aren't currently in their turn.

## Functional Requirements

### Turn Order Initialization
1. The system must determine initial turn order based on each character's speed stat (higher speed = earlier turn).
2. The system must display the complete turn order for all characters when the game starts.
3. Characters must be permanently assigned to predefined teams (Team A or Team B) before game initialization.
4. Turn order must be recalculated if any conditions change that affect character speed.
5. Each character must know their position in the turn order queue.

### Turn Management
6. The system must track which character's turn is currently active.
7. Only the character whose turn it is can be moved or selected.
8. Attempting to select or move a non-active character must provide visual feedback indicating it's not their turn.
9. The system must provide an "End Turn" button that is only clickable during the player's team's turns.
10. When "End Turn" is clicked, the current character's turn immediately ends.
11. The system must advance to the next character in the turn order queue.
12. When the queue reaches the end, it must loop back to the first character.

### Movement Point Reset
13. When a character's turn ends, their movement points must reset to their maximum value.
14. Movement point reset must occur regardless of whether the character moved during their turn.
15. The reset process must update the character's displayed movement point value.

### Team Control
16. The player can only control characters assigned to their designated team.
17. The opponent's team (Team B) must be unselectable by the player.
18. The "End Turn" button must be disabled or hidden when it's not the player's team's turn.
19. The system must prevent the player from interacting with enemy characters in any way.

### Visual Indicators
20. The currently active character must be visually distinguished from inactive characters.
21. The turn order display must show which characters belong to which team.
22. The current position in the turn order must be highlighted in the display.
23. The "End Turn" button must be prominent and easily clickable when available.
24. Unselectable characters must have visual indicators showing they cannot be interacted with.

### State Management
25. The system must maintain the current turn index in the turn order queue.
26. The system must track which team controls the current character.
27. The system must ensure state consistency between turn transitions.
28. Character movement points must be accurately tracked and updated during turns.

## Non-Goals (Out of Scope)

- AI or automated control for the opponent's team
- Action points or combat mechanics
- Các cooldown systems for abilities
- Terrain modifiers or environmental effects
- Buff/debuff systems
- Initiative roll mechanics (turn order is deterministic based on speed stat)
- Multiple actions per character per turn (beyond movement)
- Turn time limits
- Save/load functionality
- Reversible turn actions (undo)
- Combat systems beyond movement restrictions
- Character stats beyond speed and movement points

## Design Considerations

- Turn order display should be positioned visibly on screen (e.g., sidebar or top panel)
- Active character indicator should use high-contrast visual effects (e.g., glow, border, color change)
- "End Turn" button should be large and use a distinctive color that stands out
- Turn order should show character icons or identifiers for easy recognition
- When it's the opponent's turn, the "End Turn" button should be grayed out or hidden
- Team affiliation should be visually clear through color coding (e.g., blue for player team, red for enemy)
- Character speed values should be viewable so players understand the turn order logic
- Movement point reset should be visually indicated when it occurs
- The transition between turns should be clear but not disruptive to gameplay flow

## Technical Considerations

- Extend the existing character interface to include team, speed stat, and movement point properties
- Create a turn manager class that tracks the turn order queue and current turn state
- Implement turn order sorting algorithm based on speed stat (descending order)
- Store turn order in an array of character references
- Use the existing Pixi.js rendering system for UI elements (turn order display, End Turn button)
- Ensure turn state persists across the game session
- Consider reactive state management for efficient UI updates when turns change
- The turn system must integrate with the existing character movement system
- Movement point logic should be separated from turn management for modularity
- Follow the project's TypeScript and ESLint guidelines
- Use the logger utility for turn-related events and errors

## Success Metrics

1. **Correct turn order**: Characters act in proper speed-based order at game start
2. **Movement restriction**: Non-active characters cannot be moved or selected
3. **Manual turn end**: "End Turn" button reliably advances to the next character in the queue
4. **Movement reset**: Character movement points correctly reset to maximum after their turn ends
5. **Visual clarity**: Players can easily identify the active character and whose turn it is
6. **Team control**: Player cannot interact with opponent's characters
7. **Bug-free operation**: No console errors occur during normal turn-based gameplay flow
8. **Code quality**: Implementation follows project conventions and passes lint checks

## Open Questions

1. What is the default speed stat value for characters if not explicitly set?
2. How should ties be resolved when multiple characters have the same speed stat?
3. What happens to the turn order when a character is added or removed from the game?
4. Should the turn order be re-displayed or updated when advancing through the queue?
5. What visual feedback should occur when attempting to select a non-active character?
6. Should there be a confirmation dialog before ending a turn?
7. How many characters are expected to be on each team initially?
8. Should there be a visual indicator when a character has ended their turn (e.g., grayed out)?
9. What is the maximum movement point value for characters?
10. Should the turn order be re-sortable dynamically if speed stats change during gameplay?