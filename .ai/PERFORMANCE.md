# PERFORMANCE — Rendimiento

## Objetivo

Documentar el rendimiento real del sitio a partir de mediciones del build y del HTML generado, identificar los cuellos de botella verificables y fijar un presupuesto para futuros cambios.

## Alcance

Peso y composición del artefacto, CSS/JS, fuentes, imágenes, caché y trabajo de render. **No hay mediciones de campo** (Lighthouse, CrUX, WebPageTest) en el repositorio; este documento no las inventa.

## Mediciones base

Build ejecutado el 2026-11-11 con `pnpm build` (Astro 7.1.6, Node del entorno local). Valores en bytes sin comprimir.

| Artefacto | Peso | Observación |
|---|---|---|
| `dist/` completo | 958 KB · 28 archivos | Incluye assets que la home no carga |
| `dist/index.html` | 49,738 B | 12 secciones + JSON-LD |
| `dist/toolkit/sql/index.html` | 18,676 B | Incluye 5 consultas SQL inline |
| `dist/404.html` | 6,600 B | — |
| `dist/thanks/index.html` | 6,105 B | — |
| CSS del Layout | 25,135 B | Render-blocking en las 4 rutas |
| CSS de la home | 3,277 B | Específico de `index.astro` |
| CSS de `/toolkit/sql` | 5,275 B | — |
| CSS de `404` / `thanks` | 804 B / 1,342 B | — |
| JS total en `dist/assets` | 3,346 B · 4 archivos | Layout 517 B, Certifications 777 B, CertModal 1,002 B, SQL 1,050 B |
| `public/sw.js` | 6,602 B | Se publica, no se registra |
| CVs PDF | 218,029 B + 203,635 B | Solo se descargan bajo demanda |
| `og-image.png` | 278,179 B | No lo referencia ninguna página |
| `apple-touch-icon.png` | 46,404 B | 180×180 real |
| `favicon.ico` | 36,921 B | 256×256 |
| `src/styles/global.css` | 32,018 B · 1,978 líneas | Fuente del CSS global |

### Peso aproximado de la home (sin fuentes ni imágenes)

`49.7 KB HTML + 28.4 KB CSS + 2.3 KB JS ≈ 80.4 KB` sin comprimir. En `/toolkit/sql`: `18.7 + 30.4 + 1.6 ≈ 50.7 KB`, más el JSON inline con el código SQL.

### Lectura de los datos

- **El contenido pesado no forma parte de la carga inicial de contenido:** los PDFs (≈422 KB) y `og-image.png` (≈278 KB) no se solicitan al abrir la home; la OG image solo la consumen los crawlers sociales. El `favicon.ico` (≈37 KB) sí puede solicitarse y conviene reducirlo.
- **No hay bundles de framework.** Los 4 módulos JS son scripts propios compilados por Vite y pesan en conjunto 3.3 KB.
- **El CSS es el mayor recurso crítico** (25 KB compartidos + 3–5 KB por página) y se solicita antes del primer render.
- **Las imágenes no se optimizan en build:** los `<img>` conservan la URL original de Cloudinary, sin `srcset` (0 apariciones) y sin parámetros de transformación (`w_`, `q_`, `f_auto`). `width`/`height` solo reservan espacio; el navegador descarga el asset original.

## Fuentes

- 3 familias y 9 variantes desde Google Fonts: DM Mono 400/500, Syne 400/500/600/700, Inter 400/500/600.
- `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`; `display=swap` evita texto invisible.
- La hoja de estilos de Google Fonts es render-blocking y de un tercero; no hay auto-hospedaje ni subsetting.
- No se usa `preload` de archivos de fuente ni `size-adjust` para mitigar el cambio de métrica.

## Imágenes

- Todas las imágenes de contenido son remotas (Cloudinary); no hay copias locales ni fallback.
- Dimensiones declaradas: hero 48×48 (`eager`, `decoding="async"`), proyectos 600×340, certificaciones 400×250, mini-certificaciones 200×200; todas con `loading="lazy"` salvo el avatar.
- Los recortes se resuelven por CSS (`object-fit: cover`), no por el CDN.
- 31 referencias a `res.cloudinary.com` en el HTML de la home (incluye `og:image`, `twitter:image` y duplicados de metadatos).

## CSS y render

- Dos hojas de estilo en la home (Layout + página); ninguna se incrusta (`assetsInlineLimit: 0`).
- Nombres con hash ⇒ cacheables de forma inmutable, pero el HTML no lleva cabecera de caché efectiva en GitHub Pages.
- Efectos con coste de pintado: `backdrop-filter: blur(12px)` en la nav fija, sombras y `transform` al hover, y `will-change: transform, opacity` declarado en **todos** los `.reveal` (potencial consumo de memoria si hay muchos nodos).
- Animaciones: reveal por `IntersectionObserver`, `pulse` del logo, `blink` del cursor de terminal, `fadeSlideIn` en acordeones.
- Sin `content-visibility` ni `contain` en secciones fuera de viewport.

## JavaScript

- 4 módulos pequeños, sin dependencias; se cargan con `type="module"` (diferidos por defecto).
- El JSON-LD y el dataset SQL se inyectan inline; no hay fetching de datos en cliente.
- El listener de scroll usa `requestAnimationFrame` y un flag `ticking`, evitando thrashing.
- El service worker no se registra: **no hay caché offline ni precache** pese a que el archivo se publica.

## Caché y entrega

| Recurso | Mecanismo real |
|---|---|
| HTML | Sin control desde el repo; `_headers` no aplica en GitHub Pages |
| CSS/JS con hash | Nombres inmutables; cabecera `immutable` solo en hosts que lean `_headers` |
| PDFs | `private, no-store` en `_headers` (no aplica en Pages) |
| Imágenes | Caché del CDN de Cloudinary |
| Compresión | No configurada en el repositorio; depende del hosting (`PENDIENTE DE DEFINICIÓN` en Pages) |
| Service worker | Publicado, no registrado |

## Reglas

- No añadir recursos bloqueantes (CSS, fuentes, scripts) sin justificar y medir.
- Toda imagen nueva debe tener `width`, `height`, `alt` y `loading` adecuado.
- No afirmar mejoras de rendimiento sin una medición antes/después reproducible.
- Mantener el JS de cliente por debajo del presupuesto acordado y sin dependencias.
- No activar el service worker sin estrategia de actualización y pruebas de caché.
- Evitar `will-change` permanente en elementos nuevos.

## Ejemplos reales

- **Buen ejemplo:** el script de scroll del Layout usa `requestAnimationFrame` + `ticking`, patrón correcto para listeners de alta frecuencia.
- **Buen ejemplo:** los 4 módulos JS suman 3.3 KB y no requieren framework.
- **Mal ejemplo:** `<Image>` con URL remota emite la URL original; las tarjetas de proyecto descargan el asset completo aunque se muestren a 600×340.
- **Mal ejemplo:** `will-change` en `.reveal` se aplica a todas las secciones desde el primer render.

## Presupuesto propuesto (sin aprobar)

| Métrica | Actual | Propuesta |
|---|---|---|
| HTML home | 49.7 KB | ≤ 55 KB |
| CSS crítico | 28.4 KB | ≤ 30 KB |
| JS propio | 2.3 KB | ≤ 5 KB |
| Variantes tipográficas | 9 | ≤ 6 |
| Imágenes sin `srcset` | 100 % | 0 % en contenido |
| Requests en home | ≈ 7 + imágenes | No aumentar sin justificar |

## Riesgos conocidos

1. **Imágenes sin optimizar ni `srcset`**: el mayor riesgo de rendimiento móvil; depende del peso original en Cloudinary.
2. **CSS global render-blocking** de 25 KB en todas las rutas.
3. **9 variantes de fuente** de un tercero, sin subsetting.
4. **Sin caché controlada en HTML** y sin service worker activo.
5. **`will-change` masivo** y `backdrop-filter` en la nav.
6. **Sin línea base medida**: cualquier afirmación de mejora es especulativa.
7. **Sin compresión garantizada** por el repositorio.

## Recomendaciones futuras

1. Aplicar transformaciones de Cloudinary (`f_auto`, `q_auto`, `w_...`) o configurar `image.domains`/`remotePatterns` en Astro para generar `srcset` real.
2. Reducir variantes tipográficas y evaluar auto-hospedaje con subset latino.
3. Medir con Lighthouse en producción (móvil y escritorio) y guardar el informe como línea base.
4. Añadir un presupuesto de rendimiento al CI cuando exista medición (Lighthouse CI).
5. Eliminar `will-change` tras la animación o limitarlo a los elementos visibles.
6. Resolver el service worker: registrarlo con estrategia de versionado o retirarlo.
7. Si el HTML crece, evaluar `content-visibility: auto` en secciones inferiores.
