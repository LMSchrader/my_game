import { Container, Sprite, Assets, Graphics } from 'pixi.js'
import { type Character } from '../types/character.ts'
import { type HexCoordinates, type PixelCoordinates } from '../types/grid.ts'
import { hexToPixel, getHexCorners } from '../utils/hexGridUtils.ts'
import { HEX_SIZE, DEFAULT_MOVEMENT_POINTS, DEFAULT_SPRITE_SCALE, Colors } from '../config/config.ts'

export interface PositionProvider {
  getCenteredHexPosition: (hex: HexCoordinates) => PixelCoordinates
}

export class CharacterEntity extends Container implements Character {
  public readonly id: string
  public hexPosition: HexCoordinates
  public movementPoints: number
  public readonly maxMovementPoints: number
  public readonly color: number
  public readonly name: string

  private sprite: Sprite | null = null
  private readonly spriteScale: number
  private positionProvider: PositionProvider | null = null
  private readonly spritePath: string
  private selectionHighlight: Graphics | null = null
  private _isSelected: boolean = false

  constructor(config: {
    id: string
    hexPosition?: HexCoordinates
    movementPoints?: number
    maxMovementPoints?: number
    color?: number
    name?: string
    spriteScale?: number
    positionProvider?: PositionProvider
    spritePath: string
  }) {
    super()
    this.id = config.id
    this.hexPosition = config.hexPosition ?? { q: 0, r: 0 }
    this.movementPoints = config.movementPoints ?? DEFAULT_MOVEMENT_POINTS
    this.maxMovementPoints = config.maxMovementPoints ?? this.movementPoints
    this.color = config.color ?? 0xffffff
    this.name = config.name ?? `Character ${this.id}`
    this.spriteScale = config.spriteScale ?? DEFAULT_SPRITE_SCALE
    this.positionProvider = config.positionProvider ?? null
    this.spritePath = config.spritePath

    this.initSprite()
    this.createSelectionHighlight()
    this.updateSpritePosition()
  }

  private async initSprite(): Promise<void> {
    try {
      const texture = await Assets.load(this.spritePath)
      this.sprite = new Sprite(texture)
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(this.spriteScale)
      this.sprite.tint = this.color
      this.addChild(this.sprite)
    } catch (error) {
      console.error(`Failed to load sprite for character ${this.id}:`, error)
    }
  }

  public setPosition(hexPosition: HexCoordinates): void {
    this.hexPosition = hexPosition
    this.updateSpritePosition()
  }

  private updateSpritePosition(): void {
    const pixel: PixelCoordinates = this.positionProvider
      ? this.positionProvider.getCenteredHexPosition(this.hexPosition)
      : hexToPixel(this.hexPosition)
    this.position.set(pixel.x, pixel.y)
  }

  public setColor(color: number): void {
    if (this.sprite) {
      this.sprite.tint = color
    }
  }

  public useMovementPoints(points: number): void {
    this.movementPoints = Math.max(0, this.movementPoints - points)
  }

  public resetMovementPoints(): void {
    this.movementPoints = this.maxMovementPoints
  }

  public hasEnoughMovementPoints(points: number): boolean {
    return this.movementPoints >= points
  }

  private createSelectionHighlight(): void {
    this.selectionHighlight = new Graphics()
    this.selectionHighlight.visible = false
    this.addChildAt(this.selectionHighlight, 0)

    const corners: PixelCoordinates[] = getHexCorners({ x: 0, y: 0 }, HEX_SIZE * 0.9)
    this.selectionHighlight.moveTo(corners[0].x, corners[0].y)

    for (let i = 1; i < corners.length; i++) {
      this.selectionHighlight.lineTo(corners[i].x, corners[i].y)
    }

    this.selectionHighlight.closePath()
    this.selectionHighlight.stroke({ width: 4, color: Colors.SELECTED })
  }

  public setSelected(isSelected: boolean): void {
    this._isSelected = isSelected
    if (this.selectionHighlight) {
      this.selectionHighlight.visible = isSelected
    }
  }

  public isSelected(): boolean {
    return this._isSelected
  }
}