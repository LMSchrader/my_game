import {type HexCoordinates} from '../grid/types/grid.ts'
import {type Character} from '../character/types/character.ts'
import {getHexDistance, hexToKey} from '../utils/hexGridUtils.ts'

export function getMovementRange(
    origin: HexCoordinates,
    movementPoints: number
): HexCoordinates[] {
    const tiles: HexCoordinates[] = []
    const range: number = movementPoints

    for (let q = -range; q <= range; q++) {
        for (let r = Math.max(-range, -q - range); r <= Math.min(range, -q + range); r++) {
            const hex: HexCoordinates = {q: origin.q + q, r: origin.r + r}
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
        occupiedPositions.add(hexToKey(character.hexPosition))
    })

    return tiles.filter((tile) => {
        return !occupiedPositions.has(hexToKey(tile))
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