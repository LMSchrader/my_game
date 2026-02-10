import { EventEmitter } from "pixi.js";
import { type Character, Team } from "./types/character.ts";
import { type TurnEvent, type TurnQueue } from "./types/turn.ts";
import { logger } from "../utils/logger.ts";
import type { Game } from "./Game.ts";

export class TurnManager {
  private readonly game: Game;
  private currentTurnIndex: number = 0;
  private readonly emitter: EventEmitter = new EventEmitter();
  private turnOrder: string[] = [];

  public constructor(game: Game) {
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
    this.getActiveCharacter()?.setActiveTurn(true);
    this.emit("turnOrderInitialized");
  }

  public getActiveCharacter(): Character | undefined {
    if (this.turnOrder.length === 0) {
      return undefined;
    }
    const characterId = this.turnOrder[this.currentTurnIndex];
    return this.game.getAllCharacters().find((c) => c.id === characterId);
  }

  public endTurn(): void {
    if (this.turnOrder.length === 0) {
      logger.warn("Cannot end turn: no characters in turn queue");
      return;
    }

    const currentCharacter = this.getActiveCharacter();
    if (currentCharacter) {
      currentCharacter.resetMovementPoints();
      currentCharacter.setActiveTurn(false);
      logger.debug(
        `${currentCharacter.name} movement points reset to ${currentCharacter.maxMovementPoints}`,
      );
      this.emit("turnEnd", currentCharacter);
      logger.debug(`Ended turn for ${currentCharacter.name}`);
    }

    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;

    const newActiveCharacter = this.getActiveCharacter();
    if (newActiveCharacter) {
      newActiveCharacter.setActiveTurn(true);
      this.emit("turnStart", newActiveCharacter);
      logger.debug(`Started turn for ${newActiveCharacter.name}`);
    }
  }

  public isPlayerTurn(): boolean {
    const activeCharacter = this.getActiveCharacter();
    return activeCharacter?.team === Team.TeamA;
  }

  public getTurnQueue(): TurnQueue {
    const allCharacters = this.game.getAllCharacters();
    return this.turnOrder
      .map((id) => allCharacters.find((c) => c.id === id))
      .filter((c): c is Character => c !== undefined);
  }

  public on(event: TurnEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.on(event, callback);
  }

  public off(event: TurnEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.off(event, callback);
  }

  public reset(): void {
    this.emitter.removeAllListeners();
    this.turnOrder = [];
    this.currentTurnIndex = 0;
  }

  private calculateTurnOrder(characters: Character[]): TurnQueue {
    return [...characters].sort((a, b) => b.speed - a.speed);
  }

  private emit(event: TurnEvent, ...args: unknown[]): void {
    this.emitter.emit(event, ...args);
  }
}
