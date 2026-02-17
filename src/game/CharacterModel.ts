import { type Character, Team } from "./types/character.ts";
import { type HexCoordinates } from "./types/grid.ts";
import type { Card } from "./types/card.ts";
import { EventEmitter } from "pixi.js";
import { DEFAULT_MOVEMENT_POINTS, DEFAULT_SPEED } from "../config/config.ts";

export class CharacterModel extends EventEmitter implements Character {
  public readonly id: string;
  public hexPosition: HexCoordinates;
  public movementPoints: number;
  public readonly maxMovementPoints: number;
  public readonly name: string;
  public readonly team: Team;
  public readonly speed: number;
  public readonly spritePath: string;
  public readonly deck: Card[];
  public drawnCards: Card[];

  private activeTurn: boolean = false;

  constructor(config: {
    id: string;
    hexPosition?: HexCoordinates;
    movementPoints?: number;
    maxMovementPoints?: number;
    name?: string;
    team?: Team;
    speed?: number;
    spritePath: string;
    deck: Card[];
  }) {
    super();
    this.id = config.id;
    this.hexPosition = config.hexPosition ?? { q: 0, r: 0 };
    this.maxMovementPoints =
      config.maxMovementPoints ?? DEFAULT_MOVEMENT_POINTS;
    this.movementPoints = config.movementPoints ?? this.maxMovementPoints;
    this.name = config.name ?? `Character ${this.id}`;
    this.team = config.team ?? Team.TeamA;
    this.speed = config.speed ?? DEFAULT_SPEED;
    this.spritePath = config.spritePath;
    this.deck = [...config.deck];
    this.drawnCards = [];
  }

  public setPosition(hexPosition: HexCoordinates): void {
    this.hexPosition = hexPosition;
    this.emit("positionChanged");
  }

  public move(hexPosition: HexCoordinates): void {
    this.movementPoints = 0;
    this.setPosition(hexPosition);
  }

  public resetMovementPoints(): void {
    this.movementPoints = this.maxMovementPoints;
  }

  public hasEnoughMovementPoints(points: number): boolean {
    return this.movementPoints >= points;
  }

  public setActiveTurn(isActive: boolean): void {
    this.activeTurn = isActive;
    this.emit("turnStateChanged");
  }

  public isActiveTurn(): boolean {
    return this.activeTurn;
  }

  public getDeck(): Card[] {
    return this.deck;
  }

  public getDrawnCards(): Card[] {
    return this.drawnCards;
  }

  public drawCards(count: number): Card[] {
    this.shuffleDeck();
    const drawn: Card[] = [];
    for (let i = 0; i < count && this.deck.length > 0; i++) {
      const card = this.deck.shift();
      if (card) {
        drawn.push(card);
        this.drawnCards.push(card);
      }
    }
    return drawn;
  }

  public returnCards(): void {
    for (const card of this.drawnCards) {
      this.deck.push(card);
    }
    this.drawnCards = [];
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }
}
