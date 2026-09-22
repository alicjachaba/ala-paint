import { copyFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { build } from "vite";

// Uruchamiamy tylko przy zmianie zestawu ikon lub wersji Lucide.
// Gotowa kopia pozostaje w repozytorium, żeby przeglądarka działała bez Vite.
const root = new URL("../", import.meta.url);
const license = await readFile(
  new URL("node_modules/lucide/LICENSE", root),
  "utf8",
);
await build({
  configFile: false,
  root: fileURLToPath(root),
  build: {
    outDir: "src/vendor",
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: fileURLToPath(new URL("icons-entry.js", import.meta.url)),
      formats: ["es"],
      fileName: () => "lucide.js",
    },
    rolldownOptions: {
      output: {
        banner: `/*! Lokalna kopia Lucide. Odświeżanie: npm run icons:update\n${license}\n*/`,
      },
    },
  },
});
await copyFile(
  new URL("node_modules/lucide/LICENSE", root),
  new URL("src/vendor/LICENSE-lucide", root),
);
