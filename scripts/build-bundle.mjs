#!/usr/bin/env node
/**
 * Regenerates caelestiavoid.bundle.theme.css — a self-contained, offline
 * version of the theme (metadata header + src/main.css + src/caelestiavoid.css
 * + the :root block from caelestiavoid.theme.css).
 *
 * Usage: node scripts/build-bundle.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const main = read("src/main.css");
const layer = read("src/caelestiavoid.css");
const theme = read("caelestiavoid.theme.css");

const rootBlock = theme
  .replace(/^\/\*\*[\s\S]*?\*\/\s*/, "")
  .replace(/@import[^;]*;\s*/g, "")
  .trim();

if (!/^:root\s*\{/.test(rootBlock)) {
  throw new Error("Failed to extract :root block from caelestiavoid.theme.css");
}

const header = `/**
 * @name CaelestiaVOID Bundle
 * @author CaelestiaVOID
 * @version 1.1
 * @description Self-contained Liquid Glass + Caelestia palette for Discord on Mica. No remote imports — works offline.
 * @source https://github.com/Lhordstarr/Discord-Mica (based on Discord Mica by Coolkie)
 * @website https://discord-mica.pages.dev
 */

/* AUTO-GENERATED — do not edit by hand. Regenerate with:
   node scripts/build-bundle.mjs  */

`;

writeFileSync(
  join(root, "caelestiavoid.bundle.theme.css"),
  header + main + "\n\n/* ==== CaelestiaVOID layer ==== */\n\n" + layer + "\n\n/* ==== theme variables ==== */\n\n" + rootBlock + "\n",
);
console.log("bundle regenerated");