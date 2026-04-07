const fs = require("node:fs");
const path = require("node:path");
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");
const autoprefixer = require("autoprefixer");

async function build() {
  const input = path.resolve(__dirname, "..", "src", "styles", "global.css");
  const outDirPublic = path.resolve(__dirname, "..", "public", "assets");
  const outDirTmp = path.resolve(__dirname, "..", "tmp");
  const outFile = path.join(outDirPublic, "tailwind.css");
  const rawFile = path.join(outDirTmp, "tailwind-raw.css");
  const css = fs.readFileSync(input, "utf8");

  // Build using Tailwind's PostCSS plugin and autoprefixer
  const result = await postcss([
    tailwind({ config: path.resolve(__dirname, "..", "tailwind.config.cjs") }),
    autoprefixer,
  ]).process(css, {
    from: input,
  });

  const rawCss = result.css;

  // Keep raw output for debugging
  if (!fs.existsSync(outDirTmp)) fs.mkdirSync(outDirTmp, { recursive: true });
  fs.writeFileSync(rawFile, rawCss, "utf8");

  // Apply stable, narrow sanitization fixes to ensure valid CSS output
  // 1) Replace known 'infinity' calc artefacts
  let outCss = rawCss.replaceAll(
    /calc\(\s*infinity\s*\*\s*1px\s*\)/gi,
    "9999px",
  );

  // 2) Remove empty fallback commas inside var(...) that produce `var(--x,)`
  outCss = outCss.replaceAll(/,\s*\)/g, ")");

  // 3) Convert percent-based --tw-scale-* variables into decimals (e.g. 95% -> 0.95)
  outCss = outCss.replaceAll(
    /(--tw-scale-[xyz]\s*:\s*)(\d+(?:\.\d+)?)%/g,
    (_m, pfx, n) => {
      return pfx + (Number(n) / 100).toString();
    },
  );

  // 4) Normalize any direct scale(...) calls that use percent values
  outCss = outCss.replaceAll(/scale\(\s*(\d+(?:\.\d+)?)%\s*\)/g, (_m, n) => {
    return "scale(" + (Number(n) / 100).toString() + ")";
  });

  if (!fs.existsSync(outDirPublic))
    fs.mkdirSync(outDirPublic, { recursive: true });
  fs.writeFileSync(outFile, outCss, "utf8");
  console.log("Wrote", rawFile);
  console.log("Wrote", outFile);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
