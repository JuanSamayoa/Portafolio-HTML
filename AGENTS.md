# AGENTS.md — Punto de entrada

> **Documentación canónica: [`.ai/`](./.ai/).** Este archivo no define reglas propias; solo indica qué leer según la tarea. Si algo aquí contradice a `.ai/`, prevalece `.ai/`.

## Qué es este repositorio

Portafolio profesional **estático** de Juan Samayoa (QA Automation Engineer, Guatemala). Astro 7 + TypeScript strict, sin backend ni base de datos. Única dependencia de runtime: `astro`. Producción: https://juan-samayoa.is-a.dev, publicada desde `main` por GitHub Pages.

## Lectura por tarea

| Tarea | Documentos |
|---|---|
| Cualquier cambio | [`IDENTITY.md`](./.ai/IDENTITY.md) → [`PRINCIPLES.md`](./.ai/PRINCIPLES.md) → [`agents/AGENTS.md`](./.ai/agents/AGENTS.md) |
| Componentes, datos, scripts | [`ARCHITECTURE.md`](./.ai/ARCHITECTURE.md) → [`FRONTEND.md`](./.ai/FRONTEND.md) → [`PROJECT_MAP.md`](./.ai/PROJECT_MAP.md) |
| Estilos, copy, jerarquía | [`UX_UI.md`](./.ai/UX_UI.md) → [`STANDARDS.md`](./.ai/STANDARDS.md) |
| Accesibilidad | [`ACCESSIBILITY.md`](./.ai/ACCESSIBILITY.md) |
| Metadatos, indexación | [`SEO.md`](./.ai/SEO.md) |
| CSP, cabeceras, formulario | [`SECURITY.md`](./.ai/SECURITY.md) |
| Peso, fuentes, imágenes | [`PERFORMANCE.md`](./.ai/PERFORMANCE.md) |
| Entender una decisión | [`DECISIONS.md`](./.ai/DECISIONS.md) |
| Elegir qué mejorar | [`ROADMAP.md`](./.ai/ROADMAP.md) |
| Especificar o revisar | [`TASK_TEMPLATE.md`](./.ai/TASK_TEMPLATE.md) · [`REVIEW_TEMPLATE.md`](./.ai/REVIEW_TEMPLATE.md) |

Guías por herramienta: [`agents/CLAUDE.md`](./.ai/agents/CLAUDE.md), [`agents/CODEX.md`](./.ai/agents/CODEX.md), [`agents/FREEBUFF.md`](./.ai/agents/FREEBUFF.md), [`agents/OPENCODE.md`](./.ai/agents/OPENCODE.md), [`agents/ANTIGRAVITY.md`](./.ai/agents/ANTIGRAVITY.md). Todas remiten al protocolo común.

## Comandos, límites y parada

Lista canónica de comandos, archivos que no se modifican, validaciones obligatorias, criterios de parada y formato de reporte: [`agents/AGENTS.md`](./.ai/agents/AGENTS.md).

No existe suite de tests: la validación real es `pnpm check` y `pnpm build`, documentada en ese archivo.
