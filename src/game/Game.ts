import { EventEmitter } from "pixi.js";
import { type Character, Team } from "./types/character.ts";
import { type HexCoordinates } from "./types/grid.ts";
import { TurnManager } from "./TurnManager.ts";
import { HexGridModel, type HexGridConfig } from "./HexGridModel.ts";
import { InteractionHandler } from "./InteractionHandler.ts";
import { AIController } from "./AIController.ts";
import type { GridBoundsChecker } from "./types/ai.ts";
import { loadCharacters } from "../utils/characterLoader.ts";

export type GameEvent = "characterSelected" | "characterDeselected";

export class Game extends EventEmitter {
  public readonly turnManager: TurnManager;
  public readonly hexGridModel: HexGridModel;
  public readonly interactionHandler: InteractionHandler;
  private readonly characters: Map<string, Character> = new Map();
  private selectedCharacterId?: string;

  public constructor(gridConfig: HexGridConfig) {
    super();
    this.hexGridModel = new HexGridModel(gridConfig);
    this.turnManager = new TurnManager(this);
    this.interactionHandler = new InteractionHandler(this);

    const gridBoundsChecker: GridBoundsChecker = (hex) =>
      this.hexGridModel.isHexInGrid(hex);
    new AIController(this, gridBoundsChecker);
  }

  public async start(): Promise<void> {
    const characterModels = await loadCharacters();
    characterModels.forEach((model) => {
      this.addCharacter(model);
    });

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
    const selectedCharacter = this.characters.get(characterId);
    if (selectedCharacter) {
      this.selectedCharacterId = characterId;
      this.emit("characterSelected", selectedCharacter);
    }
  }

  public deselectCharacter(): void {
    this.selectedCharacterId = undefined;
    this.emit("characterDeselected");
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
