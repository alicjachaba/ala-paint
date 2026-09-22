export const STAMPS = [
  ["eyes", "Oczy", "eye"],
  ["tail", "Ogon", "squirrel"],
  ["ears", "Uszy", "ear"],
  ["paws", "Łapy", "paw-print"],
];

// Każdy stempelek rysujemy wokół środka, więc łatwo go obracać i powiększać.
export function drawStamp(
  context,
  point,
  { tool, color, stampSize, rotation },
) {
  context.save();
  context.translate(point.x, point.y);
  context.rotate((rotation * Math.PI) / 180);
  context.scale(stampSize / 100, stampSize / 100);
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
  if (tool === "eyes") {
    for (const x of [-23, 23]) {
      oval(x, 0, 21, 29, "#ffffff");
      oval(x + 4, 5, 10, 14, color);
      oval(x + 5, 6, 4, 8, "#49334b");
      context.fillStyle = "#ffffff";
      context.beginPath();
      context.arc(x + 8, 0, 3, 0, Math.PI * 2);
      context.fill();
    }
  } else if (tool === "ears") {
    for (const direction of [-1, 1]) {
      context.save();
      context.scale(direction, 1);
      context.beginPath();
      context.moveTo(8, 31);
      context.quadraticCurveTo(12, -8, 43, -40);
      context.quadraticCurveTo(57, 5, 43, 31);
      context.closePath();
      context.fillStyle = color;
      context.fill();
      context.stroke();
      context.beginPath();
      context.moveTo(22, 20);
      context.lineTo(40, -20);
      context.lineTo(39, 20);
      context.closePath();
      context.fillStyle = "#ffc5d9";
      context.fill();
      context.restore();
    }
  } else if (tool === "tail") {
    context.beginPath();
    context.moveTo(-36, 33);
    context.bezierCurveTo(55, 45, 64, -43, 17, -36);
    context.bezierCurveTo(-8, -33, -2, -6, 20, -9);
    context.lineWidth = 22;
    context.stroke();
    context.strokeStyle = color;
    context.lineWidth = 16;
    context.stroke();
  } else if (tool === "paws") {
    for (const x of [-26, 26]) {
      oval(x, 12, 20, 17, color);
      for (const offset of [-13, 0, 13]) {
        oval(x + offset, offset === 0 ? -16 : -10, 7, 10, color);
      }
      oval(x, 14, 9, 7, "#ffc5d9");
    }
  }
  context.restore();
}
