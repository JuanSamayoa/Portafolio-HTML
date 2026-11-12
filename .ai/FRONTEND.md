# FRONTEND — Arquitectura de frontend

## Objetivo

Explicar cómo se construye la interfaz: modelo de componentes, props, patrones de datos, scripts de cliente, manejo de imágenes y CSS, para que un agente pueda extender la UI sin romper contratos.

## Alcance

Capa de presentación (`.astro`, CSS, JS de navegador). No cubre diseño visual detallado (ver `UX_UI.md`) ni SEO (ver `SEO.md`).

## Modelo de frontend

| Decisión | Implementación | Consecuencia |
|---|---|---|
| Sin framework de UI | No hay React/Vue/Svelte ni islas | Cero runtime de framework; interactividad manual |
| Componentes de servidor | Todos los `.astro` se renderizan en build | No hay hidratación |
| Props tipadas | `interface Props` + `Astro.props` | Contratos explícitos entre página y Layout |
| Slot único | `<slot />` en `Layout.astro` | Las páginas inyectan su contenido |
| Scripts de Astro | `<script>` compilados por Vite a módulos con hash | Comportamiento sin dependencias |
| CSS global | `global.css` + 4 excepciones encapsuladas | Un solo sistema visual |

## Contratos de props

### `Layout.astro`

Requeridas: `title`, `description`, `canonicalUrl`, `previewImage`, `schemaOrg`.

Opcionales con valor por defecto: `ogImage` (= `previewImage`), `ogImageType` (`image/png`), `ogImageWidth` (`1200`), `ogImageHeight` (`630`), `robots` (`index, follow, max-image-preview:large`).

```astro
<Layout
  {title} {description} {canonicalUrl} {previewImage} {schemaOrg}
  robots="noindex, follow"
/>
```

Cualquier página nueva debe satisfacer este contrato; omitir `schemaOrg` rompe el build por tipos.

### Props internas

No hay otras props personalizadas: los componentes de sección no reciben parámetros y obtienen su contenido de imports o de constantes locales. `CertModal` no recibe props; se comunica por evento.

## Patrones de datos en componentes

| Patrón | Archivo | Uso correcto |
|---|---|---|
| Import directo de datos | `Hero.astro`, `Contact.astro`, `Toolkit.astro` | Contenido de una sola instancia |
| `map` sobre datos tipados | `Projects.astro` | Listas repetibles con `key` implícita por orden |
| Vistas derivadas | `certifications.ts` | Evitar duplicar arreglos por categoría |
| Cálculo en frontmatter | `index.astro` (canonical, schemaOrg), `Certifications.astro` (conteo total) | Derivar metadatos o totales |
| Contenido editorial en el markup | `Cases.astro`, `Faq.astro`, `Experience.astro`, `Services.astro` | Texto único no reutilizable |

### Ejemplo real: vista derivada

```ts
export const featuredCertifications = allCertificationsData.filter(
  (cert) => cert.category === "featured",
);
export const additionalCertifications = allCertificationsData.filter(
  (cert) => cert.category === "additional",
);
```

Consecuencia: una certificación sin `category` no aparece en ninguna de las dos listas.

### Ejemplo real: metadatos derivados

```astro
const canonicalUrl = Astro.site
  ? new URL(Astro.url.pathname, Astro.site).toString()
  : "https://juan-samayoa.is-a.dev/";
```

## Scripts de cliente

| Script | Ubicación | Se ejecuta | Notas |
|---|---|---|---|
| Reveal + nav activo | `Layout.astro` (global) | En las 4 páginas | `IntersectionObserver` y listener de scroll con `requestAnimationFrame` |
| Tarjetas de certificación | `Certifications.astro` | Solo home | Añade `role`, `tabindex`, `aria-label` y listeners |
| Modal | `CertModal.astro` | Solo home | `document.addEventListener("open-cert-modal")` |
| Copiar / descargar SQL | `toolkit/sql.astro` | Solo `/toolkit/sql` | `navigator.clipboard`, `Blob` |

Reglas:

- No usar `innerHTML` con datos externos (no se usa hoy).
- No persistir estado (no hay `localStorage` ni cookies).
- Escuchar eventos en `document` solo cuando el componente no puede recibir props (caso del modal).
- Mantener los scripts idempotentes: `init` se ejecuta en `DOMContentLoaded` o de inmediato si ya cargó.

## Imágenes

- Se usa `<Image>` de `astro:assets` con URLs absolutas de Cloudinary.
- Dimensiones declaradas: proyectos `600×340`, certificaciones `400×250`, mini-certificaciones `200×200`.
- `loading="lazy"` en todo excepto la foto del hero (`eager`, `decoding="async"`).
- El CSS aplica `object-fit: cover`, `saturate(0.92) contrast(1.02)` y `transform: scale()` al hover.

Evidencia del build: el HTML final conserva la URL original de Cloudinary, sin `srcset`, y no se emiten archivos de imagen en `dist/assets/`. Por tanto `width`/`height` reservan espacio pero no controlan el peso descargado. Si Cloudinary falla en runtime, las imágenes no cargan; no hay fallback local (`public/assets/img/` no existe).

## CSS

| Aspecto | Implementación |
|---|---|
| Punto de entrada | `src/styles/global.css` importado en `Layout.astro` |
| Tokens | `:root` con escala teal, escala gray, familias tipográficas y `--focus-ring` |
| Reset | `box-sizing`, `margin: 0`, `padding: 0` universal |
| Layout | `.container` con `width: min(100%, 1080px)` y padding lateral 48 px (24 px en móvil) |
| Grid | CSS Grid en hero, impacto, servicios, casos, proyectos, stack, certificaciones, toolkit, contacto |
| Estados | `:hover`, `:focus-visible`, `[open]`, `.visible`, `.copied` |
| Animaciones | `@keyframes pulse`, `blink`, `fadeSlideIn`; transiciones con `cubic-bezier(0.16, 1, 0.3, 1)` |
| Responsive | `940px` (tablet) y `640px` (móvil) |

En `dist`, el CSS del Layout pesa ≈25 KB, la home añade ≈3.3 KB y `/toolkit/sql` ≈5.3 KB. Los scripts se compilan a 4 módulos de 0.5–1.05 KB. No hay CSS-in-JS ni utilidades de Tailwind en el markup.

## Estructura de un componente nuevo

```astro
---
import { personalInfo } from "../data/personal";
// 1. imports
// 2. tipos locales (si aplica)
// 3. constantes derivadas
---

<section id="mi-seccion">
  <div class="container">
    <div class="section-tag">etiqueta</div>
    <h2 class="section-title">Título</h2>
    <!-- markup semántico -->
  </div>
</section>
```

Después: añadir el bloque CSS en `global.css`, importar el componente en `index.astro` en la posición narrativa correcta y, si debe navegarse, agregar el enlace en `navLinks` (`Layout.astro`).

## Reglas

- Los datos repetibles viven en `src/data` y se tipan en `src/types/portfolio.ts`.
- Las imágenes de contenido usan `<Image>` con `width`, `height`, `alt` y `loading`.
- No usar `innerHTML`, `eval`, storage ni cookies.
- Los scripts deben ser idempotentes y no ejecutarse en páginas donde no aplican.
- Los estilos de sección van a `global.css`; las cuatro excepciones encapsuladas no son precedente.
- No cambiar el payload de `open-cert-modal` sin actualizar ambos componentes.

## Riesgos conocidos

- **Acoplamiento por evento:** el modal espera un `detail` con `{ image, issuer, title, date, link }`; el contrato no está tipado en un archivo compartido.
- **Interactividad duplicada en tarjetas:** las tarjetas de certificación tienen `role="button"` y contienen un `<a>`; el clic en "verificar" burbujea al contenedor y también abre el modal.
- **Bloqueo de scroll tras `Esc`:** el cierre nativo del `<dialog>` no ejecuta `closeModal()`, por lo que `document.body.style.overflow` puede quedar en `hidden`.
- **Dependencia de Cloudinary** para todas las imágenes de contenido.
- **Estilos de página aislados** en `toolkit/sql.astro` que pueden divergir del sistema global.
- **Sin `prefers-reduced-motion`**: las animaciones se ejecutan siempre.

## Recomendaciones futuras

- Tipar el payload del modal y restaurar el scroll en el evento `close` del `<dialog>`.
- Evitar `role="button"` en contenedores con enlaces; usar un botón explícito para abrir el modal.
- Extraer los datos SQL a `src/data` y reducir `toolkit/sql.astro`.
- Evaluar `astro:assets` con `image.domains`/`remotePatterns` explícitos para hacer determinista el tratamiento de imágenes remotas.
