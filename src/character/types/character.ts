import { type HexCoordinates } from '../../grid/types/grid.ts'

export interface Character {
  id: string
  hexPosition: HexCoordinates
  movementPoints: number
  maxMovementPoints: number
  name: string
  setPosition(hexPosition: HexCoordinates): void
  useMovementPoints(points: number): void
  resetMovementPoints(): void
  hasEnoughMovementPoints(points: number): boolean
  setSelected(isSelected: boolean): void
  isSelected(): boolean
}