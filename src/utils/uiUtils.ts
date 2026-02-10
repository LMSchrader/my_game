import { Container, Sprite } from "pixi.js";

export function center(
  container: Container,
  width: number,
  height: number,
): void {
  container.x = width / 2;
  container.y = height / 2;
}

export function scaleToFullSize(
  sprite: Sprite,
  width: number,
  height: number,
): void {
  const scale = Math.max(width / sprite.width, height / sprite.height);
  sprite.scale.set(scale);
}
