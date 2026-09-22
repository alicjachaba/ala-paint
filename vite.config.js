import { readFile } from "node:fs/promises";
import { defineConfig } from "vite";

export default defineConfig({
  // Gotowa aplikacja może działać w dowolnym katalogu hostingu.
  base: "./",
  plugins: [
    {
      name: "licencja-lucide",
      async generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "LICENSE-lucide",
          source: await readFile(
            new URL("./src/vendor/LICENSE-lucide", import.meta.url),
            "utf8",
          ),
        });
      },
    },
  ],
});
