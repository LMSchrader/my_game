import { type HexCoordinates } from "../grid/types/grid.ts";
import { type Character, Team } from "../character/types/character.ts";
import { getValidMovementTiles } from "../movement/MovementSystem.ts";
import { getHexDistance } from "../utils/hexGridUtils.ts";
import { GameState } from "../state/GameState.ts";
import { logger } from "../utils/logger.ts";
import type { HexGrid } from "../grid/HexGrid.ts";

interface TurnProvider {
  getActiveCharacter(): Character | undefined;

  isPlayerTurn(): boolean;
}

export class InteractionHandler {
  private readonly gameState: GameState;
  private readonly hexGrid: HexGrid;
  private readonly turnProvider: TurnProvider;

  constructor(
    gameState: GameState,
    hexGrid: HexGrid,
    turnProvider: TurnProvider,
  ) {
    this.gameState = gameState;
    this.hexGrid = hexGrid;
    this.turnProvider = turnProvider;
  }

  public handleGlobalClick(): void {
    this.gameState.deselectCharacter();
    this.hexGrid.clearHighlights();
  }

  public handleHexClick(hex: HexCoordinates): void {
    const clickedCharacter = this.gameState.getCharacterAtPosition(hex);
    const selectedCharacter = this.gameState.getSelectedCharacter();

    if (clickedCharacter) {
      this.handleCharacterClick(clickedCharacter, selectedCharacter);
    } else if (selectedCharacter) {
      this.handleEmptyTileClick(hex, selectedCharacter);
    }
  }

  private handleCharacterClick(
    clickedCharacter: Character,
    selectedCharacter: Character | undefined,
  ): void {
    if (!this.isCharacterPlayable(clickedCharacter)) {
      logger.debug(
        `Cannot select ${clickedCharacter.name}: not active character or wrong team`,
      );
      return;
    }

    if (selectedCharacter?.id === clickedCharacter.id) {
      this.gameState.deselectCharacter();
      this.hexGrid.clearHighlights();
    } else {
      this.gameState.selectCharacter(clickedCharacter.id);
      this.showMovementRange(clickedCharacter);
    }
  }

  private handleEmptyTileClick(
    hex: HexCoordinates,
    selectedCharacter: Character | undefined,
  ): void {
    if (!selectedCharacter) {
      return;
    }

    if (!this.isCharacterPlayable(selectedCharacter)) {
      logger.debug(
        `${selectedCharacter.name} cannot move: not active character or wrong team`,
      );
      this.gameState.deselectCharacter();
      this.hexGrid.clearHighlights();
      return;
    }

    if (this.isValidMove(hex, selectedCharacter)) {
      this.executeMove(selectedCharacter, hex);
    } else {
      this.gameState.deselectCharacter();
      this.hexGrid.clearHighlights();
    }
  }

  private isValidMove(hex: HexCoordinates, character: Character): boolean {
    if (!this.hexGrid.isTileHighlighted(hex)) {
      return false;
    }

    const distance = getHexDistance(character.hexPosition, hex);
    if (!character.hasEnoughMovementPoints(distance)) {
      return false;
    }

    const occupiedCharacter = this.gameState.getCharacterAtPosition(hex);
    return !(occupiedCharacter && occupiedCharacter.id !== character.id);
  }

  private executeMove(
    character: Character,
    newHexPosition: HexCoordinates,
  ): void {
    const oldPosition = character.hexPosition;
    const distance = getHexDistance(oldPosition, newHexPosition);

    character.setPosition(newHexPosition);
    character.useMovementPoints(distance);

    this.hexGrid.clearHighlights();

    if (character.movementPoints > 0) {
      this.showMovementRange(character);
    } else {
      this.gameState.deselectCharacter();
    }
  }

  private showMovementRange(character: Character): void {
    const allCharacters = this.gameState.getAllCharacters();
    const movementTiles = getValidMovementTiles(
      character.hexPosition,
      character.movementPoints,
      allCharacters,
      (hex) => this.hexGrid.isHexInGrid(hex),
    );

    this.hexGrid.highlightTiles(movementTiles);
  }

  private isCharacterPlayable(character: Character): boolean {
    return this.isActiveCharacter(character) && this.isPlayerTeam(character);
  }

  private isActiveCharacter(character: Character): boolean {
    const activeCharacter = this.turnProvider.getActiveCharacter();
    return activeCharacter?.id === character.id;
  }

  private isPlayerTeam(character: Character): boolean {
    return character.team === Team.TeamA;
  }
}
