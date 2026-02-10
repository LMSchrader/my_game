import { Container } from "pixi.js";

export interface Scene extends Container {
  onEnter(): Promise<void> | void;

  onExit(): Promise<void> | void;

  onResize(width: number, height: number): void;
}
