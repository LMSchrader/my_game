import { useMemo } from 'react'
import { useGrid } from '../../hooks/useGrid'
import { hexToPixel, hexKey } from '../../utils/hexUtils'
import TileComponent from './Tile'
import type { Tile } from '../../types/grid'
import './HexGrid.css'

function Grid() {
  const { tiles, selectedUnit, setHoveredTile, setSelectedTile, selectUnit, moveUnit, resetTileStates, setSelectedUnit, showAttackRange, executeStrengthAttack, deselectUnit } = useGrid()

  const { sortedTiles, gridOffset } = useMemo(() => {
    const tileArray = Array.from(tiles.values()).sort((a, b) => {
      if (a.coord.r !== b.coord.r) return a.coord.r - b.coord.r
      return a.coord.q - b.coord.q
    })

    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity

    tileArray.forEach((tile) => {
      const { x, y } = hexToPixel(tile.coord)
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)
    })

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    return {
      sortedTiles: tileArray,
      gridOffset: { centerX, centerY }
    }
  }, [tiles])

  const handleTileClick = (tile: Tile) => {
    const clickedTile = tiles.get(hexKey(tile.coord))
    if (!clickedTile) return

    if (clickedTile.state === 'move-target' && selectedUnit) {
      const unitTile = Array.from(tiles.values()).find((t) => t.unit?.id === selectedUnit.id)
      if (unitTile) {
        moveUnit(selectedUnit.id, unitTile.coord, tile.coord)
        showAttackRange(selectedUnit, tile.coord)
        setSelectedTile(tile.coord)
      }
    } else if (clickedTile.state === 'attack-target' && selectedUnit && clickedTile.unit) {
      executeStrengthAttack(selectedUnit, clickedTile.unit.id)
      deselectUnit()
    } else if (clickedTile.unit && clickedTile.unit.team === 'player') {
      if (!clickedTile.unit.hasActed) {
        selectUnit(clickedTile.unit.id)
        setSelectedTile(tile.coord)
      }
    } else {
      resetTileStates()
      setSelectedUnit(null)
      setSelectedTile(null)
    }
  }

  const handleTileHover = (coord: { q: number; r: number }) => {
    setHoveredTile(coord)
  }

  const handleTileLeave = () => {
    setHoveredTile(null)
  }

  return (
    <div className="hex-grid">
      {sortedTiles.map((tile) => (
        <TileComponent
          key={`${tile.coord.q},${tile.coord.r}`}
          tile={tile}
          gridOffset={gridOffset}
          onClick={() => handleTileClick(tile)}
          onMouseEnter={() => handleTileHover(tile.coord)}
          onMouseLeave={handleTileLeave}
        />
      ))}
    </div>
  )
}

export default Grid