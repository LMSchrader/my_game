import {Assets, Container, Sprite} from 'pixi.js'
import { type Scene, SceneType } from './types/scene.ts'
import { HexGrid } from '../grid/HexGrid.ts'
import { CharacterEntity, Team } from '../character/Character.ts'
import { type Character } from '../character/types/character.ts'
import { GameState } from '../state/GameState.ts'
import { InteractionHandler } from '../interaction/InteractionHandler.ts'
import { SpritePaths } from '../config/config.ts'
import { TurnOrderDisplay } from '../turn/TurnOrderDisplay.ts'
import { TurnManager } from '../turn/TurnManager.ts'
import { EndTurnButton } from '../turn/EndTurnButton.ts'
import { logger } from '../utils/logger.ts'

const BACKGROUND_PATH: string = '/background.png'

export class GameScene extends Container implements Scene {
  public readonly type: SceneType = SceneType.GAME

  private background: Sprite | null = null
  private hexGrid: HexGrid | null = null
  private gameState: GameState | null = null
  private interactionHandler: InteractionHandler | null = null
  private turnOrderDisplay: TurnOrderDisplay | null = null
  private turnManager: TurnManager | null = null
  private endTurnButton: EndTurnButton | null = null
  private isInitialized: boolean = false

  public async onEnter(): Promise<void> {
    await this.loadBackground()
    if (!this.isInitialized) {
      await this.initializeGame()
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

    if (this.endTurnButton) {
      this.removeChild(this.endTurnButton)
      this.endTurnButton.destroy()
      this.endTurnButton = null
    }

    if (this.turnManager) {
      this.turnManager.reset()
      this.turnManager = null
    }

    if (this.turnOrderDisplay) {
      this.removeChild(this.turnOrderDisplay)
      this.turnOrderDisplay.destroy()
      this.turnOrderDisplay = null
    }

    if (this.hexGrid) {
      this.removeChild(this.hexGrid)
      this.hexGrid.destroy()
      this.hexGrid = null
    }
  }

  public onResize(width: number, height: number): void {
    if (this.background) {
      const scale = Math.max(width / this.background.width, height / this.background.height)
      this.background.scale.set(scale)
      this.background.x = width / 2
      this.background.y = height / 2
    }
    if (this.hexGrid) {
      this.hexGrid.center(width, height)
    }
    if (this.endTurnButton) {
      this.endTurnButton.x = width / 2 - 100
      this.endTurnButton.y = height - 100
    }
  }

  private async loadBackground(): Promise<void> {
    try {
      const texture = await Assets.load(BACKGROUND_PATH)
      this.background = new Sprite(texture)
      this.background.anchor.set(0.5)
      this.background.eventMode = 'static'
      this.addChildAt(this.background, 0)
      this.background.on('pointerdown', this.handleGlobalClick.bind(this))
    } catch (error) {
      logger.error('Failed to load background:', error)
    }
  }

  private async initializeGame(): Promise<void> {
    this.hexGrid = new HexGrid()
    this.addChild(this.hexGrid)

    this.gameState = new GameState()

    const character = await CharacterEntity.create({
      id: 'cat-1',
      hexPosition: { q: 0, r: 0 },
      name: 'Whiskers',
      team: Team.TeamA,
      speed: 6,
      spriteScale: 5,
      positionProvider: this.hexGrid,
      spritePath: SpritePaths.CHARACTER,
    })
    this.addCharacter(character)

    const enemy = await CharacterEntity.create({
      id: 'enemy-1',
      hexPosition: { q: 2, r: 1 },
      name: 'Shadow Beast',
      team: Team.TeamB,
      speed: 4,
      spriteScale: 5,
      positionProvider: this.hexGrid,
      spritePath: SpritePaths.ENEMY,
    })
    this.addCharacter(enemy)

    this.turnManager = TurnManager.getInstance()
    this.turnOrderDisplay = new TurnOrderDisplay()
    this.turnOrderDisplay.x = 20
    this.turnOrderDisplay.y = 20
    this.addChild(this.turnOrderDisplay)

    this.turnManager.on('turnOrderInitialized', () => {
      if (this.turnOrderDisplay) {
        const turnQueue = this.turnManager!.getTurnQueue()
        this.turnOrderDisplay.updateTurnOrder(turnQueue)
        const activeCharacter = this.turnManager!.getActiveCharacter()
        if (activeCharacter) {
          this.turnOrderDisplay.setActiveCharacter(activeCharacter.id)
        }
      }
    })

    const allCharacters = this.gameState.getAllCharacters()
    this.turnManager.initializeTurnOrder(allCharacters)

    this.turnManager.on('turnStart', (character: unknown) => {
      const activeChar = character as Character
      if (this.turnOrderDisplay && activeChar.id) {
        this.turnOrderDisplay.setActiveCharacter(activeChar.id)
      }
      this.gameState?.getAllCharacters().forEach((char) => {
        char.setActiveTurn(char.id === activeChar.id)
      })
      this.endTurnButton?.updateButtonState()
    })

    this.turnManager.on('movementPointsReset', (character: unknown) => {
      const char = character as Character
      logger.debug(`Movement points reset for ${char.name}: ${char.movementPoints}/${char.maxMovementPoints}`)
    })

    const activeCharacter = this.turnManager.getActiveCharacter()
    if (activeCharacter) {
      this.gameState?.getAllCharacters().forEach((char) => {
        char.setActiveTurn(char.id === activeCharacter.id)
      })
    }

    this.endTurnButton = new EndTurnButton(this.turnManager)
    this.endTurnButton.x = window.innerWidth / 2 - 100
    this.endTurnButton.y = window.innerHeight - 100
    this.addChild(this.endTurnButton)

    if (this.hexGrid && this.gameState && this.turnManager) {
      this.interactionHandler = new InteractionHandler(
        this.gameState,
        (hex) => this.hexGrid!.isHexInGrid(hex),
        (hexes, color) => this.hexGrid!.highlightTiles(hexes, color),
        (hex) => this.hexGrid!.isTileHighlighted(hex),
        this.turnManager
      )

      this.hexGrid.setOnClick((hex) => {
        this.interactionHandler!.handleHexClick(hex)
      })
    }
  }

  private addCharacter(character: CharacterEntity): void {
    this.hexGrid!.addChild(character)
    this.gameState!.addCharacter(character)
  }

  private handleGlobalClick(): void {
    // Deselect character when clicking anywhere outside hex tiles
    this.interactionHandler?.handleGlobalClick()
  }
}