import {
  type HexCoordinates,
  type PixelCoordinates,
} from "../grid/types/grid.ts";
import { HEX_SIZE } from "../config/config.ts";
import { Graphics } from "pixi.js";

export const SQRT3: number = Math.sqrt(3);

export function hexToPixel(hex: HexCoordinates): PixelCoordinates {
  const x: number = HEX_SIZE * (SQRT3 * hex.q + (SQRT3 / 2) * hex.r);
  const y: number = HEX_SIZE * (3 / 2) * hex.r;
  return { x, y };
}

export function pixelToHex(pixel: PixelCoordinates): HexCoordinates {
  const q: number =
    ((Math.sqrt(3) / 3) * pixel.x - (1 / 3) * pixel.y) / HEX_SIZE;
  const r: number = ((2 / 3) * pixel.y) / HEX_SIZE;
  return hexRound({ q, r });
}

export function hexRound(fracHex: HexCoordinates): HexCoordinates {
  let q: number = Math.round(fracHex.q);
  let r: number = Math.round(fracHex.r);
  const s: number = Math.round(-fracHex.q - fracHex.r);

  const qDiff: number = Math.abs(q - fracHex.q);
  const rDiff: number = Math.abs(r - fracHex.r);
  const sDiff: number = Math.abs(s - (-fracHex.q - fracHex.r));

  if (qDiff > rDiff && qDiff > sDiff) {
    q = -r - s;
  } else if (rDiff > sDiff) {
    r = -q - s;
  }

  return { q, r };
}

export function getHexDistance(a: HexCoordinates, b: HexCoordinates): number {
  return (
    (Math.abs(a.q - b.q) +
      Math.abs(a.q + a.r - b.q - b.r) +
      Math.abs(a.r - b.r)) /
    2
  );
}

export function getNeighbors(hex: HexCoordinates): HexCoordinates[] {
  const directions: HexCoordinates[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  return directions.map((direction) => ({
    q: hex.q + direction.q,
    r: hex.r + direction.r,
  }));
}

export function getHexCorner(
  center: PixelCoordinates,
  size: number,
  i: number,
): PixelCoordinates {
  const angleDegrees: number = 30 + 60 * i;
  const angleRadians: number = (Math.PI / 180) * angleDegrees;
  return {
    x: center.x + size * Math.cos(angleRadians),
    y: center.y + size * Math.sin(angleRadians),
  };
}

export function getHexCorners(
  center: PixelCoordinates,
  size: number,
): PixelCoordinates[] {
  const corners: PixelCoordinates[] = [];
  for (let i = 0; i < 6; i++) {
    corners.push(getHexCorner(center, size, i));
  }
  return corners;
}

export function hexToKey(hex: HexCoordinates): string {
  return `${hex.q},${hex.r}`;
}

export function keyToHex(key: string): HexCoordinates {
  const parts: string[] = key.split(",");
  return { q: Number.parseInt(parts[0], 10), r: Number.parseInt(parts[1], 10) };
}

export function createOutline(
  sizeMultiplier: number,
  width: number,
  color: number,
): Graphics {
  const outline = new Graphics();
  const corners: PixelCoordinates[] = getHexCorners(
    { x: 0, y: 0 },
    HEX_SIZE * sizeMultiplier,
  );
  outline.moveTo(corners[0].x, corners[0].y);

  for (let i = 1; i < corners.length; i++) {
    outline.lineTo(corners[i].x, corners[i].y);
  }

  outline.closePath();
  outline.stroke({ width: width, color: color, alpha: 0.8 });
  return outline;
}
