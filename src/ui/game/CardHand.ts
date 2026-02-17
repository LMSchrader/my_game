import { Container } from "pixi.js";
import { CardView } from "./CardView.ts";
import type { Card } from "../../game/types/card.ts";
import type { TurnManager } from "../../game/TurnManager.ts";
import { CharacterModel } from "../../game/CharacterModel.ts";
import { Team } from "../../game/types/character.ts";

export class CardHand extends Container {
  private readonly cardViews: CardView[] = [];
  private readonly cardSpacing: number = 10;
  private readonly cardWidth: number = 120;
  private readonly turnManager: TurnManager;

  public constructor(turnManager: TurnManager) {
    super();
    this.turnManager = turnManager;
    this.setupTurnEventListeners();
  }

  private setupTurnEventListeners(): void {
    this.turnManager.on("cardsDrawn", this.handleCardsDrawn);
    this.turnManager.on("cardsReturned", () => this.clearHand());
  }

  private handleCardsDrawn = (
    character: CharacterModel,
    cards: Card[],
  ): void => {
    if (character.team === Team.TeamA) {
      this.updateCards(cards);
    }
  };

  public updateCards(cards: Card[]): void {
    this.clearHand();

    cards.forEach((card, index) => {
      const cardView = new CardView(card);
      cardView.x = index * (this.cardWidth + this.cardSpacing);
      cardView.on("cardSelected", this.handleCardSelected);
      this.cardViews.push(cardView);
      this.addChild(cardView);
    });

    this.centerHand();
  }

  public clearHand(): void {
    for (const cardView of this.cardViews) {
      cardView.off("cardSelected", this.handleCardSelected);
      this.removeChild(cardView);
    }
    this.cardViews.length = 0;
  }

  private centerHand(): void {
    if (this.cardViews.length === 0) {
      return;
    }

    const totalWidth =
      this.cardViews.length * this.cardWidth +
      (this.cardViews.length - 1) * this.cardSpacing;
    const offsetX = -totalWidth / 2;

    this.cardViews.forEach((cardView, index) => {
      cardView.x = offsetX + index * (this.cardWidth + this.cardSpacing);
    });
  }

  private handleCardSelected = (card: Card): void => {
    this.emit("cardSelected", card);
  };
}
