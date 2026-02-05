import { type HexCoordinates } from '../../grid/types/grid.ts'
import { type Character } from '../../character/types/character.ts'

export type GridBoundsChecker = (hex: HexCoordinates) => boolean

export interface AIMoveDecision {
  character: Character
  targetHex: HexCoordinates
}