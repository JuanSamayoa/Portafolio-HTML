#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const aPath = path.resolve(process.argv[2] || "public/assets/tailwind.css");
const bPath = path.resolve(process.argv[3] || "tmp/tailwind-cli.css");

function readSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    console.error("ERROR: cannot read", p, e.message);
    process.exit(2);
  }
}

const a = readSafe(aPath).replaceAll("\r\n", "\n");
const b = readSafe(bPath).replaceAll("\r\n", "\n");

if (a === b) {
  console.log("IDENTICAL");
  process.exit(0);
}

const aLines = a.split("\n");
const bLines = b.split("\n");

let diffs = [];
for (let i = 0; i < Math.max(aLines.length, bLines.length); i++) {
  if (aLines[i] !== bLines[i]) {
    diffs.push({ line: i + 1, a: aLines[i] || "", b: bLines[i] || "" });
    if (diffs.length >= 20) break;
  }
}

const outPath = path.resolve("tmp/tailwind-diff.txt");
let out = "";
out += `Files: public/assets/tailwind.css vs tmp/tailwind-cli.css\n`;
out += `Differences: ${diffs.length} (showing up to 20)\n\n`;
for (const d of diffs) {
  out += `--- Line ${d.line}\n- public: ${d.a}\n+ cli:    ${d.b}\n\n`;
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, "utf8");
console.log("DIFFER");
console.log(`Wrote diff to ${outPath}`);
process.exit(0);
