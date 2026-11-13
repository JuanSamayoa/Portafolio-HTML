import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const FALLBACK_SITE = "https://juan-samayoa.is-a.dev";

/** `<lastmod>` en formato W3C (`YYYY-MM-DD`), que es lo que aceptan Google y Bing. */
const toIsoDate = (date: Date) => date.toISOString().split("T")[0];

/** Escapa los cinco caracteres reservados del XML; los `id` son slugs, pero el CMS no lo garantiza. */
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: "weekly" | "monthly";
  priority: string;
}

export const GET: APIRoute = async ({ site, locale }) => {
  const origin = (site ?? new URL(FALLBACK_SITE)).toString().replace(/\/$/, "");
  const langPrefix = locale === "en" ? "/en" : "";
  const currentPrefix = locale === "en" ? "/en" : "/";

  const posts = (
    await getCollection("blog", ({ data }) => data.draft !== true)
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  const urls: SitemapUrl[] = [
    { loc: `${origin}${currentPrefix}`, changefreq: "weekly", priority: "1.0" },
    {
      loc: `${origin}${currentPrefix}blog/`,
      // La portada del blog cambia cuando se publica un artículo.
      lastmod: posts[0] ? toIsoDate(posts[0].data.pubDate) : undefined,
      changefreq: "weekly",
      priority: "0.8",
    },
    ...posts.map((post) => ({
      loc: `${origin}${currentPrefix}blog/${post.id}/`,
      lastmod: toIsoDate(post.data.updatedDate ?? post.data.pubDate),
      changefreq: "monthly" as const,
      priority: "0.7",
    })),
  ];

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(({ loc, lastmod, changefreq, priority }) =>
    [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  )
  .join("\n")}
</urlset>
`,
    {
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    },
  );
};
