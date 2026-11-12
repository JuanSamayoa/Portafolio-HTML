# CODEX — Diferencias para Codex

> Protocolo común y límites: [`AGENTS.md`](./AGENTS.md). Reglas: `../PRINCIPLES.md` y `../STANDARDS.md`.

## Diferencias de esta herramienta

- **Trabaja por parches pequeños.** Reemplazos exactos, un propósito por cambio, sin reescrituras ni reformateos.
- **Nada interactivo.** No ejecutes comandos que esperen confirmación; usa flags explícitos.
- **No dejes procesos en segundo plano.** `pnpm dev` no es necesario para validar; usa `pnpm check` y `pnpm build`.
- **Conserva exit codes** y no filtres la salida perdiendo el estado del comando.
- **No ejecutes `git commit`, `push`, `reset` ni `checkout` destructivo** sin autorización.

## Parada específica

Si el parche requiere crear archivos nuevos no solicitados, tocar configuración de despliegue o resolver una contradicción documental, detente y reporta.

## Validación

```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```
