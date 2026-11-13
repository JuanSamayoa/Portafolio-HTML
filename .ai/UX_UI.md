# UX_UI — Sistema visual y experiencia de usuario

## Objetivo

Documentar el sistema de diseño real del sitio (color, tipografía, espaciado, jerarquía, componentes y responsive) y la experiencia que produce, para que cualquier cambio visual sea coherente y no introduzca un lenguaje paralelo.

## Alcance

Home, `/blog/`, `/blog/<slug>/`, `/thanks`, `/404` y `/toolkit/sql`. Los criterios de accesibilidad detallados están en `ACCESSIBILITY.md`; los de rendimiento visual, en `PERFORMANCE.md`.

## Identidad visual

**Concepto:** portafolio técnico-editorial. Fondo claro cálido, verde teal como único acento, tipografía display geométrica para titulares, monoespaciada para metadatos y etiquetas, y bloques oscuros para las secciones de alto impacto (casos y contacto). El blog hereda el mismo lenguaje con un hero editorial de titular grande.

| Atributo | Valor | Fuente |
|---|---|---|
| Fondo base | `--gray-50` `#f8f8f6` | `global.css` |
| Texto principal | `--gray-900` `#1a1a18` | `global.css` |
| Acento | `--teal-400` / `--teal-600` `#0f6e56` | `global.css` |
| Acento claro | `--teal-200` `#5dcaa5`, `--teal-50` `#e1f5ee` | `global.css` |
| Foco | `--focus-ring: 2px solid #1d9e75` | `global.css` |
| Tema del navegador | `#0f6e56` | `Layout.astro`, `manifest.json`, `site.webmanifest` |
| Selección de texto | Fondo `--teal-400`, texto blanco | `global.css` |

### Paleta completa

```
teal-50  #e1f5ee    gray-50   #f8f8f6
teal-200 #5dcaa5    gray-100  #f0efe9
teal-400 #0f6e56    gray-200  #d6d4cb
teal-600 #0f6e56    gray-400  #a3a199
teal-800 #085041    gray-600  #5a5955
teal-900 #04342c    gray-900  #1a1a18
```

Observaciones: `--teal-400` y `--teal-600` son el mismo valor (duplicación intencional o heredada, `PENDIENTE DE DEFINICIÓN`), y `--focus-ring` usa un verde distinto (`#1d9e75`) no presente en la escala.

## Tipografía

| Rol | Familia | Pesos cargados | Uso |
|---|---|---|---|
| Display | Syne | 400, 500, 600, 700 | Titulares, nombres de proyecto, títulos de tarjeta, titular del blog |
| Cuerpo | Inter | 400, 500, 600 | Párrafos y descripciones |
| Mono | DM Mono | 400, 500 | Etiquetas, metadatos, botones, fechas, tags, terminal |

Escala real:

| Elemento | Tamaño | Notas |
|---|---|---|
| Hero | `clamp(56px, 6.6vw, 84px)` | `line-height: 0.92`, `max-width: 700px`; móvil `clamp(38px, 11.25vw, 46px)` |
| Titular del blog | `clamp(38px, 5.4vw, 64px)` | `line-height: 0.98`, `max-width: 880px`, `text-wrap: balance` |
| Título del artículo | `clamp` propio de `blog/[slug]` | Portada editorial con metadatos mono |
| Título de contacto | `clamp(48px, 7vw, 72px)` | `line-height: 0.95` |
| Título de sección | 36 px | Móvil 30 px |
| Impacto | `clamp(42px, 5vw, 58px)` | Cifras protagonistas |
| Cuerpo base | 15 px / 1.6 | `body` |
| Lead del blog / hero desc | 17 px | — |
| Etiquetas mono | 10–13 px | `letter-spacing: 0.03–0.1em` |

Fuentes servidas por Google Fonts con `display=swap`, `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`, `preload` de la hoja y carga no bloqueante (`media="print"` → `all` al cargar).

## Espaciado y formas

| Token implícito | Valor | Uso |
|---|---|---|
| Sección | `--section-space: clamp(72px, 9vw, 112px)` | Ritmo vertical entre secciones |
| Contenedor | `min(100%, 1080px)`, padding 48 px / 24 px | Ancho de lectura |
| Título → contenido | 48 px (`margin-bottom` de `.section-title`) | Separación jerárquica |
| Grid gap | 16–24 px; 80 px en grids de dos columnas | Consistencia en tarjetas |
| Radio pequeño | 6 px (`--radius-sm`) | Botones, inputs |
| Radio medio | 10–12 px (`--radius-md`, `--radius-lg`) | Tarjetas, cajas |
| Radio grande | 16 px (`--radius-xl`) | Contenedores y modales |
| Píldora | 999 px | Tags, chips, badges |
| Borde | `1px solid var(--gray-200)` | Sistema de tarjetas |
| Sombra | `--shadow-card` / `--shadow-card-hover` | Elevación sutil |

No hay escala de espaciado formal (4/8/16); los valores se repiten de forma consistente pero manual.

## Jerarquía visual

1. **Hero:** badge de disponibilidad → titular en dos líneas con acento teal → subtítulo mono → descripción → tags → idiomas → CTAs → promesa de respuesta. A la derecha, tarjeta con foto, terminal simulada y 3 métricas.
2. **Impacto:** cifras grandes en teal sobre fondo `--gray-100`.
3. **Servicios:** grid de 4 columnas con índice numérico y hover teal.
4. **Casos:** sección oscura (`--gray-900`) que rompe el ritmo claro y da peso a la evidencia.
5. **Sobre mí / Experiencia:** narrativa y trayectoria, con timeline.
6. **Proyectos:** fondo `--gray-100`, tarjetas con imagen y stack.
7. **Stack:** 4 categorías con iconos tipográficos.
8. **Toolkit:** 4 recursos.
9. **FAQ:** acordeón nativo.
10. **Certificaciones:** grid + acordeón de adicionales.
11. **Contacto:** cierre oscuro con formulario a la derecha.
12. **Footer del sitio:** barra oscura con copyright y créditos.

Alternancia de fondos: `gray-50` → `gray-100` (`#impacto`, `#proyectos`, `#certificaciones`) → `gray-900` (`#casos`, `#contacto`, footer). Esta alternancia es el principal mecanismo de separación sin bordes.

### Blog

- **`/blog/`**: hero claro con `section-tag`, titular de 64 px, subtítulo y enlace discreto `suscribirse a los artículos · rss ↗`; debajo, filtros de tags en píldoras mono, contador `role="status"` y grid de tarjetas (2 columnas en escritorio, 1 en móvil) con portada 16:9, metadatos, título, descripción y tags.
- **`/blog/<slug>/`**: cabecera centrada con enlace `← volver al blog`, metadatos (fecha, min de lectura, actualización), `<h1>`, lead, tags y portada opcional; cuerpo en `.prose` a 72ch; pie de acciones con `copiar enlace del artículo` y `← todos los artículos` separados por `space-between` sobre borde superior.

## Componentes

| Componente | Clases principales | Estados |
|---|---|---|
| Nav fija | `.site-nav`, `.nav-logo`, `.nav-links`, `.nav-toggle`, `.nav-actions`, `.nav-blog`, `.nav-cta` | hover, `.active`, `aria-expanded="true"`, focus-visible; panel desplegable ≤ 940 px |
| Footer del sitio | `.site-footer`, `.footer-inner` | estático, fondo `--gray-900` |
| Botón primario | `.btn-primary` | hover oscurece, focus-visible |
| Botón fantasma | `.btn-ghost`, `.btn-ghost.dark` | hover borde teal / claro |
| Tag / píldora | `.tag`, `.tag-primary`, `.value-pill`, `.avail-mode`, `.stack-chip` | hover eleva 1 px |
| Tarjeta de impacto | `.impact-card` | hover eleva 3 px + sombra; círculo decorativo |
| Tarjeta de servicio | `.service-card` | hover fondo teal-50 y título teal |
| Tarjeta de caso | `.case-card`, `.case-point.result` | estático, con bloque resultado destacado |
| Tarjeta de proyecto | `.project-card`, `.project-img`, `.project-type-badge` | hover eleva 4 px, imagen escala 1.06 |
| Tarjeta de certificación | `.cert-card`, `.mini-cert` | hover eleva y colorea borde |
| Modal | `.cert-modal`, `.cert-modal-container` | abierto/cerrado, backdrop con blur |
| Terminal decorativa | `.terminal`, `.terminal-bar`, `.t-dot`, `.t-cursor` | cursor parpadeante |
| Acordeón | `.faq-item`, `.faq-question`, `.faq-toggle` | `[open]` rota el `+` 45° |
| Formulario | `.contact-form`, `.form-row`, `label`, `input`, `textarea` | focus borde teal-200 |
| Enlace de accesibilidad | `.skip-link` | visible solo con foco |
| Animación | `.reveal`, `.reveal-delay-1..6` | `.visible` activa opacidad y traslación |
| Blog | `.blog-hero`, `.blog-title`, `.blog-subtitle`, `.blog-rss`, `.filter-chip`, `.post-card`, `.post-title`, `.post-more`, `.blog-empty`, `.blog-back` | hover, `is-active`, `aria-pressed`, `[hidden]` |
| Artículo | `.post`, `.post-header`, `.back-link`, `.post-title`, `.post-lead`, `.post-cover`, `.prose`, `.post-footer`, `.copy-link`, `.post-footer-back` | hover, `is-copied`, focus-visible, `html:not(.js)` |
| SQL Playground | `.sql-*` (sistema encapsulado) | copiar, descargar, `aria-selected` por ejemplo |

## Responsive

| Breakpoint | Cambios principales |
|---|---|
| > 940 px | Nav completa; hero a 2 columnas (`1fr 420px`); grids de 4, 3 y 2 columnas; enlace al blog visible en `.nav-actions` |
| ≤ 940 px | Aparece `.nav-toggle`; `.nav-links` se convierte en panel desplegable; hero, sobre, contacto y banner a 1 columna; grids a 2 columnas; blog a 1 columna; hero del blog con padding 120 px |
| ≤ 640 px | Todo a 1 columna; secciones con `--section-space` mínimo; hero sin altura mínima y con padding superior 128 px; títulos reducidos; formulario compacto; timeline apilada; `article` del blog a 16 px |
| ≤ 380 px | Se oculta `.nav-blog` de la barra para evitar desbordamiento (el blog sigue en el menú móvil) |
| ≤ 360 px | Título de contacto a 40 px |

## Experiencia de usuario

### Recorridos principales

1. **Reclutador:** hero → impacto → experiencia → habilidades → descarga CV / contacto.
2. **Cliente:** hero → servicios → casos → FAQ → formulario.
3. **Par técnico / lector:** proyectos → GitHub → blog → artículo → SQL Playground (`/toolkit/sql`) → volver al portafolio.

### Detalles de experiencia intencionales

- Badge "disponible para colaboración" y promesa "Respondo en menos de 24h · GMT-6" repetida en hero y contacto: reduce fricción y fija expectativa.
- Terminal del hero simula `npx playwright test` con 47 pruebas: comunica stack y madurez en un vistazo.
- Los CTAs usan flechas `->` y minúsculas: tono técnico, no corporativo.
- El toolkit incluye recursos reales (Google Sheets, repositorio) y uno interactivo (SQL).
- Las certificaciones sin URL se muestran como "sin link público" en lugar de ocultarse: transparencia.
- El blog declara su propio RSS en el hero, con el enlace de autodiscovery en el `<head>`, para lectores que prefieren feed.
- El pie del artículo ofrece copiar el enlace y volver al índice sin competir visualmente con el texto.

### Fricciones detectadas

- El formulario no da feedback visual propio: depende del redirect a `/thanks`.
- Las animaciones `.reveal` pueden ocultar contenido si el JS falla, aunque la clase `no-js` lo evita en la primera carga.
- Los filtros del blog solo existen con JS: sin JavaScript se ocultan los chips y se listan todos los artículos (degradación intencional).
- El enlace al blog vive fuera de `#primary-navigation` en escritorio por el límite de 8 anclas del test; en móvil se inyecta dentro del panel.

## Reglas

- Todo color nuevo debe justificarse; usar tokens existentes.
- Mantener la alternancia de fondos y el ritmo de `--section-space`.
- Un componente nuevo debe reutilizar `.section-tag`, `.section-title`, `.container` y las tarjetas existentes.
- No introducir una segunda familia tipográfica ni nuevos pesos.
- No añadir animaciones fuera del sistema `.reveal` + transiciones 0.2–0.35 s.
- Cualquier nuevo breakpoint debe discutirse; hoy existen 940, 640, 380 y 360 px.
- Las páginas nuevas deben respetar la nav fija de 60 px: el contenido empieza con padding superior suficiente (112–148 px según página).

## Ejemplos reales

- Hero: titular en `clamp(56px, 6.6vw, 84px)` con segunda línea en `--teal-400`, tarjeta lateral con terminal y métricas en grid de 3.
- Alternancia de fondos: `#casos` y `#contacto` en `--gray-900`; `#impacto`, `#proyectos` y `#certificaciones` en `--gray-100`; el resto en `--gray-50`.
- Blog: hero con `text-wrap: balance` y `max-width: 880px` para cerrar el titular en tres líneas; tarjetas con `box-shadow` y elevación de 3 px.
- Artículo: pie con `border-top: 1px solid var(--gray-200)`, `space-between`, `gap: 1rem` y `max-width: 72ch` alineado al cuerpo.
- Botones: `.btn-primary` con fondo teal y texto blanco; `.btn-ghost` con borde `--gray-200` y hover teal.

## Riesgos conocidos

- **Dos verdes distintos** (acento y foco) y dos tokens teal duplicados: erosión del sistema.
- **Dependencia de fuentes externas:** un fallo de Google Fonts degrada la identidad tipográfica (hay fallbacks genéricos).
- **Emojis como iconos** en Toolkit, sin `aria-hidden`, con render variable por sistema operativo.
- **Bloques `<style>` por página** que pueden divergir del sistema global si se editan sin mirar `global.css`.
- **Nav de 60 px:** una página nueva sin padding superior suficiente queda tapada por la barra fija (fue el defecto real del hero del blog, corregido al acotar el selector `nav`).

## Recomendaciones futuras

- Definir una escala de espaciado explícita y documentarla aquí.
- Resolver la duplicación `--teal-400`/`--teal-600` y unificar el verde de foco.
- Marcar los emojis decorativos del Toolkit con `aria-hidden="true"`.
- Incorporar `prefers-reduced-motion` a cualquier efecto nuevo (hoy el sistema existente ya lo respeta).
