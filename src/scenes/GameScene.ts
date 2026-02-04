import { Container } from 'pixi.js'
import { type Scene, SceneType } from './types/scene.ts'
import { HexGrid } from '../grid/HexGrid.ts'
import { CharacterEntity } from '../character/Character.ts'
import { GameState } from '../state/GameState.ts'
import { InteractionHandler } from '../interaction/InteractionHandler.ts'

export class GameScene extends Container implements Scene {
  public readonly type: SceneType = SceneType.GAME

  private hexGrid: HexGrid | null = null
  private gameState: GameState | null = null
  private interactionHandler: InteractionHandler | null = null
  private isInitialized: boolean = false

  public async onEnter(): Promise<void> {
    if (!this.isInitialized) {
      this.initializeGame()
      this.isInitialized = true
    }
  }

  public async onExit(): Promise<void> {
    if (this.interactionHandler) {
      this.hexGrid?.setOnClick(() => {})
      this.interactionHandler = null
    }

    if (this.gameState && this.hexGrid) {
      const grid: HexGrid = this.hexGrid
      const characters = this.gameState.getAllCharacters()
      characters.forEach((character) => {
        const characterEntity = character as unknown as CharacterEntity
        grid.removeChild(characterEntity)
        characterEntity.destroy()
      })
      this.gameState = null
    }

    if (this.hexGrid) {
      this.removeChild(this.hexGrid)
      this.hexGrid.destroy()
      this.hexGrid = null
    }
  }

  public onResize(width: number, height: number): void {
    if (this.hexGrid) {
      this.hexGrid.center(width, height)
    }
  }

  private initializeGame(): void {
    this.hexGrid = new HexGrid()
    this.addChild(this.hexGrid)

    this.gameState = new GameState()

    const character = new CharacterEntity({
      id: 'cat-1',
      hexPosition: { q: 0, r: 0 },
      name: 'Whiskers',
      color: 0xffd700,
      spriteScale: 5,
      positionProvider: this.hexGrid,
      spritePath: '/character.png',
    })
    this.hexGrid.addChild(character)
    this.gameState.addCharacter(character)

    const enemy = new CharacterEntity({
      id: 'enemy-1',
      hexPosition: { q: 2, r: 1 },
      name: 'Shadow Beast',
      color: 0xff0000,
      spriteScale: 5,
      positionProvider: this.hexGrid,
      spritePath: '/enemy.png',
    })
    this.hexGrid.addChild(enemy)
    this.gameState.addCharacter(enemy)

    if (this.hexGrid && this.gameState) {
      this.interactionHandler = new InteractionHandler(
        this.gameState,
        (hex) => this.hexGrid!.isHexInGrid(hex),
        (hexes, color) => this.hexGrid!.highlightTiles(hexes, color),
        (hex) => this.hexGrid!.isTileHighlighted(hex)
      )

      this.hexGrid.setOnClick((hex) => {
        this.interactionHandler!.handleHexClick(hex)
      })
    }
  }
}