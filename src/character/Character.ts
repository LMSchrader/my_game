import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { type Character, Team } from "./types/character.ts";
import {
  type HexCoordinates,
  type PixelCoordinates,
} from "../grid/types/grid.ts";
import { createOutline, hexToPixel } from "../utils/hexGridUtils.ts";
import {
  Colors,
  DEFAULT_MOVEMENT_POINTS,
  DEFAULT_SPEED,
  DEFAULT_SPRITE_SCALE,
} from "../config/config.ts";
import { logger } from "../utils/logger.ts";

export { Team } from "./types/character.ts";

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

  private sprite: Sprite | undefined;
  private readonly spriteScale: number;
  private readonly positionProvider: PositionProvider | undefined;
  private readonly spritePath: string;
  private selectionHighlight: Graphics | undefined;
  private teamBorder: Graphics | undefined;
  private activeGlow: Graphics | undefined;
  private _isSelected: boolean = false;
  private _isActiveTurn: boolean = false;

  private constructor(config: {
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
    this.movementPoints = config.movementPoints ?? DEFAULT_MOVEMENT_POINTS;
    this.maxMovementPoints = config.maxMovementPoints ?? this.movementPoints;
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
  }

  public static async create(config: {
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
  }): Promise<CharacterEntity> {
    const entity = new CharacterEntity(config);
    await entity.initSprite();
    return entity;
  }

  private async initSprite(): Promise<void> {
    try {
      const texture = await Assets.load(this.spritePath);
      this.sprite = new Sprite(texture);
      this.sprite.anchor.set(0.5);
      this.sprite.scale.set(this.spriteScale);
      this.addChild(this.sprite);
    } catch (error) {
      logger.error(`Failed to load sprite for character ${this.id}:`, error);
    }
  }

  public setPosition(hexPosition: HexCoordinates): void {
    this.hexPosition = hexPosition;
    this.updateSpritePosition();
  }

  private updateSpritePosition(): void {
    const pixel: PixelCoordinates = this.positionProvider
      ? this.positionProvider.getCenteredHexPosition(this.hexPosition)
      : hexToPixel(this.hexPosition);
    this.position.set(pixel.x, pixel.y);
  }

  public useMovementPoints(): void {
    this.movementPoints = 0;
  }

  public resetMovementPoints(): void {
    this.movementPoints = this.maxMovementPoints;
  }

  public hasEnoughMovementPoints(points: number): boolean {
    return this.movementPoints >= points;
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
      this.team === Team.TeamA ? Colors.CHARACTER_DEFAULT : Colors.ENEMY,
    );
    this.addChild(this.teamBorder);
  }

  private createActiveGlow(): void {
    this.activeGlow = createOutline(1.1, 5, Colors.ACTIVE_CHARACTER);
    this.activeGlow.visible = false;
    this.addChild(this.activeGlow);
  }

  public setSelected(isSelected: boolean): void {
    this._isSelected = isSelected;
    this.selectionHighlight!.visible = isSelected;
  }

  public isSelected(): boolean {
    return this._isSelected;
  }

  public setActiveTurn(isActive: boolean): void {
    this._isActiveTurn = isActive;
    this.activeGlow!.visible = isActive;
  }

  public isActiveTurn(): boolean {
    return this._isActiveTurn;
  }
}
