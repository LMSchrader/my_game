import {type Application} from 'pixi.js'
import {type Scene, type SceneType} from './types/scene.ts'
import {StartScreen} from "./StartScreen.ts";
import {GameScene} from "./GameScene.ts";

export class SceneManager {
    private readonly app: Application
    private readonly scenes: Map<SceneType, Scene> = new Map()
    private currentScene: Scene | undefined

    constructor(app: Application) {
        this.app = app
        this.registerScene(new StartScreen(this))
        this.registerScene(new GameScene())
    }

    public async switchScene(sceneType: SceneType): Promise<void> {
        const scene: Scene = this.getScene(sceneType)

        if (this.currentScene) {
            await this.currentScene.onExit()
            this.app.stage.removeChild(this.currentScene)
        }

        this.currentScene = scene
        this.app.stage.addChild(scene)
        await scene.onEnter()
        this.handleResize(this.app.screen.width, this.app.screen.height)
    }

    public getCurrentScene(): Scene | undefined {
        return this.currentScene
    }

    public getScene(sceneType: SceneType): Scene {
        const scene: Scene | undefined = this.scenes.get(sceneType)

        if (!scene) {
            throw new Error(`Scene not found: ${sceneType}`)
        }
        return scene
    }

    private registerScene(scene: Scene): void {
        this.scenes.set(scene.type, scene)
    }

    private handleResize(width: number, height: number): void {
        if (this.currentScene) {
            this.currentScene.onResize(width, height)
        }
    }
}