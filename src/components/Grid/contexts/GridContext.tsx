import { createContext } from 'react'
import type { HexCoord, Tile } from '../../../types/grid'

interface GridContextType {
  tiles: Map<string, Tile>
  hoveredTile: HexCoord | null
  selectedTile: HexCoord | null
  setHoveredTile: (coord: HexCoord | null) => void
  setSelectedTile: (coord: HexCoord | null) => void
  getTile: (coord: HexCoord) => Tile | undefined
  setTileState: (coord: HexCoord, state: Tile['state']) => void
  resetTileStates: () => void
  isNeighbor: (a: HexCoord, b: HexCoord) => boolean
  getNeighbors: (coord: HexCoord) => HexCoord[]
}

export const GridContext = createContext<GridContextType | null>(null)