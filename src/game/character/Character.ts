import { Container, Graphics, Sprite } from "pixi.js";
import { type Character, Team } from "../types/character.ts";
import { type HexCoordinates, type PixelCoordinates } from "../types/grid.ts";
import { createOutline } from "../../utils/hexGridUtils.ts";
import {
  Colors,
  DEFAULT_MOVEMENT_POINTS,
  DEFAULT_SPEED,
  DEFAULT_SPRITE_SCALE,
} from "../../config/config.ts";

export { Team } from "../types/character.ts";

export interface PositionProvider {
  getCenteredHexPosition: (hex: HexCoordinates) => PixelCoordinates;
}

export class CharacterEntity extends Container implements Character {
  public readonly id: string;
  public hexPosition: HexCoordinates;
  public movementPoints: number;
  public readonly maxMovementPoints: number;
  public readonly name: string;
  public readonly team: Team;
  public readonly speed: number;

  private readonly sprite: Sprite;
  private readonly spriteScale: number;
  private readonly positionProvider?: PositionProvider;
  private readonly spritePath: string;
  private selectionHighlight?: Graphics;
  private teamBorder?: Graphics;
  private activeGlow?: Graphics;
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
    spriteScale?: number;
    positionProvider?: PositionProvider;
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
    this.spriteScale = config.spriteScale ?? DEFAULT_SPRITE_SCALE;
    this.positionProvider = config.positionProvider;
    this.spritePath = config.spritePath;

    this.createSelectionHighlight();
    this.createTeamBorder();
    this.createActiveGlow();
    this.updateSpritePosition();

    this.sprite = Sprite.from(this.spritePath);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.spriteScale);
    this.addChild(this.sprite);
  }

  public setPosition(hexPosition: HexCoordinates): void {
    this.hexPosition = hexPosition;
    this.updateSpritePosition();
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
    this.selectionHighlight!.visible = isSelected;
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public setActiveTurn(isActive: boolean): void {
    this.activeTurn = isActive;
    this.activeGlow!.visible = isActive;
  }

  public isActiveTurn(): boolean {
    return this.activeTurn;
  }

  private updateSpritePosition(): void {
    if (this.positionProvider) {
      const pixel = this.positionProvider.getCenteredHexPosition(
        this.hexPosition,
      );
      this.position.set(pixel.x, pixel.y);
    }
  }

  private createSelectionHighlight(): void {
    this.selectionHighlight = createOutline(0.9, 4, Colors.SELECTED_CHARACTER);
    this.selectionHighlight.visible = false;
    this.addChild(this.selectionHighlight);
  }

  private createTeamBorder(): void {
    this.teamBorder = createOutline(
      0.95,
      3,
      this.team === Team.TeamA ? Colors.PLAYER : Colors.ENEMY,
    );
    this.addChild(this.teamBorder);
  }

  private createActiveGlow(): void {
    this.activeGlow = createOutline(1.1, 5, Colors.ACTIVE_CHARACTER);
    this.activeGlow.visible = false;
    this.addChild(this.activeGlow);
  }
}
