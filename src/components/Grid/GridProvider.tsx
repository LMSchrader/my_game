import type { ReactNode } from 'react'
import { useState } from 'react'
import { GridContext } from './contexts/GridContext'
import type { HexCoord, Tile } from '../../types/grid'
import { generateRectangularGrid, hexDistance, hexKey } from '../../utils/hexUtils'

interface GridProviderProps {
  children: ReactNode
  cols?: number
  rows?: number
}

export function GridProvider({ children, cols = 10, rows = 10 }: GridProviderProps) {
  const [tiles, setTiles] = useState<Map<string, Tile>>(() => {
    const tileMap = new Map<string, Tile>()
    const coords = generateRectangularGrid(cols, rows)
    coords.forEach((coord) => {
      tileMap.set(hexKey(coord), { coord, state: 'normal' })
    })
    return tileMap
  })

  const [hoveredTile, setHoveredTile] = useState<HexCoord | null>(null)
  const [selectedTile, setSelectedTile] = useState<HexCoord | null>(null)

  const getTile = (coord: HexCoord) => {
    return tiles.get(hexKey(coord))
  }

  const setTileState = (coord: HexCoord, state: Tile['state']) => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      const key = hexKey(coord)
      const existing = newTiles.get(key)
      if (existing) {
        newTiles.set(key, { ...existing, state })
      }
      return newTiles
    })
  }

  const resetTileStates = () => {
    setTiles((prev) => {
      const newTiles = new Map(prev)
      prev.forEach((tile, key) => {
        newTiles.set(key, { ...tile, state: 'normal' })
      })
      return newTiles
    })
  }

  const isNeighbor = (a: HexCoord, b: HexCoord) => {
    return hexDistance(a, b) === 1
  }

  const getNeighbors = (coord: HexCoord) => {
    return Array.from(tiles.values())
      .filter((tile) => isNeighbor(coord, tile.coord))
      .map((tile) => tile.coord)
  }

  return (
    <GridContext.Provider
      value={{
        tiles,
        hoveredTile,
        selectedTile,
        setHoveredTile,
        setSelectedTile,
        getTile,
        setTileState,
        resetTileStates,
        isNeighbor,
        getNeighbors
      }}
    >
      {children}
    </GridContext.Provider>
  )
}