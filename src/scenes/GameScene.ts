import { Container, Sprite } from "pixi.js";
import { type Scene } from "./types/scene.ts";
import { CharacterModel } from "../game/CharacterModel.ts";
import { CharacterView } from "../ui/game/CharacterView.ts";
import { i18n, SpritePaths, DEFAULT_GRID_CONFIG } from "../config/config.ts";
import { TurnOrderDisplay } from "../ui/game/TurnOrderDisplay.ts";
import { AIController } from "../game/AIController.ts";
import { center, scaleToFullSize } from "../utils/uiUtils.ts";
import { FancyButton } from "@pixi/ui";
import { GenericButton } from "../ui/utils/GenericButton.ts";
import { Game } from "../game/Game.ts";
import type { HexCoordinates } from "../game/types/grid.ts";
import { HexGridView } from "../ui/game/HexGridView.ts";
import { HexGridModel } from "../game/HexGridModel.ts";
import { InteractionHandler } from "../game/InteractionHandler.ts";
import { loadCharacters } from "../utils/characterLoader.ts";

export class GameScene extends Container implements Scene {
  public static readonly assetBundles = ["common", "game"];

  private readonly game: Game;
  private readonly interactionHandler: InteractionHandler;
  private readonly background: Sprite;
  private readonly grid: HexGridView;
  private readonly endTurnButton: FancyButton;
  private readonly turnOrderDisplay: TurnOrderDisplay;

  constructor() {
    super();

    this.game = new Game();

    this.background = Sprite.from(SpritePaths.BACKGROUND);
    this.addChild(this.background);

    const gridModel = new HexGridModel(DEFAULT_GRID_CONFIG);
    this.grid = new HexGridView(gridModel);
    this.addChild(this.grid);

    this.turnOrderDisplay = new TurnOrderDisplay(this.game.turnManager);
    this.addChild(this.turnOrderDisplay);

    this.endTurnButton = new GenericButton({ text: i18n.END_TURN });
    this.endTurnButton.onPress.connect(() => this.game.turnManager.endTurn());
    this.addChild(this.endTurnButton);

    this.interactionHandler = new InteractionHandler(this.game, this.grid);

    new AIController(this.game, (hex) => this.grid.isHexInGrid(hex));

    this.subscribeToClickEvents();
    this.subscribeToTurnEvents();

    this.initializeCharacters().then(() => {
      this.game.start();
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

    this.endTurnButton.x = width / 2;
    this.endTurnButton.y = height - 100;

    this.turnOrderDisplay.x = 20;
    this.turnOrderDisplay.y = 20;
  }

  private async initializeCharacters(): Promise<void> {
    const characterModels = await loadCharacters();
    const characterPositions: Record<string, HexCoordinates> = {
      "cat-1": { q: 0, r: 0 },
      "enemy-1": { q: 2, r: 1 },
    };

    characterModels.forEach((model) => {
      const hexPosition = characterPositions[model.id];
      if (hexPosition) {
        model.setPosition(hexPosition);
      }

      const view = new CharacterView({
        model,
        spriteScale: 5,
        positionProvider: this.grid,
      });
      this.addCharacter(model, view);
    });
  }

  private addCharacter(model: CharacterModel, view: CharacterView): void {
    this.grid.addChild(view);
    this.game.addCharacter(model);
  }

  private subscribeToClickEvents() {
    this.background.eventMode = "static";
    this.background.on("pointerdown", () =>
      this.interactionHandler.handleGlobalClick(),
    );

    this.grid.setOnClick((hex: HexCoordinates) => {
      this.interactionHandler.handleHexClick(hex);
    });
  }

  private subscribeToTurnEvents() {
    const turnManager = this.game.turnManager;
    turnManager.on("turnStart", () => {
      this.updateButtonState();
    });

    turnManager.on("turnEnd", () => {
      this.grid.clearHighlights();
      this.game.deselectCharacter();
    });
  }

  public updateButtonState(): void {
    this.endTurnButton.enabled = this.game.turnManager.isPlayerTurn();
  }
}
