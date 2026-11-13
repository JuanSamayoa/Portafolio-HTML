# PERFORMANCE — Rendimiento

## Objetivo

Documentar el rendimiento real del sitio medible desde el repositorio (pesos, estrategias, riesgos) y las decisiones que lo sostienen, para evitar regresiones cuando se añada contenido o se toquen assets.

## Alcance

Build estático, assets, imágenes, fuentes, CSS, JS, HTML y coste de third parties. No cubre medición de Core Web Vitals reales (no hay analítica ni RUM).

## Mediciones actuales del build

### Salida de Astro

| Métrica | Valor |
|---|---|
| Páginas HTML | 6 (`index`, `blog/index`, `blog/<slug>`, `toolkit/sql`, `thanks`, `404`) |
| Archivos en `dist/` | 35 |
| Peso total de `dist/` | ≈1 038 KB |
| Sitemap | 3 `<url>` (home + índice del blog + 1 artículo) |
| RSS | 1 `<item>` |
| `astro check` | 0 errores, 0 warnings, 0 hints (29 archivos) |

### Peso por archivo

| Archivo | Peso |
|---|---|
| `index.html` | 55 482 B |
| `blog/index.html` | 10 359 B |
| `blog/arquitectura-portafolio-astro/index.html` | 17 577 B |
| `toolkit/sql/index.html` | 24 485 B |
| `thanks/index.html` | 8 193 B |
| `404.html` | 8 688 B |
| CSS del Layout | 29 506 B |
| CSS de la home (bloque de página) | 5 511 B |
| CSS del blog (bloque de página) | 5 789 B |
| CSS de SQL | 5 366 B |
| CSS de 404 | 804 B |
| CSS de thanks | 1 342 B |
| JS del Layout | 1 619 B |
| JS de CertModal | 1 983 B |
| JS de Certifications | 647 B |
| JS del index | 779 B |
| JS de `_slug_` | 390 B |
| JS de sql | 1 050 B |

Total de JS propio: ≈6.5 KB en 6 módulos.

### CSS total

`global.css` = 2 278 líneas / 40 709 B. El resto son hojas por página. No hay Tailwind en el markup; el CSS se escribe a mano.

## Estrategias de rendimiento implementadas

### Build estático

- `output` por defecto (SSG); sin adapter ni SSR.
- `build.inlineStylesheets: "auto"`: solo hojas pequeñas se inlinean, el resto queda cacheable.
- `vite.build.assetsInlineLimit: 0`: nada se incrusta en base64.
- `rollupOptions.output.assetFileNames: "assets/[name]-[hash].[ext]"`: cache busting inmutable.
- `build.assets: "assets"`: todos los assets procesados en un solo directorio.

### Imágenes

- Las imágenes de contenido viven en Cloudinary (`res.cloudinary.com/df3b2ec0h`); `src/utils/cloudinary.ts` inserta `f_auto,q_auto` (y `c_limit,w_800`/`w_1200` en portadas).
- Dimensiones explícitas: proyectos `600×340`, certificaciones `400×250`, mini-certificaciones `200×200`, avatar `48×48`, portada del blog `800×450`, portada del artículo `1200×630`.
- `loading="lazy"` en todo excepto el avatar del hero (`eager`, `decoding="async"`).
- `width`/`height` fijos evitan CLS; no se usó `content-visibility` para no romper `offsetTop` del nav activo.

### Fuentes

- Carga no bloqueante: `preload as=style` + hoja con `media="print"` y script inline que la activa a `media="all"`; fallback `<noscript>`.
- `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- 3 familias (DM Mono, Syne, Inter) en 400/500/600 y 700 solo en Syne.
- `display=swap` en la URL de Google Fonts.

### JavaScript

- 6 módulos propios, ≈6.5 KB en total.
- Sin framework, sin estado persistido, sin `localStorage` ni cookies.
- `IntersectionObserver` para revelar secciones con `rootMargin: "0px 0px -35% 0px"`.
- `requestAnimationFrame` para el nav activo.
- No hay librerías de animación ni clientes HTTP.

### CSS

- `global.css` único punto de entrada; variables CSS para tokens.
- Animaciones con `transform`/`opacity`; desactivadas con `prefers-reduced-motion`.
- Sin Tailwind en el markup (instalado pero no define el diseño).

### Otros

- `public/sw.js` publicado pero **no registrado**; no aporta caché ni offline.
- `public/_headers` define caché de 1 año para assets con hash y 1 hora para HTML en hosts compatibles (GitHub Pages lo ignora).
- Sin analítica ni cookies de seguimiento (verificado por ausencia de `gtag`, `analytics`, `plausible`, `umami`).

## Coste de terceros

| Servicio | Coste de rendimiento | Mitigación |
|---|---|---|
| Cloudinary | Requests de imagen y dependencia de un CDN | `f_auto,q_auto`, dimensiones fijas, lazy loading |
| Google Fonts | 3 familias, 10 pesos | `preconnect`, `preload`, carga no bloqueante |
| FormSubmit | 1 request en envío | Solo en contacto |
| Pages CMS | Fuera del build | No afecta al bundle |

## Riesgos de rendimiento

- **Sin medición real:** no hay Lighthouse, Web Vitals ni RUM; las afirmaciones de rendimiento son cualitativas.
- **`global.css` grande:** 40 KB sin split por sección; cualquier cambio re-descarga la hoja completa.
- **Dependencia de Cloudinary:** si falla, las imágenes de perfil, proyectos y certificaciones no cargan.
- **Sin offline:** el service worker no se registra; no hay caché de assets ni fallback.
- **Imágenes remotas sin fallback:** no hay versión local de las imágenes de contenido.
- **GitHub Pages no aplica `_headers`:** la caché definida no se aprovecha en el hosting actual.
- **Build local con Node 24 vs CI con Node 22:** diferencias menores posibles.

## Recomendaciones futuras

- Ejecutar Lighthouse y registrar métricas base (LCP, CLS, INP, peso total) antes de optimizar.
- Considerar `font-display: swap` ya presente; evaluar subconjuntos de fuentes si el peso crece.
- Añadir un presupuesto de rendimiento (peso máximo de CSS/JS y número de requests) una vez exista medición base.
- Investigar por qué el service worker no se registra antes de activar caché offline.
- Evaluar `content-visibility` solo si se resuelve el cálculo de `offsetTop` del nav activo.
- Mover los estilos por página (`blog`, `sql`, `thanks`, `404`) a hojas separadas solo si crecen.

## Reglas

- No añadir librerías para efectos que CSS resuelve.
- No volver a una hoja de fuentes render-blocking sin justificación medida.
- Mantener `assetsInlineLimit: 0` y hashes en los nombres de asset.
- Cualquier imagen nueva debe tener dimensiones y pasar por `optimizedCloudinary`.
- No activar el service worker sin estrategia de actualización y pruebas de caché.
- Documentar mediciones reales si se afirma una mejora de rendimiento.
