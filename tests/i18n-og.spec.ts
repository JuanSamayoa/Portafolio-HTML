import { test, expect } from "@playwright/test";

test.describe("i18n + OG + reading UX", () => {
  test("language switcher toggles ES ↔ EN on the home page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    await page.getByRole("button", { name: /ES|EN/i }).locator("text=EN").click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("/en/ home page renders with lang=\"en\" and links the English CV", async ({
    page,
  }) => {
    await page.goto("/en/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("link", { name: /cv/i }).last(),
    ).toHaveAttribute("href", "/assets/cv/cv-juan-samayoa-en.pdf");
  });

  test("blog post renders a copy button inside each pre[data-copy-code]", async ({
    page,
  }) => {
    await page.goto("/blog/arquitectura-portafolio-astro/");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");

    const codeBlocks = page.locator("pre[data-copy-code]");
    await expect(codeBlocks).toHaveCount(1);

    const copyButtons = codeBlocks.locator(".copy-code");
    await expect(copyButtons).toHaveCount(1);
    await expect(copyButtons).toBeVisible();
    await expect(copyButtons).toHaveAttribute("aria-label", "Copiar código");
  });

  test("/en/blog post renders the copy button with EN aria-label", async ({
    page,
  }) => {
    await page.goto("/en/blog/arquitectura-portafolio-astro/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const codeBlocks = page.locator("pre[data-copy-code]");
    await expect(codeBlocks).toHaveCount(1);

    const copyButtons = codeBlocks.locator(".copy-code");
    await expect(copyButtons).toHaveCount(1);
    await expect(copyButtons).toHaveAttribute("aria-label", "Copy code");
  });

  test("dynamic OG endpoint returns a 200 image/png for an article without cover", async ({
    request,
  }) => {
    const response = await request.get(
      "/og/arquitectura-portafolio-astro.png",
    );
    expect(response.ok()).toBe(true);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
