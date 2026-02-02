import { type HexCoordinates } from './grid.ts'

export interface Character {
  id: string
  position: HexCoordinates
  movementPoints: number
  maxMovementPoints: number
  color: number
  name: string
}