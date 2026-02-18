import { Container, Sprite } from "pixi.js";
import { type Scene } from "./types/scene.ts";
import { CharacterModel } from "../game/CharacterModel.ts";
import { CharacterView } from "../ui/game/CharacterView.ts";
import { i18n, SpritePaths, DEFAULT_GRID_CONFIG } from "../config/config.ts";
import { TurnOrderDisplay } from "../ui/game/TurnOrderDisplay.ts";
import { center, scaleToFullSize } from "../utils/uiUtils.ts";
import { FancyButton } from "@pixi/ui";
import { GenericButton } from "../ui/utils/GenericButton.ts";
import { Game } from "../game/Game.ts";
import { HexGridView } from "../ui/game/HexGridView.ts";
import { CardHand } from "../ui/game/CardHand.ts";

export class GameScene extends Container implements Scene {
  public static readonly assetBundles = ["common", "characters", "cards"];

  private readonly game: Game;
  private readonly background: Sprite;
  private readonly grid: HexGridView;
  private readonly endTurnButton: FancyButton;
  private readonly turnOrderDisplay: TurnOrderDisplay;
  private readonly cardHand: CardHand;

  constructor() {
    super();

    this.game = new Game(DEFAULT_GRID_CONFIG);

    this.background = Sprite.from(SpritePaths.BACKGROUND);
    this.addChild(this.background);
    this.background.eventMode = "static";
    this.background.on("pointerdown", () => this.game.deselectCharacter());

    this.grid = new HexGridView(this.game);
    this.addChild(this.grid);

    this.turnOrderDisplay = new TurnOrderDisplay(this.game.turnManager);
    this.addChild(this.turnOrderDisplay);

    this.cardHand = new CardHand(this.game.turnManager);
    this.addChild(this.cardHand);

    this.endTurnButton = new GenericButton({ text: i18n.END_TURN });
    this.endTurnButton.onPress.connect(() => this.game.turnManager.endTurn());
    this.addChild(this.endTurnButton);
    this.game.turnManager.on("turnStart", () => {
      this.updateButtonState();
    });

    this.game.start().then(() => {
      this.initializeCharacterViews();
    });
  }

  onEnter(): Promise<void> | void {}

  public async onExit(): Promise<void> {
    this.destroy({
      children: true,
      texture: false,
    });
  }

  public onResize(width: number, height: number): void {
    center(this.background, width, height);
    this.background.anchor.set(0.5);
    scaleToFullSize(this.background, width, height);

    center(this.grid, width, height);

    this.endTurnButton.x = width - 125;
    this.endTurnButton.y = height - 50;

    this.turnOrderDisplay.x = 20;
    this.turnOrderDisplay.y = 20;

    this.cardHand.x = width / 2;
    this.cardHand.y = height - 180;
  }

  private initializeCharacterViews(): void {
    const characters = this.game.getAllCharacters();

    characters.forEach((model) => {
      const view = new CharacterView({
        model: model as CharacterModel,
        spriteScale: 5,
        positionProvider: this.grid,
        game: this.game,
      });
      this.grid.addChild(view);
    });
  }

  public updateButtonState(): void {
    this.endTurnButton.enabled = this.game.turnManager.isPlayerTurn();
  }
}
