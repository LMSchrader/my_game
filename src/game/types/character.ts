import { type HexCoordinates } from "./grid.ts";

export const TeamValues = {
  TeamA: "TeamA",
  TeamB: "TeamB",
} as const;

export type Team = (typeof TeamValues)[keyof typeof TeamValues];

export const Team = TeamValues;

export interface Character {
  id: string;
  hexPosition: HexCoordinates;
  movementPoints: number;
  maxMovementPoints: number;
  name: string;
  team: Team;
  speed: number;
  spritePath: string;
  setPosition(hexPosition: HexCoordinates): void;
  move(hexPosition: HexCoordinates): void;
  resetMovementPoints(): void;
  hasEnoughMovementPoints(points: number): boolean;
  setSelected(isSelected: boolean): void;
  isSelected(): boolean;
  setActiveTurn(isActive: boolean): void;
  isActiveTurn(): boolean;
}
