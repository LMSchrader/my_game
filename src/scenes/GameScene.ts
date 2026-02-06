import {Assets, Container, Graphics, Sprite, Text} from 'pixi.js'
import {type Scene, SceneType} from './types/scene.ts'
import {HexGrid} from '../grid/HexGrid.ts'
import {CharacterEntity, Team} from '../character/Character.ts'
import {type Character} from '../character/types/character.ts'
import {GameState} from '../state/GameState.ts'
import {InteractionHandler} from '../interaction/InteractionHandler.ts'
import {END_TURN, FONTSIZE_MEDIUM, SpritePaths, TEXT_COLOR_WHITE} from '../config/config.ts'
import {TurnOrderDisplay} from '../turn/TurnOrderDisplay.ts'
import {TurnManager} from '../turn/TurnManager.ts'
import {AIController} from '../ai/AIController.ts'
import {logger} from '../utils/logger.ts'
import {center, scaleToFullSize} from "../utils/uiUtils.ts";
import {FancyButton} from "@pixi/ui";

const BACKGROUND_PATH: string = '/background.png'

export class GameScene extends Container implements Scene {
    public readonly type: SceneType = SceneType.GAME

    private readonly gameState: GameState
    private readonly turnManager: TurnManager
    private interactionHandler: InteractionHandler | undefined
    private background: Sprite | undefined
    private hexGrid: HexGrid | undefined
    private endTurnButton: FancyButton | undefined
    private turnOrderDisplay: TurnOrderDisplay | undefined
    private aiController: AIController | undefined

    constructor() {
        super();
        this.gameState = GameState.getInstance()
        this.turnManager = TurnManager.getInstance()
    }

    public async onEnter(): Promise<void> {
        await this.loadBackground()
        this.createGrid()
        await this.initializeCharacters()
        await this.createTurnOrder()
        this.createEndTurnButton()
        this.createInteractionHandler()
        this.initAI()
    }

    public async onExit(): Promise<void> {
        this.destroy({
            children: true,
            texture: false
        });
    }

    public onResize(width: number, height: number): void {
        center(this.background!, width, height)
        scaleToFullSize(this.background!, width, height)
        center(this.hexGrid!, width, height)
        this.endTurnButton!.x = width / 2
        this.endTurnButton!.y = height - 100
    }

    private async loadBackground(): Promise<void> {
        try {
            const texture = await Assets.load(BACKGROUND_PATH)
            this.background = new Sprite(texture)
            this.background.anchor.set(0.5)
            this.background.eventMode = 'static'
            this.addChild(this.background)
        } catch (error) {
            logger.error('Failed to load Game background:', error)
        }
    }

    private createGrid(): void {
        this.hexGrid = new HexGrid()
        this.addChild(this.hexGrid)
    }

    private async initializeCharacters(): Promise<void> {
        const character = await CharacterEntity.create({
            id: 'cat-1',
            hexPosition: {q: 0, r: 0},
            name: 'Whiskers',
            team: Team.TeamA,
            speed: 6,
            spriteScale: 5,
            positionProvider: this.hexGrid!,
            spritePath: SpritePaths.CHARACTER,
        })
        this.addCharacter(character)

        const enemy = await CharacterEntity.create({
            id: 'enemy-1',
            hexPosition: {q: 2, r: 1},
            name: 'Shadow Beast',
            team: Team.TeamB,
            speed: 4,
            spriteScale: 5,
            positionProvider: this.hexGrid!,
            spritePath: SpritePaths.ENEMY,
        })
        this.addCharacter(enemy)
    }

    private addCharacter(character: CharacterEntity): void {
        this.hexGrid!.addChild(character)
        this.gameState.addCharacter(character)
    }

    private async createTurnOrder(): Promise<void> {
        this.turnOrderDisplay = new TurnOrderDisplay()
        this.turnOrderDisplay.x = 20
        this.turnOrderDisplay.y = 20
        this.addChild(this.turnOrderDisplay)

        this.turnManager.on('turnOrderInitialized', () => {
            if (this.turnOrderDisplay) {
                const turnQueue = this.turnManager.getTurnQueue()
                this.turnOrderDisplay.updateTurnOrder(turnQueue)
                const activeCharacter = this.turnManager.getActiveCharacter()
                if (activeCharacter) {
                    this.turnOrderDisplay.setActiveCharacter(activeCharacter.id)
                }
            }
        })

        this.turnManager.on('turnStart', (character: unknown) => {
            const activeChar = character as Character
            if (this.turnOrderDisplay && activeChar.id) {
                this.turnOrderDisplay.setActiveCharacter(activeChar.id)
            }
            this.updateButtonState()
        })

        this.turnManager.on('turnEnd', () => {
            this.hexGrid!.clearHighlights()
            this.gameState.deselectCharacter()
        })

        const allCharacters = this.gameState.getAllCharacters()
        this.turnManager.initializeTurnOrder(allCharacters)
    }

    private initAI(): void {
        this.aiController = new AIController(
            this.gameState,
            (hex) => this.hexGrid!.isHexInGrid(hex)
        )
        this.aiController.initialize(this.turnManager)
    }

    private createInteractionHandler(): void {
        this.interactionHandler = new InteractionHandler(
            this.gameState,
            this.hexGrid!,
            this.turnManager
        )

        this.background?.on('pointerdown', () => this.interactionHandler?.handleGlobalClick())

        this.hexGrid?.setOnClick((hex) => {
            this.interactionHandler!.handleHexClick(hex)
        })
    }

    private createEndTurnButton(): void {
        const defaultView: Graphics = new Graphics().roundRect(0, 0, 200, 60, 10).fill(0x3b82f6);
        const hoverView: Graphics = new Graphics().roundRect(0, 0, 200, 60, 10).fill(0x60a5fa);
        const disabledView: Graphics = new Graphics().roundRect(0, 0, 200, 60, 10).fill(0x6b7280);

        const buttonText: Text = new Text({
            text: END_TURN,
            style: {
                fontSize: FONTSIZE_MEDIUM,
                fill: TEXT_COLOR_WHITE,
                fontWeight: 'bold',
                align: 'center'
            },
        });

        this.endTurnButton = new FancyButton({
            text: buttonText,
            defaultView,
            hoverView,
            disabledView,
            anchor: 0.5
        });

        this.endTurnButton.onPress.connect(() => this.turnManager.endTurn());
        this.addChild(this.endTurnButton)
    }

    public updateButtonState(): void {
        this.endTurnButton!.enabled = this.turnManager.isPlayerTurn()
    }
}