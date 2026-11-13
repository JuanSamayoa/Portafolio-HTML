import { expect, test } from "@playwright/test";

const blogUrl = "/blog/";
const articleUrl = "/blog/arquitectura-portafolio-astro/";
const sitemapUrl = "/sitemap.xml";
const rssUrl = "/rss.xml";

test("blog: el enlace al blog navega desde la home a /blog/", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");

  const blogLink = page.locator(".nav-actions a:has-text('blog')");
  await expect(blogLink).toBeVisible();

  await blogLink.click();
  await expect(page).toHaveURL(`${blogUrl}`);
});

test("blog: el enlace al blog abre el índice sin redirección extra", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.locator(".nav-actions a:has-text('blog')").click();
  await expect(page).toHaveURL(`${blogUrl}`);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});

test("blog: el índice muestra h1, subtítulo, contador y al menos una tarjeta publicada", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(blogUrl);

  await expect(page.locator("h1.blog-title")).toBeVisible();
  await expect(page.locator(".blog-subtitle")).toBeVisible();

  const count = await page.locator(".filter-status").textContent();
  expect(count, "contador del blog").toMatch(/\d+ artículos?/);

  const cards = page.locator(".post-card");
  await expect(cards.first()).toBeVisible();
  const cardCount = await cards.count();
  expect(cardCount, "al menos una tarjeta publicada").toBeGreaterThan(0);
});

test("blog: la vista sin JavaScript muestra contenido sin ocultar tarjetas", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  try {
    await page.goto(blogUrl);
    await expect(page.locator("h1.blog-title")).toBeVisible();
    await expect(page.locator(".post-card")).toHaveCount(1);
    await expect(page.locator(".post-card")).toBeVisible();
    await expect(page.locator(".post-card .post-title a")).toHaveAttribute("href", articleUrl);

    await page.locator("a:has-text('← volver al portafolio')").click();
    await expect(page).toHaveURL(/\/#proyectos$/);
  } finally {
    await context.close();
  }
});

test.describe("blog: filtro por tags", () => {
  test("desde el estado todos se activa un tag y se devuelve a todos", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(blogUrl);

    const astroChip = page.locator("button.filter-chip", { hasText: "Astro" });
    const todosChip = page.locator('button.filter-chip[data-tag="__all"]');
    const status = page.locator(".filter-status");

    await expect(astroChip).toBeVisible();
    await expect(todosChip).toHaveAttribute("aria-pressed", "true");

    const firstCount = (await status.textContent()) ?? "";
    expect(firstCount).toMatch(/\d+ artículos?/);

    await astroChip.click();
    await expect(astroChip).toHaveAttribute("aria-pressed", "true");
    await expect(todosChip).toHaveAttribute("aria-pressed", "false");

    const astroCount = (await status.textContent()) ?? "";
    expect(astroCount).toMatch(/\d+ artículos?/);

    await todosChip.click();
    await expect(todosChip).toHaveAttribute("aria-pressed", "true");
    await expect(astroChip).toHaveAttribute("aria-pressed", "false");
    const resetCount = (await status.textContent()) ?? "";
    expect(resetCount).toMatch(/\d+ artículos?/);
  });

  test("nuevos filtros no producen desbordamiento horizontal en móvil ni escritorio", async ({ page }) => {
    for (const { width, height } of [
      { width: 390, height: 844 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto(blogUrl);

      await page.locator("button.filter-chip", { hasText: "Performance" }).click();
      await page.locator('button.filter-chip[data-tag="__all"]').click();

      const scrollOverflows = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(scrollOverflows, `sin desbordamiento a ${width}px`).toBe(false);
    }
  });
});

test("articulo: carga sin errores de consola ni red y renderiza código", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(articleUrl);
  await expect(page.locator("h1.post-title")).toBeVisible();  const firstPre = page.locator(".prose pre").first();
  await expect(firstPre).toBeVisible();

  expect(errors, "sin errores de consola").toEqual([]);
});

test("articulo: el pie muestra copiar enlace y volver al blog", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(articleUrl);

  await expect(page.locator(".back-link")).toBeVisible();
  await expect(page.locator(".back-link")).toHaveAttribute("href", "/blog/");

  const copyButton = page.locator("button[data-copy-link]");
  await expect(copyButton).toBeVisible();
  await expect(copyButton).toHaveText("copiar enlace del artículo");
});

test("articulo: el enlace de regreso navega al índice del blog", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(articleUrl);

  await page.locator(".back-link").click();
  await expect(page).toHaveURL(blogUrl);
});

test("articulo: el pie aparece sobre fondo claro y borde superior", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(articleUrl);

  const footerRect = await page.locator(".post-footer").boundingBox();
  const footerBg = await page.evaluate(() => {
    const el = document.querySelector(".post-footer");
    return getComputedStyle(el).backgroundColor;
  });

  expect(footerRect, "pie del artículo visible").not.toBeNull();
  expect(footerBg).toBe("rgba(0, 0, 0, 0)");
  const borderTop = await page.locator(".post-footer").evaluate((el) => {
    const style = getComputedStyle(el);
    return style.borderTopStyle;
  });
  expect(borderTop).toBe("solid");
});

test("sitemap.xml: se sirve como XML y contiene la home, el índice y el artículo publicado", async ({ request }) => {
  const sitemap = await request.get(sitemapUrl);

  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toMatch(/xml/);

  const text = await sitemap.text();
  expect(text).toContain(`<loc>https://juan-samayoa.is-a.dev/</loc>`);
  expect(text).toContain(`<loc>https://juan-samayoa.is-a.dev/blog/</loc>`);
  expect(text).toContain(`<loc>https://juan-samayoa.is-a.dev/blog/arquitectura-portafolio-astro/</loc>`);
});

test("rss.xml: se sirve como XML con un item y título correctos", async ({ request }) => {
  const feed = await request.get(rssUrl);

  expect(feed.status()).toBe(200);
  expect(feed.headers()["content-type"]).toMatch(/xml/);

  const text = await feed.text();
  expect(text).toMatch(/<rss[ >]/);
  expect(text).toContain("<item>");
  expect(text).toContain("<title>Juan Samayoa — Blog Técnico</title>");
});
