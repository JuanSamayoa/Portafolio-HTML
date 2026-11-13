import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

const FALLBACK_SITE = "https://juan-samayoa.is-a.dev";

export async function GET(context: APIContext) {
  const posts = (
    await getCollection("blog", ({ data }) => data.draft !== true)
  ).sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: "Juan Samayoa — Blog Técnico",
    description:
      "Artículos prácticos sobre desarrollo web full-stack, automatización QA, bases de datos, infraestructura self-hosted y decisiones técnicas reales detrás de cada proyecto.",
    site: context.site ?? FALLBACK_SITE,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    // `customData` se inyecta dentro del <channel>.
    customData: "<language>es-gt</language>",
  });
}
