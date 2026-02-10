import { type Character } from "./character.ts";

export type TurnQueue = Character[];

export type TurnEvent = "turnStart" | "turnEnd" | "turnOrderInitialized";
