import { Container, Graphics, Text } from "pixi.js";
import { type Character, Team } from "../../game/types/character.ts";
import {
  Colors,
  FONTSIZE_SMALL,
  TEXT_COLOR_WHITE,
} from "../../config/config.ts";
import type { TurnManager } from "../../game/TurnManager.ts";

export class TurnOrderDisplay extends Container {
  private readonly turnManager: TurnManager;
  private characters: Character[];
  private readonly characterCards: Map<string, Graphics> = new Map();
  private readonly characterTexts: Map<string, Text> = new Map();
  private readonly cardWidth: number = 180;
  private readonly cardHeight: number = 60;
  private readonly cardSpacing: number = 10;
  private readonly padding: number = 15;
  private readonly turnOrderInitializedHandler: () => void;
  private readonly turnStartHandler: (character: unknown) => void;

  constructor(turnManager: TurnManager) {
    super();
    this.characters = [];
    this.turnManager = turnManager;
    this.turnOrderInitializedHandler =
      this.handleTurnOrderInitialized.bind(this);
    this.turnStartHandler = this.handleTurnStart.bind(this);
    this.subscribeToTurnEvents();
  }

  public override destroy(options?: {
    children?: boolean;
    texture?: boolean;
    baseTexture?: boolean;
  }): void {
    this.unsubscribeFromTurnEvents();
    super.destroy(options);
  }

  private handleTurnOrderInitialized(): void {
    const turnQueue = this.turnManager.getTurnQueue();
    this.updateTurnOrder(turnQueue);
    const activeCharacter = this.turnManager.getActiveCharacter();
    this.setActiveCharacter(activeCharacter.id);
  }

  private handleTurnStart(character: unknown): void {
    const activeChar = character as Character;
    this.setActiveCharacter(activeChar.id);
  }

  public updateTurnOrder(characters: Character[]): void {
    this.characters = characters;
    this.clearDisplay();
    this.renderCards();
  }

  private clearDisplay(): void {
    this.characterCards.forEach((card) => {
      this.removeChild(card);
      card.destroy();
    });
    this.characterTexts.forEach((text) => {
      this.removeChild(text);
      text.destroy();
    });
    this.characterCards.clear();
    this.characterTexts.clear();
  }

  private renderCards(): void {
    this.characters.forEach((character, index) => {
      const card = this.createCard(character);
      const y = index * (this.cardHeight + this.cardSpacing);
      card.y = y;
      this.addChild(card);
      this.characterCards.set(character.id, card);

      const text = this.createCardText(character);
      text.y = y + this.padding;
      this.addChild(text);
      this.characterTexts.set(character.id, text);
    });
  }

  private createCard(character: Character): Graphics {
    const card = new Graphics();

    const teamColor =
      character.team === Team.TeamA ? Colors.PLAYER : Colors.ENEMY;

    card.roundRect(0, 0, this.cardWidth, this.cardHeight, 8);
    card.fill(teamColor);

    return card;
  }

  private createCardText(character: Character): Text {
    const style = {
      fontFamily: "Arial",
      fontSize: FONTSIZE_SMALL,
      fill: TEXT_COLOR_WHITE,
      fontWeight: "bold" as const,
    };

    const text = new Text({
      text: `${character.name} (SPD: ${character.speed})`,
      style,
    });

    text.x = this.padding;

    return text;
  }

  public setActiveCharacter(characterId: string): void {
    const activeCard = this.characterCards.get(characterId);
    if (activeCard) {
      activeCard.clear();
      activeCard.roundRect(0, 0, this.cardWidth, this.cardHeight, 8);
      activeCard.fill(0xffd700);
      activeCard.stroke({ width: 4, color: TEXT_COLOR_WHITE });
    }

    this.characterCards.forEach((card, id) => {
      if (id !== characterId) {
        const character = this.characters.find((c) => c.id === id);
        if (character) {
          card.clear();
          const teamColor =
            character.team === Team.TeamA ? Colors.PLAYER : Colors.ENEMY;
          card.roundRect(0, 0, this.cardWidth, this.cardHeight, 8);
          card.fill(teamColor);
          card.stroke({ width: 2, color: TEXT_COLOR_WHITE });
        }
      }
    });
  }

  private subscribeToTurnEvents(): void {
    this.turnManager.on(
      "turnOrderInitialized",
      this.turnOrderInitializedHandler,
    );
    this.turnManager.on("turnStart", this.turnStartHandler);
  }

  private unsubscribeFromTurnEvents(): void {
    this.turnManager.off(
      "turnOrderInitialized",
      this.turnOrderInitializedHandler,
    );
    this.turnManager.off("turnStart", this.turnStartHandler);
  }
}
