import { type Character } from '../character/types/character.ts'
import { type TurnQueue } from '../turn/types/turn.ts'

export function calculateTurnOrder(characters: Character[]): TurnQueue {
  const sortedCharacters = [...characters].sort((a, b) => b.speed - a.speed)
  return sortedCharacters
}