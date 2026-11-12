import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  checkLocalReferences,
  collectReferences,
  isLocalReference,
} from "../tools/check-local-references.mjs";

const CHECKER = fileURLToPath(
  new URL("../tools/check-local-references.mjs", import.meta.url),
);

async function createDistFixture() {
  const dist = await mkdtemp(path.join(tmpdir(), "portfolio-refs-"));
  await mkdir(path.join(dist, "thanks"), { recursive: true });
  await mkdir(path.join(dist, "img"), { recursive: true });
  await mkdir(path.join(dist, "media"), { recursive: true });

  await writeFile(path.join(dist, "thanks", "index.html"), "<html></html>");
  for (const file of ["favicon.ico", "og-image.png", "site.webmanifest"]) {
    await writeFile(path.join(dist, file), "fixture");
  }
  for (const file of ["a.png", "a@2x.png"]) {
    await writeFile(path.join(dist, "img", file), "fixture");
  }
  await writeFile(path.join(dist, "media", "poster.png"), "fixture");

  return dist;
}

test("ignora protocolos externos, anclas y datos", () => {
  for (const reference of [
    "https://example.com/a",
    "//cdn.example.com/a",
    "mailto:test@example.com",
    "tel:+50200000000",
    "data:image/png;base64,AAAA",
    "#seccion",
    "",
  ]) {
    assert.equal(isLocalReference(reference), false, reference);
  }

  for (const reference of ["/", "/thanks/", "./img/a.png", "../favicon.ico"]) {
    assert.equal(isLocalReference(reference), true, reference);
  }
});

test("acepta href, srcset, poster, manifest e imágenes sociales locales", async () => {
  const dist = await createDistFixture();
  try {
    await writeFile(
      path.join(dist, "index.html"),
      `<!doctype html>
      <html>
        <head>
          <link rel="icon" href="/favicon.ico">
          <link rel="manifest" href="/site.webmanifest">
          <meta property="og:image" content="/og-image.png">
          <meta name="twitter:image" content="/og-image.png">
        </head>
        <body>
          <a href="/thanks/">gracias</a>
          <a href="mailto:test@example.com">email</a>
          <a href="#seccion">ancla</a>
          <a href="https://example.com">externo</a>
          <img src="/img/a.png" srcset="/img/a.png 1x, /img/a@2x.png 2x">
          <img src="data:image/png;base64,AAAA">
          <video poster="/media/poster.png"></video>
        </body>
      </html>`,
    );

    const result = await checkLocalReferences({ distDir: dist, base: "/" });
    assert.deepEqual(result.broken, []);
    assert.ok(result.checked >= 8, `referencias comprobadas: ${result.checked}`);
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test("detecta href, srcset, poster y Open Graph rotos", async () => {
  const dist = await createDistFixture();
  try {
    await writeFile(
      path.join(dist, "index.html"),
      `<!doctype html>
      <html>
        <head>
          <meta property="og:image" content="/missing-og.png">
        </head>
        <body>
          <a href="/missing/">roto</a>
          <img src="/img/missing.png">
          <img srcset="/img/a.png 1x, /img/missing@2x.png 2x">
          <video poster="/media/missing.png"></video>
          <a href="https://example.com">externo</a>
          <a href="mailto:test@example.com">email</a>
          <a href="#ancla">ancla</a>
        </body>
      </html>`,
    );

    const result = await checkLocalReferences({ distDir: dist, base: "/" });
    assert.equal(result.broken.length, 5);
    assert.deepEqual(
      result.broken.map((item) => item.reference).sort(),
      [
        "/img/missing.png",
        "/img/missing@2x.png",
        "/media/missing.png",
        "/missing-og.png",
        "/missing/",
      ],
    );
    assert.ok(result.broken.every((item) => item.file === "index.html"));
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test("respeta el base configurado por Astro", async () => {
  const dist = await createDistFixture();
  try {
    await mkdir(path.join(dist, "repo"), { recursive: true });
    await writeFile(path.join(dist, "repo", "site.webmanifest"), "{}");
    await writeFile(
      path.join(dist, "repo", "index.html"),
      `<link rel="manifest" href="/repo/site.webmanifest">`,
    );

    const result = await checkLocalReferences({
      distDir: dist,
      base: "/repo/",
    });
    assert.deepEqual(result.broken, []);
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test("el CLI devuelve código de salida distinto de cero ante una referencia rota", async () => {
  const dist = await createDistFixture();
  try {
    await writeFile(
      path.join(dist, "index.html"),
      `<a href="/missing/">roto</a>`,
    );

    const exitCode = await new Promise((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [CHECKER, "--dist", dist, "--base", "/"],
        { stdio: "ignore" },
      );
      child.on("error", reject);
      child.on("close", resolve);
    });

    assert.notEqual(exitCode, 0);
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test("collectReferences extrae solo atributos relevantes", () => {
  const references = collectReferences(
    `<a href="/a" data-href="/ignored">a</a>
     <img src="/b" srcset="/c 1x, /d 2x">
     <video poster="/e"></video>
     <meta property="og:image" content="/f">
     <meta name="description" content="no es una imagen">`,
  );

  assert.deepEqual(
    references.map((item) => item.reference),
    ["/a", "/b", "/c", "/d", "/e", "/f"],
  );
});
