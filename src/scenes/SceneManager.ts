import { type Scene } from "./types/scene.ts";
import { app } from "../main.ts";
import { pool } from "../utils/pool.ts";
import { areBundlesLoaded, loadBundles } from "../utils/assets.ts";

interface SceneConstructor {
  new (): Scene;
  /** List of assets bundles required by the screen */
  assetBundles?: string[];
}

class SceneManager {
  private currentScene?: Scene;

  public async switchScene(ctr: SceneConstructor): Promise<void> {
    if (this.currentScene) {
      this.currentScene.interactiveChildren = false;
    }

    if (ctr.assetBundles && !areBundlesLoaded(ctr.assetBundles)) {
      await loadBundles(ctr.assetBundles);
    }

    if (this.currentScene) {
      await this.currentScene.onExit();
      app.stage.removeChild(this.currentScene);
    }

    this.currentScene = pool.get(ctr);
    app.stage.addChild(this.currentScene);
    await this.currentScene.onEnter();
    this.resize(app.screen.width, app.screen.height);
  }

  public resize(width: number, height: number): void {
    this.currentScene?.onResize(width, height);
  }
}

export const sceneManager = new SceneManager();
