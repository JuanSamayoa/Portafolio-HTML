#!/usr/bin/env node
/**
 * Comprueba que las referencias locales del HTML generado existan en dist/.
 *
 * Uso:
 *   node tools/check-local-references.mjs [--dist=dist] [--base=/]
 *
 * `base` se lee del literal `base` de astro.config.mjs para respetar la
 * configuración de Astro sin cargar el plugin de Vite.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const META_IMAGE_KEYS = new Set([
  "og:image",
  "og:image:url",
  "og:image:secure_url",
  "twitter:image",
  "twitter:image:src",
]);
const URL_ATTRIBUTES = ["href", "src", "poster"];

export function isLocalReference(value) {
  const reference = value.trim();
  if (!reference || reference.startsWith("#")) return false;
  if (reference.startsWith("//")) return false;
  if (/^(?:mailto|tel|data|javascript|blob):/i.test(reference)) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(reference)) return false;
  return true;
}

function parseAttributes(source) {
  const attributes = {};
  const attributePattern =
    /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

  for (const match of source.matchAll(attributePattern)) {
    const name = match[1].toLowerCase();
    attributes[name] = match[2] ?? match[3] ?? match[4] ?? "";
  }

  return attributes;
}

export function collectReferences(html) {
  const withoutInlineCode = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const references = [];

  for (const tagMatch of withoutInlineCode.matchAll(
    /<([a-z][\w:-]*)([^>]*)>/gi,
  )) {
    const tagName = tagMatch[1].toLowerCase();
    const attributes = parseAttributes(tagMatch[2]);

    for (const attribute of URL_ATTRIBUTES) {
      if (attributes[attribute]) {
        references.push({ attribute, reference: attributes[attribute] });
      }
    }

    for (const attribute of ["srcset", "imagesrcset"]) {
      const value = attributes[attribute];
      if (!value || /^\s*data:/i.test(value)) continue;
      for (const candidate of value.split(",")) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) references.push({ attribute, reference: url });
      }
    }

    if (tagName === "meta") {
      const key = (attributes.property ?? attributes.name ?? "").toLowerCase();
      if (META_IMAGE_KEYS.has(key) && attributes.content) {
        references.push({
          attribute: attributes.property ? "property" : "name",
          reference: attributes.content,
        });
      }
    }
  }

  return references;
}

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

export async function resolveReference(
  reference,
  htmlRelativePath,
  distDir,
  base = "/",
) {
  if (!isLocalReference(reference)) return null;

  const clean = reference.split("#")[0].split("?")[0];
  if (!clean) return null;

  let decoded;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    return {
      ok: false,
      resolved: clean,
      reason: "referencia con codificación URL inválida",
    };
  }

  const fromHtml = path.posix.dirname(
    htmlRelativePath.split(path.sep).join("/"),
  );
  const pathname = decoded.startsWith("/")
    ? decoded
    : path.posix.normalize(path.posix.join(fromHtml, decoded));

  const normalizedBase = `/${base.replace(/^\/+|\/+$/g, "")}/`;
  let rootRelative = pathname;
  if (normalizedBase !== "/") {
    const prefix = normalizedBase.slice(0, -1);
    if (rootRelative === prefix) rootRelative = "/";
    else if (rootRelative.startsWith(`${prefix}/`)) {
      rootRelative = rootRelative.slice(prefix.length);
    }
  }

  const relativePath = rootRelative.replace(/^\/+/, "");
  const absolutePath = path.resolve(distDir, relativePath);
  const pathFromDist = path.relative(distDir, absolutePath);
  if (pathFromDist.startsWith("..") || path.isAbsolute(pathFromDist)) {
    return {
      ok: false,
      resolved: relativePath,
      reason: "la ruta queda fuera de dist/",
    };
  }

  const candidates =
    !relativePath || relativePath.endsWith("/")
      ? [path.join(absolutePath, "index.html")]
      : [absolutePath];

  if (
    relativePath &&
    !relativePath.endsWith("/") &&
    !path.extname(relativePath)
  ) {
    candidates.push(`${absolutePath}.html`, path.join(absolutePath, "index.html"));
  }

  for (const candidate of candidates) {
    if (await isFile(candidate)) {
      return {
        ok: true,
        resolved: path.relative(distDir, candidate).split(path.sep).join("/"),
      };
    }
  }

  return {
    ok: false,
    resolved: path.relative(distDir, candidates[0]).split(path.sep).join("/"),
    reason: "el archivo no existe en dist/",
  };
}

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(entryPath)));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
  }

  return files.sort();
}

export async function checkLocalReferences({ distDir, base = "/" }) {
  const htmlFiles = await findHtmlFiles(distDir);
  const broken = [];
  let checked = 0;

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    const relativeFile = path
      .relative(distDir, htmlFile)
      .split(path.sep)
      .join("/");
    const seen = new Set();

    for (const { attribute, reference } of collectReferences(html)) {
      if (!isLocalReference(reference)) continue;
      const key = `${attribute}:${reference}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const result = await resolveReference(
        reference,
        relativeFile,
        distDir,
        base,
      );
      if (!result) continue;
      checked += 1;

      if (!result.ok) {
        broken.push({
          file: relativeFile,
          attribute,
          reference,
          resolved: result.resolved,
          reason: result.reason,
        });
      }
    }
  }

  return { htmlFiles: htmlFiles.length, checked, broken };
}

async function readConfiguredBase() {
  const configPath = path.join(PROJECT_ROOT, "astro.config.mjs");
  const source = await readFile(configPath, "utf8").catch(() => "");
  const match = source.match(/\bbase\s*:\s*["']([^"']+)["']/);
  return match?.[1] ?? "/";
}

function parseArgs(argv) {
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg.startsWith("--dist=")) options.dist = arg.slice("--dist=".length);
    else if (arg === "--dist") options.dist = argv[++index];
    else if (arg.startsWith("--base=")) options.base = arg.slice("--base=".length);
    else if (arg === "--base") options.base = argv[++index];
  }
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const distDir = path.resolve(options.dist ?? path.join(PROJECT_ROOT, "dist"));
  const base = options.base ?? (await readConfiguredBase());
  const result = await checkLocalReferences({ distDir, base });

  console.log(
    `Referencias locales: ${result.checked} en ${result.htmlFiles} archivos HTML (base "${base}").`,
  );

  if (result.broken.length === 0) {
    console.log("✓ Todas las referencias locales existen en dist/.");
    return;
  }

  console.error(`✗ ${result.broken.length} referencia(s) rota(s):`);
  for (const broken of result.broken) {
    console.error(
      `  ${broken.file}: ${broken.attribute}="${broken.reference}" -> ${broken.resolved} (${broken.reason})`,
    );
  }
  process.exitCode = 1;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`✗ No se pudo comprobar dist/: ${error.message}`);
    process.exitCode = 1;
  });
}
