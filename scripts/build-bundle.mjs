#!/usr/bin/env node
/**
 * Regenerates caelestia-void.bundle.theme.css — a self-contained, offline
 * version of the theme (metadata header + src/main.css + src/caelestia-void.css
 * + the :root block from caelestia-void.theme.css).
 *
 * Also parses the dynamic color scheme from ~/.config/hypr/scheme/current.lua
 * and inlines it as CSS custom properties.
 *
 * Usage: node scripts/build-bundle.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");

const main = read("src/main.css");
const layer = read("src/caelestia-void.css");
const theme = read("caelestia-void.theme.css");

// Parse dynamic color scheme from ~/.config/hypr/scheme/current.lua
function parseScheme() {
  const schemePath = join(homedir(), ".config", "hypr", "scheme", "current.lua");
  if (!existsSync(schemePath)) {
    return "/* Dynamic palette not available — using built-in Caelestia defaults */";
  }

  try {
    const lua = readFileSync(schemePath, "utf8");
    const cleaned = lua.replace(/--[^\n]*/g, "");
    const tableMatch = cleaned.match(/return\s*\{([\s\S]*)\}/);
    if (!tableMatch) return "/* Could not parse scheme file */";

    const content = tableMatch[1];
    const kvRegex = /(\w+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\d.]+|true|false)\s*,?/g;
    let match;
    const lines = [":root {"];

    while ((match = kvRegex.exec(content)) !== null) {
      const key = match[1];
      let value = match[2];
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      const cssVarName = `--caelestia-${key.replace(/_/g, "-")}`;
      lines.push(`  ${cssVarName}: ${value};`);
    }

    lines.push("}");
    return lines.join("\n");
  } catch {
    return "/* Error parsing scheme file */";
  }
}

const schemeCss = parseScheme();

const rootBlock = theme
  .replace(/^\/\*\*[\s\S]*?\*\/\s*/, "")
  .replace(/@import[^;]*;\s*/g, "")
  .trim();

if (!/^:root\s*\{/.test(rootBlock)) {
  throw new Error("Failed to extract :root block from caelestia-void.theme.css");
}

const header = `/**
 * @name Discord Caelestia Void Bundle
 * @author Discord Caelestia Void
 * @version 1.1
 * @description Self-contained Liquid Glass + Caelestia palette for Discord on Mica. No remote imports — works offline.
 * @source https://github.com/Lhordstarr/Discord-Mica (based on Discord Mica by Coolkie)
 * @website https://discord-mica.pages.dev
 */

/* AUTO-GENERATED — do not edit by hand. Regenerate with:
   node scripts/build-bundle.mjs  */

`;

writeFileSync(
  join(root, "caelestia-void.bundle.theme.css"),
  header + main + "\n\n/* ==== Dynamic palette (from ~/.config/hypr/scheme/current.lua) ==== */\n\n" + schemeCss + "\n\n/* ==== Discord Caelestia Void layer ==== */\n\n" + layer + "\n\n/* ==== theme variables ==== */\n\n" + rootBlock + "\n",
);
console.log("bundle regenerated");