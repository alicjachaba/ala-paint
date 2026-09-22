// Współrzędne rysunku są niezależne od wielkości płótna na ekranie.
export function canvasPoint(event, canvas) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - bounds.left) * canvas.width) / bounds.width,
    y: ((event.clientY - bounds.top) * canvas.height) / bounds.height,
  };
}

export function drawStroke(context, from, to, { tool, color, size }) {
  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = tool === "pencil" ? Math.max(1, size / 3) : size;
  if (tool === "eraser") context.globalCompositeOperation = "destination-out";
  if (tool === "spray") {
    const distance = Math.hypot(to.x - from.x, to.y - from.y);
    const steps = Math.max(1, Math.ceil(distance / Math.max(1, size / 5)));
    for (let step = 0; step < steps; step++) {
      const x = from.x + ((to.x - from.x) * (step + 1)) / steps;
      const y = from.y + ((to.y - from.y) * (step + 1)) / steps;
      for (let dot = 0; dot < Math.max(6, size * 1.3); dot++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * size;
        context.globalAlpha = 0.2 + Math.random() * 0.5;
        context.fillRect(
          x + Math.cos(angle) * radius,
          y + Math.sin(angle) * radius,
          1.5,
          1.5,
        );
      }
    }
  } else {
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    if (from.x === to.x && from.y === to.y) {
      context.beginPath();
      context.arc(to.x, to.y, context.lineWidth / 2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

export function drawShape(context, start, end, { tool, color, size }) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = Math.max(2, size / 3);
  context.lineCap = "round";
  context.lineJoin = "round";
  context.beginPath();
  if (tool === "rectangle") {
    context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
  } else if (tool === "circle") {
    context.ellipse(
      (start.x + end.x) / 2,
      (start.y + end.y) / 2,
      Math.abs(end.x - start.x) / 2,
      Math.abs(end.y - start.y) / 2,
      0,
      0,
      Math.PI * 2,
    );
  } else {
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
  }
  context.stroke();
  context.restore();
}
