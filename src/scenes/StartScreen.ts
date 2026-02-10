import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { type Scene, SceneType } from "./types/scene.ts";
import { logger } from "../utils/logger.ts";
import { SceneManager } from "./SceneManager.ts";
import {
  FONTSIZE_BIG,
  FONTSIZE_MEDIUM,
  GAME_TITLE,
  PLAY,
  TEXT_COLOR_WHITE,
} from "../config/config.ts";
import { FancyButton } from "@pixi/ui";
import { center, scaleToFullSize } from "../utils/uiUtils.ts";

const BACKGROUND_PATH: string = "/background.png";

export class StartScreen extends Container implements Scene {
  public readonly type: SceneType = SceneType.START;

  private readonly sceneManager: SceneManager;
  private background: Sprite | undefined;
  private titleText: Text | undefined;
  private playButton: FancyButton | undefined;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  public async onEnter(): Promise<void> {
    await this.loadBackground();
    this.createTitle();
    this.createPlayButton();
  }

  public async onExit(): Promise<void> {
    this.destroy({
      children: true,
      texture: false,
    });
  }

  public onResize(width: number, height: number): void {
    center(this, width, height);
    scaleToFullSize(this.background!, width, height);
  }

  private async loadBackground(): Promise<void> {
    try {
      const texture = await Assets.load(BACKGROUND_PATH);
      this.background = new Sprite(texture);
      this.background.anchor.set(0.5);
      this.background.x = 0;
      this.background.y = 0;
      this.addChild(this.background);
    } catch (error) {
      logger.error("Failed to load Start screen background:", error);
    }
  }

  private createTitle(): void {
    this.titleText = new Text({
      text: GAME_TITLE,
      style: {
        fontSize: FONTSIZE_BIG,
        fill: TEXT_COLOR_WHITE,
        fontWeight: "bold",
        align: "center",
      },
    });
    this.titleText.y = -150;
    this.titleText.anchor.set(0.5);
    this.titleText.resolution = window.devicePixelRatio || 1;
    this.addChild(this.titleText);
  }

  private createPlayButton(): void {
    const defaultView: Graphics = new Graphics()
      .roundRect(0, 0, 200, 60, 10)
      .fill(0x3b82f6);
    const hoverView: Graphics = new Graphics()
      .roundRect(0, 0, 200, 60, 10)
      .fill(0x60a5fa);

    const buttonText: Text = new Text({
      text: PLAY,
      style: {
        fontSize: FONTSIZE_MEDIUM,
        fill: TEXT_COLOR_WHITE,
        fontWeight: "bold",
        align: "center",
      },
    });

    this.playButton = new FancyButton({
      text: buttonText,
      defaultView,
      hoverView,
      anchor: 0.5,
    });

    this.playButton.onPress.connect(() =>
      this.sceneManager.switchScene(SceneType.GAME),
    );
    this.addChild(this.playButton);
  }
}
