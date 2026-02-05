import { EventEmitter } from 'pixi.js'
import { type Character, Team } from '../character/types/character.ts'
import { type TurnQueue, type TurnEvent } from './types/turn.ts'
import { calculateTurnOrder } from '../utils/turnHelpers.ts'
import { logger } from '../utils/logger.ts'

export class TurnManager {
  private static instance: TurnManager | null = null
  private turnQueue: TurnQueue = []
  private currentTurnIndex: number = 0
  private emitter: EventEmitter = new EventEmitter()

  private constructor() {}

  public static getInstance(): TurnManager {
    if (!TurnManager.instance) {
      TurnManager.instance = new TurnManager()
    }
    return TurnManager.instance
  }

  public initializeTurnOrder(characters: Character[]): void {
    this.turnQueue = calculateTurnOrder(characters)
    this.currentTurnIndex = 0
    logger.debug('Turn order initialized:', this.turnQueue.map((c) => `${c.name} (${c.team}) (SPD: ${c.speed})`))
    this.emit('turnOrderInitialized')
  }

  public getActiveCharacter(): Character | null {
    if (this.turnQueue.length === 0) {
      return null
    }
    return this.turnQueue[this.currentTurnIndex]
  }

  public endTurn(): void {
    if (this.turnQueue.length === 0) {
      logger.warn('Cannot end turn: no characters in turn queue')
      return
    }

    const currentCharacter = this.getActiveCharacter()
    if (currentCharacter) {
      currentCharacter.resetMovementPoints()
      logger.debug(`${currentCharacter.name} movement points reset to ${currentCharacter.maxMovementPoints}`)
      this.emit('movementPointsReset', currentCharacter)
      this.emit('turnEnd', currentCharacter)
      logger.debug(`Ended turn for ${currentCharacter.name}`)
    }

    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnQueue.length

    const newActiveCharacter = this.getActiveCharacter()
    if (newActiveCharacter) {
      this.emit('turnStart', newActiveCharacter)
      logger.debug(`Started turn for ${newActiveCharacter.name}`)
    }
  }

  public isPlayerTurn(): boolean {
    const activeCharacter = this.getActiveCharacter()
    return activeCharacter?.team === Team.TeamA
  }

  public getTurnQueue(): TurnQueue {
    return [...this.turnQueue]
  }

  public getCurrentTurnIndex(): number {
    return this.currentTurnIndex
  }

  public on(event: TurnEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.on(event, callback)
  }

  public off(event: TurnEvent, callback: (...args: unknown[]) => void): void {
    this.emitter.off(event, callback)
  }

  private emit(event: TurnEvent, ...args: unknown[]): void {
    this.emitter.emit(event, ...args)
  }

  public reset(): void {
    this.emitter.removeAllListeners()
    this.turnQueue = []
    this.currentTurnIndex = 0
    TurnManager.instance = null
  }
}