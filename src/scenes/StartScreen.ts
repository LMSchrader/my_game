import { Container, Sprite, Text } from "pixi.js";
import { type Scene } from "./types/scene.ts";
import {
  FONTSIZE_BIG,
  i18n,
  SpritePaths,
  TEXT_COLOR_WHITE,
} from "../config/config.ts";
import { FancyButton } from "@pixi/ui";
import { center, scaleToFullSize } from "../utils/uiUtils.ts";
import { sceneManager } from "./SceneManager.ts";
import { GenericButton } from "../ui/utils/GenericButton.ts";
import { GameScene } from "./GameScene.ts";

export class StartScreen extends Container implements Scene {
  public static readonly assetBundles = ["common"];

  private readonly background: Sprite;
  private readonly titleText: Text;
  private readonly playButton: FancyButton;

  constructor() {
    super();
    this.background = Sprite.from(SpritePaths.BACKGROUND);
    this.addChild(this.background);

    this.titleText = new Text({
      text: i18n.GAME_TITLE,
      style: {
        fontSize: FONTSIZE_BIG,
        fill: TEXT_COLOR_WHITE,
        fontWeight: "bold",
        align: "center",
      },
    });

    this.addChild(this.titleText);

    this.playButton = new GenericButton({ text: i18n.PLAY });

    this.playButton.onPress.connect(() => sceneManager.switchScene(GameScene));
    this.addChild(this.playButton);
  }

  public async onEnter(): Promise<void> {}

  public async onExit(): Promise<void> {
    this.destroy({
      children: true,
      texture: false,
    });
  }

  public onResize(width: number, height: number): void {
    center(this, width, height);

    this.background.x = 0;
    this.background.y = 0;
    this.background.anchor.set(0.5);
    scaleToFullSize(this.background, width, height);

    this.titleText.y = -150;
    this.titleText.anchor.set(0.5);
    this.titleText.resolution = window.devicePixelRatio || 1;
  }
}
