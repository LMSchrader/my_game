import { Application } from 'pixi.js'
import { HexGrid } from './grid/HexGrid.ts'
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
  hexGrid.setOnClick((hex) => {
    logger.debug('Clicked hex:', hex)
  })
  app.stage.addChild(hexGrid)

  const handleResize = (): void => {
    hexGrid.center(app.screen.width, app.screen.height)
  }

  window.addEventListener('resize', handleResize)
}

init().catch((error: Error) => {
  logger.error('Failed to initialize application:', error)
})