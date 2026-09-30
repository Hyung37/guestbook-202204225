import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { exclude: process.env.VERIFY ? ["node_modules", ".next"] : ["node_modules", ".next", "tmp-verify/**"] },
});
