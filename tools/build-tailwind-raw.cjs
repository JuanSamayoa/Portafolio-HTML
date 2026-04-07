#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");

async function build() {
  const input = path.resolve(__dirname, "..", "src", "styles", "global.css");
  const outDir = path.resolve(__dirname, "..", "tmp");
  const outFile = path.join(outDir, "tailwind-raw.css");
  const css = fs.readFileSync(input, "utf8");
  const result = await postcss([
    tailwind({ config: path.resolve(__dirname, "..", "tailwind.config.cjs") }),
    autoprefixer,
  ]).process(css, { from: input });
  const outCss = result.css;
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, outCss, "utf8");
  console.log("Wrote", outFile);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
