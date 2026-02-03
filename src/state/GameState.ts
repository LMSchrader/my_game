import { type Character } from '../types/character.ts'
import { type HexCoordinates } from '../types/grid.ts'
import { getHexDistance } from '../utils/hexGridUtils.ts'

export class GameState {
  private characters: Map<string, Character> = new Map()
  private selectedCharacterId: string | null = null

  public addCharacter(character: Character): void {
    this.characters.set(character.id, character)
  }

  public removeCharacter(characterId: string): void {
    this.characters.delete(characterId)
  }

  public getCharacter(characterId: string): Character | undefined {
    return this.characters.get(characterId)
  }

  public getAllCharacters(): Character[] {
    return Array.from(this.characters.values())
  }

  public getCharacterAtPosition(hexPosition: HexCoordinates): Character | undefined {
    const characters: Character[] = this.getAllCharacters()
    return characters.find((character) =>
      character.hexPosition.q === hexPosition.q && character.hexPosition.r === hexPosition.r
    )
  }

  public selectCharacter(characterId: string): void {
    if (this.characters.has(characterId)) {
      this.selectedCharacterId = characterId
    }
  }

  public deselectCharacter(): void {
    this.selectedCharacterId = null
  }

  public getSelectedCharacter(): Character | undefined {
    if (this.selectedCharacterId === null) {
      return undefined
    }
    return this.characters.get(this.selectedCharacterId)
  }

  public isCharacterSelected(): boolean {
    return this.selectedCharacterId !== null
  }

  public moveCharacter(characterId: string, newHexPosition: HexCoordinates): boolean {
    const character = this.characters.get(characterId)
    if (!character) {
      return false
    }

    const oldPosition = character.hexPosition
    const distance = getHexDistance(oldPosition, newHexPosition)

    if (distance > character.movementPoints) {
      return false
    }

    character.hexPosition = newHexPosition
    character.useMovementPoints(distance)
    return true
  }

  public resetAllMovementPoints(): void {
    this.characters.forEach((character) => {
      character.movementPoints = character.maxMovementPoints
    })
  }
}