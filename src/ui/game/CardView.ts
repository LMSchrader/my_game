import { Container, Graphics, Text } from "pixi.js";
import {
  FONTSIZE_SMALL,
  TEXT_COLOR_WHITE,
  Colors,
} from "../../config/config.ts";
import type { Card } from "../../game/types/card.ts";

export class CardView extends Container {
  private readonly card: Card;
  private readonly background: Graphics;
  private readonly cardName: Text;
  private readonly cardDescription: Text;
  private readonly cardWidth: number = 120;
  private readonly cardHeight: number = 160;
  private isHovered: boolean = false;

  public constructor(card: Card) {
    super();
    this.card = card;
    this.background = new Graphics();
    this.cardName = new Text({
      text: card.name,
      style: { fontSize: 16, fill: TEXT_COLOR_WHITE },
    });
    this.cardDescription = new Text({
      text: card.description,
      style: {
        fontSize: FONTSIZE_SMALL,
        fill: TEXT_COLOR_WHITE,
        wordWrap: true,
        wordWrapWidth: this.cardWidth - 20,
      },
    });

    this.setupCard();
    this.setupInteractions();
  }

  private setupCard(): void {
    this.background.rect(0, 0, this.cardWidth, this.cardHeight);
    this.background.fill(0x4a5568);
    this.background.stroke({ width: 2, color: 0x718096 });
    this.background.eventMode = "static";

    this.cardName.x = 10;
    this.cardName.y = 10;

    this.cardDescription.x = 10;
    this.cardDescription.y = 40;

    this.addChild(this.background, this.cardName, this.cardDescription);
  }

  private setupInteractions(): void {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", this.handleHover.bind(this));
    this.on("pointerout", this.handleHoverEnd.bind(this));
    this.on("pointerdown", this.handleClick.bind(this));
  }

  private handleHover(): void {
    if (this.isHovered) {
      return;
    }
    this.isHovered = true;
    this.background.clear();
    this.background.rect(0, 0, this.cardWidth, this.cardHeight);
    this.background.fill(Colors.SELECTED_CHARACTER);
    this.background.stroke({ width: 2, color: TEXT_COLOR_WHITE });
  }

  private handleHoverEnd(): void {
    if (!this.isHovered) {
      return;
    }
    this.isHovered = false;
    this.background.clear();
    this.background.rect(0, 0, this.cardWidth, this.cardHeight);
    this.background.fill(0x4a5568);
    this.background.stroke({ width: 2, color: 0x718096 });
  }

  private handleClick(): void {
    this.emit("cardSelected", this.card);
  }
}
