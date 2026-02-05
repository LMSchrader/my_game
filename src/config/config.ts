import { type HexGridConfig } from '../grid/HexGrid.ts'

export const HEX_SIZE: number = 40
export const HIGHLIGHT_OVERLAY_SIZE: number = HEX_SIZE - 2
export const DEFAULT_GRID_CONFIG: HexGridConfig = {
  rows: 8,
  cols: 8,
}

export const DEFAULT_MOVEMENT_POINTS: number = 5
export const DEFAULT_SPRITE_SCALE: number = 0.5
export const DEFAULT_SPEED: number = 5

export const Colors = {
  SELECTED: 0xffd700,
  ENEMY: 0xff0000,
  CHARACTER_DEFAULT: 0xffffff,
  TILE_FILL: 0x4a5568,
  TILE_STROKE: 0x718096,
  HIGHLIGHT: 0x4ade80,
} as const

export const SpritePaths = {
  CHARACTER: '/character.png',
  ENEMY: '/enemy.png',
} as const