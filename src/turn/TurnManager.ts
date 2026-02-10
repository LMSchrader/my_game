import { EventEmitter } from "pixi.js";
import { type Character, Team } from "../character/types/character.ts";
import { type TurnEvent, type TurnQueue } from "./types/turn.ts";
import { logger } from "../utils/logger.ts";

export class TurnManager {
  private static instance: TurnManager | undefined;
  private turnQueue: TurnQueue = [];
  private currentTurnIndex: number = 0;
  private readonly emitter: EventEmitter = new EventEmitter();

  private constructor() {}

  public static getInstance(): TurnManager {
    TurnManager.instance ??= new TurnManager();
    return TurnManager.instance;
  }

  public initializeTurnOrder(characters: Character[]): void {
    this.turnQueue = this.calculateTurnOrder(characters);
    this.currentTurnIndex = 0;
    logger.debug(
      "Turn order initialized:",
      this.turnQueue.map((c) => `${c.name} (${c.team}) (SPD: ${c.speed})`),
    );
    this.getActiveCharacter()?.setActiveTurn(true);
    this.emit("turnOrderInitialized");
  }

  public getActiveCharacter(): Character | undefined {
    if (this.turnQueue.length === 0) {
      return undefined;
    }
    return this.turnQueue[this.currentTurnIndex];
  }

  public endTurn(): void {
    if (this.turnQueue.length === 0) {
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

    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnQueue.length;

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
    return [...this.turnQueue];
  }

  public getCurrentTurnIndex(): number {
    return this.currentTurnIndex;
  }

  public on(event: TurnEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.on(event, callback);
  }

  public off(event: TurnEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.off(event, callback);
  }

  public reset(): void {
    this.emitter.removeAllListeners();
    this.turnQueue = [];
    this.currentTurnIndex = 0;
    TurnManager.instance = undefined;
  }

  private emit(event: TurnEvent, ...args: unknown[]): void {
    this.emitter.emit(event, ...args);
  }

  private calculateTurnOrder(characters: Character[]): TurnQueue {
    return [...characters].sort((a, b) => b.speed - a.speed);
  }
}
