import { type HexCoordinates } from "./grid.ts";
import { type Character } from "./character.ts";

export type GridBoundsChecker = (hex: HexCoordinates) => boolean;

export interface AIMoveDecision {
  character: Character;
  targetHex: HexCoordinates;
}
