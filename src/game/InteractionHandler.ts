import { type HexCoordinates } from "./types/grid.ts";
import { type Character } from "./types/character.ts";
import { getValidMovementTiles, isValidMove } from "./movementSystem.ts";
import { Game } from "./Game.ts";
import { logger } from "../utils/logger.ts";
import type { HexGrid } from "./HexGrid.ts";

export class InteractionHandler {
  private readonly game: Game;
  private readonly grid: HexGrid;

  constructor(game: Game, grid: HexGrid) {
    this.game = game;
    this.grid = grid;
  }

  public handleGlobalClick(): void {
    this.game.deselectCharacter();
    this.grid.clearHighlights();
  }

  public handleHexClick(hex: HexCoordinates): void {
    const clickedCharacter = this.game.getCharacterAtPosition(hex);
    const selectedCharacter = this.game.getSelectedCharacter();

    if (clickedCharacter) {
      this.handleCharacterClick(clickedCharacter, selectedCharacter);
    } else if (selectedCharacter) {
      this.handleEmptyTileClick(hex, selectedCharacter);
    }
  }

  private handleCharacterClick(
    clickedCharacter: Character,
    selectedCharacter?: Character,
  ): void {
    if (!this.game.isCharacterPlayable(clickedCharacter)) {
      //todo for later: if character of team b show details
      logger.debug(
        `Cannot select ${clickedCharacter.name}: not active character or wrong team`,
      );
      return;
    }

    if (selectedCharacter?.id === clickedCharacter.id) {
      this.game.deselectCharacter();
      this.grid.clearHighlights();
    } else {
      this.game.selectCharacter(clickedCharacter.id);
      this.showMovementRange(clickedCharacter);
    }
  }

  private handleEmptyTileClick(
    hex: HexCoordinates,
    selectedCharacter?: Character,
  ): void {
    if (!selectedCharacter) {
      return;
    }

    if (!this.game.isCharacterPlayable(selectedCharacter)) {
      logger.debug(
        `${selectedCharacter.name} cannot move: not active character or wrong team`,
      );
      this.game.deselectCharacter();
      this.grid.clearHighlights();
      return;
    }

    if (this.isValidMove(hex, selectedCharacter)) {
      this.executeMove(selectedCharacter, hex);
    } else {
      this.game.deselectCharacter();
      this.grid.clearHighlights();
    }
  }

  private isValidMove(hex: HexCoordinates, character: Character): boolean {
    const allCharacters = this.game.getAllCharacters();
    return isValidMove(
      character.hexPosition,
      hex,
      character.movementPoints,
      allCharacters,
    );
  }

  private executeMove(
    character: Character,
    newHexPosition: HexCoordinates,
  ): void {
    character.move(newHexPosition);

    this.grid.clearHighlights();

    if (character.movementPoints > 0) {
      this.showMovementRange(character);
    } else {
      this.game.deselectCharacter();
    }
  }

  private showMovementRange(character: Character): void {
    const allCharacters = this.game.getAllCharacters();
    const movementTiles = getValidMovementTiles(
      character.hexPosition,
      character.movementPoints,
      allCharacters,
      (hex) => this.grid.isHexInGrid(hex),
    );

    this.grid.highlightTiles(movementTiles);
  }
}
