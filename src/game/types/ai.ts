import { type HexCoordinates } from "./grid.ts";

export type GridBoundsChecker = (hex: HexCoordinates) => boolean;
