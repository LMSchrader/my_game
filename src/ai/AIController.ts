import { type Character, Team } from '../character/types/character.ts'
import { getValidMovementTiles } from '../movement/MovementSystem.ts'
import { getHexDistance } from '../utils/hexGridUtils.ts'
import { TurnManager } from '../turn/TurnManager.ts'
import { GameState } from '../state/GameState.ts'
import { type GridBoundsChecker } from './types/ai.ts'
import { logger } from '../utils/logger.ts'

export class AIController {
  private gameState: GameState
  private gridBoundsChecker: GridBoundsChecker
  private turnManager: TurnManager | null = null
  private turnStartCallback: ((character: unknown) => void) | null = null

  constructor(gameState: GameState, gridBoundsChecker: GridBoundsChecker) {
    this.gameState = gameState
    this.gridBoundsChecker = gridBoundsChecker
  }

  public initialize(turnManager: TurnManager): void {
    this.turnManager = turnManager
    this.turnStartCallback = (character: unknown) => this.handleTurnStart(character as Character)
    turnManager.on('turnStart', this.turnStartCallback)
    logger.debug('AIController initialized with TurnManager')
  }

  private async handleTurnStart(character: Character): Promise<void> {
    if (character.team === Team.TeamB) {
      logger.debug(`AI taking turn for ${character.name}`)
      await this.executeAITurn(character)
    }
  }

  private async executeAITurn(character: Character): Promise<void> {
    const allCharacters = this.gameState.getAllCharacters()
    const validTiles = getValidMovementTiles(
      character.hexPosition,
      character.movementPoints,
      allCharacters,
      this.gridBoundsChecker
    )

    await this.delay(100)

    if (validTiles.length === 0) {
      logger.debug(`${character.name} has no valid movement tiles, ending turn`)
      this.turnManager?.endTurn()
      return
    }

    const randomTile = validTiles[Math.floor(Math.random() * validTiles.length)]
    logger.debug(`AI moving ${character.name} from (${character.hexPosition.q}, ${character.hexPosition.r}) to (${randomTile.q}, ${randomTile.r})`)

    const distance = getHexDistance(character.hexPosition, randomTile)
    character.setPosition(randomTile)
    character.useMovementPoints(distance)

    await this.delay(100)
    this.turnManager?.endTurn()
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  public shutdown(): void {
    if (this.turnManager && this.turnStartCallback) {
      this.turnManager.off('turnStart', this.turnStartCallback)
      logger.debug('AIController removed turn manager listener')
    }
    this.turnManager = null
    this.turnStartCallback = null
  }
}