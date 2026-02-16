import { type HexGridConfig } from "../game/HexGridModel.ts";

export const i18n = {
  GAME_TITLE: "My Game",
  PLAY: "Play",
  END_TURN: "End Turn",
};

export const FONTSIZE_BIG: number = 64;
export const FONTSIZE_MEDIUM: number = 32;
export const FONTSIZE_SMALL: number = 12;

export const TEXT_COLOR_WHITE: number = 0xffffff;

export const HEX_SIZE: number = 40;
export const DEFAULT_GRID_CONFIG: HexGridConfig = {
  rows: 8,
  cols: 8,
};

export const DEFAULT_MOVEMENT_POINTS: number = 2;
export const DEFAULT_SPRITE_SCALE: number = 0.5;
export const DEFAULT_SPEED: number = 5;

export const Colors = {
  PLAYER: 0x3b82f6,
  ENEMY: 0xef4444,
  ACTIVE_CHARACTER: 0xffffff,
  SELECTED_CHARACTER: 0xffd700,
  TILE_FILL: 0x4a5568,
  TILE_STROKE: 0x718096,
  TILE_HIGHLIGHT: 0x4ade80,
} as const;

export const SpritePaths = {
  CHARACTER: "character.png",
  ENEMY: "enemy.png",
  BACKGROUND: "background.png",
} as const;
