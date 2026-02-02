import type { Tile } from '../../types/grid'
import { hexToPixel } from '../../utils/hexUtils'
import './HexGrid.css'

interface TileProps {
  tile: Tile
  gridOffset: { centerX: number; centerY: number }
  onClick: (tile: Tile) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

function TileComponent({ tile, gridOffset, onClick, onMouseEnter, onMouseLeave }: TileProps) {
  const { x, y } = hexToPixel(tile.coord)
  const hexSize = 40
  const hexWidth = hexSize * Math.sqrt(3)
  const hexHeight = hexSize * 2

  const finalX = x - gridOffset.centerX - hexWidth / 2
  const finalY = y - gridOffset.centerY - hexHeight / 2

  const getStateClass = () => {
    return `hex--${tile.state}`
  }

  const getTeamClass = () => {
    if (tile.unit?.team === 'player') return 'unit--player'
    if (tile.unit?.team === 'enemy') return 'unit--enemy'
    return ''
  }

  return (
    <div
      className={`hex ${getStateClass()}`}
      style={{
        '--hex-width': `${hexWidth}px`,
        '--hex-height': `${hexHeight}px`,
        left: `${finalX}px`,
        top: `${finalY}px`
      } as React.CSSProperties}
      onClick={() => onClick(tile)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {tile.unit && (
        <div className={`unit ${getTeamClass()}`}>
          {tile.unit.name}
          <div className="unit-stats">
            <span className="unit-stat">STR: {tile.unit.strength}</span>
            {tile.unit.armor > 0 && <span className="unit-stat">ARM: {tile.unit.armor}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

export default TileComponent