import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import type {
  HexCoordinates,
  PixelCoordinates,
} from "../../game/types/grid.ts";
import { type Character } from "../../game/types/character.ts";
import {
  getHexCorners,
  hexToKey,
  hexToPixel,
  pixelToHex,
} from "../../utils/hexGridUtils.ts";
import { Colors, HEX_SIZE } from "../../config/config.ts";
import type { HexGridModel } from "../../game/HexGridModel.ts";
import { getValidMovementTiles } from "../../game/movementSystem.ts";
import type { Game } from "../../game/Game.ts";

export class HexGridView extends Container {
  private readonly model: HexGridModel;
  private readonly game: Game;
  private readonly tiles: Map<string, Graphics> = new Map();
  private readonly highlights: Map<string, Graphics> = new Map();
  private onClick?: (hex: HexCoordinates) => void;
  private centerX: number = 0;
  private centerY: number = 0;

  constructor(model: HexGridModel, game: Game) {
    super();
    this.model = model;
    this.game = game;
    this.subscribeToGameEvents();
    this.setupEventListeners();
    this.renderGrid();
  }

  private subscribeToGameEvents(): void {
    this.game.on("characterSelected", (character: Character) => {
      this.showMovementRange(character);
    });

    this.game.on("characterDeselected", () => {
      this.clearHighlights();
    });

    this.game.turnManager.on("turnEnd", () => {
      this.clearHighlights();
    });
  }

  private setupEventListeners(): void {
    this.eventMode = "static";
    this.on("pointerdown", this.handleClick.bind(this));
  }

  public setOnClick(handler: (hex: HexCoordinates) => void): void {
    this.onClick = handler;
  }

  private handleClick(event: FederatedPointerEvent): void {
    const localPosition: PixelCoordinates = this.toLocal(event.global);
    const adjustedPosition: PixelCoordinates = {
      x: localPosition.x + this.centerX,
      y: localPosition.y + this.centerY,
    };
    const hex: HexCoordinates = pixelToHex(adjustedPosition);
    this.onClick?.(hex);
  }

  private renderGrid(): void {
    let minX: number = Infinity;
    let maxX: number = -Infinity;
    let minY: number = Infinity;
    let maxY: number = -Infinity;

    const tilePositions: Map<string, PixelCoordinates> = new Map();

    this.model.forEachTiles((tile) => {
      const hex: HexCoordinates = tile.coordinates;
      const pixel: PixelCoordinates = hexToPixel(hex);
      minX = Math.min(minX, pixel.x);
      maxX = Math.max(maxX, pixel.x);
      minY = Math.min(minY, pixel.y);
      maxY = Math.max(maxY, pixel.y);
      tilePositions.set(hexToKey(hex), pixel);
    });

    const centerX: number = (minX + maxX) / 2;
    const centerY: number = (minY + maxY) / 2;

    tilePositions.forEach((position, key) => {
      const pixel: PixelCoordinates = {
        x: position.x - centerX,
        y: position.y - centerY,
      };
      const tile: Graphics = this.createHexTile(pixel);
      this.addChild(tile);
      this.tiles.set(key, tile);
    });

    this.centerX = centerX;
    this.centerY = centerY;
  }

  public getCenteredHexPosition(hex: HexCoordinates): PixelCoordinates {
    const pixel: PixelCoordinates = hexToPixel(hex);
    return {
      x: pixel.x - this.centerX,
      y: pixel.y - this.centerY,
    };
  }

  private createHexTile(center: PixelCoordinates): Graphics {
    const graphics: Graphics = new Graphics();
    graphics.eventMode = "static";

    const corners: PixelCoordinates[] = getHexCorners(center, HEX_SIZE);
    graphics.moveTo(corners[0].x, corners[0].y);

    for (let i = 1; i < corners.length; i++) {
      graphics.lineTo(corners[i].x, corners[i].y);
    }

    graphics.closePath();
    graphics.fill(Colors.TILE_FILL);
    graphics.stroke({ width: 1, color: Colors.TILE_STROKE });

    return graphics;
  }

  public highlightTiles(
    hexes: HexCoordinates[],
    color: number = Colors.TILE_HIGHLIGHT,
  ): void {
    this.clearHighlights();

    hexes.forEach((hex) => {
      if (this.model.isHexInGrid(hex)) {
        const highlight: Graphics = this.createHighlightOverlay(hex, color);
        this.addChild(highlight);
        this.highlights.set(hexToKey(hex), highlight);
      }
    });
  }

  public clearHighlights(): void {
    this.highlights.forEach((highlight) => {
      this.removeChild(highlight);
      highlight.destroy();
    });
    this.highlights.clear();
  }

  private createHighlightOverlay(hex: HexCoordinates, color: number): Graphics {
    const highlight: Graphics = new Graphics();
    highlight.alpha = 0.4;
    highlight.eventMode = "none";

    const center: PixelCoordinates = this.getCenteredHexPosition(hex);
    const corners: PixelCoordinates[] = getHexCorners(center, HEX_SIZE - 2);

    highlight.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      highlight.lineTo(corners[i].x, corners[i].y);
    }
    highlight.closePath();
    highlight.fill(color);

    return highlight;
  }

  private showMovementRange(character: Character): void {
    const allCharacters = this.game.getAllCharacters();
    const movementTiles = getValidMovementTiles(
      character.hexPosition,
      character.movementPoints,
      allCharacters,
      (hex) => this.model.isHexInGrid(hex),
    );

    this.highlightTiles(movementTiles);
  }
}
