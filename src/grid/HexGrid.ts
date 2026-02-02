import { Container, Graphics, FederatedPointerEvent } from 'pixi.js'
import { type HexCoordinates, type PixelCoordinates } from '../types/grid.ts'
import {
  hexToPixel,
  getHexCorners,
  pixelToHex,
  HEX_SIZE,
} from '../utils/hexGridUtils.ts'

export interface HexGridConfig {
  rows: number
  cols: number
}

const DEFAULT_CONFIG: HexGridConfig = {
  rows: 8,
  cols: 8,
}

export class HexGrid extends Container {
  private tiles: Map<string, Graphics> = new Map()
  private onClick: ((hex: HexCoordinates) => void) | null = null
  private readonly config: HexGridConfig

  constructor(config: HexGridConfig = DEFAULT_CONFIG) {
    super()
    this.config = config
    this.setupEventListeners()
    this.renderGrid()
  }

  private setupEventListeners(): void {
    this.eventMode = 'static'
    this.on('pointerdown', this.handleClick.bind(this))
  }

  public setOnClick(handler: (hex: HexCoordinates) => void): void {
    this.onClick = handler
  }

  private handleClick(event: FederatedPointerEvent): void {
    const localPosition: PixelCoordinates = this.toLocal(event.global)
    const hex: HexCoordinates = pixelToHex(localPosition)
    this.onClick?.(hex)
  }

  private renderGrid(): void {
    let minX: number = Infinity
    let maxX: number = -Infinity
    let minY: number = Infinity
    let maxY: number = -Infinity

    const tilePositions: Map<string, PixelCoordinates> = new Map()

    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const hex: HexCoordinates = this.offsetToAxial(col, row)
        const pixel: PixelCoordinates = hexToPixel(hex)
        minX = Math.min(minX, pixel.x)
        maxX = Math.max(maxX, pixel.x)
        minY = Math.min(minY, pixel.y)
        maxY = Math.max(maxY, pixel.y)
        const key: string = `${hex.q},${hex.r}`
        tilePositions.set(key, pixel)
      }
    }

    const centerX: number = (minX + maxX) / 2
    const centerY: number = (minY + maxY) / 2

    tilePositions.forEach((position, key) => {
      const pixel: PixelCoordinates = {
        x: position.x - centerX,
        y: position.y - centerY,
      }
      const tile: Graphics = this.createHexTile(pixel)
      this.addChild(tile)
      this.tiles.set(key, tile)
    })
  }

  private offsetToAxial(col: number, row: number): HexCoordinates {
    const q: number = col - (row - (row & 1)) / 2
    const r: number = row
    return { q, r }
  }

  private createHexTile(center: PixelCoordinates): Graphics {
    const graphics: Graphics = new Graphics()
    graphics.eventMode = 'static'

    const corners: PixelCoordinates[] = getHexCorners(center, HEX_SIZE)
    graphics.moveTo(corners[0].x, corners[0].y)

    for (let i = 1; i < corners.length; i++) {
      graphics.lineTo(corners[i].x, corners[i].y)
    }

    graphics.closePath()
    graphics.fill(0x4a5568)
    graphics.stroke({ width: 1, color: 0x718096 })

    return graphics
  }

  public center(screenWidth: number, screenHeight: number): void {
    this.x = screenWidth / 2
    this.y = screenHeight / 2
  }
}