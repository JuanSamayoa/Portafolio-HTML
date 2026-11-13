# ROADMAP — Backlog técnico basado en evidencia

## Objetivo

Concentrar el trabajo pendiente detectado en el código, priorizado por impacto y esfuerzo, para que un agente sepa qué se puede mejorar sin inventar producto nuevo.

## Alcance

Propuestas derivadas de defectos, deudas y ausencias verificadas. **Ninguna está aprobada ni comprometida**: requieren decisión del autor. No hay fechas ni versiones planificadas (`PENDIENTE DE DEFINICIÓN`).

## Criterios de priorización

| Prioridad | Significado |
|---|---|
| P0 | Defecto visible en producción o riesgo de integridad |
| P1 | Accesibilidad, seguridad o SEO con impacto demostrable |
| P2 | Mantenibilidad y coherencia del sistema |
| P3 | Mejora opcional, requiere discusión de alcance |

## P0 — Integridad publicada

### R-03 · Sincronizar `README.md` con el estado real

- **Evidencia:** mencionaba `deploy-github.ps1/.sh` en raíz (viven en `scripts/`, ignorado), `public/assets/img`, `public/assets/icons` y 21 certificaciones (hoy 22).
- **Aceptación:** el README no describe archivos inexistentes ni conteos erróneos.
- **Estado:** Cerrado en la auditoría documental de 2026-11-12. `README.md` reescrito sin comandos, con inventario verificado de 92 archivos, 6 rutas, 32 pruebas y 22 certificaciones.
- **Riesgo:** bajo.

### R-01 · Resolver el PDF inexistente del toolkit

- **Evidencia:** `Toolkit.astro` enlaza `/toolkit/playwright-quick-start.pdf`; `public/toolkit/` no existe.
- **Opciones:** añadir el PDF o retirar el enlace y la etiqueta "PDF".
- **Aceptación:** ninguna URL publicada devuelve 404.
- **Estado:** Cerrado en fase 1 (2026-11-11). Se retiraron el enlace y la etiqueta «PDF»; no se creó un archivo ficticio y `dist/` ya no contiene la referencia.
- **Riesgo:** bajo. Requiere que el autor aporte el archivo si quiere recuperar la descarga.

### R-02 · Corregir `previewImage` de `/thanks` y `/404`

- **Evidencia:** ambas páginas usan `https://juan-samayoa.is-a.dev/favicon.svg`; solo existe `favicon.ico`.
- **Opciones:** usar `/og-image.png` (existe en `public/`) o una imagen dedicada 1200×630.
- **Aceptación:** la URL de imagen responde 200 y la tarjeta social se previsualiza.
- **Estado:** Cerrado en fase 1 (2026-11-11). `/thanks` y `/404` usan `https://juan-samayoa.is-a.dev/og-image.png`, que responde 200; `favicon.svg` no aparece en `dist/`.
- **Riesgo:** bajo.

## P1 — Accesibilidad

### R-04 · Corregir contraste de metadatos

- **Evidencia:** `--gray-400 #a3a199` sobre blanco ≈2.6:1 en `.hero-card-role`, `.exp-date`, `.cert-verify.muted`.
- **Propuesta:** usar `--gray-600` en fondos claros o crear un token accesible.
- **Aceptación:** todo texto normal alcanza 4.5:1.
- **Estado:** Cerrado en fase 1 (2026-11-11). Se usó `--gray-600` sobre fondos claros (7.01:1 en blanco, 6.59:1 en `gray-50`, 6.09:1 en `gray-100`) y `--gray-200` en el degradado de SQL (6.33:1 en el extremo `teal-800`). `--gray-400` se conserva solo sobre fondos oscuros (6.74:1 sobre `gray-900`).
- **Riesgo:** bajo; cambio visual perceptible.

### R-05 · Navegación en móvil

- **Evidencia:** `.nav-links { display: none }` en `≤940px`, sin menú alternativo.
- **Propuesta:** menú nativo (`<details>` o checkbox) sin dependencias, o anclas visibles.
- **Aceptación:** todas las secciones son alcanzables con teclado y tacto en 375 px.
- **Estado:** Cerrado en fase 1 (2026-11-11). Menú disclosure nativo en ≤940 px, operable con teclado y tacto; verificado en 320×568, 375×812, 390×844 y 768×1024 con foco visible, `Escape`, retorno de foco y scroll restaurado.
- **Riesgo:** medio (afecta al Layout global).

### R-06 · Fallback sin JavaScript para `.reveal`

- **Evidencia:** `.reveal` inicia en `opacity: 0`; solo el observer añade `.visible`.
- **Propuesta:** clase `no-js` en `<html>` o regla `@media (scripting: none)` que fuerce visibilidad.
- **Aceptación:** con JS desactivado, todo el contenido es legible.
- **Estado:** Cerrado en fase 2 (2026-11-11). `<html class="no-js">` pasa a `js` en el `<head>`; `.reveal` es visible por defecto y solo se oculta con `html.js`. Sin JS también se muestra la navegación y se ocultan los controles que no pueden operar.
- **Riesgo:** bajo.

### R-07 · Respetar `prefers-reduced-motion`

- **Evidencia:** no existe la media query; animaciones `pulse`, `blink`, `fadeSlideIn` y reveal siempre activas.
- **Aceptación:** con la preferencia activa no hay desplazamientos ni parpadeos.
- **Estado:** Cerrado en fase 2 (2026-11-11). `@media (prefers-reduced-motion: reduce)` anula el scroll suave, el reveal, los delays y las animaciones decorativas; el foco visible se conserva. Probado con `reducedMotion: "reduce"`.
- **Riesgo:** bajo.

### R-08 · Corregir interacción del modal y tarjetas

- **Evidencia:** `role="button"` en tarjetas que contienen `<a>`; el clic burbujea; `Esc` no restaura `body.overflow`; `aria-label` genérico oculta el título.
- **Propuesta:** botón explícito "ver certificación", detener propagación en el enlace, restaurar scroll en el evento `close`.
- **Aceptación:** teclado y ratón producen un solo resultado por acción.
- **Estado:** Cerrado en fase 1, ampliado en fase 2 (2026-11-11). Las tarjetas usan botones overlay reales, el modal restaura scroll y foco y «verificar» no propaga el clic. En fase 2 se añadió trampa de foco con `Tab`/`Shift+Tab`, foco inicial explícito y restauración síncrona para no interferir con una reapertura.
- **Riesgo:** medio (dos componentes acoplados).

## P1 — SEO

### R-09 · Verificar canónicas con/sin slash final

- **Evidencia:** el build genera directorios (`/thanks/index.html`) y las canónicas no llevan slash.
- **Acción:** comprobar el comportamiento en producción y ajustar `trailingSlash` o las URLs.
- **Aceptación:** una sola URL canónica por página, sin cadenas de redirección.
- **Riesgo:** medio (afecta indexación).

### R-10 · Imagen social dedicada para Twitter

- **Evidencia:** `twitter:image` usa la foto de perfil (retrato) con tarjeta `summary_large_image` (1.91:1).
- **Aceptación:** todas las rutas comparten una imagen 1200×630 coherente.
- **Riesgo:** bajo.

### R-11 · Unificar `jobTitle` en JSON-LD

- **Evidencia:** JSON-LD dice "QA Automatizado"; `<title>` dice "QA Automation Engineer".
- **Aceptación:** un solo título profesional en UI, metadatos y datos estructurados.
- **Riesgo:** bajo.

## P1 — Seguridad

### R-12 · Endurecer CSP

- **Evidencia:** `script-src` incluía `fonts.googleapis.com` (innecesario) e `img-src https:` era abierto.
- **Aceptación:** el sitio funciona sin violaciones de CSP en las 6 rutas.
- **Estado:** Cerrado en la auditoría de 2026-11-12. CSP restringida a `self`, `https://res.cloudinary.com` y `https://formsubmit.co`, con `object-src 'none'`, `frame-src 'none'` y `worker-src 'self'`; `COEP: credentialless`.
- **Riesgo:** bajo.

### R-13 · Renovar `security.txt`

- **Evidencia:** `Expires: 2027-01-31T23:59:59.000Z`.
- **Aceptación:** fecha futura vigente y contacto actualizado.
- **Riesgo:** bajo.

### R-14 · Auditoría de dependencias en CI

- **Evidencia:** el workflow no ejecuta `pnpm audit`; no hay configuración de Dependabot en el repo.
- **Aceptación:** el pipeline falla ante vulnerabilidades altas conocidas (con criterio acordado).
- **Riesgo:** medio; puede generar ruido.

## P2 — Mantenibilidad

### R-15 · Extraer los ejemplos SQL a datos

- **Evidencia:** `toolkit/sql.astro` tiene 617 líneas con 5 ejemplos, SEO, markup, scripts y estilos.
- **Propuesta:** `src/data/sql-examples.ts` + tipo en `portfolio.ts` o archivo propio.
- **Aceptación:** la página conserva comportamiento y reduce complejidad.
- **Riesgo:** bajo-medio.

### R-16 · Resolver duplicaciones de configuración

- **Evidencia:** `manifest.json` y `site.webmanifest` idénticos; `--teal-400` y `--teal-600` con el mismo valor; `og-image.png` sin referencias.
- **Aceptación:** una sola fuente por recurso o justificación documentada.
- **Riesgo:** bajo.

### R-17 · Decidir el destino del service worker y de Tailwind

- **Evidencia:** `sw.js` no se registra; Tailwind está instalado y no se usa en el markup.
- **Opciones:** activar y documentar, o retirar para reducir superficie y dependencias.
- **Aceptación:** decisión registrada en `DECISIONS.md`.
- **Riesgo:** bajo si se retira; medio si se activa.

### R-18 · Corregir iconos e inconsistencia de tamaños

- **Evidencia:** `apple-touch-icon.png` es 180×180; los manifests declaran 192×192; el manifest solo incluye ICO y PNG de 180/192, sin 512.
- **Aceptación:** tamaños declarados coinciden con los archivos y hay icono 512 para PWA.
- **Riesgo:** bajo.

## P2 — Calidad

### R-19 · Añadir pruebas automatizadas mínimas

- **Evidencia:** no hay suite ni script `test`.
- **Propuesta:** Playwright para 4 rutas, navegación por anclas, modal, copiado SQL y formulario (mock); ejecución en CI.
- **Aceptación:** job de tests bloqueante y documentado.
- **Estado:** Implementado y ampliado. La suite suma 32 pruebas (10 en `phase1`, 6 en `phase2`, 8 en `phase3` más 6 pruebas Node de referencias) y CI ejecuta Chromium administrado por Playwright. **No se ha ejecutado todavía en GitHub Actions**; la ruta CI se validó localmente con `CI=1`.
- **Riesgo:** alto (nuevas dependencias, tiempo de CI). **Requiere aprobación explícita.**
- **Riesgo:** alto (nuevas dependencias, tiempo de CI). **Requiere aprobación explícita.**

### R-20 · Verificación de enlaces y assets

- **Evidencia:** hay al menos 2 referencias huérfanas detectadas manualmente.
- **Propuesta:** script de comprobación en build o test.
- **Aceptación:** el pipeline falla ante una referencia local inexistente.
- **Estado:** Cerrado en fase 2 (2026-11-11). `tools/check-local-references.mjs` revisa `href`, `src`, `srcset`, `poster`, iconos, manifest y metadatos sociales en `dist/`, respeta `base`, informa archivo y referencia, y devuelve 1 ante roturas. Se ejecuta con `pnpm check:links`, tiene 6 pruebas Node y es paso bloqueante de CI.
- **Riesgo:** bajo.

## P3 — Producto (requiere decisión de alcance)

### R-21 · Analítica mínima y privacidad

- **Evidencia:** no hay analítica; no se puede medir conversión.
- **Propuesta:** solución sin cookies, con CSP y aviso si corresponde.
- **Riesgo:** medio (privacidad y cumplimiento).

### R-22 · Enlaces de verificación faltantes en certificaciones

- **Evidencia:** 6 certificaciones tienen `link: ""` y se muestran "sin link público".
- **Acción:** obtener URLs de verificación cuando el emisor las ofrezca.
- **Riesgo:** bajo.

### R-23 · Revisión de contenido y CVs

- **Evidencia:** fechas de experiencia hasta "actualmente"; CVs PDF versionados; vigencia de los CVs PENDIENTE DE DEFINICIÓN.
- **Acción:** definir cadencia de revisión y actualizar PDFs.
- **Riesgo:** bajo.

## Fuera de alcance observado

Autenticación, pagos, multi-idioma con routing, comentarios. El blog y Pages CMS ya están implementados (colección `blog`, endpoints dinámicos y `.pages.yml`); cualquier ampliación exige revisar `IDENTITY.md` y la restricción de dependencia mínima.

## Reglas

- No implementar ítems de este documento sin aprobación del autor.
- Cada ítem completado se registra en `CHANGELOG_AI.md` y, si cambia una decisión, en `DECISIONS.md`.
- No añadir fechas ni promesas: el roadmap es un inventario, no un compromiso.

## Ejemplos reales

- `R-01`: el enlace al PDF del toolkit devolvía 404 porque `public/toolkit/` no existe (cerrado en fase 1).
- `R-04`: `--gray-400` sobre blanco quedaba en ≈2.6:1, por debajo de AA (cerrado en fase 1).
- `R-08`: cerrar el modal con `Esc` dejaba el scroll bloqueado (cerrado en fase 1).
- `R-19`: Playwright quedó aprobado en fase 1 y el job E2E está configurado en el workflow; falta confirmar su primera ejecución en GitHub Actions.

## Riesgos conocidos

- El backlog puede crecer más rápido de lo que se cierra; mantener máximo ~5 ítems activos.
- Algunas propuestas (R-12, R-19) pueden romper el sitio o el CI si se aplican sin verificación.
- Sin medición base, las mejoras de rendimiento no pueden demostrarse.

## Recomendaciones futuras

- Convertir P0 y P1 en tareas con `TASK_TEMPLATE.md`.
- Establecer una revisión trimestral de contenido, dependencias y `security.txt`.
