import { type Character, Team } from "./types/character.ts";
import { type HexCoordinates } from "./types/grid.ts";
import { TurnManager } from "./TurnManager.ts";

export class Game {
  public readonly turnManager: TurnManager;
  private readonly characters: Map<string, Character> = new Map();
  private selectedCharacterId?: string;

  public constructor() {
    this.turnManager = new TurnManager(this);
  }

  public start(): void {
    this.turnManager.initializeTurnOrder(this.getAllCharacters());
  }

  public addCharacter(character: Character): void {
    this.characters.set(character.id, character);
  }

  public removeCharacter(characterId: string): void {
    this.characters.delete(characterId);
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
    return this.characters.get(this.selectedCharacterId);
  }

  public isCharacterPlayable(character: Character): boolean {
    return this.isActiveCharacter(character) && this.isPlayerTeam(character);
  }

  private isActiveCharacter(character: Character): boolean {
    const activeCharacter = this.turnManager.getActiveCharacter();
    return activeCharacter?.id === character.id;
  }

  private isPlayerTeam(character: Character): boolean {
    return character.team === Team.TeamA;
  }
}
