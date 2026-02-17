import type { Card } from "../game/types/card.ts";

export const DEFAULT_CARDS: Card[] = [
  {
    id: "attack-basic",
    name: "Attack",
    description: "Deal damage to a target.",
  },
  {
    id: "defend-basic",
    name: "Defend",
    description: "Gain protection from attacks.",
  },
  {
    id: "heal-basic",
    name: "Heal",
    description: "Restore health to a target.",
  },
  {
    id: "move-fast",
    name: "Quick Move",
    description: "Move additional tiles.",
  },
  {
    id: "shield-basic",
    name: "Shield",
    description: "Block incoming damage.",
  },
];
