import type { HexCoordinates } from "./types/grid.ts";
import type { TileData } from "./types/tile.ts";
import { hexToKey } from "../utils/hexGridUtils.ts";

export interface HexGridConfig {
  rows: number;
  cols: number;
}

export class HexGridModel {
  private readonly tiles: Map<string, TileData> = new Map();
  private readonly config: HexGridConfig;

  constructor(config: HexGridConfig) {
    this.config = config;
    this.initialize();
  }

  public initialize(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const hex: HexCoordinates = this.offsetToAxial(col, row);
        const tileData: TileData = {
          coordinates: hex,
        };
        this.tiles.set(hexToKey(hex), tileData);
      }
    }
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

  public forEachTiles(callback: (tile: TileData) => void): void {
    this.tiles.forEach((tile) => {
      callback(tile);
    });
  }
}
