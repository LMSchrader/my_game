import { Container, Graphics, Sprite } from "pixi.js";
import { type CharacterModel } from "./CharacterModel.ts";
import { type HexCoordinates, type PixelCoordinates } from "../types/grid.ts";
import { createOutline } from "../../utils/hexGridUtils.ts";
import { Colors, DEFAULT_SPRITE_SCALE } from "../../config/config.ts";

export interface PositionProvider {
  getCenteredHexPosition: (hex: HexCoordinates) => PixelCoordinates;
}

export class CharacterView extends Container {
  private readonly model: CharacterModel;
  private readonly spriteScale: number;
  private readonly positionProvider?: PositionProvider;

  private readonly sprite: Sprite;
  private selectionHighlight?: Graphics;
  private teamBorder?: Graphics;
  private activeGlow?: Graphics;

  constructor(config: {
    model: CharacterModel;
    spriteScale?: number;
    positionProvider?: PositionProvider;
  }) {
    super();
    this.model = config.model;
    this.spriteScale = config.spriteScale ?? DEFAULT_SPRITE_SCALE;
    this.positionProvider = config.positionProvider;

    this.createSelectionHighlight();
    this.createTeamBorder();
    this.createActiveGlow();
    this.updateSpritePosition();

    this.sprite = Sprite.from(this.model.spritePath);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.spriteScale);
    this.addChild(this.sprite);

    this.syncWithModel();
    this.setupModelListeners();
  }

  private setupModelListeners(): void {
    this.model.on("positionChanged", () => this.updatePosition());
    this.model.on("selectionChanged", () => this.syncWithModel());
    this.model.on("turnStateChanged", () => this.syncWithModel());
  }

  private syncWithModel(): void {
    this.updateSelectionState();
    this.updateActiveTurnState();
  }

  public updatePosition(): void {
    this.updateSpritePosition();
  }

  private updateSpritePosition(): void {
    if (this.positionProvider) {
      const pixel = this.positionProvider.getCenteredHexPosition(
        this.model.hexPosition,
      );
      this.position.set(pixel.x, pixel.y);
    }
  }

  private updateSelectionState(): void {
    if (this.selectionHighlight) {
      this.selectionHighlight.visible = this.model.isSelected();
    }
  }

  private updateActiveTurnState(): void {
    if (this.activeGlow) {
      this.activeGlow.visible = this.model.isActiveTurn();
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
      this.model.team === "TeamA" ? Colors.PLAYER : Colors.ENEMY,
    );
    this.addChild(this.teamBorder);
  }

  private createActiveGlow(): void {
    this.activeGlow = createOutline(1.1, 5, Colors.ACTIVE_CHARACTER);
    this.activeGlow.visible = false;
    this.addChild(this.activeGlow);
  }
}
