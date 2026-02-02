import { createContext } from 'react'
import type { HexCoord, Tile, Unit } from '../../../types/grid'

interface GridContextType {
  tiles: Map<string, Tile>
  units: Map<string, Unit>
  hoveredTile: HexCoord | null
  selectedTile: HexCoord | null
  selectedUnit: Unit | null
  setHoveredTile: (coord: HexCoord | null) => void
  setSelectedTile: (coord: HexCoord | null) => void
  setSelectedUnit: (unit: Unit | null) => void
  getTile: (coord: HexCoord) => Tile | undefined
  setTileState: (coord: HexCoord, state: Tile['state']) => void
  resetTileStates: () => void
  isNeighbor: (a: HexCoord, b: HexCoord) => boolean
  getNeighbors: (coord: HexCoord) => HexCoord[]
  addUnit: (unit: Unit, coord: HexCoord) => void
  moveUnit: (unitId: string, fromCoord: HexCoord, toCoord: HexCoord) => void
  removeUnit: (unitId: string) => void
  selectUnit: (unitId: string) => void
  showMovementRange: (unit: Unit) => void
  showAttackRange: (unit: Unit, coord: HexCoord) => void
  executeStrengthAttack: (attacker: Unit, defenderId: string) => void
  executeBreakAttack: (attacker: Unit, defenderId: string) => void
  deselectUnit: () => void
}

export const GridContext = createContext<GridContextType | null>(null)