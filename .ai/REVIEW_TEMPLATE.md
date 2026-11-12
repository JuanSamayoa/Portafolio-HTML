# REVIEW_TEMPLATE — Plantilla de revisión

## Objetivo

Proporcionar una revisión repetible que cubra arquitectura, frontend, UX/UI, accesibilidad, rendimiento, SEO, seguridad y calidad, con hallazgos priorizados y verificables.

## Alcance

Cambios propuestos o ya aplicados sobre cualquier archivo del repositorio. No sustituye pruebas automatizadas (no existen).

## Checklist

### 1. Arquitectura y alcance

- [ ] El cambio respeta SSG y la ausencia de backend.
- [ ] No añade dependencias sin aprobación.
- [ ] Respeta `pages → layouts → components → data → types`.
- [ ] El diff se limita al alcance de la tarea.
- [ ] No edita `dist/`, `.astro/` ni `node_modules/`.

### 2. Frontend

- [ ] Datos nuevos en `src/data` con tipo en `src/types/portfolio.ts`.
- [ ] Se usa `<Image>` con `width`, `height` y `alt`.
- [ ] No hay `innerHTML`, `eval` ni estado persistido.
- [ ] Los scripts son idempotentes y no rompen otras páginas.
- [ ] El contrato del modal (`open-cert-modal`) sigue intacto si se tocó.

### 3. UX/UI

- [ ] Reutiliza tokens, `.container`, `.section-tag` y `.section-title`.
- [ ] Mantiene la alternancia de fondos y el ritmo de 96 px.
- [ ] Los estados hover/focus/open son coherentes con el sistema.
- [ ] No introduce breakpoints ni familias tipográficas nuevas.
- [ ] El contenido nuevo cabe y se lee en 375 px, 768 px y 1280 px.

### 4. Accesibilidad

- [ ] HTML semántico y jerarquía de encabezados correcta.
- [ ] Todo control es alcanzable y operable con teclado.
- [ ] Foco visible en elementos nuevos.
- [ ] `alt` correcto (descriptivo o vacío para decorativas).
- [ ] Contraste ≥ 4.5:1 en texto normal sobre fondos claros.
- [ ] No hay controles interactivos anidados.
- [ ] El contenido no depende de JS para ser visible.
- [ ] Modales/diálogos cierran con `Esc` y restauran el scroll.

### 5. Rendimiento

- [ ] No se añaden recursos bloqueantes innecesarios.
- [ ] Imágenes con dimensiones y `loading` adecuado.
- [ ] No se duplica CSS ni se carga una fuente adicional sin justificar.
- [ ] El cambio no aumenta el HTML de forma desproporcionada.
- [ ] Se declara cualquier medición; no se afirma una mejora sin datos.

### 6. SEO

- [ ] La página pasa `title`, `description`, `canonicalUrl`, `previewImage` y `schemaOrg`.
- [ ] Canonical absoluta y correcta.
- [ ] `robots` adecuado (`noindex` en utilidades).
- [ ] Sitemap actualizado si la ruta debe indexarse.
- [ ] Open Graph/Twitter apuntan a imágenes existentes.
- [ ] No hay metadatos duplicados ni contradictorios.

### 7. Seguridad

- [ ] Todo origen externo nuevo está en la CSP del Layout **y** en `_headers`.
- [ ] No se debilita `'unsafe-inline'`, `frame-ancestors` ni `form-action`.
- [ ] No se introducen secretos ni endpoints no autorizados.
- [ ] Enlaces externos con `target="_blank"` llevan `rel="noreferrer"`.
- [ ] No se eliminan honeypot, `_captcha` ni `security.checkOrigin`.

### 8. Calidad y contenido

- [ ] `pnpm check` sin errores.
- [ ] `pnpm build` correcto si aplica.
- [ ] Copy en español, sin métricas ni enlaces inventados.
- [ ] Sin referencias a assets inexistentes.
- [ ] Documentación (`.ai/`) actualizada si cambió una decisión o invariante.

## Formato de hallazgos

Cada hallazgo debe indicar ubicación, problema, impacto y corrección sugerida:

```markdown
### [BLOQUEANTE|IMPORTANTE|MENOR] · <título>
- **Ubicación:** `ruta:línea`
- **Problema:** <qué está mal, con evidencia>
- **Impacto:** <a quién afecta y cómo>
- **Corrección:** <cambio concreto>
```

Severidades:

| Nivel | Criterio |
|---|---|
| BLOQUEANTE | Rompe build, seguridad, accesibilidad crítica o contenido publicado |
| IMPORTANTE | Degrada UX/SEO/mantenibilidad de forma demostrable |
| MENOR | Estilo, consistencia o deuda pequeña |

## Ejemplo de revisión real

```markdown
### [IMPORTANTE] · Enlace a PDF inexistente
- Ubicación: `src/components/Toolkit.astro:38`
- Problema: apunta a `/toolkit/playwright-quick-start.pdf`, ausente en `public/`.
- Impacto: 404 en la home para visitantes y crawlers.
- Corrección: publicar el asset o retirar el enlace y la etiqueta "PDF".

### [IMPORTANTE] · Scroll bloqueado al cerrar el modal con Esc
- Ubicación: `src/components/CertModal.astro` (openModal/closeModal)
- Problema: `body.overflow = "hidden"` solo se restaura en closeModal, no en el cierre nativo.
- Impacto: la página queda sin scroll hasta recargar.
- Corrección: escuchar el evento `close` del `<dialog>` y restaurar el estilo.
```

## Reglas

- Revisar el diff completo antes de emitir juicios.
- No aprobar afirmando pruebas que no se ejecutaron.
- Distinguir hechos verificados de sospechas; marcar estas últimas como tales.
- No proponer refactors fuera del alcance de la revisión.
- Priorizar pocos hallazgos accionables sobre listas exhaustivas sin impacto.

## Riesgos conocidos

- Sin tests, la revisión depende de inspección y build.
- Los defectos visuales requieren revisión en navegador; no se detectan por tipos.
- El checklist puede volverse burocrático en cambios triviales: aplicar proporcionalidad.

## Recomendaciones futuras

- Automatizar las comprobaciones de enlaces, axe y Lighthouse cuando se apruebe tooling.
- Adjuntar el resultado de la revisión al PR o al reporte de tarea.
