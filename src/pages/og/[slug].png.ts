import { getCollection } from "astro:content";
import type { APIRoute, StaticGenerateHandler } from "astro";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const FONT_SIZE_TITLE = 64;
const FONT_SIZE_TAG = 32;
const FONT_SIZE_SIGNATURE = 24;

const FONT_PATH = process.env.FONT_PATH ?? "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf";
const FONT_BOLD_PATH = process.env.FONT_BOLD_PATH ?? "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf";

export const prerender = true;

export async function GET({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const posts = await getCollection("blog", ({ data }) => data.draft !== true);
  const post = posts.find((p) => p.id === slug);

  if (!post) {
    return new Response("Not found", { status: 404 });
  }

  const title = post.data.title;
  const description = post.data.description;
  const tag = post.data.tags[0];
  const site = Astro.site ?? new URL("https://juan-samayoa.is-a.dev");

  const truncatedTitle = title.length > 60 ? title.slice(0, 60) + "…" : title;
  const truncatedTag = tag?.length ?? 0 > 30 ? tag?.slice(0, 30) + "…" : tag;

  const safeTitle = String(title).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  const safeTag = String(tag ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1a1a18"/>
  <rect x="0" y="${HEIGHT - FONT_SIZE_SIGNATURE - 20}" width="${WIDTH}" height="${FONT_SIZE_SIGNATURE + 20}" fill="#000000" opacity="0.45"/>
  <text x="60" y="150" fill="#0d9488" font-family="DejaVu Sans" font-size="${FONT_SIZE_TAG}">${safeTag}</text>
  <text x="60" y="280" fill="#ffffff" font-family="DejaVu Sans" font-weight="bold" font-size="${FONT_SIZE_TITLE}">${safeTitle}</text>
  <text x="60" y="${HEIGHT - FONT_SIZE_SIGNATURE - 80}" fill="#ffffff" font-family="DejaVu Sans" font-size="${FONT_SIZE_SIGNATURE}">${safeTitle}</text>
  <text x="${WIDTH - 60}" y="${HEIGHT - FONT_SIZE_SIGNATURE - 60}" fill="#0d9488" font-family="DejaVu Sans" font-size="${FONT_SIZE_SIGNATURE}" text-anchor="end">juan-samayoa.is-a.dev</text>
</svg>`;

  try {
    const image = sharp(Buffer.from(svg, "utf8"))
      .png()
      .toBuffer();

    return new Response(image, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
