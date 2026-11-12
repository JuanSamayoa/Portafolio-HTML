# ARCHITECTURE — Arquitectura del sistema

## Objetivo

Explicar cómo está construido el sitio, qué decisiones estructurales lo sostienen y qué invariantes debe respetar cualquier cambio.

## Alcance

Modelo de generación, capas, flujo de datos, interactividad, pipeline de assets, configuración, despliegue y puntos de extensión. No incluye guías visuales (ver `UX_UI.md`) ni detalle de cabeceras (ver `SECURITY.md`).

## Modelo de generación

**SSG puro.** Astro resuelve todo en `pnpm build` y emite HTML estático a `dist/`.

| Aspecto | Configuración real | Consecuencia |
|---|---|---|
| `site` | `https://juan-samayoa.is-a.dev` | Base para canónicas y `Astro.site` |
| `base` | `/` | Rutas absolutas desde la raíz |
| `outDir` | `./dist` | GitHub Pages publica ese directorio |
| `build.assets` | `assets` | CSS/JS/imágenes procesadas van a `dist/assets/` |
| `security.checkOrigin` | `true` | Protección CSRF en peticiones de desarrollo |
| `vite.build.assetsInlineLimit` | `0` | Nada se incrusta en base64; todo es cacheable |
| `rollupOptions.output` | `assets/[name]-[hash].[ext]` | Cache busting inmutable |
| `vite.server.headers` | `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection` | Solo aplica en `pnpm dev` |
| `vite.server.watch.usePolling` | `true` | HMR fiable en Windows |

No hay `output: "server"`, adapter, integraciones de framework ni `middleware`.

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
│ <head> SEO + CSP · nav · <slot/> · footer · JS global    │
└───────────────┬─────────────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────────────┐
│ Componentes de sección (src/components)                  │
│ Markup semántico · consumo de datos · UI interactiva     │
└───────────────┬─────────────────────────────────────────┘
                │ imports type-only
┌───────────────▼─────────────────────────────────────────┐
│ Datos (src/data) + Tipos (src/types)                     │
│ Contenido estructurado y validado en compilación         │
└─────────────────────────────────────────────────────────┘

Transversal: src/styles/global.css · public/ · astro.config.mjs
```

### Regla de dependencia

`pages → layouts → components → data → types`. Nunca al revés. Un componente no importa una página; un dato no importa un componente; `types` no importa nada del proyecto.

## Flujo de datos

1. **Contenido estructurado** (`personal.ts`, `projects.ts`, `certifications.ts`) se tipa con `PersonalInfo`, `Project`, `Certification`, `Badge`.
2. **Vistas derivadas** en `certifications.ts`: `allCertificationsData` se filtra en `featuredCertifications` y `additionalCertifications` (patrón DRY). No se duplican datos.
3. **Componentes** importan solo lo que necesitan: `Hero`, `Contact`, `Toolkit` usan `personalInfo`; `Projects` usa `projectsData` + `personalInfo`; `Certifications` usa las dos vistas derivadas.
4. **Páginas** construyen los metadatos y pasan `schemaOrg` como objeto serializado a JSON-LD.
5. **Build** resuelve todo; en runtime no hay fetching de contenido.

### Flujo editorial (añadir contenido)

| Quiero añadir | Archivo a editar | Requisito |
|---|---|---|
| Proyecto | `src/data/projects.ts` | Cumplir `Project` (`tags: Badge[]`) |
| Certificación | `src/data/certifications.ts` | `category: "featured" \| "additional"` obligatorio en la práctica |
| Cambiar email/redes/foto/CVs | `src/data/personal.ts` | Revisar coherencia con `security.txt` y Schema.org |
| Nuevo caso de éxito | `src/components/Cases.astro` | Contenido editorial del componente |
| Nueva sección | Componente + `index.astro` + `navLinks` en `Layout.astro` + `global.css` | Mantener anclas y orden narrativo |
| Nueva ruta | `src/pages/...` | Metadatos completos y `sitemap.xml` si debe indexarse |

## Interactividad

Sin framework. Cuatro piezas:

| Pieza | Archivo | Mecanismo | Estado |
|---|---|---|---|
| Reveal al hacer scroll | `Layout.astro` | `IntersectionObserver` con `rootMargin: "0px 0px -35% 0px"`, añade `.visible` | Global |
| Nav activo | `Layout.astro` | Listener de `scroll` con `requestAnimationFrame`, compara `offsetTop - 90` | Global |
| Modal de certificaciones | `Certifications.astro` + `CertModal.astro` | `CustomEvent("open-cert-modal")` → `<dialog>.showModal()`; cierre por botón, backdrop y `Esc` nativo | Home |
| Copiar / descargar SQL | `toolkit/sql.astro` | `navigator.clipboard.writeText`, `Blob` + `URL.createObjectURL`, datos desde `<script type="application/json" is:inline>` | `/toolkit/sql` |

Características: cero estado persistido, cero `localStorage`, cero cookies, cero red salvo el formulario.

## Pipeline de assets

- **Imágenes de contenido:** URLs absolutas de Cloudinary en `src/data/*.ts` y en `previewImage`/`ogImage` de las páginas. Se renderizan con `<Image>` de `astro:assets` con `width`/`height` y `loading="lazy"` (excepto la foto del hero, `eager`). Evidencia del build: el HTML final conserva la URL remota original, sin `srcset` ni archivos de imagen en `dist/assets/`; la optimización depende de Cloudinary, no del build.
- **Assets locales:** solo CVs, iconos, OG image, `sw.js`, manifests y archivos de control. Se copian sin transformar.
- **CSS:** `global.css` importado desde el Layout ⇒ `dist/assets/Layout-[hash].css` (≈25 KB). `toolkit/sql.astro` añade su propio CSS encapsulado (≈5 KB).
- **JS:** los `<script>` de Astro se compilan a módulos con hash en `dist/assets/` (4 archivos, ≈3.3 KB en total). El JSON-LD y el dataset SQL se inyectan inline. `public/sw.js` se copia tal cual y no se registra.
- **Sin imágenes locales de proyectos ni iconos PWA:** los patrones de caché del SW para `/assets/img/` y `/assets/icons/` no tienen contenido real.

## Topología de despliegue

```
git push main
   └─ GitHub Actions (ubuntu-latest, Node 22, pnpm 10.19.0)
        ├─ pnpm install --frozen-lockfile --prod=false --ignore-scripts
        ├─ pnpm check      (bloqueante)
        ├─ pnpm build      → dist/
        └─ upload-pages-artifact → deploy-pages → GitHub Pages
             └─ https://juan-samayoa.is-a.dev (CNAME)
```

Sin entornos de staging, sin preview deployments, sin rollback automatizado.

## Invariantes arquitectónicos

1. La salida es estática; no se introduce ejecución en servidor.
2. La única dependencia de runtime es `astro`.
3. Ninguna página se renderiza sin pasar por `Layout.astro`.
4. El contenido repetible vive en `src/data` y se tipa en `src/types`.
5. Los orígenes externos están declarados en la CSP del Layout y en `_headers`.
6. Los assets públicos se referencian con rutas absolutas desde `/`.
7. El CSS de sección vive en `global.css`; las excepciones están justificadas por encapsulación.
8. El build debe pasar `pnpm check` y `pnpm build` sin errores.

## Puntos de extensión previstos por la estructura

| Necesidad | Punto natural de extensión | Coste |
|---|---|---|
| Nueva sección en la home | Componente + import en `index.astro` + `navLinks` + bloque CSS | Bajo |
| Nueva página | `src/pages/*.astro` con Layout y metadatos | Bajo |
| Nuevo tipo de contenido | `src/types` + `src/data` + componente | Medio |
| Cambiar imágenes | URLs en `src/data` y páginas | Bajo (entrega vía Cloudinary) |
| Añadir analítica | `Layout.astro` + CSP + `_headers` | Medio (decisión de privacidad) |

## Reglas

- Respeta la dirección `pages → layouts → components → data → types`; no importes hacia arriba.
- No introduzcas SSR, adapters, API routes ni estado en servidor.
- Todo contenido repetible va en `src/data` y se tipa en `src/types/portfolio.ts`.
- Los assets públicos se referencian desde `/` y deben existir en `public/`.
- Mantén los contratos de evento y props; si cambian, actualiza todos los consumidores.
- Actualiza los diagramas de `.ai/diagrams/` si cambia la topología.

## Ejemplos reales

- Flujo de datos de proyectos: `projects.ts` → `Projects.astro` → `<Image>` con URL de Cloudinary y `width`/`height`.
- Interacción desacoplada: `Certifications.astro` emite `open-cert-modal`; `CertModal.astro` lo escucha en `document`.
- Dato inyectado al cliente: `<script type="application/json" id="sql-all-data" is:inline>` alimenta la descarga `.sql`.
- Salida del build: `dist/index.html`, `dist/thanks/index.html`, `dist/toolkit/sql/index.html`, `dist/404.html`.

## Riesgos conocidos

- **Acoplamiento por evento:** el modal depende de un `CustomEvent` con contrato implícito (`image`, `issuer`, `title`, `date`, `link`); un cambio de nombre rompe la UI sin error de compilación.
- **Dependencia de un tercero para el contenido visual:** sin fallback si Cloudinary falla.
- **`Layout.astro` monolítico:** concentra SEO, seguridad, navegación y comportamiento; alto riesgo de regresión transversal.
- **Duplicación de estilos de página:** `/toolkit/sql` tiene su propio sistema visual parcial, lo que puede divergir de `global.css`.
- **Service worker no registrado:** el archivo sugiere capacidades offline que la aplicación no activa. No debe documentarse como PWA funcional.
- **Sin staging:** todo cambio en `main` llega a producción.

## Recomendaciones futuras

- Extraer datos y estilos de `toolkit/sql.astro` a módulos propios para reducir su tamaño y alinearlo con la arquitectura.
- Formalizar el contrato del modal en `src/types` si se añaden más consumidores.
- Evaluar un entorno de preview (por ejemplo, builds por PR sin publicar) antes de tocar `Layout.astro`.
- Añadir verificación automatizada de enlaces internos y assets para proteger los invariantes 6 y 8.
