# ACCESSIBILITY — Accesibilidad

## Objetivo

Registrar el estado real de accesibilidad del sitio, qué prácticas están implementadas, qué brechas existen y cómo verificar cambios sin degradar la experiencia de usuarios con tecnologías de asistencia.

## Alcance

HTML generado de las 4 rutas, componentes interactivos, formulario y estilos de foco/contraste. No sustituye una auditoría formal con lectores de pantalla.

## Lo que ya está implementado

| Práctica | Evidencia |
|---|---|
| Idioma del documento | `<html lang="es">` en `Layout.astro` |
| Salto al contenido | `.skip-link` bilingüe hacia `#main-content`, visible con foco |
| Landmarks | `<nav aria-label="Navegación principal">`, `<main id="main-content">`, `<footer aria-label="Pie de página">` |
| Estructura semántica | `<section id>`, `<article>`, `<h1>` único en hero, jerarquía `h1 → h2 → h3` |
| Foco visible | `--focus-ring: 2px solid #1d9e75` aplicado a nav, botones, enlaces de proyecto/certificado/contacto y descargas |
| Acordeones nativos | `<details>/<summary>` en FAQ y certificaciones adicionales (teclado y semántica gratis) |
| Modal nativo | `<dialog>` con `aria-labelledby`/`aria-describedby`, cierre con `Esc`, foco inicial y restauración al disparador |
| Trampa de foco | `Tab`/`Shift+Tab` ciclan solo controles visibles del modal; fondo inerte por `showModal()`; sin controles, foco al contenedor |
| Activación por teclado | Botones overlay reales en tarjetas de certificación, con `aria-label` específico y foco visible |
| Textos alternativos | `alt` descriptivo en foto de perfil, proyectos y certificaciones |
| Iconos decorativos | SVG del modal y de `/thanks` con `aria-hidden="true"` |
| Formulario etiquetado | `<label>` envolviendo cada `input`/`textarea`; `required` en nombre, email y mensaje |
| Texto bilingüe correcto | `lang="en"` en los párrafos en inglés de `/thanks` |
| Movimiento de scroll | `scroll-behavior: smooth`, desactivado con `prefers-reduced-motion: reduce`; nav que no tapa el foco |
| Sin JavaScript | `.reveal` visible, navegación móvil CSS, enlaces esenciales operativos y controles JS ocultos |
| Movimiento reducido | Sin reveal, pulsos, parpadeos ni scroll suave; foco visible conservado |

## Brechas y riesgos detectados

### 1. Contraste insuficiente en metadatos

`--gray-400` (`#a3a199`) sobre blanco ronda **2.6:1**, por debajo del mínimo AA de 4.5:1 para texto normal. Se usa en:

- `.hero-card-role` ("QA AUTOMATION ENGINEER · GMT-6")
- `.exp-date` (fechas de experiencia)
- `.cert-verify.muted` ("sin link público")

En cambio, `.contact-desc`, `.sql-subtitle` y `.sql-stats` usan `gray-400` sobre fondos oscuros (`--gray-900`), donde el contraste sí es suficiente.

### 2. Navegación inaccesible en móvil

En `≤ 940px`, `.nav-links { display: none; }` sin menú alternativo. Solo quedan el logo y el CTA de contacto. Un usuario de móvil o de zoom alto no puede saltar a secciones desde la navegación.

### 3. Contenido oculto sin JavaScript — **cerrado en fase 2**

`.reveal` es visible por defecto y solo se oculta con `html.js`; un script inline cambia `no-js` por `js`. Sin JS también se muestra la navegación móvil y se retiran los controles que no pueden operar.

### 4. Movimiento no respetado — **cerrado en fase 2**

`@media (prefers-reduced-motion: reduce)` elimina el reveal animado, el scroll suave, `pulse`, `blink`, `fadeSlideIn` y los delays, sin desactivar el foco visible.

### 5. Tarjetas de certificación con interacción anidada — **cerrado en fase 1**

Las tarjetas usan un botón overlay real y conservan el enlace «verificar» sin abrir el modal. En fase 2 se añadió trampa de foco y restauración determinista.

### 6. Scroll bloqueado tras cerrar con `Esc` — **cerrado en fase 1/2**

`cancel`, `close` y el cierre por botón/fondo restauran `body.overflow`; el cierre por botón/fondo además finaliza de forma síncrona para no interferir con una reapertura.

### 7. Formulario sin retroalimentación accesible

No hay `aria-live`, resumen de errores ni mensajes asociados con `aria-describedby`. La validación es la nativa del navegador y el resultado exitoso depende de un redirect.

### 8. Emojis como iconos

`Toolkit.astro` usa 📋, 🎭, 🗄️ y 📊 dentro de `.toolkit-icon` sin `aria-hidden="true"`; algunos lectores anuncian el emoji antes del título.

### 9. Foco no estilizado en tarjetas

Las tarjetas de certificación son enfocables pero no tienen regla `:focus-visible` propia; depende del outline por defecto del navegador, que puede ser poco visible sobre blanco.

### 10. Imágenes remotas sin control de texto alternativo dinámico

El modal establece `modalImage.alt = data.title`, correcto, pero la imagen se carga con `src` vacío inicial y sin `loading`; no hay estado de error visible si Cloudinary falla.

## Cómo verificar

| Prueba | Método |
|---|---|
| Orden de tabulación | Recorrer con `Tab` desde la barra de direcciones: skip-link → logo → nav → CTA → hero CTAs → secciones |
| Modal | Abrir con teclado, comprobar foco dentro, cerrar con `Esc` y verificar que el scroll vuelve |
| Contraste | Medir tokens con un verificador (DevTools) sobre los fondos reales |
| Zoom 200 % | Navegar a 200 % y 400 % sin pérdida de contenido |
| Sin JS | Desactivar JavaScript: `.reveal` visible, nav móvil utilizable, enlaces esenciales y controles JS ocultos (prueba Playwright) |
| Reduced motion | `reducedMotion: "reduce"`: sin animaciones ni scroll suave y foco visible (prueba Playwright) |
| Trampa de foco | `Tab`/`Shift+Tab` dentro del modal, `Escape`, restauración y reapertura (prueba Playwright) |
| Formulario | Envío con campos vacíos y con datos válidos; revisar foco y mensajes |

## Reglas

- No eliminar el skip-link, los `aria-label` de landmarks ni el foco visible.
- Todo elemento interactivo debe funcionar con `Enter` y `Espacio` y mostrar foco.
- No anidar controles interactivos (botón dentro de enlace o viceversa).
- Cualquier texto nuevo sobre `gray-50`, `gray-100` o blanco debe cumplir 4.5:1.
- Las animaciones nuevas deben respetar `prefers-reduced-motion`.
- Las imágenes decorativas llevan `alt=""`; las informativas, `alt` descriptivo.
- El contenido crítico no puede depender de JS para ser visible.

## Ejemplos reales de referencia correcta

- Skip-link: primer elemento del `<body>`, con texto bilingüe y destino `#main-content`.
- Modal: `<dialog aria-labelledby="modal-cert-title">` con `<button aria-label="Cerrar modal">`.
- Acordeón: `<details class="faq-item">` con `<summary class="faq-question">`, sin JS.
- Enlaces de descarga: `aria-label="Descargar Playwright Quick Start (PDF)"` en `Toolkit.astro`.
- Formulario: cada campo dentro de su `<label>` con `<span>` visible como etiqueta.

## Riesgos conocidos

- La suite cubre teclado, foco, no-JS, movimiento reducido y contraste; los anuncios reales de lector de pantalla siguen sin verificación manual.
- El formulario no tiene resumen de errores ni `aria-live`; depende de la validación nativa.
- Los emojis de `Toolkit.astro` siguen sin `aria-hidden="true"`.
- El fallback móvil sin JS difiere visualmente del menú con JS; es aceptable pero requiere revisión manual en dispositivos.

## Recomendaciones futuras

- Revisar manualmente con lector de pantalla (VoiceOver/NVDA) el modal, el menú y el modo sin JS.
- Añadir resumen de errores y `aria-live` al formulario si se aprueba esa fase.
- Marcar los emojis decorativos del Toolkit con `aria-hidden="true"`.
- Incorporar una auditoría automatizada (axe o Lighthouse) cuando se apruebe añadir tooling.
