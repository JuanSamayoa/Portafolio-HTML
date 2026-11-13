# ARCHITECTURE — Arquitectura del sistema

## Objetivo

Explicar cómo está construido el sitio, qué decisiones estructurales lo sostienen y qué invariantes debe respetar cualquier cambio.

## Alcance

Modelo de generación, capas, flujo de datos, interactividad, pipeline de assets, configuración, despliegue y puntos de extensión. No incluye guías visuales (ver `UX_UI.md`) ni detalle de cabeceras (ver `SECURITY.md`).

## Modelo de generación

**SSG puro.** Astro resuelve todo en `pnpm build` y emite HTML estático y endpoints pre-renderizados a `dist/`.

| Aspecto | Configuración real | Consecuencia |
|---|---|---|
| `site` | `https://juan-samayoa.is-a.dev` | Base para canónicas, sitemap, RSS y `Astro.site` |
| `base` | `/` | Rutas absolutas desde la raíz |
| `outDir` | `./dist` | GitHub Pages publica ese directorio |
| `build.assets` | `assets` | CSS/JS/imágenes procesadas van a `dist/assets/` |
| `build.inlineStylesheets` | `auto` | Solo hojas pequeñas se inlinean; `global.css` queda cacheable |
| `security.checkOrigin` | `true` | Protección CSRF en peticiones de desarrollo |
| `vite.build.assetsInlineLimit` | `0` | Nada se incrusta en base64; todo es cacheable |
| `rollupOptions.output` | `assets/[name]-[hash].[ext]` | Cache busting inmutable |
| `vite.server.headers` | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` | Solo aplica en `pnpm dev` |
| `vite.server.watch.usePolling` | `true` | HMR fiable en Windows |

No hay `output: "server"`, adapter, integraciones de framework ni `middleware`.

### Salida del build

| Archivo | Origen | Peso actual |
|---|---|---|
| `dist/index.html` | `pages/index.astro` | ≈55 KB |
| `dist/blog/index.html` | `pages/blog/index.astro` | ≈10 KB |
| `dist/blog/<slug>/index.html` | `pages/blog/[slug].astro` | ≈18 KB |
| `dist/toolkit/sql/index.html` | `pages/toolkit/sql.astro` | ≈24 KB |
| `dist/thanks/index.html` | `pages/thanks.astro` | ≈8 KB |
| `dist/404.html` | `pages/404.astro` | ≈9 KB |
| `dist/sitemap.xml` | `pages/sitemap.xml.ts` | 3 `<url>` con 1 artículo |
| `dist/rss.xml` | `pages/rss.xml.ts` | 1 `<item>` con 1 artículo |

## Capas y responsabilidades

```
┌─────────────────────────────────────────────────────────┐
│ Páginas (src/pages)                                     │
│ Metadatos SEO por ruta + composición de secciones       │
└───────────────┬─────────────────────────────────────────┘
                │ props: title, description, canonicalUrl,
                │ previewImage, schemaOrg, robots
┌───────────────▼─────────────────────────────────────────┐
│ Layout (src/layouts/Layout.astro)                        │
│ <head> SEO + CSP + RSS · nav · <slot/> · footer · JS     │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│ Componentes de sección (src/components)                  │
│ Markup semántico · consumo de datos · UI interactiva     │
└───────────────┬─────────────────────────────────────────┘
                │ imports type-only
┌───────────────▼─────────────────────────────────────────┐
│ Datos (src/data) + Tipos (src/types) + Colección (content)│
│ Contenido estructurado y validado en compilación          │
└─────────────────────────────────────────────────────────┘

Transversal: src/styles/global.css · src/utils/cloudinary.ts · public/ · astro.config.mjs
```

### Regla de dependencia

`pages → layouts → components → data/types`. Las páginas pueden consultar la colección con `getCollection`; los componentes no consultan la colección, reciben datos o importan `src/data`. Un componente no importa una página; un dato no importa un componente; `types` no importa nada del proyecto.

## Flujo de datos

1. **Contenido estructurado** (`personal.ts`, `projects.ts`, `certifications.ts`) se tipa con `PersonalInfo`, `Project`, `Certification`, `Badge`.
2. **Vistas derivadas** en `certifications.ts`: `allCertificationsData` se filtra en `featuredCertifications` (9) y `additionalCertifications` (13). No se duplican datos.
3. **Colección de blog**: `src/content.config.ts` define el esquema (`title`, `description`, `pubDate`, `updatedDate?`, `cover?`, `coverAlt?`, `tags`, `draft`); el loader `glob` lee `src/content/blog/**/*.{md,mdx}`.
4. **Componentes** importan solo lo que necesitan: `Hero`, `Contact`, `Toolkit` usan `personalInfo`; `Projects` usa `projectsData` + `personalInfo`; `Certifications` usa las dos vistas derivadas.
5. **Páginas** construyen los metadatos y pasan `schemaOrg` como objeto serializado a JSON-LD. Las páginas de blog consultan la colección y filtran `draft !== true`.
6. **Endpoints** (`sitemap.xml.ts`, `rss.xml.ts`) consultan la misma colección y ordenan por `pubDate` descendente.
7. **Build** resuelve todo; en runtime no hay fetching de contenido.

### Flujo editorial

| Quiero añadir | Archivo a editar | Requisito |
|---|---|---|
| Proyecto | `src/data/projects.ts` | Cumplir `Project` (`tags: Badge[]`) |
| Certificación | `src/data/certifications.ts` | `category: "featured" \| "additional"` obligatorio en la práctica |
| Artículo del blog | `src/content/blog/<slug>.md` | Frontmatter válido según `content.config.ts`; `draft: false` para publicar |
| Cambiar email/redes/foto/CVs | `src/data/personal.ts` | Revisar coherencia con `security.txt` y Schema.org |
| Nuevo caso de éxito | `src/components/Cases.astro` | Contenido editorial del componente |
| Nueva sección | Componente + `index.astro` + `navLinks` en `Layout.astro` + `global.css` | Mantener anclas y orden narrativo |
| Nueva ruta indexable | `src/pages/...` + entrada en `sitemap.xml.ts` | Metadatos completos |

## Interactividad

Sin framework. Seis piezas:

| Pieza | Archivo | Mecanismo | Ámbito |
|---|---|---|---|
| Reveal al hacer scroll | `Layout.astro` | `IntersectionObserver` con `rootMargin: "0px 0px -35% 0px"`, añade `.visible` | Global |
| Nav activo | `Layout.astro` | Listener de `scroll` con `requestAnimationFrame`, compara `offsetTop - 90` | Global |
| Menú móvil | `Layout.astro` | Botón `.nav-toggle` con `aria-expanded`/`aria-controls` sobre `#primary-navigation`; inyecta el enlace al blog en móvil | Global |
| Modal de certificaciones | `Certifications.astro` + `CertModal.astro` | `CustomEvent("open-cert-modal")` → `<dialog>.showModal()`; trampa de foco, cierre por botón/backdrop/`Esc` | Home |
| Filtro por tags | `blog/index.astro` | Botones con `aria-pressed` que ocultan tarjetas por `data-tags`, con contador `role="status"` | `/blog/` |
| Copiar / descargar SQL | `toolkit/sql.astro` | `navigator.clipboard.writeText`, `Blob` + `URL.createObjectURL`, datos desde `<script type="application/json" is:inline>` | `/toolkit/sql` |

Características: cero estado persistido, cero `localStorage`, cero cookies, cero red salvo el formulario.

## Pipeline de assets

- **Imágenes de contenido:** URLs de Cloudinary en `src/data/*.ts`, portadas del blog y metadatos sociales. `src/utils/cloudinary.ts` inserta `f_auto,q_auto` (y `c_limit,w_800`/`w_1200` en portadas) sin duplicar transformaciones existentes. El markup declara `width`/`height` y `loading="lazy"` (excepto el avatar del hero, `eager`). No se generan archivos de imagen en `dist/assets/`.
- **Assets locales:** CVs, iconos, OG image, `sw.js`, manifests y archivos de control. Se copian sin transformar.
- **CSS:** `global.css` importado desde el Layout ⇒ `dist/assets/Layout-[hash].css` (≈29.5 KB). Cada página con `<style>` añade su propia hoja (home ≈3.4 KB, blog ≈5.5 KB, artículo ≈5.8 KB, SQL ≈5.4 KB, thanks ≈1.3 KB, 404 ≈0.8 KB).
- **JS:** los `<script>` de Astro se compilan a módulos con hash en `dist/assets/` (6 archivos, ≈6.5 KB en total). El JSON-LD y el dataset SQL se inyectan inline. `public/sw.js` se copia tal cual y no se registra.
- **Fuentes:** se cargan desde Google Fonts con `preload` + hoja con `media="print"` que un script inline pasa a `media="all"` al cargar, con fallback `<noscript>`.

## Topología de despliegue

```
git push main
   └─ GitHub Actions (ubuntu-latest, Node 22, pnpm 12.18.0)
        ├─ pnpm install --frozen-lockfile --prod=false --ignore-scripts
        ├─ pnpm astro check
        ├─ pnpm test:links       (6 pruebas Node)
        ├─ pnpm build            → dist/
        ├─ pnpm check:links      (97 referencias en 6 HTML)
        ├─ playwright install --with-deps chromium
        ├─ pnpm test:e2e         (32 pruebas)
        └─ upload-pages-artifact → deploy-pages → GitHub Pages
             └─ https://juan-samayoa.is-a.dev (CNAME)
```

Sin entornos de staging, sin preview deployments, sin rollback automatizado.

## Invariantes arquitectónicos

1. La salida es estática; no se introduce ejecución en servidor.
2. Las dependencias de runtime son `astro` y `@astrojs/rss`.
3. Ninguna página se renderiza sin pasar por `Layout.astro`.
4. El contenido repetible vive en `src/data` y se tipa en `src/types`; los artículos viven en `src/content/blog` y se validan con `content.config.ts`.
5. Los orígenes externos están declarados en la CSP del Layout y en `_headers`.
6. Los assets públicos se referencian con rutas absolutas desde `/`.
7. El CSS de sección vive en `global.css`; las excepciones están justificadas por encapsulación.
8. El build debe pasar `astro check`, `check:links` y `test:e2e` sin errores.
9. Sitemap y RSS se derivan de la colección; nunca se editan a mano.

## Puntos de extensión previstos por la estructura

| Necesidad | Punto natural de extensión | Coste |
|---|---|---|
| Nueva sección en la home | Componente + import en `index.astro` + `navLinks` + bloque CSS | Bajo |
| Nueva página | `src/pages/*.astro` con Layout y metadatos | Bajo |
| Nuevo artículo | `.md` en `src/content/blog` (+ portada en Cloudinary) | Bajo |
| Nuevo campo del blog | `content.config.ts` + `.pages.yml` + uso en las vistas | Medio |
| Nuevo tipo de contenido | Colección en `content.config.ts` + `src/types` + componente | Medio |
| Cambiar imágenes | URLs en `src/data`, portadas o metadatos | Bajo (entrega vía Cloudinary) |
| Añadir analítica | `Layout.astro` + CSP + `_headers` | Medio (decisión de privacidad) |

## Reglas

- Respeta la dirección `pages → layouts → components → data/types`; no importes hacia arriba.
- No introduzcas SSR, adapters, API routes dinámicas ni estado en servidor.
- Todo contenido repetible va en `src/data`; todo artículo va en la colección.
- Los assets públicos se referencian desde `/` y deben existir en `public/`.
- Mantén los contratos de evento y props; si cambian, actualiza todos los consumidores.
- Actualiza los diagramas de `.ai/diagrams/` si cambia la topología.

## Ejemplos reales

- Flujo de datos de proyectos: `projects.ts` → `Projects.astro` → `<img>` con URL de Cloudinary transformada y `width`/`height`.
- Interacción desacoplada: `Certifications.astro` emite `open-cert-modal`; `CertModal.astro` lo escucha en `document`.
- Dato inyectado al cliente: `<script type="application/json" id="sql-all-data" is:inline>` alimenta la descarga `.sql`.
- Contenido derivado: `/sitemap.xml` y `/rss.xml` se generan de la misma consulta `getCollection("blog", ...)` que el índice.

## Riesgos conocidos

- **Acoplamiento por evento:** el modal depende de un `CustomEvent` con contrato implícito (`image`, `issuer`, `title`, `date`, `link`); un cambio de nombre rompe la UI sin error de compilación.
- **Dependencia de un tercero para el contenido visual:** sin fallback si Cloudinary falla.
- **`Layout.astro` monolítico:** concentra SEO, seguridad, navegación, RSS y comportamiento; alto riesgo de regresión transversal.
- **Estilos por página:** blog, SQL, 404 y thanks tienen su propio `<style>`, lo que puede divergir de `global.css`.
- **Service worker no registrado:** el archivo sugiere capacidades offline que la aplicación no activa. No debe documentarse como PWA funcional.
- **Sin staging:** todo cambio en `main` llega a producción tras pasar el workflow.

## Recomendaciones futuras

- Extraer datos y estilos de `toolkit/sql.astro` a módulos propios para reducir su tamaño y alinearlo con la arquitectura.
- Formalizar el contrato del modal en `src/types` si se añaden más consumidores.
- Evaluar un entorno de preview (por ejemplo, builds por PR sin publicar) antes de tocar `Layout.astro`.
- Documentar el esquema del blog en un único lugar si se añaden más campos o colecciones.
