import { useMemo } from 'react'
import { useGrid } from '../../hooks/useGrid'
import { hexToPixel } from '../../utils/hexUtils'
import Tile from './Tile'
import './HexGrid.css'

function Grid() {
  const { tiles, setHoveredTile, selectedTile, setSelectedTile } = useGrid()

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

  const handleTileClick = (coord: { q: number; r: number }) => {
    if (selectedTile && selectedTile.q === coord.q && selectedTile.r === coord.r) {
      setSelectedTile(null)
    } else {
      setSelectedTile(coord)
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
        <Tile
          key={`${tile.coord.q},${tile.coord.r}`}
          tile={tile}
          gridOffset={gridOffset}
          onClick={() => handleTileClick(tile.coord)}
          onMouseEnter={() => handleTileHover(tile.coord)}
          onMouseLeave={handleTileLeave}
        />
      ))}
    </div>
  )
}

export default Grid