import { type HexCoordinates } from "./types/grid.ts";
import { type Character } from "./types/character.ts";
import { isValidMove } from "./movementSystem.ts";
import { Game } from "./Game.ts";
import { logger } from "../utils/logger.ts";
import type { HexGridModel } from "./HexGridModel.ts";

export class InteractionHandler {
  private readonly game: Game;
  private readonly hexGridModel: HexGridModel;

  constructor(game: Game, hexGridModel: HexGridModel) {
    this.game = game;
    this.hexGridModel = hexGridModel;
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
    } else {
      this.game.selectCharacter(clickedCharacter.id);
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
      return;
    }

    if (this.isValidMove(hex, selectedCharacter)) {
      this.executeMove(selectedCharacter, hex);
    } else {
      this.game.deselectCharacter();
    }
  }

  private isValidMove(hex: HexCoordinates, character: Character): boolean {
    if (!this.hexGridModel.isHexInGrid(hex)) {
      return false;
    }

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

    if (character.movementPoints <= 0) {
      this.game.deselectCharacter();
    }
  }
}
