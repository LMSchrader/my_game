import { type Application } from 'pixi.js'
import { type Scene, type SceneType } from './types/scene.ts'

export class SceneManager {
  private app: Application
  private scenes: Map<SceneType, Scene> = new Map()
  private currentScene: Scene | null = null

  constructor(app: Application) {
    this.app = app
  }

  public registerScene(scene: Scene): void {
    this.scenes.set(scene.type, scene)
  }

  public async switchScene(sceneType: SceneType): Promise<void> {
    const scene: Scene | undefined = this.scenes.get(sceneType)

    if (!scene) {
      throw new Error(`Scene not found: ${sceneType}`)
    }

    if (this.currentScene) {
      await this.currentScene.onExit()
      this.app.stage.removeChild(this.currentScene)
    }

    this.currentScene = scene
    this.app.stage.addChild(scene)
    await scene.onEnter()
    this.handleResize(this.app.screen.width, this.app.screen.height)
  }

  public getCurrentScene(): Scene | null {
    return this.currentScene
  }

  public getScene(sceneType: SceneType): Scene | undefined {
    return this.scenes.get(sceneType)
  }

  private handleResize(width: number, height: number): void {
    if (this.currentScene) {
      this.currentScene.onResize(width, height)
    }
  }
}