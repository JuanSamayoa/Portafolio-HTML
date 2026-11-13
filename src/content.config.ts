import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// `z` de `astro:content` está deprecado en Astro 7; `astro/zod` expone la versión
// que el framework usa internamente (zod v4).
import { z } from "astro/zod";

/**
 * Blog editorial gestionado desde Pages CMS (`.pages.yml`).
 *
 * `z.coerce.date()` acepta los tres formatos que puede emitir el CMS:
 * `2026-11-12`, `2026-11-12T00:00:00.000Z` y una fecha ya serializada.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
