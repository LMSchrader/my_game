import { type Character } from "../../character/types/character.ts";

export type TurnQueue = Character[];

export interface TurnState {
  turnQueue: TurnQueue;
  currentTurnIndex: number;
}

export type TurnEvent = "turnStart" | "turnEnd" | "turnOrderInitialized";
