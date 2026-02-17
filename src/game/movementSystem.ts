import { type HexCoordinates } from "./types/grid.ts";
import { type Character } from "./types/character.ts";
import {
  getNeighbors,
  getHexDistance,
  hexToKey,
} from "../utils/hexGridUtils.ts";

export function getMovementRangeWithObstacles(
  origin: HexCoordinates,
  movementPoints: number,
  blockedTiles: Set<string>,
): HexCoordinates[] {
  const reachableTiles: HexCoordinates[] = [];
  const visited: Set<string> = new Set();
  const queue: { hex: HexCoordinates; cost: number }[] = [
    { hex: origin, cost: 0 },
  ];

  visited.add(hexToKey(origin));

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.cost > 0) {
      reachableTiles.push(current.hex);
    }

    if (current.cost < movementPoints) {
      const neighbors: HexCoordinates[] = getNeighbors(current.hex);

      for (const neighbor of neighbors) {
        const neighborKey: string = hexToKey(neighbor);

        if (!visited.has(neighborKey) && !blockedTiles.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push({ hex: neighbor, cost: current.cost + 1 });
        }
      }
    }
  }

  return reachableTiles;
}

export function filterGridBounds(
  tiles: HexCoordinates[],
  isInGrid: (hex: HexCoordinates) => boolean,
): HexCoordinates[] {
  return tiles.filter((tile) => isInGrid(tile));
}

export function getValidMovementTiles(
  origin: HexCoordinates,
  movementPoints: number,
  characters: Character[],
  isInGrid: (hex: HexCoordinates) => boolean,
): HexCoordinates[] {
  const occupiedPositions = new Set<string>();

  characters.forEach((character) => {
    occupiedPositions.add(hexToKey(character.hexPosition));
  });

  occupiedPositions.delete(hexToKey(origin));

  const validTiles: HexCoordinates[] = getMovementRangeWithObstacles(
    origin,
    movementPoints,
    occupiedPositions,
  );

  return filterGridBounds(validTiles, isInGrid);
}

export function isValidMove(
  origin: HexCoordinates,
  target: HexCoordinates,
  movementPoints: number,
  characters: Character[],
): boolean {
  const distance = getHexDistance(origin, target);
  if (distance > movementPoints) {
    return false;
  }

  const targetKey = hexToKey(target);
  const originKey = hexToKey(origin);

  for (const character of characters) {
    const charKey = hexToKey(character.hexPosition);
    if (charKey === targetKey && charKey !== originKey) {
      return false;
    }
  }

  return true;
}
