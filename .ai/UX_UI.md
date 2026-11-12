# UX_UI — Sistema visual y experiencia de usuario

## Objetivo

Documentar el sistema de diseño real del sitio (color, tipografía, espaciado, jerarquía, componentes y responsive) y la experiencia que produce, para que cualquier cambio visual sea coherente y no introduzca un lenguaje paralelo.

## Alcance

Home, `/thanks`, `/404` y `/toolkit/sql`. Los criterios de accesibilidad detallados están en `ACCESSIBILITY.md`; los de rendimiento visual, en `PERFORMANCE.md`.

## Identidad visual

**Concepto:** portafolio técnico-editorial. Fondo claro cálido, verde teal como único acento, tipografía display geométrica para titulares, monoespaciada para metadatos y etiquetas, y bloques oscuros para las secciones de alto impacto (casos y contacto).

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
| Display | Syne | 400, 500, 600, 700 | Titulares, nombres de proyecto, títulos de tarjeta |
| Cuerpo | Inter | 400, 500, 600 | Párrafos y descripciones |
| Mono | DM Mono | 400, 500 | Etiquetas, metadatos, botones, fechas, tags, terminal |

Escala real:

| Elemento | Tamaño | Notas |
|---|---|---|
| Hero | `clamp(56px, 8vw, 86px)` | `line-height: 0.92`; móvil fija 48 px |
| Título de contacto | `clamp(48px, 7vw, 72px)` | `line-height: 0.95` |
| Título de sección | 36 px (compacto 32 px) | Móvil 30 px |
| Impacto | `clamp(42px, 5vw, 58px)` | Cifras protagonistas |
| Cuerpo base | 15 px / 1.6 | `body` |
| Hero desc | 17 px | — |
| Etiquetas mono | 10–13 px | `letter-spacing: 0.03–0.1em` |

Fuentes servidas por Google Fonts con `display=swap` y `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.

## Espaciado y formas

| Token implícito | Valor | Uso |
|---|---|---|
| Sección | `96px 0` (móvil 72 px) | Ritmo vertical entre secciones |
| Contenedor | `min(100%, 1080px)`, padding 48 px / 24 px | Ancho de lectura |
| Título → contenido | 48 px (24 px en compacto) | Separación jerárquica |
| Grid gap | 16–24 px; 80 px en grids de dos columnas | Consistencia en tarjetas |
| Radio pequeño | 6–8 px | Botones, inputs |
| Radio medio | 10–12 px | Tarjetas, cajas |
| Radio grande | 14–16 px | Contenedores y modales |
| Píldora | 999 px | Tags, chips, badges |
| Borde | `1px solid var(--gray-200)` | Sistema de tarjetas |
| Sombra hover | `0 12–18px 28–42px rgba(26,26,24,0.08–0.1)` | Elevación sutil |

No hay escala de espaciado formal (4/8/16); los valores se repiten de forma consistente pero manual.

## Jerarquía visual

1. **Hero:** badge de disponibilidad → titular en dos líneas con acento teal → subtítulo mono → descripción → tags → idiomas → CTAs → promesa de respuesta. A la derecha, tarjeta con foto, terminal simulada y 3 métricas.
2. **Impacto:** cifras grandes en teal sobre fondo `--gray-100`.
3. **Servicios:** grid de 4 columnas con índice numérico y hover teal.
4. **Casos:** sección oscura (`--gray-900`) que rompe el ritmo claro y da peso a la evidencia.
5. **Sobre mí / Experiencia:** narrativa y trayectoria, con timeline.
6. **Proyectos:** fondo `--gray-100`, tarjetas con imagen y stack.
7. **Stack:** 4 categorías con iconos tipográficos.
8. **Toolkit:** 4 recursos descargables.
9. **FAQ:** acordeón nativo.
10. **Certificaciones:** grid + acordeón de adicionales.
11. **Contacto:** cierre oscuro con formulario a la derecha.

Alternancia de fondos: `gray-50` → `gray-100` (`#impacto`, `#proyectos`, `#certificaciones`) → `gray-900` (`#casos`, `#contacto`, footer). Esta alternancia es el principal mecanismo de separación sin bordes.

## Componentes

| Componente | Clases principales | Estados |
|---|---|---|
| Nav fija | `nav`, `.nav-logo`, `.nav-links`, `.nav-cta` | hover, `.active`, focus-visible; oculta enlaces < 940 px |
| Botón primario | `.btn-primary` | hover oscurece, focus-visible |
| Botón fantasma | `.btn-ghost`, `.btn-ghost.dark` | hover borde teal / claro |
| Tag / píldora | `.tag`, `.tag-primary`, `.value-pill`, `.avail-mode`, `.stack-chip` | hover eleva 1 px |
| Tarjeta de impacto | `.impact-card` | hover eleva 3 px + sombra; círculo decorativo |
| Tarjeta de servicio | `.service-card` | hover fondo teal-50 y título teal |
| Tarjeta de caso | `.case-card`, `.case-point.result` | estático, con bloque de resultado destacado |
| Tarjeta de proyecto | `.project-card`, `.project-img`, `.project-type-badge` | hover eleva 4 px, imagen escala 1.06 |
| Tarjeta de certificación | `.cert-card`, `.mini-cert` | hover eleva y colorea borde; clic abre modal |
| Modal | `.cert-modal`, `.cert-modal-container` | abierto/cerrado, backdrop con blur |
| Terminal decorativa | `.terminal`, `.terminal-bar`, `.t-dot`, `.t-cursor` | cursor parpadeante |
| Acordeón | `.faq-item`, `.faq-question`, `.faq-toggle` | `[open]` rota el `+` 45° |
| Formulario | `.contact-form`, `.form-row`, `label`, `input`, `textarea` | focus borde teal-200 |
| Enlace de accesibilidad | `.skip-link` | visible solo con foco |
| Animación | `.reveal`, `.reveal-delay-1..6` | `.visible` activa opacidad y traslación |

## Responsive

| Breakpoint | Cambios principales |
|---|---|
| > 940 px | Nav completa; hero a 2 columnas (`1fr 420px`); grids de 4, 3 y 2 columnas según sección |
| ≤ 940 px | Nav sin enlaces (solo logo y CTA); hero, sobre, contacto y banner a 1 columna; grids a 2 columnas; casos a 1 columna; servicios 2×2 con bordes ajustados |
| ≤ 640 px | Todo a 1 columna; secciones 72 px; hero sin altura mínima y con padding superior 128 px; títulos reducidos; formulario compacto; timeline apilada; footer en columna |

No hay menú hamburguesa: en móvil se pierde el acceso a las 8 secciones del nav; solo queda el logo (ancla al hero) y el CTA a contacto.

## Experiencia de usuario

### Recorridos principales

1. **Reclutador:** hero → impacto → experiencia → habilidades → descarga CV / contacto.
2. **Cliente:** hero → servicios → casos → FAQ → formulario.
3. **Par técnico:** proyectos → GitHub → toolkit → SQL Playground (`/toolkit/sql`) → volver al toolkit.

### Detalles de experiencia intencionales

- Badge "disponible para colaboración" y promesa "Respondo en menos de 24h · GMT-6" repetida en hero y contacto: reduce fricción y fija expectativa.
- Terminal del hero simula `npx playwright test` con 47 pruebas: comunica stack y madurez en un vistazo.
- Los CTAs usan flechas `->` y minúsculas: tono técnico, no corporativo.
- El toolkit incluye recursos descargables reales (Google Sheets, repositorio) y uno interactivo (SQL).
- Las certificaciones sin URL se muestran como "sin link público" en lugar de ocultarse: transparencia.

### Fricciones detectadas

- En móvil no hay navegación entre secciones.
- Las tarjetas de certificación abren un modal también al pulsar "verificar" (el clic burbujea).
- Tras cerrar el modal con `Esc`, el scroll del body puede quedar bloqueado.
- El formulario no da feedback visual propio: depende del redirect a `/thanks`.
- Las animaciones `.reveal` pueden ocultar contenido si el JS no se ejecuta (opacidad 0 por defecto).

## Reglas

- Todo color nuevo debe justificarse; usar tokens existentes.
- Mantener la alternancia de fondos y el ritmo de 96 px entre secciones.
- Un componente nuevo debe reutilizar `.section-tag`, `.section-title`, `.container` y las tarjetas existentes.
- No introducir una segunda familia tipográfica ni nuevos pesos.
- No añadir animaciones fuera del sistema `.reveal` + transiciones 0.2–0.35 s.
- Cualquier nuevo breakpoint debe discutirse; hoy solo existen 940 y 640 px.

## Ejemplos reales

- Hero: titular en `clamp(56px, 8vw, 86px)` con segunda línea en `--teal-400`, tarjeta lateral con terminal y métricas en grid de 3.
- Alternancia de fondos: `#casos` y `#contacto` en `--gray-900`; `#impacto`, `#proyectos` y `#certificaciones` en `--gray-100`; el resto en `--gray-50`.
- Botones: `.btn-primary` con fondo teal y texto blanco; `.btn-ghost` con borde `--gray-200` y hover teal.
- Certificaciones: grid de 3 columnas con tarjetas de imagen 128 px de alto y modal con backdrop `rgba(26,26,24,0.85)` y `blur(8px)`.
- Móvil: la nav oculta `.nav-links` y deja solo logo y CTA de contacto.

## Riesgos conocidos

- **Contraste insuficiente:** `--gray-400 #a3a199` sobre blanco ronda 2.6:1; se usa en `.hero-card-role`, `.exp-date`, `.muted` y metadatos.
- **Contenido invisible sin JS:** `.reveal` empieza en `opacity: 0`; si el script falla, secciones completas no se ven.
- **Navegación móvil incompleta.**
- **Dos verdes distintos** (acento y foco) y dos tokens teal duplicados: erosión del sistema.
- **Dependencia de fuentes externas:** un fallo de Google Fonts degrada la identidad tipográfica (hay fallbacks genéricos).
- **Emojis como iconos** en Toolkit, sin `aria-hidden`, con render variable por sistema operativo.

## Recomendaciones futuras

- Definir una escala de espaciado explícita y documentarla aquí.
- Resolver la duplicación `--teal-400`/`--teal-600` y unificar el verde de foco.
- Añadir navegación móvil (menú o anclas visibles) sin introducir dependencias.
- Corregir el contraste de metadatos y el comportamiento del modal.
- Incorporar `prefers-reduced-motion` para desactivar reveal y parpadeos.
