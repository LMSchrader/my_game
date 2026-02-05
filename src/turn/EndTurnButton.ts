import { Container, Text, Graphics } from 'pixi.js'
import { TurnManager } from './TurnManager.ts'
import { logger } from '../utils/logger.ts'

export class EndTurnButton extends Container {
  private buttonGraphics: Graphics
  private buttonText: Text
  private turnManager: TurnManager
  private readonly buttonWidth: number = 200
  private readonly buttonHeight: number = 60
  private readonly buttonColor: number = 0x10b981
  private readonly hoverColor: number = 0x059669
  private readonly disabledColor: number = 0x6b7280
  private enabled: boolean = true

  constructor(turnManager: TurnManager) {
    super()
    this.turnManager = turnManager

    this.buttonGraphics = new Graphics()
    this.addChild(this.buttonGraphics)

    this.buttonText = new Text({
      text: 'End Turn',
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: 'bold' as const,
      },
    })
    this.buttonText.anchor.set(0.5)
    this.addChild(this.buttonText)

    this.setupButton()
    this.setupEventListeners()
    this.updateButtonState()
  }

  private setupButton(): void {
    this.drawButton(this.enabled ? this.buttonColor : this.disabledColor)
    this.centerText()
  }

  private drawButton(color: number): void {
    this.buttonGraphics.clear()
    this.buttonGraphics.roundRect(0, 0, this.buttonWidth, this.buttonHeight, 12)
    this.buttonGraphics.fill(color)
    this.buttonGraphics.stroke({ width: 3, color: 0xffffff })
  }

  private centerText(): void {
    this.buttonText.x = this.buttonWidth / 2
    this.buttonText.y = this.buttonHeight / 2
  }

  private setupEventListeners(): void {
    this.buttonGraphics.eventMode = 'static'

    this.buttonGraphics.on('pointerover', () => {
      if (this.enabled) {
        this.drawButton(this.hoverColor)
      }
    })

    this.buttonGraphics.on('pointerout', () => {
      if (this.enabled) {
        this.drawButton(this.buttonColor)
      }
    })

    this.buttonGraphics.on('pointerdown', () => {
      if (this.enabled) {
        this.handleClick()
      }
    })
  }

  private handleClick(): void {
    logger.debug('End Turn button clicked')
    this.turnManager.endTurn()
  }

  public updateButtonState(): void {
    const isPlayerTurn = this.turnManager.isPlayerTurn()
    this.enabled = isPlayerTurn

    this.buttonGraphics.cursor = this.enabled ? 'pointer' : 'default'
    this.drawButton(this.enabled ? this.buttonColor : this.disabledColor)

    this.buttonText.alpha = this.enabled ? 1 : 0.5
  }
}