# STANDARDS — Estándares de código y contribución

## Objetivo

Definir reglas concretas y verificables para escribir código, contenido y commits coherentes con el repositorio, de modo que dos agentes distintos produzcan cambios compatibles.

## Alcance

Todo el código de `src/`, configuración de raíz, assets de `public/`, artículos de `src/content/blog` y mensajes de commit. Los criterios visuales están en `UX_UI.md`; los de seguridad en `SECURITY.md`.

## Estándares de archivos y nombres

| Elemento | Convención | Ejemplo real |
|---|---|---|
| Componente de sección | `PascalCase.astro` | `Certifications.astro`, `CertModal.astro` |
| Página | `kebab-case.astro` o nombre corto | `thanks.astro`, `toolkit/sql.astro`, `blog/[slug].astro` |
| Dato | `camelCase.ts` | `personal.ts`, `certifications.ts` |
| Utilidad | `camelCase.ts` | `cloudinary.ts` |
| Tipo | `PascalCase` en `portfolio.ts` | `PersonalInfo`, `Certification`, `CertificationCategory` |
| Constante exportada | `camelCase` con sufijo descriptivo | `personalInfo`, `projectsData`, `allCertificationsData` |
| Artículo | `kebab-case.md` | `arquitectura-portafolio-astro.md` |
| Clase CSS | `kebab-case` plana, prefijada por sección | `.impact-card`, `.cert-modal-title`, `.post-card`, `.sql-example-card` |
| Token CSS | `--familia-tono` | `--teal-400`, `--gray-900`, `--focus-ring` |
| Ancla de sección | `id` corto en español | `#impacto`, `#casos`, `#habilidades` |
| Atributo de datos JS | `data-*` en kebab-case | `data-copy-link`, `data-close`, `data-tags` |

## TypeScript

- `strict: true` es obligatorio (`tsconfig.json`). No usar `any`, `@ts-ignore` ni `@ts-expect-error` para silenciar errores reales.
- Tipar los datos con las interfaces existentes; si se requiere un campo nuevo, se añade al tipo **y** a los datos en el mismo cambio.
- Preferir `interface` para contratos de datos y `type` para uniones (`CertificationCategory`).
- En frontmatter de `.astro`, declarar `interface Props` y desestructurar `Astro.props` con valores por defecto cuando existan (`Layout.astro`).
- Evitar lógica de negocio en el componente: cálculo de vistas derivadas en `src/data`, como `featuredCertifications`.
- Los campos del blog se declaran en `src/content.config.ts` con zod y se replican en `.pages.yml`; ambos deben cambiar juntos.

## Componentes Astro

- Un componente = una sección o una pieza de UI con nombre propio. No crear componentes "contenedor" genéricos sin necesidad.
- Orden del archivo: frontmatter (`imports` → tipos → constantes → datos) → markup → `<script>` → `<style>` (solo si está justificado).
- Importar primero módulos de Astro (`astro:assets`, `astro:content`), luego internos, luego tipos.
- Usar `<img>` con `width`, `height`, `alt` y `optimizedCloudinary` para imágenes de contenido; `<Image>` de `astro:assets` solo si se adopta configuración de dominios remotos.
- Usar `class:list` para composición condicional de clases (patrón presente en `Projects.astro` y `Certifications.astro`), no concatenación manual de strings.
- Pasar JSON-LD con `set:html={JSON.stringify(schemaOrg)}` en un `<script type="application/ld+json" is:inline>`.
- Datos hacia el cliente mediante `<script type="application/json" is:inline>` + `JSON.parse` (patrón de `toolkit/sql.astro`), nunca interpolando strings en JS.

### Ejemplo real aceptado

```astro
---
import { projectsData } from "../data/projects";
import { optimizedCloudinary } from "../utils/cloudinary";

const title = "Juan Samayoa | QA Automation Engineer";
---

<article class:list={["project-card reveal", `reveal-delay-${(index % 3) + 1}`]}>
  <img
    src={optimizedCloudinary(project.image, "f_auto,q_auto,c_limit,w_600")}
    alt={`Vista previa de ${project.title}`}
    width="600"
    height="340"
    loading="lazy"
    decoding="async"
  />
</article>
```

## CSS

- Todo estilo de sección va en `src/styles/global.css`, en el bloque correspondiente al orden narrativo del sitio.
- Excepciones permitidas y existentes: `CertModal.astro`, `toolkit/sql.astro`, `thanks.astro`, `404.astro`, `blog/index.astro`, `blog/[slug].astro`. No añadir nuevas excepciones sin motivo.
- Reutilizar tokens de `:root`; no introducir hex nuevos si existe token equivalente. Hoy `--teal-400`, `--teal-600` y `--focus-ring` coexisten con valores distintos.
- Breakpoints permitidos: `@media (max-width: 940px)`, `@media (max-width: 640px)`, `@media (max-width: 380px)` y `@media (max-width: 360px)`.
- Animaciones de entrada con `.reveal` y `.reveal-delay-1..6`; no crear sistemas de animación paralelos.
- Toda animación nueva debe desactivarse en `@media (prefers-reduced-motion: reduce)`.
- Propiedades en el orden en que ya aparecen en el archivo (posición → layout → espaciado → tipografía → color → transición). Mantener consistencia local antes que imponer un orden nuevo.
- No usar `!important` salvo para utilidades de accesibilidad justificadas.

## Contenido

- Español para texto visible; inglés para nombres de tecnología, siglas y términos técnicos.
- CTAs y etiquetas en minúsculas con flecha `->` (`ver código ->`, `descargar CV (EN) ->`).
- Sin emojis en contenido editorial nuevo salvo los iconos ya usados en Toolkit.
- Fechas en formato legible en español (`marzo 2026 -> actualmente`) o año (`2025`); en el blog, `Intl.DateTimeFormat("es-GT")`.
- No inventar métricas, clientes, certificaciones, enlaces ni artículos. Si falta un dato: preguntar.
- Mantener bilingüismo solo donde ya existe (`/thanks`, skip-link).
- Los artículos del blog deben describir decisiones reales del proyecto o experiencia verificable del autor.

## Blog

- Frontmatter obligatorio: `title`, `description`, `pubDate`, `tags`; opcionales: `updatedDate`, `cover`, `coverAlt`, `draft`.
- Las portadas usan Cloudinary y `coverAlt` descriptivo; si no hay portada, la tarjeta se renderiza sin imagen.
- Un artículo en `draft: true` queda fuera del índice, del sitemap y del RSS, pero se genera en `dist/`. No lo uses para contenido que no deba publicarse en absoluto.
- El slug es el nombre del archivo: cambiarlo rompe la URL publicada y las referencias del feed.
- Los enlaces internos del artículo usan rutas absolutas (`/blog/`, `/#proyectos`).

## Accesibilidad (aplicada al escribir código)

- HTML semántico primero: `<section>`, `<article>`, `<nav>`, `<main>`, `<footer>`, `<details>`, `<dialog>`.
- `alt` descriptivo en imágenes con contenido; `alt=""` explícito en decorativas.
- `aria-label` en enlaces cuyo texto no describe el destino (por ejemplo, descargas del Toolkit).
- Todo control interactivo debe ser alcanzable con teclado y mostrar foco visible.
- No eliminar `:focus-visible` sin sustituto.
- Contraste mínimo 4.5:1 en texto normal sobre fondos claros.

## Git

- Formato: Conventional Commits (`tipo(ámbito): resumen`), con una o dos frases sobre el motivo del cambio cuando haga falta cuerpo.
- Un commit = un propósito. No incluir `dist/`, `.astro/` ni `node_modules/`.
- No añadir firmas, pies ni trailers de herramientas de IA en los mensajes (`AGENTS.md`, `pnpm-workspace.yaml` no aplican aquí; la regla vive en `.ai/agents/AGENTS.md`).
- `main` publica en producción de inmediato tras pasar el workflow.
- No hacer `commit`, `push` ni force-push sin pedido explícito.

## Definición de terminado

1. `pnpm check` sin errores, warnings ni hints.
2. `pnpm build` correcto si el cambio afecta render, contenido, assets, estilos o configuración.
3. `pnpm check:links` sin roturas y `pnpm test:e2e` en verde si cambió markup, rutas o comportamiento.
4. Diff revisado: sin archivos generados, sin cambios colaterales, sin secretos.
5. Documentación actualizada en `.ai/` si cambió una decisión o un invariante.
6. Reporte final con comandos ejecutados y limitaciones.

## Ejemplos reales de incumplimiento detectado

| Caso | Archivo | Estándar afectado |
|---|---|---|
| 5 ejemplos SQL, SEO, markup, JS y CSS en 628 líneas | `toolkit/sql.astro` | Separación datos/presentación |
| Estilos de página en `<style>` local | `toolkit/sql.astro`, `thanks.astro`, `404.astro`, `blog/*` | Excepción permitida, no extender |
| Dos manifests idénticos | `public/` | Duplicación |
| `--gray-400` sobre fondos claros | `global.css` | Contraste (corregido: hoy solo sobre fondos oscuros) |
| Selectores de elemento (`nav`, `footer`) que alcanzaban HTML de página | `global.css` | Especificidad y encapsulación (corregido con `.site-nav` y `.site-footer`) |

## Reglas

- `strict: true` es intocable; prohibido `any`, `@ts-ignore` y `@ts-expect-error` para silenciar errores reales.
- No añadas bloques `<style>` locales nuevos; las excepciones existentes no son precedente.
- No introduzcas breakpoints fuera de 940, 640, 380 y 360 px.
- No reformatees archivos completos ni reordenes CSS ajeno al cambio.
- No edites `dist/`, `.astro/` ni `node_modules/`.
- No hagas commit ni push sin pedido explícito.

## Riesgos conocidos

- No hay linter ni formateador configurado. El estilo depende de disciplina y revisión.
- `global.css` es grande; el riesgo de duplicar reglas es alto.
- La documentación no se valida automáticamente: puede desincronizarse del código.

## Control exclusivo del repositorio

Los agentes pueden analizar, editar y validar el proyecto, pero no administran su publicación.

Está prohibido ejecutar sin pedido explícito:

- commits locales;
- push o pull;
- creación o cambio de ramas;
- merge, rebase, cherry-pick o reset;
- pull requests;
- despliegues;
- autenticación de GitHub.

El propietario revisa el árbol de trabajo y decide cuándo y cómo publicar los cambios.

Las acciones Git permitidas son exclusivamente de lectura:
`status`, `diff`, `diff --check`, `log`, `show` y `ls-files`.

## Recomendaciones futuras

- Declarar Prettier como devDependency con configuración explícita si se quiere formato determinista.
- Incorporar una checklist de PR basada en `REVIEW_TEMPLATE.md`.
- Añadir una verificación automática de documentación (enlaces relativos y conteos) si el conjunto `.ai/` sigue creciendo.
