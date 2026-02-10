import { Application } from "pixi.js";
import { SceneManager } from "./scenes/SceneManager.ts";
import { SceneType } from "./scenes/types/scene.ts";
import { logger } from "./utils/logger.ts";
import "./index.css";

async function init(): Promise<void> {
  const app: Application = new Application();

  await app.init({
    resizeTo: window,
  });

  app.canvas.style.position = "absolute";

  document.body.appendChild(app.canvas);

  const sceneManager: SceneManager = new SceneManager(app);

  await sceneManager.switchScene(SceneType.START);

  const handleResize = (): void => {
    const currentScene = sceneManager.getCurrentScene();
    if (currentScene) {
      currentScene.onResize(app.screen.width, app.screen.height);
    }
  };

  window.addEventListener("resize", handleResize);
}

try {
  await init();
} catch (error) {
  logger.error(error, "Failed to initialize application");
}
