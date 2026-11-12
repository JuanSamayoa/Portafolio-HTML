# STANDARDS — Estándares de código y contribución

## Objetivo

Definir reglas concretas y verificables para escribir código, contenido y commits coherentes con el repositorio, de modo que dos agentes distintos produzcan cambios compatibles.

## Alcance

Todo el código de `src/`, configuración de raíz, assets de `public/` y mensajes de commit. Los criterios visuales están en `UX_UI.md`; los de seguridad en `SECURITY.md`.

## Estándares de archivos y nombres

| Elemento | Convención | Ejemplo real |
|---|---|---|
| Componente de sección | `PascalCase.astro` | `Certifications.astro`, `CertModal.astro` |
| Página | `kebab-case.astro` o nombre corto | `thanks.astro`, `toolkit/sql.astro` |
| Dato | `camelCase.ts` | `personal.ts`, `certifications.ts` |
| Tipo | `PascalCase` en `portfolio.ts` | `PersonalInfo`, `Certification`, `CertificationCategory` |
| Constante exportada | `camelCase` con sufijo descriptivo | `personalInfo`, `projectsData`, `allCertificationsData` |
| Clase CSS | `kebab-case` plana, prefijada por sección | `.impact-card`, `.cert-modal-title`, `.sql-example-card` |
| Token CSS | `--familia-tono` | `--teal-400`, `--gray-900`, `--focus-ring` |
| Ancla de sección | `id` corto en español | `#impacto`, `#casos`, `#habilidades` |
| Atributo de datos JS | `data-*` en kebab-case | `data-copy`, `data-close` |

## TypeScript

- `strict: true` es obligatorio (`tsconfig.json`). No usar `any`, `@ts-ignore` ni `@ts-expect-error` para silenciar errores reales.
- Tipar los datos con las interfaces existentes; si se requiere un campo nuevo, se añade al tipo **y** a los datos en el mismo cambio.
- Preferir `interface` para contratos de datos y `type` para uniones (`CertificationCategory`).
- En frontmatter de `.astro`, declarar `interface Props` y desestructurar `Astro.props` con valores por defecto cuando existan (`Layout.astro`).
- Evitar lógica de negocio en el componente: cálculo de vistas derivadas en `src/data`, como `featuredCertifications`.

## Componentes Astro

- Un componente = una sección o una pieza de UI con nombre propio. No crear componentes "contenedor" genéricos sin necesidad.
- Orden del archivo: frontmatter (`imports` → tipos → constantes → datos) → markup → `<script>` → `<style>` (solo si está justificado).
- Importar primero módulos de Astro (`astro:assets`), luego internos, luego tipos.
- Usar `<Image>` de `astro:assets` para imágenes de contenido, siempre con `width`, `height` y `alt`.
- Usar `class:list` para composición condicional de clases (patrón ya presente en `Projects.astro` y `Certifications.astro`), no concatenación manual de strings.
- Pasar JSON-LD con `set:html={JSON.stringify(schemaOrg)}` en un `<script type="application/ld+json" is:inline>`.
- Datos hacia el cliente mediante `<script type="application/json" is:inline>` + `JSON.parse` (patrón de `toolkit/sql.astro`), nunca interpolando strings en JS.

### Ejemplo real aceptado

```astro
---
import { Image } from "astro:assets";
import { projectsData } from "../data/projects";

const title = "Juan Samayoa | QA Automation Engineer";
---

<article class:list={["project-card reveal", `reveal-delay-${(index % 3) + 1}`]}>
  <Image src={project.image} alt={`Vista previa de ${project.title}`} width={600} height={340} loading="lazy" />
</article>
```

## CSS

- Todo estilo de sección va en `src/styles/global.css`, en el bloque correspondiente al orden narrativo del sitio.
- Excepciones permitidas: `CertModal.astro`, `thanks.astro`, `404.astro`, `toolkit/sql.astro` (UI encapsulada). No añadir nuevas excepciones sin motivo.
- Reutilizar tokens de `:root`; no introducir hex nuevos si existe token equivalente. Hoy `--teal-400` y `--teal-600` comparten valor `#0f6e56`.
- Breakpoints permitidos: `@media (max-width: 940px)` y `@media (max-width: 640px)`.
- Animaciones de entrada con `.reveal` y `.reveal-delay-1..6`; no crear sistemas de animación paralelos.
- Propiedades en el orden en que ya aparecen en el archivo (posición → layout → espaciado → tipografía → color → transición). Mantener consistencia local antes que imponer un orden nuevo.
- No usar `!important` salvo para utilidades de accesibilidad justificadas.

## Contenido

- Español para texto visible; inglés para nombres de tecnología, siglas y términos técnicos.
- CTAs y etiquetas en minúsculas con flecha `->` (`ver código ->`, `descargar CV (EN) ->`).
- Sin emojis en contenido editorial nuevo salvo los iconos ya usados en Toolkit.
- Fechas en formato legible en español (`marzo 2026 -> actualmente`) o año (`2025`).
- No inventar métricas, clientes, certificaciones ni enlaces. Si falta un dato: preguntar.
- Mantener bilingüismo solo donde ya existe (`/thanks`, skip-link).

## Accesibilidad (aplicada al escribir código)

- HTML semántico primero: `<section>`, `<article>`, `<nav>`, `<main>`, `<footer>`, `<details>`, `<dialog>`.
- `alt` descriptivo en imágenes con contenido; `alt=""` explícito en decorativas.
- `aria-label` en enlaces cuyo texto no describe el destino (por ejemplo, descargas del Toolkit).
- Todo control interactivo debe ser alcanzable con teclado y mostrar foco visible.
- No eliminar `:focus-visible` sin sustituto.

## Git

- Commits breves y específicos; el historial mezcla inglés y español (`FIX: Local images`, `Corrected toolkit`).
- Prefijos aceptados por el historial: `FIX:`, `New Version:`, o verbo en pasado.
- Un commit = un propósito. No incluir `dist/`, `.astro/` ni `node_modules/`.
- No hacer `commit`, `push` ni force-push sin pedido explícito.
- `main` publica en producción de inmediato.

## Definición de terminado

1. `pnpm check` sin errores (el hint preexistente de `toolkit/sql.astro` es aceptable).
2. `pnpm build` correcto si el cambio afecta render, assets, estilos o configuración.
3. Diff revisado: sin archivos generados, sin cambios colaterales, sin secretos.
4. Documentación actualizada en `.ai/` si cambió una decisión o un invariante.
5. Reporte final con comandos ejecutados y limitaciones.

## Ejemplos reales de incumplimiento detectado

| Caso | Archivo | Estándar afectado |
|---|---|---|
| `allSqlCode` se usa dentro de un `<script>` inline y `astro check` lo marca como no leído | `toolkit/sql.astro` | Tipado / limpieza (hint, no error) |
| 5 ejemplos SQL, SEO, markup, JS y CSS en 617 líneas | `toolkit/sql.astro` | Separación datos/presentación |
| Estilos de página en `<style>` local | `toolkit/sql.astro`, `thanks.astro`, `404.astro` | Excepción permitida, no extender |
| Dos manifests idénticos | `public/` | Duplicación |
| Assets referenciados que no existen | `Toolkit.astro`, `thanks.astro`, `404.astro` | Integridad de referencias |

## Reglas

- `strict: true` es intocable; prohibido `any`, `@ts-ignore` y `@ts-expect-error` para silenciar errores reales.
- No añadas bloques `<style>` locales nuevos; las cuatro excepciones existentes no son precedente.
- No introduzcas breakpoints fuera de 940 px y 640 px.
- No reformatees archivos completos ni reordenes CSS ajeno al cambio.
- No edites `dist/`, `.astro/` ni `node_modules/`.
- No hagas commit ni push sin pedido explícito.

## Riesgos conocidos

- No hay linter ni formateador configurado. `prettier` está presente en `node_modules/.bin` pero no declarado en `package.json` (origen transitivo sin verificar). El estilo depende de disciplina y revisión.
- `global.css` es grande; el riesgo de duplicar reglas es alto.
- La ausencia de tests hace que los estándares dependan de `check`/`build` y de revisión humana.

## Control exclusivo del repositorio

Los agentes pueden analizar, editar y validar el proyecto, pero no administran su publicación.

Está prohibido ejecutar:

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
- Añadir un script de verificación de enlaces internos y assets inexistentes.
- Incorporar una checklist de PR basada en `REVIEW_TEMPLATE.md`.
