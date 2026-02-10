import { type Character } from "../character/types/character.ts";
import { type HexCoordinates } from "../grid/types/grid.ts";

export class GameState {
  private static instance: GameState;
  private readonly characters: Map<string, Character> = new Map();
  private selectedCharacterId: string | undefined;

  private constructor() {}

  public static getInstance(): GameState {
    GameState.instance ??= new GameState();
    return GameState.instance;
  }

  public addCharacter(character: Character): void {
    this.characters.set(character.id, character);
  }

  public removeCharacter(characterId: string): void {
    this.characters.delete(characterId);
  }

  public getCharacter(characterId: string): Character | undefined {
    return this.characters.get(characterId);
  }

  public getAllCharacters(): Character[] {
    return Array.from(this.characters.values());
  }

  public getCharacterAtPosition(
    hexPosition: HexCoordinates,
  ): Character | undefined {
    const characters: Character[] = this.getAllCharacters();
    return characters.find(
      (character) =>
        character.hexPosition.q === hexPosition.q &&
        character.hexPosition.r === hexPosition.r,
    );
  }

  public selectCharacter(characterId: string): void {
    this.getSelectedCharacter()?.setSelected(false);

    const selectedCharacter = this.characters.get(characterId);
    if (selectedCharacter) {
      this.selectedCharacterId = characterId;
      selectedCharacter.setSelected(true);
    }
  }

  public deselectCharacter(): void {
    this.getSelectedCharacter()?.setSelected(false);
    this.selectedCharacterId = undefined;
  }

  public getSelectedCharacter(): Character | undefined {
    if (this.selectedCharacterId === undefined) {
      return undefined;
    }
    return this.getCharacter(this.selectedCharacterId);
  }

  public isCharacterSelected(): boolean {
    return this.selectedCharacterId !== undefined;
  }

  public resetAllMovementPoints(): void {
    this.characters.forEach((character) => {
      character.resetMovementPoints();
    });
  }
}
