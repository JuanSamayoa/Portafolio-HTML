# IDENTITY — Identidad técnica del proyecto

## Objetivo

Definir qué es este repositorio a nivel técnico y establecer **cómo debe razonar cualquier agente de IA** que trabaje en él, para que sus decisiones sean coherentes con la naturaleza real del proyecto y no con supuestos genéricos de "sitio web moderno".

## Alcance

Aplica a todo el repositorio y a cualquier agente (Claude Code, Codex, OpenCode, Freebuff, Antigravity CLI o futuros). Es el primer documento que debe leerse, antes de `MISSION.md` y `ARCHITECTURE.md`.

## Identidad

**Este proyecto es un portafolio profesional estático, de una sola página, con contenido controlado por el autor.** No es una aplicación web, no es un producto SaaS, no es un CMS y no es una plataforma multi-usuario.

| Rasgo | Evidencia en el código |
|---|---|
| **Estático por defecto** | `astro.config.mjs` sin adapter; build genera `dist/` con 4 páginas HTML; no hay rutas de API, middleware ni SSR |
| **Dependencia mínima** | `dependencies` contiene solo `astro` (`package.json`) |
| **Contenido dirigido por datos** | `src/data/personal.ts`, `projects.ts`, `certifications.ts` tipados por `src/types/portfolio.ts` |
| **Sin framework de cliente** | Interactividad con DOM nativo en `Layout.astro`, `Certifications.astro`, `CertModal.astro` y `toolkit/sql.astro`; el build compila esos scripts a 4 módulos de 0.5–1.05 KB (3.3 KB en total) |
| **CSS centralizado** | Un único `src/styles/global.css` con tokens y reglas de todas las secciones; ≈25 KB compilados |
| **Seguridad por defecto** | CSP en meta + `public/_headers`, `security.checkOrigin: true`, `sw.js` con validación de origen, `robots.txt` con bloqueo de crawlers de IA |
| **SEO explícito** | Cada página construye su `title`, `description`, `canonicalUrl`, `previewImage` y `schemaOrg` y los pasa al Layout |
| **Español primero** | `<html lang="es">`, `og:locale = es_GT`, copy visible en español, bilingüe solo en `/thanks` y el skip-link |
| **Marca personal** | Todo el contenido describe a Juan Samayoa (QA Automation Engineer, Guatemala); no hay contenido genérico de plantilla |

### Identidad en una frase

> Un sitio de marca personal que debe ser **rápido, seguro, indexable, accesible y trivial de mantener**, donde el contenido es el activo principal y el código existe solo para presentarlo.

## Cómo deben razonar los agentes

### Jerarquía de prioridades

Cuando dos objetivos entren en conflicto, decide en este orden:

1. **Veracidad del contenido.** Nunca inventes logros, métricas, fechas, clientes, certificaciones ni enlaces. Si falta un dato, detente y pregunta; no lo rellenes.
2. **Integridad del build.** `pnpm check` y `pnpm build` deben pasar. Un cambio que rompe el build no es una mejora.
3. **Seguridad, SEO y accesibilidad.** No introduzcas orígenes externos sin CSP, no rompas canónicas ni anclas, no elimines `alt`, `aria-label` ni foco visible.
4. **Mantenibilidad.** Prefiere editar lo existente, respetar la separación datos/presentación y mantener diffs pequeños.
5. **Estética y novedad.** Última prioridad. No rediseñes ni refactorices lo que no se pidió.

### Reglas de razonamiento

- **Razona desde el código, no desde la memoria.** Antes de afirmar cómo funciona algo, búscalo en el repositorio. Si no está, no existe.
- **Marca lo desconocido.** Usa `PENDIENTE DE DEFINICIÓN:` cuando falte evidencia (por ejemplo: intención comercial, métricas de tráfico, propiedad de imágenes, motivo de un archivo redundante). No conviertas una suposición en documentación.
- **Distingue estado de intención.** "El service worker no se registra" es un hecho; "el autor planea activar la PWA" sería una invención. Documenta el hecho.
- **Separa lo observado de lo recomendado.** Todo lo que no está implementado va en `ROADMAP.md` o en "Recomendaciones futuras", nunca descrito como funcionalidad existente.
- **Piensa en el autor, no en el usuario anónimo.** Este sitio representa a una persona real; un dato incorrecto tiene coste reputacional.
- **No optimices por líneas de código.** Optimiza por claridad, coherencia visual y bajo riesgo de regresión.
- **Un cambio, un propósito.** Si detectas un problema colateral, documéntalo; no lo arregles silenciosamente en el mismo diff.

### Cómo debe sonar una decisión

Toda propuesta debe poder expresarse así:

> **Contexto:** (qué existe hoy, con evidencia) → **Decisión:** (qué se hará) → **Consecuencia:** (qué mejora y qué se sacrifica) → **Verificación:** (comando o inspección que lo demuestra).

Si no puedes completar las cuatro partes, aún no tienes una decisión: tienes una idea.

## Ejemplos reales de aplicación

1. **Ante "mejora el rendimiento":** el proyecto no tiene JS de framework, pero carga 3 familias tipográficas desde Google Fonts y todas las imágenes desde Cloudinary. La respuesta correcta empieza midiendo (Lighthouse en producción) y proponiendo cambios en `Layout.astro` y `src/data/*.ts`, no añadiendo un bundler.
2. **Ante "añade un blog":** implicaría un modelo de contenido y nuevas rutas; contradice el alcance de una sola página y la restricción de dependencia mínima. Debe responderse con una pregunta de alcance, no con una implementación.
3. **Ante "arregla el enlace del PDF":** el enlace `/toolkit/playwright-quick-start.pdf` no tiene archivo en `public/toolkit/`. Hay dos salidas legítimas (añadir el PDF o quitar el enlace); elegir una requiere decisión del autor.

## Reglas

- Lee `.ai/` antes de actuar; no sustituyas esta documentación por memoria del framework.
- No inventes datos, métricas ni funcionalidades; marca `PENDIENTE DE DEFINICIÓN:` cuando falte evidencia.
- No añadas dependencias, backend ni tooling sin aprobación explícita.
- Mantén el cambio dentro del alcance pedido y reporta los hallazgos colaterales sin corregirlos.
- Verifica con `pnpm check` y `pnpm build` cuando el cambio lo requiera, y reporta el resultado real.
- Responde en español y conserva el tono del contenido existente.

## Riesgos conocidos

- **Deriva documental:** existen `AGENTS.md`, `CLAUDE.md` y `CODEX.md` en la raíz, creados antes de `.ai/`. Si se editan por separado, la fuente de verdad se duplica. Mitigación: la raíz debe apuntar a `.ai/`.
- **Sobre-ingeniería:** la pila es tan simple que un agente puede sentirse tentado a introducir frameworks, tests o tooling innecesario. Es el riesgo principal de este repositorio.
- **Contenido no verificable por código:** las métricas del hero ("3+ años", "47+ tests") y de impacto ("30%", "25%") son texto estático; el código no puede validar su exactitud.
- **Identidad personal expuesta:** email, foto, CVs y redes son datos reales; cualquier cambio debe tratarse como publicación en producción.

## Recomendaciones futuras

- Convertir `.ai/` en el único origen de documentación y reducir los archivos de raíz a punteros.
- Añadir una medición objetiva (Lighthouse/WebPageTest) al repositorio para poder afirmar mejoras de rendimiento con datos.
- Definir explícitamente en `PROJECT_CONTEXT.md` las metas comerciales del sitio cuando el autor las concrete (hoy `PENDIENTE DE DEFINICIÓN`).
