import { drawAnimalPart } from "./animal-parts.js";
import { shapeColor } from "./colors.js";

export const STAMPS = [
  ["eyes", "Oczy", "eye"],
  ["tail", "Ogon", "squirrel"],
  ["ears", "Uszy", "ear"],
  ["paws", "Łapy", "paw-print"],
  ["nose", "Noski", "heart"],
  ["muzzle", "Pyszczki", "smile"],
  ["whiskers", "Wąsy", "cat"],
  ["horns", "Rogi", "crown"],
  ["wings", "Skrzydła", "feather"],
  ["fins", "Płetwy", "fish"],
  ["mane", "Grzywy", "sun"],
  ["belly", "Brzuszki", "shell"],
];
export const STAMP_VARIANTS = {
  eyes: [
    ["round", "Okrągłe"],
    ["cat", "Kocie"],
    ["lashes", "Z rzęsami"],
    ["sleepy", "Śpiące"],
    ["hearts", "Serduszka"],
    ["stars", "Gwiazdki"],
  ],
  tail: [
    ["curly", "Zakręcony"],
    ["fox", "Lisi"],
    ["squirrel", "Wiewiórki"],
    ["bunny", "Króliczy"],
    ["lion", "Lwi"],
    ["beaver", "Bobrzy"],
  ],
  ears: [
    ["cat", "Kocie"],
    ["bunny", "Królicze"],
    ["bear", "Misiowe"],
    ["dog", "Pieska"],
    ["mouse", "Mysie"],
    ["lynx", "Rysia"],
  ],
  paws: [
    ["cat", "Kocie"],
    ["dog", "Pieska"],
    ["bird", "Ptasie"],
    ["hoof", "Kopytka"],
    ["frog", "Żabie"],
    ["bear", "Niedźwiedzie"],
  ],
  nose: [
    ["triangle", "Trójkątny"],
    ["heart", "Serduszko"],
    ["dog", "Psi"],
    ["pig", "Ryjek"],
    ["bunny", "Króliczy nosek"],
    ["beak", "Dziobek"],
  ],
  muzzle: [
    ["cat", "Koci pyszczek"],
    ["dog", "Psi pyszczek"],
    ["bunny", "Króliczy pyszczek"],
    ["bear", "Misiowy pyszczek"],
    ["frog", "Żabi uśmiech"],
    ["lion", "Lwi pyszczek"],
  ],
  whiskers: [
    ["straight", "Proste"],
    ["curved", "Wygięte"],
    ["long", "Długie"],
    ["short", "Krótkie"],
    ["curly", "Zawijane"],
    ["dots", "Z piegami"],
  ],
  horns: [
    ["goat", "Kozie"],
    ["bull", "Bycze"],
    ["deer", "Jelenia"],
    ["ram", "Baranie"],
    ["unicorn", "Jednorożca"],
    ["giraffe", "Żyrafie różki"],
  ],
  wings: [
    ["bird", "Ptasie skrzydła"],
    ["butterfly", "Motyla"],
    ["bat", "Nietoperza"],
    ["dragon", "Smocze"],
    ["bee", "Pszczele"],
    ["angel", "Pierzaste"],
  ],
  fins: [
    ["shark", "Rekina"],
    ["fish", "Rybie"],
    ["dolphin", "Delfina"],
    ["goldfish", "Złotej rybki"],
    ["seal", "Foki"],
    ["whale", "Wieloryba"],
  ],
  mane: [
    ["lion", "Lwia"],
    ["horse", "Końska"],
    ["zebra", "Zebry"],
    ["fluffy", "Puszysta"],
    ["spiky", "Kolczasta"],
    ["ruff", "Kryza"],
  ],
  belly: [
    ["oval", "Owalny"],
    ["heart", "Serduszkowy"],
    ["striped", "W paseczki"],
    ["spotted", "W kropeczki"],
    ["shell", "Żółwia skorupa"],
    ["fluffy", "Puchaty"],
  ],
};

// Przeciągnięcie wyznacza ramkę, tak samo jak dla koła i prostokąta.
// Kliknięcie lub lekkie drgnięcie dłoni przybija dodatek w domyślnym rozmiarze.
export function drawStampGesture(context, start, end, settings) {
  const stamp = stampFromGesture(start, end, settings);
  drawStamp(context, stamp, stamp);
}

export function stampFromGesture(start, end, settings) {
  const clicked =
    Math.hypot(end.x - start.x, end.y - start.y) <=
    (settings.stampClickDistance ?? 12);
  return {
    tool: settings.tool,
    variant: settings.variant,
    color: settings.color,
    rotation: settings.rotation,
    x: clicked ? start.x : (start.x + end.x) / 2,
    y: clicked ? start.y : (start.y + end.y) / 2,
    width: clicked
      ? settings.stampSize
      : Math.max(8, Math.abs(end.x - start.x)),
    height: clicked
      ? settings.stampSize
      : Math.max(8, Math.abs(end.y - start.y)),
  };
}

// Cofamy obrót punktu, aby można było złapać także obrócony dodatek.
export function containsStamp(stamp, point) {
  const angle = (-stamp.rotation * Math.PI) / 180;
  const dx = point.x - stamp.x;
  const dy = point.y - stamp.y;
  const x = dx * Math.cos(angle) - dy * Math.sin(angle);
  const y = dx * Math.sin(angle) + dy * Math.cos(angle);
  return Math.abs(x) <= stamp.width / 2 && Math.abs(y) <= stamp.height / 2;
}

// Każdy dodatek mieści się w umownej ramce 100 × 100 wokół środka.
export function drawStamp(
  context,
  point,
  {
    tool,
    color,
    stampSize = 100,
    width = stampSize,
    height = stampSize,
    rotation = 0,
    variant = STAMP_VARIANTS[tool][0][0],
  },
) {
  context.save();
  context.translate(point.x, point.y);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(width / 100, height / 100);
  // Uszy rysujemy jako dwie lustrzane połówki; każda dostaje całą tęczę.
  color = shapeColor(
    context,
    { color },
    { x: tool === "ears" ? 0 : -50, y: 0 },
    { x: 50, y: 0 },
  );
  context.fillStyle = color;
  context.strokeStyle = "#49334b";
  context.lineWidth = 3;
  context.lineCap = "round";
  context.lineJoin = "round";
  const oval = (x, y, rx, ry, fill) => {
    context.beginPath();
    context.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    context.fillStyle = fill;
    context.fill();
    context.stroke();
  };
  const path = (data, fill = color) => {
    const outline = new Path2D(data);
    context.fillStyle = fill;
    context.fill(outline);
    context.stroke(outline);
  };
  const line = (data) => context.stroke(new Path2D(data));
  if (tool === "eyes") {
    for (const x of [-23, 23]) {
      if (variant === "sleepy") {
        line(`M ${x - 19} -3 Q ${x} 20 ${x + 19} -3`);
        for (const offset of [-12, 0, 12]) line(`M ${x + offset} 7 l -3 8`);
        continue;
      }
      if (variant === "cat") {
        path(
          `M ${x - 21} 0 Q ${x} -33 ${x + 21} 0 Q ${x} 30 ${x - 21} 0 Z`,
          "#fff",
        );
      } else oval(x, 0, 21, 29, "#fff");
      if (variant === "hearts" || variant === "stars") {
        context.save();
        context.translate(x, 0);
        path(
          variant === "hearts"
            ? "M 0 17 C -32 -1 -13 -23 0 -9 C 13 -23 32 -1 0 17 Z"
            : "M 0 -20 L 6 -6 L 20 -5 L 10 5 L 13 20 L 0 12 L -13 20 L -10 5 L -20 -5 L -6 -6 Z",
        );
        context.restore();
        continue;
      }
      oval(x + 3, 3, 10, variant === "cat" ? 13 : 16, color);
      oval(x + 4, 4, variant === "cat" ? 2.5 : 4, 9, "#49334b");
      context.fillStyle = "#fff";
      context.beginPath();
      context.arc(x + 7, -3, 3, 0, Math.PI * 2);
      context.fill();
      if (variant === "lashes") {
        for (const offset of [-13, 0, 13])
          line(`M ${x + offset} -25 l ${offset / 3} -12`);
      }
    }
  } else if (tool === "ears") {
    for (const direction of [-1, 1]) {
      context.save();
      context.scale(direction, 1);
      if (variant === "mouse") {
        oval(26, 0, 21, 30, color);
        oval(26, 0, 14, 21, "#ffc5d9");
      } else if (variant === "lynx") {
        path("M 7 32 L 15 -14 L 34 -32 L 45 32 Z");
        path("M 18 22 L 32 -15 L 36 22 Z", "#ffc5d9");
        line("M 34 -31 L 29 -47 M 34 -31 L 37 -46 M 34 -31 L 43 -42");
      } else if (variant === "bunny") {
        oval(25, 0, 16, 44, color);
        oval(25, -2, 7, 31, "#ffc5d9");
      } else if (variant === "bear") {
        oval(26, 0, 20, 23, color);
        oval(26, 2, 11, 13, "#ffc5d9");
      } else if (variant === "dog") {
        path("M 9 -24 Q 35 -47 44 -12 Q 55 43 28 41 Q 8 34 9 -24 Z");
        path("M 24 -13 Q 39 -21 37 23 Q 22 37 24 -13 Z", "#ffc5d9");
      } else {
        path("M 8 31 Q 12 -8 40 -40 Q 50 5 43 31 Z");
        path("M 22 20 L 38 -20 L 39 20 Z", "#ffc5d9");
      }
      context.restore();
    }
  } else if (tool === "tail") {
    if (variant === "lion") {
      path("M -40 36 Q 18 43 17 -28 L 28 -28 Q 35 49 -39 46 Z");
      path("M 13 -19 Q -3 -29 21 -47 Q 46 -38 34 -17 L 25 -8 Z");
    } else if (variant === "beaver") {
      path("M -17 43 Q -54 3 -32 -31 Q 0 -56 32 -31 Q 54 3 17 43 Z");
      line(
        "M -27 -25 L 26 20 M -34 -6 L 15 37 M -9 -39 L 35 0 M 27 -25 L -26 20 M 34 -6 L -15 37 M 9 -39 L -35 0",
      );
    } else if (variant === "fox") {
      path(
        "M -40 38 Q 1 33 -6 -5 Q -10 -31 43 -43 Q 30 -20 40 2 Q 47 39 -9 44 Z",
      );
      path(
        "M -6 -5 Q -10 -31 43 -43 Q 30 -20 40 2 L 24 -6 L 17 6 L 8 -9 L 0 5 Z",
        "#fff4df",
      );
    } else if (variant === "squirrel") {
      path(
        "M -30 42 Q 10 19 -18 3 Q -51 -14 -29 -39 Q -8 -53 21 -33 Q 61 -2 28 31 Q 6 49 -30 42 Z",
      );
      line("M -19 -27 Q 13 -35 19 -10 Q 25 7 9 16");
    } else if (variant === "bunny") {
      path(
        "M -36 -5 Q -47 -25 -22 -28 Q -24 -46 -4 -39 Q 13 -49 22 -29 Q 45 -31 38 -9 Q 51 9 32 22 Q 33 43 12 36 Q -5 50 -19 32 Q -44 38 -36 17 Q -48 7 -36 -5 Z",
      );
      line("M -18 -11 Q -10 -21 -3 -12 M 7 15 Q 17 20 22 9");
    } else {
      context.beginPath();
      context.moveTo(-36, 33);
      context.bezierCurveTo(40, 45, 46, -43, 10, -36);
      context.bezierCurveTo(-14, -33, -9, -6, 13, -9);
      context.lineWidth = 22;
      context.stroke();
      context.strokeStyle = color;
      context.lineWidth = 16;
      context.stroke();
    }
  } else if (tool === "paws") {
    for (const x of [-25, 25]) {
      if (variant === "frog") {
        path(
          `M ${x - 8} -27 L ${x + 8} -27 L ${x + 9} 5 L ${x + 21} 26 L ${x + 5} 20 L ${x} 37 L ${x - 7} 20 L ${x - 22} 26 L ${x - 9} 5 Z`,
        );
      } else if (variant === "bear") {
        oval(x, 9, 20, 29, color);
        oval(x, 14, 11, 13, "#ffc5d9");
        for (const dx of [-13, 0, 13])
          path(
            `M ${x + dx - 4} -13 L ${x + dx} -34 L ${x + dx + 4} -13 Z`,
            "#fff4df",
          );
      } else if (variant === "bird") {
        context.strokeStyle = "#49334b";
        context.lineWidth = 9;
        const toes = `M ${x} -26 L ${x} 12 M ${x - 16} 29 L ${x} 12 L ${x + 16} 29 M ${x} 12 L ${x} 35`;
        line(toes);
        context.strokeStyle = color;
        context.lineWidth = 5;
        line(toes);
      } else if (variant === "hoof") {
        path(
          `M ${x - 14} -26 L ${x + 14} -26 L ${x + 20} 28 Q ${x} 37 ${x - 20} 28 Z`,
        );
        line(`M ${x} 10 L ${x} 33`);
      } else {
        oval(x, 12, 20, 17, color);
        for (const offset of variant === "dog"
          ? [-15, -5, 5, 15]
          : [-13, 0, 13]) {
          oval(
            x + offset,
            Math.abs(offset) < 10 ? -18 : -10,
            variant === "dog" ? 5 : 7,
            10,
            color,
          );
        }
        oval(x, 14, 9, 7, "#ffc5d9");
      }
    }
  } else {
    drawAnimalPart(context, { tool, variant, color, oval, path, line });
  }
  context.restore();
}
