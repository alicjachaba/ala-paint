// Nowe części korzystają z tej samej ramki 100 × 100 co oczy, uszy i łapy.
export function drawAnimalPart(
  context,
  { tool, variant, color, oval, path, line },
) {
  const pink = "#ffc5d9";
  const cream = "#fff4df";
  const dark = "#49334b";
  const heart = "M 0 37 C -65 -3 -37 -49 0 -21 C 37 -49 65 -3 0 37 Z";
  // Lustrzane części mają taki sam rozmiar i spotykają się w środku.
  const pair = (draw) => {
    for (const side of [-1, 1]) {
      context.save();
      context.scale(side, 1);
      draw();
      context.restore();
    }
  };

  if (tool === "nose") {
    if (variant === "triangle")
      path("M -37 -22 Q 0 -32 37 -22 Q 23 10 0 31 Q -23 10 -37 -22 Z");
    if (variant === "heart") path(heart);
    if (variant === "dog") {
      path(
        "M -40 -7 Q -41 -35 0 -32 Q 41 -35 40 -7 Q 29 27 0 32 Q -29 27 -40 -7 Z",
      );
      oval(-19, 1, 7, 5, dark);
      oval(19, 1, 7, 5, dark);
      line("M 0 15 L 0 30");
    }
    if (variant === "pig") {
      oval(0, 0, 42, 30, color);
      oval(-17, 0, 8, 14, pink);
      oval(17, 0, 8, 14, pink);
    }
    if (variant === "bunny") {
      path(
        "M -29 -10 Q -19 -32 0 -15 Q 19 -32 29 -10 Q 17 9 0 24 Q -17 9 -29 -10 Z",
      );
      line("M 0 24 L 0 39 M -12 36 Q 0 44 12 36");
    }
    if (variant === "beak") {
      path("M -36 10 L 0 -39 L 36 10 L 0 39 Z");
      line("M -36 10 Q 0 0 36 10");
    }
  } else if (tool === "muzzle") {
    if (variant === "frog") {
      oval(0, 0, 44, 30, color);
      line("M -32 -3 Q 0 35 32 -3");
      oval(-32, -5, 3, 3, pink);
      oval(32, -5, 3, 3, pink);
    } else {
      if (variant === "bear") oval(0, 5, 39, 34, color);
      else {
        oval(-19, 5, 25, variant === "lion" ? 34 : 23, color);
        oval(19, 5, 25, variant === "lion" ? 34 : 23, color);
      }
      if (variant === "dog")
        path("M -13 19 L 13 19 L 13 34 Q 0 53 -13 34 Z", pink);
      if (variant === "bunny") {
        path("M -13 20 L 13 20 L 11 43 L -11 43 Z", "#fff");
        line("M 0 22 L 0 42");
      }
      path("M -13 -13 Q 0 -22 13 -13 L 0 0 Z", pink);
      line("M 0 0 L 0 13 Q -12 27 -23 13 M 0 13 Q 12 27 23 13");
      if (variant === "cat" || variant === "lion") {
        for (const x of [-31, -22, 22, 31]) oval(x, 2, 1.5, 1.5, dark);
      }
    }
  } else if (tool === "whiskers") {
    context.lineWidth = 4;
    pair(() => {
      for (const y of [-18, 0, 18]) {
        if (variant === "curly")
          line(
            `M 9 ${y / 2} Q 40 ${y - 18} 44 ${y} Q 45 ${y + 12} 34 ${y + 7}`,
          );
        else if (variant === "curved")
          line(`M 9 ${y / 2} Q 28 ${y - 17} 46 ${y + 8}`);
        else {
          const end = variant === "short" ? 30 : 46;
          const spread = variant === "long" ? 1.7 : 1;
          line(`M 9 ${y / 2} L ${end} ${y * spread}`);
        }
      }
      if (variant === "dots")
        for (const y of [-12, 0, 12]) oval(3, y, 2, 2, color);
    });
  } else if (tool === "horns") {
    if (variant === "unicorn") {
      path("M -19 43 L 0 -46 L 19 43 Z");
      line("M -14 21 L 17 32 M -10 3 L 12 12 M -6 -15 L 8 -8");
    } else
      pair(() => {
        if (variant === "goat") path("M 8 40 Q 7 -9 39 -45 Q 22 0 27 40 Z");
        if (variant === "bull") path("M 6 23 Q 41 27 43 -39 Q 61 33 12 43 Z");
        if (variant === "ram") {
          oval(26, 0, 21, 34, color);
          line("M 27 24 Q 4 9 20 -16 Q 36 -29 37 0 Q 35 17 25 7 Q 19 1 27 -5");
        }
        if (variant === "deer") {
          path(
            "M 13 43 L 13 -8 L 4 -25 L 9 -29 L 20 -14 L 26 -33 L 24 -46 L 30 -46 L 34 -30 L 42 -39 L 46 -34 L 31 -17 L 24 0 L 24 43 Z",
          );
        }
        if (variant === "giraffe") {
          path("M 17 39 L 16 -19 L 30 -19 L 32 39 Z");
          oval(23, -27, 14, 15, color);
        }
      });
  } else if (tool === "wings") {
    pair(() => {
      if (variant === "butterfly") {
        path("M 3 4 C 11 -49 48 -52 46 -12 Q 45 2 29 9 C 64 38 16 59 3 4 Z");
        oval(28, -17, 9, 13, pink);
        oval(25, 28, 7, 8, cream);
      } else if (variant === "bee") {
        oval(25, -16, 20, 28, color);
        oval(23, 25, 16, 19, cream);
        line("M 9 2 L 35 -30 M 9 7 L 31 32");
      } else if (variant === "bat" || variant === "dragon") {
        path(
          variant === "bat"
            ? "M 3 32 L 17 -34 L 47 -44 L 43 16 Q 30 -3 24 26 Q 13 9 3 32 Z"
            : "M 3 39 L 12 -45 L 47 -19 L 37 -6 L 46 13 L 26 12 L 28 34 L 16 24 Z",
        );
        line("M 3 32 L 17 -34 L 43 16 M 17 -34 L 24 26");
      } else {
        path(
          variant === "bird"
            ? "M 3 35 Q 5 -9 46 -43 Q 49 -16 34 0 Q 55 -16 42 9 Q 32 25 3 35 Z"
            : "M 3 38 Q 0 -20 34 -46 Q 45 -46 36 -22 Q 56 -41 44 -9 Q 54 -18 45 7 Q 37 30 3 38 Z",
        );
        line("M 9 27 Q 24 4 36 -15 M 13 29 Q 29 16 37 7");
      }
    });
  } else if (tool === "fins") {
    const silhouettes = {
      shark: "M -43 38 Q -8 9 3 -44 Q 16 -21 20 10 Q 26 29 43 38 Z",
      fish: "M -42 26 Q -6 -2 27 -42 L 38 -19 L 29 -9 L 44 3 L 32 13 L 43 29 Q 0 45 -42 26 Z",
      dolphin: "M -39 39 Q -9 11 -11 -41 Q 17 -44 22 -6 Q 21 27 42 39 Z",
      goldfish:
        "M -41 0 Q -7 -16 33 -43 Q 53 -14 29 0 Q 53 14 33 43 Q -7 16 -41 0 Z",
      seal: "M -23 -39 Q 1 -45 20 -26 L 39 24 Q 41 45 24 39 Q 15 50 6 39 Q -7 49 -14 33 Z",
      whale:
        "M 0 15 Q -20 -36 -46 -32 Q -44 21 -13 26 L 0 42 L 13 26 Q 44 21 46 -32 Q 20 -36 0 15 Z",
    };
    path(silhouettes[variant]);
    if (variant === "fish")
      line("M -28 24 L 26 -25 M -28 24 L 29 4 M -28 24 L 26 27");
    if (variant === "goldfish")
      line("M -28 0 L 26 -25 M -28 0 L 29 0 M -28 0 L 26 27");
    if (variant === "seal") line("M 2 -8 L 24 38 M -6 0 L 6 38");
  } else if (tool === "mane") {
    if (variant === "horse") {
      path(
        "M -14 -43 Q 40 -39 29 0 L 43 26 L 26 22 L 32 44 L -15 34 Q 4 9 -15 -9 Q -43 -25 -14 -43 Z",
      );
      line("M 0 -28 Q 22 -8 11 15 L 21 31");
    } else if (variant === "zebra") {
      path(
        "M -19 44 L -25 -35 L -10 -46 L -5 -32 L 6 -46 L 12 -31 L 26 -38 L 21 44 Z",
      );
      for (const x of [-13, -2, 9]) line(`M ${x} -24 L ${x + 4} 35`);
    } else {
      const count = variant === "ruff" ? 10 : variant === "spiky" ? 16 : 12;
      context.beginPath();
      for (let i = 0; i < count * 2; i++) {
        const angle = (i * Math.PI) / count;
        const radius = i % 2 ? (variant === "fluffy" ? 40 : 33) : 47;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * (variant === "ruff" ? 0.7 : 1);
        if (!i) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
      // Środek pozostaje pusty, więc grzywa może otoczyć narysowaną głowę.
      context.moveTo(25, 0);
      context.ellipse(
        0,
        0,
        25,
        variant === "ruff" ? 17 : 28,
        0,
        0,
        Math.PI * 2,
      );
      context.fillStyle = color;
      context.fill("evenodd");
      context.stroke();
      if (variant === "lion")
        for (let i = 0; i < 12; i++) {
          const a = (i * Math.PI) / 6;
          line(
            `M ${Math.cos(a) * 31} ${Math.sin(a) * 34} L ${Math.cos(a) * 40} ${Math.sin(a) * 40}`,
          );
        }
    }
  } else if (tool === "belly") {
    if (variant === "heart") path(heart);
    else if (variant === "fluffy")
      path(
        "M 0 -44 L 12 -34 L 26 -39 L 29 -23 L 42 -18 L 36 -3 L 45 12 L 31 21 L 28 38 L 12 35 L 0 46 L -12 35 L -28 38 L -31 21 L -45 12 L -36 -3 L -42 -18 L -29 -23 L -26 -39 L -12 -34 Z",
      );
    else {
      oval(0, 0, 36, 45, color);
      if (variant === "striped")
        for (const y of [-24, -8, 8, 24])
          line(`M -26 ${y} Q 0 ${y + 12} 26 ${y}`);
      if (variant === "spotted")
        for (const [x, y] of [
          [0, -27],
          [-18, -10],
          [18, -8],
          [0, 11],
          [-15, 28],
          [16, 29],
        ])
          oval(x, y, 6, 7, cream);
      if (variant === "shell") {
        path("M 0 -25 L 20 -13 L 20 13 L 0 25 L -20 13 L -20 -13 Z");
        line(
          "M 0 -25 L 0 -44 M 20 -13 L 32 -22 M 20 13 L 32 22 M 0 25 L 0 44 M -20 13 L -32 22 M -20 -13 L -32 -22",
        );
      }
    }
  }
}
