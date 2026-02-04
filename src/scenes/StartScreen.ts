import { Container, Text, Assets, Graphics, Sprite } from 'pixi.js'
import { type Scene, SceneType } from './types/scene.ts'

const GAME_TITLE: string = 'My Game'
const BACKGROUND_PATH: string = '/background.png'
const BUTTON_TEXT: string = 'PLAY'
const BUTTON_WIDTH: number = 200
const BUTTON_HEIGHT: number = 60
const BUTTON_COLOR: number = 0x4ade80
const BUTTON_HOVER_COLOR: number = 0x22c55e
const BUTTON_STROKE_COLOR: number = 0xffffff
const BUTTON_TEXT_COLOR: number = 0xffffff
const TITLE_COLOR: number = 0xffffff
const TITLE_SIZE: number = 64
const TITLE_Y_OFFSET: number = -150
const BUTTON_Y_OFFSET: number = 50

export class StartScreen extends Container implements Scene {
  public readonly type: SceneType = SceneType.START

  private background: Sprite | null = null
  private titleText: Text | null = null
  private playButton: Graphics | null = null
  private buttonText: Text | null = null
  private onPlayClick: (() => void) | null = null

  constructor(onPlayClick: () => void) {
    super()
    this.onPlayClick = onPlayClick
    this.setupEventListeners()
    this.x = window.innerWidth / 2
    this.y = window.innerHeight / 2
  }

  private setupEventListeners(): void {
    this.eventMode = 'static'
  }

  public async onEnter(): Promise<void> {
    this.x = window.innerWidth / 2
    this.y = window.innerHeight / 2
    await this.loadBackground()
    this.createTitle()
    this.createPlayButton()
    this.centerElements()
  }

  public async onExit(): Promise<void> {
    this.cleanup()
  }

  public onResize(width: number, height: number): void {
    this.x = width / 2
    this.y = height / 2

    if (this.background) {
      const scale = Math.max(width / this.background.width, height / this.background.height)
      this.background.scale.set(scale)
    }
    this.centerElements()
  }

  private async loadBackground(): Promise<void> {
    try {
      const texture = await Assets.load(BACKGROUND_PATH)
      this.background = new Sprite(texture)
      this.background.anchor.set(0.5)
      this.background.x = 0
      this.background.y = 0
      this.addChildAt(this.background, 0)
    } catch (error) {
      console.error('Failed to load background:', error)
    }
  }

  private createTitle(): void {
    this.titleText = new Text({
      text: GAME_TITLE,
      style: {
        fontSize: TITLE_SIZE,
        fill: TITLE_COLOR,
        fontWeight: 'bold',
        align: 'center',
      },
    })
    this.titleText.anchor.set(0.5)
    this.titleText.resolution = window.devicePixelRatio || 1
    this.addChild(this.titleText)
  }

  private createPlayButton(): void {
    const button: Graphics = new Graphics()
    button.rect(-BUTTON_WIDTH / 2, -BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT)
    button.fill(BUTTON_COLOR)
    button.stroke({ width: 3, color: BUTTON_STROKE_COLOR })
    button.eventMode = 'static'
    button.cursor = 'pointer'

    button.on('pointerdown', this.handlePlayButtonClick.bind(this))
    button.on('pointerover', this.handleButtonHover.bind(this))
    button.on('pointerout', this.handleButtonOut.bind(this))

    this.playButton = button
    this.addChild(button)

    this.buttonText = new Text({
      text: BUTTON_TEXT,
      style: {
        fontSize: 28,
        fill: BUTTON_TEXT_COLOR,
        fontWeight: 'bold',
        align: 'center',
      },
    })
    this.buttonText.anchor.set(0.5)
    this.buttonText.resolution = window.devicePixelRatio || 1
    this.buttonText.eventMode = 'none'
    button.addChild(this.buttonText)
  }

  private handlePlayButtonClick(): void {
    if (this.onPlayClick) {
      this.onPlayClick()
    }
  }

  private handleButtonHover(): void {
    if (this.playButton) {
      this.playButton.clear()
      this.playButton.rect(-BUTTON_WIDTH / 2, -BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT)
      this.playButton.fill(BUTTON_HOVER_COLOR)
      this.playButton.stroke({ width: 3, color: BUTTON_STROKE_COLOR })
    }
  }

  private handleButtonOut(): void {
    if (this.playButton) {
      this.playButton.clear()
      this.playButton.rect(-BUTTON_WIDTH / 2, -BUTTON_HEIGHT / 2, BUTTON_WIDTH, BUTTON_HEIGHT)
      this.playButton.fill(BUTTON_COLOR)
      this.playButton.stroke({ width: 3, color: BUTTON_STROKE_COLOR })
    }
  }

  private centerElements(): void {
    if (this.titleText) {
      this.titleText.y = TITLE_Y_OFFSET
    }
    if (this.playButton) {
      this.playButton.y = BUTTON_Y_OFFSET
    }
  }

  private cleanup(): void {
    if (this.background) {
      this.removeChild(this.background)
      this.background.destroy()
      this.background = null
    }
    if (this.titleText) {
      this.removeChild(this.titleText)
      this.titleText.destroy()
      this.titleText = null
    }
    if (this.playButton) {
      this.removeChild(this.playButton)
      this.playButton.destroy()
      this.playButton = null
    }
    this.buttonText = null
  }
}