import { FancyButton } from "@pixi/ui";
import { Graphics, Text } from "pixi.js";
import { FONTSIZE_MEDIUM, TEXT_COLOR_WHITE } from "../config/config.ts";

const defaultButtonOptions = {
  text: "",
  fontSize: FONTSIZE_MEDIUM,
  fontColor: TEXT_COLOR_WHITE,
  width: 200,
  height: 60,
  radius: 10,
  defaultColor: 0x3b82f6,
  hoverColor: 0x60a5fa,
  disabledColor: 0x6b7280,
};

export class GenericButton extends FancyButton {
  constructor(options: Partial<GenericButton> = {}) {
    const opts = { ...defaultButtonOptions, ...options };

    const buttonText: Text = new Text({
      text: opts.text,
      style: {
        fontSize: opts.fontSize,
        fill: opts.fontColor,
        align: "center",
      },
    });

    const defaultView: Graphics = new Graphics()
      .roundRect(0, 0, opts.width, opts.height, opts.radius)
      .fill(opts.defaultColor);
    const hoverView: Graphics = new Graphics()
      .roundRect(0, 0, opts.width, opts.height, opts.radius)
      .fill(opts.hoverColor);
    const disabledView: Graphics = new Graphics()
      .roundRect(0, 0, opts.width, opts.height, opts.radius)
      .fill(opts.disabledColor);

    super({
      text: buttonText,
      defaultView,
      hoverView,
      disabledView,
      anchor: 0.5,
    });
  }
}
