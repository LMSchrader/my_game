import { Container, Sprite, Assets, Graphics } from 'pixi.js'
import { type Character, Team } from './types/character.ts'
import { type HexCoordinates, type PixelCoordinates } from '../grid/types/grid.ts'
import { hexToPixel, getHexCorners } from '../utils/hexGridUtils.ts'
import { HEX_SIZE, DEFAULT_MOVEMENT_POINTS, DEFAULT_SPRITE_SCALE, DEFAULT_SPEED, Colors } from '../config/config.ts'
import { logger } from '../utils/logger.ts'

export { Team }

export interface PositionProvider {
  getCenteredHexPosition: (hex: HexCoordinates) => PixelCoordinates
}

export class CharacterEntity extends Container implements Character {
  public readonly id: string
  public hexPosition: HexCoordinates
  public movementPoints: number
  public readonly maxMovementPoints: number
  public readonly name: string
  public readonly team: Team
  public readonly speed: number

  private sprite: Sprite | null = null
  private readonly spriteScale: number
  private positionProvider: PositionProvider | null = null
  private readonly spritePath: string
  private selectionHighlight: Graphics | null = null
  private teamBorder: Graphics | null = null
  private activeGlow: Graphics | null = null
  private _isSelected: boolean = false
  private _isActiveTurn: boolean = false

  private constructor(config: {
    id: string
    hexPosition?: HexCoordinates
    movementPoints?: number
    maxMovementPoints?: number
    name?: string
    team?: Team
    speed?: number
    spriteScale?: number
    positionProvider?: PositionProvider
    spritePath: string
  }) {
    super()
    this.id = config.id
    this.hexPosition = config.hexPosition ?? { q: 0, r: 0 }
    this.movementPoints = config.movementPoints ?? DEFAULT_MOVEMENT_POINTS
    this.maxMovementPoints = config.maxMovementPoints ?? this.movementPoints
    this.name = config.name ?? `Character ${this.id}`
    this.team = config.team ?? Team.TeamA
    this.speed = config.speed ?? DEFAULT_SPEED
    this.spriteScale = config.spriteScale ?? DEFAULT_SPRITE_SCALE
    this.positionProvider = config.positionProvider ?? null
    this.spritePath = config.spritePath

    this.createSelectionHighlight()
    this.createTeamBorder()
    this.createActiveGlow()
    this.updateSpritePosition()
  }

  private async initSprite(): Promise<void> {
    try {
      const texture = await Assets.load(this.spritePath)
      this.sprite = new Sprite(texture)
      this.sprite.anchor.set(0.5)
      this.sprite.scale.set(this.spriteScale)
      this.addChild(this.sprite)
    } catch (error) {
      logger.error(`Failed to load sprite for character ${this.id}:`, error)
    }
  }

  public static async create(config: {
    id: string
    hexPosition?: HexCoordinates
    movementPoints?: number
    maxMovementPoints?: number
    name?: string
    team?: Team
    speed?: number
    spriteScale?: number
    positionProvider?: PositionProvider
    spritePath: string
  }): Promise<CharacterEntity> {
    const entity = new CharacterEntity(config)
    await entity.initSprite()
    return entity
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

  public useMovementPoints(): void {
    this.movementPoints = 0
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

  private createTeamBorder(): void {
    this.teamBorder = new Graphics()
    this.addChildAt(this.teamBorder, 0)

    const corners: PixelCoordinates[] = getHexCorners({ x: 0, y: 0 }, HEX_SIZE * 0.95)
    this.teamBorder.moveTo(corners[0].x, corners[0].y)

    for (let i = 1; i < corners.length; i++) {
      this.teamBorder.lineTo(corners[i].x, corners[i].y)
    }

    this.teamBorder.closePath()

    const teamColor = this.team === Team.TeamA ? 0x3b82f6 : 0xef4444
    this.teamBorder.stroke({ width: 3, color: teamColor })
  }

  private createActiveGlow(): void {
    this.activeGlow = new Graphics()
    this.activeGlow.visible = false
    this.addChildAt(this.activeGlow, 0)

    const glowSize = HEX_SIZE * 1.1
    const corners: PixelCoordinates[] = getHexCorners({ x: 0, y: 0 }, glowSize)
    this.activeGlow.moveTo(corners[0].x, corners[0].y)

    for (let i = 1; i < corners.length; i++) {
      this.activeGlow.lineTo(corners[i].x, corners[i].y)
    }

    this.activeGlow.closePath()
    this.activeGlow.stroke({ width: 5, color: 0xffffff, alpha: 0.8 })
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

  public setActiveTurn(isActive: boolean): void {
    this._isActiveTurn = isActive
    if (this.activeGlow) {
      this.activeGlow.visible = isActive
    }
  }

  public isActiveTurn(): boolean {
    return this._isActiveTurn
  }
}