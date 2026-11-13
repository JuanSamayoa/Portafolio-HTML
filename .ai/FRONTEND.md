# FRONTEND — Arquitectura de frontend

## Objetivo

Explicar cómo se construye la interfaz: modelo de componentes, props, patrones de datos, scripts de cliente, manejo de imágenes y CSS, para que un agente pueda extender la UI sin romper contratos.

## Alcance

Capa de presentación (`.astro`, CSS, JS de navegador, colección de blog). No cubre diseño visual detallado (ver `UX_UI.md`) ni SEO (ver `SEO.md`).

## Modelo de frontend

| Decisión | Implementación | Consecuencia |
|---|---|---|
| Sin framework de UI | No hay React/Vue/Svelte ni islas | Cero runtime de framework; interactividad manual |
| Componentes de servidor | Todos los `.astro` se renderizan en build | No hay hidratación |
| Props tipadas | `interface Props` + `Astro.props` | Contratos explícitos entre página y Layout |
| Slot único | `<slot />` en `Layout.astro` | Las páginas inyectan su contenido |
| Página de blog dinámica | `getStaticPaths` + `getCollection` | Un HTML por artículo publicado |
| Scripts de Astro | `<script>` compilados por Vite a módulos con hash | Comportamiento sin dependencias |
| CSS global + bloques encapsulados | `global.css` + `<style>` en 6 archivos | Un sistema visual, con excepciones por página |

## Contratos de props

### `Layout.astro`

Requeridas: `title`, `description`, `canonicalUrl`, `previewImage`, `schemaOrg`.

Opcionales con valor por defecto: `ogImage` (= `previewImage`), `ogImageType` (`image/png`), `ogImageWidth` (`1200`), `ogImageHeight` (`630`), `robots` (`index, follow, max-image-preview:large`).

```astro
<Layout
  {title} {description} {canonicalUrl} {previewImage} {schemaOrg}
  robots="noindex, follow"
/>
```

Cualquier página nueva debe satisfacer este contrato; omitir `schemaOrg` rompe el build por tipos.

### Props internas

Los componentes de sección no reciben parámetros y obtienen su contenido de imports o de constantes locales. `CertModal` no recibe props; se comunica por evento. Las páginas de blog no usan props externas: obtienen el artículo en `getStaticPaths`.

## Patrones de datos en componentes

| Patrón | Archivo | Uso correcto |
|---|---|---|
| Import directo de datos | `Hero.astro`, `Contact.astro`, `Toolkit.astro` | Contenido de una sola instancia |
| `map` sobre datos tipados | `Projects.astro` | Listas repetibles |
| Vistas derivadas | `certifications.ts` | Evitar duplicar arreglos por categoría |
| `getCollection` + filtro | `blog/index.astro`, `blog/[slug].astro`, `sitemap.xml.ts`, `rss.xml.ts` | Contenido editorial |
| Cálculo en frontmatter | `index.astro` (canonical, schemaOrg), `blog/index.astro` (tags únicos, tiempo de lectura) | Derivar metadatos o totales |
| Contenido editorial en el markup | `Cases.astro`, `Faq.astro`, `Experience.astro`, `Services.astro` | Texto único no reutilizable |

### Ejemplo real: vista derivada

```ts
export const featuredCertifications = allCertificationsData.filter(
  (cert) => cert.category === "featured",
);
export const additionalCertifications = allCertificationsData.filter(
  (cert) => cert.category === "additional",
);
```

Consecuencia: una certificación sin `category` no aparece en ninguna de las dos listas.

### Ejemplo real: colección de blog

```ts
const posts = (await getCollection("blog", ({ data }) => data.draft !== true))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
```

El mismo filtro y orden se repiten en el índice, el sitemap y el RSS; cambiar el criterio exige tocar los tres (o extraerlo a una utilidad).

### Ejemplo real: metadatos derivados

```astro
const canonicalUrl = Astro.site
  ? new URL(Astro.url.pathname, Astro.site).toString()
  : "https://juan-samayoa.is-a.dev/";
```

## Scripts de cliente

| Script | Ubicación | Se ejecuta | Notas |
|---|---|---|---|
| Reveal + nav activo + menú móvil | `Layout.astro` (global) | En las 6 páginas | `IntersectionObserver`, listener de scroll con `requestAnimationFrame`, disclosure con `aria-expanded` |
| Tarjetas de certificación | `Certifications.astro` | Solo home | Botón overlay con `aria-label` y foco visible |
| Modal | `CertModal.astro` | Solo home | Trampa de foco, restauración y cierre por `cancel`/`close` |
| Filtro por tags | `blog/index.astro` | Solo `/blog/` | `aria-pressed`, contador `role="status"` y mensaje vacío |
| Copiar enlace del artículo | `blog/[slug].astro` | Solo artículo | `navigator.clipboard` con estado «copiado» |
| Copiar / descargar SQL | `toolkit/sql.astro` | Solo `/toolkit/sql` | `navigator.clipboard`, `Blob` |

Reglas:

- No usar `innerHTML` con datos externos (no se usa hoy).
- No persistir estado (no hay `localStorage` ni cookies).
- Escuchar eventos en `document` solo cuando el componente no puede recibir props (caso del modal).
- Mantener los scripts idempotentes: `init` se ejecuta en `DOMContentLoaded` o de inmediato si ya cargó.
- Todo control que dependa de JS debe ocultarse con `html:not(.js)` y tener alternativa legible.

## Imágenes

- Las URLs viven en `src/data/*.ts`, en las portadas del blog y en los metadatos sociales.
- `src/utils/cloudinary.ts` inserta `f_auto,q_auto` entre `/image/upload/` y la ruta, con `c_limit,w_*` en portadas; no duplica transformaciones existentes ni toca URLs ajenas a Cloudinary.
- Dimensiones declaradas: proyectos `600×340`, certificaciones `400×250`, mini-certificaciones `200×200`, avatar `48×48`, portada del blog `800×450`, portada del artículo `1200×630`.
- `loading="lazy"` en todo excepto la foto del hero (`eager`, `decoding="async"`).
- El CSS aplica `object-fit: cover` y `transform: scale()` al hover.

El build conserva la URL de Cloudinary transformada y no emite archivos de imagen en `dist/assets/`: el peso final depende de Cloudinary, no del bundle. Si Cloudinary falla en runtime, las imágenes no cargan; no hay fallback local.

## CSS

| Aspecto | Implementación |
|---|---|
| Punto de entrada | `src/styles/global.css` importado en `Layout.astro` |
| Tokens | `:root` con escala teal, escala gray, familias tipográficas, `--focus-ring`, radios, sombras y `--ease-out` |
| Reset | `box-sizing`, `margin: 0`, `padding: 0` universal |
| Layout | `.container` con `width: min(100%, 1080px)` y padding lateral 48 px (24 px en móvil) |
| Grid | CSS Grid en hero, impacto, servicios, casos, proyectos, stack, certificaciones, contacto y blog |
| Estados | `:hover`, `:focus-visible`, `[open]`, `.visible`, `.copied`, `.is-active`, `.is-open` |
| Animaciones | `@keyframes pulse`, `blink`, `fadeSlideIn`; transiciones con `--ease-out`; todas anuladas con `prefers-reduced-motion` |
| Responsive | `940px`, `640px`, `380px`, `360px` |

En `dist`: CSS del Layout ≈29.5 KB; home ≈3.4 KB; índice del blog ≈5.5 KB; artículo ≈5.8 KB; SQL ≈5.4 KB; thanks ≈1.3 KB; 404 ≈0.8 KB. Los scripts se compilan a 6 módulos de 0.4–2 KB (≈6.5 KB en total). No hay CSS-in-JS ni utilidades de Tailwind en el markup.

## Estructura de un componente nuevo

```astro
---
import { personalInfo } from "../data/personal";
// 1. imports
// 2. tipos locales (si aplica)
// 3. constantes derivadas
---

<section id="mi-seccion">
  <div class="container">
    <div class="section-tag">etiqueta</div>
    <h2 class="section-title">Título</h2>
    <!-- markup semántico -->
  </div>
</section>
```

Después: añadir el bloque CSS en `global.css`, importar el componente en `index.astro` en la posición narrativa correcta y, si debe navegarse, agregar el enlace en `navLinks` (`Layout.astro`).

## Reglas

- Los datos repetibles viven en `src/data` y se tipan en `src/types/portfolio.ts`; los artículos, en `src/content/blog`.
- Las imágenes de contenido usan `optimizedCloudinary`, con `width`, `height`, `alt` y `loading`.
- No usar `innerHTML`, `eval`, storage ni cookies.
- Los scripts deben ser idempotentes y no ejecutarse en páginas donde no aplican.
- Los estilos de sección van a `global.css`; los bloques encapsulados existentes no son precedente para nuevos.
- No cambiar el payload de `open-cert-modal` ni el esquema del blog sin actualizar todos los consumidores.

## Riesgos conocidos

- **Contrato del modal implícito:** el modal espera un `detail` con `{ image, issuer, title, date, link }`; no está tipado en un archivo compartido.
- **Lógica de colección duplicada:** índice, sitemap y RSS repiten filtro y orden; un cambio futuro puede desincronizarlos.
- **Bloqueo de scroll del menú móvil:** si un enlace navega fuera de la página sin cerrar el menú, `body.overflow` podría quedar bloqueado (hoy se cierra en cada clic).
- **Dependencia de Cloudinary** para todas las imágenes de contenido.
- **Estilos de página aislados** en blog, SQL, thanks y 404 que pueden divergir del sistema global.
- **Copia de enlace dependiente del contexto seguro:** `navigator.clipboard` requiere HTTPS o localhost; hay manejo de error, pero no fallback de selección manual.

## Recomendaciones futuras

- Tipar el payload del modal y centralizar la consulta de artículos en una utilidad (`src/utils/blog.ts`).
- Extraer los datos SQL a `src/data` y reducir `toolkit/sql.astro`.
- Añadir un fallback visible cuando el copiado falla.
- Documentar el esquema del blog junto al de los datos tipados para que un agente no busque en dos sitios.
