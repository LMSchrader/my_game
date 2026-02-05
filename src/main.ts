import { Application } from 'pixi.js'
import { SceneManager } from './scenes/SceneManager.ts'
import { StartScreen } from './scenes/StartScreen.ts'
import { GameScene } from './scenes/GameScene.ts'
import { SceneType } from './scenes/types/scene.ts'
import { logger } from './utils/logger.ts'
import './index.css'

async function init(): Promise<void> {
  const app: Application = new Application()

  await app.init({
    background: '0x2d2d2d',
    resizeTo: window,
  })

  app.canvas.style.position = 'absolute'

  const canvas: HTMLCanvasElement = app.canvas

  document.body.appendChild(canvas)

  const sceneManager: SceneManager = new SceneManager(app)

  const startScreen: StartScreen = new StartScreen(() => {
    sceneManager.switchScene(SceneType.GAME)
  })

  sceneManager.registerScene(startScreen)

  const gameScene: GameScene = new GameScene()
  sceneManager.registerScene(gameScene)

  await sceneManager.switchScene(SceneType.START)

  const handleResize = (): void => {
    const currentScene = sceneManager.getCurrentScene()
    if (currentScene) {
      currentScene.onResize(app.screen.width, app.screen.height)
    }
  }

  window.addEventListener('resize', handleResize)

  const cleanup = (): void => {
    window.removeEventListener('resize', handleResize)
  }

  window.addEventListener('beforeunload', cleanup)
}

init().catch((error: Error) => {
  logger.error('Failed to initialize application:', error)
})