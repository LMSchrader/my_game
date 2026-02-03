import { Application } from 'pixi.js'
import { HexGrid } from './grid/HexGrid.ts'
import { CharacterEntity } from './character/Character.ts'
import { GameState } from './state/GameState.ts'
import { InteractionHandler } from './interaction/InteractionHandler.ts'
import { logger } from './utils/logger.ts'
import './index.css'

async function init(): Promise<void> {
  const app = new Application()

  await app.init({
    background: '0x2d2d2d',
    resizeTo: window
  })

  app.canvas.style.position = 'absolute'

  const canvas: HTMLCanvasElement = app.canvas

  document.body.appendChild(canvas)

  const hexGrid: HexGrid = new HexGrid()
  hexGrid.center(app.screen.width, app.screen.height)
  app.stage.addChild(hexGrid)

  const gameState = new GameState()

  const character = new CharacterEntity({
    id: 'cat-1',
    hexPosition: { q: 0, r: 0 },
    name: 'Whiskers',
    color: 0xffd700,
    spriteScale: 5,
    positionProvider: hexGrid,
    spritePath: '/character.png',
  })
  hexGrid.addChild(character)
  gameState.addCharacter(character)

  const enemy = new CharacterEntity({
    id: 'enemy-1',
    hexPosition: { q: 2, r: 1 },
    name: 'Shadow Beast',
    color: 0xff0000,
    spriteScale: 5,
    positionProvider: hexGrid,
    spritePath: '/enemy.png',
  })
  hexGrid.addChild(enemy)
  gameState.addCharacter(enemy)

  const interactionHandler = new InteractionHandler(
    gameState,
    (hex) => hexGrid.isHexInGrid(hex),
    (hexes, color) => hexGrid.highlightTiles(hexes, color),
    (hex) => hexGrid.isTileHighlighted(hex)
  )

  hexGrid.setOnClick((hex) => {
    logger.debug('Clicked hex:', hex)
    interactionHandler.handleHexClick(hex)
  })

  const handleResize = (): void => {
    hexGrid.center(app.screen.width, app.screen.height)
  }

  window.addEventListener('resize', handleResize)
}

init().catch((error: Error) => {
  logger.error('Failed to initialize application:', error)
})