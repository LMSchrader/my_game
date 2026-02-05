import { type HexCoordinates } from '../grid/types/grid.ts'
import { type Character, Team } from '../character/types/character.ts'
import { getValidMovementTiles } from '../movement/MovementSystem.ts'
import { getHexDistance } from '../utils/hexGridUtils.ts'
import { GameState } from '../state/GameState.ts'
import { Colors } from '../config/config.ts'
import { logger } from '../utils/logger.ts'

interface TurnProvider {
  getActiveCharacter(): Character | null
  isPlayerTurn(): boolean
}

export type GridBoundsChecker = (hex: HexCoordinates) => boolean
export type TileHighlighter = (hexes: HexCoordinates[], color: number) => void
export type HighlightChecker = (hex: HexCoordinates) => boolean

export class InteractionHandler {
  private gameState: GameState
  private gridBoundsChecker: GridBoundsChecker
  private tileHighlighter: TileHighlighter
  private highlightChecker: HighlightChecker
  private turnProvider: TurnProvider

  constructor(
    gameState: GameState,
    gridBoundsChecker: GridBoundsChecker,
    tileHighlighter: TileHighlighter,
    highlightChecker: HighlightChecker,
    turnProvider: TurnProvider
  ) {
    this.gameState = gameState
    this.gridBoundsChecker = gridBoundsChecker
    this.tileHighlighter = tileHighlighter
    this.highlightChecker = highlightChecker
    this.turnProvider = turnProvider
  }

  public handleHexClick(hex: HexCoordinates): void {
    const clickedCharacter = this.gameState.getCharacterAtPosition(hex)
    const selectedCharacter = this.gameState.getSelectedCharacter()

    if (clickedCharacter) {
      this.handleCharacterClick(clickedCharacter, selectedCharacter)
    } else if (selectedCharacter) {
      this.handleEmptyTileClick(hex, selectedCharacter)
    }
  }

  private handleCharacterClick(clickedCharacter: Character, selectedCharacter: Character | undefined): void {
    if (!this.canSelectCharacter(clickedCharacter)) {
      logger.warn(`Cannot select ${clickedCharacter.name}: not active character or wrong team`)
      return
    }

    if (selectedCharacter?.id === clickedCharacter.id) {
      clickedCharacter.setSelected(false)
      this.gameState.deselectCharacter()
      this.clearHighlights()
    } else {
      if (selectedCharacter) {
        selectedCharacter.setSelected(false)
      }
      clickedCharacter.setSelected(true)
      this.gameState.selectCharacter(clickedCharacter.id)
      this.showMovementRange(clickedCharacter)
    }
  }

  private handleEmptyTileClick(hex: HexCoordinates, selectedCharacter: Character): void {
    if (!this.canSelectCharacter(selectedCharacter)) {
      logger.warn(`${selectedCharacter.name} cannot move: not active character or wrong team`)
      selectedCharacter.setSelected(false)
      this.gameState.deselectCharacter()
      this.clearHighlights()
      return
    }

    if (this.isValidMove(hex, selectedCharacter)) {
      this.executeMove(selectedCharacter, hex)
    } else {
      selectedCharacter.setSelected(false)
      this.gameState.deselectCharacter()
      this.clearHighlights()
    }
  }

  private isValidMove(hex: HexCoordinates, character: Character): boolean {
    if (!this.highlightChecker(hex)) {
      return false
    }

    const distance = getHexDistance(character.hexPosition, hex)
    if (!character.hasEnoughMovementPoints(distance)) {
      return false
    }

    const occupiedCharacter = this.gameState.getCharacterAtPosition(hex)
    return !(occupiedCharacter && occupiedCharacter.id !== character.id)
  }

  private executeMove(character: Character, newHexPosition: HexCoordinates): void {
    const oldPosition = character.hexPosition
    const distance = getHexDistance(oldPosition, newHexPosition)

    character.setPosition(newHexPosition)
    character.useMovementPoints(distance)

    this.clearHighlights()

    if (character.movementPoints > 0) {
      this.showMovementRange(character)
    } else {
      character.setSelected(false)
      this.gameState.deselectCharacter()
    }
  }

  private showMovementRange(character: Character): void {
    const allCharacters = this.gameState.getAllCharacters()
    const movementTiles = getValidMovementTiles(
      character.hexPosition,
      character.movementPoints,
      allCharacters,
      this.gridBoundsChecker
    )

    this.tileHighlighter(movementTiles, Colors.HIGHLIGHT)
  }

  private clearHighlights(): void {
    this.tileHighlighter([], Colors.HIGHLIGHT)
  }

  private canSelectCharacter(character: Character): boolean {
    return this.isActiveCharacter(character) && this.isPlayerTeam(character)
  }

  private isActiveCharacter(character: Character): boolean {
    const activeCharacter = this.turnProvider.getActiveCharacter()
    return activeCharacter?.id === character.id
  }

  private isPlayerTeam(character: Character): boolean {
    return character.team === Team.TeamA
  }
}