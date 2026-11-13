# SEO — Optimización para motores de búsqueda

## Objetivo

Documentar la estrategia SEO real del sitio: metadatos por ruta, datos estructurados, sitemap, feed, robots, canónicas y robots meta, para que cada página nueva se publique con metadatos completos y sin regresiones.

## Alcance

Las 6 rutas, el blog, los endpoints dinámicos, `robots.txt`, `security.txt` y los metadatos del `Layout`. No incluye analítica ni search console.

## Estado actual

- `pnpm check:links`: 97 referencias locales en 6 HTML, sin roturas.
- `sitemap.xml`: 3 `<url>` (home, índice del blog, 1 artículo).
- `rss.xml`: 1 `<item>` (1 artículo publicado).
- Sin analítica ni Search Console verificada.
- Sin páginas de categoría o archivo del blog.

## Metadatos por ruta

| Ruta | `robots` | `previewImage` | Notas |
|---|---|---|---|
| `/` | `index, follow, max-image-preview:large` | `/assets/img/profile/profile-600x600.webp` (Cloudinary) | Home con schema `Person` |
| `/blog/` | `index, follow` | OG por defecto | Schema `Blog` |
| `/blog/<slug>/` | `index, follow` | Portada del artículo o OG por defecto | Schema `BlogPosting` |
| `/toolkit/sql` | `noindex, follow` | `/og-image.png` | Herramienta interna |
| `/thanks` | `noindex, follow` | `/og-image.png` | Confirmación de formulario |
| `/404` | `noindex, follow` | `/og-image.png` | Página de error |

Todas las rutas pasan `title`, `description`, `canonicalUrl`, `previewImage` y `schemaOrg` al Layout; `ogImage`, `ogImageType`, `ogImageWidth` y `ogImageHeight` son opcionales con valores por defecto.

## Layout (`src/layouts/Layout.astro`)

El Layout genera automáticamente:

- `<title>` y `<meta name="description">`.
- `<link rel="canonical">` con URL absoluta.
- Open Graph: `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, `og:locale` (`es_ES`).
- Twitter Cards: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.
- JSON-LD con el objeto `schemaOrg` pasado por la página.
- `robots` meta con el valor recibido (por defecto `index, follow, max-image-preview:large`).
- `<link rel="alternate" type="application/rss+xml">` hacia `/rss.xml`.
- Fuentes con carga no bloqueante y `preconnect`.

## Datos estructurados

| Ruta | Schema | Campos clave |
|---|---|---|
| Home | `Person` | name, jobTitle, url, email, sameAs (GitHub, LinkedIn, Twitter/X, YouTube) |
| `/blog/` | `Blog` | name, description, url, publisher |
| `/blog/<slug>/` | `BlogPosting` | headline, description, datePublished, dateModified, author, publisher, image, mainEntityOfPage, keywords |
| Resto | `Person` o `WebSite` heredado | — |

## Sitemap (`src/pages/sitemap.xml.ts`)

- Endpoint dinámico; genera `/sitemap.xml` en build.
- Incluye la home y el índice del blog siempre.
- Añade un `<url>` por artículo con `draft !== true`, ordenado por `pubDate` descendente.
- Usa `Astro.site` para URLs absolutas.
- `changefreq`/`lastmod` derivados de `pubDate`/`updatedDate`.

No existe un `sitemap.xml` estático en `public/`; el archivo fue reemplazado por el endpoint dinámico.

## Feed RSS (`src/pages/rss.xml.ts`)

- Endpoint dinámico; genera `/rss.xml` con `@astrojs/rss`.
- Incluye artículos con `draft !== true`, ordenados por `pubDate` descendente.
- `title`, `description`, `pubDate`, `link` por artículo; `customData` para categorías/tags.
- Autodiscovery en el `<head>` del Layout y enlace visible en `/blog/`.

## robots.txt (`public/robots.txt`)

- `User-agent: *` con `Allow: /` y `Sitemap: https://juan-samayoa.is-a.dev/sitemap.xml`.
- Bloqueo de crawlers de IA (`GPTBot`, `ChatGPT-User`, `CCBot`, `anthropic-ai`, `Claude-Web`, `Google-Extended`, `Bytespider`, `PerplexityBot`).
- No bloquea imágenes ni assets.

## Canonical y dominio

- Dominio canónico: `https://juan-samayoa.is-a.dev` (`astro.config.mjs`, `public/CNAME`).
- Canónicas absolutas construidas con `new URL(Astro.url.pathname, Astro.site)` en cada página.
- `base: "/"`, por lo que no hay prefijo de subdirectorio.

## Seguridad y SEO

- CSP en `<meta>` (funciona en GitHub Pages) y en `public/_headers`.
- `X-Robots-Tag` no se envía; el control es por meta `robots`.
- `security.txt` duplicado en `/security.txt` y `/.well-known/security.txt`, expira `2027-01-31`.
- El blog se anuncia también por RSS.

## Reglas

- Toda página nueva debe pasar los 5 props requeridos al Layout.
- Si debe indexarse, añadir la ruta a `sitemap.xml.ts`.
- Un artículo con `draft: true` no aparece en el índice, sitemap ni RSS, pero se genera HTML. No lo uses para contenido que no deba publicarse en absoluto.
- No cambiar el slug de un artículo publicado sin redirección.
- Mantener canónicas absolutas y coherentes con el dominio.
- La imagen social por defecto (`/og-image.png`, 1200×630) debe existir en `public/`.
- No añadir `noindex` accidental a la home ni al blog.

## Ejemplos reales

- Home: `canonicalUrl` construida con `Astro.site` + `Astro.url.pathname`; `schemaOrg` con `Person` y `sameAs`.
- Blog: `getCollection("blog", ({ data }) => data.draft !== true)` ordenado por `pubDate` descendente; el mismo filtro se repite en sitemap y RSS.
- Portada del artículo: `optimizedCloudinary(post.data.cover, "f_auto,q_auto,c_limit,w_1200")` con `coverAlt` o `title` como `alt`.
- `/thanks` y `/404`: `robots="noindex, follow"` y `previewImage="/og-image.png"`.
- `/toolkit/sql`: `robots="noindex, follow"` porque es una herramienta interna.

## Riesgos conocidos

- **Sin medición:** no hay Search Console ni analítica; no se puede validar indexación ni CTR.
- **Blog con un solo artículo:** el feed y el sitemap tienen una entrada; las páginas de archivo/categoría no existen.
- **Duplicación de lógica:** índice, sitemap y RSS repiten filtro y orden.
- **`previewImage` del home** apunta a una imagen de Cloudinary; si se elimina, el OG image se rompe.
- **CSP y OG:** las imágenes sociales se sirven desde el dominio propio o Cloudinary; ambas deben estar permitidas.
- **Slug inmutable:** cambiar el nombre del archivo del artículo rompe la URL y el feed sin redirección.

## Recomendaciones futuras

- Verificar el sitio en Google Search Console y enviar el sitemap.
- Definir una estrategia de categorías/tags del blog (ya existen tags, pero no hay páginas de archivo).
- Añadir `lastmod` real al sitemap cuando se actualice un artículo.
- Evaluar `hreflang` solo si se introduce multi-idioma.
- Incorporar una imagen social por artículo (`cover` ya puede servir como OG image).
