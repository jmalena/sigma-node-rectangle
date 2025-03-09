import { Attributes } from "graphology-types";
import { Settings } from "sigma/settings";
import { PartialButFor } from "sigma/types";
import type { NodeDisplayDataExt } from "./types";

export function drawRectangleNodeLabel<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayDataExt, "x" | "y" | "width" | "size" | "height" | "label" | "color">,
  settings: Settings<N, E, G>,
): void {
  if (!data.label) return;

  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight,
    color = settings.labelColor.attribute
      ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000"
      : settings.labelColor.color;

  context.fillStyle = color;
  context.font = `${weight} ${size}px ${font}`;

  context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}

export function drawRectangleNodeHover<
  N extends Attributes = Attributes,
  E extends Attributes = Attributes,
  G extends Attributes = Attributes,
>(
  context: CanvasRenderingContext2D,
  data: PartialButFor<NodeDisplayDataExt, "x" | "y" | "width" | "size" | "height" | "label" | "color">,
  settings: Settings<N, E, G>,
): void {
  const size = settings.labelSize,
    font = settings.labelFont,
    weight = settings.labelWeight;

  context.font = `${weight} ${size}px ${font}`;

  // Then we draw the label background
  context.fillStyle = "#FFF";
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 8;
  context.shadowColor = "#000";

  const PADDING = 2;

  if (typeof data.label === "string") {
    const textWidth = context.measureText(data.label).width,
      boxWidth = Math.round(textWidth + 5),
      boxHeight = Math.round(size + 2 * PADDING),
      radius = Math.max(data.size, size / 2) + PADDING;

    context.beginPath();
    context.moveTo(data.x + radius, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
    context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
    context.lineTo(data.x + radius, data.y - boxHeight / 2);
    context.lineTo(data.x + radius, data.y - radius);
    context.lineTo(data.x - radius, data.y - radius);
    context.lineTo(data.x - radius, data.y + radius);
    context.lineTo(data.x + radius, data.y + radius);
    context.moveTo(data.x + radius, data.y + boxHeight / 2);
    context.closePath();
    context.fill();
  } else {
    const radius = data.size + PADDING;
    context.fillRect(data.x - radius, data.y - radius, radius * 2, radius * 2);
  }

  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 0;

  drawRectangleNodeLabel(context, data, settings);
}
