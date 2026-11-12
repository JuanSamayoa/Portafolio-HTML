import { expect, test, type Page } from "@playwright/test";

const mobileViewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
];
const desktopViewports = [
  { width: 960, height: 900 },
  { width: 1024, height: 900 },
  { width: 1080, height: 900 },
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
];

const targetViewports = [
  ...mobileViewports,
  ...desktopViewports,
];

async function setViewport(page: Page, width: number, height = 800) {
  await page.setViewportSize({ width, height });
}

async function contrastRatio(page: Page, selector: string): Promise<number> {
  return page.locator(selector).first().evaluate((el) => {
    const toRgb = (value: string) =>
      (value.match(/[\d.]+/g) ?? []).map(Number);

    const luminance = (rgb: number[]) => {
      const [r, g, b] = rgb.slice(0, 3).map((value) => {
        const channel = value / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    let node: Element | null = el;
    let backgrounds: number[][] = [];
    while (node) {
      const style = getComputedStyle(node);
      const gradientStops = style.backgroundImage.match(/rgba?\([^)]+\)/g);
      if (gradientStops && gradientStops.length > 0) {
        backgrounds = gradientStops.map((stop) => toRgb(stop).slice(0, 3));
        break;
      }
      const parts = toRgb(style.backgroundColor);
      if (parts.length >= 4 && parts[3] === 0) {
        node = node.parentElement;
        continue;
      }
      if (parts.length >= 3) {
        backgrounds = [parts.slice(0, 3)];
        break;
      }
      node = node.parentElement;
    }

    if (backgrounds.length === 0) backgrounds = [[255, 255, 255]];

    const foreground = toRgb(getComputedStyle(el).color);
    const ratios = backgrounds.map((background) => {
      const [hi, lo] = [luminance(foreground), luminance(background)].sort(
        (a, b) => b - a,
      );
      return (hi + 0.05) / (lo + 0.05);
    });
    return Math.min(...ratios);
  });
}

for (const { width, height } of mobileViewports) {
  test(`menú móvil a ${width}x${height}: teclado, foco y scroll`, async ({
    page,
  }) => {
    await setViewport(page, width, height);
    await page.goto("/");

    const toggle = page.locator(".nav-toggle");
    const menu = page.locator("#primary-navigation");

    await expect(toggle).toBeVisible();
    await expect(menu).toBeHidden();

    // Sin ratón: skip-link → logo → botón de menú
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(toggle).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await expect(menu.locator("a").first()).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(
      "hidden",
    );

    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });
}

test("menú móvil: el clic en un enlace cierra y navega", async ({ page }) => {
  await setViewport(page, 390, 844);
  await page.goto("/");

  await page.locator(".nav-toggle").click();
  await page.locator('#primary-navigation a[href="#casos"]').click();

  await expect(page.locator("#primary-navigation")).toBeHidden();
  await expect(page).toHaveURL(/#casos$/);
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

for (const { width, height } of desktopViewports) {
  test(`navegación de escritorio a ${width}px`, async ({ page }) => {
    await setViewport(page, width, height);
    await page.goto("/");

    await expect(page.locator(".nav-toggle")).toBeHidden();
    await expect(page.locator("#primary-navigation")).toBeVisible();
    await expect(page.locator("#primary-navigation a")).toHaveCount(8);
  });
}

test("modal: foco, Escape, scroll y descripción accesible", async ({ page }) => {
  await setViewport(page, 1440, 900);
  await page.goto("/");

  const trigger = page.locator(".cert-card-trigger").first();
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.locator("#cert-modal");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-labelledby", "modal-cert-title");
  await expect(dialog).toHaveAttribute("aria-describedby", "modal-cert-issuer");
  await expect(page.locator("#modal-cert-title")).not.toBeEmpty();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe("");
});

test("verificar no abre el modal, con ratón ni teclado", async ({
  page,
  context,
}) => {
  await context.route("https://**", (route) => route.abort());
  await setViewport(page, 1440, 900);
  await page.goto("/");

  const link = page.locator(".cert-card .cert-verify[href]").first();
  await expect(link).toHaveAttribute("href", /^https:\/\//);

  const clickPopup = page.waitForEvent("popup");
  await link.click();
  await (await clickPopup).close();
  await expect(page.locator("#cert-modal")).toBeHidden();

  await link.focus();
  const keyboardPopup = page.waitForEvent("popup");
  await page.keyboard.press("Enter");
  await (await keyboardPopup).close();
  await expect(page.locator("#cert-modal")).toBeHidden();
});

test("contraste WCAG de metadatos en fondos claros y oscuros", async ({
  page,
}) => {
  await setViewport(page, 1440, 900);
  await page.goto("/");

  const lightSelectors = [
    ".hero-card-role",
    ".exp-date",
    ".project-link.muted",
    ".cert-verify.muted",
  ];
  for (const selector of lightSelectors) {
    const ratio = await contrastRatio(page, selector);
    expect(ratio, `${selector} sobre fondo claro`).toBeGreaterThanOrEqual(4.5);
  }

  for (const selector of [".contact-desc", "footer .footer-inner div"]) {
    const ratio = await contrastRatio(page, selector);
    expect(ratio, `${selector} sobre fondo oscuro`).toBeGreaterThanOrEqual(4.5);
  }

  await page.locator(".cert-card-trigger").first().click();
  const modalRatio = await contrastRatio(page, "#modal-cert-date");
  expect(modalRatio, "fecha del modal sobre blanco").toBeGreaterThanOrEqual(4.5);
  await page.keyboard.press("Escape");
});

test("foco visible del botón de menú", async ({ page }) => {
  await setViewport(page, 390, 844);
  await page.goto("/");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const toggle = page.locator(".nav-toggle");
  await expect(toggle).toBeFocused();
  const outline = await toggle.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      style: style.outlineStyle,
      width: style.outlineWidth,
      color: style.outlineColor,
    };
  });

  expect(outline.style).toBe("solid");
  expect(outline.width).toBe("2px");
});
test("sin desbordamiento horizontal en los viewports objetivo", async ({ page }) => {
  for (const { width, height } of [...mobileViewports, ...desktopViewports]) {
    await setViewport(page, width, height);
    await page.goto("/");

    const ok = await page.evaluate(() => {
      const toPixels = (value) => parseFloat(value) || 0;
      const contentBox = (el) => {
        const box = el.getBoundingClientRect();
        const style = getComputedStyle(el);
        const left = box.left + toPixels(style.borderLeftWidth) + toPixels(style.paddingLeft);
        const right = box.right - toPixels(style.borderRightWidth) - toPixels(style.paddingRight);
        return { left, right };
      };
      const avgLineTop = (rects) => {
        if (!rects.length) return null;
        let sum = 0;
        for (const r of rects) sum += r.top;
        return sum / rects.length;
      };
      const rectsOfWord = (node, startOffset, endOffset) => {
        const range = document.createRange();
        range.setStart(node, startOffset);
        range.setEnd(node, endOffset);
        return [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
      };
      const wordRectsInTextNode = (node) => {
        const text = node.textContent ?? "";
        const re = /\S+/g;
        const out = [];
        let m;
        while ((m = re.exec(text))) {
          for (const r of rectsOfWord(node, m.index, m.index + m[0].length)) {
            out.push({ word: m[0], top: r.top, bottom: r.bottom, left: r.left, right: r.right });
          }
        }
        return out;
      };
      const wordRects = (el) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const out = [];
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          out.push(...wordRectsInTextNode(n));
        }
        return out;
      };
      const findWordRect = (el, word) => {
        const rects = wordRects(el).filter((r) => r.word === word);
        if (!rects.length) return null;
        const top = avgLineTop(rects);
        if (top === null) return null;
        const onSameLine = rects.filter((r) => Math.abs(r.top - top) <= 1);
        if (!onSameLine.length) return null;
        return {
          top,
          bottom: Math.max(...onSameLine.map((r) => r.bottom)),
          left: onSameLine[0].left,
          right: Math.max(...onSameLine.map((r) => r.right)),
        };
      };

      const container = document.querySelector(".container");
      const titleNode = document.querySelector(".hero-title");
      const titleTextNode = titleNode?.firstChild;
      const contactTitle = document.querySelector(".contact-title");

      const containerContentBox = container ? contentBox(container) : null;
      const titleContentBox = titleNode ? contentBox(titleNode) : null;
      const contactContentBox = contactTitle ? contentBox(contactTitle) : null;

      const allTitleRects = wordRects(titleNode);
      const titleWordsInside = allTitleRects.filter(
        (r) => containerContentBox && r.right <= containerContentBox.right + 1,
      );

      const allContactRects = contactTitle ? wordRects(contactTitle) : [];
      const contactWordsInside = allContactRects.filter(
        (r) => contactContentBox && r.right <= contactContentBox.right + 1,
      );

      const automationRect = titleTextNode ? findWordRect(titleNode, "Automation") : null;

      return {
        viewportWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        titleExists: !!titleNode,
        contactExists: !!contactTitle,
        titleInsideCount: titleWordsInside.length,
        titleWordCount: allTitleRects.length,
        contactInsideCount: contactWordsInside.length,
        contactWordCount: allContactRects.length,
        containerContentRight: containerContentBox ? containerContentBox.right : null,
        titleContentRight: titleContentBox ? titleContentBox.right : null,
        contactContentRight: contactContentBox ? contactContentBox.right : null,
        automationFound: !!automationRect,
        automationTop: automationRect?.top ?? null,
        automationBottom: automationRect?.bottom ?? null,
        automationLeft: automationRect?.left ?? null,
        automationRight: automationRect?.right ?? null,
      };
    });

    expect(ok.viewportWidth).toBe(width);
    expect(ok.documentScrollWidth).toBeLessThanOrEqual(ok.viewportWidth + 1);
    expect(ok.titleExists).toBe(true);
    expect(ok.contactExists).toBe(true);
    expect(ok.titleInsideCount).toBe(ok.titleWordCount);
    expect(ok.contactInsideCount).toBe(ok.contactWordCount);
    expect(ok.automationFound).toBe(true);
    expect(ok.automationTop).not.toBeNull();
    expect(ok.automationBottom).not.toBeNull();
    expect(ok.automationLeft).not.toBeNull();
    expect(ok.automationRight).not.toBeNull();
    expect(ok.automationRight).toBeLessThanOrEqual(ok.containerContentRight ?? Infinity);
    expect(ok.containerContentRight).toBeGreaterThanOrEqual(ok.titleContentRight ?? -Infinity - 1);
    expect(ok.containerContentRight).toBeGreaterThanOrEqual(ok.contactContentRight ?? -Infinity - 1);
  }
});

test("recursos corregidos: sin PDF roto ni favicon.svg", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.locator('a[href="/toolkit/playwright-quick-start.pdf"]'),
  ).toHaveCount(0);
  expect((await page.content()).includes("playwright-quick-start.pdf")).toBe(
    false,
  );

  expect((await request.get("/og-image.png")).status()).toBe(200);
  expect((await request.get("/favicon.ico")).status()).toBe(200);

  for (const path of ["/thanks/", "/404.html"]) {
    await page.goto(path);
    const image = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(image).toMatch(/\/og-image\.png$/);
    expect((await page.content()).includes("favicon.svg")).toBe(false);
  }
});

test("dataset SQL intacto tras eliminar el hint", async ({ page }) => {
  await page.goto("/toolkit/sql");
  const text = await page.locator("#sql-all-data").textContent();
  expect(text).toContain("WITH");
  const parsed = JSON.parse(text ?? "null");
  expect(typeof parsed).toBe("string");
  expect(parsed.length).toBeGreaterThan(100);

  for (const selector of [".sql-subtitle", ".sql-stats"]) {
    const ratio = await contrastRatio(page, selector);
    expect(ratio, `${selector} sobre el degradado`).toBeGreaterThanOrEqual(4.5);
  }
});
