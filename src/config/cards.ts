import type { Card } from "../game/types/card.ts";
import { SpritePaths } from "./config.ts";

export const DEFAULT_CARDS: Card[] = [
  {
    id: "attack-basic",
    name: "Attack",
    description: "Deal damage to a target.",
    spritePath: SpritePaths.CARD_BASE,
  },
  {
    id: "defend-basic",
    name: "Defend",
    description: "Gain protection from attacks.",
    spritePath: SpritePaths.CARD_BASE,
  },
  {
    id: "heal-basic",
    name: "Heal",
    description: "Restore health to a target.",
    spritePath: SpritePaths.CARD_BASE,
  },
  {
    id: "move-fast",
    name: "Quick Move",
    description: "Move additional tiles.",
    spritePath: SpritePaths.CARD_BASE,
  },
  {
    id: "shield-basic",
    name: "Shield",
    description: "Block incoming damage.",
    spritePath: SpritePaths.CARD_BASE,
  },
];
