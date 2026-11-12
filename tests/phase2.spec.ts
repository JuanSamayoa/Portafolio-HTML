import { expect, test, type Page } from "@playwright/test";

async function openFirstCertification(page: Page) {
  const trigger = page.locator(".cert-card-trigger").first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  return trigger;
}

test("modal: trampa de foco con Tab y Shift+Tab, cierre con Escape y restauración", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const trigger = await openFirstCertification(page);
  const dialog = page.locator("#cert-modal");
  const close = page.locator(".cert-modal-close");
  const link = page.locator("#modal-cert-link");

  await expect(dialog).toBeVisible();
  await expect(close).toBeFocused();

  // Ciclo completo hacia delante: cerrar -> verificar -> cerrar.
  await page.keyboard.press("Tab");
  await expect(link).toBeVisible();
  await expect(link).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();

  // Ciclo inverso: cerrar -> verificar -> cerrar.
  await page.keyboard.press("Shift+Tab");
  await expect(link).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(close).toBeFocused();

  // Ningún Tab adicional debe sacar el foco del diálogo.
  for (let index = 0; index < 4; index += 1) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document.querySelector("#cert-modal")?.contains(document.activeElement),
      ),
    ).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});

test("modal: cierre con botón, reapertura sin estado residual y retorno de foco", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const triggers = page.locator(".cert-card-trigger");
  const dialog = page.locator("#cert-modal");
  const title = page.locator("#modal-cert-title");
  const link = page.locator("#modal-cert-link");
  const noLink = page.locator("#modal-cert-no-link");

  await triggers.nth(0).focus();
  await page.keyboard.press("Enter");
  await expect(link).toBeVisible();
  await page.locator(".cert-modal-close").click();
  await expect(dialog).toBeHidden();
  await expect(triggers.nth(0)).toBeFocused();

  // Segunda certificación sin enlace público: no debe conservar el href anterior.
  await triggers.nth(1).focus();
  await page.keyboard.press("Enter");
  const expectedTitle = await triggers.nth(1).evaluate(
    (element) =>
      element
        .closest("article")
        ?.querySelector(".cert-name")
        ?.textContent?.trim() ?? "",
  );
  await expect(title).toHaveText(expectedTitle);
  await expect(link).toBeHidden();
  await expect(link).not.toHaveAttribute("href", /.+/);
  await expect(noLink).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(triggers.nth(1)).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");

  // Reapertura de la primera: recupera enlace y foco inicial correctos.
  await triggers.nth(0).click();
  await expect(page.locator(".cert-modal-close")).toBeFocused();
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", /capacitateparaelempleo/);
  await expect(noLink).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(triggers.nth(0)).toBeFocused();
});

test("modal: cierre mediante backdrop restaura foco y scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const trigger = await openFirstCertification(page);
  const dialog = page.locator("#cert-modal");
  await expect(dialog).toBeVisible();

  // Punto fuera del diálogo: el backdrop del <dialog> recibe el clic.
  await page.mouse.click(20, 300);

  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});

test("prefers-reduced-motion: reduce elimina movimiento y conserva el foco", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const motion = await page.locator(".nav-logo-dot").evaluate((element) => ({
    animationDuration: getComputedStyle(element).animationDuration,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  expect(parseFloat(motion.animationDuration)).toBeLessThanOrEqual(0.01);
  expect(motion.scrollBehavior).toBe("auto");

  const reveal = await page.locator(".reveal").first().evaluate((element) => ({
    opacity: getComputedStyle(element).opacity,
    transform: getComputedStyle(element).transform,
  }));
  expect(reveal.opacity).toBe("1");
  expect(reveal.transform).toBe("none");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const toggle = page.locator(".nav-toggle");
  await expect(toggle).toBeFocused();
  const outline = await toggle.evaluate((element) => {
    const style = getComputedStyle(element);
    return { style: style.outlineStyle, width: style.outlineWidth };
  });
  expect(outline.style).toBe("solid");
  expect(outline.width).toBe("2px");
});

test("sin JavaScript: contenido, navegación y destinos esenciales disponibles", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  try {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/no-js/);
    await expect(page.locator(".nav-toggle")).toBeHidden();
    await expect(page.locator("#primary-navigation")).toBeVisible();
    await expect(page.locator("#primary-navigation a")).toHaveCount(8);
    expect(
      await page
        .locator(".reveal")
        .first()
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe("1");

    // Los disparadores del modal no se ofrecen si no pueden operar.
    await expect(page.locator(".cert-card-trigger").first()).toBeHidden();
    const verifyLink = page.locator(".cert-card .cert-verify[href]").first();
    await expect(verifyLink).toBeVisible();
    expect(await verifyLink.getAttribute("href")).toMatch(/^https:\/\//);

    const projectLink = page.locator('#proyectos a[href^="http"]').first();
    await expect(projectLink).toBeVisible();
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();

    await page.locator('#primary-navigation a[href="#proyectos"]').click();
    await expect(page).toHaveURL(/#proyectos$/);
    expect(
      await page
        .locator("nav.site-nav")
        .evaluate((element) => getComputedStyle(element).position),
    ).toBe("static");
  } finally {
    await context.close();
  }
});

test("sin JavaScript: el SQL sigue legible y los controles dependientes se ocultan", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();

  try {
    await page.goto("/toolkit/sql");
    await expect(page.locator("pre").first()).toBeVisible();
    await expect(page.locator(".copy-btn").first()).toBeHidden();
    await expect(page.locator(".download-all-btn").first()).toBeHidden();
    await expect(page.locator(".back-link")).toBeVisible();
  } finally {
    await context.close();
  }
});
