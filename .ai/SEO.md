# SEO — Posicionamiento y metadatos

## Objetivo

Documentar la estrategia SEO real del sitio: metadatos por ruta, datos estructurados, indexación, sitemap, compartición social y brechas detectadas.

## Alcance

Las 4 rutas generadas (`/`, `/thanks`, `/toolkit/sql`, `/404.html`), `robots.txt`, `sitemap.xml`, Open Graph, Twitter Cards y JSON-LD. No cubre copywriting ni palabras clave más allá de lo declarado.

## Estrategia observada

SEO **on-page explícito y manual**: cada página construye sus metadatos en el frontmatter y los pasa al Layout, que los serializa en `<head>`. No hay generación automática de sitemap ni de canónicas.

### Metadatos por ruta

| Ruta | Título | Canonical | Robots | JSON-LD |
|---|---|---|---|---|
| `/` | `Juan Samayoa \| QA Automation Engineer` | calculada con `Astro.site` + pathname (fallback `https://juan-samayoa.is-a.dev/`) | `index, follow, max-image-preview:large` (por defecto) | `Person` |
| `/thanks` | `¡Gracias por contactarme! — Juan Samayoa` | `https://juan-samayoa.is-a.dev/thanks` | `noindex, follow` | `WebPage` |
| `/404` | `Página no encontrada \| 404 — Juan Samayoa` | `https://juan-samayoa.is-a.dev/404` | `noindex, follow` | `WebPage` |
| `/toolkit/sql` | `SQL Validation Playground \| Juan Samayoa — QA Toolkit` | `https://juan-samayoa.is-a.dev/toolkit/sql` | `noindex, follow` | `WebPage` con `author` |

### Metadatos globales del Layout

- `charset`, `viewport`, `author` (Juan Samayoa), `keywords` orientadas a QA/Playwright/Java/Selenium/Postman/SQL/Guatemala.
- Open Graph: `og:type=website`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:secure_url`, `og:image:type`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:site_name=Juan Samayoa Portfolio`, `og:locale=es_GT`.
- Twitter: `summary_large_image`, `twitter:site=@JSamayoa_`, título, descripción, imagen y alt.
- `theme-color=#0f6e56`, `application-name`, `mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `format-detection telephone=no`.
- Iconos: `/favicon.ico`, `/apple-touch-icon.png` (declarado 180×180), `manifest=/site.webmanifest`.
- JSON-LD del home:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Juan Samayoa",
  "jobTitle": "QA Automatizado",
  "email": "contact@juansamayoa.dev",
  "address": { "@type": "PostalAddress", "addressLocality": "Guatemala City", "addressCountry": "GT" },
  "url": "https://juan-samayoa.is-a.dev/",
  "sameAs": ["https://www.linkedin.com/in/juansamayoa/", "https://github.com/JuanSamayoa"]
}
```

### Imágenes sociales

| Página | `previewImage` | `ogImage` | Estado |
|---|---|---|---|
| `/` | Foto de perfil Cloudinary (`IMG_8748_baq06u.jpg`) | `og-image_vonu7x.png` 1200×630 | Coherente para OG; Twitter usa la foto de perfil |
| `/thanks` | `https://juan-samayoa.is-a.dev/favicon.svg` | hereda | **Archivo inexistente** |
| `/404` | `https://juan-samayoa.is-a.dev/favicon.svg` | hereda | **Archivo inexistente** |
| `/toolkit/sql` | Imagen de proyecto `humanresources_tqjseu.webp` | hereda | Relación temática débil |

`public/og-image.png` existe pero ninguna página lo referencia.

### Indexación

`public/robots.txt`:

- `User-agent: *` → `Allow: /`; bloquea `/assets/cv/`, `/sw.js`, `/_headers`, `/security.txt`.
- Bloqueo total a `GPTBot`, `ChatGPT-User`, `CCBot`, `Google-Extended`, `anthropic-ai`, `ClaudeBot`.
- Declara `Sitemap: https://juan-samayoa.is-a.dev/sitemap.xml`.

`public/sitemap.xml`: una sola URL (`/`), `lastmod 2026-07-30`, `changefreq weekly`, `priority 1.0`. Es consistente con que `/thanks`, `/404` y `/toolkit/sql` sean `noindex`.

Canonical y build: el build genera directorios (`/thanks/index.html`, `/toolkit/sql/index.html`) mientras las canónicas no llevan slash final. GitHub Pages puede redirigir con 301 a la versión con slash. PENDIENTE DE DEFINICIÓN: requiere verificación en producción antes de afirmar si hay duplicidad.

## Reglas

- Toda página nueva debe pasar `title`, `description`, `canonicalUrl`, `previewImage` y `schemaOrg`.
- `canonicalUrl` siempre absoluta, con el dominio de producción y sin parámetros.
- `/thanks`, `/404` y páginas de utilidad llevan `robots="noindex, follow"`.
- Si una ruta debe indexarse, se añade manualmente a `public/sitemap.xml`.
- No cambiar `site`, `CNAME` ni el dominio sin actualizar canónicas, OG, sitemap, robots y `security.txt`.
- `description` única por ruta, entre ~120 y 160 caracteres cuando sea posible.
- No introducir keywords stuffing ni contenido oculto.

## Ejemplos reales

- Página con metadatos completos y `noindex`:

```astro
<Layout
  title={title}
  description={description}
  canonicalUrl={canonicalUrl}
  previewImage={previewImage}
  {schemaOrg}
  robots="noindex, follow"
>
```

- Cálculo de canonical en el home a partir de `Astro.site`, con fallback explícito al dominio de producción.
- JSON-LD inyectado con `set:html` y `is:inline`, sin escaping manual.

## Riesgos conocidos

1. **`previewImage` roto en `/thanks` y `/404`**: apunta a `/favicon.svg`, que no existe; cualquier compartición de esas URLs produce imagen rota.
2. **Twitter Card con imagen vertical**: `twitter:image` usa la foto de perfil (retrato) mientras la tarjeta es `summary_large_image` (1.91:1); el recorte puede ser desfavorable.
3. **`og:image` del home en Cloudinary**: si el asset se elimina o cambia de versión, se rompe la vista previa social.
4. **Sitemap manual y desactualizado**: solo la home, con `lastmod` fijo; no refleja cambios de contenido.
5. **Canonical sin slash vs. directorios generados**: posible 301 o duplicidad (PENDIENTE DE DEFINICIÓN).
6. **Datos estructurados mínimos**: solo `Person` y `WebPage`; no hay `BreadcrumbList`, `WebSite`, `ProfilePage` ni `ItemList` para proyectos/certificaciones.
7. **`keywords` meta**: ignorado por Google; se mantiene por legado.
8. **`jobTitle` en JSON-LD es "QA Automatizado"** mientras el `<title>` dice "QA Automation Engineer": inconsistencia semántica.
9. **Sin `hreflang`**: correcto mientras no existan versiones por idioma, pero impide SEO internacional si se añade `/en`.
10. **Contenido duplicado potencial** entre el hero y "Sobre mí" (descripciones similares), sin canibalización grave por ser una sola página.

## Recomendaciones futuras

- Corregir los `previewImage` de `/thanks` y `/404` a un asset existente (por ejemplo, `/og-image.png`).
- Usar una imagen 1200×630 dedicada para `twitter:image` en todas las rutas.
- Generar el sitemap automáticamente o, como mínimo, actualizarlo al añadir rutas indexables.
- Unificar `jobTitle` con el título profesional usado en la UI.
- Verificar en producción el comportamiento de canonical con/sin slash y ajustar `trailingSlash` si procede.
- Añadir `ProfilePage`/`WebSite` con `sameAs` si se busca reforzar entidad de marca personal.
