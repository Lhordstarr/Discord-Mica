#!/usr/bin/env node
/**
 * Parses a Hyprland color scheme Lua file and outputs CSS custom properties.
 *
 * Reads ~/.config/hypr/scheme/current.lua (or a path specified via --input)
 * and writes CSS variables to stdout or a file specified via --output.
 *
 * The Lua file is expected to return a table with color values, e.g.:
 *   return {
 *       primary = "#f6987d",
 *       secondary = "#f5896a",
 *       background = "#130d0b",
 *       foreground = "#f9e0da",
 *   }
 *
 * Usage:
 *   node scripts/parse-scheme.mjs [--input <path>] [--output <path>]
 *   node scripts/parse-scheme.mjs > src/caelestia-scheme.css
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Parse arguments
const args = process.argv.slice(2);
let inputPath = join(homedir(), ".config", "hypr", "scheme", "current.lua");
let outputPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--input" && args[i + 1]) {
    inputPath = args[i + 1];
    i++;
  } else if (args[i] === "--output" && args[i + 1]) {
    outputPath = args[i + 1];
    i++;
  }
}

// Resolve ~ in path
if (inputPath.startsWith("~/")) {
  inputPath = join(homedir(), inputPath.slice(2));
}

/**
 * Parse a Lua table string into a JS object.
 * Handles: string values, number values, boolean values, nested tables.
 */
function parseLuaTable(lua) {
  const result = {};

  // Remove comments
  const cleaned = lua.replace(/--[^\n]*/g, "");

  // Find the table content between { and }
  const tableMatch = cleaned.match(/return\s*\{([\s\S]*)\}/);
  if (!tableMatch) {
    throw new Error("Could not find 'return { ... }' in Lua file");
  }

  const content = tableMatch[1];

  // Parse key-value pairs
  // Matches: key = "value" or key = number or key = true/false
  const kvRegex = /(\w+)\s*=\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[\d.]+|true|false)\s*,?/g;
  let match;

  while ((match = kvRegex.exec(content)) !== null) {
    const key = match[1];
    let value = match[2];

    // Remove quotes from string values
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

/**
 * Convert a Lua color scheme to CSS custom properties.
 */
function luaToCssVars(colors) {
  const lines = [":root {"];

  for (const [key, value] of Object.entries(colors)) {
    // Convert Lua key names to CSS custom property names
    // e.g., "primary" -> "--caelestia-primary"
    const cssVarName = `--caelestia-${key.replace(/_/g, "-")}`;
    lines.push(`  ${cssVarName}: ${value};`);
  }

  lines.push("}");
  return lines.join("\n");
}

// Main
try {
  if (!existsSync(inputPath)) {
    console.error(`Warning: Scheme file not found at ${inputPath}`);
    console.error("Falling back to default Caelestia palette.");
    // Output empty :root block — the theme's fallback values will be used
    const fallbackCss = `:root {
  /* Dynamic palette not available — using built-in Caelestia defaults */
}`;
    if (outputPath) {
      writeFileSync(outputPath, fallbackCss + "\n");
      console.log(`Written fallback to ${outputPath}`);
    } else {
      console.log(fallbackCss);
    }
    process.exit(0);
  }

  const luaContent = readFileSync(inputPath, "utf8");
  const colors = parseLuaTable(luaContent);

  if (Object.keys(colors).length === 0) {
    console.error("Warning: No colors found in scheme file.");
  }

  const cssOutput = luaToCssVars(colors);

  if (outputPath) {
    writeFileSync(outputPath, cssOutput + "\n");
    console.log(`Scheme parsed: ${inputPath} -> ${outputPath}`);
  } else {
    console.log(cssOutput);
  }
} catch (err) {
  console.error(`Error parsing scheme: ${err.message}`);
  process.exit(1);
}
