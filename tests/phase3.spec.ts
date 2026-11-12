import { expect, test, type Page } from "@playwright/test";

const responsiveViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 941, height: 900 },
  { width: 960, height: 900 },
  { width: 1024, height: 900 },
  { width: 1080, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
];

const narrowViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
];

async function waitForFonts(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

async function expectHomeAnchor(page: Page, hash: string) {
  const url = new URL(page.url());
  expect(url.pathname).toBe("/");
  expect(url.hash).toBe(`#${hash}`);
  await expect(page.locator(`#${hash}`)).toBeVisible();
}

test("hero: la tarjeta queda dentro del viewport y sin recorte interno", async ({
  page,
}) => {
  for (const { width, height } of responsiveViewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await waitForFonts(page);

    const geometry = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>(".hero-card");
      const title = document.querySelector<HTMLElement>(".hero-title");
      if (!card || !title) throw new Error("Faltan elementos del hero");

      const cardRect = card.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const range = document.createRange();
      let titleTextRight = titleRect.left;
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);

      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? "";
        for (const match of text.matchAll(/\S+/g)) {
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          for (const rect of range.getClientRects()) {
            titleTextRight = Math.max(titleTextRight, rect.right);
          }
        }
      }

      return {
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        card: {
          left: cardRect.left,
          right: cardRect.right,
          width: cardRect.width,
          scrollWidth: card.scrollWidth,
          clientWidth: card.clientWidth,
          scrollHeight: card.scrollHeight,
          clientHeight: card.clientHeight,
        },
        titleTextRight,
      };
    });

    expect(geometry.documentWidth, `documento a ${width}px`).toBeLessThanOrEqual(
      geometry.viewportWidth + 1,
    );
    expect(geometry.card.width, `ancho positivo a ${width}px`).toBeGreaterThan(0);
    expect(geometry.card.left, `borde izquierdo a ${width}px`).toBeGreaterThanOrEqual(0);
    expect(geometry.card.right, `borde derecho a ${width}px`).toBeLessThanOrEqual(
      geometry.viewportWidth + 0.5,
    );
    expect(geometry.card.scrollWidth, `recorte horizontal a ${width}px`).toBeLessThanOrEqual(
      geometry.card.clientWidth + 1,
    );
    expect(geometry.card.scrollHeight, `recorte vertical a ${width}px`).toBeLessThanOrEqual(
      geometry.card.clientHeight + 1,
    );

    if (width > 940) {
      expect(
        geometry.titleTextRight,
        `el título no debe invadir la tarjeta a ${width}px`,
      ).toBeLessThanOrEqual(geometry.card.left + 1);
    }
  }
});

test("hero: Automation y las demás palabras no se dividen a 320–390 px", async ({
  page,
}) => {
  for (const { width, height } of narrowViewports) {
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await waitForFonts(page);

    const result = await page.evaluate(() => {
      const title = document.querySelector<HTMLElement>(".hero-title");
      if (!title) throw new Error("Falta el título del hero");

      const range = document.createRange();
      const splitWords: string[] = [];
      const overflowingWords: string[] = [];
      const automationLines: number[] = [];
      const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);

      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const text = node.textContent ?? "";
        for (const match of text.matchAll(/\S+/g)) {
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          const rects = [...range.getClientRects()].filter(
            (rect) => rect.width > 0 && rect.height > 0,
          );
          if (rects.length !== 1) splitWords.push(match[0]);
          if (rects.some((rect) => rect.right > title.getBoundingClientRect().right + 1)) {
            overflowingWords.push(match[0]);
          }
          if (match[0] === "Automation") {
            automationLines.push(...rects.map((rect) => Math.round(rect.top)));
          }
        }
      }

      return {
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        fontSize: Number.parseFloat(getComputedStyle(title).fontSize),
        splitWords,
        overflowingWords,
        automationLines,
      };
    });

    expect(result.documentWidth, `sin scroll horizontal a ${width}px`).toBeLessThanOrEqual(
      result.viewportWidth + 1,
    );
    expect(result.fontSize, `tamaño legible a ${width}px`).toBeGreaterThanOrEqual(38);
    expect(result.splitWords, `palabras divididas a ${width}px`).toEqual([]);
    expect(result.overflowingWords, `palabras desbordadas a ${width}px`).toEqual([]);
    expect(new Set(result.automationLines).size, `Automation en una línea a ${width}px`).toBe(1);
  }
});

test("navegación desde /toolkit/sql: anclas absolutas, logo y estado activo", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/toolkit/sql");

  await expect(page.locator(".nav-links a.active")).toHaveCount(0);
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
  ).toBe("auto");
  await expect(page.locator(".nav-links a").first()).toHaveAttribute(
    "href",
    "/#impacto",
  );
  await expect(page.locator(".nav-logo")).toHaveAttribute("href", "/");
  await expect(page.locator(".nav-cta")).toHaveAttribute("href", "/#contacto");

  await page.locator('.nav-links a[href="/#proyectos"]').click();
  await expectHomeAnchor(page, "proyectos");

  await page.goto("/toolkit/sql");
  await page.locator(".nav-logo").click();
  await expect(page).toHaveURL(/\/$/);
  expect(new URL(page.url()).hash).toBe("");
});

test("navegación desde /thanks/: destinos absolutos y sin estado activo falso", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/thanks/");

  await expect(page.locator(".nav-links a.active")).toHaveCount(0);
  await expect(page.locator('.nav-links a[href="/#experiencia"]')).toHaveCount(1);

  await page.locator('.nav-links a[href="/#experiencia"]').click();
  await expectHomeAnchor(page, "experiencia");
});

test("navegación desde /404.html: destinos absolutos y sin estado activo falso", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/404.html");

  await expect(page.locator(".nav-links a.active")).toHaveCount(0);
  await page.locator('.nav-links a[href="/#casos"]').click();
  await expectHomeAnchor(page, "casos");
});

test("navegación desde la home: anclas locales y scroll suave", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hrefs = await page
    .locator(".nav-links a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(hrefs.every((href) => href?.startsWith("#"))).toBe(true);
  await expect(page.locator(".nav-logo")).toHaveAttribute("href", "#hero");
  await expect(page.locator(".nav-cta")).toHaveAttribute("href", "#contacto");
  expect(
    await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
  ).toBe("smooth");

  await page.locator('.nav-links a[href="#proyectos"]').click();
  await expectHomeAnchor(page, "proyectos");
});

test("sin JavaScript: las anclas navegan desde la home y desde una ruta auxiliar", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  try {
    await page.goto("/toolkit/sql");
    await expect(page.locator(".nav-toggle")).toBeHidden();
    await expect(page.locator("#primary-navigation")).toBeVisible();
    await expect(page.locator('.nav-links a[href="/#proyectos"]')).toHaveCount(1);
    await page.locator('.nav-links a[href="/#proyectos"]').click();
    await expectHomeAnchor(page, "proyectos");

    await page.goto("/");
    await expect(page.locator('.nav-links a[href="#proyectos"]')).toHaveCount(1);
    await page.locator('.nav-links a[href="#proyectos"]').click();
    await expectHomeAnchor(page, "proyectos");
  } finally {
    await context.close();
  }
});

test("menú móvil en una ruta auxiliar: abre, navega y restaura el scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/toolkit/sql");

  const menu = page.locator("#primary-navigation");
  await page.locator(".nav-toggle").click();
  await expect(menu).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

  await page.locator('.nav-links a[href="/#certificaciones"]').click();
  await expectHomeAnchor(page, "certificaciones");
  await expect(menu).toBeHidden();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});
