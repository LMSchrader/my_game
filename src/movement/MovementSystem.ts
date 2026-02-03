import { type HexCoordinates } from '../types/grid.ts'
import { type Character } from '../types/character.ts'
import { getHexDistance } from '../utils/hexGridUtils.ts'

export function getMovementRange(
  origin: HexCoordinates,
  movementPoints: number
): HexCoordinates[] {
  const tiles: HexCoordinates[] = []
  const range: number = movementPoints

  for (let q = -range; q <= range; q++) {
    for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
      const hex: HexCoordinates = { q: origin.q + q, r: origin.r + r }
      if (getHexDistance(origin, hex) <= movementPoints) {
        tiles.push(hex)
      }
    }
  }

  return tiles
}

export function filterOccupiedTiles(
  tiles: HexCoordinates[],
  characters: Character[]
): HexCoordinates[] {
  const occupiedPositions = new Set<string>()

  characters.forEach((character) => {
    const key: string = `${character.hexPosition.q},${character.hexPosition.r}`
    occupiedPositions.add(key)
  })

  return tiles.filter((tile) => {
    const key: string = `${tile.q},${tile.r}`
    return !occupiedPositions.has(key)
  })
}

export function filterGridBounds(
  tiles: HexCoordinates[],
  isInGrid: (hex: HexCoordinates) => boolean
): HexCoordinates[] {
  return tiles.filter((tile) => isInGrid(tile))
}

export function getValidMovementTiles(
  origin: HexCoordinates,
  movementPoints: number,
  characters: Character[],
  isInGrid?: (hex: HexCoordinates) => boolean
): HexCoordinates[] {
  let validTiles: HexCoordinates[] = getMovementRange(origin, movementPoints)

  if (isInGrid) {
    validTiles = filterGridBounds(validTiles, isInGrid)
  }

  return filterOccupiedTiles(validTiles, characters)
}

export function hexToKey(hex: HexCoordinates): string {
  return `${hex.q},${hex.r}`
}

export function keyToHex(key: string): HexCoordinates {
  const parts = key.split(',')
  return { q: parseInt(parts[0], 10), r: parseInt(parts[1], 10) }
}