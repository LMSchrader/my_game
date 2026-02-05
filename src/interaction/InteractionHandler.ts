import { type HexCoordinates } from '../types/grid.ts'
import { type Character } from '../types/character.ts'
import { getValidMovementTiles } from '../movement/MovementSystem.ts'
import { getHexDistance } from '../utils/hexGridUtils.ts'
import { GameState } from '../state/GameState.ts'
import { Colors } from '../config/config.ts'

export type GridBoundsChecker = (hex: HexCoordinates) => boolean
export type TileHighlighter = (hexes: HexCoordinates[], color: number) => void
export type HighlightChecker = (hex: HexCoordinates) => boolean

export class InteractionHandler {
  private gameState: GameState
  private gridBoundsChecker: GridBoundsChecker
  private tileHighlighter: TileHighlighter
  private highlightChecker: HighlightChecker

  constructor(
    gameState: GameState,
    gridBoundsChecker: GridBoundsChecker,
    tileHighlighter: TileHighlighter,
    highlightChecker: HighlightChecker
  ) {
    this.gameState = gameState
    this.gridBoundsChecker = gridBoundsChecker
    this.tileHighlighter = tileHighlighter
    this.highlightChecker = highlightChecker
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
    if (selectedCharacter && selectedCharacter.id === clickedCharacter.id) {
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

  public getSelectedCharacter(): Character | undefined {
    return this.gameState.getSelectedCharacter()
  }
}