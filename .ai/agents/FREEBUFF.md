# FREEBUFF — Diferencias para Freebuff

> Protocolo común y límites: [`AGENTS.md`](./AGENTS.md). Reglas: `../PRINCIPLES.md` y `../STANDARDS.md`.

## Diferencias de esta herramienta

- **Terminal en Windows con bash.** Sintaxis POSIX (`ls`, `mv`, `rm`, `/dev/null`), rutas con `/`; nunca `cmd.exe` ni PowerShell.
- **Agrupa llamadas.** Lee varios archivos por lote y aplica todos los edits conocidos juntos; cada ronda consume contexto.
- **Conserva exit codes** con `pnpm check; echo "CHECK_EXIT=$?"` y `pnpm build; echo "BUILD_EXIT=$?"`; no canalices perdiendo el estado.
- **No dejes servicios en segundo plano.** Usa `pnpm build`/`pnpm preview`; no es necesario `pnpm dev` para validar.
- **No ejecutes comandos destructivos** (`git push`, `reset`, `clean -fdx`, borrados fuera del proyecto).
- **Mide antes de afirmar.** Sin cifras del build o de una medición, no declares mejoras de rendimiento.

## Parada específica

Detente si el pedido requiere instalar paquetes, modificar configuración del sistema o publicar cambios.

## Validación

```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```
