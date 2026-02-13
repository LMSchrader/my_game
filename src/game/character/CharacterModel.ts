import { type Character, Team } from "../types/character.ts";
import { type HexCoordinates } from "../types/grid.ts";
import { EventEmitter } from "pixi.js";
import { DEFAULT_MOVEMENT_POINTS, DEFAULT_SPEED } from "../../config/config.ts";

export class CharacterModel extends EventEmitter implements Character {
  public readonly id: string;
  public hexPosition: HexCoordinates;
  public movementPoints: number;
  public readonly maxMovementPoints: number;
  public readonly name: string;
  public readonly team: Team;
  public readonly speed: number;
  public readonly spritePath: string;

  private selected: boolean = false;
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

  public setSelected(isSelected: boolean): void {
    this.selected = isSelected;
    this.emit("selectionChanged");
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public setActiveTurn(isActive: boolean): void {
    this.activeTurn = isActive;
    this.emit("turnStateChanged");
  }

  public isActiveTurn(): boolean {
    return this.activeTurn;
  }
}
