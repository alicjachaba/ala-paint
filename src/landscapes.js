// Krajobrazy mają wspólny rozmiar 960 × 640 i jasny środek na własny rysunek.
function oval(ctx, x, y, rx, ry, color, angle = 0) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2);
  ctx.fill();
}

function polygon(ctx, points, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y) {
  oval(ctx, x, y, 68, 17, "#ffffff");
  oval(ctx, x - 18, y - 12, 29, 23, "#ffffff");
  oval(ctx, x + 19, y - 7, 33, 20, "#ffffff");
}

function water(ctx, top, color, depth) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, top);
  for (let x = 0; x < 960; x += 240) {
    ctx.bezierCurveTo(x + 80, top - depth, x + 160, top + depth, x + 240, top);
  }
  ctx.lineTo(960, 640);
  ctx.lineTo(0, 640);
  ctx.closePath();
  ctx.fill();
}

export function drawOcean(ctx) {
  oval(ctx, 765, 106, 48, 48, "#fff1ce");
  cloud(ctx, 155, 100);
  cloud(ctx, 480, 150);
  water(ctx, 300, "#deeff4", 14);
  water(ctx, 400, "#d2eaf0", 22);
  water(ctx, 515, "#c6e4eb", 30);
  ctx.strokeStyle = "#f4fcfc";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (const [x, y] of [
    [90, 360],
    [690, 445],
    [260, 555],
    [810, 585],
  ]) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + 25, y - 8, x + 55, y + 8, x + 90, y);
    ctx.stroke();
  }
  // Mała żaglówka zostawia środek oceanu dla pomysłów Ali.
  polygon(
    ctx,
    [
      [720, 322],
      [820, 322],
      [800, 341],
      [740, 341],
    ],
    "#d2cbdc",
  );
  ctx.fillStyle = "#c9c4d2";
  ctx.fillRect(766, 229, 4, 93);
  polygon(
    ctx,
    [
      [760, 236],
      [760, 313],
      [711, 313],
    ],
    "#fffdf7",
  );
  polygon(
    ctx,
    [
      [777, 252],
      [777, 313],
      [814, 313],
    ],
    "#f6e5dc",
  );
}

function coral(ctx, x, y, scale, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.lineWidth = 13;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const branch of [
    [
      [0, 0],
      [0, -110],
      [12, -144],
    ],
    [
      [0, -40],
      [-34, -70],
      [-36, -114],
    ],
    [
      [0, -63],
      [35, -88],
      [38, -132],
    ],
    [
      [-34, -70],
      [-61, -84],
      [-64, -110],
    ],
    [
      [35, -88],
      [64, -106],
    ],
  ]) {
    ctx.beginPath();
    branch.forEach(([bx, by], index) => {
      if (index === 0) ctx.moveTo(bx, by);
      else ctx.lineTo(bx, by);
    });
    ctx.stroke();
  }
  ctx.restore();
}

export function drawReef(ctx) {
  polygon(
    ctx,
    [
      [100, 0],
      [175, 0],
      [425, 510],
      [300, 510],
    ],
    "#f6fcfc",
  );
  polygon(
    ctx,
    [
      [460, 0],
      [500, 0],
      [730, 490],
      [650, 490],
    ],
    "#f6fcfc",
  );
  water(ctx, 500, "#dceff0", 25);
  oval(ctx, 450, 720, 730, 180, "#f4eddc");
  coral(ctx, 112, 570, 1.15, "#edcdd4");
  coral(ctx, 235, 600, 0.65, "#e9d6e8");
  coral(ctx, 808, 582, 0.95, "#f0d7bf");
  for (const [x, y] of [
    [37, 600],
    [895, 570],
    [939, 610],
  ]) {
    oval(ctx, x, y - 60, 13, 77, "#cbe4d9", -0.2);
    oval(ctx, x + 22, y - 43, 12, 59, "#d3e9df", 0.3);
  }
  oval(ctx, 680, 590, 70, 35, "#dcdbe9");
  oval(ctx, 715, 610, 46, 24, "#e6e1ec");
  ctx.strokeStyle = "#cce5e9";
  ctx.lineWidth = 3;
  for (const [x, y, r] of [
    [143, 317, 11],
    [169, 274, 7],
    [838, 362, 10],
    [859, 322, 6],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function building(ctx, x, bottom, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, bottom - height, width, height);
  ctx.fillStyle = "#faf9f3";
  for (let wx = x + 16; wx < x + width - 16; wx += 29) {
    for (let wy = bottom - height + 22; wy < bottom - 24; wy += 39) {
      ctx.fillRect(wx, wy, 12, 19);
    }
  }
}

export function drawCity(ctx) {
  oval(ctx, 742, 105, 46, 46, "#fff0d7");
  cloud(ctx, 185, 102);
  cloud(ctx, 530, 153);
  for (const [x, width, height] of [
    [0, 120, 215],
    [137, 95, 275],
    [250, 110, 180],
    [585, 95, 195],
    [695, 120, 245],
    [833, 127, 290],
  ]) {
    building(ctx, x, 470, width, height, "#e7e5ef");
  }
  building(ctx, 30, 520, 115, 223, "#e7d9e2");
  polygon(
    ctx,
    [
      [20, 297],
      [87, 252],
      [155, 297],
    ],
    "#d6cada",
  );
  building(ctx, 782, 520, 135, 185, "#d5e5e7");
  ctx.fillStyle = "#e2eddf";
  ctx.fillRect(0, 520, 960, 120);
  polygon(
    ctx,
    [
      [432, 520],
      [528, 520],
      [670, 640],
      [290, 640],
    ],
    "#eee5da",
  );
  for (const x of [200, 724]) {
    ctx.fillStyle = "#d6cebf";
    ctx.fillRect(x - 5, 442, 10, 96);
    oval(ctx, x, 425, 40, 51, "#cfe3cf");
    oval(ctx, x - 20, 443, 28, 32, "#d7e9d4");
  }
}

export function drawJungle(ctx) {
  oval(ctx, 630, 130, 49, 49, "#fcf3d5");
  oval(ctx, 470, 680, 760, 270, "#e3efdc");
  oval(ctx, 830, 725, 650, 255, "#d7e8ce");
  for (const [x, y, scale] of [
    [58, 530, 1.2],
    [211, 430, 0.8],
    [801, 465, 0.9],
    [936, 560, 1.25],
  ]) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    polygon(
      ctx,
      [
        [-12, 0],
        [-5, -300],
        [9, -300],
        [18, 0],
      ],
      "#dbd7bf",
    );
    for (const [dx, dy, angle] of [
      [-65, -305, 0.3],
      [61, -306, -0.3],
      [-48, -348, 0.65],
      [47, -350, -0.65],
    ]) {
      oval(ctx, dx, dy, 86, 26, "#d0e4c9", angle);
    }
    ctx.restore();
  }
  ctx.strokeStyle = "#c5ddbc";
  ctx.lineWidth = 5;
  for (const x of [115, 855]) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x - 35, 90, x + 45, 130, x, 223);
    ctx.stroke();
    oval(ctx, x + 9, 170, 13, 28, "#d2e6c9", 0.6);
  }
  for (const [x, y, direction] of [
    [35, 625, 1],
    [145, 650, 1],
    [827, 650, -1],
    [946, 614, -1],
  ]) {
    oval(ctx, x, y - 36, 31, 93, "#bfdcbd", direction * 0.6);
    oval(ctx, x + direction * 45, y - 10, 25, 72, "#cce3c4", direction);
  }
}

export function drawArctic(ctx) {
  oval(ctx, 757, 103, 43, 43, "#fff4da");
  cloud(ctx, 263, 117);
  polygon(
    ctx,
    [
      [0, 390],
      [148, 205],
      [310, 391],
      [454, 251],
      [621, 398],
      [802, 220],
      [960, 370],
      [960, 540],
      [0, 540],
    ],
    "#dbe8f2",
  );
  polygon(
    ctx,
    [
      [72, 300],
      [148, 205],
      [229, 298],
      [182, 278],
      [149, 292],
      [116, 275],
    ],
    "#ffffff",
  );
  polygon(
    ctx,
    [
      [384, 322],
      [454, 251],
      [521, 311],
      [474, 297],
      [447, 317],
      [421, 305],
    ],
    "#ffffff",
  );
  polygon(
    ctx,
    [
      [723, 301],
      [802, 220],
      [881, 295],
      [838, 279],
      [800, 299],
      [767, 277],
    ],
    "#ffffff",
  );
  water(ctx, 453, "#cfe6f0", 16);
  polygon(
    ctx,
    [
      [0, 419],
      [195, 443],
      [300, 493],
      [223, 534],
      [0, 558],
    ],
    "#fbfdff",
  );
  polygon(
    ctx,
    [
      [0, 558],
      [223, 534],
      [300, 493],
      [260, 551],
      [0, 580],
    ],
    "#dcecf5",
  );
  polygon(
    ctx,
    [
      [960, 427],
      [812, 465],
      [718, 506],
      [801, 528],
      [960, 507],
    ],
    "#fbfdff",
  );
  polygon(
    ctx,
    [
      [718, 506],
      [801, 528],
      [960, 507],
      [960, 530],
      [800, 547],
    ],
    "#dcecf5",
  );
  oval(ctx, 450, 768, 770, 181, "#fafdff");
  polygon(
    ctx,
    [
      [352, 550],
      [420, 539],
      [485, 554],
      [449, 567],
      [373, 565],
    ],
    "#fafdff",
  );
}
