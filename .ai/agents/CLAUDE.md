# CLAUDE — Diferencias para Claude Code

> Protocolo común y límites: [`AGENTS.md`](./AGENTS.md). Reglas: `../PRINCIPLES.md` y `../STANDARDS.md`.

## Diferencias de esta herramienta

- **Planifica antes de editar** si el cambio cruza más de un archivo o toca `Layout.astro`, `global.css` o `astro.config.mjs`. Para un fix puntual, actúa directo.
- **Edita con reemplazos exactos.** No reescribas archivos completos ni reordenes CSS; `global.css` tiene 1,978 líneas y el diff debe ser revisable.
- **No uses memoria del framework como evidencia.** Comprueba versiones y comportamiento en `package.json` y en el build.
- **Contexto limitado:** la documentación de `.ai/` es la memoria del proyecto. Si una decisión no está en `DECISIONS.md`, trátala como no tomada.
- **No asumas capacidades de subagentes, hooks o integraciones** que el repositorio no configura.

## Parada específica

Detente antes de aplicar un plan que requiera dependencias nuevas, cambios de arquitectura o modificar más de 4 archivos no relacionados. Presenta el plan y espera confirmación.

## Validación

```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```

Reporta siempre ambos exit codes cuando se ejecuten.
