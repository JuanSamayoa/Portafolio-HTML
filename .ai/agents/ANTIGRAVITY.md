# ANTIGRAVITY — Diferencias para Antigravity CLI

> Protocolo común y límites: [`AGENTS.md`](./AGENTS.md). Reglas: `../PRINCIPLES.md` y `../STANDARDS.md`.

## Diferencias de esta herramienta

- **Planifica antes de ejecutar.** Presenta objetivo, archivos, riesgo y verificación cuando el cambio cruce archivos o toque configuración.
- **Ejecuta con alcance cerrado.** No añadas pasos no pedidos; declara la suposición cuando el pedido sea ambiguo.
- **Sin comandos interactivos ni procesos persistentes.**
- **No uses `sudo`, instalaciones globales ni cambios fuera del proyecto.**
- **Verifica con exit codes** y no atribuyas resultados que no ejecutaste.

## Parada específica

Detente ante decisiones de producto (nueva dependencia, backend, rediseño), contenido que solo el autor puede aportar, o contradicciones entre `.ai/` y el código.

## Validación

```bash
pnpm check; echo "CHECK_EXIT=$?"
pnpm build; echo "BUILD_EXIT=$?"
```
