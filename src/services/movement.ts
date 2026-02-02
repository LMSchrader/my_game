import type { Unit, HexCoord, Tile } from '../types/grid'
import { hexDistance, hexKey, hexNeighbors } from '../utils/hexUtils'

interface MovementNode {
  coord: HexCoord
  distance: number
  path: HexCoord[]
}

export function getMoveRangeTiles(
  unit: Unit,
  tiles: Map<string, Tile>,
  blockedCoords: Set<string>
): string[] {
  if (unit.hasMoved) return []
  
  const unitCoord = { q: 0, r: 0 }
  const maxRange = unit.baseMove + Math.floor(unit.willpower / 2)
  
  const moveQueue: MovementNode[] = [
    { coord: unitCoord, distance: 0, path: [unitCoord] }
  ]
  
  const visited = new Set<string>()
  const validTiles: string[] = []
  
  visited.add(hexKey(unitCoord))
  
  while (moveQueue.length > 0) {
    const current = moveQueue.shift()!
    
    if (current.distance > 0 && !blockedCoords.has(hexKey(current.coord))) {
      validTiles.push(hexKey(current.coord))
    }
    
    if (current.distance >= maxRange) continue
    
    const neighbors = hexNeighbors(current.coord)
    
    for (const neighbor of neighbors) {
      const neighborKey = hexKey(neighbor)
      
      if (visited.has(neighborKey)) continue
      
      const neighborTile = tiles.get(neighborKey)
      if (!neighborTile) continue
      
      visited.add(neighborKey)
      
      moveQueue.push({
        coord: neighbor,
        distance: current.distance + 1,
        path: [...current.path, neighbor]
      })
    }
  }
  
  return validTiles
}

export function canMoveToTile(
  tile: Tile,
  validMoveTiles: Set<string>
): boolean {
  if (tile.unit) return false
  return validMoveTiles.has(hexKey(tile.coord))
}

export function moveUnit(
  unit: Unit,
  fromCoord: HexCoord,
  toCoord: HexCoord,
  useWillpower: boolean = false
): void {
  const distance = hexDistance(fromCoord, toCoord)
  
  if (distance > unit.baseMove && useWillpower && unit.willpower > 0) {
    const extraDistance = distance - unit.baseMove
    const willpowerCost = Math.ceil(extraDistance / 2)
    unit.willpower = Math.max(0, unit.willpower - willpowerCost)
  }
  
  unit.hasMoved = true
}