import { Container, Graphics, Sprite } from "pixi.js";
import { type CharacterModel } from "../../game/CharacterModel.ts";
import {
  type HexCoordinates,
  type PixelCoordinates,
} from "../../game/types/grid.ts";
import { createOutline } from "../../utils/hexGridUtils.ts";
import { Colors, DEFAULT_SPRITE_SCALE } from "../../config/config.ts";
import { type Game } from "../../game/Game.ts";

export interface PositionProvider {
  getCenteredHexPosition: (hex: HexCoordinates) => PixelCoordinates;
}

export class CharacterView extends Container {
  private readonly model: CharacterModel;
  private readonly spriteScale: number;
  private readonly positionProvider: PositionProvider;
  private readonly game: Game;

  private readonly sprite: Sprite;
  private selectionHighlight?: Graphics;
  private teamBorder?: Graphics;
  private activeGlow?: Graphics;

  constructor(config: {
    model: CharacterModel;
    game: Game;
    positionProvider: PositionProvider;
    spriteScale?: number;
  }) {
    super();
    this.model = config.model;
    this.positionProvider = config.positionProvider;
    this.game = config.game;
    this.spriteScale = config.spriteScale ?? DEFAULT_SPRITE_SCALE;

    this.createSelectionHighlight();
    this.createTeamBorder();
    this.createActiveGlow();

    this.sprite = Sprite.from(this.model.spritePath);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(this.spriteScale);
    this.addChild(this.sprite);

    this.updateSpritePosition();
    this.updateSelectionState();
    this.updateActiveTurnState();
    this.setupListeners();
  }

  private setupListeners(): void {
    this.model.on("positionChanged", () => this.updateSpritePosition());
    this.model.on("turnStateChanged", () => this.updateActiveTurnState());
    this.game.on("characterSelected", () => this.updateSelectionState());
    this.game.on("characterDeselected", () => this.updateSelectionState());
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
      const selectedCharacter = this.game.getSelectedCharacter();
      this.selectionHighlight.visible = selectedCharacter?.id === this.model.id;
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
