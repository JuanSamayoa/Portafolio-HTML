# DECISIONS — Registro de decisiones técnicas

## Objetivo

Preservar el razonamiento detrás de las decisiones ya materializadas en el código, distinguir lo decidido de lo implícito y evitar que un agente revierta decisiones sin conocer su contexto.

## Alcance

Decisiones estructurales verificables en el repositorio. No incluye propuestas futuras (ver `ROADMAP.md`) ni detalles de implementación (ver `ARCHITECTURE.md`).

## Formato

Cada decisión usa: **ID · Decisión · Contexto · Evidencia · Consecuencias · Estado**.

Estados posibles: `Aceptada` (implementada y coherente), `Implícita` (nunca formalizada, pero sostenida por el código), `Histórica` (visible en el historial), `No decidida` (`PENDIENTE DE DEFINICIÓN`, requiere al autor).

---

## D-01 — Generación estática con Astro

- **Decisión:** construir el sitio como SSG puro sin adapter ni SSR.
- **Contexto:** portafolio personal, sin datos dinámicos ni usuarios.
- **Evidencia:** `astro.config.mjs` sin `adapter`; build de 4 HTML; inexistencia de API routes/middleware.
- **Consecuencias:** hosting gratuito, superficie de ataque mínima, sin necesidad de runtime; a cambio, todo cambio de contenido exige rebuild.
- **Estado:** Aceptada.

## D-02 — Una sola página con navegación por anclas

- **Decisión:** concentrar el contenido en `/` con 12 secciones y `navLinks` a 8 anclas.
- **Contexto:** narrativa de portafolio que se lee de arriba a abajo.
- **Evidencia:** `src/pages/index.astro`, `Layout.astro`, `id` de sección en cada componente.
- **Consecuencias:** scroll largo, SEO concentrado en una URL, nav simple; en móvil se usa un menú disclosure nativo (D-22).
- **Estado:** Aceptada.

## D-03 — Separar datos tipados de presentación

- **Decisión:** el contenido repetible vive en `src/data` y se contrata en `src/types/portfolio.ts`.
- **Contexto:** evitar duplicación y errores al actualizar proyectos y certificaciones.
- **Evidencia:** `PersonalInfo`, `Project`, `Certification`, `Badge`; consumo desde 5 componentes.
- **Consecuencias:** actualizar contenido es de bajo riesgo; añadir contenido fuera de los tipos sigue siendo manual.
- **Estado:** Aceptada.

## D-04 — Catálogo único de certificaciones con vistas derivadas

- **Decisión:** una sola lista `allCertificationsData` con `category`, filtrada en `featured` y `additional`.
- **Contexto:** dos presentaciones distintas (grid y acordeón) del mismo dato.
- **Evidencia:** `src/data/certifications.ts`.
- **Consecuencias:** DRY real; omitir `category` hace invisible la certificación y no hay validación en compilación.
- **Estado:** Aceptada.

## D-05 — Un único sistema CSS con tokens

- **Decisión:** concentrar el diseño en `src/styles/global.css` con variables CSS y clases por sección.
- **Contexto:** proyecto pequeño, sin necesidad de CSS Modules ni utilidades.
- **Evidencia:** 1978 líneas / ≈32 KB de fuente; ≈25 KB compilados; 4 excepciones con `<style>` local.
- **Consecuencias:** consistencia visual y un solo lugar de edición; archivo grande y riesgo de duplicación.
- **Estado:** Aceptada (con excepciones justificadas).

## D-06 — Sin framework de UI ni librerías de cliente

- **Decisión:** interactividad con APIs nativas (`<dialog>`, `<details>`, `IntersectionObserver`, `Blob`, `clipboard`).
- **Contexto:** solo se necesita revelar secciones, abrir un modal y copiar/descargar SQL.
- **Evidencia:** ausencia de dependencias de UI; scripts compilados de 0.5–1.05 KB; sin islas.
- **Consecuencias:** carga mínima de JS; más código manual y contratos por evento.
- **Estado:** Aceptada.

## D-07 — FormSubmit como backend del formulario

- **Decisión:** delegar el envío de email a FormSubmit.co con redirect a `/thanks`.
- **Contexto:** no hay servidor ni se quiere operar uno.
- **Evidencia:** `action` con hash, `_next`, `_honey`, `_captcha`, `_template` en `Contact.astro`; CSP restringida a `formsubmit.co`.
- **Consecuencias:** cero infraestructura; dependencia de un tercero, sin control de entrega ni rate limiting propio.
- **Estado:** Aceptada.

## D-08 — Cloudinary como CDN de imágenes

- **Decisión:** alojar todas las imágenes de contenido en Cloudinary y referenciarlas por URL.
- **Contexto:** evitar versionar binarios y delegar transformación/entrega.
- **Evidencia:** 31 referencias a `res.cloudinary.com` en el HTML del home; no hay imágenes locales de proyectos ni perfil.
- **Consecuencias:** imágenes optimizables y cacheables por el CDN; dependencia total de un tercero y sin fallback.
- **Estado:** Aceptada.

## D-09 — GitHub Pages + GitHub Actions como despliegue

- **Decisión:** publicar `dist/` en GitHub Pages con dominio custom y workflow propio.
- **Contexto:** hosting gratuito, HTTPS y CDN para un sitio estático.
- **Evidencia:** `.github/workflows/deploy-pages.yml`, `public/CNAME`, `public/.nojekyll`, `site` en la config.
- **Consecuencias:** despliegue en cada push a `main`; sin staging; `_headers` no se aplica.
- **Estado:** Aceptada.

## D-10 — Seguridad en dos capas (meta + `_headers`)

- **Decisión:** duplicar la CSP en `<meta>` y en `public/_headers`.
- **Contexto:** GitHub Pages no permite cabeceras personalizadas, pero el proyecto podría migrar de host.
- **Evidencia:** CSP idéntica en `Layout.astro` y `_headers`; README lo explica.
- **Consecuencias:** protección efectiva vía meta; riesgo de desincronización entre ambas copias.
- **Estado:** Aceptada.

## D-11 — Dependencia mínima y overrides de seguridad

- **Decisión:** una sola dependencia de runtime y fijar versiones transitivas vulnerables.
- **Contexto:** reducir superficie de supply chain.
- **Evidencia:** `dependencies: astro`; overrides `minimatch 9.0.7`, `ajv 8.18.0`, `sucrase 3.35.1`, `lodash 4.17.23`, `sharp 0.35.3`; CI con `--ignore-scripts`.
- **Consecuencias:** instalación ligera; los overrides deben revisarse al actualizar Astro.
- **Estado:** Aceptada.

## D-12 — pnpm fijado con Corepack

- **Decisión:** fijar `pnpm@12.18.0` con hash y usar `--frozen-lockfile` en CI.
- **Evidencia:** `packageManager` en `package.json`; pasos del workflow; `pnpm-workspace.yaml` con overrides.
- **Consecuencias:** builds reproducibles; actualizar pnpm requiere cambiar el hash y revisar `pnpm-workspace.yaml`.
- **Estado:** Aceptada (actualizada en la auditoría documental de 2026-11-12).

## D-13 — Sin pruebas automatizadas

- **Decisión:** no se implementó suite de tests; la validación es `astro check` + build.
- **Contexto:** proyecto de contenido con poca lógica.
- **Evidencia:** ausencia de script `test`, de framework y de archivos de test; CI solo ejecuta `check` y `build`.
- **Consecuencias:** feedback rápido; regresiones de UI, accesibilidad, SEO y enlaces no se detectan.
- **Estado:** Sustituida por D-23 (fase 1, 2026-11-11).

## D-14 — Modal de certificaciones por evento personalizado

- **Decisión:** `Certifications.astro` emite `open-cert-modal` y `CertModal.astro` lo escucha en `document`.
- **Contexto:** evitar props y mantener el modal desacoplado en el markup.
- **Evidencia:** `document.dispatchEvent(new CustomEvent(...))`, `addEventListener("open-cert-modal", ...)` y trampa de foco en `CertModal.astro` (D-24).
- **Consecuencias:** desacoplamiento de markup; contrato no tipado. La interacción anidada se corrigió con botones overlay en la fase 1 y el ciclo de foco se cerró en la fase 2.
- **Estado:** Aceptada (con deuda).

## D-15 — Acordeones nativos para contenido secundario

- **Decisión:** usar `<details>/<summary>` en FAQ y certificaciones adicionales, sin JS.
- **Evidencia:** `Faq.astro`, `Certifications.astro`, estilos `[open]`.
- **Consecuencias:** accesibilidad y robustez gratuitas; limitaciones de animación y de control fino.
- **Estado:** Aceptada.

## D-16 — Sitemap y RSS dinámicos desde la colección

- **Decisión:** generar `/sitemap.xml` y `/rss.xml` desde `getCollection("blog")` en endpoints de Astro, excluyendo borradores.
- **Contexto:** el blog añade rutas dinámicas y el sitemap manual se desactualizaba.
- **Evidencia:** `src/pages/sitemap.xml.ts`, `src/pages/rss.xml.ts`, `src/content.config.ts`.
- **Consecuencias:** el índice, el sitemap y el feed se mantienen coherentes; un borrador mal marcado puede publicar contenido no deseado.
- **Estado:** Aceptada (sustituye la decisión anterior de sitemap manual; ver D-29).

## D-17 — `/toolkit/sql` fuera de índices

- **Decisión:** marcar el playground con `robots="noindex, follow"`.
- **Evidencia:** prop en `toolkit/sql.astro`; ausencia en el sitemap.
- **Consecuencias:** evita canibalizar la home con contenido técnico duplicado; limita su descubrimiento orgánico.
- **Estado:** Aceptada (motivo exacto `PENDIENTE DE DEFINICIÓN`).

## D-18 — Service worker publicado pero no registrado

- **Decisión:** `public/sw.js` existe y se despliega, pero ninguna página lo registra.
- **Evidencia:** ausencia de `navigator.serviceWorker.register` en `src/`; `sw.js` presente en `dist/`.
- **Consecuencias:** no hay offline ni caché controlada; el archivo aumenta superficie latente.
- **Estado:** **No decidida** (`PENDIENTE DE DEFINICIÓN:` si es legado o trabajo pendiente).

## D-19 — Dos manifests idénticos

- **Decisión:** mantener `manifest.json` y `site.webmanifest` con el mismo contenido; el Layout enlaza el segundo.
- **Evidencia:** archivos idénticos byte a byte.
- **Consecuencias:** duplicación y riesgo de divergencia; el icono declarado 192×192 no coincide con el PNG real de 180×180.
- **Estado:** **No decidida**.

## D-20 — Tailwind instalado sin uso en el diseño

- **Decisión:** Tailwind 4 está en devDependencies y como plugin de Vite, con `tailwind.config.cjs` mínimo, pero el markup no usa utilidades.
- **Evidencia:** configuración y `global.css` como sistema real; ausencia de clases utilitarias en componentes.
- **Consecuencias:** coste de dependencia sin beneficio actual; posible intención futura.
- **Estado:** **No decidida**.

## D-21 — Reescritura y reducción de páginas en v2

- **Decisión:** consolidar el sitio en una home con componentes por sección, eliminando páginas previas.
- **Evidencia:** commit `b9daa58` ("refactored whole codebase, deleted unnecesary pages and changed the layout") y la estructura de `src/pages` resultante.
- **Consecuencias:** menos rutas y mantenimiento más simple; pérdida de URLs antiguas (sin redirecciones configuradas).
- **Estado:** Histórica.

## D-22 — Navegación móvil con divulgación nativa

- **Decisión:** en ≤940 px los enlaces se agrupan en un botón `.nav-toggle` que controla el panel `#primary-navigation` con `aria-expanded`/`aria-controls`; la apertura mueve el foco al primer enlace, `Escape` cierra y devuelve el foco, y el scroll del body se bloquea y restaura.
- **Contexto:** el menú anterior se ocultaba sin sustituto y hacía inalcanzables las secciones en móvil.
- **Evidencia:** `Layout.astro` (botón, panel y script), `global.css` (`.nav-toggle`, panel ≤940 px) y pruebas de `tests/phase1.spec.ts` en 320×568, 375×812, 390×844 y 768×1024.
- **Consecuencias:** navegación operable con teclado y tacto sin dependencias; el script debe mantener sincronizados `aria-expanded`, foco y scroll.
- **Estado:** Aceptada.

## D-23 — Playwright para pruebas E2E

- **Decisión:** incorporar `@playwright/test` 1.63 como devDependency y una suite E2E (`tests/phase1.spec.ts`, `tests/phase2.spec.ts`) ejecutada con `pnpm test:e2e`. Localmente usa Chrome del sistema (`channel: "chrome"`); en CI usa el Chromium instalado por Playwright. El preview corre en el puerto 5173 (configurable con `PW_PORT`).
- **Contexto:** la fase correctiva exige evidencia de teclado, modales, propagación, viewports, no-JS y movimiento reducido; `astro check` y el build no cubren interacción.
- **Evidencia:** `playwright.config.ts`, `package.json`, 20 pruebas aprobadas tanto en Chrome 157 local como con Chromium administrado y `CI=1`; el webServer compila y sirve el preview en local.
- **Consecuencias:** feedback real de navegador sin depender del Chrome de una máquina en CI; nueva dependencia de desarrollo y ≈25–30 s por ejecución. El puerto 4321 está excluido por Windows, por eso el valor por defecto es 5173.
- **Estado:** Aceptada.

## D-24 — Trampa de foco propia en el modal nativo

- **Decisión:** mantener el `<dialog>` nativo y añadir una trampa de foco pequeña en `CertModal.astro`: `Tab` y `Shift+Tab` ciclan entre controles visibles del diálogo; sin controles, el foco va al contenedor (`tabindex="-1"`). Al abrir se enfoca el primer control; al cerrar por botón, fondo o `Escape` se restaura el disparador. El cierre por botón/fondo se finaliza de forma síncrona e idempotente para que el evento `close` diferido no robe el foco a una reapertura.
- **Contexto:** la fase 1 restauraba foco y scroll, pero no contenía el ciclo de tabulación y el evento `close` asíncrono podía interferir con una apertura inmediata.
- **Evidencia:** `src/components/CertModal.astro`; pruebas de ciclo directo/inverso, `Escape`, cierre con botón, cierre con backdrop, reapertura y restauración en `tests/phase2.spec.ts` y `tests/phase3.spec.ts`.
- **Consecuencias:** sin dependencias nuevas; el contenido tras el modal queda inerte gracias a `showModal()`. La lista de enfocables debe mantenerse si se añaden controles.
- **Estado:** Aceptada.

## D-25 — Barrera de CI para build, referencias y E2E

- **Decisión:** el workflow existente ejecuta, en orden y de forma bloqueante: `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test:links`, `pnpm build`, `pnpm check:links`, `pnpm exec playwright install --with-deps chromium` y `pnpm test:e2e`. El webServer de Playwright no recompila en CI; publica reporte HTML y artefactos (`test-results/`) solo con `if: failure()`.
- **Contexto:** las pruebas existían pero no protegían `main`; además se quería evitar depender del Chrome de un runner y duplicar el build.
- **Evidencia:** `.github/workflows/deploy-pages.yml`, `playwright.config.ts`; YAML validado con PyYAML y suite ejecutada localmente con `CI=1` y Chromium administrado (20/20). **No hay ejecución confirmada en GitHub Actions.**
- **Consecuencias:** cualquier fallo de check, referencias o E2E detiene el despliegue; la primera ejecución real sigue pendiente. `actionlint` no estaba disponible localmente.
- **Estado:** Aceptada (workflow configurado, ejecución en CI no verificada).

## D-26 — Progresión sin JavaScript y movimiento reducido

- **Decisión:** `<html>` nace con `no-js`; un script inline lo cambia a `js` antes del render. `.reveal` es visible por defecto y solo se oculta con `html.js`. Sin JS, la navegación móvil se muestra como fila envolvente (sin botón) y se ocultan los disparadores de modal y los controles SQL que dependen de JS. `prefers-reduced-motion: reduce` desactiva scroll suave, reveal, delays y animaciones decorativas sin tocar los indicadores de foco.
- **Contexto:** el contenido dependía de `IntersectionObserver` y el botón de menú no operaba sin JS; las animaciones se ejecutaban siempre.
- **Evidencia:** `Layout.astro`, `global.css`, `toolkit/sql.astro`; pruebas sin JavaScript y con `reducedMotion: "reduce"` en `tests/phase2.spec.ts`.
- **Consecuencias:** degradación legible y navegable sin una segunda arquitectura de navegación; el fallback móvil usa CSS y puede diferir visualmente del menú con JS.
- **Estado:** Aceptada.

## D-27 — Comprobador de referencias locales sin dependencias

- **Decisión:** `tools/check-local-references.mjs` recorre el HTML de `dist/`, extrae `href`, `src`, `srcset`, `poster`, iconos, manifest y metadatos Open Graph/Twitter, ignora protocolos externos y resuelve rutas absolutas/relativas, query, fragmentos y `base` de Astro. Falla con código 1 e informa archivo y referencia.
- **Contexto:** el build no detecta enlaces o assets locales inexistentes y ya hubo referencias huérfanas.
- **Evidencia:** 97 referencias en 6 HTML sin roturas; 6 pruebas Node con fixtures válidos, rotos, `base` y código de salida; paso `pnpm check:links` en CI.
- **Consecuencias:** verificación reproducible sin dependencias; `base` se lee del literal de `astro.config.mjs`, por lo que una base calculada exigiría pasar `--base`.
- **Estado:** Aceptada.

---

## D-28 — Blog con Astro Content Collections y Pages CMS

- **Decisión:** los artículos viven en `src/content/blog` validados con `src/content.config.ts` (zod) y se editan con Pages CMS mediante `.pages.yml`.
- **Contexto:** añadir un canal editorial sin romper el modelo estático ni introducir un backend.
- **Evidencia:** `src/content.config.ts`, `src/content/blog/arquitectura-portafolio-astro.md`, `.pages.yml`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`.
- **Consecuencias:** publicar un artículo es crear un `.md`; borradores (`draft: true`) quedan fuera del índice, sitemap y RSS pero se generan en `dist/`. Pages CMS opera sobre el repositorio y depende de sus permisos.
- **Estado:** Aceptada.

## D-29 — Sitemap y RSS dinámicos desde la colección

- **Decisión:** generar `/sitemap.xml` y `/rss.xml` en build a partir de `getCollection("blog", ({ data }) => data.draft !== true)`.
- **Contexto:** el sitemap manual se desactualizaba al añadir rutas y artículos.
- **Evidencia:** `src/pages/sitemap.xml.ts`, `src/pages/rss.xml.ts`, `robots.txt` con `Sitemap:`.
- **Consecuencias:** índice, sitemap y feed comparten filtro y orden; un borrador mal marcado puede publicar contenido no deseado. No hay sitemap estático en `public/`.
- **Estado:** Aceptada.

## D-30 — CSP endurecida y COEP `credentialless`

- **Decisión:** restringir la CSP a `self`, `https://res.cloudinary.com` y `https://formsubmit.co`, con `object-src 'none'`, `frame-src 'none'` y `worker-src 'self'`; usar `COEP: credentialless` para compatibilidad con Cloudinary.
- **Contexto:** la CSP anterior permitía `https:` abierto y `COEP: require-corp` rompía imágenes remotas.
- **Evidencia:** `Layout.astro` (meta), `public/_headers`, `SECURITY.md`.
- **Consecuencias:** mejor protección frente a inyección; cualquier origen nuevo exige actualizar ambas copias. `unsafe-inline` sigue presente para scripts/estilos de Astro.
- **Estado:** Aceptada.

## D-31 — Helper de optimización de imágenes en Cloudinary

- **Decisión:** centralizar la inserción de transformaciones en `src/utils/cloudinary.ts` (`optimizedCloudinary`, `f_auto,q_auto`, `c_limit,w_*`).
- **Contexto:** evitar transformaciones manuales dispersas y URLs duplicadas.
- **Evidencia:** `src/utils/cloudinary.ts`, uso en `Projects`, `Certifications`, `CertModal`, `Hero`, `blog/[slug]`.
- **Consecuencias:** entrega optimizada por defecto; sin fallback local si Cloudinary falla.
- **Estado:** Aceptada.

## D-32 — Fuentes no bloqueantes

- **Decisión:** cargar Google Fonts con `preload as=style`, hoja con `media="print"` activada por script inline y fallback `<noscript>`.
- **Contexto:** la afirmación anterior de fuentes render-blocking quedó obsoleta.
- **Evidencia:** `Layout.astro`, `PERFORMANCE.md`.
- **Consecuencias:** mejor LCP potencial; dependencia de JS mínimo para activar la hoja (hay fallback).
- **Estado:** Aceptada.

## D-33 — Selectores acotados `.site-nav` y `.site-footer`

- **Decisión:** reemplazar los selectores de elemento `nav`/`footer` por clases `.site-nav` y `.site-footer` para evitar colisiones con sub-navegaciones y pies de artículo.
- **Contexto:** los estilos globales alcanzaban HTML de página (nav móvil, footer del artículo).
- **Evidencia:** `global.css`, `Layout.astro`, `blog/[slug].astro`.
- **Consecuencias:** encapsulación más segura; mayor verbosidad en el markup.
- **Estado:** Aceptada.

## D-34 — Enlace del blog en `.nav-actions`

- **Decisión:** mantener el enlace `blog` dentro de `.nav-actions`, fuera de `#primary-navigation`, para preservar los 8 enlaces verificados en `phase1.spec.ts`.
- **Contexto:** el test cuenta exactamente 8 anclas en la navegación principal.
- **Evidencia:** `Layout.astro`, `tests/phase1.spec.ts`.
- **Consecuencias:** en escritorio el blog vive en la barra de acciones; en móvil se inyecta en el panel.
- **Estado:** Aceptada.

## D-35 — Exclusiones del service worker

- **Decisión:** el service worker excluye `/assets/cv/` y respuestas `no-store`/`private`, y valida el origen de cada request.
- **Contexto:** evitar cachear CVs y respuestas no cacheables.
- **Evidencia:** `public/sw.js`.
- **Consecuencias:** mayor robustez si se registra; hoy no se registra (D-18).
- **Estado:** Aceptada (complementa D-18).

## D-36 — CI con mínimo privilegio y acciones pinneadas

- **Decisión:** el workflow usa `contents: read` global, `pages: write`/`id-token: write` solo en `deploy`, acciones pinneadas por SHA, caché de pnpm+Astro y `cancel-in-progress: false`.
- **Contexto:** hardening de supply chain y serialización de despliegues.
- **Evidencia:** `.github/workflows/deploy-pages.yml`.
- **Consecuencias:** despliegues serializados; cualquier cambio de permisos requiere revisión explícita.
- **Estado:** Aceptada.

## D-37 — Migración a pnpm 12.18.0 y overrides en workspace

- **Decisión:** migrar a `pnpm@12.18.0` y trasladar `overrides` y `minimumReleaseAge` a `pnpm-workspace.yaml` (el campo `pnpm` de `package.json` se ignora en pnpm 12).
- **Contexto:** pnpm 12 cambió la ubicación de la configuración de workspace.
- **Evidencia:** `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`.
- **Consecuencias:** builds reproducibles; cambios de dependencias exigen actualizar el lockfile.
- **Estado:** Aceptada.

---

## Cómo registrar una decisión nueva

1. Añadir `D-24`, `D-25`… al final, sin renumerar.
2. Completar las seis partes; si falta evidencia, marcar `PENDIENTE DE DEFINICIÓN:`.
3. Actualizar `ARCHITECTURE.md` si cambia un invariante.
4. Registrar el cambio en `CHANGELOG_AI.md`.

## Reglas

- No renumera decisiones existentes; añade la siguiente al final.
- Toda decisión debe incluir contexto, evidencia, consecuencias y estado.
- Una decisión sin evidencia en el código no es una decisión: es una propuesta (va a `ROADMAP.md`).
- Si un cambio revierte una decisión, registra una nueva que la sustituya y enlaza la anterior.
- Actualiza `ARCHITECTURE.md` cuando cambie un invariante y `CHANGELOG_AI.md` al cerrar la sesión.

## Ejemplos reales

- `D-07` explica por qué el formulario no tiene backend: FormSubmit + redirect a `/thanks`.
- `D-05` justifica el CSS centralizado: 1,978 líneas y 4 excepciones encapsuladas.
- `D-18` documenta un hecho sin decisión: `sw.js` se publica pero no se registra.
- `D-21` se reconstruyó desde el commit `b9daa58`, no desde documentación previa.

## Riesgos conocidos

- Varias decisiones son implícitas y podrían revertirse por desconocimiento (D-13, D-16, D-18, D-19, D-20).
- El historial no documenta el motivo de cambios importantes (solo el qué).
- No hay ADRs previos a este documento; las decisiones D-01 a D-12 se reconstruyeron desde el código.

## Recomendaciones futuras

- Resolver las decisiones marcadas como `No decidida` con el autor y actualizar su estado.
- Añadir una decisión por cada cambio arquitectónico futuro en el mismo commit.
- Enlazar cada decisión con su commit cuando exista.
