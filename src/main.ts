import { Application } from "pixi.js";
import { sceneManager } from "./scenes/SceneManager.ts";
import { logger } from "./utils/logger.ts";
import { initAssets } from "./utils/assets.ts";
import "./index.css";
import { StartScreen } from "./scenes/StartScreen.ts";

export const app = new Application();

function resize() {
  sceneManager.resize(window.innerWidth, window.innerHeight);
}

async function init(): Promise<void> {
  await app.init({
    resizeTo: window,
  });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);

  window.addEventListener("resize", resize);

  await initAssets();

  await sceneManager.switchScene(StartScreen);
}

try {
  await init();
} catch (error) {
  logger.error(error, "Failed to initialize application");
}
