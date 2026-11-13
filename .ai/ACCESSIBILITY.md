# ACCESSIBILITY — Accesibilidad

## Objetivo

Registrar el estado real de accesibilidad del sitio, qué prácticas están implementadas, qué brechas existen y cómo verificar cambios sin degradar la experiencia de usuarios con tecnologías de asistencia.

## Alcance

HTML generado de las 6 rutas, componentes interactivos, formulario, blog y estilos de foco/contraste. No sustituye una auditoría formal con lector de pantalla.

## Lo que ya está implementado

| Práctica | Evidencia |
|---|---|
| Idioma del documento | `<html lang="es">` en `Layout.astro` |
| Salto al contenido | `.skip-link` bilingüe hacia `#main-content`, visible con foco |
| Landmarks | `<nav aria-label="Navegación principal">`, `<main id="main-content">`, `<footer aria-label="Pie de página">` |
| Estructura semántica | `<section id>`, `<article>` en proyectos, tarjetas de blog y artículos, `<h1>` único por página, jerarquía `h1 → h2 → h3` |
| Foco visible | `--focus-ring: 2px solid #1d9e75` aplicado a nav, botones, enlaces de proyecto/certificado/contacto, filtros del blog y descargas |
| Acordeones nativos | `<details>/<summary>` en FAQ y certificaciones adicionales (teclado y semántica gratis) |
| Modal nativo | `<dialog>` con `aria-labelledby`/`aria-describedby`, cierre con `Esc`, foco inicial y restauración al disparador |
| Trampa de foco | `Tab`/`Shift+Tab` ciclan solo controles visibles del modal; fondo inerte por `showModal()`; sin controles, foco al contenedor |
| Activación por teclado | Botones overlay reales en tarjetas de certificación, con `aria-label` específico y foco visible |
| Menú móvil | `.nav-toggle` con `aria-expanded`, `aria-controls="primary-navigation"`, `aria-label` que cambia a "Cerrar…", cierre con `Escape`, retorno de foco y scroll bloqueado/restaurado |
| Filtros del blog | `<button>` con `aria-pressed` y contador `role="status" aria-live="polite"` que anuncia cuántos artículos quedan |
| Copiar enlace | Botón real con etiqueta textual y estado `.is-copied`; enlace de vuelta con foco visible |
| Textos alternativos | `alt` descriptivo en foto de perfil, proyectos, certificaciones y portadas del blog (`coverAlt` o título) |
| Iconos decorativos | SVG del modal y de `/thanks` con `aria-hidden="true"`; flechas de CTAs con `aria-hidden="true"` |
| Formulario etiquetado | `<label>` envolviendo cada `input`/`textarea`; `required` en nombre, email y mensaje |
| Texto bilingüe correcto | `lang="en"` en los párrafos en inglés de `/thanks` |
| Movimiento de scroll | `scroll-behavior: smooth`, desactivado con `prefers-reduced-motion: reduce`; nav que no tapa el foco |
| Sin JavaScript | Contenido `.reveal` visible, navegación móvil CSS sin botón, enlaces esenciales operativos, filtros y controles JS ocultos |
| Movimiento reducido | Sin reveal, pulsos, parpadeos ni scroll suave; foco visible conservado |
| Contraste | `--gray-600` sobre fondos claros (≥6:1) y `--gray-400` solo sobre fondos oscuros (≈6.7:1); verificado por prueba E2E |

## Brechas y riesgos detectados

### 1. Formulario sin retroalimentación accesible

No hay `aria-live`, resumen de errores ni mensajes asociados con `aria-describedby`. La validación es la nativa del navegador y el resultado exitoso depende de un redirect.

### 2. Emojis como iconos

`Toolkit.astro` usa 📋, 🎭, 🗄️ y 📊 dentro de `.toolkit-icon` sin `aria-hidden="true"`; algunos lectores anuncian el emoji antes del título.

### 3. Anuncios reales de lector de pantalla sin verificar

La suite cubre teclado, foco, no-JS, movimiento reducido, contraste y viewports, pero no hay una prueba manual con VoiceOver/NVDA documentada.

### 4. Imágenes remotas sin estado de error

Si Cloudinary no responde, la imagen no carga y no hay mensaje alternativo visible; solo queda el `alt`.

### 5. Dependencia de JS en filtros y copiado

Los filtros del blog y el botón de copiar enlace requieren JS. Sin JavaScript se ocultan (degradación explícita) y la lista completa sigue legible; no hay equivalente sin JS del filtrado.

## Cómo verificar

| Prueba | Método |
|---|---|
| Orden de tabulación | Recorrer con `Tab` desde la barra de direcciones: skip-link → logo → menú → nav → CTA → hero CTAs → secciones |
| Modal | Abrir con teclado, comprobar foco dentro, ciclar con `Tab`/`Shift+Tab`, cerrar con `Esc` y verificar que el scroll vuelve |
| Menú móvil | Abrir con teclado en 320–768 px, navegar, cerrar con `Escape` y verificar retorno de foco |
| Contraste | Medir tokens con un verificador (DevTools) sobre los fondos reales; la suite ya mide metadatos en claro y oscuro |
| Zoom 200 % | Navegar a 200 % y 400 % sin pérdida de contenido |
| Sin JS | Desactivar JavaScript: contenido visible, navegación utilizable, enlaces esenciales y controles JS ocultos |
| Reduced motion | `reducedMotion: "reduce"`: sin animaciones ni scroll suave y foco visible |
| Blog | Filtrar con teclado, comprobar `aria-pressed` y el contador anunciado; abrir un artículo y volver |
| Formulario | Envío con campos vacíos y con datos válidos; revisar foco y mensajes |

## Reglas

- No eliminar el skip-link, los `aria-label` de landmarks ni el foco visible.
- Todo elemento interactivo debe funcionar con `Enter` y `Espacio` y mostrar foco.
- No anidar controles interactivos (botón dentro de enlace o viceversa).
- Cualquier texto nuevo sobre `gray-50`, `gray-100` o blanco debe cumplir 4.5:1.
- Las animaciones nuevas deben respetar `prefers-reduced-motion`.
- Las imágenes decorativas llevan `alt=""`; las informativas, `alt` descriptivo.
- El contenido crítico no puede depender de JS para ser visible.
- Un control que solo funciona con JS debe ocultarse con `html:not(.js)` y no dejar un hueco vacío.

## Ejemplos reales de referencia correcta

- Skip-link: primer elemento del `<body>`, con texto bilingüe y destino `#main-content`.
- Modal: `<dialog aria-labelledby="modal-cert-title">` con `<button aria-label="Cerrar modal">`.
- Acordeón: `<details class="faq-item">` con `<summary class="faq-question">`, sin JS.
- Filtros: `<button type="button" class="filter-chip" aria-pressed="false">` y `<p role="status" aria-live="polite">`.
- Formulario: cada campo dentro de su `<label>` con `<span>` visible como etiqueta.
- Portada del blog: enlace con `tabindex="-1"` y `aria-hidden="true"` para no duplicar el destino del título.

## Riesgos conocidos

- La suite cubre teclado, foco, no-JS, movimiento reducido y contraste; los anuncios reales de lector de pantalla siguen sin verificación manual.
- El formulario no tiene resumen de errores ni `aria-live`; depende de la validación nativa.
- Los emojis de `Toolkit.astro` siguen sin `aria-hidden="true"`.
- El fallback móvil sin JS difiere visualmente del menú con JS; es aceptable pero requiere revisión manual en dispositivos.
- El contador del blog usa `aria-live` en un nodo que se actualiza con cada clic; con muchos tags puede generar ruido en lectores.

## Recomendaciones futuras

- Revisar manualmente con lector de pantalla (VoiceOver/NVDA) el modal, el menú, el blog y el modo sin JS.
- Añadir resumen de errores y `aria-live` al formulario si se aprueba esa fase.
- Marcar los emojis decorativos del Toolkit con `aria-hidden="true"`.
- Incorporar una auditoría automatizada (axe o Lighthouse) cuando se apruebe añadir tooling.
