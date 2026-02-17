import { EventEmitter } from "pixi.js";
import { type Character, Team } from "./types/character.ts";
import { type TurnQueue } from "./types/turn.ts";
import { logger } from "../utils/logger.ts";
import type { Game } from "./Game.ts";
import { CARDS_DRAWN_PER_TURN } from "../config/config.ts";

export class TurnManager extends EventEmitter {
  private readonly game: Game;
  private currentTurnIndex: number = 0;
  private turnOrder: string[] = [];

  public constructor(game: Game) {
    super();
    this.game = game;
  }

  public initializeTurnOrder(characters: Character[]): void {
    const turnQueue = this.calculateTurnOrder(characters);
    this.turnOrder = turnQueue.map((c) => c.id);
    this.currentTurnIndex = 0;
    logger.debug(
      {
        turnOrder: turnQueue.map(
          (c) => `${c.name} (${c.team}) (SPD: ${c.speed})`,
        ),
      },
      "Turn order initialized",
    );
    this.emit("turnOrderInitialized");

    this.startTurn();
  }

  public endTurn(): void {
    if (this.turnOrder.length === 0) {
      logger.warn("Cannot end turn: no characters in turn queue");
      return;
    }

    const currentCharacter = this.getActiveCharacter();
    currentCharacter.returnCards();
    this.emit("cardsReturned", currentCharacter);
    currentCharacter.resetMovementPoints();
    currentCharacter.setActiveTurn(false);
    logger.debug(
      `${currentCharacter.name} movement points reset to ${currentCharacter.maxMovementPoints}`,
    );
    this.game.deselectCharacter();
    this.emit("turnEnd", currentCharacter);
    logger.debug(`Ended turn for ${currentCharacter.name}`);

    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;

    this.startTurn();
  }

  private startTurn(): void {
    const activeCharacter = this.getActiveCharacter();
    activeCharacter.setActiveTurn(true);

    if (activeCharacter.getDeck().length === 0) {
      logger.warn(`${activeCharacter.name} has an empty deck - no cards drawn`);
    } else {
      const drawnCards = activeCharacter.drawCards(CARDS_DRAWN_PER_TURN);
      this.emit("cardsDrawn", activeCharacter, drawnCards);
      logger.debug(`${activeCharacter.name} drew ${drawnCards.length} cards`);
    }

    this.emit("turnStart", activeCharacter);
    logger.debug(`Started turn for ${activeCharacter.name}`);
  }

  public getActiveCharacter(): Character {
    if (this.turnOrder.length === 0) {
      throw new Error(`Turn order is empty`);
    }
    const characterId = this.turnOrder[this.currentTurnIndex];
    const activeCharacter = this.game
      .getAllCharacters()
      .find((c) => c.id === characterId);
    if (!activeCharacter) {
      throw new Error(`Character with id ${characterId} is unknown`);
    }
    return activeCharacter;
  }

  public isPlayerTurn(): boolean {
    const activeCharacter = this.getActiveCharacter();
    return activeCharacter.team === Team.TeamA;
  }

  public getTurnQueue(): TurnQueue {
    const allCharacters = this.game.getAllCharacters();
    return this.turnOrder
      .map((id) => allCharacters.find((c) => c.id === id))
      .filter((c): c is Character => c !== undefined);
  }

  private calculateTurnOrder(characters: Character[]): TurnQueue {
    return [...characters].sort((a, b) => b.speed - a.speed);
  }
}
