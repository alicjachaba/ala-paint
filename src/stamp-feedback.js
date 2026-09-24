import { paintBackground } from "./backgrounds.js";
import { drawStamp } from "./stamps.js";

// Chwilowa przezroczystość jest tylko wskazówką na ekranie.
// Osobny podgląd chroni pełne kolory rysunku, historii i eksportu.
export function createStampFeedback(canvas) {
  const preview = document.createElement("canvas");
  preview.className = "stamp-feedback";
  preview.setAttribute("aria-hidden", "true");
  preview.hidden = true;
  canvas.after(preview);
  const context = preview.getContext("2d");
  const part = document.createElement("canvas");
  const partContext = part.getContext("2d");

  return {
    show(project, editable, stamp, opacity) {
      if (preview.width !== canvas.width) preview.width = canvas.width;
      if (preview.height !== canvas.height) preview.height = canvas.height;
      if (part.width !== canvas.width) part.width = canvas.width;
      if (part.height !== canvas.height) part.height = canvas.height;
      partContext.clearRect(0, 0, part.width, part.height);
      drawStamp(partContext, stamp, stamp);
      context.clearRect(0, 0, preview.width, preview.height);
      paintBackground(context, project);
      for (const layer of project.layers) {
        if (!layer.visible) continue;
        context.drawImage(
          layer === editable.layer ? editable.base : layer.canvas,
          0,
          0,
        );
        if (layer === editable.layer) {
          context.save();
          context.globalAlpha = opacity;
          context.drawImage(part, 0, 0);
          context.restore();
        }
      }
      preview.hidden = false;
      canvas.style.opacity = "0";
    },
    hide() {
      preview.hidden = true;
      canvas.style.opacity = "";
    },
  };
}
