import { Container, Sprite, Text } from "pixi.js";
import { FONTSIZE_SMALL, TEXT_COLOR_WHITE } from "../../config/config.ts";
import { app } from "../../main.ts";
import type { Card } from "../../game/types/card.ts";

export class CardView extends Container {
  private readonly card: Card;
  private readonly cardSprite: Sprite;
  private readonly cardName: Text;
  private readonly cardDescription: Text;
  private readonly cardWidth: number = 120;
  private readonly cardHeight: number = 160;
  private readonly hoverOffset: number = 20;
  private readonly animationSpeed: number = 0.2;

  private targetY: number = 0;
  private baseY: number = 0;
  private tickerCallback: (() => void) | null = null;

  public constructor(card: Card) {
    super();
    this.card = card;
    this.cardSprite = Sprite.from(card.spritePath);
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
    this.cardSprite.anchor.set(0, 0);
    this.cardSprite.width = this.cardWidth;
    this.cardSprite.height = this.cardHeight;
    this.cardSprite.eventMode = "static";

    this.cardName.anchor.set(0.5);
    this.cardName.x = this.cardWidth / 2;
    this.cardName.y = 25;

    this.cardDescription.anchor.set(0.5);
    this.cardDescription.x = this.cardWidth / 2;
    this.cardDescription.y = 55;

    this.addChild(this.cardSprite, this.cardName, this.cardDescription);

    this.baseY = this.y;
    this.targetY = this.y;
  }

  private setupInteractions(): void {
    this.eventMode = "static";
    this.cursor = "pointer";

    this.on("pointerover", this.handleHover.bind(this));
    this.on("pointerout", this.handleHoverEnd.bind(this));
    this.on("pointerdown", this.handleClick.bind(this));
  }

  private handleHover(): void {
    this.targetY = this.baseY - this.hoverOffset;
    this.startAnimation();
  }

  private startAnimation(): void {
    if (this.tickerCallback !== null) {
      return;
    }
    this.tickerCallback = (): void => {
      const diff = this.targetY - this.y;
      if (Math.abs(diff) < 0.5) {
        this.y = this.targetY;
        this.stopAnimation();
        return;
      }
      this.y += diff * this.animationSpeed;
    };
    app.ticker.add(this.tickerCallback);
  }

  private handleHoverEnd(): void {
    this.targetY = this.baseY;
    this.startAnimation();
  }

  private stopAnimation(): void {
    if (this.tickerCallback !== null) {
      app.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }
  }

  public override destroy(options?: import("pixi.js").DestroyOptions): void {
    this.stopAnimation();
    super.destroy(options);
  }

  private handleClick(): void {
    this.emit("cardSelected", this.card);
  }
}
