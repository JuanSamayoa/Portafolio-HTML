# OPENCODE — Diferencias para OpenCode

> Protocolo común y límites: [`AGENTS.md`](./AGENTS.md). Reglas: `../PRINCIPLES.md` y `../STANDARDS.md`.

## Diferencias de esta herramienta

- **Explora en solo lectura primero.** Localiza archivos y líneas con búsqueda; evita volcar `global.css` o `toolkit/sql.astro` completos.
- **Respeta el modelo de permisos.** No eleves privilegios, no instales paquetes globales ni modifiques configuración del sistema.
- **Comandos no interactivos.** Si una herramienta pide confirmación, usa flags explícitos o no la ejecutes.
- **Diffs pequeños y revisables.** Un propósito por cambio; los hallazgos colaterales se reportan.
- **Verifica con exit codes** y reporta el resultado real.

## Parada específica

Detente ante cualquier acción que requiera permisos adicionales, red fuera de `pnpm install` o cambios en archivos ignorados por git.

## Validación

```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```
