import { Application } from "pixi.js";
import { sceneManager } from "./scenes/SceneManager.ts";
import { SceneType } from "./scenes/types/scene.ts";
import { logger } from "./utils/logger.ts";
import "./index.css";

export const app = new Application();

function resize() {
  const currentScene = sceneManager.getCurrentScene();
  if (currentScene) {
    currentScene.onResize(window.innerWidth, window.innerHeight);
  }
}

async function init(): Promise<void> {
  await app.init({
    resizeTo: window,
  });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);

  window.addEventListener("resize", resize);

  await sceneManager.switchScene(SceneType.START);
}

try {
  await init();
} catch (error) {
  logger.error(error, "Failed to initialize application");
}
