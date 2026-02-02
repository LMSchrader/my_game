import type { HexCoord } from '../types/grid'

export const HEX_SIZE = 40

export function hexEqual(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r
}

export function hexAdd(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q + b.q, r: a.r + b.r }
}

export function hexSubtract(a: HexCoord, b: HexCoord): HexCoord {
  return { q: a.q - b.q, r: a.r - b.r }
}

export function hexScale(coord: HexCoord, factor: number): HexCoord {
  return { q: coord.q * factor, r: coord.r * factor }
}

export function hexNeighbor(coord: HexCoord, direction: number): HexCoord {
  const directions: HexCoord[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 }
  ]
  return hexAdd(coord, directions[direction])
}

export function hexNeighbors(coord: HexCoord): HexCoord[] {
  const directions: HexCoord[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 }
  ]
  return directions.map((dir) => hexAdd(coord, dir))
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2
}

export function hexToPixel(coord: HexCoord): { x: number; y: number } {
  const size = HEX_SIZE
  const x = size * Math.sqrt(3) * (coord.q + coord.r / 2)
  const y = size * (3 / 2) * coord.r
  return { x, y }
}

export function pixelToHex(x: number, y: number): HexCoord {
  const size = HEX_SIZE
  const q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / size
  const r = (2 / 3 * y) / size
  return hexRound({ q, r })
}

export function hexRound(coord: HexCoord): HexCoord {
  let q = Math.round(coord.q)
  let r = Math.round(coord.r)
  const s = Math.round(-coord.q - coord.r)

  const qDiff = Math.abs(q - coord.q)
  const rDiff = Math.abs(r - coord.r)
  const sDiff = Math.abs(s - (-coord.q - coord.r))

  if (qDiff > rDiff && qDiff > sDiff) {
    q = -r - s
  } else if (rDiff > sDiff) {
    r = -q - s
  }
  return { q, r }
}

export function generateHexGrid(radius: number): HexCoord[] {
  const hexes: HexCoord[] = []
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius)
    const r2 = Math.min(radius, -q + radius)
    for (let r = r1; r <= r2; r++) {
      hexes.push({ q, r })
    }
  }
  return hexes
}

export function generateRectangularGrid(cols: number, rows: number): HexCoord[] {
  const hexes: HexCoord[] = []
  for (let r = 0; r < rows; r++) {
    const r_offset = Math.floor(r / 2)
    for (let q = -r_offset; q < cols - r_offset; q++) {
      hexes.push({ q, r })
    }
  }
  return hexes
}

export function isValidHex(coord: HexCoord, radius: number): boolean {
  return hexDistance({ q: 0, r: 0 }, coord) <= radius
}

export function hexKey(coord: HexCoord): string {
  return `${coord.q},${coord.r}`
}

export function neighborCheck(a: HexCoord, b: HexCoord): boolean {
  return hexDistance(a, b) === 1
}