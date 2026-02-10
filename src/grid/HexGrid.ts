import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { type HexCoordinates, type PixelCoordinates } from "./types/grid.ts";
import {
  getHexCorners,
  hexToKey,
  hexToPixel,
  pixelToHex,
} from "../utils/hexGridUtils.ts";
import { Colors, DEFAULT_GRID_CONFIG, HEX_SIZE } from "../config/config.ts";

export interface HexGridConfig {
  rows: number;
  cols: number;
}

export class HexGrid extends Container {
  private readonly tiles: Map<string, Graphics> = new Map();
  private readonly highlights: Map<string, Graphics> = new Map();
  private onClick: ((hex: HexCoordinates) => void) | undefined;
  private readonly config: HexGridConfig;
  private centerX: number = 0;
  private centerY: number = 0;

  constructor(config: HexGridConfig = DEFAULT_GRID_CONFIG) {
    super();
    this.config = config;
    this.setupEventListeners();
    this.renderGrid();
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

    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const hex: HexCoordinates = this.offsetToAxial(col, row);
        const pixel: PixelCoordinates = hexToPixel(hex);
        minX = Math.min(minX, pixel.x);
        maxX = Math.max(maxX, pixel.x);
        minY = Math.min(minY, pixel.y);
        maxY = Math.max(maxY, pixel.y);
        tilePositions.set(hexToKey(hex), pixel);
      }
    }

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

  private offsetToAxial(col: number, row: number): HexCoordinates {
    const q: number = col - (row - (row & 1)) / 2;
    const r: number = row;
    return { q, r };
  }

  private axialToOffset(q: number, r: number): { col: number; row: number } {
    const col: number = q + (r - (r & 1)) / 2;
    return { col, row: r };
  }

  public isHexInGrid(hex: HexCoordinates): boolean {
    const offset: { col: number; row: number } = this.axialToOffset(
      hex.q,
      hex.r,
    );
    return (
      offset.col >= 0 &&
      offset.col < this.config.cols &&
      offset.row >= 0 &&
      offset.row < this.config.rows
    );
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

  public getTile(hex: HexCoordinates): Graphics | undefined {
    const key: string = hexToKey(hex);
    return this.tiles.get(key) ?? undefined;
  }

  public highlightTiles(
    hexes: HexCoordinates[],
    color: number = Colors.TILE_HIGHLIGHT,
  ): void {
    this.clearHighlights();

    hexes.forEach((hex) => {
      if (this.isHexInGrid(hex)) {
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

  public isTileHighlighted(hex: HexCoordinates): boolean {
    return this.highlights.has(hexToKey(hex));
  }
}
