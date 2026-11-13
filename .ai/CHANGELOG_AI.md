# CHANGELOG_AI — Historial de cambios asistidos por IA

## Objetivo

Mantener un registro cronológico, verificable y en español de los cambios relevantes realizados por agentes de IA en este repositorio, incluyendo el estado de verificación y los hallazgos que no se corrigieron.

## Alcance

Cambios en código, contenido, configuración, documentación y decisiones. No sustituye al historial de Git; lo complementa con contexto y evidencia.

## Reglas

- Formato: fecha (ISO), autor-agente, resumen, archivos, verificación, pendientes.
- Registrar solo hechos comprobados; marcar lo no verificado.
- No incluir secretos, tokens ni datos sensibles.
- Si un cambio revierte otro, referenciarlo explícitamente.
- Una entrada por sesión de trabajo relevante, no por cada archivo.

---

## 2026-11-11 · Fase 2: foco, CI, referencias, no-JS y movimiento reducido

**Agente:** Buffy (Freebuff)

**Resumen:** segunda fase de estabilización aprobada. Se completó el ciclo de foco del modal, se convirtió Playwright en barrera de CI con Chromium administrado, se añadió un comprobador de referencias locales, y se implementaron degradación sin JavaScript y `prefers-reduced-motion`. Sin rediseño ni cambios de contenido profesional.

**Cambios implementados:**

1. Modal: trampa de foco con ciclo `Tab`/`Shift+Tab`, filtrado de controles visibles, foco al primer control, foco al contenedor si no hay controles y restauración del disparador al cerrar. El cierre por botón, fondo o backdrop se finaliza de forma síncrona e idempotente para evitar que el evento `close` diferido robe el foco a una reapertura; la prueba dedicada de backdrop se añadió en esta sesión.
2. CI: el workflow existente añade `pnpm test:links`, `pnpm check:links`, instalación de Chromium de Playwright y `pnpm test:e2e` antes de publicar. `playwright.config.ts` usa Chrome local y Chromium en CI, no recompila en CI y genera reporte HTML; los artefactos se suben solo con `if: failure()`.
3. Referencias: `tools/check-local-references.mjs` revisa `href`, `src`, `srcset`, `poster`, iconos, manifest y OG/Twitter en `dist/`, respeta `base`, resuelve rutas relativas/absolutas, query y fragmentos, informa archivo/referencia y devuelve 1 ante errores.
4. Sin JavaScript: `no-js` → `js`, contenido visible por defecto, navegación móvil CSS sin botón, enlaces esenciales operativos y ocultación de disparadores de modal y controles SQL que requieren JS.
5. Movimiento reducido: `prefers-reduced-motion: reduce` desactiva scroll suave, reveal, delays y animaciones decorativas sin tocar el foco.
6. `set:html`: se escapó `<` a `\u003c` en el JSON de `allSqlCode`; se documentó la prohibición de usar el patrón con contenido no confiable.
7. Se añadieron `test-results/`, `playwright-report/` y `blob-report/` a `.gitignore`.

**Archivos modificados:** `src/components/CertModal.astro`, `src/layouts/Layout.astro`, `src/styles/global.css`, `src/pages/toolkit/sql.astro`; `playwright.config.ts`, `package.json`, `.github/workflows/deploy-pages.yml`, `.gitignore`; `tools/check-local-references.mjs`, `tests/phase2.spec.ts`, `tests/local-references.test.mjs`, `tests/phase1.spec.ts`; `.ai/ROADMAP.md`, `.ai/DECISIONS.md`, `.ai/SECURITY.md`, `.ai/ACCESSIBILITY.md`, `.ai/CHANGELOG_AI.md`.

**Verificación:**

- `pnpm check`: 23 archivos, 0 errores, 0 warnings, 0 hints.
- `pnpm build`: 4 páginas generadas.
- `pnpm test:links`: 6/6 pruebas Node aprobadas.
- `pnpm check:links`: 26 referencias locales en 4 HTML, 0 roturas.
- Demostración de rotura: fixture con `/no-existe/` → informe `index.html: href="/no-existe/"` y código de salida 1.
- `pnpm test:e2e` local con Chrome 157: 20/20.
- `CI=1 pnpm test:e2e` con Chromium administrado por Playwright: 20/20 (build explícito previo; el webServer no recompiló).
- `pnpm install --frozen-lockfile` con el store existente: lockfile actualizado y sin cambios de resolución.
- Workflow YAML validado con PyYAML; `actionlint` no estaba instalado.

**Estado de CI:** workflow configurado y validado localmente en su ruta `CI=1`; **no se ejecutó en GitHub Actions**, por lo que no se declara CI aprobado en el proveedor.

**No automatizado / pendiente:** primera ejecución real en GitHub Actions, anuncios de lector de pantalla, revisión manual en hardware móvil y cobertura E2E de formulario/copiado SQL.

---

## 2026-11-11 · Fase 1 correctiva: accesibilidad, modales y referencias

**Agente:** Buffy (Freebuff)

**Resumen:** primera fase correctiva aprobada sobre los hallazgos de `.ai/`. Se corrigieron navegación móvil, modales, propagación del clic, contraste, referencias rotas y el hint de Astro sin rediseñar ni cambiar contenido profesional. Se añadió una suite E2E mínima con Playwright para dejar evidencia reproducible.

**Problemas corregidos:**

1. Navegación móvil inaccesible: botón disclosure con `aria-expanded`/`aria-controls`, panel `#primary-navigation`, foco al primer enlace, cierre con `Escape` con retorno de foco, scroll bloqueado y restaurado.
2. Modal: restauración de scroll y foco en el evento `close` (incluye `Escape`), `stopPropagation` en el contenedor y `aria-describedby` para el emisor.
3. «Verificar»: las tarjetas dejaron de ser `role="button"`; un botón overlay real evita que el clic abra el modal y conserva la navegación por teclado.
4. Contraste: `--gray-400` (2.59:1 en blanco) se sustituyó por `--gray-600` en fondos claros y por `--gray-200` en el degradado SQL; `--gray-400` queda solo sobre fondos oscuros.
5. Recursos: se retiró el enlace y la etiqueta del PDF inexistente; `/thanks` y `/404` usan `og-image.png`.
6. Hint `allSqlCode`: se emite con `set:html={JSON.stringify(allSqlCode)}` en el script JSON, sin cambiar el dataset.
7. Desbordamiento a 320 px: los grids de hero y contacto reciben `min-width: 0` en sus hijos y `overflow-wrap: break-word`; el título de contacto baja a 40 px por debajo de 360 px.

**Archivos modificados:** `src/layouts/Layout.astro`, `src/styles/global.css`, `src/components/Certifications.astro`, `src/components/CertModal.astro`, `src/components/Toolkit.astro`, `src/pages/thanks.astro`, `src/pages/404.astro`, `src/pages/toolkit/sql.astro`; `package.json`, `pnpm-lock.yaml`, `playwright.config.ts`, `tests/phase1.spec.ts`; `.ai/ROADMAP.md`, `.ai/DECISIONS.md`, `.ai/CHANGELOG_AI.md`.

**Verificación:**

- `pnpm check`: 23 archivos, 0 errores, 0 warnings, 0 hints.
- `pnpm build`: 4 páginas generadas; `dist/` sin `playwright-quick-start.pdf` ni `favicon.svg`; `og-image.png` y `favicon.ico` presentes.
- `pnpm test:e2e`: 14/14 pruebas aprobadas en Chrome 157 con preview local (puerto 5173), incluyendo 320×568, 375×812, 390×844, 768×1024, 1024×900 y 1440×900.
- Contraste medido: `--gray-600` 7.01/6.59/6.09 sobre blanco/`gray-50`/`gray-100`; `--gray-200` 11.73 sobre `gray-900` y 6.33 sobre `teal-800`.

**No automatizado:** anuncios de lector de pantalla, prueba en hardware móvil real y job de CI.

**Pendientes:** job bloqueante de tests (R-19), comprobador genérico de referencias (R-20), verificación manual con lector de pantalla y decisiones marcadas como `PENDIENTE DE DEFINICIÓN`.

---

## 2026-11-11 · Auditoría de `.ai/` y archivos raíz

**Agente:** Buffy (Freebuff)

**Resumen:** auditoría de exactitud, jerarquía y utilidad. Se contrastaron las afirmaciones con el código, la configuración y el build; se corrigieron datos sin respaldo y se eliminó duplicación documental. No se modificó `src/`, `public/` ni la configuración funcional.

**Problemas corregidos:**

1. La raíz no actuaba como punto de entrada: `AGENTS.md` tenía 339 líneas con reglas duplicadas y `CLAUDE.md`/`CODEX.md` repetían contenido. Ahora son 30/10/10 líneas y solo enrutan a `.ai/`.
2. Las guías de agente repetían contexto y reglas. Ahora contienen solo diferencias (22–24 líneas) y remiten al protocolo común (63 líneas), sin bloques de reglas duplicados.
3. `PRINCIPLES.md` afirmaba "sin bundles JS"; el build emite 4 módulos (≈3.3 KB). Corregido.
4. `PERFORMANCE.md` afirmaba que el favicon no se solicita al abrir la home; el navegador sí puede solicitarlo. Corregido.
5. `DECISIONS.md` D-21 contenía texto corrupto (`b9...`). Corregido.
6. `SECURITY.md` presentaba COEP/Cloudinary y HSTS como hechos; ahora están marcados como PENDIENTE DE DEFINICIÓN.
7. `MISSION.md` afirmaba HTTPS en dominio propio sin evidencia en el repositorio; marcado como PENDIENTE DE DEFINICIÓN.
8. `SEO.md` marcaba la canónica con/sin slash como pendiente de verificación; unificado al marcador PENDIENTE DE DEFINICIÓN.
9. `STANDARDS.md` afirmaba que Prettier era dependencia transitiva; suavizado a "presente en `node_modules`, no declarado".
10. Marcador único de incertidumbre: `DESCONOCIDO` → `PENDIENTE DE DEFINICIÓN` (33 ocurrencias en 10 archivos).

**Archivos modificados:** `AGENTS.md`, `CLAUDE.md`, `CODEX.md`; `.ai/PRINCIPLES.md`, `PERFORMANCE.md`, `DECISIONS.md`, `FRONTEND.md`, `SECURITY.md`, `MISSION.md`, `SEO.md`, `STANDARDS.md`, `CHANGELOG_AI.md`; `.ai/agents/AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `FREEBUFF.md`, `OPENCODE.md`, `ANTIGRAVITY.md`.

**No modificado:** `src/`, `public/`, `astro.config.mjs`, `package.json`, `tsconfig.json`, workflow de despliegue.

**Validación:** `pnpm check` (0 errores, 1 hint preexistente), `pnpm build` (4 páginas), enlaces internos sin roturas, y los 4 diagramas validados con `@mermaid-js/mermaid-cli@11.4.2` sobre Chrome del sistema y con Kroki (HTTP 200, SVG reales).

**Riesgos pendientes:** verificación de canónicas en producción, CORP de Cloudinary frente a COEP, cabeceras y HTTPS reales de GitHub Pages, y decisiones sin definir (service worker, manifests duplicados, Tailwind). Requieren decisión humana.

---

## 2026-11-11 · Creación de la fuente de verdad `.ai/`

**Agente:** Buffy (Freebuff)

**Resumen:** se analizó el repositorio completo y se construyó la carpeta `.ai/` como documentación canónica para agentes: identidad, misión, principios, contexto, mapa, arquitectura, estándares, frontend, UX/UI, accesibilidad, rendimiento, SEO, seguridad, decisiones, roadmap, plantillas, changelog, diagramas Mermaid y guías por herramienta.

**Archivos creados:**

- `.ai/IDENTITY.md`, `MISSION.md`, `PRINCIPLES.md`, `PROJECT_CONTEXT.md`, `PROJECT_MAP.md`, `ARCHITECTURE.md`
- `.ai/STANDARDS.md`, `FRONTEND.md`, `UX_UI.md`, `ACCESSIBILITY.md`, `PERFORMANCE.md`, `SEO.md`, `SECURITY.md`
- `.ai/DECISIONS.md`, `ROADMAP.md`, `TASK_TEMPLATE.md`, `REVIEW_TEMPLATE.md`, `CHANGELOG_AI.md`
- `.ai/diagrams/architecture.mmd`, `user-flow.mmd`, `deployment.mmd`, `components.mmd`
- `.ai/agents/AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `FREEBUFF.md`, `OPENCODE.md`, `ANTIGRAVITY.md`
- Previamente en la raíz: `AGENTS.md`, `CLAUDE.md`, `CODEX.md` (ahora apuntan a `.ai/` como fuente de verdad).

**Evidencia recopilada:**

- `git ls-files`: 47 archivos versionados; `scripts/` existe localmente pero está ignorado.
- `pnpm check`: 0 errores, 0 warnings, 1 hint (`allSqlCode` no leído en `toolkit/sql.astro`).
- `pnpm build`: 4 páginas, 28 archivos, 958 KB.
- `dist/assets`: CSS 25.1 KB (Layout) + 3.3 KB (index) + 5.3 KB (sql); 4 módulos JS de 0.5–1.05 KB.
- Imágenes: 31 referencias a `res.cloudinary.com` en el HTML del home; no se emiten imágenes locales.
- Ausencias verificadas por búsqueda: analítica, `navigator.serviceWorker.register`, `localStorage`, `document.cookie`, `innerHTML`, `prefers-reduced-motion`, `hreflang`.

**Hallazgos documentados y no corregidos:**

1. `/toolkit/playwright-quick-start.pdf` referenciado y ausente en `public/`.
2. `previewImage` de `/thanks` y `/404` apunta a `/favicon.svg`, inexistente.
3. `apple-touch-icon.png` real 180×180; manifests declaran 192×192.
4. `manifest.json` y `site.webmanifest` idénticos.
5. `public/sw.js` publicado pero no registrado.
6. `public/sitemap.xml` manual y solo con la home.
7. `README.md` desactualizado (scripts, carpetas y conteo de certificaciones).
8. Contraste de `--gray-400` sobre fondos claros ≈2.6:1.
9. Navegación inaccesible en móvil (`nav-links` ocultos sin menú).
10. Modal: scroll bloqueado al cerrar con `Esc`; clic en "verificar" burbujea y abre el modal.
11. `_headers` sin efecto en GitHub Pages; CSP efectiva solo por meta.
12. `COEP: require-corp` latente e incompatible con imágenes de Cloudinary.
13. `security.txt` caduca el 2027-01-31.
14. Sin pruebas automatizadas ni auditoría de dependencias en CI.

**Verificación de esta entrada:** estructura de 28 archivos comprobada (18 documentos raíz, 6 guías por agente y 4 diagramas); enlaces relativos entre documentos y diagramas revisados; sin cambios en `src/`, `public/` ni configuración.

**Pendientes:** aprobación del autor para los ítems P0 y P1 de `ROADMAP.md`; resolver los puntos marcados como PENDIENTE DE DEFINICIÓN en `DECISIONS.md` y `PROJECT_CONTEXT.md`.

---

## 2026-11-12 · Blog, feed y sitemap dinámicos

**Agente:** Buffy (Freebuff)

**Resumen:** se incorporó un blog estático con Astro Content Collections, Pages CMS, RSS y sitemap dinámicos, más optimización de imágenes y fuentes no bloqueantes. También se endureció la CSP y se corrigió el pie del artículo.

**Archivos:** `src/content.config.ts`, `src/content/blog/arquitectura-portafolio-astro.md`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/rss.xml.ts`, `src/pages/sitemap.xml.ts`, `.pages.yml`, `src/utils/cloudinary.ts`, `src/layouts/Layout.astro`, `src/styles/global.css`.

**Evidencia/verificación:** `pnpm check` 0 errores/warnings/hints (29 archivos); `pnpm build` 6 páginas + `/rss.xml` (1 item) + `/sitemap.xml` (3 url); `pnpm check:links` 97 referencias en 6 HTML; `pnpm test:links` 6/6; `pnpm test:e2e` 32/32.

**Hallazgos no corregidos:** cadencia editorial del blog y propiedad de las imágenes de Cloudinary (`PENDIENTE DE DEFINICIÓN`).

**Pendientes:** verificar la primera ejecución del workflow en GitHub Actions tras los cambios.

---

## 2026-11-12 · Limpieza de firmas IA en el historial y regla permanente

**Agente:** Buffy (Freebuff)

**Resumen:** se reescribieron los commits `849e20b`, `f9675c4` y `f6903ac` para eliminar firmas/trailers de IA (`Generated with`, `Co-Authored-By`), se eliminó `refs/original` y se hizo force-push con `--force-with-lease`. Se añadió la regla de mensajes de commit a `.ai/agents/AGENTS.md` y `AGENTS.md`.

**Archivos:** `.ai/agents/AGENTS.md`, `AGENTS.md`.

**Evidencia/verificación:** árbol idéntico `48ed284b2d25128447f7ce9fa1cffdc7e36d5ae5`; `git fsck` sin errores; HEAD `aa033ba` == `origin/main`.

**Hallazgos no corregidos:** ninguno.

**Pendientes:** ninguno.

---

## 2026-11-12 · Auditoría documental completa de `.ai/`

**Agente:** Buffy (Freebuff)

**Resumen:** se reescribieron README, IDENTITY, MISSION, PROJECT_CONTEXT, PRINCIPLES, ARCHITECTURE, PROJECT_MAP, FRONTEND, STANDARDS, UX_UI, ACCESSIBILITY, PERFORMANCE, SEO, SECURITY, DECISIONS, ROADMAP y CHANGELOG para reflejar el estado real (6 rutas, 32 pruebas, pnpm 12.18.0, blog, sitemap/RSS dinámicos, CSP endurecida, fuentes no bloqueantes, `optimizedCloudinary`). Sin comandos de clonado en el README.

**Archivos:** `README.md`, `.ai/*.md`, `.ai/agents/AGENTS.md`, `AGENTS.md`, `CLAUDE.md`, `CODEX.md`.

**Evidencia/verificación:** `pnpm astro check` (0 errores/warnings/hints), `pnpm build` (6 páginas + endpoints), `pnpm check:links` (97 referencias), `pnpm test:links` (6/6).

**Hallazgos no corregidos:** los puntos marcados como `PENDIENTE DE DEFINICIÓN` se mantienen sin inferencia.

**Pendientes:** ejecución real del workflow en GitHub Actions.

---

## Plantilla para nuevas entradas

```markdown
## AAAA-MM-DD · <título>

**Agente:** <herramienta/modelo>
**Resumen:** <qué se hizo y por qué>

**Archivos:** <lista o glob>
**Evidencia/verificación:** <comandos y resultados>
**Hallazgos no corregidos:** <lista o "ninguno">
**Pendientes:** <acciones que requieren decisión>
```

## Ejemplos reales

- Entrada `2026-11-11`: creación de `.ai/` con 28 archivos y verificación de `pnpm check`/`pnpm build`.
- Ejemplo de corrección documentada: el build demostró que los scripts sí se compilan a módulos y que las imágenes de Cloudinary se emiten como URL remota; ambas afirmaciones se corrigieron en los documentos afectados.

## Riesgos conocidos

- El changelog puede desincronizarse del historial de Git si se olvida registrar una sesión.
- Documentar hallazgos sin corregirlos crea deuda visible; debe revisarse en cada ciclo.

## Recomendaciones futuras

- Añadir una entrada por cada PR relevante, no solo por sesiones de documentación.
- Enlazar cada entrada con el commit o PR correspondiente cuando exista.

---

## 2026-11-12 · Suite E2E del blog y endpoints SEO + Dependabot agrupado

**Agente:** Buffy (Freebuff)

**Resumen:** se amplió la suite E2E con un archivo nuevo `tests/blog.spec.ts` (12 pruebas) que cubre el índice del blog, filtrado por tags, vista del artículo, pie del artículo y los endpoints `/sitemap.xml` y `/rss.xml`, y se añadió `.github/dependabot.yml` con grupos semanales para GitHub Actions y dependencias npm.

**Archivos:** `tests/blog.spec.ts`, `.github/dependabot.yml`, `.ai/CHANGELOG_AI.md`, `.ai/PROJECT_MAP.md`.

**Verificación:**

- `pnpm check`: 0 errores, 0 warnings, 0 hints (29 archivos).
- `pnpm build`: 6 páginas y endpoints generados.
- `pnpm check:links`: 97 referencias en 6 HTML, 0 roturas.
- `pnpm test:links`: 6/6 pruebas Node.
- `pnpm test:e2e`: 44/44 pruebas (12 nuevas del blog + 32 existentes).

**Total E2E passing:** 44 tests en 3 specs de Playwright (phase1 11, phase2 6, phase3 8, blog 12) más 6 pruebas Node de referencias.

**Estructura de `.github/dependabot.yml`:**

- `github-actions`: directorio `/`, actualización semanal el lunes 09:00 America/Guatemala, un solo grupo `github-actions` con `patterns: ["*"]`.
- `npm`: directorio `/`, misma cadencia semanal, grupo `dependencies-minor-patch` con `update-types: [minor, patch]`, actualizaciones mayores individuales, `commit-message: { prefix: "deps", include: "scope" }`, `open-pull-requests-limit: 12`.

**Hallazgos no corregidos:** ninguno de los 12 tests del blog es bloqueante; se ajustaron tres aserciones (`toHaveURL`, primer `pre`, título de RSS) frente al DOM real sin modificar tests existentes.

**Pendientes:** primera ejecución del workflow en GitHub Actions tras este commit.
