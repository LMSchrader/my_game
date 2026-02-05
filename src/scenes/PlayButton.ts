import { Container, Text, Graphics } from 'pixi.js'

export class PlayButton extends Container {
  private buttonGraphics: Graphics
  private buttonText: Text
  private readonly buttonWidth: number = 200
  private readonly buttonHeight: number = 60
  private readonly buttonColor: number = 0x4ade80
  private readonly hoverColor: number = 0x22c55e
  private readonly strokeColor: number = 0xffffff
  private readonly textColor: number = 0xffffff
  private onClick: (() => void) | null = null

  constructor(onClick: () => void) {
    super()
    this.onClick = onClick

    this.buttonGraphics = new Graphics()
    this.addChild(this.buttonGraphics)

    this.buttonText = new Text({
      text: 'PLAY',
      style: {
        fontSize: 28,
        fill: this.textColor,
        fontWeight: 'bold',
        align: 'center',
      },
    })
    this.buttonText.anchor.set(0.5)
    this.buttonText.resolution = window.devicePixelRatio || 1
    this.addChild(this.buttonText)

    this.setupButton()
    this.setupEventListeners()
  }

  private setupButton(): void {
    this.drawButton(this.buttonColor)
    this.centerText()
  }

  private drawButton(color: number): void {
    this.buttonGraphics.clear()
    this.buttonGraphics.rect(-this.buttonWidth / 2, -this.buttonHeight / 2, this.buttonWidth, this.buttonHeight)
    this.buttonGraphics.fill(color)
    this.buttonGraphics.stroke({ width: 3, color: this.strokeColor })
  }

  private centerText(): void {
    this.buttonText.x = 0
    this.buttonText.y = 0
  }

  private setupEventListeners(): void {
    this.buttonGraphics.eventMode = 'static'
    this.buttonGraphics.cursor = 'pointer'

    this.buttonGraphics.on('pointerover', () => {
      this.drawButton(this.hoverColor)
    })

    this.buttonGraphics.on('pointerout', () => {
      this.drawButton(this.buttonColor)
    })

    this.buttonGraphics.on('pointerdown', () => {
      this.handleClick()
    })
  }

  private handleClick(): void {
    if (this.onClick) {
      this.onClick()
    }
  }
}